import { expect, test } from '@playwright/test';
import { MARKET_CASES } from '../src/data/learning/market-readiness';

for (const item of MARKET_CASES) {
  test(`market lesson ${item.modules[0]} renders and checks understanding`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/#webgis/${item.modules[0]}`);
    await page.getByRole('button', { name: 'Hujjat', exact: true }).click();
    const lesson = page.locator('.learning-case').filter({ has: page.getByRole('heading', { name: item.title, exact: true }) });
    await expect(lesson).toBeVisible();
    await expect(lesson.getByText(item.expected, { exact: true })).not.toBeVisible();
    await lesson.locator('summary').click();
    await expect(lesson.getByText(item.expected, { exact: true })).toBeVisible();
    await lesson.getByRole('button', { name: item.check.a[item.check.c], exact: true }).click();
    await expect(lesson.getByRole('status')).toContainText("To'g'ri qaror.");
    expect(errors).toEqual([]);
  });
}
