// Unidade 19 — Promises
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.
//
// Todas as funções desta unidade retornam uma Promise (não recebem
// callback). Para os stubs, em vez de `throw`, use
// `return Promise.reject(new Error("not implemented: <nome>"))` — assim a
// função continua "assíncrona" mesmo antes de ser implementada.

// --- Fundamentais -----------------------------------------------------------

// test: node --test --test-name-pattern="delayPromise" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function delayPromise(ms, value) {
  return Promise.reject(new Error("not implemented: delayPromise"));
}

// test: node --test --test-name-pattern="safeDividePromise" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function safeDividePromise(a, b) {
  return Promise.reject(new Error("not implemented: safeDividePromise"));
}

// test: node --test --test-name-pattern="fetchUserByIdPromise" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function fetchUserByIdPromise(id, users) {
  return Promise.reject(new Error("not implemented: fetchUserByIdPromise"));
}

// test: node --test --test-name-pattern="resolveOrDefault" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function resolveOrDefault(promiseOrValue, defaultValue) {
  return Promise.reject(new Error("not implemented: resolveOrDefault"));
}

// test: node --test --test-name-pattern="chainDoubleThenSquare" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function chainDoubleThenSquare(promise) {
  return Promise.reject(new Error("not implemented: chainDoubleThenSquare"));
}

// test: node --test --test-name-pattern="tapPromise" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function tapPromise(promise, sideEffectFn) {
  return Promise.reject(new Error("not implemented: tapPromise"));
}

// test: node --test --test-name-pattern="finallyCleanup" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function finallyCleanup(promise, cleanupFn) {
  return Promise.reject(new Error("not implemented: finallyCleanup"));
}

// test: node --test --test-name-pattern="promiseFromCallback" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function promiseFromCallback(fn, ...args) {
  return Promise.reject(new Error("not implemented: promiseFromCallback"));
}

// --- Intermediários ----------------------------------------------------------

// test: node --test --test-name-pattern="chainUserThenOrders" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function chainUserThenOrders(fetchUserPromiseFn, fetchOrdersPromiseFn, userId) {
  return Promise.reject(new Error("not implemented: chainUserThenOrders"));
}

// test: node --test --test-name-pattern="retryPromise" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function retryPromise(taskFn, attempts) {
  return Promise.reject(new Error("not implemented: retryPromise"));
}

// test: node --test --test-name-pattern="timeoutPromise" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function timeoutPromise(promise, ms) {
  return Promise.reject(new Error("not implemented: timeoutPromise"));
}

// test: node --test --test-name-pattern="sequentialReduce" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function sequentialReduce(items, asyncFn) {
  return Promise.reject(new Error("not implemented: sequentialReduce"));
}

// --- Debugging ----------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixMissingReturnInChain" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function fixMissingReturnInChain(userId, api) {
  // Sintoma relatado: a Promise retornada resolve quase instantaneamente,
  // antes de `api.fetchOrders` terminar, e com o valor errado (a Promise
  // interna, não os pedidos).
  return api.fetchUser(userId).then((user) => {
    api.fetchOrders(user.id).then((orders) => {
      return { user, orders };
    });
  });
}

// test: node --test --test-name-pattern="fixUnhandledRejectionSwallow" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function fixUnhandledRejectionSwallow(promise) {
  // Sintoma relatado: quando `promise` rejeita, a função retorna
  // `undefined` silenciosamente em vez de propagar (ou tratar) o erro —
  // quem chama essa função não tem como saber que algo deu errado.
  return promise.catch((err) => {
    console.error("erro ignorado:", err.message);
  });
}

// --- Refatoração ---------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para achatar
// a "pirâmide" de `.then` aninhados, mantendo o mesmo comportamento
// observável.

// test: node --test --test-name-pattern="refactorPromiseHell" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function refactorPromiseHell(userId, api) {
  return api.fetchUser(userId).then((user) => {
    return api.fetchOrders(user.id).then((orders) => {
      return api.fetchOrderItems(orders[0]?.id).then((items) => {
        return { user, orders, items };
      });
    });
  });
}

// --- Desafio integrador -----------------------------------------------------------

// test: node --test --test-name-pattern="processOrdersPromise" exercises/01-javascript-core/unit-19-promises/exercises.test.js
export function processOrdersPromise(orders, validateFn, savePromiseFn) {
  return Promise.reject(new Error("not implemented: processOrdersPromise"));
}
