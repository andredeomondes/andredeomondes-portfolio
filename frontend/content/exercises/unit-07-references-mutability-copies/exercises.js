// Unidade 7 — Referências, mutabilidade e cópias
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="isPrimitiveValue" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function isPrimitiveValue(value) {
  const tiposValidos = ["string", "number", "boolean", "undefined"];
  if (tiposValidos.includes(typeof value)) {
    return true;
  }
  if (value === null) {
    return true;
  }
  return false;
}

// test: node --test --test-name-pattern="sameReference" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function sameReference(a, b) {
  return a === b;
}

// test: node --test --test-name-pattern="shallowCopyArray" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function shallowCopyArray(arr) {
  return [...arr];
}

// test: node --test --test-name-pattern="shallowCopyObject" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function shallowCopyObject(obj) {
  return { ...obj };
}

// test: node --test --test-name-pattern="mutateInPlacePush" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function mutateInPlacePush(arr, item) {
  arr.push(item);
  return arr;
}

// test: node --test --test-name-pattern="appendImmutable" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function appendImmutable(arr, item) {
  const newArray = [...arr];
  newArray.push(item);
  return newArray;
}

// test: node --test --test-name-pattern="updateNestedPropertyMutating" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function updateNestedPropertyMutating(obj, key, value) {
  obj[key] = value;
  return obj;
}

// test: node --test --test-name-pattern="updateNestedPropertyImmutable" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function updateNestedPropertyImmutable(obj, key, value) {
  const newObj = { ...obj };
  newObj[key] = value;
  return newObj;
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="shallowCopyKeepsNestedReference" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function shallowCopyKeepsNestedReference(obj) {
  const copy = { ...obj };
  let sameNestedRef = false;
  if (copy.nested === obj.nested) sameNestedRef = true;
  return { copy, sameNestedRef };
}

// test: node --test --test-name-pattern="deepCloneJSON" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function deepCloneJSON(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// test: node --test --test-name-pattern="deepCloneManual" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function deepCloneManual(value) {
  const primitive = ["string", "number", "boolean", "undefined"];
  if (primitive.includes(typeof value)) {
    return value;
  }
  if (value === null) {
    return null;
  }
  if (Array.isArray(value)) {
    const result = [];
    for (const item of value) {
      result.push(deepCloneManual(item));
    }

    return result;
  }
  const result2 = {};
  for (const [key, val] of Object.entries(value)) {
    result2[key] = deepCloneManual(val);
  }
  return result2;
}

// test: node --test --test-name-pattern="hasSideEffect" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function hasSideEffect(fn, arg) {
  const beforeSnapshot = JSON.stringify(arg);
  fn(arg);

  const afterSnapshot = JSON.stringify(arg);

  return beforeSnapshot !== afterSnapshot;
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixMutatingSortBug" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function fixMutatingSortBug(items) {
  // Sintoma relatado: depois de pedir "os 3 produtos mais baratos" através
  // desta função, a lista original de produtos (mantida em outra parte do
  // sistema, que só tinha passado a mesma referência de array) aparece
  // reordenada, mesmo que ninguém tenha pedido para reordenar nada além do
  // resultado.
  const result = [...items];
  result.sort((a, b) => a.price - b.price);
  return result.slice(0, 3);
}

// test: node --test --test-name-pattern="fixSharedDefaultArrayBug" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
const DEFAULT_TAGS = [];

export function fixSharedDefaultArrayBug(name, tags = DEFAULT_TAGS) {
  // Sintoma relatado: usuários criados sem passar `tags` explicitamente
  // começam a "herdar" tags adicionadas em chamadas anteriores, mesmo que
  // cada chamada pareça independente uma da outra.
  const result = [...tags];

  result.push("sem-categoria");

  return { name, tags: result };
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para evitar
// mutação em cadeia, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorDeepUpdateChain" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function refactorDeepUpdateChain(state, newCity) {
  const newAddress = { ...state.user.address };
  newAddress.city = newCity;

  const newUser = { ...state.user, address: newAddress };
  const newState = { ...state, user: newUser };

  return newState;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="applyPatchImmutable" exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
export function applyPatchImmutable(state, patch) {
  const newProfile = { ...state.profile, ...patch.profile };

  const result = { ...state, ...patch, profile: newProfile };

  return result;
}
