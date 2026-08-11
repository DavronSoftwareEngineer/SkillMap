import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:4175", trace: "retain-on-failure" },
  // `npm run test:e2e` serverni scripts/run-e2e.mjs orqali o'zi boshqaradi.
  // Bu yer browser/CI'dan bevosita Playwright ishlatilganda qulay fallback.
  webServer: process.env.PW_MANAGED_SERVER ? undefined : {
    // npm shell wrapper Windows'da Playwright tugagandan keyin osilib qolishi
    // mumkin. Vite'ni bevosita Node bilan ishga tushirish teardown'ni ishonchli qiladi.
    command: "node ./node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4175 --strictPort",
    url: "http://127.0.0.1:4175",
    timeout: 20_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
