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
  await expect(page.locator('.demo-banner')).toContainText('Demo changes stay separate from your plan and are removed when you choose Start for real.');
  await expect(page.locator('.action-note')).toContainText('Your demo changes stay separate from your plan.');
  await expect(page.locator('.save-state')).toContainText('Sample route loaded. Demo changes are separate from your plan.');
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
  await expect(page.locator('.save-state')).toContainText('Sample route reset. Demo changes are separate from your plan.');
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
  await firstTopic.getByRole('button', { name: 'Attach question reference' }).click();
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
    await expect(page.getByText('You’re offline. Planning and exports still work in this browser.')).toBeVisible();
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
  await control.getByRole('button', { name: 'Attach question reference' }).click();

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
  await page.getByRole('button', { name: 'Use Engineering foundations template' }).click();
  await expect(page.locator('#workspace-title')).toHaveText('Engineering foundations');
  await page.locator('#import-json').setInputFiles({ name: 'sample-backup.json', mimeType: 'application/json', buffer: backup });
  await expect(page.locator('.topic')).toHaveCount(6);
  await expect(page.getByText('2024 · Engineering Mathematics · Q7', { exact: true })).toBeVisible();
});

test('@claim:syllabus-route cleans headings and reorders the route by confidence', async ({ page }) => {
  await openDemo(page);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete this plan' }).click();
  await page.getByLabel('Plan name').fill('Return plan');
  await page.getByLabel(/Syllabus topics/).fill('1. Engineering mathematics\n• Signals and systems\n2) Control systems\nengineering mathematics');
  await page.getByRole('button', { name: /Map my syllabus/ }).click();

  await expect(page.locator('.topic')).toHaveCount(3);
  await expect(page.locator('.topic').first().getByRole('heading', { level: 3 })).toHaveText('Engineering mathematics');
  await page.locator('.topic').first().getByLabel(/Confidence/).selectOption('ready');
  await expect(page.locator('.topic').first().getByRole('heading', { level: 3 })).toHaveText('Signals and systems');
  await expect(page.locator('.topic').last().getByRole('heading', { level: 3 })).toHaveText('Engineering mathematics');
});

test('@claim:templates loads every editable starter template inside demo storage', async ({ page }) => {
  await openDemo(page);
  for (const [button, title, count] of [
    ['Use Engineering foundations template', 'Engineering foundations', 5],
    ['Use Computer science foundations template', 'Computer science foundations', 7],
    ['Use Quantitative foundations template', 'Quantitative foundations', 6],
  ] as const) {
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: button }).click();
    await expect(page.locator('#workspace-title')).toHaveText(title);
    await expect(page.locator('.topic')).toHaveCount(count);
  }
  expect(await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('demo:exam-bridge:plan:v1'))).toContain('Quantitative foundations');
});

test('@claim:starter-template-boundary loads an editable starter template rather than an official syllabus', async ({ page }) => {
  await openDemo(page);
  await expect(page.getByText('A reusable starter template—not an official syllabus.').first()).toBeVisible();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Use Engineering foundations template' }).click();
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

test('@claim:free-access provides the planner, templates, CSV, and JSON without account, card, checkout, payment, or license', async ({ page }) => {
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
  await expect(page.getByRole('button', { name: 'Use Engineering foundations template' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Use Computer science foundations template' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Use Quantitative foundations template' })).toBeEnabled();
  for (const [button, title, count] of [
    ['Use Engineering foundations template', 'Engineering foundations', 5],
    ['Use Computer science foundations template', 'Computer science foundations', 7],
    ['Use Quantitative foundations template', 'Quantitative foundations', 6],
  ] as const) {
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: button }).click();
    await expect(page.locator('#workspace-title')).toHaveText(title);
    await expect(page.locator('.topic')).toHaveCount(count);
  }
  await expect(page.getByRole('button', { name: 'Export CSV' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Back up JSON' })).toBeEnabled();

  const origin = new URL(page.url()).origin;
  expect(requests.filter(url => new URL(url).origin !== origin)).toEqual([]);
  expect(requests.filter(url => /\/(?:auth|login|checkout|payment)(?:[/?#]|$)/iu.test(new URL(url).pathname))).toEqual([]);
});

test('@claim:accessible-responsive supports keyboard, themes, reduced motion, and 390px screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openDemo(page);

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to planner' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.locator('#primary-nav')).toHaveAttribute('data-open', 'true');
  for (const name of ['Demo', 'How it works', 'Templates', 'Privacy']) {
    await expect(page.locator('#primary-nav').getByRole('link', { name, exact: true })).toBeVisible();
  }
  expect(await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))).toEqual({ width: 390, scroll: 390 });
  const animationSeconds = await page.locator('.topic').first().evaluate(element => Number.parseFloat(getComputedStyle(element).animationDuration));
  expect(animationSeconds).toBeLessThanOrEqual(0.00001);

  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Switch color theme' }).click();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  }

  const undersized = await page.locator('a, button, .file-button, .check-list label, .practice-list li > label').evaluateAll(elements => elements
    .filter(element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    })
    .map(element => {
      const rect = element.getBoundingClientRect();
      return { name: (element as HTMLElement).innerText || element.getAttribute('aria-label'), width: rect.width, height: rect.height };
  })
    .filter(target => target.width < 44 || target.height < 44));
  expect(undersized).toEqual([]);
  await page.locator('#primary-nav').getByRole('link', { name: 'Demo', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Menu' })).toBeFocused();
  await page.setViewportSize({ width: 393, height: 851 });
  expect(await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))).toEqual({ width: 393, scroll: 393 });
  const actionBoxes = await page.locator('.demo-actions > *').evaluateAll(elements => elements.map(element => {
    const box = element.getBoundingClientRect();
    return { left: box.left, right: box.right, width: box.width };
  }));
  expect(actionBoxes).toHaveLength(2);
  expect(actionBoxes.every(box => box.left >= 0 && box.right <= 393 && box.width >= 44)).toBe(true);
});
