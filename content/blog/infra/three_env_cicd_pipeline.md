+++
title = "Shipping a three-environment CI/CD pipeline from zero"
date = 2026-08-30T00:00:00+05:30
draft = false
math = false
author = "Krishnatejaswi S"
description = "Building dev, staging, and prod from an empty repo: per-env Terraform state, separate cloud accounts, deployable PR previews, trunk-based promotion, and expand-migrate-contract for database changes."
tags = ["infra", "cicd", "terraform", "github-actions", "devops"]
+++

Use three environments when you need to test production-like load and database changes before customers see them. Dev catches fast feedback. Staging tests the release path. Production needs a deliberate approval.

I built this pattern from an empty monorepo. The decisions below kept the setup simple and made failures safer to handle.

## Why use three environments

Staging is not another test environment. It is a production-shaped rehearsal space. It uses the same Terraform modules and deployment path, with approved synthetic or anonymised data at a representative scale. It lets you test:

- load behaviour that a small dev dataset cannot show
- migrations that may lock or backfill a production-sized table

If staging uses a different module version or hand-edited security group, it no longer proves much about production.

## Separate production from non-production accounts

Create a non-production account for dev and staging. Use a separate production account. Do this before you create application resources.

- a bad CI role can damage non-production without reaching production
- deployment credentials can be scoped to one account
- billing shows whether non-production costs are growing

Adding this boundary later is much harder.

## Use one promotion path

Use one long-lived branch: `main`. Deploy all environments from it in this order:

```
PR opened → preview environment deployed
PR merged → dev auto-deploys
          → staging auto-deploys
          → prod waits for manual approval
```

Use a GitHub environment for production approval. A job that references an environment with required reviewers waits before it can start. See [GitHub’s deployment environment guidance](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments). This is a simplified job:

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
      - run: terraform -chdir=infra/envs/dev init
      - run: terraform -chdir=infra/envs/dev plan -out=tfplan
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
      - run: terraform -chdir=infra/envs/staging init
      - run: terraform -chdir=infra/envs/staging plan -out=tfplan
      - run: terraform -chdir=infra/envs/staging apply -auto-approve # infra only
      - name: Run migrations
        run: ./scripts/migrate.sh staging
      - name: Deploy application
        run: ./scripts/deploy.sh staging
      - name: Smoke tests
        run: ./scripts/smoke.sh staging

  plan-prod:
    needs: staging
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform -chdir=infra/envs/prod init
      - run: terraform -chdir=infra/envs/prod plan -out=tfplan
      - uses: actions/upload-artifact@v4
        with:
          name: prod-tfplan
          path: infra/envs/prod/tfplan

  prod:
    needs: plan-prod
    runs-on: ubuntu-latest
    environment: prod   # required reviewers inspect the plan first
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform -chdir=infra/envs/prod init
      - uses: actions/download-artifact@v4
        with:
          name: prod-tfplan
          path: infra/envs/prod
      - run: terraform -chdir=infra/envs/prod apply -auto-approve tfplan # infra only
      - name: Run migrations
        run: ./scripts/migrate.sh prod
      - name: Deploy application
        run: ./scripts/deploy.sh prod
      - name: Smoke tests
        run: ./scripts/smoke.sh prod
```

The production job waits for its required reviewers. They can inspect the saved plan before approval. The `concurrency` line prevents two deployments for the same branch from running together. Use OIDC-based cloud authentication in the real workflow instead of long-lived keys.

## Use separate Terraform directories and state

Use one directory and remote state backend for each environment. That makes the target clear in every command. HashiCorp recommends separate directories and state files when you are not using HCP Terraform or Terraform Enterprise for these environment boundaries. See its [Terraform configuration style guide](https://developer.hashicorp.com/terraform/language/style).

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

Each environment directory calls shared modules with its own variables and backend configuration. Keep staging and production on the same module version. Change sizes and replica counts through variables, not copied modules.

## Keep database changes safe to deploy

Run migrations in the pipeline, before you deploy the new application. Do not run them as an application start-up side effect. Under rolling deployment, more than one application version can start at once.

Use expand, migrate, contract:

1. Expand the schema. Old code must still work.
2. Deploy new code and backfill data.
3. Contract the schema in a later pull request.

This keeps the previous application version compatible with the expanded schema. You can roll back the application without rolling back the database.

## Give each pull request a deployable preview

Give every pull request a running preview with synthetic data and its own configuration. You can use either pattern:

- ephemeral infrastructure for each pull request, then destroy it on close
- shared development infrastructure with path-based routing, which is cheaper but shares state

If you use ephemeral previews, delete them on merge or close. Otherwise they become unmanaged cost and access risk.

## Make rollback routine

For application rollback, revert the change on `main` and use the same pipeline. Leave a compatible expanded schema in place. A database rollback needs its own designed migration, which is why schema contraction is separate.

The test is simple: can you deploy, verify and roll back the same way in every environment? If not, fix the pipeline before the next release.
