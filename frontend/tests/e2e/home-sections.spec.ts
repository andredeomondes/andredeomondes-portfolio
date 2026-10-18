import { expect, test } from "@playwright/test";

test("manifesto acende com o scroll", async ({ page }) => {
  await page.goto("/");
  const manifesto = page.getByTestId("manifesto");
  await expect(manifesto.locator(".is-lit")).toHaveCount(0);
  await manifesto.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 800);
  await expect.poll(() => manifesto.locator(".is-lit").count()).toBeGreaterThan(5);
});

test("card de projeto ganha cor no hover", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const card = page.getByTestId("pixel-card").first();
  await card.scrollIntoViewIfNeeded();
  const image = card.locator("img");
  expect(await image.evaluate((el) => getComputedStyle(el).filter)).toContain("grayscale(1)");
  await card.hover();
  await expect.poll(() => image.evaluate((el) => getComputedStyle(el).filter)).toBe("none");
  await expect(page.getByTestId("pixel-card")).toHaveCount(3);
});

test("seção Atuação saiu", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#atuacao")).toHaveCount(0);
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("manifesto legível", async ({ page }) => {
    await page.goto("/");
    const color = await page.getByTestId("manifesto").locator(".manifesto__word").first().evaluate((el) => getComputedStyle(el).color);
    expect(color).not.toBe("rgb(42, 42, 42)");
  });
});
