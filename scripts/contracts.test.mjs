import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const claims = JSON.parse(await readFile('.factory/claims.json', 'utf8'));
assert.ok(Array.isArray(claims) && claims.length > 0, 'claims manifest must be a non-empty array');
const ids = claims.map(claim => claim.id);
assert.equal(new Set(ids).size, ids.length, 'claim IDs must be unique');
for (const claim of claims) {
  for (const field of ['id', 'claim', 'where', 'test', 'sandbox']) assert.equal(typeof claim[field], 'string', `${claim.id || 'claim'} needs ${field}`);
  assert.match(claim.test, new RegExp(`--grep @claim:${claim.id}$`), `${claim.id} must expose its exact tagged test command`);
}

const testFiles = (await readdir('tests')).filter(file => file.endsWith('.spec.ts'));
const testSource = (await Promise.all(testFiles.map(file => readFile(`tests/${file}`, 'utf8')))).join('\n');
for (const id of ids) {
  const matches = testSource.match(new RegExp(`@claim:${id}(?![a-z0-9-])`, 'gu')) ?? [];
  assert.equal(matches.length, 1, `${id} must have exactly one tagged Playwright test`);
}

const config = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8'));
assert.equal(config.routes.find(route => route.route === '/demo')?.rewrite, '/index.html', '/demo must resolve to the app shell');
assert.equal(config.responseOverrides?.['404']?.rewrite, '/404.html', 'unknown routes must use the product 404');
assert.match(config.globalHeaders?.['Content-Security-Policy'] ?? '', /frame-ancestors 'none'/u, '404 responses need the global security policy');

const notFound = await readFile('public/404.html', 'utf8');
assert.match(notFound, /<html lang="en">/u);
assert.equal(notFound.match(/<h1[ >]/gu)?.length, 1, '404 must have exactly one h1');
assert.match(notFound, /<main id="main">/u);
assert.match(notFound, /href="\/"/u, '404 must link home');
assert.doesNotMatch(notFound, /(?:src|href)="https?:\/\//u, '404 must not load third-party resources');

const app = await readFile('src/main.ts', 'utf8');
assert.match(app, /Try it with sample data/u);
assert.match(app, /Demo — sample data, nothing is saved/u);
assert.match(app, /demo:exam-bridge:/u);
await readFile('.factory/demo.md', 'utf8');
const copyAudit = await readFile('.factory/copy-audit.md', 'utf8');
assert.match(copyAudit, /No sentence exceeds 22 words\./u);
const visitorCopy = `${app}\n${await readFile('README.md', 'utf8')}\n${await readFile('index.html', 'utf8')}\n${notFound}`;
assert.doesNotMatch(visitorCopy, /\b(?:leverage|seamless|effortless|robust|powerful|intuitive|reimagine|supercharge|unlock|delightful|journey|ecosystem|AI-powered)\b/iu, 'visitor copy contains a banned marketing word');

console.log(`PASS: ${claims.length} registered claims, isolated demo contract, and product 404 policy`);
