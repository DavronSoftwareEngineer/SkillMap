import { expect, test, type Page } from '@playwright/test';
test.skip(process.env.SKILLMAP_FULLSTACK_E2E !== '1', 'Requires the real PostgreSQL API; run npm run test:fullstack.');
const secret = 'browser test password 123';
async function open(page: Page) {
  await page.goto('/#english/dash'); await page.locator('.cloud-account > summary').click();
  return page.getByRole('region', { name: 'Hisob va cloud', exact: true });
}
test('two real browsers: register, upload, restore, stale revision, offline preservation, account deletion', async ({ page, browser }, info) => {
  const username = 'test_' + Date.now().toString(36);
  const ui = await open(page);
  await expect(ui.getByRole('button', { name: 'Yangi hisob', exact: true })).toBeEnabled();
  await ui.getByRole('button', { name: 'Yangi hisob', exact: true }).click();
  await ui.getByLabel('Login', { exact: true }).fill(username);
  await ui.getByLabel('Parol (kamida 12 belgi)', { exact: true }).fill(secret);
  await ui.getByRole('button', { name: 'Hisob yaratish', exact: true }).click();
  await expect(ui.getByRole('button', { name: 'Bu brauzerni cloudga saqlash' })).toBeEnabled();
  await page.locator('.outcome-panel > summary').click();
  await page.getByLabel('Urinish va izoh').fill('Synthetic evidence moved through the real cloud database.');
  await ui.getByRole('button', { name: 'Bu brauzerni cloudga saqlash' }).click();
  await expect(ui.getByRole('status')).toContainText('Progress cloudga saqlandi');
  const other = await browser.newContext();
  try {
    const second = await other.newPage(); const remoteUI = await open(second);
    await expect(remoteUI.getByRole('button', { name: 'Kirish', exact: true })).toBeEnabled();
    await remoteUI.getByLabel('Login', { exact: true }).fill(username);
    await remoteUI.getByLabel('Parol (kamida 12 belgi)', { exact: true }).fill(secret);
    await remoteUI.getByRole('button', { name: 'Kirish', exact: true }).click();
    await expect(remoteUI.getByRole('button', { name: 'Cloud bilan bu brauzerni almashtirish' })).toBeEnabled();
    await remoteUI.getByRole('button', { name: 'Cloud bilan bu brauzerni almashtirish' }).click();
    await expect(remoteUI.getByRole('status')).toContainText('Cloud nusxa tiklandi');
    await second.locator('.outcome-panel > summary').click();
    await expect(second.getByLabel('Urinish va izoh')).toHaveValue('Synthetic evidence moved through the real cloud database.');
    await second.getByLabel('Urinish va izoh').fill('Changed on the second device.');
    await remoteUI.getByRole('button', { name: 'Bu brauzerni cloudga saqlash' }).click();
    await expect(remoteUI.getByRole('status')).toContainText('Progress cloudga saqlandi');
    await page.getByLabel('Urinish va izoh').fill('First device unsynced work must survive.');
    await ui.getByRole('button', { name: 'Bu brauzerni cloudga saqlash' }).click();
    await expect(ui.getByRole('status')).toContainText('Cloud boshqa qurilmada o‘zgargan');
    await expect(page.getByLabel('Urinish va izoh')).toHaveValue('First device unsynced work must survive.');
    await page.context().setOffline(true);
    await ui.getByRole('button', { name: 'Bu brauzerni cloudga saqlash' }).click();
    await expect(ui.getByRole('status')).not.toContainText('Cloud bilan ishlanmoqda');
    await expect(page.getByLabel('Urinish va izoh')).toHaveValue('First device unsynced work must survive.');
    await page.context().setOffline(false);
    const download = page.waitForEvent('download'); await ui.getByRole('button', { name: 'Avval JSON zaxira olish' }).click();
    await (await download).saveAs(info.outputPath('before-cloud-restore.json'));
    await ui.getByRole('button', { name: 'Cloud nusxani yangilash' }).click();
    await expect(ui.getByRole('status')).toContainText('Cloud nusxa yangilandi');
    await ui.getByRole('button', { name: 'Cloud bilan bu brauzerni almashtirish' }).click();
    await expect(ui.getByRole('status')).toContainText('Cloud nusxa tiklandi');
    await expect(page.getByLabel('Urinish va izoh')).toHaveValue('Changed on the second device.');
    await page.reload(); await page.locator('.outcome-panel > summary').click();
    await expect(page.getByLabel('Urinish va izoh')).toHaveValue('Changed on the second device.');
    await page.locator('.cloud-account > summary').click();
    await expect(ui.getByRole('button', { name: 'Hisobdan chiqish' })).toBeEnabled();
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath('cloud-mobile.png') });
  } finally {
    await other.close(); await page.context().setOffline(false);
    // Cleanup only this synthetic account through the same authenticated API.
    await page.evaluate(async ({ username, secret }) => {
      const login = await fetch('/sync/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password: secret }) });
      const { user } = await login.json();
      if (user) await fetch('/sync/account', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accountId: user.id, password: secret }) });
    }, { username, secret });
  }
});
