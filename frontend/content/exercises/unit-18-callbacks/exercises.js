// Unidade 18 — Callbacks
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.
//
// Convenção usada nesta unidade: "error-first callback". A função recebe
// uma função `callback(err, result)` como último parâmetro. Se algo der
// errado, chame `callback(error)` (com `result` omitido). Se der certo,
// chame `callback(null, result)`. Nunca chame `callback` mais de uma vez.

// --- Fundamentais -----------------------------------------------------------

// test: node --test --test-name-pattern="delayCallback" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function delayCallback(ms, value, callback) {
  throw new Error("not implemented: delayCallback");
}

// test: node --test --test-name-pattern="safeDivideCallback" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function safeDivideCallback(a, b, callback) {
  throw new Error("not implemented: safeDivideCallback");
}

// test: node --test --test-name-pattern="fetchUserByIdCallback" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function fetchUserByIdCallback(id, users, callback) {
  throw new Error("not implemented: fetchUserByIdCallback");
}

// test: node --test --test-name-pattern="validatePositiveCallback" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function validatePositiveCallback(n, callback) {
  throw new Error("not implemented: validatePositiveCallback");
}

// test: node --test --test-name-pattern="mapSeriesCallback" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function mapSeriesCallback(items, asyncFn, callback) {
  throw new Error("not implemented: mapSeriesCallback");
}

// test: node --test --test-name-pattern="parallelCallback" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function parallelCallback(tasks, callback) {
  throw new Error("not implemented: parallelCallback");
}

// test: node --test --test-name-pattern="waterfallCallback" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function waterfallCallback(tasks, callback) {
  throw new Error("not implemented: waterfallCallback");
}

// test: node --test --test-name-pattern="retryCallback" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function retryCallback(taskFn, attempts, callback) {
  throw new Error("not implemented: retryCallback");
}

// --- Intermediários ----------------------------------------------------------

// test: node --test --test-name-pattern="timeoutCallback" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function timeoutCallback(taskFn, ms, callback) {
  throw new Error("not implemented: timeoutCallback");
}

// test: node --test --test-name-pattern="cacheCallback" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function cacheCallback(fn) {
  throw new Error("not implemented: cacheCallback");
}

// test: node --test --test-name-pattern="seriesUntilCallback" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function seriesUntilCallback(items, predicateAsyncFn, callback) {
  throw new Error("not implemented: seriesUntilCallback");
}

// test: node --test --test-name-pattern="composeUserOrdersCallback" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function composeUserOrdersCallback(fetchUserCb, fetchOrdersCb, userId, callback) {
  throw new Error("not implemented: composeUserOrdersCallback");
}

// --- Debugging ----------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixDoubleCallbackBug" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function fixDoubleCallbackBug(n, callback) {
  // Sintoma relatado: para números negativos, o `callback` de sucesso E o
  // `callback` de erro estão sendo chamados (a função esquece de sair da
  // execução depois de reportar o erro).
  if (n < 0) {
    callback(new Error("n não pode ser negativo"));
  }
  setTimeout(() => {
    callback(null, n * 2);
  }, 0);
}

// test: node --test --test-name-pattern="fixSwallowedErrorCallback" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function fixSwallowedErrorCallback(id, users, callback) {
  // Sintoma relatado: quando o `id` não existe na lista, a função retorna
  // `undefined` como se fosse um usuário válido em vez de reportar erro —
  // o código downstream quebra tentando ler `.name` de `undefined`.
  setTimeout(() => {
    const user = users.find((u) => u.id === id);
    callback(null, user);
  }, 0);
}

// --- Refatoração ---------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// aninhamento (a "pirâmide da perdição"), mantendo o mesmo comportamento
// observável.

// test: node --test --test-name-pattern="refactorCallbackPyramid" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function refactorCallbackPyramid(userId, api, callback) {
  api.fetchUser(userId, (err, user) => {
    if (err) {
      callback(err);
    } else {
      api.fetchOrders(user.id, (err2, orders) => {
        if (err2) {
          callback(err2);
        } else {
          api.fetchOrderItems(orders[0]?.id, (err3, items) => {
            if (err3) {
              callback(err3);
            } else {
              callback(null, { user, orders, items });
            }
          });
        }
      });
    }
  });
}

// --- Desafio integrador -----------------------------------------------------------

// test: node --test --test-name-pattern="processOrdersCallback" exercises/01-javascript-core/unit-18-callbacks/exercises.test.js
export function processOrdersCallback(orders, validateCb, saveCb, callback) {
  throw new Error("not implemented: processOrdersCallback");
}
