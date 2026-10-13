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
  let t = 0;
  for (let i = 0; i < items.length; i++) {
    let x = items[i];
    t = t + x.price * x.qty;
  }
  let r = t * 1.1;
  return Math.round(r * 100) / 100;
}

// test: node --test --test-name-pattern="formatUserNameMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function formatUserNameMessy(u) {
  return u.first
    ? u.last
      ? u.first.trim() + " " + u.last.trim()
      : u.first.trim()
    : u.last
      ? u.last.trim()
      : "";
}

// test: node --test --test-name-pattern="logAndCheckPositiveMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function logAndCheckPositiveMessy(n, log) {
  if (n > 0) {
    log.push(`checked ${n}: positive`);
    return true;
  } else {
    log.push(`checked ${n}: not positive`);
    return false;
  }
}

// test: node --test --test-name-pattern="sumArrayWeirdMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function sumArrayWeirdMessy(a) {
  let s = 0,
    i = 0;
  while (i < a.length) {
    s += a[i];
    i++;
  }
  return s;
}

// test: node --test --test-name-pattern="parseCsvLineMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function parseCsvLineMessy(line) {
  return line
    .split(",")
    .map(function (s) {
      return s.trim();
    })
    .filter(function (s) {
      return s.length > 0;
    });
}

// test: node --test --test-name-pattern="getDiscountLabelMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function getDiscountLabelMessy(amount) {
  if (amount >= 1000) {
    return "platinum";
  } else {
    if (amount >= 500) {
      return "gold";
    } else {
      if (amount >= 100) {
        return "silver";
      } else {
        return "none";
      }
    }
  }
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="processOrderMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function processOrderMessy(order) {
  if (!order.items || order.items.length === 0) {
    throw new Error("empty order");
  }
  let subtotal = 0;
  for (let i = 0; i < order.items.length; i++) {
    subtotal = subtotal + order.items[i].price * order.items[i].qty;
  }
  let discount = 0;
  if (order.couponPercent) {
    discount = (subtotal * order.couponPercent) / 100;
  }
  let total = subtotal - discount;
  // cálculo de imposto duplicado abaixo (mesma fórmula usada duas vezes)
  let taxCheck = total * 0.1;
  let tax = total * 0.1;
  if (taxCheck !== tax) {
    tax = taxCheck; // trecho morto, mas ilustra a duplicação
  }
  let grandTotal = total + tax;
  grandTotal = Math.round(grandTotal * 100) / 100;
  return `${order.customer.name}: subtotal R$${subtotal}, desconto R$${discount}, total R$${grandTotal}`;
}

// test: node --test --test-name-pattern="buildUserReportMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function buildUserReportMessy(users) {
  let active = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].active) {
      active.push(users[i]);
    }
  }
  for (let i = 0; i < active.length; i++) {
    for (let j = 0; j < active.length - 1 - i; j++) {
      if (active[j].name > active[j + 1].name) {
        let tmp = active[j];
        active[j] = active[j + 1];
        active[j + 1] = tmp;
      }
    }
  }
  let lines = ["Relatório de usuários ativos:"];
  for (let i = 0; i < active.length; i++) {
    lines.push(active[i].name + " (" + active[i].score + " pts)");
  }
  return lines.join("\n");
}

// test: node --test --test-name-pattern="updateInventoryMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function updateInventoryMessy(inventory, updates) {
  for (let i = 0; i < updates.length; i++) {
    const u = updates[i];
    if (inventory[u.sku] !== undefined) {
      let newQty = inventory[u.sku] + u.delta;
      if (newQty < 0) {
        inventory[u.sku] = 0;
      } else {
        inventory[u.sku] = newQty;
      }
    }
  }
  return inventory;
}

// test: node --test --test-name-pattern="computeStatsMessy" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function computeStatsMessy(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  let min = numbers[0];
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] < min) {
      min = numbers[i];
    }
  }
  let max = numbers[0];
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  let avg = sum / numbers.length;
  return { sum, min, max, avg };
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
  for (let i = 0; i < records.length; i++) {
    let group = records[i].items;
    let total = 0; // bug: essa variável "esconde" (shadow) o `total` externo
    for (let j = 0; j < group.length; j++) {
      total += group[j].amount;
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
  for (const item of cart.electronics) {
    // bug: este bloco foi copiado do de cima e esqueceram de trocar
    // `cart.electronics` por `cart.clothing`
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
  if (rawOrder.items) {
    if (rawOrder.items.length > 0) {
      let subtotal = 0;
      for (let i = 0; i < rawOrder.items.length; i++) {
        subtotal = subtotal + rawOrder.items[i].price * rawOrder.items[i].qty;
      }
      let discount = 0;
      if (rawOrder.couponCode) {
        if (rawOrder.couponCode === "PROMO10") {
          discount = subtotal * 0.1;
        }
      }
      let afterDiscount = subtotal - discount;
      let tax = afterDiscount * 0.08;
      let grandTotal = afterDiscount + tax;
      grandTotal = Math.round(grandTotal * 100) / 100;
      return { subtotal, discount, tax, grandTotal };
    } else {
      throw new Error("pedido vazio");
    }
  } else {
    throw new Error("pedido vazio");
  }
}

// test: node --test --test-name-pattern="refactorSideEffectHeavyLogger" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function refactorSideEffectHeavyLogger(events) {
  const counts = {};
  for (const event of events) {
    console.log(`processando evento: ${event.type}`);
    if (counts[event.type] === undefined) {
      counts[event.type] = 1;
    } else {
      counts[event.type] = counts[event.type] + 1;
    }
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
  let validCount = 0;
  for (let i = 0; i < transactions.length; i++) {
    let t = transactions[i];
    if (t.type === "credit") {
      if (typeof t.amount === "number" && t.amount > 0) {
        totalCredit = totalCredit + t.amount;
        validCount = validCount + 1;
      }
    }
  }
  let totalDebit = 0;
  for (let i = 0; i < transactions.length; i++) {
    let t = transactions[i];
    if (t.type === "debit") {
      if (typeof t.amount === "number" && t.amount > 0) {
        totalDebit = totalDebit + t.amount;
        validCount = validCount + 1;
      }
    }
  }
  let balance = totalCredit - totalDebit;
  return { totalCredit, totalDebit, balance, validCount };
}

// test: node --test --test-name-pattern="refactorMessyValidationPipeline" exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
export function refactorMessyValidationPipeline(input) {
  let errors = [];
  if (!input.name || input.name.trim() === "") {
    errors.push("nome é obrigatório");
  }
  if (!input.email || !input.email.includes("@")) {
    errors.push("email inválido");
  }
  if (typeof input.age !== "number" || input.age < 0) {
    errors.push("idade inválida");
  }
  return errors;
}
