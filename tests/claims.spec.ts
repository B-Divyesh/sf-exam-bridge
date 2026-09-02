import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openDemo(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Exam Bridge');
  await expect(page.locator('#app')).toHaveAttribute('data-app-mode', 'demo');
  await expect(page.locator('#app')).toHaveAttribute('aria-busy', 'false');
  await expect(page.getByText('Demo — sample data, nothing is saved', { exact: true })).toBeVisible();
}

async function leaveDemoForReadyPlanner(page: import('@playwright/test').Page): Promise<void> {
  await Promise.all([
    page.waitForURL('http://127.0.0.1:4173/', { waitUntil: 'load' }),
    page.locator('.demo-banner').getByRole('link', { name: 'Start for real' }).click(),
  ]);
  await expect(page.locator('#app')).toHaveAttribute('data-app-mode', 'real');
  await expect(page.locator('#app')).toHaveAttribute('aria-busy', 'false');
  await expect(page.locator('#setup-form')).toBeVisible();
}

test('@claim:demo-sandbox opens, resets, and leaves an isolated sample route', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('exam-bridge:plan:v1', 'real-plan-marker');
  });
  await page.reload();
  await page.getByRole('link', { name: 'Try it with sample data' }).click();

  await expect(page).toHaveURL(/\/demo\/?$/);
  await expect(page.locator('#workspace-title')).toHaveText('GATE ECE return plan');
  await expect(page.locator('.topic')).toHaveCount(6);
  const desktopWorkspace = await page.locator('.workspace').boundingBox();
  const desktopOverview = await page.locator('.route-overview').boundingBox();
  expect(desktopWorkspace, 'the populated workspace must be visible after the one sample click').not.toBeNull();
  expect(desktopOverview, 'the populated route summary must be visible after the one sample click').not.toBeNull();
  expect(desktopWorkspace!.y).toBeGreaterThanOrEqual(0);
  expect(desktopWorkspace!.y).toBeLessThan(900);
  expect(desktopOverview!.y + desktopOverview!.height).toBeLessThanOrEqual(900);
  expect(await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1'))).toBe('real-plan-marker');
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:')))).toEqual(['demo:exam-bridge:plan:v1']);

  await page.locator('.topic').first().getByLabel(/Confidence/).selectOption('ready');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('.topic').first().getByRole('heading', { level: 3 })).toHaveText('Control systems');
  await page.locator('.demo-banner').getByRole('link', { name: 'Start for real' }).click();

  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  expect(await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1'))).toBe('real-plan-marker');
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:')))).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo\/?$/);
  const mobileWorkspace = await page.locator('.workspace').boundingBox();
  const mobileOverview = await page.locator('.route-overview').boundingBox();
  expect(mobileWorkspace, 'the 390px sample workspace must be visible after one click').not.toBeNull();
  expect(mobileOverview, 'the 390px populated route summary must be visible after one click').not.toBeNull();
  expect(mobileWorkspace!.y).toBeGreaterThanOrEqual(0);
  expect(mobileWorkspace!.y).toBeLessThan(844);
  expect(mobileOverview!.y + mobileOverview!.height).toBeLessThanOrEqual(844);

  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Exam Bridge');
  await expect(page.getByText('Demo — sample data, nothing is saved', { exact: true })).toBeVisible();
  await expect(page.locator('.topic')).toHaveCount(6);
  expect(await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1'))).toBe('real-plan-marker');
});

test('@claim:not-found-plan-safety leaves the complete saved plan unchanged after a 404 visit', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Plan name').fill('Saved plan before 404');
  await page.getByLabel('Official source URL').fill('https://example.org/outline');
  await page.getByLabel(/Syllabus topics/).fill('Signals and systems\nControl systems');
  await page.getByRole('button', { name: /Map my syllabus/ }).click();
  const savedBefore = await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1'));
  expect(savedBefore).not.toBeNull();

  await page.goto('/404.html');
  await expect(page.locator('.lede')).toContainText('Your saved plan has not changed.');
  expect(await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1'))).toBe(savedBefore);

  await page.getByRole('link', { name: 'Open the planner' }).click();
  await expect(page.locator('#workspace-title')).toHaveText('Saved plan before 404');
  await expect(page.locator('.topic')).toHaveCount(2);
  expect(await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1'))).toBe(savedBefore);
});

test('@claim:local-private keeps demo edits local and makes no third-party requests', async ({ page }) => {
  const requests: { method: string; postData: string | null; url: string }[] = [];
  page.on('request', request => requests.push({ method: request.method(), postData: request.postData(), url: request.url() }));
  await openDemo(page);

  const firstTopic = page.locator('.topic').first();
  await firstTopic.getByLabel(/Question ID or note/).fill('Revision set · Q4');
  await firstTopic.getByRole('button', { name: 'Attach' }).click();
  await page.reload();
  await expect(page.getByText('Revision set · Q4', { exact: true })).toBeVisible();

  const storage = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
  expect(Object.keys(storage).every(key => key.startsWith('demo:exam-bridge:'))).toBe(true);
  const origin = new URL(page.url()).origin;
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.filter(request => new URL(request.url).origin !== origin)).toEqual([]);
  expect(requests.filter(request => request.method !== 'GET' || request.postData !== null)).toEqual([]);
  expect(requests.some(request => request.url.includes('Revision%20set') || request.url.includes('Q4'))).toBe(false);
});

