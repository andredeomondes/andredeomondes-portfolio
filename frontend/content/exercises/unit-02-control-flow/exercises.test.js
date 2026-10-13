import { test } from "node:test";
import assert from "node:assert/strict";

import {
  classifyTriangle,
  fizzBuzzRange,
  countVowels,
  findFirstNegative,
  sumUntilNegative,
  daysInMonth,
  gradeLabel,
  reverseStringLoop,
  flattenShallow,
  findDuplicateLoop,
  matrixDiagonalSum,
  safeGetNested,
  fixOffByOneLoop,
  fixSwitchFallthroughBug,
  refactorNestedConditionals,
  classifyAndSummarizeOrders,
} from "./exercises.js";

// --- classifyTriangle --------------------------------------------------------

test("classifyTriangle: equilátero, isósceles e escaleno", () => {
  assert.equal(classifyTriangle(5, 5, 5), "equilateral");
  assert.equal(classifyTriangle(5, 5, 8), "isosceles");
  assert.equal(classifyTriangle(3, 4, 5), "scalene");
});

test("classifyTriangle: entradas inválidas", () => {
  assert.equal(classifyTriangle(1, 1, 10), "invalid");
  assert.equal(classifyTriangle(0, 4, 5), "invalid");
  assert.equal(classifyTriangle(-3, 4, 5), "invalid");
});

// --- fizzBuzzRange ------------------------------------------------------------

test("fizzBuzzRange: intervalo pequeno com múltiplos de 3, 5 e 15", () => {
  assert.deepEqual(fizzBuzzRange(1, 15), [
    "1",
    "2",
    "Fizz",
    "4",
    "Buzz",
    "Fizz",
    "7",
    "8",
    "Fizz",
    "Buzz",
    "11",
    "Fizz",
    "13",
    "14",
    "FizzBuzz",
  ]);
});

// --- countVowels ----------------------------------------------------------------

test("countVowels: conta vogais ignorando maiúsculas/minúsculas", () => {
  assert.equal(countVowels("Eloquent JavaScript"), 7);
  assert.equal(countVowels("xyz"), 0);
  assert.equal(countVowels(""), 0);
});

// --- findFirstNegative -----------------------------------------------------------

test("findFirstNegative: retorna o primeiro negativo", () => {
  assert.equal(findFirstNegative([3, 7, -2, 9, -5]), -2);
});

test("findFirstNegative: retorna undefined quando não há negativo", () => {
  assert.equal(findFirstNegative([1, 2, 3]), undefined);
});

// --- sumUntilNegative --------------------------------------------------------------

test("sumUntilNegative: soma até encontrar o primeiro negativo", () => {
  assert.equal(sumUntilNegative([1, 2, 3, -1, 100]), 6);
});

test("sumUntilNegative: soma tudo quando não há negativo", () => {
  assert.equal(sumUntilNegative([1, 2, 3]), 6);
});

// --- daysInMonth --------------------------------------------------------------------

test("daysInMonth: meses comuns", () => {
  assert.equal(daysInMonth(1, 2026), 31);
  assert.equal(daysInMonth(4, 2026), 30);
});

test("daysInMonth: fevereiro em ano bissexto e não bissexto", () => {
  assert.equal(daysInMonth(2, 2024), 29);
  assert.equal(daysInMonth(2, 2023), 28);
  assert.equal(daysInMonth(2, 1900), 28);
  assert.equal(daysInMonth(2, 2000), 29);
});

// --- gradeLabel -----------------------------------------------------------------------

test("gradeLabel: faixas de nota", () => {
  assert.equal(gradeLabel(95), "A");
  assert.equal(gradeLabel(82), "B");
  assert.equal(gradeLabel(71), "C");
  assert.equal(gradeLabel(60), "D");
  assert.equal(gradeLabel(40), "F");
});

test("gradeLabel: rejeita valores fora de 0-100", () => {
  assert.throws(() => gradeLabel(-1), RangeError);
  assert.throws(() => gradeLabel(101), RangeError);
});

// --- reverseStringLoop --------------------------------------------------------------

