import { test } from "node:test";
import assert from "node:assert/strict";

import {
  delayAsync,
  safeDivideAsync,
  fetchUserByIdAsync,
  sumAsyncValues,
  tryCatchDivide,
  convertThenChainToAsync,
  fetchWithRetryAsync,
  sequentialAsyncMap,
  asyncPipeline,
  asyncTimeout,
  asyncReduceTotal,
  safeAsyncWrapper,
  fixMissingAwaitBug,
  fixTryCatchScopeBug,
  refactorPromiseChainToAsync,
  processOrdersAsync,
} from "./exercises.js";

// --- delayAsync ------------------------------------------------------------------

test("delayAsync: resolve com o valor após o atraso", async () => {
  const result = await delayAsync(10, "ok");
  assert.equal(result, "ok");
});

// --- safeDivideAsync -----------------------------------------------------------------

test("safeDivideAsync: divide dois números", async () => {
  const result = await safeDivideAsync(10, 2);
  assert.equal(result, 5);
});

test("safeDivideAsync: lança erro ao dividir por zero", async () => {
  await assert.rejects(() => safeDivideAsync(10, 0), /zero/i);
});

// --- fetchUserByIdAsync --------------------------------------------------------------

test("fetchUserByIdAsync: encontra usuário existente", async () => {
  const users = [
    { id: 1, name: "Ana" },
    { id: 2, name: "Bruno" },
  ];
  const user = await fetchUserByIdAsync(2, users);
  assert.deepEqual(user, { id: 2, name: "Bruno" });
});

test("fetchUserByIdAsync: lança erro quando usuário não existe", async () => {
  await assert.rejects(() => fetchUserByIdAsync(99, []), Error);
});

// --- sumAsyncValues ------------------------------------------------------------------

test("sumAsyncValues: soma um array de promises", async () => {
  const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
  const total = await sumAsyncValues(promises);
  assert.equal(total, 6);
});

test("sumAsyncValues: array vazio soma zero", async () => {
  const total = await sumAsyncValues([]);
  assert.equal(total, 0);
});

// --- tryCatchDivide ------------------------------------------------------------------

test("tryCatchDivide: retorna {ok:true, value} em caso de sucesso", async () => {
  const result = await tryCatchDivide(10, 5);
  assert.deepEqual(result, { ok: true, value: 2 });
});

test("tryCatchDivide: retorna {ok:false, error} em caso de falha", async () => {
  const result = await tryCatchDivide(10, 0);
  assert.equal(result.ok, false);
  assert.match(result.error, /zero/i);
});

// --- convertThenChainToAsync -----------------------------------------------------------

test("convertThenChainToAsync: dobra e depois eleva ao quadrado usando await", async () => {
  const result = await convertThenChainToAsync(Promise.resolve(3));
  assert.equal(result, 36);
});

// --- fetchWithRetryAsync ---------------------------------------------------------------

test("fetchWithRetryAsync: tenta novamente até obter sucesso", async () => {
  let attempts = 0;
  const flaky = async () => {
    attempts += 1;
    if (attempts < 3) throw new Error("tente de novo");
    return "sucesso";
  };
  const result = await fetchWithRetryAsync(flaky, 5);
  assert.equal(result, "sucesso");
  assert.equal(attempts, 3);
});

test("fetchWithRetryAsync: propaga o erro da última tentativa", async () => {
  const alwaysFails = async () => {
    throw new Error("sempre falha");
  };
  await assert.rejects(() => fetchWithRetryAsync(alwaysFails, 3), /sempre falha/);
});

// --- sequentialAsyncMap ----------------------------------------------------------------

test("sequentialAsyncMap: processa itens em série mantendo a ordem", async () => {
  const order = [];
  const double = async (item) => {
    await delayAsyncHelper(0);
    order.push(item);
    return item * 2;
  };
  const results = await sequentialAsyncMap([1, 2, 3], double);
  assert.deepEqual(results, [2, 4, 6]);
  assert.deepEqual(order, [1, 2, 3]);
});

