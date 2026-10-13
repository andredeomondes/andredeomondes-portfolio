import { test } from "node:test";
import assert from "node:assert/strict";

import {
  isPrimitiveValue,
  sameReference,
  shallowCopyArray,
  shallowCopyObject,
  mutateInPlacePush,
  appendImmutable,
  updateNestedPropertyMutating,
  updateNestedPropertyImmutable,
  shallowCopyKeepsNestedReference,
  deepCloneJSON,
  deepCloneManual,
  hasSideEffect,
  fixMutatingSortBug,
  fixSharedDefaultArrayBug,
  refactorDeepUpdateChain,
  applyPatchImmutable,
} from "./exercises.js";

// --- isPrimitiveValue --------------------------------------------------------

test("isPrimitiveValue: identifica tipos primitivos", () => {
  assert.equal(isPrimitiveValue(42), true);
  assert.equal(isPrimitiveValue("texto"), true);
  assert.equal(isPrimitiveValue(true), true);
  assert.equal(isPrimitiveValue(null), true);
  assert.equal(isPrimitiveValue(undefined), true);
});

test("isPrimitiveValue: rejeita objetos, arrays e funções", () => {
  assert.equal(isPrimitiveValue({}), false);
  assert.equal(isPrimitiveValue([]), false);
  assert.equal(
    isPrimitiveValue(() => {}),
    false,
  );
});

// --- sameReference ------------------------------------------------------------

test("sameReference: true apenas quando é o mesmo objeto/array na memória", () => {
  const arr = [1, 2, 3];
  const sameArr = arr;
  const equalButDifferentArr = [1, 2, 3];

  assert.equal(sameReference(arr, sameArr), true);
  assert.equal(sameReference(arr, equalButDifferentArr), false);
});

test("sameReference: funciona para objetos", () => {
  const obj = { a: 1 };
  assert.equal(sameReference(obj, obj), true);
  assert.equal(sameReference(obj, { a: 1 }), false);
});

// --- shallowCopyArray -----------------------------------------------------------

test("shallowCopyArray: retorna novo array com mesmos elementos, sem mutar o original", () => {
  const original = [1, 2, 3];
  const copy = shallowCopyArray(original);

  assert.deepEqual(copy, [1, 2, 3]);
  assert.notEqual(copy, original);

  copy.push(4);
  assert.deepEqual(original, [1, 2, 3], "não deve modificar o array original");
});

// --- shallowCopyObject -----------------------------------------------------------

test("shallowCopyObject: retorna novo objeto com mesmas propriedades, sem mutar o original", () => {
  const original = { a: 1, b: 2 };
  const copy = shallowCopyObject(original);

  assert.deepEqual(copy, { a: 1, b: 2 });
  assert.notEqual(copy, original);

  copy.c = 3;
  assert.deepEqual(original, { a: 1, b: 2 }, "não deve modificar o objeto original");
});

// --- mutateInPlacePush -----------------------------------------------------------

test("mutateInPlacePush: adiciona item ao próprio array e retorna a mesma referência", () => {
  const arr = [1, 2];
  const result = mutateInPlacePush(arr, 3);

  assert.deepEqual(arr, [1, 2, 3], "o array original deve ser modificado");
  assert.equal(result, arr, "deve retornar a mesma referência recebida");
});

// --- appendImmutable -----------------------------------------------------------

test("appendImmutable: retorna novo array com item adicionado, sem mutar o original", () => {
  const arr = [1, 2];
  const result = appendImmutable(arr, 3);

  assert.deepEqual(result, [1, 2, 3]);
  assert.deepEqual(arr, [1, 2], "não deve modificar o array original");
  assert.notEqual(result, arr, "deve retornar uma referência diferente");
});

// --- updateNestedPropertyMutating -----------------------------------------------------------

test("updateNestedPropertyMutating: atualiza a propriedade no próprio objeto recebido", () => {
  const obj = { name: "Ana", age: 30 };
  const result = updateNestedPropertyMutating(obj, "age", 31);

  assert.equal(obj.age, 31, "o objeto original deve ser modificado");
  assert.equal(result, obj, "deve retornar a mesma referência recebida");
});

// --- updateNestedPropertyImmutable -----------------------------------------------------------

test("updateNestedPropertyImmutable: retorna novo objeto com propriedade atualizada", () => {
  const obj = { name: "Ana", age: 30 };
  const result = updateNestedPropertyImmutable(obj, "age", 31);

  assert.deepEqual(result, { name: "Ana", age: 31 });
  assert.deepEqual(obj, { name: "Ana", age: 30 }, "não deve modificar o objeto original");
  assert.notEqual(result, obj, "deve retornar uma referência diferente");
});

// --- shallowCopyKeepsNestedReference -----------------------------------------------------------

test("shallowCopyKeepsNestedReference: cópia rasa compartilha objeto aninhado", () => {
  const obj = { name: "Ana", nested: { city: "SP" } };
  const { copy, sameNestedRef } = shallowCopyKeepsNestedReference(obj);

  assert.notEqual(copy, obj, "copy deve ser um objeto diferente de obj no nível raiz");
  assert.equal(sameNestedRef, true, "nested deve ser a mesma referência em copy e obj");
  assert.equal(copy.nested, obj.nested);
});

// --- deepCloneJSON -----------------------------------------------------------

