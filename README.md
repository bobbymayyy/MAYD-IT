# MAY'D IT 0.2.0

A static-first engineering portfolio built around systems architecture, security, infrastructure, automation, and software, with an isolated browser arcade and a deliberately tiny production attack surface.

Production:

- https://mayyy.us
- https://play.mayyy.us

## Architecture

```text
                         GitHub
                            │
                 feature / development
                            │
                            ▼
                         latest
                            │
                      PR promotion
                            │
                            ▼
                         stable
                            │
                            ▼
                    GitHub Actions
                 build + security gates
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
          site artifact          arcade artifact
                 │                     │
                 └──────────┬──────────┘
                            ▼
                 protected deploy job
                            │
                            ▼
                Cloudflare Workers
                   Static Assets
                    │         │
                    │         │
                    ▼         ▼
               mayyy.us   play.mayyy.us
```

The production stack has no application VM, container host, SSH service, database, CMS, cron-based deployment process, or public administration panel.

## Repository layout

```text
MAYD-IT/
├── apps/
│   ├── site/          portfolio
│   └── arcade/        isolated browser arcade
├── docs/              deployment and supply-chain policy
├── scripts/           build and toolchain verification
├── .github/
│   └── workflows/     CI, audits, lockfile maintenance, deployment
├── package.json
└── package-lock.json
```

## MAY'D IT 0.2.0

0.2.0 expands the original portfolio into a richer engineering showcase while preserving the same static-first architecture.

### Portfolio

The main site includes:

- responsive landing page;
- selected engineering work;
- data-driven project case studies;
- project architecture, constraints, lessons, and engineering highlights;
- résumé integration;
- command interface;
- command history using `↑` / `↓`;
- TAB command completion;
- arcade routing through `play.mayyy.us`;
- canonical URLs;
- Open Graph metadata;
- robots metadata;
- JSON-LD structured metadata;
- restrictive browser security headers.

Current project case studies include:

- **APPLIER**  
  Stateful appliance compiler for building minimal, purpose-specific systems from UBI-family bases.

- **CERBERUS**  
  Minimal Kubernetes architecture designed to start small and promote nodes into control-plane roles as topology grows.

- **AL3X**  
  Linux-native DAW framework built around Rust, PipeWire, Wayland, Vulkan, and explicit real-time diagnostics.

- **PLEXXX**  
  Minimal media acquisition architecture emphasizing VPN isolation, operational visibility, and deliberate manual control.

- **IGg**  
  Privacy-oriented local analysis tooling for exported social-network data.

Project pages intentionally describe architecture and engineering decisions without publishing credentials, private topology, tokens, personal datasets, or other operational secrets.

## Command interface

Press:

```text
/
```

or:

```text
`
```

to open the command interface.

Example commands:

```text
help
projects
resume
about
github
status
whoami

play
play snake
play pong
play ttt
play signal
```

Command history is available with the arrow keys and supported commands can be completed with `TAB`.

## Arcade

The arcade is deployed independently at:

```text
https://play.mayyy.us
```

It remains a separate browser-only surface with no trusted backend relationship to the portfolio.

Programs:

```text
01  SNAKE
02  PONG
03  TIC-TAC-TOE
04  SIGNAL
```

### SIGNAL

`SIGNAL` is a small strategic-defense simulation inspired by old command-console and global-alert interfaces.

The operator manages four network arrays while system load increases over time.

Available actions:

```text
SCAN
INTERCEPT
HARDEN
```

The goal is to keep the network stable for the duration of the simulation.

Like the rest of the arcade, SIGNAL is entirely client-side:

- no account;
- no API;
- no database;
- no server-side game state;
- no persistent player profile;
- no third-party scripts.

## Résumé integration

The résumé page is designed to support both structured site content and a downloadable public PDF.

The PDF is intentionally gated so an unfinished or unsanitized résumé is not accidentally exposed.

When the public version is ready, place it at:

```text
apps/site/public/resume.pdf
```

and enable the corresponding readiness flag in the résumé data/configuration.

## Local development

Use the exact Node.js and npm versions declared by the repository.

Install the locked dependency graph:

```bash
npm ci --ignore-scripts --no-audit --no-fund
```

Run the portfolio:

```bash
npm run dev:site
```

Run the arcade in another terminal:

```bash
npm run dev:arcade
```

## Local verification

Run the same primary controls exercised by CI:

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm audit signatures
npm audit --audit-level=high
npm run verify
```

## CI/CD model

MAY'D IT uses two long-lived branches:

```text
latest   development / integration
stable   production
```

Feature work should normally enter through a dedicated branch and pull request:

```text
feature/*
    ↓
 latest
    ↓
 PR
    ↓
 stable
    ↓
 production
```

Pull requests and pushes into `latest` and `stable` receive the same build and security gates.

Only a non-pull-request execution on `stable` can enter the protected production deployment job.

The build job:

1. checks out the repository without persisting GitHub credentials;
2. verifies the pinned Node/npm toolchain;
3. requires the committed dependency lock;
4. installs dependencies with lifecycle scripts disabled;
5. validates npm registry signatures and provenance;
6. rejects known high or critical vulnerabilities;
7. builds and verifies both applications;
8. generates an SBOM;
9. generates SHA-256 build manifests;
10. uploads immutable deployment artifacts.

The deployment job executes separately.

It downloads the already-built artifacts and deploys them to Cloudflare. The project dependency tree is not rebuilt inside the credential-bearing deployment job.

## Cloudflare deployment

Production consists of two Cloudflare Workers Static Assets deployments:

```text
mayd-it-site
└── https://mayyy.us

mayd-it-arcade
└── https://play.mayyy.us
```

`www.mayyy.us` redirects to the canonical apex domain:

```text
https://mayyy.us
```

The portfolio and arcade are intentionally separate origins.

## Supply-chain posture

Current controls include:

- exact Node.js version pinning;
- exact npm version pinning;
- exact Astro dependency pinning;
- committed `package-lock.json`;
- `npm ci` for reproducible installation;
- dependency lifecycle scripts disabled during CI installation;
- minimum package release-age policy;
- deliberate exceptions for reviewed security fixes;
- Git and arbitrary remote dependency sources restricted;
- npm registry signature and provenance verification;
- high/critical vulnerability CI gating;
- CycloneDX SBOM generation;
- SHA-256 build manifests;
- GitHub Actions pinned to full commit SHAs;
- Wrangler version pinning;
- weekly Dependabot review;
- scheduled dependency security audits;
- no automatic dependency merges;
- separate build and deployment runners;
- Cloudflare credentials exposed only to the protected production deployment job.

See:

```text
docs/SUPPLY_CHAIN.md
docs/DEPLOYMENT.md
```

for the underlying policy and rationale.

## Security doctrine

1. **Static by default.**
2. **No secrets in browser code.**
3. **No homelab dependency for public availability.**
4. **Experimental surfaces live on separate origins.**
5. **Production builds are disposable and reproducible.**
6. **Application dependencies do not receive deployment credentials.**
7. **Dynamic services are introduced only when static delivery cannot satisfy the requirement.**
8. **Operational details are documented without publishing sensitive infrastructure data.**
9. **Security controls should reduce capability, not merely add configuration.**

## Design philosophy

MAY'D IT is intentionally small.

The portfolio itself is also an example of the engineering philosophy it describes:

> Build the capability that is required, expose how it works, then remove everything that does not need to exist.

The result is a portfolio with very little machinery behind it, fast navigation, independent failure domains, explicit deployment controls, and a pleasantly unnecessary arcade.
