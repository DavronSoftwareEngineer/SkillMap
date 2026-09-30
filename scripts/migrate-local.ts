import { existsSync, readFileSync, readdirSync } from 'node:fs';
import pg from 'pg';
if (existsSync('.env')) process.loadEnvFile('.env');
const url = process.env.SKILLMAP_DATABASE_URL;
if (!url) throw new Error('SKILLMAP_DATABASE_URL required');
const target = new URL(url);
if (!['127.0.0.1', 'localhost'].includes(target.hostname) || !/^\/skillmap_(local|test)$/.test(target.pathname)) {
  throw new Error('This script only migrates a local skillmap_local or skillmap_test database. Netlify manages production migrations.');
}
const pool = new pg.Pool({ connectionString: url }); const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(193749, 1)');
  await client.query('CREATE TABLE IF NOT EXISTS skillmap_local_migrations(name text PRIMARY KEY)');
  for (const name of readdirSync('netlify/database/migrations').filter(n => /^\d+_[a-z0-9_-]+\.sql$/.test(n)).sort()) {
    const found = await client.query('SELECT 1 FROM skillmap_local_migrations WHERE name=$1', [name]);
    if (found.rowCount) continue;
    await client.query(readFileSync('netlify/database/migrations/' + name, 'utf8'));
    await client.query('INSERT INTO skillmap_local_migrations(name) VALUES($1)', [name]); console.log('Applied ' + name);
  }
  await client.query('COMMIT');
} catch (error) { await client.query('ROLLBACK'); throw error; }
finally { client.release(); await pool.end(); }
