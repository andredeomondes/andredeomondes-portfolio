# Redesign 8-bit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar o redesign "clean tech + destaques 8-bit" aprovado em todo o site público de andredeomondes.dev.

**Architecture:** Retematizar no lugar: os tokens existentes em `globals.css` (`signal`, `ink`, `paper`…) mudam de valor e as fontes mudam de variável, assim as ~3200 linhas de CSS e os componentes atuais herdam o novo visual sem reescrita em massa. Os momentos de assinatura (IDE vivo, manifesto, revelação em pixels, finale "roda") viram componentes cliente novos e pequenos. GSAP + ScrollTrigger cuidam do que depende de scroll; loops com timer usam um hook compartilhado que pausa fora da tela, com a aba oculta e com movimento reduzido.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind 4, `next/font/google` (JetBrains Mono, Silkscreen), GSAP 3.15 + ScrollTrigger, `motion/react` 12, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-17-redesign-8bit-design.md`. Mockup de referência: `docs/superpowers/specs/2026-10-17-redesign-8bit-home-mockup.html`. Leia os dois antes de cada task.

Todos os comandos rodam a partir de `frontend/`.

## Global Constraints

- Cores: `--bg #070707`, `--panel #0e0e0e`, `--fg #f3f3ef`, `--mute #8b8b86`, `--line rgba(255,255,255,.08)`, `--js #f7df1e`. Verde `#22c55e` só para status OK/disponível. O laranja `#d95824` sai por completo.
- Amarelo só em destaques em pixel, cursor, status ativo, nav ativa, foco, barras de progresso e brilho do IDE, ocupando ≤ 5–10% de cada tela. Nunca superfície grande nem texto corrido.
- Fontes: JetBrains Mono (300–800) para tudo, títulos em 800 com tracking `-0.045em`. Silkscreen só em 1–2 palavras por título, rótulos e marquee, nunca em frase inteira nem abaixo de 11px. Saem Space Grotesk, Geist Sans e Geist Mono.
- Raio 14px em painéis/cards e 10px em botões. Bordas de 1px `--line`. Vidro (blur 14px) só na navbar e em overlays.
- O retrato aparece normal (colorido, sem filtro), com hover só `scale(1.03)`. Screenshots de projeto ficam P&B com pixels cobrindo e ganham cor no hover.
- Animar só `transform`, `opacity`, `clip-path` e `mask`. Com `prefers-reduced-motion: reduce`, todo loop para e todo conteúdo aparece no estado final. Loops pausam fora da viewport e com a aba oculta. O texto principal fica visível em até ~1s.
- Conteúdo legível sem JavaScript.
- Site todo escuro. Nenhuma seção "paper" clara.
- Nada de métricas, resultados ou responsabilidades inventadas. O código, os requests e as latências do IDE são genéricos e não citam empresa, tabela ou endpoint real.
- `tsc --noEmit`, `eslint` e `next build` limpos ao fim de cada task. Nunca reintroduzir `ignoreBuildErrors`.
- Orçamento: LCP < 2,5s em 4G no mobile, CLS 0, JS transferido da home ≤ ~220 KB. GSAP só é importado por componentes das rotas que o usam.
- `/admin/*` só herda os tokens, sem redesign.

## Review Focus

1. **Movimento reduzido**: quem tem `prefers-reduced-motion` não pode ver nenhum loop rodando (IDE, roda, marquee, status) e precisa ver todo o conteúdo final. Testado nas Tasks 4, 5 e 6.
2. **Sem JavaScript**: títulos, manifesto e cards legíveis com JS desligado. Nada fica preso em `opacity:0` ou na cor apagada `#2a2a2a`. Testado nas Tasks 5 e 6.
3. **Loop fora da tela**: com o finale fora da viewport, o selo de status para de ciclar (custo de CPU/bateria). Testado na Task 4.
4. **Âncora `/#contato` vinda de outra página**: o formulário mudou para o footer e o link precisa cair nele. Testado na Task 4.
5. **Mobile 375px**: nenhuma rota pública tem scroll horizontal (IDE rotacionado, marquee e faixas "RODA" são os suspeitos). Testado na Task 10.

---

### Task 1: Tokens, fontes e harness de teste

**Files:**
- Modify: `src/app/layout.tsx` (fontes)
- Modify: `src/app/globals.css` (bloco `@theme inline` em ~37–90; regras `.bg-paper`/`.home-writing` em ~364–375; todas as ocorrências de `--font-geist-sans`, `--font-geist-mono`, `--font-space-grotesk`, `#d95824` e `rgba(217, 88, 36, …)`)
- Modify: `playwright.config.ts`
- Modify: `DESIGN.md`, `PRODUCT.md` (*Brand Commitments*)
- Create: `tests/e2e/theme.spec.ts`

**Interfaces:**
- Produces: variáveis CSS `--font-jetbrains` e `--font-pixel` (no `<body>`); utilitários Tailwind `font-sans`/`font-mono` → JetBrains Mono, `font-pixel` → Silkscreen; cores `signal` = `#f7df1e` (o nome é mantido de propósito para herdar todos os usos) e alias `js` = `#f7df1e`; `ink` = `#070707`, `panel` = `#0e0e0e`, `paper` = `#f3f3ef`, `dim` = `#8b8b86`, `line` = `rgba(255,255,255,.08)`. Playwright sobe o servidor sozinho.

