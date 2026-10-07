import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const answer=JSON.stringify({status:'blocked',blocker:'CRS unknown',owner:'Ali',deadline:'2026-11-05'});
test('frontend prompt lab validates, retains context and restores its export in another browser',async({page,browser},info)=>{
  const remote:string[]=[];
  page.on('request',r=>{if(/api\.(openai|anthropic)\.com|\/sync/.test(r.url()))remote.push(r.url());});
  await page.goto('/#prompting/play');
  await expect(page.getByRole('heading',{name:'Prompt ustaxonasi',exact:true})).toBeVisible();
  await page.getByLabel('A AI javobi',{exact:true}).fill(answer);
  await page.getByLabel('B AI javobi',{exact:true}).fill(answer.replace('2026-11-05','tomorrow'));
  await expect(page.getByRole('region',{name:'B tajriba'})).toContainText('JSON shakli: mos. Fixture faktlari: xato.');
  await page.getByLabel('Follow-up (ixtiyoriy)',{exact:true}).fill('Check deadline against source');
  await page.getByText('B paket matni',{exact:true}).click();
  await expect(page.locator('details').filter({has:page.getByText('B paket matni',{exact:true})})).toContainText('PREVIOUS ANSWER');
  await page.getByLabel('A model va sana').fill('Synthetic browser fixture; no model run');
  await page.getByRole('button',{name:'Mashqni saqlash',exact:true}).click();
  await expect(page.getByText('Mashq yozuvlari shu brauzerda saqlandi.',{exact:true})).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('A AI javobi',{exact:true})).toHaveValue(answer);
  const download=page.waitForEvent('download');
  await page.getByRole('button',{name:'Qoralamani JSON eksport qilish'}).click();
  const path=info.outputPath('prompt-backup.json');await(await download).saveAs(path);
  expect(JSON.parse(await readFile(path,'utf8')).data.prompting_worklabs['dev-01'].answerA).toBe(answer);
  await page.screenshot({path:info.outputPath('prompt-desktop.png'),fullPage:true});
  expect(remote).toEqual([]);
  const context=await browser.newContext();
  try {
    const second=await context.newPage();
    await second.goto('/#prompting/dash');
    await second.locator('input[type=file]').setInputFiles(path);
    await expect(second.getByText('Zaxira tiklandi',{exact:true})).toBeVisible();
    await second.goto('/#prompting/play');
    await expect(second.getByLabel('A AI javobi',{exact:true})).toHaveValue(answer);
    await expect(second.getByLabel('Follow-up (ixtiyoriy)',{exact:true})).toHaveValue('Check deadline against source');
    await second.setViewportSize({width:390,height:844});
    expect(await second.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await second.getByRole('region',{name:'A tajriba'}).scrollIntoViewIfNeeded();
    await second.screenshot({path:info.outputPath('prompt-mobile.png')});
  } finally {await context.close();}
});

test('edits invalidate old grades and failed storage keeps an exportable draft',async({page},info)=>{
  await page.goto('/#prompting/play');
  await page.getByLabel('A AI javobi',{exact:true}).fill(answer);
  await expect(page.getByText(/development: A 1\/1/)).toBeVisible();
  await page.getByLabel('A prompt',{exact:true}).fill('Revised shared instruction');
  await expect(page.getByText(/development: A 0\/0/)).toBeVisible();
  await page.getByLabel('Sinov misoli').selectOption('dev-02');
  await expect(page.getByLabel('A prompt',{exact:true})).toHaveValue('Revised shared instruction');
  await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new DOMException('full','QuotaExceededError');};});
  await page.getByRole('button',{name:'Mashqni saqlash',exact:true}).click();
  await expect(page.getByText('Saqlanmadi. Qoralama eksporti orqali yozuvlaringizni oling.',{exact:true})).toBeVisible();
  const download=page.waitForEvent('download');
  await page.getByRole('button',{name:'Qoralamani JSON eksport qilish'}).click();
  const path=info.outputPath('unsaved-prompt.json');await(await download).saveAs(path);
  const data=JSON.parse(await readFile(path,'utf8')).data.prompting_worklabs;
  expect(data['lab-config'].promptA).toBe('Revised shared instruction');
  expect(data['dev-01'].answerA).toBe(answer);
});
