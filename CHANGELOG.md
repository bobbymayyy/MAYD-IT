# Changelog

## Unreleased

## 0.2.1 - 2026-08-15

### Added

- Added data-driven case studies and source links for CERBERUS 2.0, STOKER, SENTINEL, DIP, GARGOYLE, OFFLINEREPO, and MAY'D IT.
- Added a progressive homepage project rotation that cycles selected systems in groups of three while preserving a static no-JavaScript fallback.
- Added `FRAGMENT` as arcade program 05, a dependency-free procedural first-person raycaster with a deliberately ephemeral world model and ASCII fragment-space.
- Added keyboard, mouse, and touchscreen controls for `FRAGMENT`.
- Added `play fragment` to the portfolio command interface.

### Changed

- Removed IGg from the public project registry.
- Removed visitor-facing résumé setup instructions from the résumé page while retaining the public résumé experience and README deployment documentation.
- The homepage project rotation pauses during pointer or keyboard interaction and does not auto-rotate when reduced motion is requested.
- Preserved arcade canvas aspect ratios across device rotation and landscape layouts.
- Fixed FRAGMENT wall collision with player-radius blocking and wall sliding.
- Stabilized FRAGMENT anomalies by anchoring them to deterministic procedural world coordinates.
- Destroyed FRAGMENT anomalies now disappear for the remainder of the browser session and cannot be repeatedly farmed for score.
- Added proper wall occlusion for FRAGMENT anomalies using raw ray distance and a small per-column depth buffer.
- Updated current release references and terminal status output from 0.2.0 to 0.2.1.

### Security

- FRAGMENT remains fully client-side with no account, API, backend, persistent player profile, level save, or third-party runtime dependency.
- Destroyed-anomaly bookkeeping is session-memory only and is discarded on reload.
- The portfolio and arcade remain isolated on separate origins with no trusted backend relationship.

## 0.2.0 - 2026-08-14

### Added

- Added real project case-study content with explicit problem, constraints, architecture, lessons, and engineering highlights.
- Added canonical URLs, Open Graph metadata, robots metadata, and JSON-LD website/author metadata to the main site.
- Added canonical and Open Graph metadata to the isolated arcade.
- Added command-interface history navigation with the arrow keys and TAB completion.
- Added `SIGNAL`, a client-side strategic defense simulation, as arcade program 04.
- Added a public-resume readiness switch so the site does not advertise a PDF until the sanitized copy is present.

### Changed

- Expanded project pages from placeholders into data-driven case studies while preserving the same static build model.
- Updated command-interface status and help output for the 0.2.0 surface.
- Added responsive styling for case-study highlights, architecture sequences, resume readiness, and terminal hints.

### Security

- New arcade functionality remains fully client-side with no account, API, backend, or persistent player state.
- Metadata additions introduce no third-party scripts or runtime dependencies.
- Resume PDF exposure remains opt-in to prevent accidentally publishing an unfinished or unsanitized document.

## 0.1.1 - 2026-08-13

### Changed

- Adopted `latest` / `stable` branch promotion: CI on both, production deployment from `stable` only.
- Renamed the project from MAYYY 2.0 to **MAY'D IT**.
- Pinned the development toolchain to Node.js 24.19.0 and npm 11.17.0.
- Pinned Astro to 7.1.3.
- Renamed Cloudflare Workers to `mayd-it-site` and `mayd-it-arcade`.

### Security

- Added npm lifecycle-script blocking and a seven-day release cooling-off window.
- Blocked Git/file/directory/arbitrary remote dependency specs.
- Added one-time no-script lockfile bootstrap workflow.
- Added GitHub CI security gates for registry signatures/provenance and known high/critical vulnerabilities.
- Added CycloneDX SBOM and SHA-256 static-build manifests.
- Split build and deployment into separate runners so project dependencies never receive Cloudflare credentials.
- Pinned GitHub Actions to full commit SHAs.
- Pinned the deploy-time Wrangler version to 4.113.0.
- Added weekly Dependabot checks and a weekly locked-dependency audit.
- Added deployment artifact validation and symlink rejection.
