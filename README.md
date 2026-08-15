# MAY'D IT 0.2.1

A static-first engineering portfolio for systems architecture, security, infrastructure, automation, and software, with an isolated browser arcade and a deliberately tiny production attack surface.

Production:

- https://mayyy.us
- https://play.mayyy.us

## What MAY'D IT is

MAY'D IT is both a portfolio and an example of the engineering philosophy it describes.

The public surface is intentionally simple:

- static Astro builds;
- no public application server;
- no database;
- no CMS;
- no public administration panel;
- no account system;
- no homelab dependency for availability;
- no trusted backend relationship between the portfolio and arcade.

Interactive features are added only where they earn their existence. The main site includes a command interface and rotating project showcase, while the arcade lives on a separate origin and remains entirely browser-side.

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
                    ▼         ▼
               mayyy.us   play.mayyy.us
```

Production has no application VM, container host, SSH service, database, cron-based deployment process, or public administration surface.

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

## 0.2.1

0.2.1 brings the documented release surface in line with the current implementation while continuing the static-first architecture established by earlier releases.

Highlights:

- expanded data-driven project registry and case studies;
- rotating selected-project presentation on the homepage;
- command-interface history and TAB completion;
- `play fragment` terminal routing;
- five isolated browser arcade programs;
- touchscreen and mobile arcade support;
- rotation-safe arcade layouts;
- FRAGMENT, a procedural first-person experiment with intentionally ephemeral world state;
- continued supply-chain and deployment hardening without introducing a public backend.

## Engineering projects

The project registry currently includes:

- **APPLIER** - state-aware appliance compiler for UBI-family bases.
- **CERBERUS 2.0** - lean Debian Kubernetes architecture with topology-driven control-plane growth.
- **STOKER** - declarative offline infrastructure appliance and Debian ISO compiler.
- **SENTINEL** - lightweight Linux incident-response and threat-hunting sensor.
- **DIP** - deployable incident-response infrastructure platform.
- **GARGOYLE** - hardened cross-platform host telemetry agent.
- **OFFLINEREPO** - portable multi-distribution package repository mirror for disconnected environments.
- **MAY'D IT** - this static-first portfolio and isolated arcade architecture.
- **AL3X** - Linux-native Rust DAW framework.
- **PLEXXX** - deliberately minimal VPN-isolated media acquisition stack.

Project pages are data-driven and focus on the problem, constraints, architecture, engineering choices, lessons, and relevant source repositories without publishing credentials, private topology, tokens, personal datasets, or other operational secrets.

## Command interface

Press either key from the portfolio:

```text
/
`
```

to open the terminal-style command interface.

Current commands include:

```text
help
projects
resume
about
github
status
whoami
clear

play
play snake
play pong
play ttt
play signal
play fragment
```

Command history uses `↑` and `↓`. Supported commands can be completed with `TAB`.

The interface performs browser navigation only. It is not a shell and exposes no server-side execution surface.

## Arcade

The arcade is deployed independently at:

```text
https://play.mayyy.us
```

Programs:

```text
01  SNAKE
02  PONG
03  TIC-TAC-TOE
04  SIGNAL
05  FRAGMENT
```

All arcade programs are client-side and disposable by design.

### SNAKE

Classic grid-based Snake with keyboard and touchscreen directional controls.

### PONG

Two-player Pong with keyboard controls plus touch dragging on each side of the playfield.

### TIC-TAC-TOE

Human-versus-CPU Tic-Tac-Toe with a fixed, rotation-safe board layout and direct touch support.

### SIGNAL

A small strategic-defense simulation inspired by command-console and global-alert interfaces.

The operator manages four network arrays while system load increases over time using:

```text
SCAN
INTERCEPT
HARDEN
```

The objective is to keep the network stable for the duration of the simulation.

### FRAGMENT

FRAGMENT is a dependency-free procedural first-person arcade experiment built with a tiny CPU raycaster rather than an imported game engine.

Its central rule is intentionally strange: the environment is not retained as a conventional level. Geometry resolves procedurally in the active travel direction. When the operator turns back toward discarded space, the former environment does not remain behind them. It collapses into animated ASCII fragments instead.

FRAGMENT includes:

- procedural raycast geometry;
- no stored map or level array;
- player collision and wall sliding;
- deterministic procedural ERR anomalies;
- wall-aware anomaly occlusion;
- session-only defeated-anomaly bookkeeping;
- keyboard, mouse, and touchscreen input;
- no textures, models, sprite assets, game-engine dependency, save system, or backend state.

Controls:

```text
Keyboard
  W / S          forward / backward
  A / D          strafe
  Q / E          turn
  Arrow keys     move / turn
  Space          fire

Mouse
  click          capture pointer / fire
  move           look

Touch
  left drag      move
  right drag     look
  right tap      fire
```

Reloading the page discards the run.

## Résumé integration

The résumé page supports structured site content and an optional downloadable public PDF.

The PDF is deliberately readiness-gated so an unfinished or unsanitized résumé is not accidentally exposed. When a public copy is ready, place it at:

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

## Branch and release model

MAY'D IT uses two long-lived branches:

```text
latest   development / integration
stable   production
```

Normal promotion flow:

```text
feature branch
      │
      ▼
    latest
      │
      ▼
      PR
      │
      ▼
    stable
      │
      ▼
 production
```

Pull requests and pushes into `latest` and `stable` receive build and security gates.

Only a non-pull-request execution on `stable` can enter the protected production deployment job.

## CI/CD model

The build pipeline:

1. checks out the repository without persisting GitHub credentials;
2. verifies the pinned Node.js and npm toolchain;
3. requires the committed dependency lock;
4. installs dependencies with lifecycle scripts disabled;
5. validates npm registry signatures and provenance;
6. rejects known high or critical vulnerabilities;
7. builds and verifies the site and arcade;
8. generates a CycloneDX SBOM;
9. generates SHA-256 build manifests;
10. uploads immutable deployment artifacts.

Deployment runs separately from the build job. It consumes the already-built artifacts and deploys them to Cloudflare, so project dependencies do not execute inside the credential-bearing deployment stage.

## Cloudflare deployment

Production consists of two Cloudflare Workers Static Assets deployments:

```text
mayd-it-site
└── https://mayyy.us

mayd-it-arcade
└── https://play.mayyy.us
```

`www.mayyy.us` redirects to the canonical apex domain.

The portfolio and arcade intentionally remain separate origins.

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

> Build the capability that is required, expose how it works, then remove everything that does not need to exist.

MAY'D IT keeps that principle visible in its own implementation: static delivery, independent failure domains, explicit deployment boundaries, a small dependency surface, and a pleasantly unnecessary arcade.
