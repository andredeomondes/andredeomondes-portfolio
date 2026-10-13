// Unidade 9 — map, filter, find, some, every, reduce
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="doubleAll" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function doubleAll(numbers) {
  throw new Error("not implemented: doubleAll");
}

// test: node --test --test-name-pattern="keepEven" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function keepEven(numbers) {
  throw new Error("not implemented: keepEven");
}

// test: node --test --test-name-pattern="findFirstAbove" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function findFirstAbove(numbers, threshold) {
  throw new Error("not implemented: findFirstAbove");
}

// test: node --test --test-name-pattern="hasNegative" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function hasNegative(numbers) {
  throw new Error("not implemented: hasNegative");
}

// test: node --test --test-name-pattern="allPositive" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function allPositive(numbers) {
  throw new Error("not implemented: allPositive");
}

// test: node --test --test-name-pattern="sumAll" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function sumAll(numbers) {
  throw new Error("not implemented: sumAll");
}

// test: node --test --test-name-pattern="pluck" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function pluck(objects, key) {
  throw new Error("not implemented: pluck");
}

// test: node --test --test-name-pattern="countMatching" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function countMatching(items, predicate) {
  throw new Error("not implemented: countMatching");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="groupByKey" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function groupByKey(items, key) {
  throw new Error("not implemented: groupByKey");
}

// test: node --test --test-name-pattern="maxBy" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function maxBy(items, fn) {
  throw new Error("not implemented: maxBy");
}

// test: node --test --test-name-pattern="sumNested" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function sumNested(arrayOfArrays) {
  throw new Error("not implemented: sumNested");
}

// test: node --test --test-name-pattern="uniqueBy" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function uniqueBy(items, key) {
  throw new Error("not implemented: uniqueBy");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixFilterThresholdBug" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function fixFilterThresholdBug(numbers, threshold) {
  // Sintoma relatado: a função deveria manter apenas os números
  // estritamente maiores que `threshold`, mas números iguais a
  // `threshold` também estão passando pelo filtro.
  return numbers.filter((n) => n >= threshold);
}

// test: node --test --test-name-pattern="fixReduceInitialValueBug" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function fixReduceInitialValueBug(prices) {
  // Sintoma relatado: ao somar uma lista de preços vazia, a função
  // lança "Reduce of empty array with no initial value" em vez de
  // retornar 0.
  return prices.reduce((total, price) => total + price);
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar o laço
// imperativo para usar filter/map/reduce, mantendo o mesmo comportamento.

// test: node --test --test-name-pattern="refactorImperativeTotal" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function refactorImperativeTotal(orders) {
  let total = 0;
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].status === "paid") {
      total = total + orders[i].amount * orders[i].quantity;
    }
  }
  return total;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="summarizeSalesByCategory" exercises/01-javascript-core/unit-09-map-filter-reduce/exercises.test.js
export function summarizeSalesByCategory(transactions) {
  throw new Error("not implemented: summarizeSalesByCategory");
}
