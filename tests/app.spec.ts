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

test('validates the empty route and has no serious accessibility findings', async ({ page }) => {
  await page.getByLabel(/Syllabus topics/).fill('Only one topic');
  await page.getByRole('button', { name: /Map my syllabus/ }).click();
  await expect(page.getByRole('alert')).toContainText('at least two');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('legal pages are reachable', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page).toHaveTitle(/Privacy/);
  await page.goto('/terms/');
  await expect(page).toHaveTitle(/Terms/);
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

test('stores, strips, and verifies a returned Plus license', async ({ page }) => {
  await page.route('**/api/v1/products/exam-bridge/verify?license=valid-test', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }),
  }));
  await page.goto('/?license=valid-test');
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(page.getByText('Templates unlocked on this device')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:exam-bridge'))).toBe('valid-test');
});
