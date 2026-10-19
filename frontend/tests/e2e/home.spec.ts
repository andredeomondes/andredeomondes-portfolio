import { expect, test } from "@playwright/test";

test("hero com título e console funcional", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Engenharia de backend e IA aplicada");
  const consoleInput = page.locator(".hero__console input");
  await consoleInput.fill("caji");
  await expect(page.locator(".hero__console").getByRole("option", { name: /CajiAgent/ })).toBeVisible();
  await consoleInput.press("Enter");
  await expect(page).toHaveURL(/\/projects\/caji-agent$/);
});

test("galeria de trabalho lista os três cases", async ({ page }) => {
  await page.goto("/");
  const work = page.locator("section.work");
  await expect(work.getByRole("heading", { level: 3 })).toHaveCount(3);
  await expect(work.getByRole("link", { name: "Ver o case" }).first()).toHaveAttribute("href", "/projects/drop-aki-tcg");
});

test("no desktop a galeria anda na horizontal com o scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForTimeout(1500);
  const track = page.locator(".work__track");
  // Scroll with the wheel (Lenis-driven) until the gallery has been pinned and moved.
  await expect
    .poll(async () => {
      await page.mouse.wheel(0, 500);
      return track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
    }, { timeout: 15000, intervals: [400] })
    .toBeLessThan(-50);
});

test("trilha do JS Core mostra as últimas unidades", async ({ page }) => {
  await page.goto("/");
  const course = page.locator("section.course");
  await expect(course.locator(".course__row")).toHaveCount(6);
  await expect(course.getByRole("progressbar")).toHaveAttribute("aria-valuenow", /\d+/);
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });
  test("sem pin nem deslocamento horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.locator("section.work").scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(800);
    expect(await page.locator(".work__track").evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    expect(await page.locator(".pin-spacer").count()).toBe(0);
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("conteúdo principal legível", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("section.work").getByRole("link", { name: "Ver o case" })).toHaveCount(3);
    await expect(page.locator(".terminal__lines li").first()).toBeVisible();
  });
});
