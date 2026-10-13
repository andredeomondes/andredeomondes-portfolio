import { test } from "node:test";
import assert from "node:assert/strict";

import {
  freezeConfig,
  safeAssign,
  updateImmutable,
  addItemImmutable,
  removeItemImmutable,
  updateItemImmutable,
  sortImmutable,
  mergeObjectsImmutable,
  deepFreeze,
  updateNestedImmutable,
  toggleSetImmutable,
  withoutKeysImmutable,
  fixMutatingSort,
  fixFrozenIgnoredMutation,
  refactorMutatingCartOperations,
  applyImmutablePatch,
} from "./exercises.js";

// --- freezeConfig --------------------------------------------------------

test("freezeConfig: congela o objeto e impede atribuição direta", () => {
  const config = { retries: 3, timeoutMs: 1000 };
  const frozen = freezeConfig(config);
  assert.equal(Object.isFrozen(frozen), true);
  assert.throws(() => {
    frozen.retries = 99;
  }, TypeError);
  assert.equal(frozen.retries, 3);
});

// --- safeAssign ------------------------------------------------------------

test("safeAssign: retorna success:false ao tentar mutar objeto congelado", () => {
  const frozen = Object.freeze({ a: 1 });
  const result = safeAssign(frozen, "a", 99);
  assert.equal(result.success, false);
  assert.equal(typeof result.error, "string");
  assert.equal(frozen.a, 1);
});

test("safeAssign: retorna success:true ao atribuir em objeto não congelado", () => {
  const plain = { a: 1 };
  const result = safeAssign(plain, "a", 99);
  assert.equal(result.success, true);
  assert.equal(result.value, 99);
});

// --- updateImmutable ---------------------------------------------------------

test("updateImmutable: retorna novo objeto sem alterar o original", () => {
  const original = { name: "Ana", role: "dev" };
  const updated = updateImmutable(original, "role", "lead");
  assert.deepEqual(updated, { name: "Ana", role: "lead" });
  assert.deepEqual(original, { name: "Ana", role: "dev" });
  assert.notEqual(updated, original);
});

// --- addItemImmutable -------------------------------------------------------

test("addItemImmutable: adiciona item sem alterar o array original", () => {
  const original = [1, 2, 3];
  const result = addItemImmutable(original, 4);
  assert.deepEqual(result, [1, 2, 3, 4]);
  assert.deepEqual(original, [1, 2, 3]);
});

// --- removeItemImmutable ------------------------------------------------------

test("removeItemImmutable: remove item por índice sem alterar o original", () => {
  const original = ["a", "b", "c"];
  const result = removeItemImmutable(original, 1);
  assert.deepEqual(result, ["a", "c"]);
  assert.deepEqual(original, ["a", "b", "c"]);
});

// --- updateItemImmutable ------------------------------------------------------

test("updateItemImmutable: atualiza item por índice sem alterar o original", () => {
  const original = [{ qty: 1 }, { qty: 2 }, { qty: 3 }];
  const result = updateItemImmutable(original, 1, (item) => ({ qty: item.qty * 10 }));
  assert.deepEqual(result, [{ qty: 1 }, { qty: 20 }, { qty: 3 }]);
  assert.deepEqual(original, [{ qty: 1 }, { qty: 2 }, { qty: 3 }]);
});

// --- sortImmutable -------------------------------------------------------------

test("sortImmutable: retorna cópia ordenada sem alterar a ordem original", () => {
  const original = [3, 1, 2];
  const result = sortImmutable(original, (a, b) => a - b);
  assert.deepEqual(result, [1, 2, 3]);
  assert.deepEqual(original, [3, 1, 2]);
});

// --- mergeObjectsImmutable --------------------------------------------------------

test("mergeObjectsImmutable: mescla sem alterar nenhum dos objetos originais", () => {
  const base = { a: 1, b: 2 };
  const overrides = { b: 20, c: 3 };
  const result = mergeObjectsImmutable(base, overrides);
  assert.deepEqual(result, { a: 1, b: 20, c: 3 });
  assert.deepEqual(base, { a: 1, b: 2 });
  assert.deepEqual(overrides, { b: 20, c: 3 });
});

// --- deepFreeze ------------------------------------------------------------------

test("deepFreeze: congela objeto e estruturas aninhadas", () => {
  const obj = { a: 1, nested: { b: 2, list: [1, 2, { c: 3 }] } };
  const frozen = deepFreeze(obj);
  assert.equal(Object.isFrozen(frozen), true);
  assert.equal(Object.isFrozen(frozen.nested), true);
  assert.equal(Object.isFrozen(frozen.nested.list), true);
  assert.equal(Object.isFrozen(frozen.nested.list[2]), true);
  assert.throws(() => {
    frozen.nested.b = 99;
  }, TypeError);
});

// --- updateNestedImmutable ---------------------------------------------------------

test("updateNestedImmutable: atualiza caminho aninhado sem alterar o original", () => {
  const original = { user: { address: { city: "São Paulo" } }, other: { keep: true } };
  const updated = updateNestedImmutable(
    original,
    ["user", "address", "city"],
    "Curitiba",
  );
  assert.equal(updated.user.address.city, "Curitiba");
  assert.equal(original.user.address.city, "São Paulo");
  assert.deepEqual(updated.other, { keep: true });
});

