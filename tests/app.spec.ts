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
