# Changelog

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
