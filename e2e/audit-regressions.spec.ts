import {expect,test} from '@playwright/test';

test('simultaneous tabs preserve task changes and synchronize unchecking',async({context,page})=>{
  const other=await context.newPage();
  for(const p of [page,other]) {
    await p.goto('/#webgis/ai1');
    await p.locator('.tab').filter({hasText:'Topshiriq'}).click();
  }
  expect(await page.evaluate(()=>Boolean(navigator.locks))).toBe(true);
  await Promise.all([page.getByRole('checkbox').nth(0).click(),other.getByRole('checkbox').nth(1).click()]);
  for(const p of [page,other]) {
    await expect(p.getByRole('checkbox').nth(0)).toHaveAttribute('aria-checked','true');
    await expect(p.getByRole('checkbox').nth(1)).toHaveAttribute('aria-checked','true');
  }
  await other.getByRole('checkbox').nth(0).click();
  await expect(page.getByRole('checkbox').nth(0)).toHaveAttribute('aria-checked','false');
  await page.reload();await page.locator('.tab').filter({hasText:'Topshiriq'}).click();
  await expect(page.getByRole('checkbox').nth(1)).toHaveAttribute('aria-checked','true');
});

test('malformed English storage keeps the lab usable and original bytes untouched',async({page})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>localStorage.setItem('english_worklabs','null'));
  await page.goto('/#english/WriteLab');
  await page.getByRole('button',{name:'Amaliy lab',exact:true}).click();
  await page.getByLabel(/Birinchi draft/).fill('My recoverable draft');
  await expect(page.getByText(/saqlangan ma'lumot yaroqsiz/)).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem('english_worklabs'))).toBe('null');
  const download=page.waitForEvent('download');
  await page.getByRole('button',{name:'Matnni Markdown eksport qilish'}).click();
  expect((await download).suggestedFilename()).toBe('skillmap-writing-main.md');
  expect(errors).toEqual([]);
});
