+++
title = "CVE Remediation at Monorepo Scale: A Practical Playbook"
date = 2026-08-30T00:00:00+05:30
draft = false
math = false
author = "Krishnatejaswi S"
description = "A playbook for clearing CRITICAL and HIGH CVEs across a monorepo: severity-plus-reachability triage, per-service fix batching, transitive dependency overrides, a trivy CI gate, and an accepted-risk register with expiry dates."
tags = ["security", "infra", "cve", "trivy", "monorepo", "cicd"]
+++

The first full trivy scan of the monorepo came back with a number I don't want to say out loud. Dozens of services, each with its own dependency tree and container image, and the CRITICAL/HIGH column alone ran to three digits. Some were vulnerable code paths nobody could reach; others were real, including an unpatched TLS library in an internet-facing service. That turned a "we should fix CVEs sometime" ticket into a remediation program.

## The triage loop: scan, triage, batch

The mistake to avoid is treating scanner output as a work list. It's raw material for a work list.

My loop, repeated until the backlog was empty:

1. **Scan everything.** Every service's lockfile and every built image, on a schedule, not once.
2. **Triage by severity plus reachability.** A CRITICAL in a test-only dependency of an internal batch job is not the same as a HIGH in the HTTP parser of an edge service. I tracked four fields per finding: severity, is the package loaded at runtime, is the vulnerable function reachable from our call paths, is the service internet-facing. Only the intersections matter.
3. **Batch fixes per service, open one PR per service.** More on why this batching matters below.
4. **Re-scan and repeat.** New CVEs land every week, so this loop never actually ends — it just gets quiet.

Reachability sounds like it needs fancy tooling. Mostly it didn't. For compiled services I checked the production binary's module graph; for interpreted ones, an import-graph check answered whether our code touched the package. About half the CRITICALs died at this step — vulnerable version present, code path unreachable. They still get fixed eventually, but go to the back of the queue.

## Transitive dependencies: the part nobody warns you about

Most findings aren't in packages you chose. They're three levels deep in the dependency graph, pinned by something you depend on that hasn't released a fix. Your options, in order of preference:

- **Bump the direct dependency** if upstream has released a version that pulls the fixed transitive version. Cheapest, cleanest.
- **Force the version yourself** — `overrides` in npm, `[tool.uv] override-dependencies` / `pip` constraints in Python, `replace` directives in Go. This works, but you now own the compatibility risk upstream hadn't validated. Pin it, test it, and leave a comment explaining why the override exists and when it can go away.
- **Fork or patch** when upstream is abandoned. This happened with one old middleware library that hadn't shipped a release in two years. We vendored a patched copy and filed a ticket to replace it outright. Vendoring is a loan, not a fix — write down the repayment plan or you'll still be running it in 2029.

The trap is forcing overrides without checking the API surface. I broke one service by overriding a shared serialization library to a version that changed a default behavior; unit tests passed, integration tests caught it. After that, every override PR ran the full integration suite for that service, no exceptions.

## Batch per service, not per CVE

Early on I tried one mega-PR fixing CVEs across a dozen services. It failed CI in four places, and the eight good fixes sat blocked for days.

The fix was structural: **one PR per service, containing all the dependency bumps for that service.** Per-service batching gives you three things:

- **Blast radius isolation.** If a bump breaks a service, only that service's PR is red. Everything else merges.
- **Reviewable diffs.** A reviewer can reason about "auth service bumps these five packages". Nobody can review a lockfile diff spanning fifteen services.
- **Clean rollbacks.** A revert maps to exactly one service's dependency set.

The per-service PRs ran through build, test, and image scan. Failures showed exactly which service needed a human to read the changelog.

## The accepted-risk register: the honest part

Here's the thing nobody puts in their security blog posts: you cannot fix everything. Some CVEs have no patched version. Some fixes require an OS upgrade that's quarters away. Some are only exploitable in configurations you'll never run.

Pretending otherwise doesn't make you more secure; it makes your dashboard a lie. The honest move is an accepted-risk register — a checked-in file where every accepted finding gets an entry with a justification, an owner, and an expiry date:

```yaml
- cve: CVE-2025-12345
  package: libxml2
  severity: HIGH
  services: [report-worker]
  status: accepted-risk
  justification: >
    Vulnerable code path (XInclude processing) is disabled in our
    configuration; parser is only invoked on internally generated
    documents. No fix available in our base image channel yet.
  owner: platform-team
  added: 2026-07-14
  expires: 2026-10-14
  revisit: "Re-check after base image upgrade to bookworm-2026Q4"
```

The expiry date is the whole point. Without it, "accepted risk" quietly becomes "forgotten risk." A small CI step renders unexpired CVE IDs from this register into Trivy's `.trivyignore` format; when one expires, it is omitted and the finding fails again. Risk acceptance becomes a decision you keep making, not one you made once.

## Trivy as a gate, not a report

A scan that produces a report nobody reads is security theater. The scan has to be able to say no.

The gate I landed on runs on every PR that touches a service's dependencies or Dockerfile:

```yaml
- name: Build image for scanning
  run: docker build -t scan-target:${{ github.sha }} services/${{ matrix.service }}

- name: Scan image with trivy
  uses: aquasecurity/trivy-action@0.28.0
  with:
    image-ref: scan-target:${{ github.sha }}
    severity: CRITICAL,HIGH
    ignore-unfixed: true
    exit-code: '1'
    trivyignores: .trivyignore
```

Three details matter. `exit-code: '1'` makes the scan fail the build — without it you're back to unread reports. `ignore-unfixed: true` keeps the gate honest: it only fails on things that *have* a fix. And `trivyignores` uses the generated, valid ignore list, while the richer register retains the ownership and justification behind every exception.

Yes, the gate blocked a PR the week it went in. That was the point.

## Non-root containers: cheap, and you should already be doing it

While I was in every Dockerfile anyway, I made every service run as a non-root user:

```dockerfile
RUN useradd -r -u 10001 appuser
USER 10001
```

Most images already ran non-root by accident of their base images, but a handful didn't. Code execution inside a root container leaves an attacker one kernel exploit or misconfigured mount away from the host. Non-root doesn't prevent that, but it turns one step into two. The main breakage was files written to directories the runtime user couldn't write, fixed by `chown` on only the directories each service needs.

## What I'd tell someone starting this

Don't aim for "zero CVEs" — aim for "zero *reachable, fixable* CRITICAL/HIGHs plus a register that says why the rest are open and when you'll look again." Batch per service so failures stay isolated. Force transitive versions when you have to, and write down why. Gate the scan or don't bother scanning.

The uncomfortable follow-up question the register forces on you: if you couldn't fix it this quarter, what makes next quarter different? If the honest answer is "nothing," that's a signal about the dependency itself — and maybe that's the real remediation.
