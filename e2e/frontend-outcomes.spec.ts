import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const rubric = ['Natija to‘g‘riligi', 'Sababni tushuntirish', 'Yangi shart va xato holati', 'Tekshiriladigan dalil'];
async function openNotes(page: Page) {
  await page.locator('.outcome-panel summary').click();
  return page.getByRole('region', { name: 'O‘quvchi natijasi sinovi' });
}

test('local reviews persist and move between browsers via JSON without an account API', async ({ page, browser }, info) => {
  const requests: string[] = [];
  page.on('request', req => { if (new URL(req.url()).pathname.startsWith('/sync')) requests.push(req.url()); });
  await page.goto('/#english/dash');
  await expect(page.locator('.cloud-account')).toHaveCount(0);
  await expect(page.getByText('Progress shu brauzerda saqlanadi.', { exact: false })).toBeVisible();
  const notes = await openNotes(page);
  for (const [phase, score] of [['Boshlang‘ich ish', '2'], ['Yakuniy transfer', '3']]) {
    await notes.getByRole('button', { name: phase, exact: true }).click();
    await notes.getByLabel('Ishtirokchi kodi', { exact: true }).fill('synthetic-learner-1');
    await notes.getByLabel('Urinish va izoh').fill('Synthetic test attempt with explanation and independent transfer.');
    await notes.getByLabel('Reviewer nomi yoki kodi').fill('synthetic-reviewer');
    for (const label of rubric) await notes.getByLabel(label, { exact: true }).fill(score);
    await notes.getByLabel('Reviewer izohi', { exact: true }).fill('Synthetic review: evidence and reasoning were checked against the rubric.');
  }
  await expect(notes.getByText(/Qo‘lda qayd etilgan farq: \+4 ball/)).toBeVisible();
  await expect(notes.getByText(/Reviewer shaxsi va bahosi sayt tomonidan tasdiqlanmaydi/)).toBeVisible();
  const downloaded = page.waitForEvent('download');
  await notes.getByRole('button', { name: 'Hozirgi yozuvlarni eksport qilish' }).click();
  const exported = info.outputPath('local-outcomes.json');
  await (await downloaded).saveAs(exported);
  const payload = JSON.parse(await readFile(exported, 'utf8'));
  expect(payload.version).toBe(1);
  expect(payload.provenance).toContain('not verified');
  expect(Object.keys(payload.data.english_outcomes)).toEqual(['baseline', 'final']);
  await page.reload();
  await openNotes(page);
  await expect(page.getByText(/Qo‘lda qayd etilgan farq: \+4 ball/)).toBeVisible();
  expect(requests).toEqual([]);

  const other = await browser.newContext();
  try {
    const device = await other.newPage();
    await device.goto('/#english/dash');
    await device.locator('input[type=file]').setInputFiles(exported);
    await expect(device.getByText('Zaxira tiklandi', { exact: true })).toBeVisible();
    const imported = await openNotes(device);
    await expect(imported.getByLabel('Ishtirokchi kodi', { exact: true })).toHaveValue('synthetic-learner-1');
    await expect(imported.getByText(/Qo‘lda qayd etilgan farq: \+4 ball/)).toBeVisible();
    // Different people must not produce a paired learning gain.
    await imported.getByRole('button', { name: 'Yakuniy transfer', exact: true }).click();
    await imported.getByLabel('Ishtirokchi kodi', { exact: true }).fill('different-learner');
    await expect(imported.getByText(/Qo‘lda qayd etilgan farq:/)).toHaveCount(0);
    await device.setViewportSize({ width: 390, height: 844 });
    await expect.poll(() => device.locator('.side').evaluate(el => el.getBoundingClientRect().right)).toBeLessThanOrEqual(1);
    expect(await device.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await imported.scrollIntoViewIfNeeded();
    await device.screenshot({ path: info.outputPath('outcomes-mobile.png'), animations: 'disabled' });
  } finally { await other.close(); }
});

test('unsaved local evidence remains exportable and survives storage recovery', async ({ page }, info) => {
  await page.goto('/#english/dash');
  const notes = await openNotes(page);
  await page.evaluate(() => {
    const w = window as typeof window & { savedSetItem?: typeof Storage.prototype.setItem };
    w.savedSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); };
  });
  await notes.getByLabel('Urinish va izoh').fill('Keep this unsaved attempt.');
  await notes.getByLabel('Qayerda tushunmay qoldingiz?').fill('Keep this unsaved feedback too.');
  await expect(notes.getByRole('status')).toContainText('Yozuv saqlanmadi');
  const downloaded = page.waitForEvent('download');
  await notes.getByRole('button', { name: 'Hozirgi yozuvlarni eksport qilish' }).click();
  const exported = info.outputPath('unsaved-outcomes.json');
  await (await downloaded).saveAs(exported);
  const saved = JSON.parse(await readFile(exported, 'utf8')).data.english_outcomes.baseline;
  expect(saved.attempt).toBe('Keep this unsaved attempt.');
  expect(saved.feedback).toBe('Keep this unsaved feedback too.');
  await page.evaluate(() => {
    Storage.prototype.setItem = (window as typeof window & { savedSetItem: typeof Storage.prototype.setItem }).savedSetItem;
  });
  await notes.getByLabel('Ishtirokchi kodi', { exact: true }).fill('recovered-learner');
  await expect(notes.getByRole('status')).toContainText('Yozuv shu brauzerda saqlandi');
  await page.reload();
  const restored = await openNotes(page);
  await expect(restored.getByLabel('Urinish va izoh')).toHaveValue('Keep this unsaved attempt.');
  await expect(restored.getByLabel('Qayerda tushunmay qoldingiz?')).toHaveValue('Keep this unsaved feedback too.');
});