function delayAsyncHelper(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- asyncPipeline ---------------------------------------------------------------------

test("asyncPipeline: encadeia busca de usuário e pedidos com await", async () => {
  const fetchUserAsyncFn = async (id) => ({ id, name: "Ana" });
  const fetchOrdersAsyncFn = async (userId) => [{ id: 1, userId }];

  const result = await asyncPipeline(7, fetchUserAsyncFn, fetchOrdersAsyncFn);
  assert.deepEqual(result, {
    user: { id: 7, name: "Ana" },
    orders: [{ id: 1, userId: 7 }],
  });
});

// --- asyncTimeout ----------------------------------------------------------------------

test("asyncTimeout: resolve normalmente quando termina a tempo", async () => {
  const fast = delayAsyncHelper(5).then(() => "rápido");
  const result = await asyncTimeout(fast, 50);
  assert.equal(result, "rápido");
});

test("asyncTimeout: lança erro de timeout quando demora demais", async () => {
  const slow = delayAsyncHelper(100).then(() => "tarde");
  await assert.rejects(() => asyncTimeout(slow, 10), /timeout/i);
});

// --- asyncReduceTotal ------------------------------------------------------------------

test("asyncReduceTotal: acumula um total percorrendo os itens com await", async () => {
  const getAmount = async (order) => order.amount;
  const total = await asyncReduceTotal(
    [{ amount: 10 }, { amount: 20 }, { amount: 30 }],
    getAmount,
  );
  assert.equal(total, 60);
});

// --- safeAsyncWrapper ------------------------------------------------------------------

test("safeAsyncWrapper: retorna {ok:true, value} em caso de sucesso", async () => {
  const risky = async (n) => {
    if (n < 0) throw new Error("negativo");
    return n * 2;
  };
  const wrapped = safeAsyncWrapper(risky);
  const result = await wrapped(5);
  assert.deepEqual(result, { ok: true, value: 10 });
});

test("safeAsyncWrapper: retorna {ok:false, error} em caso de falha", async () => {
  const risky = async (n) => {
    if (n < 0) throw new Error("negativo");
    return n * 2;
  };
  const wrapped = safeAsyncWrapper(risky);
  const result = await wrapped(-1);
  assert.equal(result.ok, false);
  assert.equal(result.error, "negativo");
});

// --- fixMissingAwaitBug ----------------------------------------------------------------

test("fixMissingAwaitBug: o campo user já vem resolvido, não como Promise pendente", async () => {
  const users = [{ id: 1, name: "Ana" }];
  const result = await fixMissingAwaitBug(1, users);
  assert.equal(result.user.name, "Ana");
  assert.equal(typeof result.fetchedAt, "number");
});

// --- fixTryCatchScopeBug ----------------------------------------------------------------

test("fixTryCatchScopeBug: captura o erro de divisão por zero corretamente", async () => {
  const result = await fixTryCatchScopeBug(10, 0);
  assert.deepEqual(result, { ok: false, error: "divisão por zero" });
});

test("fixTryCatchScopeBug: retorna sucesso quando a divisão é válida", async () => {
  const result = await fixTryCatchScopeBug(10, 2);
  assert.deepEqual(result, { ok: true, value: 5 });
});

// --- refactorPromiseChainToAsync ---------------------------------------------------------

test("refactorPromiseChainToAsync: mantém o comportamento em caso de sucesso", async () => {
  const api = {
    fetchUser: (id) => Promise.resolve({ id, name: "Ana" }),
    fetchOrders: (userId) => Promise.resolve([{ id: 1, userId }]),
  };
  const result = await refactorPromiseChainToAsync(1, api);
  assert.deepEqual(result, {
    user: { id: 1, name: "Ana" },
    orders: [{ id: 1, userId: 1 }],
  });
});

test("refactorPromiseChainToAsync: mantém o comportamento em caso de erro", async () => {
  const api = {
    fetchUser: () => Promise.reject(new Error("usuário não encontrado")),
    fetchOrders: () => Promise.reject(new Error("não deveria ser chamado")),
  };
  const result = await refactorPromiseChainToAsync(1, api);
  assert.deepEqual(result, { error: "usuário não encontrado" });
});

// --- processOrdersAsync -----------------------------------------------------------------

test("processOrdersAsync: valida, salva em série e resume os pedidos", async () => {
  const orders = [
    { id: 1, amount: 100 },
    { id: 2, amount: -10 },
    { id: 3, amount: 50 },
  ];
  const validateAsyncFn = async (order) => order.amount > 0;
  const saveAsyncFn = async (order) => ({ ...order, status: "saved" });

  const result = await processOrdersAsync(orders, validateAsyncFn, saveAsyncFn);

  assert.deepEqual(result, {
    saved: [
      { id: 1, amount: 100, status: "saved" },
      { id: 3, amount: 50, status: "saved" },
    ],
    invalid: [2],
    totalRevenue: 150,
  });
});

test("processOrdersAsync: propaga erro vindo de saveAsyncFn", async () => {
  const orders = [{ id: 1, amount: 100 }];
  const validateAsyncFn = async () => true;
  const saveAsyncFn = async () => {
    throw new Error("falha ao salvar");
  };

  await assert.rejects(
    () => processOrdersAsync(orders, validateAsyncFn, saveAsyncFn),
    /falha ao salvar/,
  );
});
