import { expect, test } from '@playwright/test';
import { MODULE_WORKSHOPS } from '../src/data/learning/module-workshops';

for (const [course, modules] of Object.entries(MODULE_WORKSHOPS)) {
  test(`${course}: every module and available panel renders without a runtime crash`,async({page})=>{
    test.setTimeout(180_000);
    const errors: string[]=[];
    page.on('pageerror',error=>errors.push(error.message));
    for(const id of Object.keys(modules)) {
      await page.goto('/#'+course+'/'+encodeURIComponent(id));
      await expect(page.locator('.module-status-card b')).toHaveText(id);
      await expect(page.locator('.workspace-panel')).toBeVisible();
      const tabs=page.locator('.tabs .tab');
      const count=await tabs.count();
      for(let index=0;index<count;index++) {
        await tabs.nth(index).click();
        await expect(page.locator('.panel.active')).not.toBeEmpty();
      }
      expect(errors,`${course}/${id}`).toEqual([]);
    }
  });
}