// --- toggleSetImmutable ---------------------------------------------------------------

test("toggleSetImmutable: adiciona valor ausente sem alterar o Set original", () => {
  const original = new Set([1, 2]);
  const result = toggleSetImmutable(original, 3);
  assert.deepEqual([...result].sort(), [1, 2, 3]);
  assert.deepEqual([...original].sort(), [1, 2]);
});

test("toggleSetImmutable: remove valor presente sem alterar o Set original", () => {
  const original = new Set([1, 2, 3]);
  const result = toggleSetImmutable(original, 2);
  assert.deepEqual([...result].sort(), [1, 3]);
  assert.deepEqual([...original].sort(), [1, 2, 3]);
});

// --- withoutKeysImmutable --------------------------------------------------------------

test("withoutKeysImmutable: retorna objeto sem as chaves indicadas", () => {
  const original = { a: 1, b: 2, c: 3 };
  const result = withoutKeysImmutable(original, ["b"]);
  assert.deepEqual(result, { a: 1, c: 3 });
  assert.deepEqual(original, { a: 1, b: 2, c: 3 });
});

// --- fixMutatingSort ------------------------------------------------------------------

test("fixMutatingSort: retorna lista ordenada sem mutar o array original", () => {
  const products = [
    { name: "B", price: 20 },
    { name: "A", price: 10 },
    { name: "C", price: 30 },
  ];
  const originalOrder = products.map((p) => p.name);
  const sorted = fixMutatingSort(products);
  assert.deepEqual(
    sorted.map((p) => p.name),
    ["A", "B", "C"],
  );
  assert.deepEqual(
    products.map((p) => p.name),
    originalOrder,
  );
});

// --- fixFrozenIgnoredMutation -----------------------------------------------------------

test("fixFrozenIgnoredMutation: retorna novo estado atualizado sem mutar o congelado", () => {
  const state = Object.freeze({ theme: "light", locale: "pt-BR" });
  const result = fixFrozenIgnoredMutation(state, "theme", "dark");
  assert.equal(result.theme, "dark");
  assert.equal(result.locale, "pt-BR");
  assert.equal(state.theme, "light");
});

// --- refactorMutatingCartOperations --------------------------------------------------------

test("refactorMutatingCartOperations: 'add' não muta o carrinho original", () => {
  const cart = { items: [{ sku: "X1", quantity: 1 }], itemCount: 1 };
  const result = refactorMutatingCartOperations(cart, {
    type: "add",
    sku: "X2",
    quantity: 2,
  });
  assert.deepEqual(result, {
    items: [
      { sku: "X1", quantity: 1 },
      { sku: "X2", quantity: 2 },
    ],
    itemCount: 3,
  });
  assert.deepEqual(cart, { items: [{ sku: "X1", quantity: 1 }], itemCount: 1 });
});

test("refactorMutatingCartOperations: 'removeLast' não muta o carrinho original", () => {
  const cart = {
    items: [
      { sku: "X1", quantity: 1 },
      { sku: "X2", quantity: 2 },
    ],
    itemCount: 3,
  };
  const result = refactorMutatingCartOperations(cart, { type: "removeLast" });
  assert.deepEqual(result, { items: [{ sku: "X1", quantity: 1 }], itemCount: 1 });
  assert.equal(cart.items.length, 2);
  assert.equal(cart.itemCount, 3);
});

test("refactorMutatingCartOperations: 'clear' não muta o carrinho original", () => {
  const cart = { items: [{ sku: "X1", quantity: 1 }], itemCount: 1 };
  const result = refactorMutatingCartOperations(cart, { type: "clear" });
  assert.deepEqual(result, { items: [], itemCount: 0 });
  assert.deepEqual(cart, { items: [{ sku: "X1", quantity: 1 }], itemCount: 1 });
});

// --- applyImmutablePatch ---------------------------------------------------------------

test("applyImmutablePatch: retorna histórico completo de estados imutáveis", () => {
  const initial = { user: { name: "Ana", age: 20 } };
  const patches = [
    { path: ["user", "age"], value: 21 },
    { path: ["user", "name"], value: "Ana Paula" },
  ];
  const history = applyImmutablePatch(initial, patches);
  assert.equal(history.length, 3);
  assert.deepEqual(history[0], { user: { name: "Ana", age: 20 } });
  assert.deepEqual(history[1], { user: { name: "Ana", age: 21 } });
  assert.deepEqual(history[2], { user: { name: "Ana Paula", age: 21 } });
  // o estado inicial não pode ter sido afetado pelos patches
  assert.equal(initial.user.age, 20);
  assert.equal(initial.user.name, "Ana");
});

test("applyImmutablePatch: estados anteriores no histórico continuam congelados e intocados", () => {
  const initial = { count: 0 };
  const patches = [
    { path: ["count"], value: 1 },
    { path: ["count"], value: 2 },
  ];
  const history = applyImmutablePatch(initial, patches);
  assert.equal(history[0].count, 0);
  assert.equal(history[1].count, 1);
  assert.equal(history[2].count, 2);
});
