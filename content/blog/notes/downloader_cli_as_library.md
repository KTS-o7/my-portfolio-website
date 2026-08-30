+++
title = "Designing a Downloader CLI That Is Also a Library"
date = 2026-08-30T00:00:00+05:30
draft = false
math = false
author = "Krishnatejaswi S"
description = "How I restructured an image downloader around an importable async core, typed errors, and a JSONL manifest that doubles as an image-text dataset — and deprecated the old format without breaking anyone."
tags = ["python", "open-source", "data-engineering", "machine-learning", "cli"]
+++

A GitHub issue on my image downloader project asked for something I should have built from day one: "can I use this from a web service without subprocess-ing the CLI?" The honest answer at the time was no. The old code called `input()`, called `sys.exit()` deep in a helper, and set a global socket timeout as a side effect of being imported. It was a script wearing a package's clothes.

This post is about what I changed in [better_bing_image_downloader](https://github.com/KTS-o7/better_bing_image_downloader) to make it a real library, and why the manifest file — not the images — turned out to be the actual product.

## The CLI is a thin shell, and that's the point

The rule I settled on: the `bbid` command parses arguments and calls the library. Nothing else lives in the CLI. If a piece of logic can't be reached from an `import`, it doesn't exist.

The library core is a `Downloader` class with zero-arg construction. It owns a session (cookie jar plus opener), an engine registry, and lifecycle hooks. Search engines' short-lived request tokens, such as DuckDuckGo's `vqd`, are captured and passed with the query that issued them rather than treated as cookies:

```python
from better_bing_image_downloader import Downloader

dl = Downloader()
dl.on_image = lambda img: print(f"saved {img.path.name} ({img.size_bytes} bytes)")
dl.on_error = lambda url, exc: print(f"failed {url}: {exc}")

result = dl.search("red panda", limit=10, engine="duckduckgo")
print(result.count, "saved to", result.output_dir)
```

`search()` returns a `Result` value object — the list of saved `ImageResult`s, the errors, a `skipped` count, whether the backend returned zero candidates at all. No printing unless you hook it. The old module-level `downloader()` function still works, but internally it's a wrapper over `Downloader`, so there's exactly one code path to test.

Async support was the trap I almost fell into. The temptation is to rewrite everything on `aiohttp`. Instead, `search_async()` runs the existing synchronous `search()` in a worker thread via `asyncio.to_thread()`:

```python
result = await dl.search_async("red panda", limit=10)
```

Is it "true" async I/O? No. Does it not block the event loop, add zero dependencies, and reuse the entire tested code path? Yes. For a downloader whose concurrency already comes from a worker thread pool, that's the right trade.

## Typed errors, not exceptions as control flow

The old failure model was: `save_image` returns `False`, and the caller guesses why. Network blip and "the server sent me an HTML error page" looked identical. In v3.4.0 I made failures typed:

```python
from better_bing_image_downloader import (
    Downloader, NetworkError, InvalidImageError,
    DuplicateImageError, WriteError,
)

def classify(url, exc):
    if isinstance(exc, NetworkError):
        retry_later(url)
    elif isinstance(exc, InvalidImageError):
        blacklist(url)          # server lied about content type
    elif isinstance(exc, DuplicateImageError):
        pass                    # MD5 already seen, this is fine
    elif isinstance(exc, WriteError):
        alert()                 # disk full — stop everything

dl.on_error = classify
```

All four subclass a base `ImageSaveError`, so existing `except ImageSaveError` code keeps working — Liskov substitution as a migration strategy. The important design property: the error type is data. It flows into `Result.errors` and, as you'll see below, into the manifest, where downstream tooling can aggregate failure modes across a million-image run without parsing log strings.

## The manifest is the real product

If you're downloading images for ML training, the JPEGs are almost worthless on their own. What you need is provenance: which URL did this file come from, under which query, from which engine, and did it actually succeed? A folder full of `Image_1.jpg` … `Image_4000.jpg` answers none of that.

So in v3.5.0, `search(manifest=True)` writes a JSONL file with one record per download *attempt* — successes, failures, and skips:

```json
{"index": 1, "status": "ok", "url": "https://example.com/red-panda.jpg", "file": "red panda_1.jpg", "md5": "a1b2c3d4e5f60718293a4b5c6d7e8f90", "error": null, "engine": "duckduckgo", "query": "red panda", "source_page": "https://duckduckgo.com/?q=red+panda&iax=images&ia=images", "downloaded_at": "2026-06-13T15:30:42Z"}
```

Three decisions mattered here:

- **JSONL, not JSON.** One self-contained object per line means you can stream it, `grep` it, shard it, and load it with any data frame library. It also means a crash leaves a valid partial file — the writer is line-buffered and flushed after every record by default.
- **Attempts, not just successes.** `status` is `ok`, `error`, or `skipped`. A failure records the typed exception class name (`"NetworkError"`) in `error`; a skip records *why* (e.g. `"BelowMinDimension"` when the `min_dimension=512` filter rejects a thumbnail). "Why is my dataset smaller than expected" becomes a `jq` query instead of archaeology.
- **`source_page` is provenance.** It records the exact search-results page the image URL came from. When someone asks "where did this training data come from" — and someone always eventually asks — you have an answer per record, not a shrug.

The record format is pinned by a JSON Schema file in the repo, so it's a contract, not an accident of the current implementation.

## Captions: the manifest is already an image-text dataset

Search engines return a title/alt text with every image result. Throwing that away is leaving labels on the floor. Since v3.9.0, each manifest record carries a `caption` field with the engine's title text for that image, and `ImageResult.caption` exposes it in the API.

Is search-engine alt text a great caption? It's noisy — SEO junk, file names, occasional garbage. But it's a free weak label attached to every download, and weak labels are exactly what vision-language training pipelines are built to clean up. Filter, dedupe, re-caption with a model if you want — the point is the pairing is captured at acquisition time, when it's free, instead of reconstructed later, when it's impossible.

## Deprecating `_manifest.json` without breaking anyone

There was already a manifest before the JSONL one: `_manifest.json`, a flat `{filename: url}` dict that successive runs merged into. People had built tooling on it. I couldn't just delete it.

The playbook I followed, deprecated since v3.8.1 with removal slated for v4.0.0:

1. **Keep writing it.** The legacy format is still emitted by the legacy entry point. Nothing silently changes for existing users.
2. **Warn loudly.** Importing or triggering the legacy path emits a `DeprecationWarning` that names the replacement (`manifest=True`) and the removal version. Vague warnings get ignored; specific ones get acted on.
3. **Point at something better.** The deprecation message and docs both route to the JSONL export, which is a strict superset — the old filename→URL mapping is just the `file` and `url` fields of the `ok` records.
4. **Give a removal window measured in versions, not days.** A major-version boundary (4.0.0) is where breaking changes belong. Deprecating in a minor and removing in a patch is how you lose users' trust permanently.

The same discipline applied to the old `filter=` keyword (renamed to `image_filter=`, still works, warns) and the Selenium-based `multidownloader` (deprecated, removed at the same boundary). Deprecation is a feature you ship, not an apology you mutter.

## What I'd tell past me

The images were never the deliverable — the *dataset* was, and a dataset is bytes plus provenance. Build the manifest first, make the CLI a parasite on the library, and treat your error types and deprecation warnings as public API from day one, because your users already do.
