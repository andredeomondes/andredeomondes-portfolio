import { test } from "node:test";
import assert from "node:assert/strict";

import {
  doubleAll,
  keepEven,
  findFirstAbove,
  hasNegative,
  allPositive,
  sumAll,
  pluck,
  countMatching,
  groupByKey,
  maxBy,
  sumNested,
  uniqueBy,
  fixFilterThresholdBug,
  fixReduceInitialValueBug,
  refactorImperativeTotal,
  summarizeSalesByCategory,
} from "./exercises.js";

// --- doubleAll --------------------------------------------------------

test("doubleAll: dobra cada número usando map", () => {
  assert.deepEqual(doubleAll([1, 2, 3]), [2, 4, 6]);
  assert.deepEqual(doubleAll([]), []);
});

// --- keepEven -----------------------------------------------------------

test("keepEven: mantém apenas números pares", () => {
  assert.deepEqual(keepEven([1, 2, 3, 4, 5, 6]), [2, 4, 6]);
});

// --- findFirstAbove ---------------------------------------------------------

test("findFirstAbove: primeiro número estritamente acima do limite", () => {
  assert.equal(findFirstAbove([1, 5, 10, 3, 20], 8), 10);
});

test("findFirstAbove: retorna undefined quando nenhum passa", () => {
  assert.equal(findFirstAbove([1, 2, 3], 100), undefined);
});

// --- hasNegative -----------------------------------------------------------

test("hasNegative: detecta se há ao menos um negativo", () => {
  assert.equal(hasNegative([1, 2, -3]), true);
  assert.equal(hasNegative([1, 2, 3]), false);
});

// --- allPositive -----------------------------------------------------------

test("allPositive: verdadeiro apenas se todos forem positivos", () => {
  assert.equal(allPositive([1, 2, 3]), true);
  assert.equal(allPositive([1, -2, 3]), false);
  assert.equal(allPositive([]), true);
});

// --- sumAll ------------------------------------------------------------------

test("sumAll: soma todos os números, inclusive lista vazia", () => {
  assert.equal(sumAll([1, 2, 3, 4]), 10);
  assert.equal(sumAll([]), 0);
});

// --- pluck --------------------------------------------------------------------

test("pluck: extrai um campo de uma lista de objetos", () => {
  const users = [{ name: "Ana" }, { name: "Bia" }, { name: "Caio" }];
  assert.deepEqual(pluck(users, "name"), ["Ana", "Bia", "Caio"]);
});

// --- countMatching --------------------------------------------------------------

test("countMatching: conta itens que satisfazem o predicado", () => {
  assert.equal(
    countMatching([1, 2, 3, 4, 5, 6], (n) => n % 2 === 0),
    3,
  );
  assert.equal(
    countMatching([], (n) => n > 0),
    0,
  );
});

// --- groupByKey -----------------------------------------------------------------

test("groupByKey: agrupa itens pelo valor de uma chave", () => {
  const animals = [
    { name: "cachorro", type: "mamífero" },
    { name: "gato", type: "mamífero" },
    { name: "jacaré", type: "réptil" },
  ];
  assert.deepEqual(groupByKey(animals, "type"), {
    mamífero: [
      { name: "cachorro", type: "mamífero" },
      { name: "gato", type: "mamífero" },
    ],
    réptil: [{ name: "jacaré", type: "réptil" }],
  });
});

// --- maxBy --------------------------------------------------------------------------

test("maxBy: retorna o item cujo valor calculado é o maior", () => {
  const products = [
    { name: "A", price: 10 },
    { name: "B", price: 50 },
    { name: "C", price: 30 },
  ];
  assert.deepEqual(
    maxBy(products, (p) => p.price),
    { name: "B", price: 50 },
  );
});

test("maxBy: retorna undefined para array vazio", () => {
  assert.equal(
    maxBy([], (x) => x),
    undefined,
  );
});

// --- sumNested -----------------------------------------------------------------------

test("sumNested: soma todos os números de um array de arrays", () => {
  assert.equal(sumNested([[1, 2], [3, 4, 5], []]), 15);
});

// --- uniqueBy -----------------------------------------------------------------------

test("uniqueBy: mantém a primeira ocorrência de cada chave", () => {
  const items = [
    { id: 1, name: "a" },
    { id: 2, name: "b" },
    { id: 1, name: "a-duplicado" },
  ];
  assert.deepEqual(uniqueBy(items, "id"), [
    { id: 1, name: "a" },
    { id: 2, name: "b" },
  ]);
});

// --- fixFilterThresholdBug ------------------------------------------------------------

test("fixFilterThresholdBug: mantém apenas estritamente acima do limite", () => {
  assert.deepEqual(fixFilterThresholdBug([1, 5, 10, 10, 15], 10), [15]);
});

// --- fixReduceInitialValueBug ---------------------------------------------------------

test("fixReduceInitialValueBug: soma preços, inclusive lista vazia", () => {
  assert.equal(fixReduceInitialValueBug([10, 20, 30]), 60);
  assert.equal(fixReduceInitialValueBug([]), 0);
});

// --- refactorImperativeTotal -----------------------------------------------------------

test("refactorImperativeTotal: mantém o comportamento original", () => {
  const orders = [
    { status: "paid", amount: 10, quantity: 2 },
    { status: "pending", amount: 100, quantity: 1 },
    { status: "paid", amount: 5, quantity: 3 },
  ];
  assert.equal(refactorImperativeTotal(orders), 35); // 10*2 + 5*3
});

// --- summarizeSalesByCategory -----------------------------------------------------------

test("summarizeSalesByCategory: totaliza por categoria e no geral", () => {
  const transactions = [
    { category: "livros", amount: 50 },
    { category: "eletrônicos", amount: 200 },
    { category: "livros", amount: 30 },
    { category: "eletrônicos", amount: 100 },
  ];
  assert.deepEqual(summarizeSalesByCategory(transactions), {
    byCategory: { livros: 80, eletrônicos: 300 },
    grandTotal: 380,
  });
});

test("summarizeSalesByCategory: lista vazia", () => {
  assert.deepEqual(summarizeSalesByCategory([]), {
    byCategory: {},
    grandTotal: 0,
  });
});
