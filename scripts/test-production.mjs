import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = path.resolve('dist');
const config = await readFile('netlify.toml', 'utf8');
const csp = config.match(/Content-Security-Policy = "([^"]+)"/)?.[1];
assert.ok(csp, 'Production CSP must be present');
await stat(path.join(root, 'index.html')); // Run npm run build first.
const server = createServer(async (req, res) => {
  try {
    const requested = new URL(req.url, 'http://localhost').pathname;
    let file = path.resolve(root, '.' + decodeURIComponent(requested));
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    if (file === root || !(await stat(file).catch(() => null))?.isFile()) file = path.join(root, 'index.html');
    res.setHeader('Content-Security-Policy', csp);
    res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'})[path.extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.writeHead(500).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext({ serviceWorkers: 'block' });
  // No external book content or keys are needed to validate navigation.
  await context.route('https://**/*', route => route.fulfill({contentType:'text/html',body:'<p>External source fixture</p>'}));
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__cspViolations = [];
    document.addEventListener('securitypolicyviolation', event => window.__cspViolations.push(event.violatedDirective));
  });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/#webgis/books`);
  await page.locator('.bookcard').first().click();
  for (const [mode, name, expected] of [
    ['Rasmiy manba', /Rasmiy manbada ochish/, 'https://eloquentjavascript.net/'],
    ['Google Preview', /Google Books’da ochish/, 'https://books.google.com/books?vid=ISBN9781593279509'],
  ]) {
    await page.getByRole('tab', { name: mode }).click();
    const link = page.getByRole('link', { name });
    assert.equal(await link.getAttribute('href'), expected);
    const opened = context.waitForEvent('page');
    await link.click(); const popup = await opened;
    await popup.waitForLoadState();
    assert.equal(await popup.evaluate(() => window.opener === null), true);
    assert.equal(popup.url(), expected);
    await popup.close();
  }
  assert.equal(await page.locator('iframe').count(), 0);
  await page.goto(`http://127.0.0.1:${server.address().port}/#english/dash`);
  await page.locator('.outcome-panel summary').click();
  await page.getByLabel('Urinish va izoh').fill('Synthetic local attempt checked under the production CSP.');
  const outcomeDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Hozirgi yozuvlarni eksport qilish' }).click();
  const outcome = await outcomeDownload;
  assert.equal(outcome.suggestedFilename(), 'skillmap-english-outcomes.json');
  const outcomePayload = JSON.parse(await readFile(await outcome.path(), 'utf8'));
  assert.equal(outcomePayload.data.english_outcomes.baseline.attempt, 'Synthetic local attempt checked under the production CSP.');
  assert.equal(outcomePayload.version, 1);
  await page.evaluate(() => { localStorage.setItem('myacademy_theme', JSON.stringify('light')); });
  await page.reload();
  await page.locator('.outcome-panel summary').click();
  await page.screenshot({ path: 'test-results/frontend-only-desktop.png', animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() => document.querySelector('.side').getBoundingClientRect().right <= 1);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: 'test-results/frontend-only-mobile.png', animations: 'disabled' });
  assert.deepEqual(await page.evaluate(() => window.__cspViolations), []);
  await page.goto(`http://127.0.0.1:${server.address().port}/#prompting/play`);
  await page.getByLabel('A AI javobi', { exact: true }).fill('{"status":"blocked","blocker":"CRS unknown","owner":"Ali","deadline":"2026-11-05"}');
  await page.getByRole('button', { name: 'Mashqni saqlash', exact: true }).click();
  await page.getByText('Mashq yozuvlari shu brauzerda saqlandi.', { exact: true }).waitFor();
  assert.equal(await page.getByText('JSON shakli: mos. Fixture faktlari: mos.', { exact: true }).count(), 1);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: 'test-results/prompt-production-mobile.png', animations: 'disabled' });
  assert.deepEqual(await page.evaluate(() => window.__cspViolations), []);
  assert.deepEqual(errors, []);
  await page.goto(`http://127.0.0.1:${server.address().port}/#prompting/P-Research`);
  await page.getByRole('button', { name: 'Loyiha laboratoriyasi', exact: true }).click();
  await page.getByRole('button', { name: 'Xato draft bilan boshlash' }).click();
  await page.getByText('Dalilga mos claimlar: 1/4', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Loyihani saqlash', exact: true }).click();
  await page.getByText('Loyiha yozuvlari shu brauzerda saqlandi.', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(await page.evaluate(() => window.__cspViolations), []);
  assert.deepEqual(errors, []);
  console.log('Production build + Netlify CSP: books, outcomes, prompt workshop, project lab, mobile layout, no CSP violations PASS');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
