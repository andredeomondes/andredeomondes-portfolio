import { test } from "node:test";
import assert from "node:assert/strict";

import {
  delayPromise,
  safeDividePromise,
  fetchUserByIdPromise,
  resolveOrDefault,
  chainDoubleThenSquare,
  tapPromise,
  finallyCleanup,
  promiseFromCallback,
  chainUserThenOrders,
  retryPromise,
  timeoutPromise,
  sequentialReduce,
  fixMissingReturnInChain,
  fixUnhandledRejectionSwallow,
  refactorPromiseHell,
  processOrdersPromise,
} from "./exercises.js";

// --- delayPromise --------------------------------------------------------------

test("delayPromise: resolve com o valor após o atraso", async () => {
  const result = await delayPromise(10, "ok");
  assert.equal(result, "ok");
});

// --- safeDividePromise -----------------------------------------------------------

test("safeDividePromise: divide dois números", async () => {
  const result = await safeDividePromise(10, 2);
  assert.equal(result, 5);
});

test("safeDividePromise: rejeita ao dividir por zero", async () => {
  await assert.rejects(() => safeDividePromise(10, 0), /zero/i);
});

// --- fetchUserByIdPromise -----------------------------------------------------------

test("fetchUserByIdPromise: encontra usuário existente", async () => {
  const users = [
    { id: 1, name: "Ana" },
    { id: 2, name: "Bruno" },
  ];
  const user = await fetchUserByIdPromise(2, users);
  assert.deepEqual(user, { id: 2, name: "Bruno" });
});

test("fetchUserByIdPromise: rejeita quando usuário não existe", async () => {
  await assert.rejects(() => fetchUserByIdPromise(99, []), Error);
});

// --- resolveOrDefault -----------------------------------------------------------------

test("resolveOrDefault: retorna o valor quando a promise resolve", async () => {
  const result = await resolveOrDefault(Promise.resolve(42), 0);
  assert.equal(result, 42);
});

test("resolveOrDefault: aceita um valor puro (não-promise)", async () => {
  const result = await resolveOrDefault(42, 0);
  assert.equal(result, 42);
});

test("resolveOrDefault: retorna o default quando a promise rejeita", async () => {
  const result = await resolveOrDefault(Promise.reject(new Error("falhou")), "default");
  assert.equal(result, "default");
});

// --- chainDoubleThenSquare -----------------------------------------------------------

test("chainDoubleThenSquare: dobra e depois eleva ao quadrado", async () => {
  const result = await chainDoubleThenSquare(Promise.resolve(3));
  assert.equal(result, 36); // (3 * 2) ** 2
});

// --- tapPromise ------------------------------------------------------------------------

test("tapPromise: executa efeito colateral sem alterar o valor resolvido", async () => {
  const seen = [];
  const result = await tapPromise(Promise.resolve(10), (value) => seen.push(value));
  assert.equal(result, 10);
  assert.deepEqual(seen, [10]);
});

// --- finallyCleanup --------------------------------------------------------------------

test("finallyCleanup: executa cleanup e resolve com o valor original em caso de sucesso", async () => {
  let cleaned = false;
  const result = await finallyCleanup(Promise.resolve("valor"), () => {
    cleaned = true;
  });
  assert.equal(result, "valor");
  assert.equal(cleaned, true);
});

test("finallyCleanup: executa cleanup e propaga o erro original em caso de falha", async () => {
  let cleaned = false;
  await assert.rejects(
    () =>
      finallyCleanup(Promise.reject(new Error("falhou")), () => {
        cleaned = true;
      }),
    /falhou/,
  );
  assert.equal(cleaned, true);
});

// --- promiseFromCallback ---------------------------------------------------------------

test("promiseFromCallback: converte uma função error-first callback em Promise", async () => {
  const readValue = (value, cb) => setTimeout(() => cb(null, value), 5);
  const result = await promiseFromCallback(readValue, "convertido");
  assert.equal(result, "convertido");
});

test("promiseFromCallback: rejeita quando o callback recebe erro", async () => {
  const alwaysFails = (cb) => setTimeout(() => cb(new Error("callback falhou")), 5);
  await assert.rejects(() => promiseFromCallback(alwaysFails), /callback falhou/);
});

// --- chainUserThenOrders ---------------------------------------------------------------

test("chainUserThenOrders: encadeia busca de usuário e pedidos", async () => {
  const fetchUserPromiseFn = (id) => Promise.resolve({ id, name: "Ana" });
  const fetchOrdersPromiseFn = (userId) => Promise.resolve([{ id: 1, userId }]);

  const result = await chainUserThenOrders(fetchUserPromiseFn, fetchOrdersPromiseFn, 7);
  assert.deepEqual(result, {
    user: { id: 7, name: "Ana" },
    orders: [{ id: 1, userId: 7 }],
  });
});

// --- retryPromise ----------------------------------------------------------------------

