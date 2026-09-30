import { test } from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import { readFileSync } from 'node:fs';
import { handleRequest } from './api';
const connectionString = process.env.SKILLMAP_TEST_DATABASE_URL;
if (!connectionString) throw new Error('Set SKILLMAP_TEST_DATABASE_URL to an isolated PostgreSQL skillmap_test database.');
const target = new URL(connectionString);
if (!['localhost', '127.0.0.1'].includes(target.hostname) || target.pathname !== '/skillmap_test') throw new Error('Tests only use local skillmap_test database.');
const pool = new pg.Pool({ connectionString }); const key = 'ab'.repeat(32);

test('real PostgreSQL: sessions, ownership, CAS, encryption, validation and revocation', async t => {
  await pool.query('DROP TABLE IF EXISTS skillmap_auth_limits,skillmap_progress,skillmap_sessions,skillmap_users CASCADE');
  await pool.query(readFileSync('server/database/migrations/0001_accounts.sql', 'utf8'));
  let count = 0;
  async function call(path: string, method = 'GET', data?: unknown, cookie = '', origin = 'https://skillmap.example') {
    const response = await handleRequest(new Request('https://skillmap.example/sync' + path, {
      method, headers: { 'Content-Type': 'application/json', Origin: origin, Cookie: cookie }, body: data ? JSON.stringify(data) : undefined,
    }), { pool, key, ip: 'test-' + count++ });
    return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0] ?? '', headers: response.headers };
  }
  try {
    await t.test('anonymous reads avoid a database connection; origin is required', async () => {
      const result = await handleRequest(new Request('https://skillmap.example/sync/me'));
      assert.equal(result.status, 401); assert.equal(result.headers.get('cache-control'), 'no-store');
      assert.equal((await call('/register', 'POST', { username: 'alice', password: 'safe password 123' }, '', 'https://evil.example')).status, 403);
    });
    await t.test('unconfigured deployment returns a setup error without provisioning a database', async () => {
      const names = ['SKILLMAP_DATABASE_URL', 'DATABASE_URL', 'NETLIFY_DB_URL'];
      const previous = names.map(name => process.env[name]);
      try {
        names.forEach(name => delete process.env[name]);
        const result = await handleRequest(new Request('https://skillmap.example/sync/register', {
          method: 'POST', headers: { Origin: 'https://skillmap.example', 'Content-Type': 'application/json' }, body: '{}',
        }), { key });
        assert.equal(result.status, 503);
        assert.match((await result.json()).error, /Cloud bazasi hali ulanmagan/);
      } finally { names.forEach((name, index) => { if (previous[index] === undefined) delete process.env[name]; else process.env[name] = previous[index]; }); }
    });
    const alice = await call('/register', 'POST', { username: 'alice', password: 'safe password 123' });
    const bob = await call('/register', 'POST', { username: 'bob', password: 'safe password 456' });
    assert.equal(alice.status, 200); assert.equal(bob.status, 200);
    const aid = alice.data.user.id; const bid = bob.data.user.id;
    await t.test('passwords and sessions are hashed, cookies are protected', async () => {
      assert.match(alice.headers.get('set-cookie')!, /HttpOnly; SameSite=Strict/); assert.match(alice.cookie, /^__Host-/); assert.match(alice.headers.get('set-cookie')!, /Secure/);
      const rows = await pool.query('SELECT password_hash FROM skillmap_users WHERE id=$1', [aid]);
      assert.notEqual(rows.rows[0].password_hash, 'safe password 123');
      const sessions = await pool.query('SELECT token_hash FROM skillmap_sessions WHERE user_id=$1', [aid]);
      assert.notEqual(sessions.rows[0].token_hash, alice.cookie.split('=')[1]);
      assert.equal((await call('/login', 'POST', { username: 'alice', password: 'wrong password 123' })).status, 401);
    });
    await t.test('snapshot roundtrip and ownership binding', async () => {
      const saved = await call('/progress', 'PUT', { accountId: aid, revision: 0, data: { english_progress: { t1: true }, english_practice: { z1: { attempt: 'PRIVATE_EVIDENCE' } } } }, alice.cookie);
      assert.equal(saved.status, 200); assert.equal(saved.data.revision, 1);
      assert.equal((await call('/progress', 'GET', undefined, bob.cookie)).data.revision, 0);
      assert.equal((await call('/progress', 'PUT', { accountId: aid, revision: 0, data: {} }, bob.cookie)).status, 409);
      const ciphertext = (await pool.query('SELECT ciphertext FROM skillmap_progress WHERE user_id=$1', [aid])).rows[0].ciphertext;
      assert.ok(!ciphertext.includes('PRIVATE_EVIDENCE'));
      assert.equal(saved.data.data.english_practice.z1.attempt, 'PRIVATE_EVIDENCE');
    });
    await t.test('simultaneous writes have exactly one winner', async () => {
      const results = await Promise.all([true, false].map(value => call('/progress', 'PUT', { accountId: aid, revision: 1, data: { english_progress: { t1: value } } }, alice.cookie)));
      assert.deepEqual(results.map(r => r.status).sort(), [200, 409]);
      assert.equal((await call('/progress', 'GET', undefined, alice.cookie)).data.revision, 2);
    });
    await t.test('invalid and secret-containing snapshots are rejected', async () => {
      for (const data of [{ ai_api_key: 'secret' }, { english_progress: { t1: 'yes' } }, { mystery_progress: {} }, JSON.parse('{"english_progress":{"__proto__":true}}')]) {
        assert.equal((await call('/progress', 'PUT', { accountId: aid, revision: 2, data }, alice.cookie)).status, 400);
      }
      const huge = { english_practice: { z1: { attempt: 'x'.repeat(2100000) } } };
      assert.equal((await call('/progress', 'PUT', { accountId: aid, revision: 2, data: huge }, alice.cookie)).status, 413);
      assert.equal((await call('/progress', 'GET', undefined, alice.cookie)).data.revision, 2);
    });
    await t.test('password change revokes every previous session', async () => {
      const otherSession = await call('/login', 'POST', { username: 'alice', password: 'safe password 123' });
      assert.equal((await call('/password', 'POST', { accountId: aid, password: 'safe password 123', newPassword: 'changed password 123' }, alice.cookie)).status, 200);
      assert.equal((await call('/me', 'GET', undefined, alice.cookie)).status, 401);
      assert.equal((await call('/me', 'GET', undefined, otherSession.cookie)).status, 401);
      assert.equal((await call('/login', 'POST', { username: 'alice', password: 'changed password 123' })).status, 200);
    });
    await t.test('delete requires password and cascades, logout revokes', async () => {
      assert.equal((await call('/account', 'DELETE', { accountId: bid, password: 'wrong password 123' }, bob.cookie)).status, 401);
      assert.equal((await call('/account', 'DELETE', { accountId: bid, password: 'safe password 456' }, bob.cookie)).status, 200);
      assert.equal((await call('/me', 'GET', undefined, bob.cookie)).status, 401);
      assert.equal((await pool.query('SELECT * FROM skillmap_progress WHERE user_id=$1', [bid])).rowCount, 0);
      const login = await call('/login', 'POST', { username: 'alice', password: 'changed password 123' });
      assert.equal((await call('/logout', 'POST', undefined, login.cookie)).status, 200);
      assert.equal((await call('/me', 'GET', undefined, login.cookie)).status, 401);
    });
    await t.test('distributed authentication limit persists in PostgreSQL', async () => {
      for (let i = 0; i < 20; i++) {
        const res = await handleRequest(new Request('https://skillmap.example/sync/login', { method: 'POST', headers: { Origin: 'https://skillmap.example', 'Content-Type': 'application/json' }, body: '{}' }), { pool, key, ip: 'limited-client' });
        assert.equal(res.status, 400);
      }
      const res = await handleRequest(new Request('https://skillmap.example/sync/login', { method: 'POST', headers: { Origin: 'https://skillmap.example', 'Content-Type': 'application/json' }, body: '{}' }), { pool, key, ip: 'limited-client' });
      assert.equal(res.status, 429);
    });
  } finally { await pool.end(); }
});
