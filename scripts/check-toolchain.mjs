import fs from 'node:fs';
import process from 'node:process';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const expectedNode = `v${pkg.engines.node}`;
const expectedNpm = pkg.engines.npm;
const actualNode = process.version;

if (actualNode !== expectedNode) {
  console.error(`Node mismatch: expected ${expectedNode}, got ${actualNode}`);
  process.exit(1);
}

const { execFileSync } = await import('node:child_process');
const actualNpm = execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim();
if (actualNpm !== expectedNpm) {
  console.error(`npm mismatch: expected ${expectedNpm}, got ${actualNpm}`);
  process.exit(1);
}

console.log(`Toolchain verified: Node ${actualNode}, npm ${actualNpm}`);
