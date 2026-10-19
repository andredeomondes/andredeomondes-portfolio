import { expect, test } from "@playwright/test";

test("série JS Core é uma lista numerada com estado", async ({ page }) => {
  await page.goto("/series/javascript-core");
  const items = page.getByTestId("unit-item");
  await expect(items.first()).toContainText("01");
  await expect(page.getByTestId("unit-status").first()).toHaveText(/Publicada|Em breve/);
});

test("sobre tem retrato normal e barras", async ({ page }) => {
  await page.goto("/about");
  const portrait = page.getByRole("img", { name: /Andre Deomondes/ }).first();
  expect(await portrait.evaluate((el) => getComputedStyle(el).filter)).toBe("none");
  await expect(page.getByTestId("attribute-bar")).toHaveCount(4);
});

test("workbench de exercícios usa o tratamento de IDE", async ({ page }) => {
  await page.goto("/posts/01-javascript-tipos-coercao");
  await expect(page.getByTestId("exercise-workbench")).toHaveCSS("border-radius", "14px");
});

for (const route of ["/about", "/resume", "/posts", "/posts/01-javascript-tipos-coercao", "/series/javascript-core"]) {
  test(`sem seção clara em ${route}`, async ({ page }) => {
    await page.goto(route);
    const light = await page.$$eval("section, header, div", (elements) =>
      elements.filter((element) => {
        const [r, g, b] = (getComputedStyle(element).backgroundColor.match(/\d+/g) ?? ["0", "0", "0"]).map(Number);
        const box = element.getBoundingClientRect();
        return r + g + b > 600 && box.width > 400 && box.height > 200;
      }).length,
    );
    expect(light).toBe(0);
  });
}
