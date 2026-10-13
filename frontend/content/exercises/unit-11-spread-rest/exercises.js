// Unidade 11 — Spread e rest
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="cloneArray" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function cloneArray(arr) {
  throw new Error("not implemented: cloneArray");
}

// test: node --test --test-name-pattern="mergeArrays" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function mergeArrays(a, b) {
  throw new Error("not implemented: mergeArrays");
}

// test: node --test --test-name-pattern="cloneObject" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function cloneObject(obj) {
  throw new Error("not implemented: cloneObject");
}

// test: node --test --test-name-pattern="mergeObjectsWithOverride" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function mergeObjectsWithOverride(base, overrides) {
  throw new Error("not implemented: mergeObjectsWithOverride");
}

// test: node --test --test-name-pattern="sumAllArgs" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function sumAllArgs(...numbers) {
  throw new Error("not implemented: sumAllArgs");
}

// test: node --test --test-name-pattern="firstAndRest" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function firstAndRest(arr) {
  throw new Error("not implemented: firstAndRest");
}

// test: node --test --test-name-pattern="spreadIntoCall" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function spreadIntoCall(numbers, fn) {
  throw new Error("not implemented: spreadIntoCall");
}

// test: node --test --test-name-pattern="addProperty" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function addProperty(obj, key, value) {
  throw new Error("not implemented: addProperty");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="describeMainAndExtras" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function describeMainAndExtras(first, second, ...rest) {
  throw new Error("not implemented: describeMainAndExtras");
}

// test: node --test --test-name-pattern="shallowMergeConfig" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function shallowMergeConfig(base, patch) {
  throw new Error("not implemented: shallowMergeConfig");
}

// test: node --test --test-name-pattern="removeKey" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function removeKey(obj, keyToRemove) {
  throw new Error("not implemented: removeKey");
}

// test: node --test --test-name-pattern="combineArraysUnique" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function combineArraysUnique(...arrays) {
  throw new Error("not implemented: combineArraysUnique");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixSpreadMutationBug" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function fixSpreadMutationBug(cart, newItem) {
  // Sintoma relatado: a função deveria retornar um NOVO array com o
  // item adicionado, sem alterar o carrinho original. Mas testes que
  // checam o carrinho original depois de chamar a função mostram que
  // ele também foi alterado.
  cart.push(newItem);
  return cart;
}

// test: node --test --test-name-pattern="fixRestParamsOrderBug" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function fixRestParamsOrderBug(label, ...values) {
  // Sintoma relatado: o rótulo (`label`) está aparecendo duplicado
  // dentro da lista de valores no texto final, em vez de aparecer só
  // uma vez antes dos dois-pontos.
  const all = [label, ...values];
  return `${label}: ${all.join(", ")}`;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar o
// concat manual via laço + push usando spread, mantendo o mesmo
// comportamento.

// test: node --test --test-name-pattern="refactorConcatViaPush" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function refactorConcatViaPush(arrays) {
  const result = [];
  for (let i = 0; i < arrays.length; i++) {
    for (let j = 0; j < arrays[i].length; j++) {
      result.push(arrays[i][j]);
    }
  }
  return result;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="buildUpdatedOrder" exercises/01-javascript-core/unit-11-spread-rest/exercises.test.js
export function buildUpdatedOrder(order, updates, extraItems) {
  throw new Error("not implemented: buildUpdatedOrder");
}
