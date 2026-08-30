import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('builds and updates a complete local study route', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await page.getByLabel('Plan name').fill('My electronics return');
  await page.getByLabel('Official source URL').fill('https://example.org/official-outline');
  await page.getByLabel(/Syllabus topics/).fill('1. Engineering mathematics\n2. Signals and systems\n3. Control systems');
  await page.getByRole('button', { name: /Map my syllabus/ }).click();

  await expect(page.getByRole('heading', { name: 'My electronics return' })).toBeVisible();
  await expect(page.locator('.topic')).toHaveCount(3);
  await page.locator('.topic').first().getByLabel(/Confidence/).selectOption('practising');
  await expect(page.locator('.topic').last().getByLabel(/Confidence/)).toHaveValue('practising');

  const first = page.locator('.topic').first();
  await first.getByLabel(/Question ID or note/).fill('2023 · Q14');
  await first.getByRole('button', { name: 'Attach' }).click();
  await expect(page.getByText('2023 · Q14', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('2023 · Q14', { exact: true })).toBeVisible();
});

test('@claim:topic-cap prevents a topic 81 mutation and keeps the maximum plan available after reload', async ({ page }) => {
  await page.goto('/demo');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Start over' }).click();
  const maximumTopics = Array.from({ length: 80 }, (_, index) => `Topic ${index + 1}`).join('\n');
  await page.getByLabel(/Syllabus topics/).fill(maximumTopics);
  await page.getByRole('button', { name: /Map my syllabus/ }).click();

  await expect(page.locator('.topic')).toHaveCount(80);
  const addTopic = page.getByRole('button', { name: 'Add topic' });
  await expect(addTopic).toBeDisabled();
  await expect(page.getByText('Maximum 80 topics reached.')).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('demo:exam-bridge:plan:v1') || '{}').topics.length)).toBe(80);

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Back up JSON' }).click();
  const backup = await download;
  expect((await backup.createReadStream())?.readable).toBe(true);

  await page.reload();
  await expect(page.locator('.topic')).toHaveCount(80);
  await expect(page.locator('#setup-form')).toHaveCount(0);
});

test('recovers an over-limit legacy plan instead of hiding it after an upgrade', async ({ page }) => {
  await page.evaluate(() => {
    const now = new Date().toISOString();
    const topics = Array.from({ length: 81 }, (_, index) => ({
      id: `legacy-${index}`,
      title: `Legacy topic ${index + 1}`,
      confidence: 'new',
      suggested: [],
      prerequisites: [],
      practice: [],
    }));
    localStorage.setItem('exam-bridge:plan:v1', JSON.stringify({
      version: 1, examName: 'Recovered plan', sourceUrl: '', topics, createdAt: now, updatedAt: now,
    }));
  });
  await page.reload();
  await expect(page.locator('.topic')).toHaveCount(81);
  await expect(page.locator('.plan-limit-notice')).toContainText('This restored plan has 81 topics');
  await expect(page.getByRole('button', { name: 'Add topic' })).toBeDisabled();
});

