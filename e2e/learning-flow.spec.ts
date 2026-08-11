import { expect, test } from "@playwright/test";

test("learner can switch courses and reach a project roadmap", async ({ page }) => {
  await page.goto("/#webgis");
  await expect(page.getByRole("heading", { name: "Geospatial Full-Stack Academy" })).toBeVisible();

  await page.getByRole("button", { name: "Backend" }).click();
  await expect(page.getByRole("heading", { name: "Professional Backend Academy" })).toBeVisible();

  await page.getByRole("button", { name: /Tayyorlik paneli Dashboard/ }).click();
  await expect(page.getByRole("heading", { name: "Project roadmap" })).toBeVisible();
  await expect(page.getByRole("button", { name: /TeamOps Board/ })).toBeVisible();
});

test("direct module links keep the selected course", async ({ page }) => {
  await page.goto("/#telegram/TG7");
  await expect(page.getByRole("heading", { name: "Professional Telegram Bot Academy" })).toBeVisible();
  await expect(page.getByText("Telegram Mini App bilan botni full-stack mahsulotga aylantirish")).toBeVisible();
});
