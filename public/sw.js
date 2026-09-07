// Cache only public same-origin application assets; never API/provider data.
const CACHE = "skillmap-v2";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('skillmap-') && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
async function save(request, response) {
  try { await (await caches.open(CACHE)).put(request, response); }
  catch { /* Quota failure must not break an otherwise successful request. */ }
}
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(request);
        if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
          await save('./index.html', response.clone());
          return response;
        }
        return (await cache.match('./index.html')) || response;
      } catch {
        return (await cache.match('./index.html')) || new Response('Offline. Avval internet bilan sahifani oching.', { status: 503 });
      }
    })());
    return;
  }
  if (!['script','style','image','font','manifest'].includes(request.destination)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && !/no-store|private/i.test(response.headers.get('cache-control') || '')) {
        await save(request, response.clone());
      }
      return response;
    } catch {
      return new Response('Offline asset unavailable', { status: 503 });
    }
  })());
});
