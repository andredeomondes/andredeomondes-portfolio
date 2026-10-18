import { expect, test } from "@playwright/test";

test("título do hero e IDE digitando", async ({ page }) => {
  await page.goto("/");
  const h1 = page.locator("h1");
  await expect(h1).toHaveText(/Sistemas\s+que\s+rodam\s+em\s+produção/);
  await expect(h1).toBeVisible({ timeout: 1000 });
  await expect(h1.locator(".font-pixel")).toHaveText(["rodam", "produção"]);
  await expect(page.getByTestId("ide-code")).toContainText("createOrder", { timeout: 6000 });
  await expect(page.getByTestId("live-ide")).not.toContainText(/drop|amr|caji/i);
});

test("IDE se endireita com o scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const ide = page.getByTestId("live-ide");
  await expect.poll(() => ide.evaluate((el) => getComputedStyle(el).transform)).not.toBe("none");
  const before = await ide.evaluate((el) => getComputedStyle(el).transform);
  await page.mouse.wheel(0, 600);
  await expect
    .poll(async () => {
      const after = await ide.evaluate((el) => getComputedStyle(el).transform);
      return after !== before && (after === "none" || /^matrix\(1, 0, 0, 1,/.test(after));
    }, { timeout: 5000 })
    .toBe(true);
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("código completo de imediato e IDE reto", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("ide-code")).toContainText("return order", { timeout: 500 });
    expect(await page.getByTestId("live-ide").evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("título e lead legíveis", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.locator("h1 span").first().evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    await expect(page.getByTestId("ide-code")).toContainText("createOrder");
  });
});
