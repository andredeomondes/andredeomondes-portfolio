// Unidade 25 — Imutabilidade
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="freezeConfig" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function freezeConfig(config) {
  throw new Error("not implemented: freezeConfig");
}

// test: node --test --test-name-pattern="safeAssign" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function safeAssign(frozenObj, key, value) {
  throw new Error("not implemented: safeAssign");
}

// test: node --test --test-name-pattern="updateImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function updateImmutable(obj, key, value) {
  throw new Error("not implemented: updateImmutable");
}

// test: node --test --test-name-pattern="addItemImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function addItemImmutable(arr, item) {
  throw new Error("not implemented: addItemImmutable");
}

// test: node --test --test-name-pattern="removeItemImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function removeItemImmutable(arr, index) {
  throw new Error("not implemented: removeItemImmutable");
}

// test: node --test --test-name-pattern="updateItemImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function updateItemImmutable(arr, index, updater) {
  throw new Error("not implemented: updateItemImmutable");
}

// test: node --test --test-name-pattern="sortImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function sortImmutable(arr, compareFn) {
  throw new Error("not implemented: sortImmutable");
}

// test: node --test --test-name-pattern="mergeObjectsImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function mergeObjectsImmutable(base, overrides) {
  throw new Error("not implemented: mergeObjectsImmutable");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="deepFreeze" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function deepFreeze(obj) {
  throw new Error("not implemented: deepFreeze");
}

// test: node --test --test-name-pattern="updateNestedImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function updateNestedImmutable(obj, path, value) {
  throw new Error("not implemented: updateNestedImmutable");
}

// test: node --test --test-name-pattern="toggleSetImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function toggleSetImmutable(set, value) {
  throw new Error("not implemented: toggleSetImmutable");
}

// test: node --test --test-name-pattern="withoutKeysImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function withoutKeysImmutable(obj, keys) {
  throw new Error("not implemented: withoutKeysImmutable");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixMutatingSort" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function fixMutatingSort(products) {
  // Sintoma relatado: depois de "listar produtos ordenados por preço", a
  // lista original passada pela tela de estoque aparece fora de ordem em
  // outras partes da aplicação — como se algo tivesse embaralhado o array
  // original só de ordená-lo para exibição.
  products.sort((a, b) => a.price - b.price);
  return products;
}

// test: node --test --test-name-pattern="fixFrozenIgnoredMutation" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function fixFrozenIgnoredMutation(state, key, value) {
  // Sintoma relatado: a função deveria retornar um NOVO objeto de estado
  // com `key` atualizado para `value`, mas o `state` congelado (Object.freeze)
  // nunca muda visivelmente — e o valor retornado também não reflete a
  // atualização, porque o erro de atribuição em modo estrito é engolido
  // silenciosamente pelo try/catch, escondendo a falha.
  try {
    state[key] = value;
  } catch {
    // erro ignorado silenciosamente
  }
  return state;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para remover
// as mutações diretas, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorMutatingCartOperations" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function refactorMutatingCartOperations(cart, action) {
  if (action.type === "add") {
    cart.items.push({ sku: action.sku, quantity: action.quantity });
    cart.itemCount = cart.itemCount + action.quantity;
    return cart;
  }
  if (action.type === "removeLast") {
    const removed = cart.items.pop();
    if (removed) {
      cart.itemCount = cart.itemCount - removed.quantity;
    }
    return cart;
  }
  if (action.type === "clear") {
    cart.items.length = 0;
    cart.itemCount = 0;
    return cart;
  }
  return cart;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="applyImmutablePatch" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function applyImmutablePatch(state, patches) {
  throw new Error("not implemented: applyImmutablePatch");
}
