import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm, symlink } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { basename, extname, join, relative, resolve, sep } from 'node:path';
import { chromium } from '@playwright/test';

const legacyCommit = '553f8fb9d4f6b524d3560e12af59b38e5e790acf';
const repository = resolve('.');
const finalDist = join(repository, 'dist');

const contentTypes = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp',
};

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }))).flat();
}

async function expectedBuildId(outDir) {
  const files = (await filesIn(outDir)).filter(file => basename(file) !== 'sw.js').sort();
  const hash = createHash('sha256');
  for (const file of files) {
    const relativePath = relative(outDir, file).split(sep).join('/');
    const publicPath = relativePath === 'index.html' ? '/' : relativePath.endsWith('/index.html')
      ? `/${relativePath.slice(0, -'index.html'.length)}`
      : `/${relativePath}`;
    hash.update(publicPath);
    hash.update('\0');
    hash.update(await readFile(file));
    hash.update('\0');
  }
  return hash.digest('hex').slice(0, 20);
}

function appBundle(dist) {
  const assets = execFileSync('find', [join(dist, 'assets'), '-maxdepth', '1', '-name', 'index-*.js', '-printf', '%f\\n'], { encoding: 'utf8' }).trim();
  assert.ok(assets, `no app bundle found in ${dist}`);
  return `/assets/${assets}`;
}

function staticServer(initialDir) {
  let activeDir = initialDir;
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url || '/', 'http://127.0.0.1');
      const relativePath = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      const candidate = relativePath.endsWith('/') || !relativePath ? join(relativePath, 'index.html') : relativePath;
      const file = resolve(activeDir, candidate);
      if (!file.startsWith(`${activeDir}${sep}`)) throw new Error('invalid path');
      const body = await readFile(file);
      response.writeHead(200, {
        'Content-Type': contentTypes[extname(file)] || 'application/octet-stream',
        'Cache-Control': basename(file) === 'sw.js' ? 'no-cache' : 'no-store',
      });
      response.end(body);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  });
  return {
    server,
    setDir: directory => { activeDir = directory; },
    async listen() {
      await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
      const address = server.address();
      assert.ok(address && typeof address !== 'string');
      return `http://127.0.0.1:${address.port}`;
    },
    async close() { await new Promise(resolveClose => server.close(resolveClose)); },
  };
}

async function buildLegacyDistribution(tempRoot) {
  execFileSync('git', ['cat-file', '-e', `${legacyCommit}^{commit}`], { cwd: repository });
  const archive = execFileSync('git', ['archive', '--format=tar', legacyCommit], { cwd: repository, maxBuffer: 64 * 1024 * 1024 });
  const unpacked = spawnSync('tar', ['-x', '-C', tempRoot], { input: archive });
  assert.equal(unpacked.status, 0, unpacked.stderr.toString());
  await symlink(join(repository, 'node_modules'), join(tempRoot, 'node_modules'), 'dir');
  execFileSync('npm', ['run', 'build'], { cwd: tempRoot, stdio: 'inherit' });
  return join(tempRoot, 'dist');
}

async function browserUsesBundle(page, bundle) {
  await page.waitForFunction(expected => performance.getEntriesByType('resource').some(entry => entry.name.endsWith(expected)), bundle);
}

let temporaryRoot;
let serverHarness;
let browser;

try {
  const finalWorker = await readFile(join(finalDist, 'sw.js'), 'utf8');
  const fingerprint = await expectedBuildId(finalDist);
  assert.match(finalWorker, new RegExp(`const CACHE = 'exam-bridge-${fingerprint}'`), 'worker cache ID must fingerprint the final build');

  temporaryRoot = await mkdtemp(join(tmpdir(), 'exam-bridge-sw-upgrade-'));
  const legacyDist = await buildLegacyDistribution(temporaryRoot);
  const oldWorker = await readFile(join(legacyDist, 'sw.js'), 'utf8');
  assert.match(oldWorker, /const CACHE = 'exam-bridge-v1';/, 'fixture must be the exact blocking candidate worker');
  assert.notEqual(oldWorker, finalWorker, 'repaired release must update the worker script');

  serverHarness = staticServer(legacyDist);
  const origin = await serverHarness.listen();
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(origin);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await browserUsesBundle(page, appBundle(legacyDist));
  assert.deepEqual(await page.evaluate(() => caches.keys()), ['exam-bridge-v1']);

  serverHarness.setDir(finalDist);
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) throw new Error('missing service worker registration');
    const changed = new Promise(resolveChanged => navigator.serviceWorker.addEventListener('controllerchange', resolveChanged, { once: true }));
    await registration.update();
    await changed;
  });
  await page.reload();
  await browserUsesBundle(page, appBundle(finalDist));
  const cacheNames = await page.evaluate(() => caches.keys());
  assert.deepEqual(cacheNames, [`exam-bridge-${fingerprint}`], 'activation must retire the old v1 cache');

  await context.setOffline(true);
  await page.reload();
  await browserUsesBundle(page, appBundle(finalDist));
  await context.close();
  console.log(`PASS: exact ${legacyCommit.slice(0, 8)} → final build service-worker update and offline reload (${fingerprint})`);
} finally {
  await browser?.close();
  await serverHarness?.close();
  if (temporaryRoot) await rm(temporaryRoot, { recursive: true, force: true });
}
