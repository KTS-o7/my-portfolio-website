+++
title = "Designing a downloader CLI that is also a library"
date = 2026-08-30T00:00:00+05:30
draft = false
math = false
author = "Krishnatejaswi S"
description = "How I restructured an image downloader around an importable async core, typed errors, and a JSONL manifest that doubles as an image-text dataset — and deprecated the old format without breaking anyone."
tags = ["python", "open-source", "data-engineering", "machine-learning", "cli"]
+++

Make a CLI a small wrapper over a library when users may need it in a web service, notebook or scheduled job. The library should own the work. The CLI should only parse input and show output.

I applied this to [better_bing_image_downloader](https://github.com/KTS-o7/better_bing_image_downloader). It changed the project from a script-like tool into an importable downloader with machine-readable dataset records.

## Keep the CLI thin

The `bbid` command parses arguments and calls the library. It does not contain download logic. If code cannot be reached through an import, it does not belong in the CLI.

The library exposes a `Downloader` class. It owns the network session, engine registry and lifecycle hooks. It also keeps short-lived search tokens with the request that created them:

```python
from better_bing_image_downloader import Downloader

dl = Downloader()
dl.on_image = lambda img: print(f"saved {img.path.name} ({img.size_bytes} bytes)")
dl.on_error = lambda url, exc: print(f"failed {url}: {exc}")

result = dl.search("red panda", limit=10, engine="duckduckgo")
print(result.count, "saved to", result.output_dir)
```

`search()` returns a `Result`: saved `ImageResult` values, errors, a skip count and whether the engine returned candidates. It does not print unless you add a hook. The old module-level `downloader()` function calls `Downloader`, so both interfaces use one code path.

Do not rewrite working download code just to add an async API. `search_async()` runs the existing `search()` method in a worker thread with `asyncio.to_thread()`:

```python
result = await dl.search_async("red panda", limit=10)
```

This does not block the event loop. It adds no dependency and reuses the tested code path. For this downloader, that is a better trade than a second implementation.

## Return typed errors

Do not return `False` when a caller needs to decide what failed. A network error and invalid image data need different handling. The library uses typed errors:

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

All four errors extend `ImageSaveError`, so existing handlers still work. The error type also appears in `Result.errors` and the manifest. Dataset tooling can count failure types without parsing log text.

## Store provenance with each image

Images alone are not a training dataset. You also need the source URL, query, engine and result status. A directory of numbered files cannot answer those questions.

`search(manifest=True)` writes JSON Lines with one record for every download attempt:

```json
{"index": 1, "status": "ok", "url": "https://example.com/red-panda.jpg", "file": "red panda_1.jpg", "md5": "a1b2c3d4e5f60718293a4b5c6d7e8f90", "error": null, "engine": "duckduckgo", "query": "red panda", "source_page": "https://duckduckgo.com/?q=red+panda&iax=images&ia=images", "downloaded_at": "2026-06-13T15:30:42Z"}
```

Three decisions mattered here:

- JSON Lines lets you stream, shard and load records one at a time. A crash leaves a usable partial file.
- records include successes, failures and skips. A failure has its error type. A skip has its reason.
- `source_page` records the search-results page that supplied the image URL.

The record format is defined by a JSON Schema in the repository. Treat it as a public contract.

## Keep the image-text pair

Search engines often provide title or alt text with an image. Keep it. The manifest has a `caption` field and `ImageResult.caption` exposes it through the API.

This text is noisy. It may be SEO text or a filename. It is still useful as a weak label. You can filter, deduplicate or replace it later. You cannot reliably recreate it after download.

## Deprecate the old manifest safely

The old `_manifest.json` stored a flat filename-to-URL map. People had built tools around it, so removal needed a migration path.

Use this sequence:

1. Continue to write the old file for existing users.
2. Raise a `DeprecationWarning` that names `manifest=True` and the removal version.
3. Document the JSON Lines output as the replacement.
4. Remove the old format only in the next major release.

The same approach applies to renamed arguments and removed features. Deprecation is part of the product.

## What to do first

Start with an importable core. Keep the CLI small. Store provenance and captions with every image. Treat error types and deprecation warnings as public API.
