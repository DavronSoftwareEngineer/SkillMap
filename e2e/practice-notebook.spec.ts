import { expect, test } from '@playwright/test';

test('two tabs preserve different fields and report a conflicting edit',async({page,context})=>{
  await page.goto('/#frontend/FE0');
  await page.getByRole('button',{name:'Mustaqil ish',exact:true}).click();
  await page.getByLabel(/1. Birinchi/).fill('original');
  const other=await context.newPage();
  await other.goto('/#frontend/FE0');
  await other.getByRole('button',{name:'Mustaqil ish',exact:true}).click();
  await page.getByLabel(/1. Birinchi/).fill('new in first tab');
  await other.getByLabel(/2. Xato/).fill('correction in other tab');
  expect(await other.evaluate(()=>JSON.parse(localStorage.getItem('frontend_practice')!).FE0)).toEqual({attempt:'new in first tab',reason:'correction in other tab'});
  await page.getByLabel(/2. Xato/).fill('conflicting correction');
  await expect(page.getByRole('status')).toContainText('boshqa tab');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('frontend_practice')!).FE0.reason)).toBe('correction in other tab');
});

test('malformed notebook and assessment data do not destroy records or crash the page',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('frontend_practice',JSON.stringify({FE0:{attempt:42},FE1:{attempt:'valuable sibling'}}));
    localStorage.setItem('webgis_assessment','null');
  });
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/#frontend/FE1');
  await page.getByRole('button',{name:'Mustaqil ish',exact:true}).click();
  await expect(page.getByLabel(/1. Birinchi/)).toHaveValue('valuable sibling');
  const raw=await page.evaluate(()=>localStorage.getItem('frontend_practice'));
  await page.getByLabel(/2. Xato/).fill('unsaved correction');
  await expect(page.getByRole('status')).toContainText('manba buzilgan');
  expect(await page.evaluate(()=>localStorage.getItem('frontend_practice'))).toBe(raw);
  await page.goto('/#webgis/FG');
  await page.getByRole('button',{name:/Loyiha/}).last().click();
  await expect(page.getByRole('alert').filter({hasText:'Saqlangan assessment buzilgan'})).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.evaluate(()=>localStorage.getItem('webgis_assessment'))).toBe('null');
});

test('a learner keeps original reasoning, correction and transfer through navigation and reload',async({page})=>{
  await page.goto('/#webgis/py2');
  await page.getByRole('button',{name:'Mustaqil ish',exact:true}).click();
  await page.getByLabel(/1. Birinchi mustaqil urinish/).fill('Meanni barcha 4 piksel bilan hisobladim.');
  await page.getByLabel(/2. Xato sababi/).fill('Nodata mask kerak. Mean 0.4, coverage 0.75.');
  await page.getByLabel(/3. Yangi shartdagi/).fill('All-nodata natija null, zero emas.');
  await expect(page.getByRole('status')).toHaveText('Shu brauzerda saqlandi');
  await page.goto('/#webgis/z7');
  await page.getByRole('button',{name:'Mustaqil ish',exact:true}).click();
  await expect(page.getByLabel(/1. Birinchi/)).toHaveValue('');
  await page.goto('/#webgis/py2');await page.reload();
  await page.getByRole('button',{name:'Mustaqil ish',exact:true}).click();
  await expect(page.getByLabel(/1. Birinchi/)).toHaveValue('Meanni barcha 4 piksel bilan hisobladim.');
  await expect(page.getByLabel(/2. Xato/)).toHaveValue('Nodata mask kerak. Mean 0.4, coverage 0.75.');
  const download=page.waitForEvent('download');
  await page.getByRole('button',{name:'Mustaqil ishni Markdown eksport qilish'}).click();
  expect((await download).suggestedFilename()).toBe('skillmap-webgis-py2-practice.md');
  await page.setViewportSize({width:390,height:844});
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('.practice-notebook').screenshot({path:'test-results/practice-notebook-mobile.png'});
});

test('every course has a complete course-specific practicum',async({page})=>{
  for(const course of ['webgis','frontend','backend','git','telegram','cybersecurity','english','russian','arabic','finance','prompting','founder','systemdesign']){
    await page.goto('/#'+course);
    const guide=page.getByRole('region',{name:'Kursni amalda bajarish yo‘li'});
    await expect(guide).toBeVisible();
    await expect(guide.getByRole('heading',{name:'Yechilgan misol',exact:true})).toBeVisible();
    await expect(guide.getByRole('heading',{name:'Nega shunday?',exact:true})).toBeVisible();
    await expect(guide.getByRole('heading',{name:'Kutilgan natija',exact:true})).toBeVisible();
  }
});
