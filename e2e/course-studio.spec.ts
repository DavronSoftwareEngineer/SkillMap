import {test,expect} from '@playwright/test';
import {PROJECT_PATHS} from '../src/data/learning/project-paths';
import {readFile} from 'node:fs/promises';
test('all course project stages render their own task and preserve notebook entries',async({page},info)=>{
  test.setTimeout(120000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  for(const [id,path] of Object.entries(PROJECT_PATHS))for(const stage of path.stages){
    await page.goto('/#'+id+'/'+encodeURIComponent(stage.module));
    await page.getByRole('button',{name:'Loyiha ustaxonasi',exact:true}).click();
    const studio=page.getByRole('region',{name:'Kurs loyihasi ustaxonasi'});
    await expect(studio.getByRole('heading',{name:path.title,exact:true})).toBeVisible();
    await expect(studio.getByText(stage.transfer,{exact:true})).toBeVisible();
  }
  await page.goto('/#russian/'+encodeURIComponent('А2'));
  await page.getByRole('button',{name:'Loyiha ustaxonasi',exact:true}).click();
  await page.getByLabel('1. Birinchi mustaqil urinish').fill('Я работаю в офисе. Я иду в офис.');
  await page.reload();await page.getByRole('button',{name:'Loyiha ustaxonasi',exact:true}).click();
  await expect(page.getByLabel('1. Birinchi mustaqil urinish')).toHaveValue('Я работаю в офисе. Я иду в офис.');
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByLabel('1. Birinchi mustaqil urinish').scrollIntoViewIfNeeded();
  await page.screenshot({path:info.outputPath('russian-project-mobile.png')});
  expect(errors).toEqual([]);
});
test('cash calculator catches double counting, exports result and blocks invalid input',async({page},info)=>{
  await page.goto('/#finance/F12');await page.getByRole('button',{name:'Loyiha ustaxonasi',exact:true}).click();
  const calc=page.getByRole('region',{name:'Ssenariy hisoblagichi'});
  await expect(calc.locator('dl')).toContainText('−1'.replace('−','-'));
  await calc.getByLabel('1-kundagi advance',{exact:true}).fill('5');
  await expect(calc.locator('dl')).toContainText('Qolgan invoice to‘lovi10');
  await calc.getByLabel('1-kundagi advance',{exact:true}).fill('16');
  await expect(calc.getByRole('alert')).toBeVisible();
  await calc.getByLabel('1-kundagi advance',{exact:true}).fill('5');
  const download=page.waitForEvent('download');await calc.getByRole('button',{name:'Hisobni eksport qilish'}).click();
  await(await download).saveAs(info.outputPath('cash-experiment.json'));
  await page.screenshot({path:info.outputPath('finance-project-desktop.png')});
});
test('project notebooks travel through the real full-backup export and import',async({page,browser},info)=>{
  await page.goto('/#frontend/FE4');await page.getByRole('button',{name:'Loyiha ustaxonasi',exact:true}).click();
  await page.getByLabel('3. Yangi shartdagi mustaqil natija').fill('Reordered b,a; draft still belongs to a.');
  await page.goto('/#frontend/dash');const downloaded=page.waitForEvent('download');
  await page.getByRole('button',{name:'Zaxira eksport',exact:true}).click();
  const path=info.outputPath('project-backup.json');await(await downloaded).saveAs(path);
  const data=JSON.parse(await readFile(path,'utf8'));expect(data.data.frontend_practice['project-FE4'].transfer).toContain('belongs to a');
  const context=await browser.newContext();try{
    const second=await context.newPage();await second.goto('/#frontend/dash');await second.locator('input[type=file]').setInputFiles(path);
    await expect(second.getByText('Zaxira tiklandi',{exact:true})).toBeVisible();
    await second.goto('/#frontend/FE4');await second.getByRole('button',{name:'Loyiha ustaxonasi',exact:true}).click();
    await expect(second.getByLabel('3. Yangi shartdagi mustaqil natija')).toHaveValue('Reordered b,a; draft still belongs to a.');
  }finally{await context.close();}
});
