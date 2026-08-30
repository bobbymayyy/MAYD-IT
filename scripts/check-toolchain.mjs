import fs from 'node:fs';
import process from 'node:process';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const expectedNode = fs.readFileSync(new URL('../.nvmrc', import.meta.url), 'utf8').trim();
const packageManagerMatch = /^npm@(.+)$/.exec(pkg.packageManager ?? '');

if (!packageManagerMatch) {
  console.error('packageManager must pin npm as npm@<version>');
  process.exit(1);
}

const expectedNpm = packageManagerMatch[1];
const actualNode = process.version;

if (actualNode !== `v${expectedNode}`) {
  console.error(`Node mismatch: expected v${expectedNode}, got ${actualNode}`);
  process.exit(1);
}

const { execFileSync } = await import('node:child_process');
const actualNpm = execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim();
if (actualNpm !== expectedNpm) {
  console.error(`npm mismatch: expected ${expectedNpm}, got ${actualNpm}`);
  process.exit(1);
}

console.log(`Toolchain verified: Node ${actualNode}, npm ${actualNpm}`);