test('validates the empty route and has no serious accessibility findings', async ({ page }) => {
  await page.getByLabel(/Syllabus topics/).fill('Only one topic');
  await page.getByRole('button', { name: /Map my syllabus/ }).click();
  await expect(page.getByRole('alert')).toContainText('at least two');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('moves keyboard focus into main content from the skip link', async ({ page }) => {
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to planner' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('keeps the populated route accessible and generated remove controls touch-sized', async ({ page }) => {
  await page.getByLabel(/Syllabus topics/).fill('Signals and systems\nControl systems');
  await page.getByRole('button', { name: /Map my syllabus/ }).click();
  await expect(page.getByRole('heading', { name: 'Your next pass' })).toBeVisible();

  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Switch color theme' }).click();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }

  const firstTopic = page.locator('.topic').first();
  await firstTopic.getByLabel(/Question ID or note/).fill('2023 · Q14');
  await firstTopic.getByRole('button', { name: 'Attach' }).click();
  const remove = firstTopic.getByRole('button', { name: 'Remove 2023 · Q14' });
  const box = await remove.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  // Keep a full CSS-pixel buffer over the 44px requirement: a 44px minimum
  // can be reported as 43.99994px after browser subpixel rounding.
  await expect(remove).toHaveCSS('min-height', '45px');
});

test('keeps visible focus on Restore JSON and preserves focus after marking practice complete', async ({ page }) => {
  await page.getByLabel(/Syllabus topics/).fill('Signals and systems\nControl systems');
  await page.getByRole('button', { name: /Map my syllabus/ }).click();

  const restore = page.locator('#import-json');
  await restore.focus();
  await expect(restore).toBeFocused();
  await expect(restore.locator('..')).toHaveCSS('outline-style', 'solid');

  const firstTopic = page.locator('.topic').first();
  await firstTopic.getByLabel(/Question ID or note/).fill('2023 · Q14');
  await firstTopic.getByRole('button', { name: 'Attach' }).click();
  const complete = page.getByRole('checkbox', { name: 'Mark 2023 · Q14 complete' });
  await complete.focus();
  await page.keyboard.press('Space');
  await expect(complete).toBeFocused();
  await expect(page.getByText('Attempted', { exact: true })).toBeVisible();
});

test('keeps all effective route, shell, and footer targets at least 44px at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel(/Syllabus topics/).fill('Signals and systems\nControl systems');
  await page.getByRole('button', { name: /Map my syllabus/ }).click();
  const firstTopic = page.locator('.topic').first();
  await firstTopic.getByLabel(/Question ID or note/).fill('2023 · Q14');
  await firstTopic.getByRole('button', { name: 'Attach' }).click();

  const targets = page.locator('a, button, .file-button, .check-list label, .practice-list li > label');
  const boxes = await targets.evaluateAll(elements => elements
    .filter(element => {
      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden';
    })
    .map(element => {
      const rect = element.getBoundingClientRect();
      return { label: (element as HTMLElement).innerText || element.getAttribute('aria-label') || element.id, width: rect.width, height: rect.height };
    }));
  expect(boxes).not.toEqual([]);
  for (const box of boxes) {
    expect(box.width, `${box.label} must be at least 44px wide`).toBeGreaterThanOrEqual(44);
    expect(box.height, `${box.label} must be at least 44px high`).toBeGreaterThanOrEqual(44);
  }
});

test('does not advertise an unavailable checkout and keeps templates usable', async ({ page }) => {
  await expect(page.getByRole('link', { name: /Buy template unlock|Buy a new license/i })).toHaveCount(0);
  await page.getByRole('button', { name: 'Use template' }).first().click();
  await expect(page.locator('#workspace-title')).toHaveText('Engineering foundations');
});

test('legal pages are reachable', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page).toHaveTitle(/Privacy/);
  await page.goto('/terms/');
  await expect(page).toHaveTitle(/Terms/);
});

test('renders the product-owned 404 without third-party resources', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Exam Bridge');
  await expect(page.getByRole('heading', { level: 1, name: 'This route does not exist.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open the planner' })).toHaveAttribute('href', '/');
  const origin = new URL(page.url()).origin;
  expect(requests.filter(url => new URL(url).origin !== origin)).toEqual([]);
});

test('shows an offline state and loads without console errors', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await context.setOffline(true);
  await expect(page.getByText(/You’re offline/)).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
  await context.setOffline(false);
  expect(errors).toEqual([]);
});

test('@claim:license-restore stores, strips, and verifies a returned Plus license', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('.demo-banner').getByRole('link', { name: 'Start for real' }).click();
  await page.route('**/api/v1/products/exam-bridge/verify?license=valid-test', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }),
  }));
  await page.goto('/?license=valid-test');
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(page.getByText('Existing templates license verified')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:exam-bridge'))).toBe('valid-test');
});
