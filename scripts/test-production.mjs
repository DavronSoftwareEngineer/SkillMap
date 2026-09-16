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
  assert.deepEqual(await page.evaluate(() => window.__cspViolations), []);
  assert.deepEqual(errors, []);
  console.log('Production build + Netlify CSP: official/Google links, safe popups, no CSP violations PASS');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
