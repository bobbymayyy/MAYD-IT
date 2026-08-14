# GitHub → Cloudflare deployment

## 1. Create the GitHub repository

Upload this repository with `main` as the default branch.

## 2. Bootstrap the lockfile once

Before enabling strict branch protection, open GitHub **Actions → Bootstrap dependency lockfile → Run workflow**. It will generate and commit `package-lock.json` without executing dependency lifecycle scripts.

The next `CI and deploy` run should then be able to build.

## 3. Test CI before enabling deployment

After the bootstrap commit, the normal CI workflow will install, audit, build, verify, and upload artifacts. Production deployment is disabled by default because the repository variable `ENABLE_PRODUCTION_DEPLOY` does not exist yet. This lets you validate CI without touching Cloudflare.

## 4. Create the GitHub production environment

In **Settings → Environments**, create an environment named `production`.

Add these environment secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Use a narrowly scoped Cloudflare API token that can deploy Workers for the intended account. Do not use the Global API Key.

Optionally require manual approval for the `production` environment while the deployment is new.

## 5. Enable and run the first deployment

In **Settings → Secrets and variables → Actions → Variables**, create `ENABLE_PRODUCTION_DEPLOY` with value `true`.

Then push or merge to `main`, or run `CI and deploy` manually from `main`. The workflow builds without production credentials and then deploys two Workers Static Assets services:

- `mayd-it-site`
- `mayd-it-arcade`

Initially test them on their `workers.dev` hostnames. This avoids disturbing the current WordPress site.

## 6. Domain cutover

After the Workers deployments are verified, attach custom domains in Cloudflare:

- `mayyy.us` → `mayd-it-site`
- `play.mayyy.us` → `mayd-it-arcade`

Do this only when ready to replace the current origin for `mayyy.us`.

## 7. Protect main

After the initial lockfile commit succeeds, configure a GitHub ruleset for `main`:

- require pull requests for changes;
- require the `Build and security gates` check;
- block force pushes and deletion;
- require conversation resolution;
- require Actions to be pinned to full-length commit SHAs if your GitHub plan/settings expose that policy.

For a solo repository, avoid a required reviewer count that would prevent you from merging your own maintenance PRs.
