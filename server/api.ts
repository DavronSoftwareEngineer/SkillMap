import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import pg from 'pg';
import { getConnectionString } from '@netlify/database';
import type { Pool, PoolClient } from 'pg';
import { MAX_CLOUD_BYTES, validCloudData } from '../src/lib/cloud-data';

const scrypt = (password: string, salt: string) => new Promise<Buffer>((resolve, reject) => {
  scryptCallback(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
    (error, result) => error ? reject(error) : resolve(result));
});
type User = { id: string; username: string; password_hash: string };
type Options = { pool?: Pool; key?: string; ip?: string };
class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
let database: Pool | undefined;
function pool() {
  if (database) return database;
  // Netlify resolves the database for this deploy, including isolated preview branches.
  let managedConnectionString: string | undefined;
  try { managedConnectionString = getConnectionString(); } catch { /* Local/external PostgreSQL below. */ }
  const connectionString = managedConnectionString ?? process.env.SKILLMAP_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!connectionString) throw new HttpError(503, 'Cloud bazasi hali ulanmagan. Serverdagi database URLni sozlash kerak.');
  const target = new URL(connectionString);
  if (!['postgres:', 'postgresql:'].includes(target.protocol)) throw new HttpError(503, 'Cloud database sozlamasi noto‘g‘ri.');
  // Managed external databases require verified TLS; localhost remains suitable for Docker tests.
  if (!['localhost', '127.0.0.1', '[::1]'].includes(target.hostname)) target.searchParams.set('sslmode', 'verify-full');
  database = new pg.Pool({ connectionString: target.toString(), max: 3, connectionTimeoutMillis: 15000, idleTimeoutMillis: 30000 });
  database.on('error', () => console.error('SkillMap idle database connection failed'));
  return database;
}
const digest = (value: string) => createHash('sha256').update(value).digest('hex');
const response = (status: number, data: unknown, cookie?: string) => new Response(JSON.stringify(data), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', ...(cookie ? { 'Set-Cookie': cookie } : {}) },
});
function encryptionKey(value: string | undefined) {
  if (!value || !/^[a-f0-9]{64}$/i.test(value)) throw new HttpError(503, 'Cloud uchun server sozlamalari hali tayyor emas.');
  return Buffer.from(value, 'hex');
}
function encrypt(data: unknown, key: Buffer, userId: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(userId));
  const body = Buffer.concat([cipher.update(JSON.stringify(data)), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64');
}
function decrypt(value: string, key: Buffer, userId: string) {
  const bytes = Buffer.from(value, 'base64');
  const cipher = createDecipheriv('aes-256-gcm', key, bytes.subarray(0, 12));
  cipher.setAAD(Buffer.from(userId));
  cipher.setAuthTag(bytes.subarray(12, 28));
  const data: unknown = JSON.parse(Buffer.concat([cipher.update(bytes.subarray(28)), cipher.final()]).toString());
  if (!validCloudData(data)) throw new Error('Invalid stored snapshot');
  return data;
}
export async function passwordHash(password: string) {
  const salt = randomBytes(16).toString('hex');
  const result = await scrypt(password, salt);
  return salt + ':' + result.toString('hex');
}
async function verifyPassword(password: string, hash: string) {
  const [salt, hex] = hash.split(':');
  const actual = await scrypt(password, salt);
  const expected = Buffer.from(hex, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
function password(value: unknown): string {
  if (typeof value !== 'string' || value.length < 12 || value.length > 128) throw new HttpError(400, 'Parol 12–128 belgidan iborat bo‘lsin.');
  return value;
}
async function body(request: Request, maxBytes: number): Promise<Record<string, unknown>> {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new HttpError(415, 'JSON kerak.');
  if (Number(request.headers.get('content-length')) > maxBytes) throw new HttpError(413, 'Ma’lumot hajmi juda katta.');
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'Ma’lumot kerak.');
  const chunks: Uint8Array[] = []; let bytes = 0;
  while (true) {
    const chunk = await reader.read(); if (chunk.done) break;
    bytes += chunk.value.length;
    if (bytes > maxBytes) { await reader.cancel(); throw new HttpError(413, 'Ma’lumot hajmi juda katta.'); }
    chunks.push(chunk.value);
  }
  let data: unknown;
  try { data = JSON.parse(Buffer.concat(chunks).toString()); } catch { throw new HttpError(400, 'JSON noto‘g‘ri.'); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new HttpError(400, 'Ma’lumot noto‘g‘ri.');
  return data as Record<string, unknown>;
}
async function authLimit(db: Pool, ip: string) {
  // A fixed window also limits expensive password hashing across serverless instances.
  const window = Math.floor(Date.now() / 900000);
  const bucket = digest(ip + ':' + window);
  const result = await db.query<{ attempts: number }>(
    'INSERT INTO skillmap_auth_limits(bucket, attempts, expires_at) VALUES($1,1,now()+interval \'15 minutes\') ON CONFLICT(bucket) DO UPDATE SET attempts=skillmap_auth_limits.attempts+1 RETURNING attempts', [bucket]);
  await db.query('DELETE FROM skillmap_auth_limits WHERE expires_at < now()');
  if (result.rows[0].attempts > 20) throw new HttpError(429, 'Juda ko‘p urinish. 15 daqiqadan keyin urinib ko‘ring.');
}

export async function handleRequest(request: Request, options: Options = {}): Promise<Response> {
  let client: PoolClient | undefined;
  try {
    const url = new URL(request.url);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (!local && url.protocol !== 'https:') throw new HttpError(400, 'HTTPS kerak.');
    const cookieName = local ? 'skillmap_session' : '__Host-skillmap_session';
    const token = request.headers.get('cookie')?.split(';').map(s => s.trim()).find(s => s.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
    const method = request.method;
    const route = url.pathname.replace(/^\/\.netlify\/functions\/skillmap/, '').replace(/^\/sync/, '');
    const routes: Record<string, string[]> = { '/me': ['GET'], '/register': ['POST'], '/login': ['POST'], '/logout': ['POST'], '/progress': ['GET', 'PUT'], '/password': ['POST'], '/account': ['DELETE'] };
    if (!routes[route]) throw new HttpError(404, 'Manzil topilmadi.');
    if (!routes[route].includes(method)) throw new HttpError(405, 'Usul ruxsat etilmagan.');
    if (method !== 'GET' && request.headers.get('origin') !== url.origin) throw new HttpError(403, 'So‘rov manbasi mos emas.');
    const authenticatedRoute = !['/login', '/register'].includes(route);
    if (authenticatedRoute && (!token || !/^[a-f0-9]{64}$/.test(token))) throw new HttpError(401, 'Avval hisobga kiring.');
    const db = options.pool ?? pool();
    const key = encryptionKey(options.key ?? process.env.SYNC_ENCRYPTION_KEY);
    const cookie = (value: string, age = 604800) => cookieName + '=' + value + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + age + (local ? '' : '; Secure');
    if (['/register', '/login', '/password', '/account'].includes(route)) await authLimit(db, options.ip ?? 'unknown');
    const data = method === 'GET' || route === '/logout' ? {} : await body(request, route === '/progress' ? MAX_CLOUD_BYTES : 8192);
    // Hash outside a transaction to avoid holding a connection for scrypt unnecessarily.
    let newHash: string | undefined;
    if (route === '/register') newHash = await passwordHash(password(data.password));
    if (route === '/password') newHash = await passwordHash(password(data.newPassword));
    client = await db.connect(); await client.query('BEGIN');
    let user: User | undefined;
    if (authenticatedRoute) {
      const found = await client.query<User>('SELECT u.* FROM skillmap_users u JOIN skillmap_sessions s ON s.user_id=u.id WHERE s.token_hash=$1 AND s.expires_at>now() FOR UPDATE OF u', [digest(token!)]);
      user = found.rows[0]; if (!user) throw new HttpError(401, 'Sessiya tugagan. Qayta kiring.');
    } else {
      if (typeof data.username !== 'string' || !/^[a-zA-Z0-9_]{3,32}$/.test(data.username)) throw new HttpError(400, 'Login 3–32 ta lotin harfi, raqam yoki _ bo‘lsin.');
      const username = data.username.toLowerCase();
      if (route === '/register') {
        const inserted = await client.query<User>('INSERT INTO skillmap_users(id,username,password_hash) VALUES($1,$2,$3) ON CONFLICT(username) DO NOTHING RETURNING *', [randomUUID(), username, newHash]);
        user = inserted.rows[0]; if (!user) throw new HttpError(409, 'Bu login band.');
        await client.query('INSERT INTO skillmap_progress(user_id,ciphertext) VALUES($1,$2)', [user.id, encrypt({}, key, user.id)]);
      } else {
        const found = await client.query<User>('SELECT * FROM skillmap_users WHERE username=$1 FOR UPDATE', [username]);
        user = found.rows[0];
        const supplied = password(data.password);
        const hash = user?.password_hash ?? '00000000000000000000000000000000:' + '00'.repeat(64);
        if (!await verifyPassword(supplied, hash) || !user) throw new HttpError(401, 'Login yoki parol noto‘g‘ri.');
      }
      const session = randomBytes(32).toString('hex');
      await client.query('DELETE FROM skillmap_sessions WHERE expires_at < now()');
      await client.query('INSERT INTO skillmap_sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval \'7 days\')', [digest(session), user.id]);
      await client.query('COMMIT'); return response(200, { user: { id: user.id, username: user.username } }, cookie(session));
    }
    const account = { id: user!.id, username: user!.username };
    if (method !== 'GET' && route !== '/logout' && data.accountId !== user!.id) throw new HttpError(409, 'Hisob boshqa oynada almashgan. Qayta kiring.');
    let result: unknown = { user: account }; let setCookie: string | undefined;
    if (route === '/logout') {
      await client.query('DELETE FROM skillmap_sessions WHERE token_hash=$1', [digest(token!)]); setCookie = cookie('', 0); result = { ok: true };
    }
    if (route === '/password' || route === '/account') {
      if (!await verifyPassword(password(data.password), user!.password_hash)) throw new HttpError(401, 'Joriy parol noto‘g‘ri.');
      if (route === '/account') await client.query('DELETE FROM skillmap_users WHERE id=$1', [user!.id]);
      else {
        await client.query('UPDATE skillmap_users SET password_hash=$1 WHERE id=$2', [newHash, user!.id]);
        await client.query('DELETE FROM skillmap_sessions WHERE user_id=$1', [user!.id]);
      }
      setCookie = cookie('', 0); result = { ok: true };
    }
    if (route === '/progress') {
      if (method === 'PUT') {
        if (!Number.isSafeInteger(data.revision) || Number(data.revision) < 0 || !validCloudData(data.data)) throw new HttpError(400, 'Progress tuzilishi noto‘g‘ri.');
        const saved = await client.query('UPDATE skillmap_progress SET ciphertext=$1,revision=revision+1,updated_at=now() WHERE user_id=$2 AND revision=$3 RETURNING revision', [encrypt(data.data, key, user!.id), user!.id, data.revision]);
        if (!saved.rowCount) throw new HttpError(409, 'Cloud boshqa qurilmada o‘zgargan. Avval yangilangan nusxani ko‘ring.');
      }
      const saved = await client.query<{ ciphertext: string; revision: number; updated_at: Date }>('SELECT * FROM skillmap_progress WHERE user_id=$1', [user!.id]);
      const row = saved.rows[0];
      result = { user: account, revision: row.revision, updatedAt: row.updated_at.toISOString(), data: decrypt(row.ciphertext, key, user!.id) };
    }
    await client.query('COMMIT'); return response(200, result, setCookie);
  } catch (error) {
    if (client) { try { await client.query('ROLLBACK'); } catch { /* connection already lost */ } }
    if (error instanceof HttpError) return response(error.status, { error: error.message });
    // Do not log request bodies, passwords, tokens or database connection strings.
    console.error('SkillMap API failed:', error instanceof Error ? error.name : 'unknown');
    return response(503, { error: 'Cloud hozir ishlamayapti. Mahalliy ma’lumotlaringiz brauzerda saqlanadi.' });
  } finally { client?.release(); }
}
