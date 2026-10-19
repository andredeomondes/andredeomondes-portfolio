import { expect, test } from "@playwright/test";

test("publicações: busca instantânea e filtro por módulo", async ({ page }) => {
  await page.goto("/posts");
  const cards = page.locator(".post-card");
  const total = await cards.count();
  expect(total).toBeGreaterThan(5);
  await page.getByRole("searchbox", { name: "Buscar publicações" }).fill("closures");
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toHaveAttribute("href", "/posts/05-javascript-closures");
  await page.getByRole("searchbox", { name: "Buscar publicações" }).fill("");
  await page.getByRole("button", { name: "Fundamentos" }).click();
  await expect(cards).toHaveCount(4);
  await page.getByRole("searchbox", { name: "Buscar publicações" }).fill("xyz-inexistente");
  await expect(page.getByText(/Nenhuma unidade sobre/)).toBeVisible();
});

test("série: módulos com unidades e progresso", async ({ page }) => {
  await page.goto("/series/javascript-core");
  await expect(page.getByRole("heading", { level: 2, name: "Fundamentos" })).toBeVisible();
  await expect(page.getByRole("progressbar", { name: "Progresso da série" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Começar pela unidade 01/ })).toHaveAttribute("href", "/posts/01-javascript-tipos-coercao");
});

test("post: índice lateral acompanha a leitura e paginação existe", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/posts/05-javascript-closures");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Closures");
  const toc = page.getByRole("navigation", { name: "Nesta página" });
  await toc.getByRole("link", { name: "Código" }).click();
  await expect(toc.getByRole("link", { name: "Código" })).toHaveAttribute("aria-current", "location");
  await expect(page.getByTestId("exercise-workbench")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Navegação entre publicações" }).getByRole("link")).toHaveCount(2);
});
