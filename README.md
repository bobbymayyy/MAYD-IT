# MAY'D IT 0.1.1

A static-first engineering portfolio with an isolated browser arcade and a deliberately small production attack surface.

## Architecture

```text
GitHub
  │
  ├─ PR / push
  │    │
  │    ▼
  │  GitHub Actions
  │  build + audit
  │  NO production secrets
  │    │
  │    ├──────────────┐
  │    ▼              ▼
  │  site artifact  arcade artifact
  │    │              │
  │    └──────┬───────┘
  │           ▼
  │     protected deploy job
  │           │
  ▼           ▼
Cloudflare Workers Static Assets
  ├─ mayd-it-site    → eventually mayyy.us
  └─ mayd-it-arcade  → eventually play.mayyy.us
```

There is no production VM, container host, SSH service, cron-based `git pull`, database, or public administration panel.

## Repository layout

- `apps/site` → portfolio
- `apps/arcade` → isolated client-side arcade
- `.github/workflows` → lockfile bootstrap, CI/deployment, scheduled audits
- `docs` → deployment and supply-chain policy
- `scripts` → build/toolchain verification

## First GitHub setup

This archive does **not** contain a fabricated `package-lock.json`. The build environment used to create the archive cannot contact the npm registry, so inventing a lockfile would undermine the exact supply-chain control it is meant to provide.

After uploading the repository:

1. Open **Actions → Bootstrap dependency lockfile**.
2. Run it once from `latest`.
3. The workflow uses pinned Node/npm versions and resolves the lockfile with dependency lifecycle scripts disabled.
4. It commits only `package-lock.json` back to `latest`.
5. Normal CI can then run; production deployment remains reserved for `stable`.

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the Cloudflare and GitHub environment setup.

## Local development

Use the exact toolchain declared in `.nvmrc` and `package.json`.

Once `package-lock.json` exists:

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm run dev:site
```

In a second terminal:

```bash
npm run dev:arcade
```

## Local verification

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm audit signatures
npm audit --audit-level=high
npm run verify
```

## CI/CD behavior

Pushes and pull requests for `latest` and `stable` receive the same build and security gates. `latest` is the development/default branch; only a successful non-PR run of `stable` can start the separate deployment job using credentials from the protected GitHub `production` Environment.

The deployment job does **not** rebuild the application or install the project's dependency tree. Deployment is disabled by default until the GitHub Actions repository variable `ENABLE_PRODUCTION_DEPLOY=true` is explicitly created.

## Supply-chain posture

0.1.1 adds:

- Node.js `24.19.0` pinned;
- npm `11.17.0` pinned;
- Astro `7.1.3` pinned exactly;
- committed lockfile required after bootstrap;
- lifecycle scripts disabled during dependency installation;
- seven-day minimum package release age for new resolutions;
- Git/file/directory/arbitrary remote dependency specs blocked;
- npm registry signature/provenance verification;
- high/critical vulnerability gating;
- CycloneDX SBOM generation;
- SHA-256 build manifests;
- GitHub Actions pinned to full commit SHAs;
- Wrangler pinned to `4.113.0` for deployment;
- weekly Dependabot PRs with no repository-side auto-merge;
- weekly vulnerability/signature audit;
- build and deploy jobs separated so project dependencies never receive Cloudflare credentials.

Read [`docs/SUPPLY_CHAIN.md`](docs/SUPPLY_CHAIN.md) for the threat model and rationale.

## 0.1.1 application scope

### Portfolio

- landing page;
- selected engineering project cards;
- structured résumé data;
- command interface;
- command routing into the arcade;
- restrictive CSP and response headers.

### Arcade

- separate deployable origin;
- Snake;
- Pong;
- Tic-Tac-Toe;
- no account;
- no database;
- no backend calls;
- no persistence worth stealing.

## Security doctrine

1. Static by default.
2. No secrets in browser code.
3. No homelab dependency for portfolio availability.
4. Experimental surfaces live on separate origins.
5. Production builds are disposable and reproducible.
6. Dependency code receives no deployment credentials.
7. Dynamic services are added only when static delivery cannot satisfy the requirement.
