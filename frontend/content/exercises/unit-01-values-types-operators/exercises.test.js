import { test } from "node:test";
import assert from "node:assert/strict";

import {
  classifyValue,
  isTruthyManually,
  compareLooseAndStrict,
  coerceToNumberManually,
  sumOnlyNumbers,
  concatenateAsStrings,
  clampNumber,
  isSameValueZero,
  parsePercentageString,
  normalizeBooleanish,
  safeDivide,
  deepTypeOf,
  fixEqualityBug,
  fixCoercionBug,
  refactorDiscountTier,
  normalizeOrderInput,
} from "./exercises.js";

// --- classifyValue ---------------------------------------------------------

test("classifyValue: casos básicos", () => {
  assert.equal(classifyValue(null), "null");
  assert.equal(classifyValue(undefined), "undefined");
  assert.equal(classifyValue(NaN), "nan");
  assert.equal(classifyValue(42), "number");
  assert.equal(classifyValue("hi"), "string");
  assert.equal(classifyValue(true), "boolean");
  assert.equal(classifyValue([1, 2]), "array");
  assert.equal(
    classifyValue(() => {}),
    "function",
  );
  assert.equal(classifyValue(Symbol("x")), "symbol");
  assert.equal(classifyValue(10n), "bigint");
  assert.equal(classifyValue({}), "object");
});

// --- isTruthyManually --------------------------------------------------------

test("isTruthyManually: valores falsy", () => {
  for (const v of [false, 0, -0, "", null, undefined, NaN]) {
    assert.equal(isTruthyManually(v), false, `esperava false para ${String(v)}`);
  }
});

test("isTruthyManually: valores truthy", () => {
  for (const v of [true, 1, -1, "0", "false", [], {}, () => {}]) {
    assert.equal(isTruthyManually(v), true, `esperava true para ${String(v)}`);
  }
});

// --- compareLooseAndStrict ---------------------------------------------------

test("compareLooseAndStrict: number vs string equivalente", () => {
  assert.deepEqual(compareLooseAndStrict(1, "1"), { loose: true, strict: false });
});

test("compareLooseAndStrict: null vs undefined", () => {
  assert.deepEqual(compareLooseAndStrict(null, undefined), {
    loose: true,
    strict: false,
  });
});

test("compareLooseAndStrict: valores iguais", () => {
  assert.deepEqual(compareLooseAndStrict(5, 5), { loose: true, strict: true });
});

// --- coerceToNumberManually ---------------------------------------------------

test("coerceToNumberManually: casos numéricos", () => {
  assert.equal(coerceToNumberManually("42"), 42);
  assert.equal(coerceToNumberManually(""), 0);
  assert.equal(coerceToNumberManually(true), 1);
  assert.equal(coerceToNumberManually(false), 0);
  assert.equal(coerceToNumberManually(null), 0);
  assert.equal(Number.isNaN(coerceToNumberManually(undefined)), true);
  assert.equal(coerceToNumberManually([]), 0);
  assert.equal(coerceToNumberManually([7]), 7);
  assert.equal(Number.isNaN(coerceToNumberManually([1, 2])), true);
});

// --- sumOnlyNumbers -----------------------------------------------------------

test("sumOnlyNumbers: ignora valores não numéricos", () => {
  assert.equal(sumOnlyNumbers(1, "2", 3, null, 4), 8);
  assert.equal(sumOnlyNumbers(), 0);
});

// --- concatenateAsStrings ------------------------------------------------------

test("concatenateAsStrings: converte cada valor para string", () => {
  assert.equal(
    concatenateAsStrings(1, "a", true, null, undefined),
    "1atruenullundefined",
  );
});

// --- clampNumber ----------------------------------------------------------------

test("clampNumber: dentro e fora do intervalo", () => {
  assert.equal(clampNumber(5, 0, 10), 5);
  assert.equal(clampNumber(-5, 0, 10), 0);
  assert.equal(clampNumber(50, 0, 10), 10);
});

test("clampNumber: rejeita não-números", () => {
  assert.throws(() => clampNumber("5", 0, 10), TypeError);
  assert.throws(() => clampNumber(5, "0", 10), TypeError);
});

// --- isSameValueZero --------------------------------------------------------------

test("isSameValueZero: NaN é igual a NaN", () => {
  assert.equal(isSameValueZero(NaN, NaN), true);
});

test("isSameValueZero: casos comuns", () => {
  assert.equal(isSameValueZero(1, 1), true);
  assert.equal(isSameValueZero(1, "1"), false);
  assert.equal(isSameValueZero(0, -0), true);
});

