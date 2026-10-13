import { test } from "node:test";
import assert from "node:assert/strict";

import {
  cloneArray,
  mergeArrays,
  cloneObject,
  mergeObjectsWithOverride,
  sumAllArgs,
  firstAndRest,
  spreadIntoCall,
  addProperty,
  describeMainAndExtras,
  shallowMergeConfig,
  removeKey,
  combineArraysUnique,
  fixSpreadMutationBug,
  fixRestParamsOrderBug,
  refactorConcatViaPush,
  buildUpdatedOrder,
} from "./exercises.js";

// --- cloneArray --------------------------------------------------------

test("cloneArray: cria uma cópia independente do array original", () => {
  const original = [1, 2, 3];
  const copy = cloneArray(original);
  assert.deepEqual(copy, [1, 2, 3]);
  assert.notEqual(copy, original);
  copy.push(4);
  assert.deepEqual(original, [1, 2, 3]);
});

// --- mergeArrays -----------------------------------------------------------

test("mergeArrays: combina dois arrays em um novo array", () => {
  assert.deepEqual(mergeArrays([1, 2], [3, 4]), [1, 2, 3, 4]);
  assert.deepEqual(mergeArrays([], [1]), [1]);
});

// --- cloneObject -------------------------------------------------------------

test("cloneObject: cria uma cópia independente do objeto original", () => {
  const original = { a: 1, b: 2 };
  const copy = cloneObject(original);
  assert.deepEqual(copy, { a: 1, b: 2 });
  assert.notEqual(copy, original);
  copy.a = 99;
  assert.equal(original.a, 1);
});

// --- mergeObjectsWithOverride --------------------------------------------------

test("mergeObjectsWithOverride: overrides sobrescreve campos de base", () => {
  const base = { name: "produto", price: 10, stock: 5 };
  const overrides = { price: 15 };
  assert.deepEqual(mergeObjectsWithOverride(base, overrides), {
    name: "produto",
    price: 15,
    stock: 5,
  });
});

// --- sumAllArgs -----------------------------------------------------------------

test("sumAllArgs: soma qualquer quantidade de argumentos numéricos", () => {
  assert.equal(sumAllArgs(1, 2, 3), 6);
  assert.equal(sumAllArgs(), 0);
  assert.equal(sumAllArgs(5), 5);
});

// --- firstAndRest ------------------------------------------------------------------

test("firstAndRest: separa o primeiro elemento do restante", () => {
  assert.deepEqual(firstAndRest([1, 2, 3, 4]), { first: 1, rest: [2, 3, 4] });
  assert.deepEqual(firstAndRest([9]), { first: 9, rest: [] });
});

// --- spreadIntoCall --------------------------------------------------------------------

test("spreadIntoCall: espalha um array como argumentos posicionais", () => {
  assert.equal(
    spreadIntoCall([1, 2, 3], (a, b, c) => a + b + c),
    6,
  );
  assert.equal(spreadIntoCall([4, 5], Math.max), 5);
});

// --- addProperty -------------------------------------------------------------------------

test("addProperty: retorna novo objeto com a propriedade adicionada", () => {
  const original = { a: 1 };
  const result = addProperty(original, "b", 2);
  assert.deepEqual(result, { a: 1, b: 2 });
  assert.deepEqual(original, { a: 1 });
});

test("addProperty: sobrescreve a propriedade se já existir", () => {
  assert.deepEqual(addProperty({ a: 1 }, "a", 99), { a: 99 });
});

// --- describeMainAndExtras -----------------------------------------------------------------

test("describeMainAndExtras: junta os dois primeiros com o restante via rest", () => {
  assert.equal(
    describeMainAndExtras("Ana", "Bia", "Caio", "Duda"),
    "Ana, Bia e mais 2: Caio, Duda",
  );
});

test("describeMainAndExtras: sem itens extras", () => {
  assert.equal(describeMainAndExtras("Ana", "Bia"), "Ana, Bia e mais 0: ");
});

// --- shallowMergeConfig --------------------------------------------------------------------

test("shallowMergeConfig: campos de nível superior do patch sobrescrevem base", () => {
  const base = { env: "dev", server: { port: 3000, host: "localhost" } };
  const patch = { env: "prod", server: { port: 8080 } };
  assert.deepEqual(shallowMergeConfig(base, patch), {
    env: "prod",
    server: { port: 8080 },
  });
});

// --- removeKey -----------------------------------------------------------------------------

test("removeKey: retorna novo objeto sem a chave indicada", () => {
  const original = { id: 1, name: "x", secret: "shh" };
  const result = removeKey(original, "secret");
  assert.deepEqual(result, { id: 1, name: "x" });
  assert.deepEqual(original, { id: 1, name: "x", secret: "shh" });
});

// --- combineArraysUnique --------------------------------------------------------------------

test("combineArraysUnique: combina vários arrays removendo duplicados", () => {
  assert.deepEqual(combineArraysUnique([1, 2], [2, 3], [3, 4]), [1, 2, 3, 4]);
});

test("combineArraysUnique: sem argumentos retorna array vazio", () => {
  assert.deepEqual(combineArraysUnique(), []);
});

// --- fixSpreadMutationBug --------------------------------------------------------------------

test("fixSpreadMutationBug: retorna novo array sem mutar o original", () => {
  const cart = ["camisa", "calça"];
  const updated = fixSpreadMutationBug(cart, "boné");
  assert.deepEqual(updated, ["camisa", "calça", "boné"]);
  assert.deepEqual(cart, ["camisa", "calça"]);
});

// --- fixRestParamsOrderBug --------------------------------------------------------------------

test("fixRestParamsOrderBug: o rótulo aparece uma única vez", () => {
  assert.equal(fixRestParamsOrderBug("cores", "azul", "verde"), "cores: azul, verde");
});

// --- refactorConcatViaPush --------------------------------------------------------------------

test("refactorConcatViaPush: mantém o comportamento original", () => {
  assert.deepEqual(refactorConcatViaPush([[1, 2], [3], [], [4, 5]]), [1, 2, 3, 4, 5]);
});

// --- buildUpdatedOrder --------------------------------------------------------------------------

test("buildUpdatedOrder: aplica updates, adiciona itens e recalcula o total", () => {
  const order = {
    id: 1,
    status: "pending",
    items: [
      { name: "Camisa", price: 50, qty: 2 },
      { name: "Calça", price: 100, qty: 1 },
    ],
    total: 200,
  };
  const updates = { status: "paid" };
  const extraItems = [{ name: "Brinde", price: 0, qty: 1 }];

  const result = buildUpdatedOrder(order, updates, extraItems);

  assert.equal(result.status, "paid");
  assert.deepEqual(result.items, [
    { name: "Camisa", price: 50, qty: 2 },
    { name: "Calça", price: 100, qty: 1 },
    { name: "Brinde", price: 0, qty: 1 },
  ]);
  assert.equal(result.total, 200);
  // não modifica o pedido original
  assert.equal(order.status, "pending");
  assert.equal(order.items.length, 2);
});