test('@claim:offline-reload reloads the demo after the first visit with the network disabled', async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  const page = await context.newPage();
  try {
    await openDemo(page);
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.reload();
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#workspace-title')).toHaveText('GATE ECE return plan');
    await expect(page.getByText('You’re offline. Planning and exports still work; license checks wait for a connection.')).toBeVisible();
  } finally {
    await context.setOffline(false);
    await context.close();
  }
});

test('@claim:csv-export exports every sample topic with only selected prerequisites and complete practice references', async ({ page }) => {
  await openDemo(page);
  const control = page.locator('.topic').filter({ has: page.getByRole('heading', { level: 3, name: 'Control systems' }) });
  await control.getByLabel(/Question ID or note/).fill('2025 · Q42');
  await control.getByLabel('Link').fill('https://example.org/questions/42');
  await control.getByRole('button', { name: 'Attach' }).click();

  const pendingDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await pendingDownload;
  const path = await download.path();
  expect(path).not.toBeNull();
  const csv = await readFile(path!, 'utf8');
  const rows = csv.split('\n');
  expect(rows).toHaveLength(7);
  expect(rows[0]).toBe('"Order","Topic","Confidence","Prerequisites","Practice references","Completed references"');
  expect(csv).toContain('"Control systems"');
  expect(csv).toContain('"2024 · Engineering Mathematics · Q7"');
  const controlRow = rows.find(row => row.includes('"Control systems"'));
  expect(controlRow).toBeDefined();
  expect(controlRow).toContain('"Basic calculus"');
  expect(controlRow).not.toContain('Algebra and complex numbers');
  expect(controlRow).not.toContain('Units and dimensional analysis');
  expect(controlRow?.match(/Basic calculus/gu)).toHaveLength(1);
  expect(controlRow).toContain('2025 · Q42 (https://example.org/questions/42)');
});

test('@claim:json-backup-restore exports and restores the complete sample plan', async ({ page }) => {
  await openDemo(page);
  const pendingDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Back up JSON' }).click();
  const download = await pendingDownload;
  const path = await download.path();
  expect(path).not.toBeNull();
  const backup = await readFile(path!);

  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Use template' }).first().click();
  await expect(page.locator('#workspace-title')).toHaveText('Engineering foundations');
  await page.locator('#import-json').setInputFiles({ name: 'sample-backup.json', mimeType: 'application/json', buffer: backup });
  await expect(page.locator('.topic')).toHaveCount(6);
  await expect(page.getByText('2024 · Engineering Mathematics · Q7', { exact: true })).toBeVisible();
});

test('@claim:syllabus-route cleans headings and reorders the route by confidence', async ({ page }) => {
  await openDemo(page);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Start over' }).click();
  await page.getByLabel('Plan name').fill('Return plan');
  await page.getByLabel(/Syllabus topics/).fill('1. Engineering mathematics\n• Signals and systems\n2) Control systems\nengineering mathematics');
  await page.getByRole('button', { name: /Map my syllabus/ }).click();

  await expect(page.locator('.topic')).toHaveCount(3);
  await expect(page.locator('.topic').first().getByRole('heading', { level: 3 })).toHaveText('Engineering mathematics');
  await page.locator('.topic').first().getByLabel(/Confidence/).selectOption('ready');
  await expect(page.locator('.topic').first().getByRole('heading', { level: 3 })).toHaveText('Signals and systems');
  await expect(page.locator('.topic').last().getByRole('heading', { level: 3 })).toHaveText('Engineering mathematics');
});

test('@claim:templates loads an editable starter template inside demo storage', async ({ page }) => {
  await openDemo(page);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Use template' }).first().click();
  await expect(page.locator('#workspace-title')).toHaveText('Engineering foundations');
  await expect(page.locator('.topic')).toHaveCount(5);
  expect(await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('demo:exam-bridge:plan:v1'))).toContain('Engineering foundations');
});

