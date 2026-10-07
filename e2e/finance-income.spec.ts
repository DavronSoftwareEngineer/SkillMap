import {test,expect} from '@playwright/test';

test('income path links, price tradeoff and saved independent work',async({page},info)=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/#finance/F0');
  await expect(page.getByRole('heading',{name:'Daromadni oshirish va pulni ongli boshqarish',exact:true})).toBeVisible();
  for(const id of ['F13','F14','F15','F16','F17']){
    await page.goto('/#finance/'+id);
    await expect(page.getByRole('button',{name:'Topshiriqlar'})).toBeVisible();
    await expect(page.locator('.mtitle')).not.toBeEmpty();
  }
  await page.goto('/#finance/F14');
  await page.getByRole('button',{name:'Loyiha ustaxonasi',exact:true}).click();
  const calc=page.getByRole('region',{name:'Ssenariy hisoblagichi'});
  const row=(name:string)=>calc.locator('dl > div').filter({has:page.getByText(name,{exact:true})}).locator('dd');
  await expect(row('Quvvatdan ortiq soat')).toHaveText('8');
  await calc.getByLabel('Bir buyurtma narxi (mln so‘m)',{exact:true}).fill('2.5');
  await calc.getByLabel('Oyda buyurtmalar soni',{exact:true}).fill('3');
  await expect(row('Xarajatlardan keyingi qoldiq (mln)')).toHaveText('5.8');
  await expect(row('Bir soatga qoldiq (mln)')).toHaveText('0.1526');
  await expect(row('Quvvatdan ortiq soat')).toHaveText('0');
  await calc.getByLabel('Oyda buyurtmalar soni',{exact:true}).fill('1.5');
  await expect(calc.getByRole('alert')).toBeVisible();
  await calc.getByLabel('Oyda buyurtmalar soni',{exact:true}).fill('3');
  await page.getByLabel('1. Birinchi mustaqil urinish').fill('Oylik qoldiq 5.8, vaqt 38; talab hali sinovdan o‘tmagan.');
  await page.reload();await page.getByRole('button',{name:'Loyiha ustaxonasi',exact:true}).click();
  await expect(page.getByLabel('1. Birinchi mustaqil urinish')).toHaveValue('Oylik qoldiq 5.8, vaqt 38; talab hali sinovdan o‘tmagan.');
  await page.screenshot({path:info.outputPath('income-desktop.png')});
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>document.querySelector('.side')!.getBoundingClientRect().right<=1);
  await calc.scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:info.outputPath('income-mobile.png')});
  expect(errors).toEqual([]);
});
