// Builds a real local npm tarball and two independent synthetic consumers.
// Generated files stay under node_modules/.tmp; nothing is published or downloaded.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { build, preview } from 'vite';
import { chromium } from '@playwright/test';

const root = process.cwd();
fs.mkdirSync(path.join(root, 'node_modules/.tmp'), { recursive: true });
const workspace = fs.mkdtempSync(path.join(root, 'node_modules/.tmp/mock-sdk-'));
const packageDir = path.join(workspace, 'package');
fs.mkdirSync(packageDir);
const source = path.join(root, 'src/labs/corporate-gis/MapCanvas.tsx');
const options = { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX,
  declaration: true, skipLibCheck: true, strict: true, outDir: path.join(packageDir, 'dist') };
function check(program) {
  const errors = ts.getPreEmitDiagnostics(program);
  if (errors.length) throw Error(ts.formatDiagnosticsWithColorAndContext(errors, {
    getCurrentDirectory: () => root, getCanonicalFileName: f => f, getNewLine: () => '\n',
  }));
}
const program = ts.createProgram([source], options);
check(program);
if (program.emit().emitSkipped) throw Error('SDK emit failed');
fs.writeFileSync(path.join(packageDir, 'package.json'), JSON.stringify({
  name: '@mockatlas/react-map', version: '0.0.1', type: 'module', files: ['dist'],
  exports: { '.': { types: './dist/MapCanvas.d.ts', import: './dist/MapCanvas.js' } },
  peerDependencies: { react: '^18.3.1' },
}, null, 2));
const npmCli = process.env.npm_execpath;
if (!npmCli) throw Error('Run with npm run test:corporate-sdk');
const npm = (args, cwd) => execFileSync(process.execPath, [npmCli, ...args], {
  cwd, encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, npm_config_cache: path.join(workspace, 'npm-cache'), npm_config_update_notifier: 'false' },
});
const packed = JSON.parse(npm(['pack', '--json', '--ignore-scripts', '--pack-destination', workspace], packageDir));
const tarball = path.join(workspace, packed[0].filename);
const consumers = [];
for (const name of ['viewer', 'editor']) {
  const dir = path.join(workspace, name);
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: `mock-${name}`, private: true, type: 'module',
    dependencies: { '@mockatlas/react-map': pathToFileURL(tarball).href,
      react: pathToFileURL(path.join(root, 'node_modules/react')).href,
      'react-dom': pathToFileURL(path.join(root, 'node_modules/react-dom')).href },
  }));
  npm(['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund', '--no-package-lock'], dir);
  fs.writeFileSync(path.join(dir, 'index.html'), '<html><body><div id="root"></div><script type="module" src="/main.ts"></script></body></html>');
  fs.writeFileSync(path.join(dir, 'main.ts'), `
import { createElement as h, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MapCanvas, type MapAdapter } from '@mockatlas/react-map';
let creates = 0, removes = 0;
function factory(container: HTMLDivElement): MapAdapter {
  creates++;
  const listeners = new Set<(id: string) => void>();
  const button = document.createElement('button');
  button.textContent = 'Select synthetic point';
  button.onclick = () => listeners.forEach(fn => fn('mock-point-1'));
  container.appendChild(button);
  return { onSelect: fn => { listeners.add(fn); }, offSelect: fn => { listeners.delete(fn); },
    remove: () => { removes++; button.remove(); listeners.clear(); } };
}
function App() {
  const [selected, setSelected] = useState('none');
  const [visible, setVisible] = useState(true);
  return h('main', null, h('h1', null, '${name}'),
    h('output', {id:'selection'}, '${name}:' + selected),
    visible && h(MapCanvas, {createMap: container => factory(container), onSelect: setSelected}),
    h('button', {onClick: () => setVisible(!visible)}, 'Toggle map'),
    h('button', {onClick: () => { document.getElementById('counts')!.textContent = creates + '/' + removes; }}, 'Inspect lifecycle'),
    h('output', {id:'counts'}));
}
createRoot(document.getElementById('root')!).render(h(App));
`);
  check(ts.createProgram([path.join(dir, 'main.ts')], { ...options, noEmit: true }));
  await build({ root: dir, configFile: false, logLevel: 'error' });
  consumers.push({ name, dir });
}
const browser = await chromium.launch();
try {
  for (const { name, dir } of consumers) {
    const server = await preview({ root: dir, configFile: false, logLevel: 'error', preview: { host: '127.0.0.1', port: 0 } });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    try {
      await page.goto(server.resolvedUrls.local[0]);
      await page.getByRole('button', { name: 'Select synthetic point' }).click();
      if (await page.locator('#selection').textContent() !== `${name}:mock-point-1`) throw Error('Selection contract failed');
      await page.getByRole('button', { name: 'Inspect lifecycle' }).click();
      if (await page.locator('#counts').textContent() !== '1/0') throw Error('Map recreated after selection');
      await page.getByRole('button', { name: 'Toggle map' }).click();
      await page.getByRole('button', { name: 'Inspect lifecycle' }).click();
      if (await page.locator('#counts').textContent() !== '1/1') throw Error('Unmount cleanup failed');
      if (errors.length) throw Error(errors.join('\n'));
      console.log(`${name}: installed tarball, typecheck, build, selection and cleanup PASS`);
    } finally {
      await page.close();
      await new Promise(resolve => server.httpServer.close(resolve));
    }
  }
} finally { await browser.close(); }
console.log(`Synthetic artifacts: ${workspace}`);
