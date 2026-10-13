// Unidade 15 — Iterables e generators
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="createRangeIterable" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function createRangeIterable(start, end) {
  return {
    [Symbol.iterator]() {
      let current = start;
      return {
        next() {
          if (current <= end) {
            return { value: current++, done: false };
          }
          return { value: undefined, done: true };
        },
      };
    },
  };
}

// test: node --test --test-name-pattern="isIterable" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function isIterable(value) {
  throw new Error("not implemented: isIterable");
}

// test: node --test --test-name-pattern="collectToArray" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function collectToArray(iterable) {
  throw new Error("not implemented: collectToArray");
}

// test: node --test --test-name-pattern="countUpTo" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function* countUpTo(n) {
  throw new Error("not implemented: countUpTo");
}

// test: node --test --test-name-pattern="take" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function* take(iterable, n) {
  throw new Error("not implemented: take");
}

// test: node --test --test-name-pattern="fibonacciGenerator" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function* fibonacciGenerator() {
  throw new Error("not implemented: fibonacciGenerator");
}

// test: node --test --test-name-pattern="sumFirstN" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function sumFirstN(generatorFn, n) {
  throw new Error("not implemented: sumFirstN");
}

// test: node --test --test-name-pattern="createLinkedListIterable" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function createLinkedListIterable() {
  throw new Error("not implemented: createLinkedListIterable");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="mapGenerator" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function* mapGenerator(iterable, fn) {
  throw new Error("not implemented: mapGenerator");
}

// test: node --test --test-name-pattern="filterGenerator" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function* filterGenerator(iterable, predicate) {
  throw new Error("not implemented: filterGenerator");
}

// test: node --test --test-name-pattern="zipGenerators" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function* zipGenerators(iterA, iterB) {
  throw new Error("not implemented: zipGenerators");
}

// test: node --test --test-name-pattern="createPaginatedCollection" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function createPaginatedCollection(items, pageSize) {
  throw new Error("not implemented: createPaginatedCollection");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções geradoras abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um
// bug real. Sua tarefa não é reescrever do zero: é diagnosticar e
// corrigir.

// test: node --test --test-name-pattern="brokenRange" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function* brokenRange(start, end) {
  // Sintoma relatado: o primeiro valor do intervalo (`start`) nunca
  // aparece na saída.
  let i = start;
  while (i < end) {
    i++;
    yield i;
  }
}

// test: node --test --test-name-pattern="brokenTakeEvery" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function* brokenTakeEvery(iterable) {
  // Sintoma relatado: deveria pegar os elementos de índice par
  // (0, 2, 4, ...) do iterável, mas está pegando os de índice ímpar.
  let index = 0;
  for (const item of iterable) {
    index++;
    if (index % 2 === 0) {
      yield item;
    }
  }
}

// --- Refatoração -------------------------------------------------------------
//
// Este generator já funciona corretamente. A tarefa é refatorar para
// reduzir o aninhamento e a repetição, mantendo o mesmo comportamento
// observável.

// test: node --test --test-name-pattern="messyPipeline" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function* messyPipeline(numbers) {
  const doubled = [];
  for (let i = 0; i < numbers.length; i++) {
    doubled.push(numbers[i] * 2);
  }
  const evens = [];
  for (let i = 0; i < doubled.length; i++) {
    if (doubled[i] % 2 === 0) {
      evens.push(doubled[i]);
    }
  }
  let count = 0;
  for (let i = 0; i < evens.length; i++) {
    if (count < 3) {
      yield evens[i];
      count++;
    }
  }
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="createTypedNumberGenerator" exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
export function createTypedNumberGenerator(values) {
  throw new Error("not implemented: createTypedNumberGenerator");
}
