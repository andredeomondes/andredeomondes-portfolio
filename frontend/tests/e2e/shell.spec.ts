import { expect, test } from "@playwright/test";

test.describe("command palette", () => {
  test("⌘K/Ctrl+K abre, busca e navega para um projeto", async ({ page }) => {
    await page.goto("/about");
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "Buscar no site" });
    await expect(dialog).toBeVisible();
    await page.keyboard.type("AMR");
    await expect(dialog.getByRole("option", { name: /AMR Mobile/ })).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projects\/amr-mobile$/);
    await expect(dialog).toBeHidden();
  });

  test("Esc fecha e o botão Buscar abre", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/about");
    await page.getByRole("button", { name: "Buscar no site" }).click();
    await expect(page.getByRole("dialog", { name: "Buscar no site" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Buscar no site" })).toBeHidden();
  });
});

test.describe("contato sem formulário", () => {
  test("não existe botão flutuante nem painel de contato repetido no rodapé", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator(".launcher-trigger")).toHaveCount(0);
    await expect(page.locator("footer #contato")).toHaveCount(0);
  });

  test("navbar abre o diálogo; o assunto muda a mensagem do WhatsApp", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/about");
    await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("button", { name: "Falar comigo" }).click();
    const dialog = page.getByRole("dialog", { name: "Falar com o Andre" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Vaga" }).click();
    await expect(dialog.getByRole("button", { name: "Vaga" })).toHaveAttribute("aria-pressed", "true");
    const href = await dialog.getByRole("link", { name: /Enviar no WhatsApp/ }).getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(decodeURIComponent(href!.split("text=")[1])).toContain("vaga");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("setas navegam entre as ações", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/about");
    await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("button", { name: "Falar comigo" }).click();
    const dialog = page.getByRole("dialog", { name: "Falar com o Andre" });
    await expect(dialog.getByRole("link", { name: /Enviar no WhatsApp/ })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(dialog.getByRole("link", { name: /Enviar e-mail/ })).toBeFocused();
  });

  test("copiar e-mail mostra confirmação", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/about");
    await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("button", { name: "Falar comigo" }).click();
    await page.getByRole("dialog", { name: "Falar com o Andre" }).getByRole("button", { name: /Copiar e-mail/ }).click();
    await expect(page.getByText("E-mail copiado")).toBeVisible();
  });

  test("no celular abre como bottom sheet pelo menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.locator("#mobile-navigation").getByRole("button", { name: "Falar comigo" }).click();
    await expect(page.locator(".contact-surface--sheet")).toBeVisible();
  });

  test("/#contato leva ao fechamento da home", async ({ page }) => {
    await page.goto("/#contato");
    await expect(page.locator("#contato")).toBeInViewport();
    await expect(page.locator("#contato").getByRole("link", { name: /Chamar no WhatsApp/ })).toBeVisible();
  });
});
