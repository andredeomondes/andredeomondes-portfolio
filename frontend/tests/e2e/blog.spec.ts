import { expect, test } from "@playwright/test";

test("publicações: busca instantânea e filtro por módulo", async ({ page }) => {
  await page.goto("/posts");
  const cards = page.locator(".post-card");
  const total = await cards.count();
  expect(total).toBeGreaterThan(5);
  await page.getByRole("searchbox", { name: "Buscar publicações" }).fill("closures");
  await expect(cards.first()).toHaveAttribute("href", "/posts/05-javascript-closures");
  await page.getByRole("searchbox", { name: "Buscar publicações" }).fill("");
  await page.getByRole("group", { name: "Filtrar por módulo" }).getByRole("button", { name: "Fundamentos" }).click();
  await expect(cards).toHaveCount(4);
  await page.getByRole("searchbox", { name: "Buscar publicações" }).fill("xyz-inexistente");
  await expect(page.getByText(/Nenhuma publicação com esses filtros/)).toBeVisible();
});

test("publicações: busca cobre o conteúdo inteiro, não só o título", async ({ page }) => {
  await page.goto("/posts");
  const cards = page.locator(".post-card");
  const total = await cards.count();
  const search = page.getByRole("searchbox", { name: "Buscar publicações" });
  await search.fill("javascript");
  await expect(cards).toHaveCount(total);
  // termo que só aparece no código/explicação, sem acento
  await search.fill("function*");
  await expect(cards.first()).toHaveAttribute("href", "/posts/15-javascript-iterables-generators");
  await search.fill("coercao");
  await expect(cards.first()).toHaveAttribute("href", "/posts/01-javascript-tipos-coercao");
});

test("publicações: filtro por tag fica na URL e leva à página da tag", async ({ page }) => {
  await page.goto("/posts");
  await page.getByRole("group", { name: "Filtrar por tag" }).getByRole("button", { name: /#Fundamentos/ }).click();
  await expect(page).toHaveURL(/tag=fundamentos/);
  const cards = page.locator(".post-card");
  await expect(cards).toHaveCount(4);
  for (const href of await cards.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")))) {
    expect(Number(href?.match(/posts\/(\d+)/)?.[1])).toBeLessThanOrEqual(4);
  }
  await page.reload();
  await expect(page.getByRole("button", { name: /#Fundamentos/ }).first()).toHaveAttribute("aria-pressed", "true");

  await page.goto("/posts/tag/closures");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("#Closures");
  await expect(page).toHaveTitle(/Closures em JavaScript/);
  await expect(page.locator(".post-card").first()).toHaveAttribute("href", "/posts/05-javascript-closures");
});

test("post: tags linkam para as páginas de tag", async ({ page }) => {
  await page.goto("/posts/05-javascript-closures");
  await expect(page.getByRole("list", { name: "Tags" }).getByRole("link", { name: "#Closures" })).toHaveAttribute("href", "/posts/tag/closures");
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
