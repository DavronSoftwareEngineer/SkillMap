import { spawn } from 'node:child_process';
if (!process.env.SKILLMAP_TEST_DATABASE_URL) throw new Error('SKILLMAP_TEST_DATABASE_URL required (local skillmap_test only).');
// The unreachable external fallback proves the API uses the managed Netlify URL.
const env = { ...process.env, SKILLMAP_FULLSTACK_E2E: '1', SKILLMAP_E2E_EXTERNAL_API: '0', NETLIFY_DB_URL: process.env.SKILLMAP_TEST_DATABASE_URL, SKILLMAP_DATABASE_URL: 'postgres://unused@127.0.0.1:1/skillmap_test', SYNC_ENCRYPTION_KEY: 'cd'.repeat(32) };
function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { stdio: 'inherit', env, windowsHide: true });
    child.once('error', reject); child.once('exit', code => code === 0 ? resolve() : reject(new Error('Full-stack check failed: ' + code)));
  });
}
// Sequential: API tests recreate only skillmap_test tables before the browser test starts.
await run(['--import', 'tsx', '--test', 'server/api.test.ts']);
await run(['scripts/run-e2e.mjs', 'cloud-account.spec.ts', '--workers=1']);