- [ ] **Step 1: Configurar o Playwright para subir o servidor**

Em `playwright.config.ts`, adicionar `webServer: { command: "pnpm dev --port 3000", url: "http://127.0.0.1:3000", reuseExistingServer: true, timeout: 120_000 }`.

- [ ] **Step 2: Escrever o teste que falha**

```ts
// tests/e2e/theme.spec.ts
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
  const signal = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-signal").trim().toLowerCase());
  expect(signal).toBe("#f7df1e");
  const css = await page.evaluate(() => [...document.styleSheets].flatMap((s) => { try { return [...s.cssRules].map((r) => r.cssText); } catch { return []; } }).join("\n"));
  expect(css).not.toMatch(/d95824|217,\s*88,\s*36/i);
});

test("não há seção clara na home", async ({ page }) => {
  await page.goto("/");
  const lightSections = await page.$$eval("section", (els) => els.filter((el) => { const [r, g, b] = getComputedStyle(el).backgroundColor.match(/\d+/g)!.map(Number); return r + g + b > 600; }).length);
  expect(lightSections).toBe(0);
});
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `pnpm exec playwright test tests/e2e/theme.spec.ts`
Expected: os 3 FAIL (Geist no corpo, `#d95824`, `home-writing` clara).

- [ ] **Step 4: Trocar as fontes em `layout.tsx`**

Importar `JetBrains_Mono` (pesos 300, 400, 500, 700, 800, variável `--font-jetbrains`) e `Silkscreen` (peso 400, variável `--font-pixel`) de `next/font/google`. Remover Geist, Geist_Mono e Space_Grotesk. Trocar `themeColor` para `#070707`.

- [ ] **Step 5: Retematizar `globals.css`**

No `@theme inline`: `--font-sans` e `--font-mono` → `var(--font-jetbrains)`; adicionar `--font-pixel: var(--font-pixel)`; aplicar os valores de cor do bloco Interfaces e adicionar `--color-js: #f7df1e`. Substituir em todo o arquivo `var(--font-geist-sans)`, `var(--font-geist-mono)` e `var(--font-space-grotesk)` por `var(--font-jetbrains)`. Trocar `#d95824` por `#f7df1e` e `rgba(217, 88, 36, X)` por `rgba(247, 223, 30, X)`. As regras `.bg-paper`/`.home-writing` passam a fundo `--color-ink` e texto `--color-paper`. Títulos (`h1, h2` e as classes que usavam Space Grotesk) ganham `font-weight: 800; letter-spacing: -0.045em`.

- [ ] **Step 6: Rodar e ver passar**

Run: `pnpm exec playwright test tests/e2e/theme.spec.ts`
Expected: 3 passed.

- [ ] **Step 7: Atualizar a documentação**

Reescrever `DESIGN.md` a partir da seção 5 do spec, mais um resumo da seção 6. Em `PRODUCT.md`, trocar "Identidade visual integralmente monocromática em preto, branco e cinzas neutros" por "Identidade monocromática com acento único amarelo JavaScript (#f7df1e)" e remover a linha sobre glassmorphism em superfícies elevadas, que passa a ser só navbar e overlays.

- [ ] **Step 8: Verificar e commitar**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`
Expected: sem erros.

```bash
git add -A src/app/layout.tsx src/app/globals.css playwright.config.ts DESIGN.md PRODUCT.md tests/e2e/theme.spec.ts
git commit -m "feat: retheme tokens and fonts for 8-bit redesign"
```

---

### Task 2: Transição de rota sem loader

**Files:**
- Delete: `src/app/template.tsx`, `src/shared/components/motion/route-loader.tsx`
- Modify: `src/app/globals.css` (remover regras `.route-loader*` e keyframes `route-loader-*`, ~1367–1440 e ~3158–3170; trocar `route-out`/`route-in` de `::view-transition-*`, ~8–33)
- Create: `tests/e2e/route-transition.spec.ts`

**Interfaces:**
- Produces: nada consumido por outras tasks.

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { expect, test } from "@playwright/test";

test("navegar não mostra loader em tela cheia e o título aparece em até 1s", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".route-loader")).toHaveCount(0);
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Projetos" }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator(".route-loader")).toHaveCount(0);
  await expect(page.locator("main h1").first()).toBeVisible({ timeout: 1000 });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm exec playwright test tests/e2e/route-transition.spec.ts`
Expected: FAIL (`.route-loader` count 1).

- [ ] **Step 3: Remover o loader e trocar a view transition**

Apagar os dois arquivos e as regras CSS. `::view-transition-old(root)`: 140ms de fade. `::view-transition-new(root)`: 260ms de revelação por `mask-image` em grid de blocos de 24px (keyframe animando `mask-size`/`mask-position` de um `repeating-conic-gradient`, ou `clip-path` em degraus, com `steps(6)`). Duração total ≤ 300ms. Em `prefers-reduced-motion`, `animation: none`. Os wipes que `site-motion.tsx` cria continuam e só herdam a cor nova.

- [ ] **Step 4: Rodar e ver passar**

Run: `pnpm exec playwright test tests/e2e/route-transition.spec.ts`
Expected: PASS.

