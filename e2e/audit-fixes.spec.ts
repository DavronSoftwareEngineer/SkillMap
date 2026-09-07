import { test, expect } from '@playwright/test';

test('malformed saved state does not crash the dashboard or erase recovery data',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('myacademy_streak','null');
    localStorage.setItem('webgis_quiz','{"z0":null}');
    localStorage.setItem('webgis_progress','[true]');
  });
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/#webgis/dash');
  await expect(page.getByRole('button',{name:'Zaxira eksport'})).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.evaluate(()=>localStorage.getItem('webgis_quiz'))).toBe('{"z0":null}');
});

test('workshop text is searchable and task progress supports keyboard',async({page})=>{
  await page.goto('/#webgis/search');
  await page.getByRole('textbox',{name:'Kurs bo‘ylab qidirish'}).fill('representative points');
  await page.getByRole('button').filter({hasText:'ai1 /'}).first().click();
  await expect(page).toHaveURL(/#webgis\/ai1$/);
  await page.locator('.tab').filter({hasText:'Topshiriq'}).click();
  const task=page.getByRole('checkbox').first();
  await expect(task).toHaveAttribute('aria-checked','false');
  await task.focus(); await page.keyboard.press('Space');
  await expect(task).toHaveAttribute('aria-checked','true');
  await page.reload();
  await page.locator('.tab').filter({hasText:'Topshiriq'}).click();
  await expect(page.getByRole('checkbox').first()).toHaveAttribute('aria-checked','true');
});
