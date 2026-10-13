// Unidade 21 — Promise.all, allSettled, race e any
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.
//
// Todas as funções desta unidade são `async function`. Para os stubs,
// `throw new Error(...)` já produz uma Promise rejeitada.

// --- Fundamentais -----------------------------------------------------------

// test: node --test --test-name-pattern="fetchAllUsersAll" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function fetchAllUsersAll(ids, fetchUserAsyncFn) {
  throw new Error("not implemented: fetchAllUsersAll");
}

// test: node --test --test-name-pattern="fetchAllUsersSettled" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function fetchAllUsersSettled(ids, fetchUserAsyncFn) {
  throw new Error("not implemented: fetchAllUsersSettled");
}

// test: node --test --test-name-pattern="firstToRespond" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function firstToRespond(promises) {
  throw new Error("not implemented: firstToRespond");
}

// test: node --test --test-name-pattern="firstSuccessful" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function firstSuccessful(promises) {
  throw new Error("not implemented: firstSuccessful");
}

// test: node --test --test-name-pattern="summarizeSettled" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export function summarizeSettled(results) {
  throw new Error("not implemented: summarizeSettled");
}

// test: node --test --test-name-pattern="allWithIndex" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function allWithIndex(promises) {
  throw new Error("not implemented: allWithIndex");
}

// test: node --test --test-name-pattern="raceWithTimeout" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function raceWithTimeout(promise, ms) {
  throw new Error("not implemented: raceWithTimeout");
}

// test: node --test --test-name-pattern="anyWithFallback" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function anyWithFallback(promises, fallbackValue) {
  throw new Error("not implemented: anyWithFallback");
}

// --- Intermediários ----------------------------------------------------------

// test: node --test --test-name-pattern="batchProcessAll" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function batchProcessAll(items, asyncFn, batchSize) {
  throw new Error("not implemented: batchProcessAll");
}

// test: node --test --test-name-pattern="allSettledPartitionErrors" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function allSettledPartitionErrors(promises) {
  throw new Error("not implemented: allSettledPartitionErrors");
}

// test: node --test --test-name-pattern="raceMultipleSources" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function raceMultipleSources(sources, fetchFn) {
  throw new Error("not implemented: raceMultipleSources");
}

// test: node --test --test-name-pattern="anyOfValidations" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function anyOfValidations(validators, value) {
  throw new Error("not implemented: anyOfValidations");
}

// --- Debugging ----------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixPromiseAllFailFastBug" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function fixPromiseAllFailFastBug(ids, fetchUserAsyncFn) {
  // Sintoma relatado: o objetivo é buscar vários usuários e reportar
  // quais deram certo e quais falharam. Só que, se **um único** id
  // falhar, a função inteira rejeita e perdemos os resultados dos ids
  // que teriam funcionado.
  const users = await Promise.all(ids.map((id) => fetchUserAsyncFn(id)));
  return users.map((user) => ({ status: "fulfilled", value: user }));
}

// test: node --test --test-name-pattern="fixRaceWinnerIndexBug" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function fixRaceWinnerIndexBug(sources) {
  // Sintoma relatado: a função deveria informar o índice de qual `source`
  // (dentro do array `sources`) respondeu primeiro, mas o índice
  // reportado está sempre errado — sempre reporta o índice da última
  // fonte do array, não da que realmente venceu a corrida.
  let winnerIndex;
  const promises = sources.map((source, index) => {
    winnerIndex = index;
    return source();
  });
  const value = await Promise.race(promises);
  return { value, winnerIndex };
}

// --- Refatoração ---------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar o laço
// sequencial para rodar as chamadas independentes em paralelo com
// `Promise.all`, mantendo o mesmo resultado e a mesma ordem.

// test: node --test --test-name-pattern="refactorSequentialToParallelAll" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function refactorSequentialToParallelAll(items, asyncFn) {
  const results = [];
  for (const item of items) {
    const result = await asyncFn(item);
    results.push(result);
  }
  return results;
}

// --- Desafio integrador -----------------------------------------------------------

// test: node --test --test-name-pattern="loadDashboardData" exercises/01-javascript-core/unit-21-promise-combinators/exercises.test.js
export async function loadDashboardData(userId, api) {
  throw new Error("not implemented: loadDashboardData");
}
