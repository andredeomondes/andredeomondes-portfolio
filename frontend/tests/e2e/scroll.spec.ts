import { expect, test } from "@playwright/test";

test("roda do mouse sobre a lista de exercícios rola só a lista", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/posts/05-javascript-closures");
  // Lenis starts on idle; give it time so the test covers the smooth-scroll path.
  await page.waitForFunction(() => Boolean((window as Window & { __lenis?: unknown }).__lenis), null, { timeout: 15000 });
  const list = page.getByTestId("exercise-workbench").locator(".scroll-region").first();
  await list.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const box = await list.boundingBox();
  if (!box) throw new Error("lista de exercícios sem caixa");
  const pageBefore = await page.evaluate(() => window.scrollY);
  const listBefore = await list.evaluate((node) => node.scrollTop);
  expect(await list.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(900);

  expect(await list.evaluate((node) => node.scrollTop)).toBeGreaterThan(listBefore);
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - pageBefore)).toBeLessThan(4);
});
