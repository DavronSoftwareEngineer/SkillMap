import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { existsSync } from 'node:fs';
import { handleRequest } from './api';
// Local secrets are loaded only by the backend process.
if (existsSync('.env')) process.loadEnvFile('.env');
if (!process.env.SYNC_ENCRYPTION_KEY || !process.env.SKILLMAP_DATABASE_URL) {
  throw new Error('Copy .env.example to .env and set database URL and encryption key. See docs/netlify-fullstack.md.');
}
const server = createServer(async (incoming, outgoing) => {
  try {
    const host = incoming.headers.host;
    if (!host || !/^(127\.0\.0\.1|localhost):\d+$/.test(host)) { outgoing.writeHead(400); outgoing.end(); return; }
    const headers = new Headers();
    for (const [name, value] of Object.entries(incoming.headers)) {
      if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(',') : value);
    }
    const init: RequestInit & { duplex?: string } = { method: incoming.method, headers };
    if (!['GET', 'HEAD'].includes(incoming.method ?? 'GET')) {
      init.body = Readable.toWeb(incoming) as ReadableStream; init.duplex = 'half';
    }
    const request = new Request('http://' + host + incoming.url, init);
    const result = await handleRequest(request, { ip: incoming.socket.remoteAddress });
    outgoing.writeHead(result.status, Object.fromEntries(result.headers)); outgoing.end(Buffer.from(await result.arrayBuffer()));
  } catch { outgoing.writeHead(500, { 'Content-Type': 'application/json' }); outgoing.end('{"error":"Local API failed"}'); }
});
server.listen(8788, '127.0.0.1', () => console.log('SkillMap local API: http://127.0.0.1:8788 (use the Vite site for login)'));
