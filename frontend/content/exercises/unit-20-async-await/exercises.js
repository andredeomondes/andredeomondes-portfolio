// Unidade 20 — async/await
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.
//
// Todas as funções desta unidade são `async function` e usam `await`
// internamente. Para os stubs, `throw new Error(...)` dentro de uma
// `async function` já produz uma Promise rejeitada automaticamente —
// não é preciso escrever `return Promise.reject(...)` aqui.

// --- Fundamentais -----------------------------------------------------------

// test: node --test --test-name-pattern="delayAsync" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export async function delayAsync(ms, value) {
  throw new Error("not implemented: delayAsync");
}

// test: node --test --test-name-pattern="safeDivideAsync" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export async function safeDivideAsync(a, b) {
  throw new Error("not implemented: safeDivideAsync");
}

// test: node --test --test-name-pattern="fetchUserByIdAsync" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export async function fetchUserByIdAsync(id, users) {
  throw new Error("not implemented: fetchUserByIdAsync");
}

// test: node --test --test-name-pattern="sumAsyncValues" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export async function sumAsyncValues(promises) {
  throw new Error("not implemented: sumAsyncValues");
}

// test: node --test --test-name-pattern="tryCatchDivide" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export async function tryCatchDivide(a, b) {
  throw new Error("not implemented: tryCatchDivide");
}

// test: node --test --test-name-pattern="convertThenChainToAsync" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export async function convertThenChainToAsync(promise) {
  throw new Error("not implemented: convertThenChainToAsync");
}

// test: node --test --test-name-pattern="fetchWithRetryAsync" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export async function fetchWithRetryAsync(taskFn, attempts) {
  throw new Error("not implemented: fetchWithRetryAsync");
}

// test: node --test --test-name-pattern="sequentialAsyncMap" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export async function sequentialAsyncMap(items, asyncFn) {
  throw new Error("not implemented: sequentialAsyncMap");
}

// --- Intermediários ----------------------------------------------------------

// test: node --test --test-name-pattern="asyncPipeline" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export async function asyncPipeline(userId, fetchUserAsyncFn, fetchOrdersAsyncFn) {
  throw new Error("not implemented: asyncPipeline");
}

// test: node --test --test-name-pattern="asyncTimeout" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export async function asyncTimeout(promise, ms) {
  throw new Error("not implemented: asyncTimeout");
}

// test: node --test --test-name-pattern="asyncReduceTotal" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export async function asyncReduceTotal(items, asyncFn) {
  throw new Error("not implemented: asyncReduceTotal");
}

// test: node --test --test-name-pattern="safeAsyncWrapper" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export function safeAsyncWrapper(asyncFn) {
  throw new Error("not implemented: safeAsyncWrapper");
}

// --- Debugging ----------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixMissingAwaitBug" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export async function fixMissingAwaitBug(id, users) {
  // Sintoma relatado: o código que chama esta função recebe uma Promise
  // pendente dentro do campo `user`, em vez do usuário já resolvido —
  // `result.user.name` quebra com "Cannot read properties of undefined".
  async function lookupUser() {
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error(`usuário ${id} não encontrado`);
    return user;
  }

  const userPromise = lookupUser();
  return { user: userPromise, fetchedAt: Date.now() };
}

// test: node --test --test-name-pattern="fixTryCatchScopeBug" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export async function fixTryCatchScopeBug(a, b) {
  // Sintoma relatado: quando `b` é 0, o erro de "divisão por zero" não é
  // capturado — ele escapa da função em vez de virar
  // `{ ok: false, error: "divisão por zero" }` como o resto do código
  // espera.
  async function divide() {
    if (b === 0) throw new Error("divisão por zero");
    return a / b;
  }

  let result;
  try {
    result = divide(a, b);
  } catch (err) {
    return { ok: false, error: err.message };
  }
  const value = await result;
  return { ok: true, value };
}

// --- Refatoração ---------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar a cadeia
// `.then/.catch` para `async/await` com `try/catch`, mantendo o mesmo
// comportamento observável.

// test: node --test --test-name-pattern="refactorPromiseChainToAsync" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export function refactorPromiseChainToAsync(userId, api) {
  return api
    .fetchUser(userId)
    .then((user) => {
      return api.fetchOrders(user.id).then((orders) => ({ user, orders }));
    })
    .catch((err) => {
      return { error: err.message };
    });
}

// --- Desafio integrador -----------------------------------------------------------

// test: node --test --test-name-pattern="processOrdersAsync" exercises/01-javascript-core/unit-20-async-await/exercises.test.js
export async function processOrdersAsync(orders, validateAsyncFn, saveAsyncFn) {
  throw new Error("not implemented: processOrdersAsync");
}