- [ ] **Step 5: Verificar e commitar**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`

```bash
git add -A src/app src/shared/components/motion tests/e2e/route-transition.spec.ts
git commit -m "feat: replace fullscreen route loader with pixel view transition"
```

---

### Task 3: Navbar em pílula + logo pixel

**Files:**
- Create: `src/shared/components/brand/pixel-mark.tsx`
- Modify: `src/shared/components/layout/navbar.tsx`
- Modify: `src/app/globals.css` (classes `.site-navigation`, `.visuvate-nav`, `.site-wordmark`, `.nav-link`, `.navbar-*`, `.visuvate-mobile-menu`, `.mobile-menu__*`; regra global de `:focus-visible`)
- Modify: `tests/e2e/responsive-navigation.spec.ts`

**Interfaces:**
- Produces: `PixelMark({ className }: { className?: string }): JSX.Element`, um grid 3×3 de 18px com as células 2, 4 e 9 vazias e a célula 5 em `--color-js` (`aria-hidden`). Usado também pela Task 4.

- [ ] **Step 1: Atualizar o teste e2e (falha)**

No teste mobile, trocar `/Publicações/` por `/JS Core/`. No teste ≥1024px, trocar o link esperado para `"JS Core"` e adicionar:

```ts
test("links da navegação e foco amarelo", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  for (const name of ["Início", "Projetos", "JS Core", "Sobre"]) await expect(nav.getByRole("link", { name })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Início" })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByRole("link", { name: /Contato/ })).toHaveAttribute("href", "/#contato");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineColor);
  expect(outline).toBe("rgb(247, 223, 30)");
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm exec playwright test tests/e2e/responsive-navigation.spec.ts`
Expected: FAIL (sem link "JS Core"/"Início").

- [ ] **Step 3: Implementar**

`navLinks` = `[{ href: "/", label: "Início" }, { href: "/projects", label: "Projetos" }, { href: "/series/javascript-core", label: "JS Core" }, { href: "/about", label: "Sobre" }]`. O ativo de "/" é só igualdade exata; os demais usam a regra de prefixo atual. O wordmark vira `<PixelMark /> andredeomondes<span>.dev</span>` em minúsculas. As ações viram um único link `/#contato` com o ponto verde e o texto "Disponível · Contato", onde "Disponível · " fica oculto abaixo de 1024px. CSS: pílula fixa a 18px do topo, `width: min(1080px, calc(100% - 32px))`, raio 14px, borda `--line`, fundo `rgba(10,10,10,.6)` com `backdrop-filter: blur(14px)`. O nav ativo leva o marcador `▶` em amarelo. O overlay mobile mantém o comportamento atual (Escape, foco, `overflow: hidden`), com links em JetBrains Mono 800 grande e numeração em Silkscreen. Regra global: `:focus-visible { outline: 2px solid #f7df1e; outline-offset: 2px; }`.

- [ ] **Step 4: Rodar e ver passar**

Run: `pnpm exec playwright test tests/e2e/responsive-navigation.spec.ts`
Expected: todos PASS.

- [ ] **Step 5: Verificar e commitar**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`

```bash
git add -A src/shared/components/brand src/shared/components/layout/navbar.tsx src/app/globals.css tests/e2e/responsive-navigation.spec.ts
git commit -m "feat: pill navbar with pixel mark and JS Core link"
```

---

### Task 4: Footer com finale "roda" e formulário de contato

**Files:**
- Create: `src/shared/hooks/use-active-loop.ts`
- Create: `src/shared/components/layout/roda-finale.tsx`
- Modify: `src/shared/components/layout/site-footer.tsx`
- Modify: `src/features/home/components/editorial-home.tsx` (remover `Contact` e seu uso, ~259–350)
- Modify: `src/app/globals.css` (novas classes `.roda-*`; remover `.site-footer__cta`, `.site-footer__atmosphere`, `.site-footer__glass*` e `.home-contact*`)
- Create: `tests/e2e/roda-finale.spec.ts`

**Interfaces:**
- Consumes: `PixelMark` (Task 3), opcional no copyright.
- Produces:
  - `useActiveLoop(ref: RefObject<Element | null>, tick: () => void, intervalMs: number): boolean`. Chama `tick` a cada `intervalMs` só quando o elemento intersecta a viewport, `document.visibilityState === "visible"` e não há movimento reduzido (`useReducedMotion` de `motion/react`). Retorna `active`. As Tasks 5 e 6 reutilizam.
  - `RodaFinale(): JSX.Element`. Raiz `<section className="roda" aria-labelledby="roda-title">`, h2 `id="roda-title"` com o texto acessível exato "Vamos construir algo que roda.". A palavra animada fica em `<span data-testid="roda-word" aria-hidden>` e o h2 tem um `<span className="sr-only">roda</span>`. Status em `data-testid="roda-status"`.
  - O footer contém `id="contato"` envolvendo `ProjectIntakeForm` (props atuais, `profile` vindo de `normalizeSiteContent(await getCachedPublicSettings())`; se o footer precisar de dados do servidor, divida em um Server Component `SiteFooter` com o miolo de pathname/admin em cliente).

- [ ] **Step 1: Escrever os testes que falham**

```ts
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
  for (let i = 0; i < 8; i++) { seen.add((await status.innerText()).trim()); await page.waitForTimeout(450); }
  expect([...seen]).toEqual(expect.arrayContaining(["compilando…", "rodando testes…", "deploy em produção…", "● rodando"]));
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
  const a = await status.innerText();
  await page.waitForTimeout(2000);
  expect(await status.innerText()).toBe(a);
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });
  test("nada anima e o estado final aparece", async ({ page }) => {
    await page.goto("/");
    await page.locator("section.roda").scrollIntoViewIfNeeded();
    await page.waitForTimeout(4000);
    await expect(page.getByTestId("roda-word")).toHaveText("roda");
    await expect(page.getByTestId("roda-status")).toHaveText("● rodando");
    const running = await page.$$eval("section.roda *", (els) => els.filter((el) => getComputedStyle(el).animationName !== "none").length);
    expect(running).toBe(0);
  });
});

