import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const roots = ['apps/site/dist', 'apps/arcade/dist'];
const forbiddenNames = new Set(['.env', '.env.local', 'package-lock.json', 'package.json']);
let files = 0;

function walk(root) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    const stat = fs.lstatSync(full);
    if (stat.isSymbolicLink()) {
      throw new Error(`Symlink forbidden in static output: ${full}`);
    }
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    files += 1;
    if (forbiddenNames.has(entry.name)) {
      throw new Error(`Sensitive/build-only file leaked into static output: ${full}`);
    }
  }
}

for (const root of roots) {
  if (!fs.existsSync(path.join(root, 'index.html'))) {
    console.error(`Missing expected static entrypoint: ${root}/index.html`);
    process.exit(1);
  }
  try {
    walk(root);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

console.log(`Static build verified: ${files} files, no symlinks or forbidden build files.`);
