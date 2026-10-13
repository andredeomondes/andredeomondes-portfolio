import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildRangeArray,
  pushAndSlice,
  joinNames,
  findProductById,
  countByKey,
  buildUserObject,
  listObjectKeysSorted,
  mergeObjectsShallow,
  groupByStatus,
  invertObject,
  removeDuplicatesByKey,
  buildFrequencyTable,
  sumPricesBuggy,
  addTagBuggy,
  refactorActiveUserNames,
  buildInventoryReport,
} from "./exercises.js";

// --- buildRangeArray --------------------------------------------------------

test("buildRangeArray: gera intervalo inclusivo", () => {
  assert.deepEqual(buildRangeArray(1, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(buildRangeArray(3, 3), [3]);
});

// --- pushAndSlice ------------------------------------------------------------

test("pushAndSlice: adiciona item e mantém apenas os mais recentes", () => {
  const items = [1, 2, 3];
  const result = pushAndSlice(items, 4, 3);
  assert.deepEqual(result, [2, 3, 4]);
  assert.deepEqual(items, [1, 2, 3], "não deve modificar o array original");
});

test("pushAndSlice: não corta quando está dentro do limite", () => {
  assert.deepEqual(pushAndSlice([1, 2], 3, 5), [1, 2, 3]);
});

// --- joinNames -----------------------------------------------------------------

test("joinNames: junta nomes separados por vírgula", () => {
  assert.equal(
    joinNames([{ name: "Ana" }, { name: "Bruno" }, { name: "Caio" }]),
    "Ana, Bruno, Caio",
  );
});

test("joinNames: lista vazia retorna string vazia", () => {
  assert.equal(joinNames([]), "");
});

// --- findProductById -------------------------------------------------------------

test("findProductById: encontra produto pelo id", () => {
  const products = [
    { id: 1, name: "Teclado" },
    { id: 2, name: "Mouse" },
  ];
  assert.deepEqual(findProductById(products, 2), { id: 2, name: "Mouse" });
});

test("findProductById: retorna undefined quando não existe", () => {
  assert.equal(findProductById([{ id: 1 }], 99), undefined);
});

// --- countByKey --------------------------------------------------------------------

test("countByKey: conta ocorrências por valor de chave", () => {
  assert.deepEqual(
    countByKey([{ status: "ok" }, { status: "fail" }, { status: "ok" }], "status"),
    { ok: 2, fail: 1 },
  );
});

test("countByKey: lista vazia retorna objeto vazio", () => {
  assert.deepEqual(countByKey([], "status"), {});
});

// --- buildUserObject -----------------------------------------------------------------

test("buildUserObject: monta objeto com propriedades abreviadas", () => {
  assert.deepEqual(buildUserObject(1, "Ana", "ana@example.com"), {
    id: 1,
    name: "Ana",
    email: "ana@example.com",
  });
});

// --- listObjectKeysSorted -------------------------------------------------------------

test("listObjectKeysSorted: retorna chaves ordenadas alfabeticamente", () => {
  assert.deepEqual(listObjectKeysSorted({ zeta: 1, alpha: 2, mu: 3 }), [
    "alpha",
    "mu",
    "zeta",
  ]);
});

test("listObjectKeysSorted: objeto vazio retorna array vazio", () => {
  assert.deepEqual(listObjectKeysSorted({}), []);
});

// --- mergeObjectsShallow ---------------------------------------------------------------

test("mergeObjectsShallow: overrides sobrescreve base sem mutar nenhum dos dois", () => {
  const base = { a: 1, b: 2 };
  const overrides = { b: 20, c: 30 };
  const result = mergeObjectsShallow(base, overrides);
  assert.deepEqual(result, { a: 1, b: 20, c: 30 });
  assert.deepEqual(base, { a: 1, b: 2 }, "não deve modificar base");
  assert.deepEqual(overrides, { b: 20, c: 30 }, "não deve modificar overrides");
});

// --- groupByStatus ------------------------------------------------------------------

test("groupByStatus: agrupa pedidos completos por status", () => {
  const orders = [
    { status: "paid", id: 1 },
    { status: "pending", id: 2 },
    { status: "paid", id: 3 },
  ];
  assert.deepEqual(groupByStatus(orders), {
    paid: [
      { status: "paid", id: 1 },
      { status: "paid", id: 3 },
    ],
    pending: [{ status: "pending", id: 2 }],
  });
});

// --- invertObject -------------------------------------------------------------------

test("invertObject: troca chaves por valores", () => {
  assert.deepEqual(invertObject({ a: 1, b: 2 }), { 1: "a", 2: "b" });
});

// --- removeDuplicatesByKey -----------------------------------------------------------

test("removeDuplicatesByKey: mantém apenas a primeira ocorrência por chave", () => {
  const items = [
    { id: 1, name: "a" },
    { id: 2, name: "b" },
    { id: 1, name: "a-duplicado" },
  ];
  const result = removeDuplicatesByKey(items, "id");
  assert.deepEqual(result, [
    { id: 1, name: "a" },
    { id: 2, name: "b" },
  ]);
  assert.equal(items.length, 3, "não deve modificar o array original");
});

// --- buildFrequencyTable ---------------------------------------------------------------

test("buildFrequencyTable: conta ocorrências de cada string", () => {
  assert.deepEqual(buildFrequencyTable(["a", "b", "a", "c", "b", "a"]), {
    a: 3,
    b: 2,
    c: 1,
  });
});

test("buildFrequencyTable: array vazio retorna objeto vazio", () => {
  assert.deepEqual(buildFrequencyTable([]), {});
});

// --- sumPricesBuggy -----------------------------------------------------------------

test("sumPricesBuggy: soma os preços sem estourar o índice", () => {
  assert.equal(sumPricesBuggy([{ price: 10 }, { price: 20 }, { price: 30 }]), 60);
  assert.equal(sumPricesBuggy([]), 0);
});

// --- addTagBuggy --------------------------------------------------------------------

test("addTagBuggy: adiciona tag sem afetar objetos que compartilham o array original", () => {
  const sharedTags = ["javascript"];
  const article = { title: "Post A", tags: sharedTags };
  const otherArticle = { title: "Post B", tags: sharedTags };

  const result = addTagBuggy(article, "backend");

  assert.deepEqual(result.tags, ["javascript", "backend"]);
  assert.deepEqual(
    otherArticle.tags,
    ["javascript"],
    "outro artigo que compartilhava o array não pode ser afetado",
  );
  assert.deepEqual(sharedTags, ["javascript"], "o array original não pode ser mutado");
});

// --- refactorActiveUserNames -----------------------------------------------------------

test("refactorActiveUserNames: mantém o comportamento original", () => {
  const users = [
    { name: "Ana", active: true },
    { name: "Bruno", active: false },
    { name: "Caio", active: true },
  ];
  assert.deepEqual(refactorActiveUserNames(users), ["Ana", "Caio"]);
});

test("refactorActiveUserNames: nenhum usuário ativo retorna array vazio", () => {
  assert.deepEqual(refactorActiveUserNames([{ name: "Ana", active: false }]), []);
});

// --- buildInventoryReport ---------------------------------------------------------------

test("buildInventoryReport: soma valores e conta por categoria", () => {
  const products = [
    { name: "Teclado", category: "periféricos", price: 100, quantity: 2 },
    { name: "Mouse", category: "periféricos", price: 50, quantity: 3 },
    { name: "Monitor", category: "telas", price: 800, quantity: 1 },
  ];
  assert.deepEqual(buildInventoryReport(products), {
    totalProducts: 3,
    totalValue: 1150,
    byCategory: { periféricos: 2, telas: 1 },
  });
});

test("buildInventoryReport: lista vazia", () => {
  assert.deepEqual(buildInventoryReport([]), {
    totalProducts: 0,
    totalValue: 0,
    byCategory: {},
  });
});
