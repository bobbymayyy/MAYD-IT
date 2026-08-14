# GitHub → Cloudflare deployment

MAY'D IT uses two long-lived branches:

- `latest` is the default development branch. CI, dependency updates, and normal work land here first.
- `stable` is the production promotion branch. A successful `stable` build is the only branch eligible to deploy to Cloudflare.

## 1. Repository branch model

Keep `latest` as the GitHub default branch and retain `stable` as a protected production branch. Do not develop directly on `stable`; promote tested changes from `latest` into it.

## 2. Bootstrap the lockfile once

Before enabling strict protection on `latest`, open GitHub **Actions → Bootstrap dependency lockfile**, select the `latest` branch, and run the workflow.

The workflow is deliberately restricted to `latest`. It resolves and commits `package-lock.json` without executing dependency lifecycle scripts, then pushes only that lockfile commit back to `latest`.

The next `CI and deploy` run should then be able to install the exact dependency graph and build both static applications.

## 3. CI behavior

`CI and deploy` runs on:

- pushes to `latest`;
- pushes to `stable`;
- pull requests targeting `latest` or `stable`;
- manual workflow dispatches.

Every run performs the same no-secret build, signature/provenance checks, vulnerability gate, static-output verification, SBOM generation, and artifact creation. Pull requests and `latest` pushes can never deploy production.

## 4. Create the GitHub production environment

In **Settings → Environments**, create an environment named `production`.

Add these environment secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Use a narrowly scoped Cloudflare API token that can deploy only the intended Workers resources/account. Do not use the Global API Key.

For the initial rollout, requiring manual approval for the `production` environment is a useful additional guardrail.

If GitHub exposes deployment-branch restrictions for the environment, permit only `stable`.

## 5. Enable production deployment

In **Settings → Secrets and variables → Actions → Variables**, create:

```text
ENABLE_PRODUCTION_DEPLOY=true
```

This switch is intentionally absent by default. Without it, even a successful `stable` build cannot deploy.

## 6. Promote to production

The normal promotion path is:

```text
feature/work → latest → CI passes → promote/merge → stable → CI passes → deploy
```

Only a non-PR run whose ref is exactly `refs/heads/stable` and whose repository variable `ENABLE_PRODUCTION_DEPLOY` is `true` can enter the deploy job.

The deploy job downloads the already-built artifacts from the no-secret build job. It does not reinstall the project dependency tree.

The two Cloudflare Workers Static Assets services are:

- `mayd-it-site`
- `mayd-it-arcade`

Initially verify them on their `workers.dev` hostnames. This leaves the current WordPress site untouched.

## 7. Domain cutover

After the Workers deployments are verified, attach custom domains in Cloudflare:

- `mayyy.us` → `mayd-it-site`
- `play.mayyy.us` → `mayd-it-arcade`

Do this only when ready to replace the current origin for `mayyy.us`.

## 8. Recommended GitHub rulesets

### `latest`

- require CI before merge where practical;
- block force pushes and deletion;
- require conversation resolution;
- keep this branch as the default branch;
- dependency-update PRs target this branch.

### `stable`

- require pull requests or intentional promotion from `latest`;
- require the `Build and security gates` check;
- block force pushes and deletion;
- require conversation resolution;
- restrict the GitHub `production` environment to this branch;
- require Actions to be pinned to full-length commit SHAs if your GitHub settings expose that policy.

For a solo repository, avoid a required reviewer count that prevents you from promoting your own releases.
