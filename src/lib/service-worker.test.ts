// @vitest-environment node
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { expect, it, vi } from 'vitest';

function worker() {
  const handlers: Record<string, (e: any) => void> = {};
  const cache = { addAll: vi.fn(), put: vi.fn(), match: vi.fn() };
  const caches = { open: vi.fn(async () => cache), keys: vi.fn(async () => ['other-app','skillmap-v1','skillmap-v2']), delete: vi.fn() };
  const fetch = vi.fn();
  runInNewContext(readFileSync('public/sw.js','utf8'), {
    self: { addEventListener: (name: string, cb: any) => handlers[name] = cb, location: { origin: 'https://skill.test' }, clients: { claim: vi.fn() } },
    caches, fetch, URL, Response,
  });
  const request = (mode='navigate', destination='document', url='https://skill.test/') => {
    let result: Promise<Response> | undefined;
    handlers.fetch({ request: { mode, destination, url, method:'GET' }, respondWith: (p: Promise<Response>) => result=p });
    return result;
  };
  return {handlers,cache,caches,fetch,request};
}
it('only deletes old SkillMap caches',async()=>{
  const w=worker(); let done: Promise<unknown> | undefined;
  w.handlers.activate({waitUntil:(p:Promise<unknown>)=>done=p}); await done;
  expect(w.caches.delete.mock.calls).toEqual([['skillmap-v1']]);
});
it('server errors do not poison the offline shell',async()=>{
  const w=worker(); w.fetch.mockResolvedValue(new Response('down',{status:503}));
  w.cache.match.mockResolvedValue(new Response('saved app'));
  expect(await (await w.request())!.text()).toBe('saved app');
  expect(w.cache.put).not.toHaveBeenCalled();
});
it('cached assets do not generate redundant network requests',async()=>{
  const w=worker(); w.cache.match.mockResolvedValue(new Response('JS'));
  expect(await (await w.request('cors','script'))!.text()).toBe('JS');
  expect(w.fetch).not.toHaveBeenCalled();
});
it('does not intercept external or API requests',()=>{
  const w=worker();
  expect(w.request('cors','','https://skill.test/api/private')).toBeUndefined();
  expect(w.request('cors','script','https://external.test/code.js')).toBeUndefined();
});
it('uncached offline assets return a real 503 response',async()=>{
  const w=worker(); w.fetch.mockRejectedValue(new Error('offline'));
  expect((await w.request('cors','script'))!.status).toBe(503);
});
it('quota failure does not discard a successful navigation',async()=>{
  const w=worker(); w.fetch.mockResolvedValue(new Response('app',{headers:{'content-type':'text/html'}}));
  w.cache.put.mockRejectedValue(new Error('quota'));
  expect(await (await w.request())!.text()).toBe('app');
});
