import { expect, test } from "@playwright/test";

test("sobre resumido com retrato normal e 4 barras", async ({ page }) => {
  await page.goto("/");
  const bars = page.getByTestId("attribute-bar");
  await bars.first().scrollIntoViewIfNeeded();
  await expect(bars).toHaveCount(4);
  await expect(bars.nth(0)).toContainText("BACKEND");
  await expect.poll(() => bars.nth(0).locator("i.on").count()).toBe(18);
  const portrait = page.getByRole("img", { name: "Retrato de Andre Deomondes" });
  expect(await portrait.evaluate((el) => getComputedStyle(el).filter)).toBe("none");
});

test("publicações JS Core continuam na home e escuras", async ({ page }) => {
  await page.goto("/");
  const writing = page.locator("section.home-writing");
  await expect(writing).toBeVisible();
  await expect(writing.getByRole("link").first()).toBeVisible();
});
