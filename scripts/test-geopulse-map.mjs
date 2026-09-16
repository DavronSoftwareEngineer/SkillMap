import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {createServer} from 'node:http';
import {chromium, expect} from '@playwright/test';

const root=path.resolve(import.meta.dirname,'../labs/geopulse/frontend/dist');
await stat(path.join(root,'index.html'));
const server=createServer(async(req,res)=>{
  try {
    let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
    if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    if(file===root)file=path.join(root,'index.html');
    res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html'})[path.extname(file)]||'application/octet-stream');
    res.end(await readFile(file));
  } catch {res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.route('https://tiles.openfreemap.org/**',route=>route.fulfill({json:{version:8,sources:{},layers:[{id:'background',type:'background',paint:{'background-color':'#ccddee'}}]}}));
  // Only synthetic data. This is a frontend/worker test, not a live PostGIS test.
  let requests=0;
  await page.route('**/api/features?**',route=>{
    requests++;
    return route.fulfill({json:{type:'FeatureCollection',features:[{type:'Feature',id:1,geometry:{type:'Point',coordinates:[69.2689,41.3111]},properties:{name:'Synthetic test point',category:'station'}}],meta:{returned:1,limit:500,bbox:[]}}});
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await expect(page.locator('.map-status.ready')).toContainText('1 obyekt');
  // Data arrival can precede the worker's render. Retry the click until drawn.
  await expect(async()=>{
    await page.locator('.maplibregl-canvas').click();
    await expect(page.locator('.maplibregl-popup strong')).toHaveText('Synthetic test point',{timeout:500});
  }).toPass({timeout:15000});
  await page.getByRole('button',{name:'Zoom in',exact:true}).click();
  await expect.poll(()=>requests).toBeGreaterThan(1);
  assert.deepEqual(errors,[]);
  console.log('GeoPulse production: local ESM worker, synthetic feature, popup and zoom reload PASS');
} finally {
  await browser?.close();server.closeAllConnections();
  await new Promise(resolve=>server.close(resolve));
}
