import assert from 'node:assert/strict';
import { access, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const dist = new URL('../dist/', import.meta.url);
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// This is deliberately the exact command copied from claims.json. Removing
// only the generated artifact reproduces the clean-clone condition that once
// made Vite preview wait until Playwright timed out.
await rm(dist, { recursive: true, force: true });
await assert.rejects(access(dist), /ENOENT/u, 'the regression test must begin without dist');

const result = spawnSync(npm, [
  'run', 'test:e2e', '--', '--project=desktop', '--grep', '@claim:demo-sandbox',
], { stdio: 'inherit' });

assert.equal(result.error, undefined, `could not start the exact claim command: ${result.error?.message ?? ''}`);
assert.equal(result.status, 0, 'the exact clean-clone claim command must pass');
await access(new URL('index.html', dist));

console.log('PASS: exact @claim:demo-sandbox command builds and previews from no dist/');
