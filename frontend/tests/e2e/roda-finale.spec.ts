import { expect, test } from "@playwright/test";

test("finale tem o título acessível e o status cicla", async ({ page }) => {
  await page.goto("/projects");
  const finale = page.locator("section.roda");
  await finale.scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Vamos construir algo que roda." })).toBeVisible();
  const status = page.getByTestId("roda-status");
  const first = await status.innerText();
  await expect(status).not.toHaveText(first, { timeout: 2000 });
  const seen = new Set<string>();
  for (let i = 0; i < 8; i++) {
    seen.add((await status.innerText()).trim());
    await page.waitForTimeout(450);
  }
  expect([...seen]).toEqual(
    expect.arrayContaining(["compilando…", "rodando testes…", "deploy em produção…", "● rodando"]),
  );
});

test("palavra embaralha e volta a 'roda'", async ({ page }) => {
  await page.goto("/");
  await page.locator("section.roda").scrollIntoViewIfNeeded();
  const word = page.getByTestId("roda-word");
  await expect.poll(async () => (await word.innerText()) !== "roda", { timeout: 5000 }).toBe(true);
  await expect(word).toHaveText("roda", { timeout: 2000 });
});

test("loop para fora da tela", async ({ page }) => {
  await page.goto("/projects");
  await page.locator("section.roda").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const status = page.getByTestId("roda-status");
  const before = await status.innerText();
  await page.waitForTimeout(2000);
  expect(await status.innerText()).toBe(before);
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("nada anima e o estado final aparece", async ({ page }) => {
    await page.goto("/");
    await page.locator("section.roda").scrollIntoViewIfNeeded();
    await page.waitForTimeout(4000);
    await expect(page.getByTestId("roda-word")).toHaveText("roda");
    await expect(page.getByTestId("roda-status")).toHaveText("● rodando");
    const running = await page.$$eval(
      "section.roda *",
      (elements) => elements.filter((element) => getComputedStyle(element).animationName !== "none").length,
    );
    expect(running).toBe(0);
  });
});

test("/#contato vindo de outra página cai no formulário", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("link", { name: /Contato/ }).first().click();
  await expect(page).toHaveURL(/\/#contato$/);
  await expect(page.locator("#contato form")).toBeInViewport();
});
