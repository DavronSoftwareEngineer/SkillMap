import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { DELIVERY_GOOD, researchSolution } from '../src/lib/ai-projects';
async function lab(page:Page,mode:string) {
  await page.goto('/#prompting/'+mode);
  await page.getByRole('button',{name:'Loyiha laboratoriyasi',exact:true}).click();
  return page.getByRole('region',{name:'AI loyiha laboratoriyasi'});
}
test('research project checks sources, transfer, save and cross-browser backup',async({page,browser},info)=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  let project=await lab(page,'P-Research');
  await project.getByRole('button',{name:'Xato draft bilan boshlash'}).click();
  await expect(project.getByText('Dalilga mos claimlar: 1/4')).toBeVisible();
  await project.getByLabel('Claimlar JSON',{exact:true}).fill(JSON.stringify(researchSolution()));
  await expect(project.getByRole('heading',{name:'Fixture tekshiruvi o‘tdi'})).toBeVisible();
  await project.getByLabel('Manba ssenariysi').selectOption('changed');
  await expect(project.getByText('Dalilga mos claimlar: 1/4')).toBeVisible();
  await project.getByLabel('Claimlar JSON',{exact:true}).fill(JSON.stringify(researchSolution(true)));
  await project.getByLabel('Qaror hisoboti: tavsiya, manbalar, taxminlar va ochiq savollar').fill('Synthetic review: budget 22, tested 500; expected saving is a forecast.');
  await project.getByRole('button',{name:'Loyihani saqlash'}).click();
  await expect(project.getByText('Loyiha yozuvlari shu brauzerda saqlandi.')).toBeVisible();
  await page.reload();
  await page.getByRole('button',{name:'Loyiha laboratoriyasi',exact:true}).click();
  await expect(project.getByText('Dalilga mos claimlar: 4/4')).toBeVisible();
  const download=page.waitForEvent('download');await project.getByRole('button',{name:'Loyiha va hisobotni eksport qilish'}).click();
  const path=info.outputPath('project.json');await(await download).saveAs(path);
  const exported=JSON.parse(await readFile(path,'utf8'));expect(exported.report.result.ready).toBe(true);
  const context=await browser.newContext();
  try {
    const second=await context.newPage();await second.goto('/#prompting/dash');
    await second.locator('input[type=file]').setInputFiles(path);
    await expect(second.getByText('Zaxira tiklandi',{exact:true})).toBeVisible();
    project=await lab(second,'P-Research');
    await expect(project.getByText('Dalilga mos claimlar: 4/4')).toBeVisible();
    await second.setViewportSize({width:390,height:844});
    await expect.poll(()=>second.locator('.side').evaluate(e=>e.getBoundingClientRect().right)).toBeLessThanOrEqual(1);
    expect(await second.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await project.getByLabel('Claimlar JSON',{exact:true}).scrollIntoViewIfNeeded();
    await second.screenshot({path:info.outputPath('research-mobile.png')});
  } finally {await context.close();}
  expect(errors).toEqual([]);
});
test('delivery gate and scout notebook retain drafts and reject conflicting writes',async({page},info)=>{
  let project=await lab(page,'P-Delivery');
  await project.getByRole('button',{name:'Xato trace bilan boshlash'}).click();
  await expect(project.getByRole('heading',{name:'Tuzatish kerak'})).toBeVisible();
  await project.getByLabel('Agent trace JSON',{exact:true}).fill(JSON.stringify(DELIVERY_GOOD));
  await expect(project.getByRole('heading',{name:'Fixture tekshiruvi o‘tdi'})).toBeVisible();
  await project.getByLabel('Token budjeti',{exact:true}).fill('4000');
  await expect(project.getByText('Jami token sarfi budjetdan oshgan.')).toBeVisible();
  await project.getByRole('button',{name:'Loyihani saqlash'}).click();
  await expect(project.getByText('Loyiha yozuvlari shu brauzerda saqlandi.')).toBeVisible();
  project=await lab(page,'P-Scout');
  await project.getByLabel('Qaror, cheklov va qayta tekshirish triggeri',{exact:true}).fill('Keep existing workflow until access is verified.');
  await page.getByRole('button',{name:'Dars',exact:true}).click();
  await page.getByRole('button',{name:'Loyiha laboratoriyasi',exact:true}).click();
  await expect(project.getByLabel('Qaror, cheklov va qayta tekshirish triggeri',{exact:true})).toHaveValue('Keep existing workflow until access is verified.');
  await page.evaluate(()=>{
    const current=JSON.parse(localStorage.getItem('prompting_worklabs')!);
    localStorage.setItem('prompting_worklabs',JSON.stringify({...current,'other-tab':{answer:'Preserve me'}}));
  });
  await project.getByRole('button',{name:'Loyihani saqlash'}).click();
  await expect(project.getByText(/Saqlanmadi: manba o‘zgargan/)).toBeVisible();
  const download=page.waitForEvent('download');await project.getByRole('button',{name:'Loyiha va hisobotni eksport qilish'}).click();
  const path=info.outputPath('draft.json');await(await download).saveAs(path);
  expect(JSON.parse(await readFile(path,'utf8')).data.prompting_worklabs['studio-P-Scout'].decision).toContain('Keep existing');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('prompting_worklabs')!)['other-tab'].answer)).toBe('Preserve me');
  await page.screenshot({path:info.outputPath('scout-desktop.png')});
});