// --- parsePercentageString -----------------------------------------------------------

test("parsePercentageString: casos válidos e inválidos", () => {
  assert.equal(parsePercentageString("42%"), 0.42);
  assert.equal(parsePercentageString("0%"), 0);
  assert.equal(parsePercentageString("100%"), 1);
  assert.equal(parsePercentageString("abc"), null);
  assert.equal(parsePercentageString("%"), null);
  assert.equal(parsePercentageString(null), null);
  assert.equal(parsePercentageString("42"), null);
});

// --- normalizeBooleanish -----------------------------------------------------------

test("normalizeBooleanish: entradas aceitas", () => {
  assert.equal(normalizeBooleanish(true), true);
  assert.equal(normalizeBooleanish("true"), true);
  assert.equal(normalizeBooleanish("YES"), true);
  assert.equal(normalizeBooleanish("1"), true);
  assert.equal(normalizeBooleanish(false), false);
  assert.equal(normalizeBooleanish("false"), false);
  assert.equal(normalizeBooleanish("no"), false);
  assert.equal(normalizeBooleanish("0"), false);
});

test("normalizeBooleanish: entradas inválidas", () => {
  assert.equal(normalizeBooleanish("talvez"), null);
  assert.equal(normalizeBooleanish(2), null);
  assert.equal(normalizeBooleanish(undefined), null);
});

// --- safeDivide -----------------------------------------------------------------------

test("safeDivide: divisão normal", () => {
  assert.equal(safeDivide(10, 2), 5);
});

test("safeDivide: divisão por zero", () => {
  assert.throws(() => safeDivide(10, 0), RangeError);
});

test("safeDivide: tipos inválidos", () => {
  assert.throws(() => safeDivide("10", 2), TypeError);
});

// --- deepTypeOf -----------------------------------------------------------------------

test("deepTypeOf: distingue tipos de objeto", () => {
  assert.equal(deepTypeOf(null), "null");
  assert.equal(deepTypeOf([1]), "array");
  assert.equal(deepTypeOf(new Date()), "date");
  assert.equal(deepTypeOf(/a/), "regexp");
  assert.equal(deepTypeOf(new Map()), "map");
  assert.equal(deepTypeOf(new Set()), "set");
  assert.equal(deepTypeOf({}), "object");
});

// --- fixEqualityBug -----------------------------------------------------------------------

test("fixEqualityBug: não confunde id 0 com string vazia", () => {
  const users = [
    { id: 0, name: "Ghost" },
    { id: 5, name: "Real" },
  ];
  assert.equal(fixEqualityBug(users, ""), undefined);
  assert.equal(fixEqualityBug(users, 0)?.name, "Ghost");
});

test("fixEqualityBug: encontra usuário mesmo com tipos diferentes", () => {
  const users = [
    { id: 0, name: "Ghost" },
    { id: 5, name: "Real" },
  ];
  assert.equal(fixEqualityBug(users, "5")?.name, "Real");
  assert.equal(fixEqualityBug(users, 5)?.name, "Real");
});

// --- fixCoercionBug -----------------------------------------------------------------------

test("fixCoercionBug: soma preços mesmo vindo como string", () => {
  const cart = [{ price: "10" }, { price: 5 }, { price: "2.5" }];
  assert.equal(fixCoercionBug(cart), 17.5);
});

// --- refactorDiscountTier -----------------------------------------------------------------------

test("refactorDiscountTier: mantém o comportamento original", () => {
  assert.equal(refactorDiscountTier(50), 0);
  assert.equal(refactorDiscountTier(100), 0.05);
  assert.equal(refactorDiscountTier(499), 0.05);
  assert.equal(refactorDiscountTier(500), 0.1);
  assert.equal(refactorDiscountTier(999), 0.1);
  assert.equal(refactorDiscountTier(1000), 0.15);
});

// --- normalizeOrderInput -----------------------------------------------------------------------

test("normalizeOrderInput: normaliza entradas string válidas", () => {
  const result = normalizeOrderInput({ price: "9.90", quantity: "3" });
  assert.deepEqual(result, { price: 9.9, quantity: 3, total: 29.7 });
});

test("normalizeOrderInput: rejeita preço negativo", () => {
  assert.throws(() => normalizeOrderInput({ price: "-5", quantity: "1" }), TypeError);
});

test("normalizeOrderInput: rejeita valores não numéricos", () => {
  assert.throws(() => normalizeOrderInput({ price: "abc", quantity: "1" }), TypeError);
});
