import { test } from "node:test";
import assert from "node:assert/strict";

import {
  createRangeIterable,
  isIterable,
  collectToArray,
  countUpTo,
  take,
  fibonacciGenerator,
  sumFirstN,
  createLinkedListIterable,
  mapGenerator,
  filterGenerator,
  zipGenerators,
  createPaginatedCollection,
  brokenRange,
  brokenTakeEvery,
  messyPipeline,
  createTypedNumberGenerator,
} from "./exercises.js";

// --- createRangeIterable ---------------------------------------------------------

test("createRangeIterable: objeto iterável manual com Symbol.iterator", () => {
  assert.deepEqual([...createRangeIterable(1, 5)], [1, 2, 3, 4, 5]);
  assert.deepEqual([...createRangeIterable(3, 3)], [3]);
});

// --- isIterable --------------------------------------------------------------------

test("isIterable: identifica iteráveis nativos e não-iteráveis", () => {
  assert.equal(isIterable([1, 2, 3]), true);
  assert.equal(isIterable("abc"), true);
  assert.equal(isIterable(new Set([1])), true);
  assert.equal(isIterable(countUpTo(3)), true);
  assert.equal(isIterable({ a: 1 }), false);
  assert.equal(isIterable(null), false);
  assert.equal(isIterable(42), false);
});

// --- collectToArray ------------------------------------------------------------------

test("collectToArray: junta qualquer iterável num array usando for...of", () => {
  assert.deepEqual(collectToArray(new Set([1, 2, 3])), [1, 2, 3]);
  assert.deepEqual(collectToArray("abc"), ["a", "b", "c"]);
});

// --- countUpTo ---------------------------------------------------------------------

test("countUpTo: gera 1..n", () => {
  assert.deepEqual([...countUpTo(4)], [1, 2, 3, 4]);
  assert.deepEqual([...countUpTo(0)], []);
});

// --- take ------------------------------------------------------------------------------

test("take: pega os n primeiros itens de qualquer iterável, mesmo infinito", () => {
  assert.deepEqual([...take(countUpTo(10), 3)], [1, 2, 3]);
  assert.deepEqual([...take(fibonacciGenerator(), 5)], [0, 1, 1, 2, 3]);
});

// --- fibonacciGenerator -----------------------------------------------------------------

test("fibonacciGenerator: sequência infinita de Fibonacci", () => {
  const gen = fibonacciGenerator();
  const first6 = [];
  for (let i = 0; i < 6; i++) {
    first6.push(gen.next().value);
  }
  assert.deepEqual(first6, [0, 1, 1, 2, 3, 5]);
});

// --- sumFirstN -----------------------------------------------------------------------

test("sumFirstN: consome um gerador manualmente com next()", () => {
  assert.equal(sumFirstN(fibonacciGenerator, 5), 7); // 0+1+1+2+3
  assert.equal(
    sumFirstN(() => countUpTo(100), 3),
    6,
  ); // 1+2+3
});

// --- createLinkedListIterable ------------------------------------------------------------

test("createLinkedListIterable: lista encadeada percorrível com for...of", () => {
  const list = createLinkedListIterable();
  list.append(1).append(2).append(3);
  assert.deepEqual([...list], [1, 2, 3]);
});

// --- mapGenerator ----------------------------------------------------------------------

test("mapGenerator: aplica fn lazily a cada item", () => {
  assert.deepEqual([...mapGenerator([1, 2, 3], (x) => x * 2)], [2, 4, 6]);
});

// --- filterGenerator -------------------------------------------------------------------

test("filterGenerator: filtra itens lazily por predicado", () => {
  assert.deepEqual([...filterGenerator([1, 2, 3, 4, 5], (x) => x % 2 === 0)], [2, 4]);
});

// --- zipGenerators ---------------------------------------------------------------------

test("zipGenerators: combina dois iteráveis em pares até o menor acabar", () => {
  assert.deepEqual(
    [...zipGenerators([1, 2, 3], ["a", "b"])],
    [
      [1, "a"],
      [2, "b"],
    ],
  );
});

// --- createPaginatedCollection -----------------------------------------------------------

test("createPaginatedCollection: itera em páginas e calcula totalPages", () => {
  const collection = createPaginatedCollection([1, 2, 3, 4, 5], 2);
  assert.equal(collection.totalPages(), 3);
  assert.deepEqual([...collection], [[1, 2], [3, 4], [5]]);
});

// --- brokenRange (debugging) --------------------------------------------------------------

test("brokenRange: gera start..end inclusive, sem pular o primeiro valor", () => {
  assert.deepEqual([...brokenRange(1, 5)], [1, 2, 3, 4, 5]);
  assert.deepEqual([...brokenRange(10, 10)], [10]);
});

// --- brokenTakeEvery (debugging) -----------------------------------------------------------

test("brokenTakeEvery: pega itens de índice par (0, 2, 4, ...)", () => {
  assert.deepEqual([...brokenTakeEvery(["a", "b", "c", "d", "e"])], ["a", "c", "e"]);
});

// --- messyPipeline (refatoração) ------------------------------------------------------------

test("messyPipeline: dobra, filtra pares e pega os 3 primeiros", () => {
  assert.deepEqual([...messyPipeline([1, 2, 3, 4, 5, 6, 7, 8])], [2, 4, 6]);
});

// --- createTypedNumberGenerator (desafio integrador) ----------------------------------------

test("createTypedNumberGenerator: converte, ignora inválidos e para em STOP", () => {
  const gen = createTypedNumberGenerator([1, "2", "abc", 3, "STOP", 4]);
  assert.deepEqual([...gen()], [1, 2, 3]);
});

test("createTypedNumberGenerator: sem sentinela, percorre tudo", () => {
  const gen = createTypedNumberGenerator(["10", "x", 20, null]);
  assert.deepEqual([...gen()], [10, 20]);
});
