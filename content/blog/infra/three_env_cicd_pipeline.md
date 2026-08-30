+++
title = "Shipping a Three-Environment CI/CD Pipeline from Zero"
date = 2026-08-30T00:00:00+05:30
draft = false
math = false
author = "Krishnatejaswi S"
description = "Building dev, staging, and prod from an empty repo: per-env Terraform state, separate cloud accounts, deployable PR previews, trunk-based promotion, and expand-migrate-contract for database changes."
tags = ["infra", "cicd", "terraform", "github-actions", "devops"]
+++

I recently stood up a full deployment pipeline for a monorepo I work on, starting from an empty repository with nothing but a README and a `services/` directory. No legacy Jenkins, no inherited AWS account, no conventions to respect. That kind of blank slate is rare, so I wrote down the decisions that mattered — and the one that saved us from an incident in the first month.

## Why three environments, not two

The obvious setup is dev + prod. Staging looks like a tax: more infra, more config to keep in sync, one more thing that can break. I almost skipped it.

What changed my mind: staging's job is not to catch application bugs — CI does that. Staging's job is to be a **prod-shaped rehearsal space**. Same Terraform modules, same deployment path, realistic data volume. Two things you cannot rehearse anywhere else:

- **Load behavior.** Dev runs one replica with a toy dataset. A query that scans fine over 10k rows times out over 10M. You find that out in staging or you find it out in an incident.
- **Migrations.** A schema change that takes 40ms on an empty dev database can lock a table for minutes in prod. Running it against staging data at production scale is the only cheap way to learn that before your users do.

If staging diverges from prod — different module version, hand-tweaked security group — it stops being evidence and starts being decoration.

## Account isolation before everything else

The first Terraform I wrote wasn't a VPC. It was the account boundary: a nonprod account holding dev and staging, and a separate prod account. This is the single highest-leverage decision in the whole setup, and it costs almost nothing up front.

- **Blast radius.** A misconfigured CI role can delete every database in nonprod and ruin an afternoon. The same mistake in a shared account ruins your quarter.
- **IAM sanity.** CI deploy credentials are scoped per account. The pipeline literally *cannot* touch prod until it assumes the prod role, which only the production workflow can do.
- **Billing clarity.** Nonprod spend is one line item. When it spikes, you know it's a leak, not customer traffic.

Retrofitting account separation after the fact is a migration project. Doing it on day one is an afternoon.

## The trunk-based flow

One long-lived branch: `main`. All three environments deploy from it. The promotion path:

```
PR opened → preview environment deployed
PR merged → dev auto-deploys
          → staging auto-deploys
          → prod waits for manual approval
```

The manual gate on prod is deliberate. Not because I distrust automation, but because someone should look at the staging diff — migrations included — before it hits users. The gate is one button click on a GitHub environment approval, so it adds thirty seconds, not a release meeting. A sketch of the production job:

```yaml
name: deploy
on:
  push:
    branches: [main]

concurrency: deploy-${{ github.ref }}

jobs:
  dev:
    runs-on: ubuntu-latest
    environment: dev
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform -chdir=infra/envs/dev apply -auto-approve # infra only
      - run: ./scripts/migrate.sh dev
      - run: ./scripts/deploy.sh dev

  staging:
    needs: dev
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform -chdir=infra/envs/staging apply -auto-approve # infra only
      - name: Run migrations
        run: ./scripts/migrate.sh staging
      - name: Deploy application
        run: ./scripts/deploy.sh staging
      - name: Smoke tests
        run: ./scripts/smoke.sh staging

  prod:
    needs: staging
    runs-on: ubuntu-latest
    environment: prod   # required reviewers configured here
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform -chdir=infra/envs/prod apply -auto-approve # infra only
      - name: Run migrations
        run: ./scripts/migrate.sh prod
      - name: Deploy application
        run: ./scripts/deploy.sh prod
      - name: Smoke tests
        run: ./scripts/smoke.sh prod
```

The `concurrency` line serializes deploys to the same ref — two merges landing a minute apart don't race each other through `terraform apply`. Real version has OIDC-based cloud auth instead of static keys; this is the skeleton, not the whole body.

## Terraform layout: directories over workspaces

I used per-environment directories with separate state backends, not Terraform workspaces. Workspaces hide environment state behind a CLI flag — one forgotten `workspace select` and `plan` runs against the wrong state file. Directories make the environment explicit in every command and every path:

```
infra/
├── modules/
│   ├── network/        # VPC, subnets, shared across envs
│   ├── database/       # parameterised by size, not by shape
│   └── service/        # app service, ingress, scaling
└── envs/
    ├── dev/
    │   ├── backend.tf  # s3 bucket: tfstate-nonprod, key: dev
    │   └── main.tf     # small instances, 1 replica
    ├── staging/
    │   ├── backend.tf  # s3 bucket: tfstate-nonprod, key: staging
    │   └── main.tf     # same modules, prod-sized
    └── prod/
        ├── backend.tf  # s3 bucket: tfstate-prod (separate account)
        └── main.tf     # same modules, prod-sized, multi-AZ
```

Each `envs/` directory is a thin composition of shared modules plus a variables file. Staging and prod call the *same modules with the same version pin* — only sizes and replica counts differ. The moment you copy-paste a module "just for staging," you've forked your infrastructure.

## Migrations: expand, migrate, contract

Migrations run **in the pipeline**, before the new application version goes live — never as a first-boot side effect of the app, which races under rolling deploys. The ordering constraint is handled by expand-migrate-contract:

1. **Expand:** add the new column/table. Old code still works, new code can start writing.
2. **Migrate:** deploy the new code, backfill data.
3. **Contract:** a later PR drops the old column.

Every deploy is therefore backward-compatible with the previous schema, which is what makes rollback safe: reverting the app doesn't require reverting the database.

## Previews that actually deploy

Every PR gets a real, running environment — seeded with synthetic data and its own config — because "works on my machine" is not reviewable. Two viable patterns:

- **Ephemeral infra:** spin up a fresh environment per PR, tear down on close. Maximally isolated, slower (minutes per PR), costs more.
- **Shared dev with path-based routing:** deploy PR builds into dev under a prefix. Cheap and fast, but PRs share a database and can stomp each other.

We started with ephemeral and kept it. The teardown-on-merge job is the important half — preview environments without an expiry date become a billing surprise and, eventually, someone's forgotten attack surface.

## Rollback is a pipeline, not a panic

Because everything deploys from `main`, application rollback is `git revert` and let the pipeline run. The compatible expanded schema stays in place; a database rollback needs its own explicitly designed migration. That is why contract lives in a separate, later PR.

A month in, we shipped a migration that locked a staging table for four minutes. It would have been a prod incident. Instead it was a Slack message and a rewritten migration. That's the entire argument for the third environment, in one sentence.
