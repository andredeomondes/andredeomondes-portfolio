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
  test("launcher monta a mensagem pelo assunto e abre WhatsApp com ela", async ({ page }) => {
    await page.goto("/about");
    await page.locator(".launcher-trigger").click();
    const panel = page.locator("#contact-launcher");
    await expect(panel).toBeVisible();
    await panel.getByRole("button", { name: "Vaga" }).click();
    await expect(panel.getByRole("button", { name: "Vaga" })).toHaveAttribute("aria-pressed", "true");
    const href = await panel.getByRole("link", { name: /Enviar no WhatsApp/ }).getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(decodeURIComponent(href!.split("text=")[1])).toContain("vaga");
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(page.locator(".launcher-trigger")).toBeFocused();
  });

  test("copiar e-mail mostra confirmação", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/about");
    await page.locator(".launcher-trigger").click();
    await page.locator("#contact-launcher").getByRole("button", { name: "Copiar e-mail" }).click();
    await expect(page.getByText("E-mail copiado")).toBeVisible();
  });

  test("no celular abre como bottom sheet", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");
    await page.locator(".launcher-trigger").click();
    await expect(page.locator(".launcher-surface--sheet")).toBeVisible();
  });

  test("/#contato leva ao painel de contato do rodapé", async ({ page }) => {
    await page.goto("/#contato");
    await expect(page.locator("#contato")).toBeInViewport();
    await expect(page.locator("#contato").getByRole("link", { name: /Enviar no WhatsApp/ })).toBeVisible();
  });
});
