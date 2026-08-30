+++
title = "CVE remediation at monorepo scale: a practical playbook"
date = 2026-08-30T00:00:00+05:30
draft = false
math = false
author = "Krishnatejaswi S"
description = "A playbook for clearing CRITICAL and HIGH CVEs across a monorepo: severity-plus-reachability triage, per-service fix batching, transitive dependency overrides, a trivy CI gate, and an accepted-risk register with expiry dates."
tags = ["security", "infra", "cve", "trivy", "monorepo", "cicd"]
+++

Do not treat a vulnerability scanner as a to-do list. First decide whether a finding is reachable, fixable and exposed. Then make the scan block new risk.

I used this approach to clear CRITICAL and HIGH findings across a monorepo with many services and images. It replaced a noisy backlog with small, owned changes.

## Start with a repeatable triage loop

Use the same loop for every service:

1. Scan every lockfile and built image on a schedule.
2. Record severity, runtime use, reachability and internet exposure.
3. Fix each service in its own pull request.
4. Scan again after the change.

Reachability does not always need a complex tool. For compiled services, inspect the production module graph. For interpreted services, inspect the import graph. A vulnerable version that is not loaded is still debt, but it is not the same priority as exposed code.

## Fix transitive dependencies with care

Most findings are several levels down the dependency graph. Use this order:

- update the direct dependency when it contains the fix
- use a version override when you have tested the compatibility risk
- fork or patch only when upstream is no longer maintained

An override makes you responsible for compatibility. Pin it. Explain why it exists. Run the affected service’s integration tests before you merge it.

## Keep each pull request to one service

One large pull request makes failures hard to isolate. Put all dependency fixes for one service in one pull request. This gives you:

- isolated failures
- a reviewable lockfile change
- a rollback that affects one service

Run build, test and image scan for that service. A failure then points to the package and service that need attention.

## Record accepted risk with an expiry date

Some CVEs have no available fix. Some need an operating-system upgrade. Some do not apply to your configuration. Record each accepted risk in version control, with a reason, owner and expiry date:

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

CI can render unexpired CVE IDs into Trivy’s valid `.trivyignore` file. When an entry expires, omit it from that file so the scan fails again. This makes risk acceptance a decision you revisit.

## Make the scan block regressions

Run the gate on any pull request that changes a service dependency or Dockerfile:

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

`exit-code: '1'` fails the build. `ignore-unfixed: true` limits the gate to findings with an available fix. `trivyignores` uses the generated ignore list, while the register keeps the reason and owner for each exception. See the [Trivy documentation](https://trivy.dev/latest/docs/) for the supported configuration.

Yes, the gate blocked a PR the week it went in. That was the point.

## Run containers as a non-root user

Make each service run as a non-root user:

```dockerfile
RUN useradd -r -u 10001 appuser
USER 10001
```

Non-root containers do not remove every risk. They reduce the permissions available after code execution. The common failure is an application directory that the runtime user cannot write to. Fix ownership only for the directories the service needs.

## What to do first

Start by scanning every production image. Prioritise reachable and exposed CRITICAL or HIGH findings. Make small per-service pull requests. Record exceptions with expiry dates. Then make the scan a required check.
