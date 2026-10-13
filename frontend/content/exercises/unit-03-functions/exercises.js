// Unidade 3 — Funções
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="sum" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function sum(a = 0, b = 0) {
  return a + b;
}

// test: node --test --test-name-pattern="greet" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function greet(name = "visitante") {
  return `Olá, ${name}!`;
}

// test: node --test --test-name-pattern="multiplyAll" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export const multiplyAll = (...numbers) => {
  let product = 1;

  for (const number of numbers) {
    product *= number;
  }
  return product;
};

// test: node --test --test-name-pattern="isEven" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export const isEven = (n) => {
  if (n % 2 == 0) {
    return true;
  }
  return false;
};

// test: node --test --test-name-pattern="makeAdder" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function makeAdder(x) {
  return (n) => x + n;
}

// test: node --test --test-name-pattern="describePerson" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function describePerson({ name, age, city = "cidade não informada" } = {}) {
  return `${name}, ${age} anos, mora em ${city}`;
}

// test: node --test --test-name-pattern="applyDiscount" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function applyDiscount(price, discountPercent = 0) {
  if (discountPercent < 0) {
    throw new RangeError("Desconto não pode ser menor do que 0%");
  }

  if (discountPercent > 100) {
    throw new RangeError("Desconto não pode ser maior do que 100%");
  }

  return price * (1.0 - discountPercent / 100);
}

// test: node --test --test-name-pattern="firstArgumentType" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function firstArgumentType(...args) {
  if (!args[0]) {
    return "none";
  }

  return typeof args[0];
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="composeTwo" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function composeTwo(f, g) {
  function h(x) {
    return f(g(x));
  }
  return h;
}

// test: node --test --test-name-pattern="invokeNTimes" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function invokeNTimes(fn, n) {
  const results = [];
  for (let i = 0; i < n; i++) {
    results.push(fn(i));
  }

  return results;
}

// test: node --test --test-name-pattern="curriedAdd" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function curriedAdd(a) {
  return (b) => (c) => a + b + c;
}

// test: node --test --test-name-pattern="formatPrice" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function formatPrice(amount, currency = "BRL") {
  if (amount < 0) {
    throw new RangeError("O valor não pode ser negativo!");
  }

  const symbols = { BRL: "R$", USD: "$", EUR: "€" };

  return `${symbols[currency] ?? currency} ${amount.toFixed(2)}`;
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="averageOrZero" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function averageOrZero(numbers = []) {
  if (numbers.length === 0) {
    return 0;
  }

  let total = 0;
  for (const n of numbers) {
    total += n;
  }

  return total / numbers.length;
}

// test: node --test --test-name-pattern="makeMultiplier" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function makeMultiplier(factor) {
  const multiplier = (n) => n * factor;
  return multiplier;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// repetição e usar parâmetros default, mantendo o mesmo comportamento
// observável.

// test: node --test --test-name-pattern="refactorOrderTotal" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function refactorOrderTotal({ price = 0, quantity = 1, discount = 0 }) {
  let total = price * quantity * (1 - discount);
  if (total < 0) {
    total = 0;
  }
  return total;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="buildOrderProcessor" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function buildOrderProcessor(taxRate = 0) {
  return function processOrders(orders) {
    let total = 0;
    let processedCount = 0;

    for (const order of orders) {
      if (order.status !== "cancelled") {
        total += order.amount;
        processedCount++;
      }
    }

    let totalWithTax = total * (1 + taxRate);
    return { totalWithTax: totalWithTax, processedCount: processedCount };
  };
}
