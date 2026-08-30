import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openDemo(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Exam Bridge');
  await expect(page.getByText('Demo — sample data, nothing is saved', { exact: true })).toBeVisible();
}

test('@claim:demo-sandbox opens, resets, and leaves an isolated sample route', async ({ page }) => {
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
  expect(await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1'))).toBe('real-plan-marker');
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:')))).toEqual(['demo:exam-bridge:plan:v1']);

  await page.locator('.topic').first().getByLabel(/Confidence/).selectOption('ready');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('.topic').first().getByRole('heading', { level: 3 })).toHaveText('Control systems');
  await page.locator('.demo-banner').getByRole('link', { name: 'Start for real' }).click();

  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  expect(await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1'))).toBe('real-plan-marker');
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:')))).toEqual([]);
});

test('@claim:local-private keeps demo edits local and makes no third-party requests', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await openDemo(page);

  const firstTopic = page.locator('.topic').first();
  await firstTopic.getByLabel(/Question ID or note/).fill('Revision set · Q4');
  await firstTopic.getByRole('button', { name: 'Attach' }).click();
  await page.reload();
  await expect(page.getByText('Revision set · Q4', { exact: true })).toBeVisible();

  const storage = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
  expect(Object.keys(storage).every(key => key.startsWith('demo:exam-bridge:'))).toBe(true);
  expect(Object.keys(storage)).not.toContain('sb_license:exam-bridge');
  const origin = new URL(page.url()).origin;
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.filter(url => new URL(url).origin !== origin)).toEqual([]);
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
    await expect(page.getByText('You’re offline. Planning and exports still work; license checks will resume when connected.')).toBeVisible();
  } finally {
    await context.setOffline(false);
    await context.close();
  }
});

test('@claim:csv-export exports one CSV row for every sample topic', async ({ page }) => {
  await openDemo(page);
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

test('@claim:templates loads an editable foundation map inside demo storage', async ({ page }) => {
  await openDemo(page);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Use template' }).first().click();
  await expect(page.locator('#workspace-title')).toHaveText('Engineering foundations');
  await expect(page.locator('.topic')).toHaveCount(5);
  expect(await page.evaluate(() => localStorage.getItem('exam-bridge:plan:v1'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('demo:exam-bridge:plan:v1'))).toContain('Engineering foundations');
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
