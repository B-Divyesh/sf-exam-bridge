import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const CACHE_PREFIX = 'exam-bridge-';

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }));
  return paths.flat();
}

function publicPath(file, outDir) {
  const path = relative(outDir, file).split(sep).join('/');
  if (path === 'index.html') return '/';
  if (path.endsWith('/index.html')) return `/${path.slice(0, -'index.html'.length)}`;
  return `/${path}`;
}

function isPrecacheFile(file) {
  return /\.(?:html|css|js|svg|webp|webmanifest)$/u.test(file);
}

/**
 * Create the worker after Vite has written every client file. The cache key is
 * a SHA-256 fingerprint of the exact distribution (except the worker itself,
 * which necessarily contains that fingerprint). That makes a changed release
 * a changed worker, without a manual version bump to forget.
 */
export async function writeServiceWorker(outDir) {
  const files = (await filesIn(outDir)).filter(file => !file.endsWith(`${sep}sw.js`)).sort();
  const hash = createHash('sha256');
  for (const file of files) {
    hash.update(publicPath(file, outDir));
    hash.update('\0');
    hash.update(await readFile(file));
    hash.update('\0');
  }
  const buildId = hash.digest('hex').slice(0, 20);
  const shell = files.filter(isPrecacheFile).map(file => publicPath(file, outDir));
  const contents = `// Generated from the final Exam Bridge distribution. Do not edit.\nconst CACHE = '${CACHE_PREFIX}${buildId}';\nconst SHELL = ${JSON.stringify(shell)};\n\nself.addEventListener('install', event => event.waitUntil(\n  caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())\n));\n\nself.addEventListener('activate', event => event.waitUntil(\n  caches.keys().then(keys => Promise.all(keys\n    .filter(key => key.startsWith('${CACHE_PREFIX}') && key !== CACHE)\n    .map(key => caches.delete(key))\n  )).then(() => self.clients.claim())\n));\n\nself.addEventListener('fetch', event => {\n  const { request } = event;\n  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;\n  if (request.mode === 'navigate') {\n    event.respondWith(fetch(request).then(response => {\n      const copy = response.clone();\n      caches.open(CACHE).then(cache => cache.put('/', copy));\n      return response;\n    }).catch(() => caches.match(request).then(hit => hit || caches.match('/'))));\n    return;\n  }\n  event.respondWith(caches.match(request).then(hit => hit || fetch(request).then(response => {\n    const copy = response.clone();\n    caches.open(CACHE).then(cache => cache.put(request, copy));\n    return response;\n  })));\n});\n`;
  await writeFile(join(outDir, 'sw.js'), contents);
  return { buildId, shell };
}