test('@claim:starter-template-boundary loads an editable starter template rather than an official syllabus', async ({ page }) => {
  await openDemo(page);
  await expect(page.getByText('A reusable starter template—not an official syllabus.').first()).toBeVisible();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Use template' }).first().click();
  await expect(page.locator('#workspace-title')).toHaveText('Engineering foundations');
  await expect(page.getByText('Personal outline · no source link added')).toBeVisible();
  await expect(page.locator('.topic').first().getByLabel(/Confidence/)).toBeEnabled();
  expect(await page.evaluate(() => localStorage.getItem('demo:exam-bridge:plan:v1'))).toContain('Engineering foundations');
  expect(await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1'))).toBeNull();
});

test('@claim:hosted-content-boundary shows question references without hosting question text or coaching notes', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await openDemo(page);
  await expect(page.getByText('Exam Bridge does not host exam questions or coaching notes.')).toBeVisible();
  await expect(page.getByText('2024 · Engineering Mathematics · Q7', { exact: true })).toBeVisible();
  await expect(page.getByText('2023 · Network Theory · Q18', { exact: true })).toBeVisible();
  await expect(page.locator('textarea')).toHaveCount(0);
  await expect(page.locator('.practice-list').filter({ hasText: 'Q7' })).toHaveCount(1);
  const routeText = await page.locator('.route-list').innerText();
  expect(routeText).not.toMatch(/coaching notes|question text:/iu);
  const origin = new URL(page.url()).origin;
  expect(requests.filter(url => new URL(url).origin !== origin)).toEqual([]);
  expect(requests.filter(url => /(?:question|coaching|content)\//iu.test(new URL(url).pathname))).toEqual([]);
});

test('@claim:independent-tool shows the non-endorsement boundary without authority services or branding', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await openDemo(page);
  await expect(page.getByText('Exam Bridge is not endorsed by any exam authority.')).toBeVisible();
  const authorityLinks = page.locator('a[href*="authority" i], a[href*="exam" i], a[href*="gate" i]');
  await expect(authorityLinks).toHaveCount(0);
  const origin = new URL(page.url()).origin;
  expect(requests.filter(url => new URL(url).origin !== origin)).toEqual([]);
  expect(requests.filter(url => /(?:auth|authority|exam)\//iu.test(new URL(url).pathname))).toEqual([]);
});

test('@claim:generated-illustration displays the documented original generated artwork', async ({ page }) => {
  await page.goto('/');
  const artwork = page.locator('.hero-figure img');
  await expect(artwork).toHaveAttribute('src', '/assets/learning-topology.webp');
  await expect(page.locator('footer')).toContainText('Original generated illustration');
  const provenance = await page.evaluate(async () => {
    const response = await fetch('/art-provenance.json');
    return { sameOrigin: new URL(response.url).origin === location.origin, body: await response.json() };
  });
  expect(provenance.sameOrigin).toBe(true);
  expect(provenance.body).toMatchObject({
    asset: '/assets/learning-topology.webp',
    provenance: 'original generated illustration',
    generator: expect.stringContaining('Azure OpenAI'),
  });
});

test('@claim:free-access provides the planner, CSV, and JSON without account, card, checkout, or payment', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await openDemo(page);
  await leaveDemoForReadyPlanner(page);

  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(page.getByRole('link', { name: /checkout|buy/i })).toHaveCount(0);
  await expect(page.locator([
    'input[type="password"]',
    'input[autocomplete="email"]',
    'input[autocomplete="cc-number"]',
    'input[name*="card" i]',
  ].join(', '))).toHaveCount(0);
  const planName = page.getByLabel('Plan name');
  const syllabus = page.getByLabel(/Syllabus topics/);
  await planName.fill('Free return plan');
  await syllabus.fill('Signals and systems\nControl systems');
  await expect(planName).toHaveValue('Free return plan');
  await expect(syllabus).toHaveValue('Signals and systems\nControl systems');
  await page.getByRole('button', { name: /Map my syllabus/ }).click();
  await expect.poll(() => page.evaluate(() => {
    const stored = localStorage.getItem('exam-bridge:plan:v1');
    return stored ? JSON.parse(stored).topics.map((topic: { title: string }) => topic.title) : [];
  })).toEqual(['Signals and systems', 'Control systems']);
  await expect(page.locator('#workspace-title')).toHaveText('Free return plan');
  await expect(page.locator('.topic')).toHaveCount(2);

  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  await expect((await csvDownload).suggestedFilename()).toMatch(/-route\.csv$/u);
  const jsonDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Back up JSON' }).click();
  await expect((await jsonDownload).suggestedFilename()).toMatch(/-backup\.json$/u);
  await expect(page.getByRole('link', { name: 'Try in demo' })).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Export CSV' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Back up JSON' })).toBeEnabled();

  const origin = new URL(page.url()).origin;
  expect(requests.filter(url => new URL(url).origin !== origin)).toEqual([]);
  expect(requests.filter(url => /\/(?:auth|login|checkout|payment)(?:[/?#]|$)/iu.test(new URL(url).pathname))).toEqual([]);
});

test('@claim:paid-template-license verifies one license, caches it for 24 hours, and enables every reusable template', async ({ page }) => {
  let checks = 0;
  await page.route('**/api/v1/products/exam-bridge/verify?license=valid-template-license', async route => {
    checks += 1;
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }),
    });
  });
  await page.goto('/');

  await expect(page.locator('#paid-note')).toContainText('One-time ₹499 license');
  await page.getByLabel('Have a license?').fill('valid-template-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByRole('heading', { name: 'Template license active' })).toBeVisible();
  expect(checks).toBe(1);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:exam-bridge'))).toBe('valid-template-license');
  await expect(page.getByRole('button', { name: 'Use template' })).toHaveCount(3);

  await page.getByRole('button', { name: 'Use template' }).first().click();
  await expect(page.locator('#workspace-title')).toHaveText('Engineering foundations');
  await expect(page.locator('.topic')).toHaveCount(5);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await expect(page.getByRole('heading', { name: 'Template license active' })).toBeVisible();
  expect(checks).toBe(1);
  try {
    await page.context().setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Template license active' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Use template' })).toHaveCount(3);
    expect(checks).toBe(1);
  } finally {
    await page.context().setOffline(false);
  }
});

