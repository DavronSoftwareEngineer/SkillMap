import { test, expect } from '@playwright/test';

test('all eleven workshop tracks expose an independent exercise and hidden solution',async({page})=>{
  const routes=['webgis/ai1','frontend/FE7','backend/BE4','git/GT6','telegram/TG6','cybersecurity/CY3','english/A1','finance/F4','russian/'+encodeURIComponent('А2'),'arabic/AR5','prompting/P4M'];
  for(const route of routes){
    await page.goto('/#'+route);
    const workshop=page.getByRole('region',{name:'Modulga xos mustaqil amaliyot'});
    await expect(workshop).toBeVisible();
    const solution=workshop.locator('details');
    await expect(solution).not.toHaveAttribute('open');
    await solution.locator('summary').click();
    await expect(solution).toHaveAttribute('open');
    await expect(solution.locator('p').first()).toBeVisible();
    await expect(workshop.getByText('2. Shartni o‘zgartirib bajaring',{exact:true})).toBeVisible();
    await expect(workshop.getByText('3. Natijangizni tekshiring',{exact:true})).toBeVisible();
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto('/#webgis/ai1');
  const workshop=page.getByRole('region',{name:'Modulga xos mustaqil amaliyot'});
  await workshop.scrollIntoViewIfNeeded();
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await workshop.screenshot({path:'test-results/workshop-geospatial-mobile.png'});
});

test('worked practice works on mobile and preserves Cyrillic course links',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/#founder/TF7');
  const practice=page.getByRole('region',{name:'Bosqichli amaliyot'});
  await expect(practice).toBeVisible();
  const details=practice.locator('details').first();
  await expect(details).not.toHaveAttribute('open');
  await details.locator('summary').click();
  await expect(details).toHaveAttribute('open');
  await practice.locator('fieldset button').first().click();
  await expect(practice.getByRole('status')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:'test-results/learning-founder-mobile.png',fullPage:true});
  await page.goto('/#russian/'+encodeURIComponent('Алф'));
  const link=page.locator('a[href="#russian/'+encodeURIComponent('Время')+'"]');
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(new RegExp(encodeURIComponent('Время')));
  await expect(page.getByRole('region',{name:'Bosqichli amaliyot'})).toBeVisible();
});
