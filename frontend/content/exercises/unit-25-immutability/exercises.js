// Unidade 25 — Imutabilidade
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="freezeConfig" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function freezeConfig(config) {
  return Object.freeze(config);
}

// test: node --test --test-name-pattern="safeAssign" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function safeAssign(frozenObj, key, value) {
  try {
    frozenObj[key] = value;
    return { success: true, value: frozenObj[key], error: null };
  } catch (error) {
    return {
      success: false,
      value: frozenObj[key],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// test: node --test --test-name-pattern="updateImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function updateImmutable(obj, key, value) {
  return { ...obj, [key]: value };
}

// test: node --test --test-name-pattern="addItemImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function addItemImmutable(arr, item) {
  return [...arr, item];
}

// test: node --test --test-name-pattern="removeItemImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function removeItemImmutable(arr, index) {
  return arr.filter((_item, itemIndex) => itemIndex !== index);
}

// test: node --test --test-name-pattern="updateItemImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function updateItemImmutable(arr, index, updater) {
  return arr.map((item, itemIndex) =>
    itemIndex === index ? updater(item) : item,
  );
}

// test: node --test --test-name-pattern="sortImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function sortImmutable(arr, compareFn) {
  return [...arr].sort(compareFn);
}

// test: node --test --test-name-pattern="mergeObjectsImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function mergeObjectsImmutable(base, overrides) {
  return { ...base, ...overrides };
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="deepFreeze" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function deepFreeze(obj) {
  const visited = new WeakSet();

  function freeze(value) {
    if (value === null || typeof value !== "object" || visited.has(value)) {
      return value;
    }

    visited.add(value);
    for (const nestedValue of Object.values(value)) freeze(nestedValue);
    return Object.freeze(value);
  }

  return freeze(obj);
}

// test: node --test --test-name-pattern="updateNestedImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function updateNestedImmutable(obj, path, value) {
  if (path.length === 0) return value;

  const [key, ...remainingPath] = path;
  const current = obj ?? {};
  const copy = Array.isArray(current) ? [...current] : { ...current };
  copy[key] = updateNestedImmutable(current[key], remainingPath, value);
  return copy;
}

// test: node --test --test-name-pattern="toggleSetImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function toggleSetImmutable(set, value) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

// test: node --test --test-name-pattern="withoutKeysImmutable" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function withoutKeysImmutable(obj, keys) {
  const excluded = new Set(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !excluded.has(key)),
  );
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
  return [...products].sort((a, b) => a.price - b.price);
}

// test: node --test --test-name-pattern="fixFrozenIgnoredMutation" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function fixFrozenIgnoredMutation(state, key, value) {
  // Sintoma relatado: a função deveria retornar um NOVO objeto de estado
  // com `key` atualizado para `value`, mas o `state` congelado (Object.freeze)
  // nunca muda visivelmente — e o valor retornado também não reflete a
  // atualização, porque o erro de atribuição em modo estrito é engolido
  // silenciosamente pelo try/catch, escondendo a falha.
  return { ...state, [key]: value };
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para remover
// as mutações diretas, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorMutatingCartOperations" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function refactorMutatingCartOperations(cart, action) {
  if (action.type === "add") {
    return {
      ...cart,
      items: [...cart.items, { sku: action.sku, quantity: action.quantity }],
      itemCount: cart.itemCount + action.quantity,
    };
  }

  if (action.type === "removeLast") {
    const removed = cart.items.at(-1);
    if (!removed) return cart;

    return {
      ...cart,
      items: cart.items.slice(0, -1),
      itemCount: cart.itemCount - removed.quantity,
    };
  }

  if (action.type === "clear") {
    return { ...cart, items: [], itemCount: 0 };
  }

  return cart;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="applyImmutablePatch" exercises/01-javascript-core/unit-25-immutability/exercises.test.js
export function applyImmutablePatch(state, patches) {
  const history = [deepFreeze(structuredClone(state))];

  for (const patch of patches) {
    const nextState = updateNestedImmutable(history.at(-1), patch.path, patch.value);
    history.push(deepFreeze(nextState));
  }

  return history;
}
