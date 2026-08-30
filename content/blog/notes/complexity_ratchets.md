+++
title = "Complexity Ratchets: Paying Down Tech Debt Without a Rewrite"
date = 2026-08-30T00:00:00+05:30
draft = false
math = false
author = "Krishnatejaswi S"
description = "A complexity ratchet is a CI check that fails only when code gets worse, not when it is merely bad. How we wired per-file complexity baselines into a monorepo and actually started paying the debt down."
tags = ["notes", "tech-debt", "ci", "code-quality", "refactoring"]
+++

I recently shipped a series of PRs adding cyclomatic-complexity ratchets to every service in a monorepo I work on — TypeScript on the frontend, Python on the backend, a couple of stragglers in between. The codebase is old enough that some files have functions with complexity scores in the 40s. Nobody wrote them badly on purpose; they grew one `if` at a time over three years of urgent features. The interesting problem was never measuring complexity. It was stopping it from getting worse without stopping the team from shipping.

## What a ratchet is

A ratchet is a mechanism that moves in one direction only. Applied to code quality, the idea is:

1. Record the current complexity of every file as a **baseline**, checked into the repo.
2. In CI, compute the complexity of every file the PR touches.
3. Fail the build only if a file is **worse than its baseline**, or if a **new** file exceeds a fixed threshold.
4. When a file's complexity drops, regenerate the baseline so the improvement is locked in. The baseline only ever ratchets down.

The crucial property: pre-existing mess is grandfathered in. A file with complexity 38 stays legal — until someone touches it and pushes it to 39. Then CI says no. You can extend a function, but you have to leave it no worse than you found it, which in practice means you either keep the change small or carve a piece out.

## Why the other approaches failed first

We tried the two obvious things before this. Both failed in predictable ways.

**Lint everything, hard.** We turned on `complexity: ["error", 10]` in ESLint and its Python equivalent across the board. CI immediately reported a few thousand violations in files nobody was touching. Within a week, teams were either adding `eslint-disable` comments wholesale or ignoring the red pipeline because "it's always red." A gate that fails on everything fails on nothing — it trains people to route around it, and worse, it makes every *legitimate* CI failure easier to dismiss.

**The big-bang refactor.** Before my time, there was a branch that was going to clean up the worst offender — a 2,000-line module everyone was afraid of. The branch lived for two months, diverged from main, accumulated merge conflicts, and was eventually abandoned. Rewrites and freeze-the-world refactors fail for structural reasons: the rest of the team doesn't stop shipping while you refactor, so you're chasing a moving target. The longer it takes, the further behind you fall. The morale cost is real too — nothing sours a team like watching two months of work get force-pushed into the void.

The ratchet works precisely because it makes no demands. It doesn't ask anyone to fix anything today. It just makes "slightly worse" no longer free.

## Implementation

The pieces are small. Per-language complexity measurement, a checked-in baseline file, and a CI script that diffs the two.

For TypeScript, ESLint's `complexity` rule gives you per-function scores; a short script walks the report and aggregates per file. For Python, `radon cc` (or `xenon` if you want a ready-made threshold checker) does the same. The baseline is a plain JSON file:

```json
{
  "threshold": 15,
  "files": {
    "services/api/orders/handler.py": 38,
    "web/src/checkout/cartReducer.ts": 22,
    "services/api/users/profile.py": 9
  }
}
```

The `threshold` applies to new files only. Existing files are governed by their recorded score. The CI check is roughly thirty lines of Python:

```python
#!/usr/bin/env python3
"""Complexity ratchet: fail if a file got worse than its baseline."""
import json, subprocess, sys

THRESHOLD_KEY = "threshold"

def measure() -> dict:
    # Per-language tools emit path -> score; normalize into one dict.
    out = {}
    radon = subprocess.run(
        ["radon", "cc", "services/", "-s", "-j"], capture_output=True, text=True
    )
    for path, blocks in json.loads(radon.stdout).items():
        out[path] = max(b["complexity"] for b in blocks)
    # ... same shape for eslint output on the TS side ...
    return out

def main() -> int:
    baseline = json.loads(open("complexity-baseline.json").read())
    threshold = baseline[THRESHOLD_KEY]
    known = baseline["files"]
    current = measure()

    failures = []
    for path, score in current.items():
        allowed = known.get(path, threshold)  # new file? use threshold
        if score > allowed:
            failures.append(f"{path}: {score} > {allowed}")
        elif score < allowed:
            print(f"improved: {path}: {allowed} -> {score} (update baseline)")

    if failures:
        print("Complexity ratchet failed:\n" + "\n".join(failures))
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

A separate `--write` mode regenerates the baseline. You run it locally after a cleanup, commit the JSON alongside the refactor, and the improvement becomes permanent — no future PR can silently undo it.

Two details that mattered in practice. First, **only fail on files the PR actually touches** — otherwise unrelated drift in the baseline turns into someone else's problem landing in your diff. We diff against the merge base to get the touched-file list and intersect it with the measurement. Second, the failure message has to name the exact function and number. "Complexity check failed" gets you annoyed Slack messages; "`calculate_total` went 14 → 17, baseline is 14" gets you a fix.

## How the debt actually gets paid down

The ratchet alone just stops the bleeding. The paying-down part is social, not technical.

**Boy-scout rule, now enforceable.** "Leave the code better than you found it" was always advice; the ratchet makes it cheap to follow. If you're adding a branch to a complex function anyway, extracting one helper to keep the score flat is a small price — and CI visibly rewards it by suggesting a baseline update.

**Complexity budgets in sprint planning.** When a story touches a file with a score of 38, we add explicit points for carving off a piece of it. The baseline JSON makes the worst files trivially discoverable — `jq` sorts the top ten, and that list feeds refactoring tickets. No archaeology required.

**Celebrate the baseline shrinking.** This sounds corny but works. When a PR drops a file from 38 to 22, the diff shows up in the JSON file, and it gets called out in review. A graph of total baseline complexity trending down month over month turned out to be weirdly motivating — it's one of the few tech-debt metrics where progress survives after the person who made it moves on.

Three months in, the trend line is moving the right way, slowly. That is, I've come to believe, the honest speed of tech debt repayment — not a heroic rewrite quarter, but a mechanism that makes every PR a tiny bit more likely to improve things than to degrade them. If your CI currently enforces nothing about complexity, the cheapest possible starting point isn't a lint rule. It's a JSON file and a thirty-line script.
