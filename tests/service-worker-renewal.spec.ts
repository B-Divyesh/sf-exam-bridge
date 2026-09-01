import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm, symlink } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import { basename, extname, join, relative, resolve, sep } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const LEGACY_COMMIT = '553f8fb9d4f6b524d3560e12af59b38e5e790acf';
const REPOSITORY = resolve('.');
const FINAL_DIST = join(REPOSITORY, 'dist');

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
};

async function filesIn(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }))).flat();
}

function publicPath(file: string, outDir: string): string {
  const path = relative(outDir, file).split(sep).join('/');
  if (path === 'index.html') return '/';
  return path.endsWith('/index.html') ? `/${path.slice(0, -'index.html'.length)}` : `/${path}`;
}

async function expectedBuildId(outDir: string): Promise<string> {
  const files = (await filesIn(outDir)).filter(file => basename(file) !== 'sw.js').sort();
  const hash = createHash('sha256');
  for (const file of files) {
    hash.update(publicPath(file, outDir));
    hash.update('\0');
    hash.update(await readFile(file));
    hash.update('\0');
  }
  return hash.digest('hex').slice(0, 20);
}

function appBundle(dist: string): string {
  const assets = execFileSync('find', [join(dist, 'assets'), '-maxdepth', '1', '-name', '*.js', '-printf', '%f\\n'], { encoding: 'utf8' })
    .trim().split('\n').filter(Boolean);
  assert.equal(assets.length, 1, `expected one app bundle in ${dist}`);
  return `/assets/${assets[0]}`;
}

function staticServer(initialDir: string): {
  server: Server;
  setDir: (directory: string) => void;
  listen: () => Promise<string>;
  close: () => Promise<void>;
} {
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
      await new Promise<void>(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
      const address = server.address();
      assert.ok(address && typeof address !== 'string');
      return `http://127.0.0.1:${address.port}`;
    },
    async close() {
      if (server.listening) await new Promise<void>((resolveClose, reject) => server.close(error => error ? reject(error) : resolveClose()));
    },
  };
}

async function buildLegacyDistribution(tempRoot: string): Promise<string> {
  execFileSync('git', ['cat-file', '-e', `${LEGACY_COMMIT}^{commit}`], { cwd: REPOSITORY });
  const archive = execFileSync('git', ['archive', '--format=tar', LEGACY_COMMIT], { cwd: REPOSITORY, maxBuffer: 64 * 1024 * 1024 });
  const unpacked = spawnSync('tar', ['-x', '-C', tempRoot], { input: archive });
  assert.equal(unpacked.status, 0, unpacked.stderr.toString());
  await symlink(join(REPOSITORY, 'node_modules'), join(tempRoot, 'node_modules'), 'dir');
  execFileSync('npm', ['run', 'build'], { cwd: tempRoot, stdio: 'pipe' });
  return join(tempRoot, 'dist');
}

async function browserUsesBundle(page: Page, bundle: string): Promise<void> {
  await page.waitForFunction(expected => performance.getEntriesByType('resource').some(entry => entry.name.endsWith(expected)), bundle);
}

test('@claim:service-worker-renewal replaces the legacy shell and reloads the current version offline', async ({ browser, isMobile }) => {
  test.skip(Boolean(isMobile), 'The exact desktop claim covers the shared service worker.');
  test.setTimeout(120_000);
  const temporaryRoot = await mkdtemp(join(tmpdir(), 'exam-bridge-sw-renewal-'));
  const serverHarness = staticServer(await buildLegacyDistribution(temporaryRoot));
  const context = await browser.newContext();

  try {
    const finalWorker = await readFile(join(FINAL_DIST, 'sw.js'), 'utf8');
    const fingerprint = await expectedBuildId(FINAL_DIST);
    expect(finalWorker).toContain(`const CACHE = 'exam-bridge-${fingerprint}'`);

    const origin = await serverHarness.listen();
    const page = await context.newPage();
    await page.goto(origin);
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await browserUsesBundle(page, appBundle(join(temporaryRoot, 'dist')));
    expect(await page.evaluate(() => caches.keys())).toEqual(['exam-bridge-v1']);

    serverHarness.setDir(FINAL_DIST);
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) throw new Error('missing service worker registration');
      const changed = new Promise<void>(resolveChanged => navigator.serviceWorker.addEventListener('controllerchange', () => resolveChanged(), { once: true }));
      await registration.update();
      await changed;
    });
    await page.reload();
    await browserUsesBundle(page, appBundle(FINAL_DIST));
    expect(await page.evaluate(() => caches.keys())).toEqual([`exam-bridge-${fingerprint}`]);

    await context.setOffline(true);
    await page.reload();
    await browserUsesBundle(page, appBundle(FINAL_DIST));
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Turn a syllabus into a study route.');
  } finally {
    await context.setOffline(false);
    await context.close();
    await serverHarness.close();
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
