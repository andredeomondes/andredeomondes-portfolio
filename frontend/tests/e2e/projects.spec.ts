import { expect, test } from "@playwright/test";

test("lista de projetos usa cards com revelação em pixels", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByTestId("pixel-card")).toHaveCount(3);
});

test("estudo de caso mostra fatos, arquitetura e lightbox", async ({ page }) => {
  await page.goto("/projects/drop-aki-tcg");
  await expect(page.locator("h1")).toHaveText(/Drop Aki TCG/);
  const facts = page.getByTestId("project-facts");
  for (const label of ["PAPEL", "MODELO", "DURAÇÃO", "STATUS"]) await expect(facts).toContainText(label);
  await expect(page.getByTestId("architecture-panel")).toContainText("PagBank + Melhor Envio");
  await page.getByRole("button", { name: /Página inicial da loja Drop Aki TCG/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("estudo de caso termina com o próximo case", async ({ page }) => {
  await page.goto("/projects/drop-aki-tcg");
  await expect(page.getByRole("link", { name: /Próximo case.*AMR Mobile/ })).toHaveAttribute("href", "/projects/amr-mobile");
});

test("estudo de caso não tem seção clara", async ({ page }) => {
  await page.goto("/projects/drop-aki-tcg");
  const light = await page.$$eval("section", (sections) =>
    sections.filter((section) => {
      const [r, g, b] = (getComputedStyle(section).backgroundColor.match(/\d+/g) ?? ["0", "0", "0"]).map(Number);
      return r + g + b > 600;
    }).length,
  );
  expect(light).toBe(0);
});