test("retryPromise: tenta novamente até obter sucesso", async () => {
  let attempts = 0;
  const flaky = () => {
    attempts += 1;
    return attempts < 3
      ? Promise.reject(new Error("tente de novo"))
      : Promise.resolve("sucesso");
  };
  const result = await retryPromise(flaky, 5);
  assert.equal(result, "sucesso");
  assert.equal(attempts, 3);
});

test("retryPromise: rejeita com o erro da última tentativa", async () => {
  const alwaysFails = () => Promise.reject(new Error("sempre falha"));
  await assert.rejects(() => retryPromise(alwaysFails, 3), /sempre falha/);
});

// --- timeoutPromise --------------------------------------------------------------------

test("timeoutPromise: resolve normalmente quando termina a tempo", async () => {
  const fast = new Promise((resolve) => setTimeout(() => resolve("rápido"), 5));
  const result = await timeoutPromise(fast, 50);
  assert.equal(result, "rápido");
});

test("timeoutPromise: rejeita com erro de timeout quando demora demais", async () => {
  const slow = new Promise((resolve) => setTimeout(() => resolve("tarde"), 100));
  await assert.rejects(() => timeoutPromise(slow, 10), /timeout/i);
});

// --- sequentialReduce ------------------------------------------------------------------

test("sequentialReduce: processa itens em série mantendo a ordem", async () => {
  const order = [];
  const double = (item) =>
    new Promise((resolve) =>
      setTimeout(() => {
        order.push(item);
        resolve(item * 2);
      }, 0),
    );
  const results = await sequentialReduce([1, 2, 3], double);
  assert.deepEqual(results, [2, 4, 6]);
  assert.deepEqual(order, [1, 2, 3]);
});

// --- fixMissingReturnInChain -----------------------------------------------------------

test("fixMissingReturnInChain: espera fetchOrders terminar e retorna o resultado combinado", async () => {
  const api = {
    fetchUser: (id) => Promise.resolve({ id, name: "Ana" }),
    fetchOrders: (userId) =>
      new Promise((resolve) => setTimeout(() => resolve([{ id: 1, userId }]), 20)),
  };
  const result = await fixMissingReturnInChain(1, api);
  assert.deepEqual(result, {
    user: { id: 1, name: "Ana" },
    orders: [{ id: 1, userId: 1 }],
  });
});

// --- fixUnhandledRejectionSwallow -------------------------------------------------------

test("fixUnhandledRejectionSwallow: propaga o erro original em vez de engoli-lo", async () => {
  await assert.rejects(
    () => fixUnhandledRejectionSwallow(Promise.reject(new Error("erro original"))),
    /erro original/,
  );
});

test("fixUnhandledRejectionSwallow: resolve normalmente quando não há erro", async () => {
  const result = await fixUnhandledRejectionSwallow(Promise.resolve("ok"));
  assert.equal(result, "ok");
});

// --- refactorPromiseHell ----------------------------------------------------------------

test("refactorPromiseHell: mantém o comportamento original ao combinar três APIs", async () => {
  const api = {
    fetchUser: (id) => Promise.resolve({ id, name: "Ana" }),
    fetchOrders: (userId) => Promise.resolve([{ id: 100, userId }]),
    fetchOrderItems: (orderId) => Promise.resolve([{ sku: "abc", orderId }]),
  };
  const result = await refactorPromiseHell(1, api);
  assert.deepEqual(result, {
    user: { id: 1, name: "Ana" },
    orders: [{ id: 100, userId: 1 }],
    items: [{ sku: "abc", orderId: 100 }],
  });
});

test("refactorPromiseHell: propaga rejeição de qualquer etapa", async () => {
  const api = {
    fetchUser: () => Promise.reject(new Error("usuário não encontrado")),
    fetchOrders: () => Promise.reject(new Error("não deveria ser chamado")),
    fetchOrderItems: () => Promise.reject(new Error("não deveria ser chamado")),
  };
  await assert.rejects(() => refactorPromiseHell(1, api), /usuário não encontrado/);
});

// --- processOrdersPromise ---------------------------------------------------------------

test("processOrdersPromise: valida, salva em série e resume os pedidos", async () => {
  const orders = [
    { id: 1, amount: 100 },
    { id: 2, amount: -10 },
    { id: 3, amount: 50 },
  ];
  const validateFn = (order) => order.amount > 0;
  const savePromiseFn = (order) => Promise.resolve({ ...order, status: "saved" });

  const result = await processOrdersPromise(orders, validateFn, savePromiseFn);

  assert.deepEqual(result, {
    saved: [
      { id: 1, amount: 100, status: "saved" },
      { id: 3, amount: 50, status: "saved" },
    ],
    invalid: [2],
    totalRevenue: 150,
  });
});

test("processOrdersPromise: propaga rejeição vinda de savePromiseFn", async () => {
  const orders = [{ id: 1, amount: 100 }];
  const validateFn = () => true;
  const savePromiseFn = () => Promise.reject(new Error("falha ao salvar"));

  await assert.rejects(
    () => processOrdersPromise(orders, validateFn, savePromiseFn),
    /falha ao salvar/,
  );
});
