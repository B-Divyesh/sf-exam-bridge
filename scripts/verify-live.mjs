import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const baseUrl = (process.argv[2] ?? 'https://exam-bridge.sociobot.in').replace(/\/$/u, '');
const outputPath = process.argv[3] ?? '.factory/polish-4-artifacts/live-product-qa.json';
const origin = new URL(baseUrl).origin;
const report = { baseUrl, checkedAt: new Date().toISOString(), routes: [], product: {}, offline: {} };
const browser = await chromium.launch();
const expectedTitles = new Map([
  ['/', 'Exam Bridge — turn a syllabus into a study route'],
  ['/demo', 'Demo — Exam Bridge'],
  ['/privacy/', 'Privacy — Exam Bridge'],
  ['/terms/', 'Terms — Exam Bridge'],
  ['/polish-4-missing-route', 'Page not found — Exam Bridge'],
]);

try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    for (const route of ['/', '/demo', '/privacy/', '/terms/', '/polish-4-missing-route']) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(String(error)));
      page.on('console', message => {
        if (message.type() === 'error' && !message.text().includes('404')) errors.push(message.text());
      });
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
      const expectedStatus = route.includes('missing-route') ? 404 : 200;
      assert.equal(response?.status(), expectedStatus, `${route} must return ${expectedStatus}`);
      const structure = await page.evaluate(() => ({
        title: document.title,
        lang: document.documentElement.lang,
        h1: document.querySelectorAll('h1').length,
        main: document.querySelectorAll('main').length,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
        openGraphTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
        twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ?? '',
        imagesMissingAlt: [...document.querySelectorAll('img')].filter(image => !image.hasAttribute('alt')).length,
      }));
      assert.equal(structure.title, expectedTitles.get(route));
      assert.equal(structure.lang, 'en');
      assert.equal(structure.h1, 1);
      assert.equal(structure.main, 1);
      assert.ok(structure.canonical.startsWith(origin));
      assert.ok(structure.description.length > 0);
      assert.ok(structure.openGraphTitle.length > 0);
      assert.ok(structure.twitterTitle.length > 0);
      assert.equal(structure.imagesMissingAlt, 0);
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      assert.deepEqual(axe.violations, [], `${route} at ${viewport.width}px must have no WCAG A/AA axe findings`);
      assert.deepEqual(errors, [], `${route} at ${viewport.width}px must have no console or page errors`);
      report.routes.push({
        route,
        viewport: viewport.width,
        status: response?.status(),
        ...structure,
        axeViolations: axe.violations.length,
        errors,
      });
      await context.close();
    }
  }

  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'allow' });
  const page = await context.newPage();
  const requests = [];
  const errors = [];
  page.on('request', request => requests.push(request.url()));
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('exam-bridge:plan:v1', 'LIVE-REAL-PLAN-MARKER');
  });
  await page.reload({ waitUntil: 'networkidle' });
  const actionBox = await page.getByRole('link', { name: 'Try it with sample data' }).boundingBox();
  const factsBox = await page.locator('.hero-facts').boundingBox();
  assert.ok(actionBox && actionBox.y + actionBox.height <= 844, 'the sample action must fit the first mobile viewport');
  assert.ok(factsBox && factsBox.y + factsBox.height <= 844, 'the three facts must fit the first mobile viewport');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.waitForURL(/\/demo\/?$/u);
  assert.equal(await page.locator('.topic').count(), 6, 'one click must open six sample topics');
  assert.equal(await page.locator('.access-panel').evaluate(element => element.tagName), 'DIV');
  assert.equal(await page.locator('aside.access-panel').count(), 0, 'the template notice must not be a nested landmark');
  assert.equal(await page.locator('.demo-banner').innerText().then(text => text.includes('Demo changes stay separate from your plan and are removed when you choose Start for real.')), true);
  assert.equal(await page.locator('.action-note').innerText().then(text => text.includes('Your demo changes stay separate from your plan.')), true);
  assert.equal(await page.locator('.save-state').innerText().then(text => text.includes('Sample route loaded. Demo changes are separate from your plan.')), true);
  assert.deepEqual(await page.locator('form[data-action="add-prerequisite"] button').allTextContents(), Array(6).fill('Add prerequisite'));
  assert.deepEqual(await page.locator('form[data-action="add-practice"] button').allTextContents(), Array(6).fill('Attach question reference'));
  assert.equal(await page.getByRole('button', { name: 'Delete this plan', exact: true }).count(), 1);
  assert.equal(await page.getByRole('button', { name: /^(?:Add|Attach|Start over)$/u }).count(), 0);
  assert.equal(await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1')), 'LIVE-REAL-PLAN-MARKER');
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:'))), ['demo:exam-bridge:plan:v1']);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  assert.equal(await page.locator('.topic').first().getByRole('heading', { level: 3 }).innerText(), 'Control systems');
  await page.locator('.demo-banner').getByRole('link', { name: 'Start for real' }).click();
  await page.waitForURL(`${baseUrl}/`);
  assert.equal(await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1')), 'LIVE-REAL-PLAN-MARKER');
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:'))), []);
  assert.equal((await page.locator('body').innerText()).includes('v1.1.1'), true);
  await page.goto(`${baseUrl}/?demo=1`, { waitUntil: 'networkidle' });
  assert.equal(await page.title(), 'Demo — Exam Bridge');
  assert.equal(await page.locator('.topic').count(), 6);
  assert.equal(await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1')), 'LIVE-REAL-PLAN-MARKER');
  await page.goto(`${baseUrl}/privacy/`, { waitUntil: 'networkidle' });
  const privacyText = await page.locator('main').innerText();
  assert.equal(privacyText.includes('We do not use these logs to profile you.'), false);
  assert.equal(privacyText.includes('demo:exam-bridge:'), false);
  assert.equal(privacyText.includes('browser storage'), false);
  assert.equal(await page.locator('footer a[href="/privacy/"]').count(), 1);
  assert.equal(await page.locator('footer a[href="/terms/"]').count(), 1);
  assert.deepEqual(errors, []);
  assert.deepEqual(requests.filter(url => new URL(url).origin !== origin), []);
  report.product = {
    firstScreenActionBottom: actionBox.y + actionBox.height,
    firstScreenFactsBottom: factsBox.y + factsBox.height,
    demoTopics: 6,
    directDemoQuery: true,
    demoIsolationResetExit: true,
    resultNamedActions: true,
    templateNoticeElement: 'DIV',
    privacyAssuranceRemoved: true,
    sameOriginRequests: true,
    consoleErrors: errors,
  };
  await context.close();

  const focusContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const focusPage = await focusContext.newPage();
  await focusPage.goto(`${baseUrl}/`);
  await focusPage.locator('header').getByRole('link', { name: 'Demo', exact: true }).click();
  await focusPage.waitForURL(/\/demo\/?$/u);
  assert.equal(await focusPage.locator('#workspace-title').evaluate(element => element === document.activeElement), true);
  await focusPage.goBack();
  assert.equal(await focusPage.locator('h1').evaluate(element => element === document.activeElement), true);
  report.product.routeFocus = true;
  await focusContext.close();

  const linkContext = await browser.newContext();
  const linkPage = await linkContext.newPage();
  const links = new Set();
  for (const route of ['/', '/demo', '/privacy/', '/terms/', '/404.html']) {
    await linkPage.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    const routeLinks = await linkPage.locator('a[href]').evaluateAll(anchors => anchors.map(anchor => anchor.href));
    for (const href of routeLinks) {
      const url = new URL(href);
      if (url.origin === origin) {
        url.hash = '';
        links.add(url.href);
      }
    }
  }
  const linkChecks = [];
  for (const url of [...links].sort()) {
    const response = await linkContext.request.get(url);
    assert.ok(response.status() >= 200 && response.status() < 400, `${url} must resolve without an error`);
    linkChecks.push({ url, status: response.status() });
  }
  report.product.linkChecks = linkChecks;
  await linkContext.close();

  const offlineContext = await browser.newContext({ serviceWorkers: 'allow' });
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(`${baseUrl}/demo`, { waitUntil: 'networkidle' });
  await offlinePage.evaluate(async () => { await navigator.serviceWorker.ready; });
  await offlinePage.reload({ waitUntil: 'networkidle' });
  await offlinePage.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await offlineContext.setOffline(true);
  await offlinePage.reload({ waitUntil: 'domcontentloaded' });
  assert.equal(await offlinePage.locator('.topic').count(), 6);
  assert.equal(await offlinePage.getByText('You’re offline. Planning and exports still work in this browser.').isVisible(), true);
  report.offline = { topics: 6, noticeVisible: true };
  await offlineContext.setOffline(false);
  await offlineContext.close();
} finally {
  await browser.close();
}

await mkdir(new URL('../.factory/polish-4-artifacts/', import.meta.url), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`PASS: live polish checks written to ${outputPath}`);
