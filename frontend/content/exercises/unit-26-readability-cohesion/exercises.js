// Unidade 26 — Legibilidade, coesão e funções pequenas
//
// Diferente das outras unidades, as funções abaixo JÁ FUNCIONAM
// corretamente — os testes em exercises.test.js já passam do jeito que
// está. Sua tarefa não é fazer o teste passar: é refatorar cada função
// para melhorar legibilidade, nomes e coesão, MANTENDO os testes verdes o
// tempo todo. Os testes são a rede de segurança que garante que você não
// mudou o comportamento observável.
//
// Veja README.md para o enunciado completo (o que exatamente melhorar em
// cada função) e hints.md para o roteiro de refatoração sugerido.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="calcTotalPriceMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function calcTotalPriceMessy(items) {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );
  const totalWithTax = subtotal * 1.1;
  return Math.round(totalWithTax * 100) / 100;
}

// test: node --test --test-name-pattern="formatUserNameMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function formatUserNameMessy(u) {
  return [u.first, u.last]
    .filter(Boolean)
    .map((name) => name.trim())
    .join(" ");
}

// test: node --test --test-name-pattern="logAndCheckPositiveMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function logAndCheckPositiveMessy(n, log) {
  const isPositive = n > 0;
  const label = isPositive ? "positive" : "not positive";
  log.push(`checked ${n}: ${label}`);
  return isPositive;
}

// test: node --test --test-name-pattern="sumArrayWeirdMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function sumArrayWeirdMessy(a) {
  return a.reduce((sum, value) => sum + value, 0);
}

// test: node --test --test-name-pattern="parseCsvLineMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function parseCsvLineMessy(line) {
  return line
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);
}

// test: node --test --test-name-pattern="getDiscountLabelMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function getDiscountLabelMessy(amount) {
  if (amount >= 1000) return "platinum";
  if (amount >= 500) return "gold";
  if (amount >= 100) return "silver";
  return "none";
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="processOrderMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function processOrderMessy(order) {
  if (!order.items?.length) throw new Error("empty order");

  const subtotal = order.items.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );
  const discount = order.couponPercent
    ? (subtotal * order.couponPercent) / 100
    : 0;
  const discountedTotal = subtotal - discount;
  const tax = discountedTotal * 0.1;
  const grandTotal = Math.round((discountedTotal + tax) * 100) / 100;

  return `${order.customer.name}: subtotal R$${subtotal}, desconto R$${discount}, total R$${grandTotal}`;
}

// test: node --test --test-name-pattern="buildUserReportMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function buildUserReportMessy(users) {
  const activeUsers = users
    .filter((user) => user.active)
    .sort((a, b) => a.name.localeCompare(b.name));
  const lines = ["Relatório de usuários ativos:"];

  for (const user of activeUsers) {
    lines.push(`${user.name} (${user.score} pts)`);
  }

  return lines.join("\n");
}

// test: node --test --test-name-pattern="updateInventoryMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function updateInventoryMessy(inventory, updates) {
  for (const update of updates) {
    if (inventory[update.sku] === undefined) continue;
    inventory[update.sku] = Math.max(0, inventory[update.sku] + update.delta);
  }

  return inventory;
}

// test: node --test --test-name-pattern="computeStatsMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function computeStatsMessy(numbers) {
  const { sum, min, max } = numbers.reduce(
    (stats, value) => ({
      sum: stats.sum + value,
      min: Math.min(stats.min, value),
      max: Math.max(stats.max, value),
    }),
    { sum: 0, min: numbers[0], max: numbers[0] },
  );

  return { sum, min, max, avg: sum / numbers.length };
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo têm um BUG REAL causado por um problema de
// legibilidade (nome de variável reaproveitado, bloco copiado e colado
// incorretamente). Diagnostique e corrija — os testes destas duas funções
// falham até você corrigir o bug.

// test: node --test --test-name-pattern="fixShadowedVariableBug" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function fixShadowedVariableBug(records) {
  // Sintoma relatado: a função deveria retornar a soma de todos os
  // `amount` de todos os itens de todos os registros, mas sempre retorna
  // 0, não importa a entrada.
  let total = 0;
  for (const record of records) {
    for (const item of record.items) {
      total += item.amount;
    }
  }

  return total;
}

// test: node --test --test-name-pattern="fixCopyPasteBug" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function fixCopyPasteBug(cart) {
  // Sintoma relatado: o subtotal de "clothing" no resumo do carrinho
  // sempre vem igual ao subtotal de "electronics", mesmo quando as duas
  // categorias têm produtos e preços completamente diferentes.
  let electronicsSubtotal = 0;
  for (const item of cart.electronics) {
    electronicsSubtotal += item.price * item.qty;
  }
  let clothingSubtotal = 0;
  for (const item of cart.clothing) {
    clothingSubtotal += item.price * item.qty;
  }
  return {
    electronicsSubtotal,
    clothingSubtotal,
    total: electronicsSubtotal + clothingSubtotal,
  };
}

// --- Refatoração -------------------------------------------------------------
//
// As duas funções abaixo já funcionam corretamente. A tarefa é refatorar
// para reduzir aninhamento, extrair funções coesas e separar efeitos
// colaterais da lógica pura, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorGodFunctionOrderPipeline" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function refactorGodFunctionOrderPipeline(rawOrder) {
  if (!rawOrder.items?.length) throw new Error("pedido vazio");

  const subtotal = rawOrder.items.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );
  const discount = rawOrder.couponCode === "PROMO10" ? subtotal * 0.1 : 0;
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * 0.08;
  const grandTotal = Math.round((afterDiscount + tax) * 100) / 100;

  return { subtotal, discount, tax, grandTotal };
}

// test: node --test --test-name-pattern="refactorSideEffectHeavyLogger" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function refactorSideEffectHeavyLogger(events) {
  const counts = {};
  for (const event of events) {
    console.log(`processando evento: ${event.type}`);
    counts[event.type] = (counts[event.type] ?? 0) + 1;
    console.log(`contagem atual de ${event.type}: ${counts[event.type]}`);
  }

  return counts;
}

// --- Desafio integrador -------------------------------------------------------
//
// As duas funções abaixo combinam vários problemas das seções anteriores
// (duplicação, aninhamento, nomes ruins) num único módulo maior. Já
// funcionam corretamente — refatore mantendo o comportamento.

// test: node --test --test-name-pattern="refactorAndExtendReportModuleMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function refactorAndExtendReportModuleMessy(transactions) {
  let totalCredit = 0;
  let totalDebit = 0;
  let validCount = 0;

  for (const transaction of transactions) {
    const isValidAmount =
      typeof transaction.amount === "number" && transaction.amount > 0;
    const isKnownType = ["credit", "debit"].includes(transaction.type);
    if (!isValidAmount || !isKnownType) continue;

    if (transaction.type === "credit") totalCredit += transaction.amount;
    else totalDebit += transaction.amount;
    validCount += 1;
  }

  const balance = totalCredit - totalDebit;
  return { totalCredit, totalDebit, balance, validCount };
}

// test: node --test --test-name-pattern="refactorMessyValidationPipeline" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function refactorMessyValidationPipeline(input) {
  const errors = [];
  if (!input.name?.trim()) errors.push("nome é obrigatório");
  if (!input.email?.includes("@")) errors.push("email inválido");
  if (typeof input.age !== "number" || input.age < 0) errors.push("idade inválida");
  return errors;
}