test("deepCloneJSON: clona profundamente dados seguros para JSON", () => {
  const original = { name: "Ana", scores: [1, 2, 3], address: { city: "SP" } };
  const clone = deepCloneJSON(original);

  assert.deepEqual(clone, original);
  assert.notEqual(clone, original);
  assert.notEqual(
    clone.address,
    original.address,
    "objetos aninhados também devem ser novos",
  );
  assert.notEqual(
    clone.scores,
    original.scores,
    "arrays aninhados também devem ser novos",
  );

  clone.address.city = "RJ";
  assert.equal(original.address.city, "SP", "mudar o clone não pode afetar o original");
});

// --- deepCloneManual -----------------------------------------------------------

test("deepCloneManual: clona profundamente sem JSON.parse/stringify", () => {
  const original = { name: "Ana", scores: [1, 2, [3, 4]], address: { city: "SP" } };
  const clone = deepCloneManual(original);

  assert.deepEqual(clone, original);
  assert.notEqual(clone, original);
  assert.notEqual(clone.address, original.address);
  assert.notEqual(clone.scores, original.scores);
  assert.notEqual(
    clone.scores[2],
    original.scores[2],
    "arrays aninhados dentro de arrays também devem ser novos",
  );

  clone.scores[2].push(5);
  assert.deepEqual(
    original.scores[2],
    [3, 4],
    "mudar o clone não pode afetar o original",
  );
});

test("deepCloneManual: primitivos passam direto", () => {
  assert.equal(deepCloneManual(42), 42);
  assert.equal(deepCloneManual("texto"), "texto");
  assert.equal(deepCloneManual(null), null);
});

// --- hasSideEffect -----------------------------------------------------------

test("hasSideEffect: detecta quando a função muta o argumento recebido", () => {
  const mutatingFn = (arr) => arr.push("novo");
  assert.equal(hasSideEffect(mutatingFn, [1, 2, 3]), true);
});

test("hasSideEffect: false quando a função não muta o argumento", () => {
  const pureFn = (arr) => [...arr, "novo"];
  assert.equal(hasSideEffect(pureFn, [1, 2, 3]), false);
});

// --- fixMutatingSortBug -----------------------------------------------------------

test("fixMutatingSortBug: retorna os 3 mais baratos sem mutar a lista original", () => {
  const products = [
    { name: "A", price: 30 },
    { name: "B", price: 10 },
    { name: "C", price: 20 },
    { name: "D", price: 40 },
  ];
  const originalOrder = products.map((p) => p.name);

  const cheapest = fixMutatingSortBug(products);

  assert.deepEqual(
    cheapest.map((p) => p.name),
    ["B", "C", "A"],
  );
  assert.deepEqual(
    products.map((p) => p.name),
    originalOrder,
    "não deve reordenar a lista original",
  );
});

// --- fixSharedDefaultArrayBug -----------------------------------------------------------

test("fixSharedDefaultArrayBug: cada chamada sem tags recebe seu próprio array", () => {
  const userA = fixSharedDefaultArrayBug("Ana");
  const userB = fixSharedDefaultArrayBug("Bruno");

  assert.deepEqual(userA.tags, ["sem-categoria"]);
  assert.deepEqual(
    userB.tags,
    ["sem-categoria"],
    "usuário B não pode herdar tags acumuladas pelo usuário A",
  );
  assert.notEqual(
    userA.tags,
    userB.tags,
    "cada usuário deve ter seu próprio array de tags",
  );
});

test("fixSharedDefaultArrayBug: não muta o array de tags passado explicitamente", () => {
  const myTags = ["premium"];
  const user = fixSharedDefaultArrayBug("Caio", myTags);

  assert.deepEqual(user.tags, ["premium", "sem-categoria"]);
  assert.deepEqual(
    myTags,
    ["premium"],
    "não deve modificar o array passado pelo chamador",
  );
});

// --- refactorDeepUpdateChain -----------------------------------------------------------

test("refactorDeepUpdateChain: mantém o comportamento original sem mutar o state", () => {
  const state = { user: { name: "Ana", address: { city: "SP", zip: "00000" } } };

  const result = refactorDeepUpdateChain(state, "RJ");

  assert.equal(result.user.address.city, "RJ");
  assert.equal(result.user.address.zip, "00000");
  assert.equal(result.user.name, "Ana");

  assert.equal(state.user.address.city, "SP", "não deve modificar o state original");
  assert.notEqual(result, state);
  assert.notEqual(result.user, state.user);
  assert.notEqual(result.user.address, state.user.address);
});

// --- applyPatchImmutable -----------------------------------------------------------

test("applyPatchImmutable: sobrescreve nível superior e faz merge um nível a mais", () => {
  const state = { name: "Ana", profile: { age: 30, city: "SP" }, active: true };
  const patch = { profile: { city: "RJ" }, active: false };

  const result = applyPatchImmutable(state, patch);

  assert.deepEqual(result, {
    name: "Ana",
    profile: { age: 30, city: "RJ" },
    active: false,
  });

  assert.deepEqual(
    state,
    { name: "Ana", profile: { age: 30, city: "SP" }, active: true },
    "não deve modificar state",
  );
  assert.deepEqual(
    patch,
    { profile: { city: "RJ" }, active: false },
    "não deve modificar patch",
  );
  assert.notEqual(result.profile, state.profile);
});

test("applyPatchImmutable: patch vazio retorna equivalente ao state original", () => {
  const state = { name: "Ana", profile: { age: 30 } };
  const result = applyPatchImmutable(state, {});

  assert.deepEqual(result, state);
  assert.notEqual(result, state);
});
