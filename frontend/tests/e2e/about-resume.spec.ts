import { expect, test } from "@playwright/test";

test("sobre: retrato normal e linha do tempo que acende no scroll", async ({ page }) => {
  await page.goto("/about");
  const portrait = page.getByRole("img", { name: "Andre Deomondes" }).first();
  expect(await portrait.evaluate((el) => getComputedStyle(el).filter)).toBe("none");
  const timeline = page.locator(".timeline");
  await timeline.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.locator(".timeline__item.is-reached").count()).toBeGreaterThan(0);
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("linha do tempo completa visível", async ({ page }) => {
    await page.goto("/about");
    const fill = await page.locator(".timeline__fill").evaluate((el) => getComputedStyle(el).transform);
    expect(fill === "none" || fill === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
  });
});

test("currículo: dois downloads em PDF", async ({ page }) => {
  await page.goto("/resume");
  const downloads = page.getByRole("link", { name: /Baixar PDF/ });
  await expect(downloads).toHaveCount(2);
  await expect(downloads.first()).toHaveAttribute("href", /\.pdf$/);
});
