import { expect, test } from "@playwright/test";

test("navegar não mostra loader em tela cheia e o título aparece em até 1s", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".route-loader")).toHaveCount(0);
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Projetos" }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator(".route-loader")).toHaveCount(0);
  await expect(page.locator("main h1").first()).toBeVisible({ timeout: 1000 });
});