test("/#contato vindo de outra página cai no formulário", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("link", { name: /Contato/ }).first().click();
  await expect(page).toHaveURL(/\/#contato$/);
  await expect(page.locator("#contato form")).toBeInViewport();
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm exec playwright test tests/e2e/roda-finale.spec.ts`
Expected: FAIL (`section.roda` não existe).

- [ ] **Step 3: Implementar `useActiveLoop` em `src/shared/hooks/use-active-loop.ts`**

IntersectionObserver com `rootMargin: "10% 0px"` + listener de `visibilitychange`. O intervalo é criado e limpo conforme `active` muda.

- [ ] **Step 4: Implementar `RodaFinale` em `src/shared/components/layout/roda-finale.tsx`**

Valores fixos do spec e do mockup:
- Status `["compilando…", "rodando testes…", "deploy em produção…", "● rodando"]`, troca a cada 800ms via `useActiveLoop`. O último leva a classe `is-ok` (amarelo). Com movimento reduzido, fica fixo em `"● rodando"`.
- Onda: cada letra num `<span class="roda-ch">` com `animation-delay: k * 110ms` e keyframe `hop` de 1,4s (`0%,55%,100% translateY(0)`, `20% translateY(-.32em)`, `35% translateY(.04em) scaleY(.9)`).
- Scramble a cada 3200ms via `useActiveLoop`: 13 frames de 55ms. No frame `f`, a letra `k` mostra o caractere real se `f > 4 + 2k`, senão um glifo aleatório de `#$%&*+<>/\=?01█▓▒░`. Durante o scramble, a classe `is-glitch` desliga a onda e aplica `translate` aleatório de ±3px/±2px com `text-shadow: 4px 0 0 var(--fg), -4px 0 0 #444`.
- Barra: 12px, preenchimento em `repeating-linear-gradient(90deg, #f7df1e 0 8px, transparent 8px 10px)`, keyframe `width 0→100%` em 3,2s `steps(26)`, infinito.
- Fundo: 3 faixas de `"RODA ▶ "` repetido em Silkscreen 64px, opacidade 0.07, `rotate(-6deg) scale(1.2)`, deslizando em 18s com sentidos alternados. O container tem `overflow: hidden`.
- Ponto final: `.` em amarelo piscando a 0,8s `steps(1)`.
- CSS: animações só rodam com `[data-active]` na raiz (setado a partir do retorno de `useActiveLoop`) e somem sob `prefers-reduced-motion`.

- [ ] **Step 5: Reestruturar `site-footer.tsx`**

Ordem: `<RodaFinale />` → `<section id="contato">` com título curto ("Conte o que você quer construir", em JetBrains Mono 800) e `ProjectIntakeForm` → redes sociais e diretório atuais restilizados → copyright. Remover o bloco CTA/atmosphere antigo. Remover `Contact` da home.

- [ ] **Step 6: Rodar e ver passar**

Run: `pnpm exec playwright test tests/e2e/roda-finale.spec.ts`
Expected: 5 passed.

- [ ] **Step 7: Verificar e commitar**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`

```bash
git add -A src/shared src/features/home/components/editorial-home.tsx src/app/globals.css tests/e2e/roda-finale.spec.ts
git commit -m "feat: footer with looping roda finale and contact form"
```

---

### Task 5: Hero da home com IDE vivo

**Files:**
- Create: `src/lib/gsap.ts`
- Create: `src/features/home/components/home-hero.tsx`
- Create: `src/features/home/components/live-ide.tsx`
- Create: `src/features/home/content/ide-script.ts`
- Modify: `src/features/home/components/editorial-home.tsx` (trocar `Hero` por `HomeHero`; remover grid trail, `home-hero__field` e retrato do hero)
- Modify: `src/app/globals.css` (remover `.home-hero*` sem uso; adicionar `.hero-*`, `.ide-*`)
- Create: `tests/e2e/home-hero.spec.ts`

**Interfaces:**
- Consumes: `useActiveLoop` (Task 4).
- Produces:
  - `registerGsap(): { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger }` em `src/lib/gsap.ts`. Registra o plugin uma vez e só roda no cliente. As Tasks 6 e 8 reutilizam.
  - `ideScript: { file: string; tabs: string[]; tree: string[]; lines: Array<Array<{ text: string; tone: "k" | "s" | "c" | "f" | "n" | "plain" }>>; requests: Array<{ method: string; path: string; status: string }> }` em `ide-script.ts`, com o conteúdo exato do mockup (função `createOrder` genérica; requests `POST /orders 201 · 42ms`, `GET /cards?set=sv 200 · 18ms`, `POST /agent/run 200 · 610ms`, `GET /health 200 · 3ms`, `PATCH /stock/88 200 · 27ms`). A árvore usa `▾ app` no lugar de `▾ drop-aki`, porque o spec proíbe citar projeto real no IDE.
  - `HomeHero({ profile }: { profile: ProfileSettings }): JSX.Element` e `LiveIde(): JSX.Element` com `data-testid="live-ide"` e código em `data-testid="ide-code"`.
  - Classe `js` no `<html>`, adicionada por um script inline mínimo no `<head>` de `layout.tsx` (`document.documentElement.classList.add("js")`). Todo estado inicial escondido (entrada de palavras, manifesto apagado, blocos vazios das barras) é escrito como `html.js .x { … }`, para o SSR sem JS mostrar o estado final. As Tasks 6 e 7 dependem disso.

- [ ] **Step 1: Escrever os testes que falham**

```ts
import { expect, test } from "@playwright/test";

test("título do hero e IDE digitando", async ({ page }) => {
  await page.goto("/");
  const h1 = page.locator("h1");
  await expect(h1).toHaveText(/Sistemas\s+que\s+rodam\s+em\s+produção/);
  await expect(h1).toBeVisible({ timeout: 1000 });
  await expect(h1.locator(".font-pixel")).toHaveText(["rodam", "produção"]);
  await expect(page.getByTestId("ide-code")).toContainText("createOrder", { timeout: 6000 });
  await expect(page.getByTestId("live-ide")).not.toContainText(/drop|amr|caji/i);
});

test("IDE se endireita com o scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const ide = page.getByTestId("live-ide");
  const before = await ide.evaluate((el) => getComputedStyle(el).transform);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(500);
  const after = await ide.evaluate((el) => getComputedStyle(el).transform);
  expect(before).not.toBe(after);
  expect(after === "none" || /matrix\(1, 0, 0, 1/.test(after)).toBe(true);
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });
  test("código completo de imediato e IDE reto", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("ide-code")).toContainText("return order", { timeout: 500 });
    expect(await page.getByTestId("live-ide").evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("título e lead legíveis", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.locator("h1 span").first().evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    await expect(page.getByTestId("ide-code")).toContainText("createOrder");
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm exec playwright test tests/e2e/home-hero.spec.ts`
Expected: FAIL (h1 é "ANDRE DEOMONDES").

- [ ] **Step 3: Implementar `registerGsap` e `ide-script.ts`**

- [ ] **Step 4: Implementar `HomeHero`**

Server Component. Eyebrow `● BACKEND & APPLIED AI ENGINEER · {profile.location em maiúsculas}`. h1 "Sistemas que / **rodam** em **produção**", com "rodam" em `font-pixel` amarela e "produção" em `font-pixel`. Lead "Construo produtos reais, da API à interface, e documento o raciocínio de engenharia por trás de cada decisão." Botões "Ver projetos →" (`/projects`, primário) e "Série JS Core" (`/series/javascript-core`). Grid de 48px no fundo, mascarado em radial. A entrada das palavras (subida de máscara, 80ms entre palavras, 0,9s `cubic-bezier(.16,1,.3,1)`) só vale sob `html.js` (classe adicionada por script inline no `<head>` do layout), para o SSR sem JS mostrar o estado final.

- [ ] **Step 5: Implementar `LiveIde`**

Componente cliente. O SSR renderiza o código completo (sem JS e movimento reduzido mostram tudo). Com JS e movimento normal, no mount ele limpa o código e digita uma linha a cada 180–340ms (aleatório), cursor em bloco amarelo no fim. Requests entram a cada 1300ms (máx. 4 visíveis) e as 22 barras de latência mudam de altura a cada 900ms (a última em `--fg`), ambos via `useActiveLoop`. Tilt: `rotateX(18deg) scale(.94)` → `none` entre scroll 0 e 420px, com GSAP ScrollTrigger `scrub`. Sem tilt com movimento reduzido. Layout em 3 colunas `200px 1fr 280px`; abaixo de 860px, só a coluna de código.

- [ ] **Step 6: Rodar e ver passar**

Run: `pnpm exec playwright test tests/e2e/home-hero.spec.ts`
Expected: 4 passed.

- [ ] **Step 7: Verificar e commitar**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`

```bash
git add -A src/lib/gsap.ts src/features/home src/app/globals.css src/app/layout.tsx tests/e2e/home-hero.spec.ts
git commit -m "feat: home hero with live IDE centerpiece"
```

---

### Task 6: Home, faixa do meio (marquee, manifesto e projetos)

**Files:**
- Create: `src/features/home/components/manifesto.tsx`
- Create: `src/shared/components/editorial/pixel-reveal-card.tsx`
- Modify: `src/features/home/components/editorial-home.tsx` (`Marquee` restilizado; remover `Practice`; `Work` usa `PixelRevealCard` em bento)
- Modify: `src/app/globals.css`
- Create: `tests/e2e/home-sections.spec.ts`

**Interfaces:**
- Consumes: `registerGsap` (Task 5).
- Produces:
  - `Manifesto({ text, highlights }: { text: string; highlights: string[] }): JSX.Element`, raiz `data-testid="manifesto"`. Cada palavra num `<span>`; as presentes em `highlights` ganham `font-pixel` e, acesas, amarelo. Quando acesa, a palavra tem a classe `is-lit`.
  - `PixelRevealCard({ href, image, title, summary, index, priority }: { href: string; image: string; title: string; summary: string; index: number; priority?: boolean }): JSX.Element`. A Task 8 reutiliza em `/projects`.

- [ ] **Step 1: Escrever os testes que falham**

```ts
import { expect, test } from "@playwright/test";

test("manifesto acende com o scroll", async ({ page }) => {
  await page.goto("/");
  const m = page.getByTestId("manifesto");
  await expect(m.locator(".is-lit")).toHaveCount(0);
  await m.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 800);
  await expect.poll(() => m.locator(".is-lit").count()).toBeGreaterThan(5);
});

test("card de projeto ganha cor no hover", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const card = page.locator("[data-testid='pixel-card']").first();
  await card.scrollIntoViewIfNeeded();
  const img = card.locator("img");
  expect(await img.evaluate((el) => getComputedStyle(el).filter)).toContain("grayscale(1)");
  await card.hover();
  await expect.poll(() => img.evaluate((el) => getComputedStyle(el).filter)).toBe("none");
  await expect(page.locator("[data-testid='pixel-card']")).toHaveCount(3);
});

test("seção Atuação saiu", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#atuacao")).toHaveCount(0);
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("manifesto legível", async ({ page }) => {
    await page.goto("/");
    const color = await page.getByTestId("manifesto").locator("span").first().evaluate((el) => getComputedStyle(el).color);
    expect(color).not.toBe("rgb(42, 42, 42)");
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm exec playwright test tests/e2e/home-sections.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar `Manifesto`**

Texto fixo, usado na home: "Mostro o trabalho antes de explicar a competência. APIs, pagamentos, agentes de IA e deploy: cada projeto aqui está em produção, com o raciocínio documentado." Destaques: `["produção,", "documentado."]`. A palavra apagada só usa `#2a2a2a` sob `html.js`. GSAP ScrollTrigger com `start: "top 85%"` e `end: "bottom 45%"`, `scrub`; o progresso p acende as palavras com índice `< p * total`. Movimento reduzido acende tudo.

- [ ] **Step 4: Implementar `PixelRevealCard`**

`next/image` com `fill`, `sizes` adequado, `priority` repassado, `filter: grayscale(1) contrast(1.05)` → `none` + `scale(1.03)` no hover/focus-visible (0,5s e 0,8s). Sobreposição de 16×10 células `aria-hidden`, onde ~45% começam com opacidade 0.85 (escolha determinística por índice, ex. `(i * 37 + index * 11) % 100 < 45`, para não haver mismatch de hidratação). No hover, todas vão a 0 com `transition-delay` derivado do índice (0–350ms). Rodapé com título, resumo e número `0{index}` em Silkscreen amarelo. Raiz `<a href data-testid="pixel-card">`.

- [ ] **Step 5: Atualizar a home**

Ordem após o hero: `Marquee` (Silkscreen 14px, marcador `■`, sem ícones) → `Manifesto` → `Work` (título "Projetos em **produção**", bento `1.3fr 1fr` / linhas de 260px, primeiro card ocupando 2 linhas; empilha abaixo de 860px) usando `project.image_url`, `title` e `description` de `fallbackProjects`. Remover `Practice`.

- [ ] **Step 6: Rodar e ver passar**

Run: `pnpm exec playwright test tests/e2e/home-sections.spec.ts`
Expected: 4 passed.

- [ ] **Step 7: Verificar e commitar**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`

```bash
git add -A src/features/home src/shared/components/editorial/pixel-reveal-card.tsx src/app/globals.css tests/e2e/home-sections.spec.ts
git commit -m "feat: home marquee, manifesto and pixel reveal project bento"
```

---

### Task 7: Home, publicações JS Core e Sobre resumido (barras de atributo)

**Files:**
- Create: `src/shared/components/editorial/attribute-bars.tsx`
- Modify: `src/lib/site-content.ts` (`ProfileSettings.attributes`, default e normalização)
- Modify: `src/app/admin/about/page.tsx` (campos para editar os atributos)
- Modify: `src/features/home/components/editorial-home.tsx` (`Writing` restilizado; nova `AboutTeaser`)
- Modify: `src/app/globals.css`
- Create: `tests/e2e/home-about.spec.ts`

**Interfaces:**
- Produces:
  - `ProfileSettings.attributes: Array<{ label: string; value: number }>`. Default `[{ label: "Backend", value: 90 }, { label: "Applied AI", value: 75 }, { label: "Produto", value: 70 }, { label: "Cloud", value: 65 }]`. São placeholders pendentes de definição pelo Andre (spec, seção 9). A normalização aceita só `value` inteiro de 0 a 100 e `label` não vazio; um valor inválido cai no default.
  - `AttributeBars({ items }: { items: ProfileSettings["attributes"] }): JSX.Element`. Cada linha com `data-testid="attribute-bar"`: rótulo em maiúsculas, 20 blocos (acesos = `Math.round(value / 5)`) e valor em Silkscreen. Os blocos enchem em sequência (40ms) ao entrar na tela; sem JS ou com movimento reduzido, já aparecem cheios. A Task 9 reutiliza no `/about`.

- [ ] **Step 1: Escrever os testes que falham**

```ts
import { expect, test } from "@playwright/test";

test("sobre resumido com retrato normal e 4 barras", async ({ page }) => {
  await page.goto("/");
  const bars = page.getByTestId("attribute-bar");
  await bars.first().scrollIntoViewIfNeeded();
  await expect(bars).toHaveCount(4);
  await expect(bars.nth(0)).toContainText("BACKEND");
  await expect.poll(() => bars.nth(0).locator("i.on").count()).toBe(18);
  const portrait = page.getByRole("img", { name: "Retrato de Andre Deomondes" });
  expect(await portrait.evaluate((el) => getComputedStyle(el).filter)).toBe("none");
});

test("publicações JS Core continuam na home e escuras", async ({ page }) => {
  await page.goto("/");
  const writing = page.locator("section.home-writing");
  await expect(writing).toBeVisible();
  await expect(writing.getByRole("link").first()).toBeVisible();
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm exec playwright test tests/e2e/home-about.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar dados, `AttributeBars` e o campo no admin**

- [ ] **Step 4: Implementar `AboutTeaser` e restilizar `Writing`**

`AboutTeaser`: grid `1fr 1.1fr`, retrato `/brand/andre-editorial-v2.webp` em moldura 4:5 com raio 14px (sem filtro, hover `scale(1.03)`), título "O engenheiro por trás do **código**" (código em pixel e amarelo), `profile.shortBio`, `AttributeBars`, link "Mais sobre mim →" para `/about`. `Writing` mantém os dados atuais com os novos tokens (cards com raio 14px, borda `--line`, número da unidade em Silkscreen). Ordem final da home: hero → marquee → manifesto → projetos → publicações → sobre.

- [ ] **Step 5: Rodar e ver passar**

Run: `pnpm exec playwright test tests/e2e/home-about.spec.ts`
Expected: 2 passed.

- [ ] **Step 6: Verificar e commitar**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`

```bash
git add -A src/shared/components/editorial/attribute-bars.tsx src/lib/site-content.ts src/app/admin/about/page.tsx src/features/home src/app/globals.css tests/e2e/home-about.spec.ts
git commit -m "feat: home JS Core publications and about teaser with attribute bars"
```

---

### Task 8: Projetos (lista + estudo de caso), com mockup aprovado antes

**Files:**
- Create: `.superpowers/brainstorm/<sessão>/content/project-page.html` (mockup, fora do git)
- Modify: `src/app/projects/page.tsx`, `src/app/projects/[slug]/page.tsx`, `src/shared/components/editorial/project-image-lightbox.tsx`
- Modify: `src/app/globals.css`
- Create: `tests/e2e/projects.spec.ts`

**Interfaces:**
- Consumes: `PixelRevealCard` (Task 6), `registerGsap` (Task 5).

- [ ] **Step 1: Mockup da página de projeto e aprovação do Andre (bloqueante)**

Montar no companion visual um mockup de `/projects/drop-aki-tcg` com os dados reais de `fallbackProjects[0]`: hero (kicker + título + fatos em grid de 4), screenshots com lightbox, `architecture_lanes` como painel estilo IDE (lanes = colunas, nós = linhas de "arquivo"), contribuições com marcador `■` e escopo do produto. **Não seguir para o Step 2 sem a aprovação explícita do Andre.** Ajustes pedidos entram no mockup antes.

- [ ] **Step 2: Escrever o teste que falha**

```ts
import { expect, test } from "@playwright/test";

test("lista de projetos usa cards com revelação em pixels", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.locator("[data-testid='pixel-card']")).toHaveCount(3);
});

test("estudo de caso mostra fatos, arquitetura e lightbox", async ({ page }) => {
  await page.goto("/projects/drop-aki-tcg");
  await expect(page.locator("h1")).toHaveText("Drop Aki TCG");
  for (const label of ["Papel", "Modelo", "Duração", "Status"]) await expect(page.getByText(label, { exact: true })).toBeVisible();
  await expect(page.getByTestId("architecture-panel")).toContainText("PagBank + Melhor Envio");
  await page.getByRole("button", { name: /Página inicial da loja Drop Aki TCG/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});
```

(Ajuste os seletores do lightbox aos nomes acessíveis que o componente atual já expõe; o comportamento testado é abrir com clique e fechar com Escape.)

- [ ] **Step 3: Rodar e ver falhar**

Run: `pnpm exec playwright test tests/e2e/projects.spec.ts`
Expected: FAIL (sem `pixel-card`/`architecture-panel`).

- [ ] **Step 4: Implementar conforme o mockup aprovado**

`/projects`: título "Projetos em **produção**" e os 3 `PixelRevealCard` numerados 01–03. `/projects/[slug]`: layout do mockup aprovado, com o painel de arquitetura em `data-testid="architecture-panel"`. Nenhum dado novo: só `case_study`.

- [ ] **Step 5: Rodar e ver passar**

Run: `pnpm exec playwright test tests/e2e/projects.spec.ts`
Expected: 2 passed.

- [ ] **Step 6: Verificar e commitar**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`

```bash
git add -A src/app/projects src/shared/components/editorial/project-image-lightbox.tsx src/app/globals.css tests/e2e/projects.spec.ts
git commit -m "feat: redesign projects list and case study pages"
```

---

### Task 9: Série JS Core, publicações, Sobre e Currículo

**Files:**
- Modify: `src/app/series/javascript-core/page.tsx`, `src/app/posts/page.tsx`, `src/app/posts/[slug]/page.tsx`, `src/shared/components/editorial/publication-card.tsx`, `src/shared/components/editorial/carousel-viewer.tsx`, `src/shared/components/editorial/exercise-workbench.tsx`, `src/app/about/page.tsx`, `src/app/resume/page.tsx`
- Modify: `src/app/globals.css`
- Create: `tests/e2e/content-pages.spec.ts`

**Interfaces:**
- Consumes: `AttributeBars` (Task 7), `ProfileSettings.attributes` (Task 7).

- [ ] **Step 1: Escrever os testes que falham**

```ts
import { expect, test } from "@playwright/test";

test("série JS Core é uma lista numerada com estado", async ({ page }) => {
  await page.goto("/series/javascript-core");
  const items = page.getByTestId("unit-item");
  await expect(items.first()).toContainText("01");
  await expect(page.getByTestId("unit-status").first()).toHaveText(/Publicada|Em breve/);
});

test("sobre tem retrato normal e barras", async ({ page }) => {
  await page.goto("/about");
  expect(await page.getByRole("img", { name: /Andre Deomondes/ }).first().evaluate((el) => getComputedStyle(el).filter)).toBe("none");
  await expect(page.getByTestId("attribute-bar")).toHaveCount(4);
});

test("workbench de exercícios usa o tratamento de IDE", async ({ page }) => {
  await page.goto("/posts/01-javascript-tipos-coercao");
  await expect(page.getByTestId("exercise-workbench")).toHaveCSS("border-radius", "14px");
});
```

(Antes de implementar, confira em `src/content/posts.ts` o formato de `series` e use o campo de status existente. Se a série não tiver estado publicado/em breve, ele vem da existência do slug publicado em `publications`.)

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm exec playwright test tests/e2e/content-pages.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar**

- Série: lista de linhas `NN · título · estado` com o número em Silkscreen, o estado "Publicada" com ponto amarelo e "Em breve" em `--mute`. Linhas publicadas linkam para o post.
- Posts e cards: novos tokens; capa com raio 14px; tags em JetBrains Mono 11px.
- `exercise-workbench`: moldura de IDE (barra com 3 quadrados, aba com o nome do arquivo, raio 14px, borda `--line`), com `data-testid="exercise-workbench"`.
- `carousel-viewer`: só tokens.
- Sobre: retrato documental atual, sem filtro; bio; `AttributeBars`; experiência como linha do tempo vertical com marcador `■`.
- Currículo: só tokens.

- [ ] **Step 4: Rodar e ver passar**

Run: `pnpm exec playwright test tests/e2e/content-pages.spec.ts`
Expected: 3 passed.

- [ ] **Step 5: Verificar e commitar**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`

```bash
git add -A src/app src/shared/components/editorial src/app/globals.css tests/e2e/content-pages.spec.ts
git commit -m "feat: restyle series, posts, about and resume pages"
```

---

### Task 10: Limpeza, responsividade e orçamento

**Files:**
- Delete: componentes de `src/shared/components/ui/` sem import (verificar com `grep -rl "ui/<nome>" src` antes de apagar cada um; candidatos: `animated-grid-pattern`, `magic-card`, `radial-orbital-timeline`, `hero-background`, `interactive-grid-pattern`, `liquid-ether`, `border-beam`, `dock`, `icon-cloud`, `dia-text-reveal`)
- Modify: `src/app/globals.css` (remover classes órfãs de seções removidas: `.home-hero__*`, `.home-practice*`, `.home-contact*`, `.site-footer__cta*`, `.site-footer__glass*`, `.route-loader*`)
- Create: `tests/e2e/responsive.spec.ts`

- [ ] **Step 1: Escrever o teste que falha (ou já passa e protege)**

```ts
import { expect, test } from "@playwright/test";

const routes = ["/", "/projects", "/projects/drop-aki-tcg", "/posts", "/posts/01-javascript-tipos-coercao", "/series/javascript-core", "/about", "/resume"];

test.describe("mobile 375px", () => {
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  for (const route of routes) {
    test(`sem scroll horizontal em ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(400);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }
});

test("admin continua renderizando", async ({ page }) => {
  const res = await page.goto("/admin/login");
  expect(res?.status()).toBeLessThan(500);
  await expect(page.locator("form")).toBeVisible();
});
```

- [ ] **Step 2: Rodar**

Run: `pnpm exec playwright test tests/e2e/responsive.spec.ts`
Expected: todas as rotas PASS. Se alguma falhar, corrigir o overflow (normalmente `overflow-x: clip` no container da animação) e rodar de novo.

- [ ] **Step 3: Remover componentes e CSS órfãos**

- [ ] **Step 4: Rodar a suíte inteira e as verificações**

Run: `pnpm exec playwright test && pnpm exec tsc --noEmit && pnpm lint && pnpm build`
Expected: tudo verde.

- [ ] **Step 5: Medir o orçamento**

Com `pnpm build && pnpm start`, abrir `/` no Chrome DevTools com throttling "Fast 4G" e CPU 4×, perfil mobile. Conferir: LCP < 2,5s, CLS 0 e JS transferido ≤ ~220 KB (somar `.js` na aba Network, ou `performance.getEntriesByType("resource")`). Registrar os números no corpo do commit. Se estourar, o primeiro suspeito é GSAP sendo carregado fora dos componentes da home (use `import()` dinâmico dentro do efeito).

- [ ] **Step 6: Commitar**

```bash
git add -A src tests/e2e/responsive.spec.ts
git commit -m "chore: remove unused components and verify responsive budget"
```
