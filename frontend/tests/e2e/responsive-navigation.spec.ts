import { expect, test } from "@playwright/test";

test.describe("navegação responsiva", () => {
  test.use({ viewport: { width: 414, height: 896 }, hasTouch: true, isMobile: true });

  test("abre e fecha o menu no tamanho do iPhone XR", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Abrir menu" });

    await expect(trigger).toBeVisible();
    await trigger.click();

    const menu = page.locator("#mobile-navigation");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: /JS Core/ })).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
  });
});

test.describe("breakpoints da navegação", () => {
  test("mantém o menu compacto em tablets", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/projects");
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();
  });

  test("mostra a navegação completa a partir de 1024px", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/projects");
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeHidden();
    await expect(page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "JS Core" })).toBeVisible();
  });

  test("links da navegação e foco amarelo", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegação principal" });
    for (const name of ["Início", "Projetos", "JS Core", "Sobre"]) await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Início", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: /Contato/ })).toHaveAttribute("href", "/#contato");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineColor);
    expect(outline).toBe("rgb(247, 223, 30)");
  });
});
