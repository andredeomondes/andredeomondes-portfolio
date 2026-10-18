import { expect, test } from "@playwright/test";

test("usa JetBrains Mono no corpo e Silkscreen no utilitário pixel", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveCSS("font-family", /JetBrains Mono/);
  const pixelFont = await page.evaluate(() => {
    const el = document.createElement("span");
    el.className = "font-pixel";
    document.body.appendChild(el);
    return getComputedStyle(el).fontFamily;
  });
  expect(pixelFont).toMatch(/Silkscreen/);
});

test("acento é amarelo JS e não existe mais laranja", async ({ page }) => {
  await page.goto("/");
  const signal = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--color-signal").trim().toLowerCase(),
  );
  expect(signal).toBe("#f7df1e");
  const css = await page.evaluate(() =>
    [...document.styleSheets]
      .flatMap((sheet) => {
        try {
          return [...sheet.cssRules].map((rule) => rule.cssText);
        } catch {
          return [];
        }
      })
      .join("\n"),
  );
  expect(css).not.toMatch(/d95824|217,\s*88,\s*36/i);
});

test("não há seção clara na home", async ({ page }) => {
  await page.goto("/");
  const lightSections = await page.$$eval("section", (sections) =>
    sections.filter((section) => {
      const [r, g, b] = (getComputedStyle(section).backgroundColor.match(/\d+/g) ?? ["0", "0", "0"]).map(Number);
      return r + g + b > 600;
    }).length,
  );
  expect(lightSections).toBe(0);
});
