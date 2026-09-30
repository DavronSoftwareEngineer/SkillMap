import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const host = "127.0.0.1";
const port = 4175;
const backend = process.env.SKILLMAP_FULLSTACK_E2E === '1' && process.env.SKILLMAP_E2E_EXTERNAL_API !== '1'
  ? spawn(process.execPath, ['--import', 'tsx', 'server/dev.ts'], { stdio: 'inherit', windowsHide: true }) : null;
const vite = spawn(process.execPath, ["./node_modules/vite/bin/vite.js", "--host", host, "--port", String(port), "--strictPort"], {
  stdio: "ignore",
  windowsHide: true,
});

async function waitForServer() {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://${host}:${port}/`);
      if (response.ok) return;
    } catch {
      // Server hali ishga tushmoqda.
    }
    await delay(150);
  }
  throw new Error("E2E server 20 soniyada ishga tushmadi.");
}

function stopServer() {
  if (!vite.killed) vite.kill("SIGTERM");
  if (backend && !backend.killed) backend.kill('SIGTERM');
}

let exitCode = 1;
try {
  await waitForServer();
  if (backend) {
    const deadline = Date.now() + 20_000;
    let ready = false;
    while (Date.now() < deadline) {
      try { ready = (await fetch('http://127.0.0.1:8788/sync/me')).status === 401; } catch { /* starting */ }
      if (ready) break;
      await delay(150);
    }
    if (!ready) throw new Error('Full-stack API did not start');
  }
  const playwright = spawn(process.execPath, ["./node_modules/playwright/cli.js", "test", ...process.argv.slice(2)], {
    stdio: "inherit",
    env: { ...process.env, PW_MANAGED_SERVER: "1" },
    windowsHide: true,
  });
  exitCode = await new Promise((resolve) => playwright.once("exit", (code) => resolve(code ?? 1)));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
} finally {
  stopServer();
  await Promise.race([new Promise((resolve) => vite.once("exit", resolve)), delay(1_000)]);
}

process.exit(exitCode);
