import { expect, test } from "@playwright/test";

test("índice lista os cases com links", async ({ page }) => {
  await page.goto("/projects");
  const rows = page.locator(".preview-list__row");
  await expect(rows).toHaveCount(3);
  await expect(rows.first()).toHaveAttribute("href", "/projects/drop-aki-tcg");
});

test("hover num case mostra a prévia flutuante (desktop)", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/projects");
  await page.locator(".preview-list__row").nth(1).hover();
  await expect(page.locator(".preview-list__float")).toBeVisible();
});

test("case mostra fatos, arquitetura viva, lightbox e próximo case", async ({ page }) => {
  await page.goto("/projects/drop-aki-tcg");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Drop Aki TCG");
  await expect(page.getByTestId("project-facts")).toContainText("Papel");
  const map = page.getByTestId("architecture-panel");
  await map.scrollIntoViewIfNeeded();
  await expect(map).toHaveClass(/is-live/);
  await expect(map).toContainText("PagBank + Melhor Envio");
  await page.getByRole("button", { name: /Página inicial da loja Drop Aki TCG/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByRole("link", { name: "Próximo case: AMR Mobile" })).toHaveAttribute("href", "/projects/amr-mobile");
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("arquitetura legível", async ({ page }) => {
    await page.goto("/projects/drop-aki-tcg");
    const node = page.locator(".arch__node").first();
    expect(await node.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });
});
