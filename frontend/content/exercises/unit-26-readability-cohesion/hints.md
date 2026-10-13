# Dicas — Unidade 26

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para qualquer exercício: antes de mexer, rode os testes e leia a
  função em voz alta (ou escreva em português o que ela faz, passo a
  passo). Se você precisar de mais de uma frase por trecho, esse trecho é
  candidato a virar uma função própria.
- Para `calcTotalPriceMessy`/`sumArrayWeirdMessy`: o que `t`, `x`, `r`,
  `s`, `a` representam de fato? Dê nomes que respondam essa pergunta sem
  precisar olhar o resto do código.
- Para `formatUserNameMessy`: ternário aninhado (`a ? (b ? c : d) : e`)
  esconde quantos caminhos possíveis existem. Quantos `if` separados
  você precisaria para cobrir os mesmos caminhos?
- Para `getDiscountLabelMessy`/`refactorGodFunctionOrderPipeline`: guard
  clauses significam "saia cedo da função quando encontrar um caso
  simples", em vez de aninhar o resto da lógica dentro de um `else`.
- Para `logAndCheckPositiveMessy`/`refactorSideEffectHeavyLogger`: separe
  mentalmente "o que essa função calcula" de "o que essa função registra
  ou imprime". São duas responsabilidades diferentes.
- Para `updateInventoryMessy`: o que aconteceria se duas partes do
  programa chamassem essa função com o mesmo objeto de inventário ao
  mesmo tempo, uma delas ainda usando o valor "antigo"?

## Nível 2 — pista mais direta

- `calcTotalPriceMessy`: renomeie `t` → `total`, `x` → `item`, `r` →
  `totalWithTax`. Considere extrair `applyTax(amount)` como função
  pequena.
- `formatUserNameMessy`: vire
  ```js
  if (u.first && u.last) return `${u.first.trim()} ${u.last.trim()}`;
  if (u.first) return u.first.trim();
  if (u.last) return u.last.trim();
  return "";
  ```
- `logAndCheckPositiveMessy`: extraia `function isPositive(n) { return n > 0; }`
  e chame-a dentro da função exportada, que continua fazendo `log.push(...)`.
- `sumArrayWeirdMessy`: `for (const value of a) { total += value; }` com
  `let total = 0;` antes.
- `parseCsvLineMessy`: `line.split(",").map((field) => field.trim()).filter((field) => field.length > 0);`
- `getDiscountLabelMessy`: guard clauses de cima para baixo, da faixa
  mais alta para a mais baixa, cada uma com `return` imediato.
- `processOrderMessy`: extraia `calculateSubtotal(items)`,
  `calculateDiscount(subtotal, percent)` e remova `taxCheck` (é código
  morto — só existe para mostrar a duplicação).
- `buildUserReportMessy`: `users.filter((u) => u.active)`, depois
  `.sort((a, b) => a.name.localeCompare(b.name))`, depois `.map(...)`.
- `updateInventoryMessy`: comece com `const next = { ...inventory };` e
  aplique as mudanças em `next`, retornando `next` no final em vez de
  mutar `inventory`.
- `computeStatsMessy`: dá pra calcular soma, mínimo e máximo num único
  laço `for...of`, guardando os três acumuladores ao mesmo tempo.
- `fixShadowedVariableBug`: renomeie a variável interna (`groupTotal`, por
  exemplo) e adicione `total += groupTotal;` no final de cada iteração do
  laço externo.
- `fixCopyPasteBug`: troque `cart.electronics` por `cart.clothing` no
  segundo laço. Depois, se quiser eliminar a duplicação de vez, extraia
  `function subtotalOf(items) { ... }` e chame duas vezes.
- `refactorGodFunctionOrderPipeline`: comece com
  ```js
  if (!rawOrder.items || rawOrder.items.length === 0) {
    throw new Error("pedido vazio");
  }
  ```
  e siga com funções nomeadas para cada etapa do cálculo.
- `refactorSideEffectHeavyLogger`: mova os dois `console.log` para fora
  do laço principal (ou remova-os), deixando só a lógica de contagem
  dentro do laço.
- `refactorAndExtendReportModuleMessy`: extraia
  `function isValidAmount(t) { return typeof t.amount === "number" && t.amount > 0; }`
  e reutilize nos dois laços — ou percorra a lista uma única vez com um
  `switch`/`if` sobre `t.type`.
- `refactorMessyValidationPipeline`: monte uma lista de regras, por
  exemplo `[{ ok: !!input.name && input.name.trim() !== "", message: "nome é obrigatório" }, ...]`,
  e depois `rules.filter((r) => !r.ok).map((r) => r.message)`.

## Nível 3 — quase o código, mas ainda não a solução

- `processOrderMessy` (versão final aproximada):
  ```js
  function calculateSubtotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }
  function calculateDiscount(subtotal, percent) {
    return percent ? (subtotal * percent) / 100 : 0;
  }
  export function processOrderMessy(order) {
    if (!order.items || order.items.length === 0) throw new Error("empty order");
    const subtotal = calculateSubtotal(order.items);
    const discount = calculateDiscount(subtotal, order.couponPercent);
    const total = subtotal - discount;
    const grandTotal = Math.round((total + total * 0.1) * 100) / 100;
    return `${order.customer.name}: subtotal R$${subtotal}, desconto R$${discount}, total R$${grandTotal}`;
  }
  ```
- `updateInventoryMessy` (versão final aproximada):
  ```js
  export function updateInventoryMessy(inventory, updates) {
    const next = { ...inventory };
    for (const { sku, delta } of updates) {
      if (next[sku] === undefined) continue;
      next[sku] = Math.max(0, next[sku] + delta);
    }
    return next;
  }
  ```
- `refactorMessyValidationPipeline` (versão final aproximada):
  ```js
  export function refactorMessyValidationPipeline(input) {
    const rules = [
      { valid: !!input.name && input.name.trim() !== "", message: "nome é obrigatório" },
      { valid: !!input.email && input.email.includes("@"), message: "email inválido" },
      { valid: typeof input.age === "number" && input.age >= 0, message: "idade inválida" },
    ];
    return rules.filter((rule) => !rule.valid).map((rule) => rule.message);
  }
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
