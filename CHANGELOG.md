# Changelog

## 0.1.1 - 2026-08-13

### Changed

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
