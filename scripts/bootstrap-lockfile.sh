#!/usr/bin/env bash
set -euo pipefail

if [[ -f package-lock.json ]]; then
  echo "package-lock.json already exists; refusing to replace it." >&2
  exit 1
fi

node scripts/check-toolchain.mjs
npm install --package-lock-only --ignore-scripts --no-audit --no-fund
printf '\nGenerated package-lock.json without executing dependency lifecycle scripts.\n'
