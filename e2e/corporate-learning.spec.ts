import { expect, test } from '@playwright/test';
const cases = [
  ['webgis', 'z14', 'MockAtlas: markaziy GIS va hududiy tarqatish'],
  ['frontend', 'FE9', 'Bitta React xarita paketi, ikkita mustaqil ilova'],
  ['webgis', 'z8', 'Tegola tilelarini MBTiles orqali PMTilesga paketlash'],
  ['systemdesign', 'SD-DEL', 'Data + style + SDK: tekshiriladigan release va rollback'],
  ['backend', 'BX2', 'Ikki worker, bitta job: lease, fencing va qayta tiklanish'],
  ['backend', 'BE7', 'Eski admin token: rol pasayganda huquq ham pasaysin'],
  ['webgis', 'z5', 'Golden record: geometriya, atribut va provenance birga'],
];

test('seven synthetic corporate cases are visible inside their existing courses', async ({ page }) => {
  test.setTimeout(90_000);
  for (const [course, module, title] of cases) {
    await page.goto('/#' + course + '/' + module);
    await expect(page.locator('.module-status-card b')).toHaveText(module);
    const expand = page.getByRole('button', { name: "Barcha bo'limlarni ochish", exact: true });
    if (await expand.count()) await expand.click();
    await expect(page.locator('.panel.active')).toContainText(title);
    await expect(page.locator('.panel.active')).toContainText('Mock-only laboratoriya');
    await expect(page.locator('.panel.active').getByText('Mock-only laboratoriya:', { exact: true })).toBeVisible();
    await expect(page.locator('.panel.active')).toContainText('Qabul mezoni va dalil');
  }
  for (const [course, module, destination] of [
    ['git', 'GT10', '#systemdesign/SD-DEL'],
    ['cybersecurity', 'CY3', '#backend/BE7'],
    ['webgis', 'FG', '#webgis/z14'],
  ]) {
    await page.goto('/#' + course + '/' + module);
    await expect(page.locator('.module-status-card b')).toHaveText(module);
    const expand = page.getByRole('button', { name: "Barcha bo'limlarni ochish", exact: true });
    if (await expand.count()) await expand.click();
    await expect(page.locator('.panel.active')).toContainText('Kurslararo amaliy bog‘lanish');
    await expect(page.locator(`.panel.active a[href="${destination}"]`).last()).toBeVisible();
    await page.locator(`.panel.active a[href="${destination}"]`).last().click();
    await expect(page.locator('.module-status-card b')).toHaveText(destination.split('/')[1]);
  }
});