test('@claim:refund-revokes-license removes template access after Sociobot reports a revoked license', async ({ page }) => {
  let checks = 0;
  await page.route('**/api/v1/products/exam-bridge/verify?license=refunded-license', async route => {
    checks += 1;
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ valid: false, reason: 'revoked', expires_at: null }),
    });
  });
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('sb_license:exam-bridge', 'refunded-license');
    localStorage.setItem('exam-bridge:license-verdict', JSON.stringify({ valid: true, checkedAt: Date.now(), expiresAt: null }));
  });
  await page.reload();

  await expect(page.getByRole('heading', { name: 'Template license active' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Use template' })).toHaveCount(3);
  expect(checks).toBe(0);
  await page.getByRole('button', { name: 'Recheck license' }).click();

  await expect(page.getByRole('heading', { name: 'Reuse three planning templates' })).toBeVisible();
  await expect(page.locator('.license-notice')).toHaveText('This license is not active. Check the token or buy a new license when purchases open.');
  await expect(page.getByRole('button', { name: 'Use template' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Try in demo' })).toHaveCount(3);
  expect(checks).toBe(1);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('exam-bridge:license-verdict') ?? '{}'))).toMatchObject({ valid: false });
});

test('@claim:checkout-registration-gate keeps unavailable checkout closed while showing price, previews, and license restore', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');

  await expect(page.locator('#paid-note')).toContainText('One-time ₹499 license');
  await expect(page.locator('#purchase-status')).toHaveText('New purchases are not open yet. Checkout needs operator activation.');
  await expect(page.getByRole('link', { name: /buy|checkout/i })).toHaveCount(0);
  await expect(page.getByLabel('Have a license?')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Verify license' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try in demo' })).toHaveCount(3);
  const origin = new URL(page.url()).origin;
  expect(requests.filter(url => new URL(url).origin !== origin)).toEqual([]);
});

test('@claim:accessible-responsive supports keyboard, themes, reduced motion, and 390px screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openDemo(page);

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to planner' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  expect(await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))).toEqual({ width: 390, scroll: 390 });
  const animationSeconds = await page.locator('.topic').first().evaluate(element => Number.parseFloat(getComputedStyle(element).animationDuration));
  expect(animationSeconds).toBeLessThanOrEqual(0.00001);

  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Switch color theme' }).click();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }

  const undersized = await page.locator('a, button, .file-button, .check-list label, .practice-list li > label').evaluateAll(elements => elements
    .filter(element => {
      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden';
    })
    .map(element => {
      const rect = element.getBoundingClientRect();
      return { name: (element as HTMLElement).innerText || element.getAttribute('aria-label'), width: rect.width, height: rect.height };
    })
    .filter(target => target.width < 44 || target.height < 44));
  expect(undersized).toEqual([]);
});
