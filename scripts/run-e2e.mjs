import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const host = "127.0.0.1";
const port = 4175;
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
}

let exitCode = 1;
try {
  await waitForServer();
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
