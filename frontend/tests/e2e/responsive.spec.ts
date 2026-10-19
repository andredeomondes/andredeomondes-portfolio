import { existsSync } from "node:fs";
import { expect, test } from "@playwright/test";

// /admin needs Supabase credentials; skip where none are configured (e.g. a fresh clone).
const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) || existsSync(".env.local") || existsSync(".env");

const routes = [
  "/",
  "/projects",
  "/projects/drop-aki-tcg",
  "/posts",
  "/posts/01-javascript-tipos-coercao",
  "/series/javascript-core",
  "/about",
  "/resume",
];

test.describe("mobile 375px", () => {
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

  for (const route of routes) {
    test(`sem scroll horizontal em ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(400);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }
});

test("admin continua renderizando", async ({ page }) => {
  test.skip(!hasSupabaseEnv, "Supabase env not configured");
  const response = await page.goto("/admin/login");
  expect(response?.status()).toBeLessThan(500);
  await expect(page.locator("form")).toBeVisible();
});
