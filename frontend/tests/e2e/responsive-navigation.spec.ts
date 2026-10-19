import { expect, test } from "@playwright/test";

test.describe("navegação responsiva", () => {
  test.use({ viewport: { width: 414, height: 896 }, hasTouch: true, isMobile: true });

  test("abre e fecha o menu no celular", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Abrir menu" });
    await expect(trigger).toBeVisible();
    await trigger.click();
    const menu = page.locator("#mobile-navigation");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "JS Core" })).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
  });
});

test.describe("navegação desktop", () => {
  test("links principais e estado ativo", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/projects");
    const nav = page.getByRole("navigation", { name: "Navegação principal" });
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeHidden();
    for (const name of ["Projetos", "JS Core", "Publicações", "Sobre"]) await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Projetos", exact: true })).toHaveAttribute("aria-current", "page");
  });

  test("a barra vira pílula ao rolar", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/about");
    await expect(page.locator(".nav")).not.toHaveClass(/nav--compact/);
    await page.mouse.wheel(0, 400);
    await expect(page.locator(".nav")).toHaveClass(/nav--compact/);
  });
});
