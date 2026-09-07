import { expect, test } from "@playwright/test";

test("writing lab persists draft and exports markdown", async ({ page }) => {
  await page.goto("/#english/WriteLab");
  await page.getByRole("button", { name: "Amaliy lab", exact: true }).click();
  await page.getByLabel(/Birinchi draft/).fill("The raster import is blocked because the source CRS is unknown.");
  await page.getByLabel("Tuzatilgan variant", { exact: true }).fill("Please confirm the source CRS. I will send another update tomorrow at 10:00.");
  await expect(page.getByText("Shu brauzerda saqlandi")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Amaliy lab", exact: true }).click();
  await expect(page.getByLabel(/Birinchi draft/)).toHaveValue(/source CRS is unknown/);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Matnni Markdown eksport qilish" }).click();
  expect((await download).suggestedFilename()).toBe("skillmap-writing-main.md");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.locator(".side").evaluate(el => el.getBoundingClientRect().right)).toBeLessThanOrEqual(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "test-results/english-writing-mobile.png", animations: "disabled" });
});

test("bad backup is rejected without losing progress; valid backup restores", async ({ page }) => {
  await page.goto("/#english/dash");
  await expect(page.getByRole("button", { name: "Zaxira eksport" })).toBeVisible();
  await page.evaluate(() => localStorage.setItem("english_progress", JSON.stringify({ kept: true })));
  const input = page.locator('input[type="file"]');
  await input.setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ app: "SkillMap", version: 1, data: { english_progress: { lost: true }, myacademy_streak: null } })) });
  await expect(page.getByText(/tuzilishi noto'g'ri/)).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("english_progress")!))).toEqual({ kept: true });
  await input.setInputFiles({ name: "good.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ app: "SkillMap", version: 1, data: { english_worklabs: { "writing-main": { draft: "Imported draft" } } } })) });
  await expect(page.getByText("Zaxira tiklandi", { exact: true })).toBeVisible();
  await page.goto("/#english/WriteLab");
  await page.getByRole("button", { name: "Amaliy lab", exact: true }).click();
  await expect(page.getByLabel(/Birinchi draft/)).toHaveValue("Imported draft");
});

test("storage failure is visible to the learner", async ({ page }) => {
  await page.goto("/#english/WriteLab");
  await page.getByRole("button", { name: "Amaliy lab", exact: true }).click();
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException("Full", "QuotaExceededError"); }; });
  await page.getByLabel(/Birinchi draft/).fill("Keep this unsaved draft.");
  await expect(page.getByRole("alert")).toContainText("O'zgarish saqlanmadi");
  await expect(page.getByText("Saqlanmadi — matnni eksport qiling")).toBeVisible();
  await expect(page.getByLabel(/Birinchi draft/)).toHaveValue("Keep this unsaved draft.");
});

test("course download failure shows recovery actions", async ({ page }) => {
  await page.route("**/src/data/english.json*", route => route.abort());
  await page.goto("/#english/WriteLab");
  await expect(page.getByRole("heading", { name: "Kurs yuklanmadi" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Qayta urinish", exact: true })).toBeVisible();
  await page.unroute("**/src/data/english.json*");
  // Browsers may cache a rejected dynamic import. The explicit reload is the fallback.
  await page.getByRole("button", { name: "Sahifani yangilash" }).click();
  await expect(page.getByRole("button", { name: "Amaliy lab", exact: true })).toBeVisible();
});
