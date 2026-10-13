import { test } from "node:test";
import assert from "node:assert/strict";

import {
  sum,
  greet,
  multiplyAll,
  isEven,
  makeAdder,
  describePerson,
  applyDiscount,
  firstArgumentType,
  composeTwo,
  invokeNTimes,
  curriedAdd,
  formatPrice,
  averageOrZero,
  makeMultiplier,
  refactorOrderTotal,
  buildOrderProcessor,
} from "./exercises.js";

// --- sum -----------------------------------------------------------------

test("sum: soma dois números", () => {
  assert.equal(sum(2, 3), 5);
});

test("sum: usa 0 como default para o segundo argumento", () => {
  assert.equal(sum(4), 4);
});

// --- greet -----------------------------------------------------------------

test("greet: saudação com nome informado", () => {
  assert.equal(greet("Marina"), "Olá, Marina!");
});

test("greet: usa 'visitante' como default", () => {
  assert.equal(greet(), "Olá, visitante!");
});

// --- multiplyAll -------------------------------------------------------------

test("multiplyAll: multiplica todos os números recebidos", () => {
  assert.equal(multiplyAll(2, 3, 4), 24);
});

test("multiplyAll: retorna 1 sem argumentos", () => {
  assert.equal(multiplyAll(), 1);
});

// --- isEven ------------------------------------------------------------------

test("isEven: identifica números pares e ímpares", () => {
  assert.equal(isEven(4), true);
  assert.equal(isEven(7), false);
  assert.equal(isEven(0), true);
});

// --- makeAdder -----------------------------------------------------------------

test("makeAdder: retorna uma função que soma x", () => {
  const add5 = makeAdder(5);
  assert.equal(add5(3), 8);
  assert.equal(add5(-1), 4);
});

test("makeAdder: fábricas diferentes não interferem entre si", () => {
  const add2 = makeAdder(2);
  const add10 = makeAdder(10);
  assert.equal(add2(1), 3);
  assert.equal(add10(1), 11);
});

// --- describePerson --------------------------------------------------------------

test("describePerson: monta a descrição com todos os campos", () => {
  assert.equal(
    describePerson({ name: "Ana", age: 30, city: "Recife" }),
    "Ana, 30 anos, mora em Recife",
  );
});

test("describePerson: usa default quando city não é informada", () => {
  assert.equal(
    describePerson({ name: "Bruno", age: 22 }),
    "Bruno, 22 anos, mora em cidade não informada",
  );
});

// --- applyDiscount -----------------------------------------------------------------

test("applyDiscount: aplica porcentagem de desconto", () => {
  assert.equal(applyDiscount(100, 10), 90);
  assert.equal(applyDiscount(200), 200);
});

test("applyDiscount: rejeita porcentagem fora de 0-100", () => {
  assert.throws(() => applyDiscount(100, -5), RangeError);
  assert.throws(() => applyDiscount(100, 150), RangeError);
});

// --- firstArgumentType ---------------------------------------------------------------

test("firstArgumentType: retorna o typeof do primeiro argumento", () => {
  assert.equal(firstArgumentType("a", 1, 2), "string");
  assert.equal(firstArgumentType(42), "number");
  assert.equal(firstArgumentType(), "none");
});

// --- composeTwo ------------------------------------------------------------------------

test("composeTwo: compõe duas funções de um argumento", () => {
  const double = (n) => n * 2;
  const increment = (n) => n + 1;
  const doubleThenIncrement = composeTwo(increment, double);
  assert.equal(doubleThenIncrement(5), 11);
});

// --- invokeNTimes -------------------------------------------------------------------------

test("invokeNTimes: coleta os resultados de fn(i) para i de 0 a n-1", () => {
  assert.deepEqual(
    invokeNTimes((i) => i * i, 5),
    [0, 1, 4, 9, 16],
  );
});

test("invokeNTimes: retorna array vazio quando n é 0", () => {
  assert.deepEqual(
    invokeNTimes((i) => i, 0),
    [],
  );
});

// --- curriedAdd ---------------------------------------------------------------------------

test("curriedAdd: soma três números em cadeia", () => {
  assert.equal(curriedAdd(1)(2)(3), 6);
  assert.equal(curriedAdd(-2)(5)(0), 3);
});

// --- formatPrice ----------------------------------------------------------------------------

test("formatPrice: formata em BRL por default", () => {
  assert.equal(formatPrice(10.5), "R$ 10.50");
});

test("formatPrice: formata em outras moedas conhecidas", () => {
  assert.equal(formatPrice(10.5, "USD"), "$ 10.50");
  assert.equal(formatPrice(3, "EUR"), "€ 3.00");
});

test("formatPrice: usa o código da moeda quando desconhecida", () => {
  assert.equal(formatPrice(500, "JPY"), "JPY 500.00");
});

test("formatPrice: rejeita valores negativos", () => {
  assert.throws(() => formatPrice(-1), RangeError);
});

// --- averageOrZero ----------------------------------------------------------------------------

test("averageOrZero: calcula a média de uma lista", () => {
  assert.equal(averageOrZero([2, 4, 6]), 4);
});

test("averageOrZero: retorna 0 para lista vazia ou sem argumentos", () => {
  assert.equal(averageOrZero([]), 0);
  assert.equal(averageOrZero(), 0);
});

// --- makeMultiplier -----------------------------------------------------------------------------

test("makeMultiplier: retorna uma função que multiplica pelo fator", () => {
  const triple = makeMultiplier(3);
  assert.equal(triple(4), 12);
  assert.equal(triple(0), 0);
});

// --- refactorOrderTotal -------------------------------------------------------------------------

test("refactorOrderTotal: mantém o comportamento original", () => {
  assert.equal(refactorOrderTotal({ price: 10, quantity: 3, discount: 0.1 }), 27);
  assert.equal(refactorOrderTotal({ price: 10 }), 10);
  assert.equal(refactorOrderTotal({ price: 10, quantity: 2, discount: 2 }), 0);
});

// --- buildOrderProcessor --------------------------------------------------------------------------

test("buildOrderProcessor: aplica imposto e ignora cancelados", () => {
  const processOrders = buildOrderProcessor(0.1);
  const result = processOrders([
    { status: "paid", amount: 100 },
    { status: "cancelled", amount: 50 },
    { status: "pending", amount: 20 },
  ]);
  assert.deepEqual(result, { totalWithTax: 132, processedCount: 2 });
});

test("buildOrderProcessor: sem imposto quando taxRate é o default", () => {
  const processOrders = buildOrderProcessor();
  const result = processOrders([{ status: "paid", amount: 50 }]);
  assert.deepEqual(result, { totalWithTax: 50, processedCount: 1 });
});

test("buildOrderProcessor: lista vazia", () => {
  const processOrders = buildOrderProcessor(0.2);
  assert.deepEqual(processOrders([]), { totalWithTax: 0, processedCount: 0 });
});
