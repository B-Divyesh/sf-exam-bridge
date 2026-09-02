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
assert.equal(config.routes.find(route => route.route === '/demo')?.rewrite, '/demo/index.html', '/demo must resolve to its metadata-specific app shell');
assert.equal(config.responseOverrides?.['404']?.rewrite, '/404.html', 'unknown routes must use the product 404');
assert.match(config.globalHeaders?.['Content-Security-Policy'] ?? '', /frame-ancestors 'none'/u, '404 responses need the global security policy');
assert.match(config.globalHeaders?.['Content-Security-Policy'] ?? '', /connect-src 'self'/u, 'the local-first planner must allow same-origin connections only');
assert.doesNotMatch(config.globalHeaders?.['Content-Security-Policy'] ?? '', /sociobot\.in/u, 'the removed billing path must not remain in the CSP');

const notFound = await readFile('public/404.html', 'utf8');
const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
assert.match(notFound, /<html lang="en">/u);
assert.equal(notFound.match(/<h1[ >]/gu)?.length, 1, '404 must have exactly one h1');
assert.match(notFound, /<main id="main" tabindex="-1">/u);
assert.match(notFound, /href="\/"/u, '404 must link home');
assert.doesNotMatch(notFound, /<(?:script|img|audio|video|iframe)\b[^>]+(?:src|href)="https?:\/\//u, '404 must not load third-party media or scripts');
assert.doesNotMatch(notFound, /<link\b(?=[^>]*rel="stylesheet")(?=[^>]*href="https?:\/\/)[^>]*>/u, '404 must not load a third-party stylesheet');
assert.match(notFound, new RegExp(`Built by Param Factory · v${packageJson.version.replaceAll('.', '\\.')}<`, 'u'), '404 footer version must match package.json');
assert.match(notFound, /Your saved plan has not changed\./u, '404 must retain the registered saved-plan promise');
assert.ok(ids.includes('not-found-plan-safety'), '404 saved-plan promise must stay registered');
for (const [name, file] of [['404', 'public/404.html'], ['Privacy', 'public/privacy/index.html'], ['Terms', 'public/terms/index.html']]) {
  const page = await readFile(file, 'utf8');
  for (const property of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    assert.match(page, new RegExp(`name="${property}"`, 'u'), `${name} must include ${property}`);
  }
  assert.match(page, /rel="canonical"/u, `${name} must include a canonical URL`);
  assert.match(page, /property="og:image"/u, `${name} must include an Open Graph image`);
  assert.equal(page.match(/<h1[ >]/gu)?.length, 1, `${name} must have exactly one h1`);
  assert.match(page, /<main id="main" tabindex="-1">/u, `${name} must expose a focusable main landmark`);
  assert.match(page, /<nav aria-label="Primary">/u, `${name} must use the shared primary navigation`);
  assert.match(page, /<footer class="site-footer">[\s\S]*href="\/privacy\/"[\s\S]*href="\/terms\/"/u, `${name} footer must link Privacy and Terms`);
}

const demoDocument = await readFile('demo/index.html', 'utf8');
assert.match(demoDocument, /<title>Demo — Exam Bridge<\/title>/u, '/demo must have a server-visible title');
assert.match(demoDocument, /rel="canonical" href="https:\/\/exam-bridge\.sociobot\.in\/demo"/u, '/demo must have a server-visible canonical URL');
assert.match(demoDocument, /property="og:title" content="Demo — Exam Bridge"/u, '/demo must have a server-visible Open Graph title');
assert.match(demoDocument, /property="og:url" content="https:\/\/exam-bridge\.sociobot\.in\/demo"/u, '/demo must have a server-visible Open Graph URL');
assert.match(demoDocument, /name="twitter:title" content="Demo — Exam Bridge"/u, '/demo must have a server-visible Twitter title');

const playwrightConfig = await readFile('playwright.config.ts', 'utf8');
assert.match(playwrightConfig, /command: 'npm run build && npm run preview'/u, 'claim commands must build before previewing');
assert.match(playwrightConfig, /reuseExistingServer: false/u, 'claim commands must not reuse an unknown preview');

const app = await readFile('src/main.ts', 'utf8');
const terms = await readFile('public/terms/index.html', 'utf8');
assert.match(app, /Try it with sample data/u);
assert.match(app, /Demo — sample data, nothing is saved/u);
assert.match(app, /demo:exam-bridge:/u);
assert.match(app, /searchParams\(location\.search\)\.get\('demo'\) === '1'|URLSearchParams\(location\.search\)\.get\('demo'\) === '1'/u, 'the isolated ?demo=1 route must remain supported');
assert.match(app, /Turn a syllabus into a <em>study route\.<\/em>/u, 'first-screen headline must state the tested job');
for (const requiredHeading of ['Study route order', 'Question references', 'Choose a starter template']) {
  assert.match(app, new RegExp(requiredHeading, 'u'), `planner must use the direct heading: ${requiredHeading}`);
}
assert.match(app, /<section id="how"[^>]*aria-labelledby="how-title"[^>]*>[\s\S]*?<h2 id="how-title">How it works<\/h2>[\s\S]*?<ol class="how-steps">[\s\S]*?<li>[\s\S]*?<li>[\s\S]*?<li>/u, 'How it works must be a headed semantic three-step list');
assert.ok(app.indexOf('${howItWorksSection()}') > app.indexOf('<div id="planner">${workspace()}</div>'), 'How it works must render after the product');
assert.doesNotMatch(app, /Your next pass|Practice bridge|Begin from a foundation map|starter map/iu, 'indirect and inconsistent template wording must stay removed');
assert.match(app, /ROUTE_FOCUS_KEY/u, 'app routes must retain their route-change focus handling');
assert.match(app, /id="menu-toggle"/u, 'main routes must expose a labelled mobile navigation menu');
assert.match(app, /id="primary-nav"/u, 'main routes must retain primary navigation destinations on mobile');
assert.match(app, /Use \$\{template\.name\} template/u, 'template actions must name the result they produce');
assert.match(app, /<div class="access-panel demo-access">/u, 'the template notice must be section content, not a nested complementary landmark');
assert.doesNotMatch(app, /<aside class="access-panel/u, 'the template notice must not create a nested complementary landmark');
for (const action of ['Add prerequisite', 'Attach question reference', 'Delete this plan']) {
  assert.match(app, new RegExp(`>${action}<`, 'u'), `planner action must name its result: ${action}`);
}
for (const templateName of ['Engineering foundations', 'Computer science foundations', 'Quantitative foundations']) {
  assert.match(app, new RegExp(`name: '${templateName}'`, 'u'), `the result-naming action must have a distinct ${templateName} template`);
}
assert.match(await readFile('public/route-focus.js', 'utf8'), /pageshow/u, 'static routes must restore heading focus on Back and Forward');
assert.doesNotMatch(app, /shortest path/iu, 'retired optimization copy must stay removed');
assert.doesNotMatch(app, /VITE_CHECKOUT_ENABLED|api\/v1\/products\/exam-bridge\/(?:checkout|verify)|checkoutUrl|checkoutEnabled|license-form|paidUnlocked/u, 'a removed billing path must not remain in application code');
assert.match(terms, /The planner, starter templates, CSV exports, and JSON backups are free\./u, 'terms must state the complete free scope');
await readFile('.factory/demo.md', 'utf8');
const copyAudit = await readFile('.factory/copy-audit.md', 'utf8');
assert.match(copyAudit, /No sentence exceeds 22 words\./u);
assert.match(copyAudit, /## Legal pages/u, 'copy audit must include the legal routes');
const catalogDescription = (await readFile('.factory/catalog-description.txt', 'utf8')).trim();
assert.ok(catalogDescription.length <= 120, 'catalog description must be at most 120 characters');
assert.match(catalogDescription, /^(?:Turn|Create|Build|Plan|Map|Organize|Convert)\b/u, 'catalog description must start with a verb');
for (const file of ['public/privacy/index.html', 'public/terms/index.html']) {
  const legalPage = await readFile(file, 'utf8');
  for (const paragraph of legalPage.matchAll(/<p(?: [^>]*)?>(.*?)<\/p>/gu)) {
    const text = paragraph[1].replace(/<[^>]+>/gu, ' ').replace(/&[^;]+;/gu, ' ').replace(/\s+/gu, ' ').trim();
    for (const sentence of text.split(/(?<=[.!?])\s+/u)) {
      const words = sentence.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
      assert.ok(words <= 22, `${file} has a legal sentence over 22 words: ${sentence}`);
    }
  }
}
const readme = await readFile('README.md', 'utf8');
const privacy = await readFile('public/privacy/index.html', 'utf8');
const visitorCopy = `${app}\n${readme}\n${privacy}\n${await readFile('index.html', 'utf8')}\n${notFound}`;
assert.doesNotMatch(visitorCopy, /\b(?:leverage|seamless|effortless|robust|powerful|intuitive|reimagine|supercharge|unlock|delightful|journey|ecosystem|AI-powered)\b/iu, 'visitor copy contains a banned marketing word');
assert.doesNotMatch(visitorCopy, /demo sandbox|browser storage/iu, 'visitor copy must explain local and demo behavior without implementation jargon');
assert.doesNotMatch(readme, /demo:exam-bridge/iu, 'README visitor guidance must not expose the internal demo key');
assert.doesNotMatch(privacy, /demo:exam-bridge|profile you/iu, 'Privacy must not expose an internal key or make an untested hosting-log assurance');
if (/without an account|\bNo accounts\b|No account, card/iu.test(visitorCopy)) {
  assert.ok(ids.includes('free-access'), 'visitor free-access promises must be registered as free-access');
}
const brief = JSON.parse(await readFile('.factory/brief.json', 'utf8'));
assert.equal(brief.monetization, 'free', 'the brief must not promise a paid tier without a working purchase path');
for (const id of ['not-found-plan-safety', 'starter-template-boundary', 'hosted-content-boundary', 'independent-tool', 'generated-illustration', 'free-access', 'service-worker-renewal']) {
  assert.ok(ids.includes(id), `${id} must register its visitor-facing boundary or provenance claim`);
}
const provenance = JSON.parse(await readFile('public/art-provenance.json', 'utf8'));
assert.equal(provenance.asset, '/assets/learning-topology.webp', 'provenance must identify the shipped illustration');
assert.equal(provenance.provenance, 'original generated illustration', 'provenance must identify original generated artwork');

console.log(`PASS: ${claims.length} registered claims, isolated demo contract, and product 404 policy`);