test("reverseStringLoop: inverte string sem usar métodos prontos", () => {
  assert.equal(reverseStringLoop("forge"), "egrof");
  assert.equal(reverseStringLoop(""), "");
  assert.equal(reverseStringLoop("a"), "a");
});

// --- flattenShallow ------------------------------------------------------------------

test("flattenShallow: achata um nível de arrays aninhados", () => {
  assert.deepEqual(flattenShallow([[1, 2], [3], [], [4, 5, 6]]), [1, 2, 3, 4, 5, 6]);
});

// --- findDuplicateLoop ---------------------------------------------------------------

test("findDuplicateLoop: encontra o primeiro valor repetido", () => {
  assert.equal(findDuplicateLoop([1, 2, 3, 2, 4]), 2);
});

test("findDuplicateLoop: retorna null quando não há duplicado", () => {
  assert.equal(findDuplicateLoop([1, 2, 3]), null);
});

// --- matrixDiagonalSum ---------------------------------------------------------------

test("matrixDiagonalSum: soma a diagonal principal", () => {
  assert.equal(
    matrixDiagonalSum([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]),
    15,
  );
});

// --- safeGetNested --------------------------------------------------------------------

test("safeGetNested: acessa caminho existente", () => {
  const obj = { user: { address: { city: "São Paulo" } } };
  assert.equal(safeGetNested(obj, ["user", "address", "city"], null), "São Paulo");
});

test("safeGetNested: retorna default quando caminho não existe", () => {
  const obj = { user: {} };
  assert.equal(safeGetNested(obj, ["user", "address", "city"], "N/A"), "N/A");
  assert.equal(safeGetNested(null, ["user"], "N/A"), "N/A");
});

// --- fixOffByOneLoop ------------------------------------------------------------------

test("fixOffByOneLoop: soma os tamanhos sem estourar o índice", () => {
  assert.equal(fixOffByOneLoop(["a", "bb", "ccc"]), 6);
  assert.equal(fixOffByOneLoop([]), 0);
});

// --- fixSwitchFallthroughBug -----------------------------------------------------------

test("fixSwitchFallthroughBug: cada status retorna seu próprio rótulo", () => {
  assert.equal(fixSwitchFallthroughBug("pending"), "Pendente");
  assert.equal(fixSwitchFallthroughBug("paid"), "Pago");
  assert.equal(fixSwitchFallthroughBug("refunded"), "Reembolsado");
  assert.equal(fixSwitchFallthroughBug("cancelled"), "Cancelado");
  assert.equal(fixSwitchFallthroughBug("unknown-status"), "Desconhecido");
});

// --- refactorNestedConditionals --------------------------------------------------------

test("refactorNestedConditionals: mantém o comportamento original", () => {
  assert.equal(refactorNestedConditionals(null), "usuário inválido");
  assert.equal(refactorNestedConditionals({ active: false }), "conta inativa");
  assert.equal(refactorNestedConditionals({ active: true, age: 16 }), "menor de idade");
  assert.equal(
    refactorNestedConditionals({ active: true, age: 20, verified: false }),
    "precisa verificar conta",
  );
  assert.equal(
    refactorNestedConditionals({ active: true, age: 20, verified: true }),
    "elegível",
  );
});

// --- classifyAndSummarizeOrders ---------------------------------------------------------

test("classifyAndSummarizeOrders: conta status e soma receita de paid/refunded", () => {
  const orders = [
    { status: "pending", amount: 50 },
    { status: "paid", amount: 100 },
    { status: "paid", amount: 200 },
    { status: "cancelled", amount: 30 },
    { status: "refunded", amount: 40 },
  ];
  assert.deepEqual(classifyAndSummarizeOrders(orders), {
    pending: 1,
    paid: 2,
    cancelled: 1,
    refunded: 1,
    totalRevenue: 260,
  });
});

test("classifyAndSummarizeOrders: lista vazia", () => {
  assert.deepEqual(classifyAndSummarizeOrders([]), {
    pending: 0,
    paid: 0,
    cancelled: 0,
    refunded: 0,
    totalRevenue: 0,
  });
});
