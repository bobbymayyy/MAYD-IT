# Supply-chain controls

MAY'D IT assumes a package can become malicious even when it was previously trustworthy. The pipeline therefore layers controls instead of treating a clean vulnerability scan as proof of safety.

## Dependency resolution

The project pins Node.js 24.19.0, npm 11.17.0, and direct dependency versions. `.npmrc` enforces exact saves, a seven-day release cooling-off period, strict peer dependency resolution, and blocks Git/file/directory/arbitrary remote dependency specifications.

`ignore-scripts=true` prevents dependency `preinstall`, `install`, `postinstall`, and preparation lifecycle hooks during install. Explicit project scripts such as `npm run build` still run, because the build tool itself must execute.

## Lockfile bootstrap

This archive intentionally does not fabricate a lockfile in an environment that cannot contact the npm registry. After the repository is first uploaded, run **Actions → Bootstrap dependency lockfile → Run workflow** exactly once. The workflow resolves the graph with `--package-lock-only --ignore-scripts`, commits only `package-lock.json`, and never executes package lifecycle code.

After that bootstrap, CI refuses to build without the committed lockfile. Do not rerun the bootstrap workflow; future changes should be ordinary reviewed dependency PRs.

## Build job

The build job has read-only repository permissions and no Cloudflare credentials. It:

1. installs the committed dependency graph with `npm ci --ignore-scripts`;
2. verifies registry signatures/provenance with `npm audit signatures`;
3. rejects high/critical known vulnerabilities with `npm audit --audit-level=high`;
4. builds both static sites;
5. rejects symlinks and obvious build-only files in `dist`;
6. produces a CycloneDX SBOM and SHA-256 build manifest;
7. uploads static deployment artifacts.

## Deployment job

Only a successful build on `main` can reach deployment. The job downloads the built artifacts instead of checking out and rebuilding project source. It uses the SHA-pinned official Cloudflare Wrangler Action with Wrangler 4.113.0 and credentials from the protected `production` GitHub Environment.

## Update policy

Dependabot opens weekly PRs for npm and GitHub Actions. Do not auto-merge them. Review what changed, let CI run, and give newly published versions time to age unless an urgent security fix justifies an exception.
