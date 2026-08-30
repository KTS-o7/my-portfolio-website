+++
title = "Complexity ratchets: pay down tech debt without a rewrite"
date = 2026-08-30T00:00:00+05:30
draft = false
math = false
author = "Krishnatejaswi S"
description = "A complexity ratchet is a CI check that fails only when code gets worse, not when it is merely bad. How we wired per-file complexity baselines into a monorepo and actually started paying the debt down."
tags = ["notes", "tech-debt", "ci", "code-quality", "refactoring"]
+++

Use a complexity ratchet when a codebase has too much existing complexity to fix at once. It stops new complexity from making a file worse, while allowing the team to keep shipping.

I used this approach across TypeScript and Python services in a monorepo. Some functions already scored above 40. The problem was not measuring them. It was improving them without pausing feature work.

## What a ratchet is

A ratchet is a mechanism that moves in one direction only. Applied to code quality, the idea is:

1. Record the current complexity of every file as a baseline, checked into the repo.
2. In CI, compute the complexity of every file the PR touches.
3. Fail the build only if a file is worse than its baseline, or if a new file exceeds a fixed threshold.
4. When a file's complexity drops, regenerate the baseline so the improvement is locked in. The baseline only ever ratchets down.

The crucial property: pre-existing mess is grandfathered in. A file with complexity 38 stays legal — until someone touches it and pushes it to 39. Then CI says no. You can extend a function, but you have to leave it no worse than you found it, which in practice means you either keep the change small or carve a piece out.

## Why a ratchet works better than a rewrite

We tried the two obvious things before this. Both failed in predictable ways.

### A strict global lint rule fails too often

We tried `complexity: ["error", 10]` in ESLint and the Python equivalent. CI reported thousands of violations in untouched files. People then added broad suppressions or ignored the red pipeline. A gate that fails on everything does not help people find the failure that matters.

### A large rewrite loses the race with feature work

We also tried a large refactor of the worst module. The branch diverged, collected conflicts and was abandoned. Feature work keeps moving while a rewrite is open. A small change that improves the code today is more likely to land than a perfect change next quarter.

The ratchet asks for one thing: do not make the file worse. That makes gradual improvement part of normal delivery.

## Implementation

The pieces are small. Per-language complexity measurement, a checked-in baseline file, and a CI script that diffs the two.

For TypeScript, [ESLint's complexity rule](https://eslint.org/docs/latest/rules/complexity) gives you per-function scores. For Python, [Radon](https://radon.readthedocs.io/) can do the same. Store the result in a plain JSON baseline:

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

def changed_files() -> set[str]:
    base = subprocess.check_output(
        ["git", "merge-base", "HEAD", "origin/main"], text=True
    ).strip()
    output = subprocess.check_output(
        ["git", "diff", "--name-only", base, "HEAD"], text=True
    )
    return set(output.splitlines())

def main() -> int:
    baseline = json.loads(open("complexity-baseline.json").read())
    threshold = baseline[THRESHOLD_KEY]
    known = baseline["files"]
    current = measure()

    failures = []
    for path in changed_files() & current.keys():
        score = current[path]
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

Two details matter. First, only check files changed by the pull request. Otherwise a contributor inherits an unrelated failure. Second, name the function and score in the failure. “`calculate_total` went from 14 to 17; the baseline is 14” tells the contributor what to fix.

## How to reduce the baseline

The ratchet alone just stops the bleeding. The paying-down part is social, not technical.

### Improve code when you already touch it

If you add a branch to a complex function, extract one helper to keep the score flat. The ratchet makes the usual “leave it better than you found it” rule practical.

### Plan work on the hardest files

When a story touches a file with a score of 38, include time to simplify it. The baseline shows the worst files, so you can turn them into focused refactoring work.

### Make improvement visible

When a pull request drops a file from 38 to 22, record it in review. Track the total baseline over time. It gives the team a simple, durable measure of technical debt going down.

## What to do first

1. Measure the current complexity and commit a baseline.
2. Fail only changed files that exceed their baseline.
3. Update the baseline when a refactor reduces complexity.
