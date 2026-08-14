# Security Policy

## Design

MAY'D IT is static-first. The portfolio and arcade are separate Cloudflare Workers Static Assets deployments. Neither requires a database, public administration interface, server session, or inbound connection to the homelab.

## Dependency policy

- Node.js and npm versions are pinned.
- Direct npm dependencies use exact versions.
- `package-lock.json` is required for CI and production builds.
- npm lifecycle scripts are disabled during dependency installation.
- New dependency resolution uses a seven-day release-age window.
- Git, file, directory, and arbitrary remote dependency specs are blocked by project npm configuration.
- CI verifies npm registry signatures/provenance and rejects known high/critical vulnerabilities.
- GitHub Actions are pinned to full commit SHAs.
- Dependabot proposes dependency and Action updates by pull request; updates are never auto-merged by repository code.

## CI trust boundaries

The build job receives no production secrets. It installs dependencies, audits them, builds the static assets, verifies outputs, generates an SBOM, and uploads immutable workflow artifacts.

The deployment job receives only the built static artifacts and Cloudflare credentials through the protected `production` GitHub Environment. Project dependencies are not installed in that job.

## Reporting

Do not include credentials, private infrastructure addresses, tokens, or other sensitive operational data in a public issue. Use a private GitHub security advisory for repository vulnerabilities after the repository is published.
