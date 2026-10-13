import { test } from "node:test";
import assert from "node:assert/strict";
import { promisify } from "node:util";

import {
  delayCallback,
  safeDivideCallback,
  fetchUserByIdCallback,
  validatePositiveCallback,
  mapSeriesCallback,
  parallelCallback,
  waterfallCallback,
  retryCallback,
  timeoutCallback,
  cacheCallback,
  seriesUntilCallback,
  composeUserOrdersCallback,
  fixDoubleCallbackBug,
  fixSwallowedErrorCallback,
  refactorCallbackPyramid,
  processOrdersCallback,
} from "./exercises.js";

// util.promisify funciona com qualquer função "error-first callback" cujo
// último parâmetro seja `callback(err, result)`. Usamos aqui para poder
// escrever os testes com `await` em vez de aninhar callbacks.

// --- delayCallback -----------------------------------------------------------

test("delayCallback: resolve com o valor após o atraso", async () => {
  const result = await promisify(delayCallback)(10, "ok");
  assert.equal(result, "ok");
});

// --- safeDivideCallback --------------------------------------------------------

test("safeDivideCallback: divide dois números", async () => {
  const result = await promisify(safeDivideCallback)(10, 2);
  assert.equal(result, 5);
});

test("safeDivideCallback: erro ao dividir por zero", async () => {
  await assert.rejects(() => promisify(safeDivideCallback)(10, 0), /zero/i);
});

// --- fetchUserByIdCallback ----------------------------------------------------

test("fetchUserByIdCallback: encontra usuário existente", async () => {
  const users = [
    { id: 1, name: "Ana" },
    { id: 2, name: "Bruno" },
  ];
  const user = await promisify(fetchUserByIdCallback)(2, users);
  assert.deepEqual(user, { id: 2, name: "Bruno" });
});

test("fetchUserByIdCallback: erro quando usuário não existe", async () => {
  await assert.rejects(() => promisify(fetchUserByIdCallback)(99, []), Error);
});

// --- validatePositiveCallback --------------------------------------------------

test("validatePositiveCallback: aceita número positivo", async () => {
  const result = await promisify(validatePositiveCallback)(5);
  assert.equal(result, 5);
});

test("validatePositiveCallback: rejeita número não positivo", async () => {
  await assert.rejects(() => promisify(validatePositiveCallback)(0), Error);
  await assert.rejects(() => promisify(validatePositiveCallback)(-3), Error);
});

// --- mapSeriesCallback ---------------------------------------------------------

test("mapSeriesCallback: aplica função assíncrona em série mantendo a ordem", async () => {
  const order = [];
  const double = (item, cb) => {
    setTimeout(() => {
      order.push(item);
      cb(null, item * 2);
    }, 0);
  };
  const results = await promisify(mapSeriesCallback)([1, 2, 3], double);
  assert.deepEqual(results, [2, 4, 6]);
  assert.deepEqual(order, [1, 2, 3]);
});

test("mapSeriesCallback: para no primeiro erro", async () => {
  const fn = (item, cb) => {
    setTimeout(() => (item === 2 ? cb(new Error("falhou em 2")) : cb(null, item)), 0);
  };
  await assert.rejects(() => promisify(mapSeriesCallback)([1, 2, 3], fn), /falhou em 2/);
});

// --- parallelCallback -----------------------------------------------------------

test("parallelCallback: executa tarefas em paralelo preservando a ordem dos resultados", async () => {
  const task = (value, ms) => (cb) => setTimeout(() => cb(null, value), ms);
  const tasks = [task("a", 30), task("b", 5), task("c", 15)];
  const results = await promisify(parallelCallback)(tasks);
  assert.deepEqual(results, ["a", "b", "c"]);
});

test("parallelCallback: propaga o primeiro erro encontrado", async () => {
  const ok = (cb) => setTimeout(() => cb(null, "ok"), 5);
  const bad = (cb) => setTimeout(() => cb(new Error("ruim")), 5);
  await assert.rejects(() => promisify(parallelCallback)([ok, bad]), /ruim/);
});

// --- waterfallCallback -----------------------------------------------------------

test("waterfallCallback: encadeia tarefas passando o resultado adiante", async () => {
  const tasks = [
    (cb) => cb(null, 2),
    (prev, cb) => cb(null, prev + 3),
    (prev, cb) => cb(null, prev * 10),
  ];
  const result = await promisify(waterfallCallback)(tasks);
  assert.equal(result, 50);
});

// --- retryCallback -----------------------------------------------------------------

test("retryCallback: tenta novamente até obter sucesso", async () => {
  let attempts = 0;
  const flaky = (cb) => {
    attempts += 1;
    if (attempts < 3) {
      cb(new Error("tente de novo"));
    } else {
      cb(null, "sucesso");
    }
  };
  const result = await promisify(retryCallback)(flaky, 5);
  assert.equal(result, "sucesso");
  assert.equal(attempts, 3);
});

test("retryCallback: desiste após esgotar as tentativas", async () => {
  const alwaysFails = (cb) => cb(new Error("sempre falha"));
  await assert.rejects(() => promisify(retryCallback)(alwaysFails, 3), /sempre falha/);
});

// --- timeoutCallback ---------------------------------------------------------------

test("timeoutCallback: retorna o resultado quando a tarefa termina a tempo", async () => {
  const fast = (cb) => setTimeout(() => cb(null, "rápido"), 5);
  const result = await promisify(timeoutCallback)(fast, 50);
  assert.equal(result, "rápido");
});

test("timeoutCallback: erro de timeout quando a tarefa demora demais", async () => {
  const slow = (cb) => setTimeout(() => cb(null, "tarde demais"), 100);
  await assert.rejects(() => promisify(timeoutCallback)(slow, 10), /timeout/i);
});

// --- cacheCallback -----------------------------------------------------------------

test("cacheCallback: chama a função original só na primeira vez por chave", async () => {
  let calls = 0;
  const fn = (key, cb) => {
    calls += 1;
    setTimeout(() => cb(null, `valor-${key}`), 5);
  };
  const cached = cacheCallback(fn);
  const cachedAsync = promisify(cached);

  const first = await cachedAsync("x");
  const second = await cachedAsync("x");
  const other = await cachedAsync("y");

  assert.equal(first, "valor-x");
  assert.equal(second, "valor-x");
  assert.equal(other, "valor-y");
  assert.equal(calls, 2);
});

// --- seriesUntilCallback -------------------------------------------------------------

test("seriesUntilCallback: retorna o primeiro item que satisfaz o predicado", async () => {
  const isEven = (item, cb) => setTimeout(() => cb(null, item % 2 === 0), 0);
  const result = await promisify(seriesUntilCallback)([1, 3, 4, 5], isEven);
  assert.equal(result, 4);
});

test("seriesUntilCallback: retorna null quando nenhum item satisfaz", async () => {
  const isEven = (item, cb) => setTimeout(() => cb(null, item % 2 === 0), 0);
  const result = await promisify(seriesUntilCallback)([1, 3, 5], isEven);
  assert.equal(result, null);
});

// --- composeUserOrdersCallback ---------------------------------------------------------

test("composeUserOrdersCallback: encadeia busca de usuário e pedidos", async () => {
  const fetchUserCb = (id, cb) => setTimeout(() => cb(null, { id, name: "Ana" }), 0);
  const fetchOrdersCb = (userId, cb) =>
    setTimeout(() => cb(null, [{ id: 1, userId }]), 0);

  const result = await promisify(composeUserOrdersCallback)(
    fetchUserCb,
    fetchOrdersCb,
    7,
  );
  assert.deepEqual(result, {
    user: { id: 7, name: "Ana" },
    orders: [{ id: 1, userId: 7 }],
  });
});

// --- fixDoubleCallbackBug ---------------------------------------------------------------

test("fixDoubleCallbackBug: número positivo chama callback uma única vez com sucesso", async () => {
  const result = await promisify(fixDoubleCallbackBug)(4);
  assert.equal(result, 8);
});

test("fixDoubleCallbackBug: número negativo chama callback uma única vez com erro", async () => {
  let callCount = 0;
  await new Promise((resolve) => {
    fixDoubleCallbackBug(-1, (err, result) => {
      callCount += 1;
      if (callCount === 1) {
        assert.ok(err instanceof Error);
        assert.equal(result, undefined);
      }
      // Se o bug ainda existir, callback é chamado de novo aqui.
      setTimeout(resolve, 20);
    });
  });
  assert.equal(callCount, 1);
});

// --- fixSwallowedErrorCallback -----------------------------------------------------------

test("fixSwallowedErrorCallback: encontra usuário existente", async () => {
  const users = [{ id: 1, name: "Ana" }];
  const user = await promisify(fixSwallowedErrorCallback)(1, users);
  assert.deepEqual(user, { id: 1, name: "Ana" });
});

test("fixSwallowedErrorCallback: reporta erro quando usuário não existe", async () => {
  await assert.rejects(() => promisify(fixSwallowedErrorCallback)(99, []), Error);
});

// --- refactorCallbackPyramid --------------------------------------------------------------

test("refactorCallbackPyramid: mantém o comportamento original ao combinar três APIs", async () => {
  const api = {
    fetchUser: (id, cb) => setTimeout(() => cb(null, { id, name: "Ana" }), 0),
    fetchOrders: (userId, cb) => setTimeout(() => cb(null, [{ id: 100, userId }]), 0),
    fetchOrderItems: (orderId, cb) =>
      setTimeout(() => cb(null, [{ sku: "abc", orderId }]), 0),
  };

  const result = await promisify(refactorCallbackPyramid)(1, api);
  assert.deepEqual(result, {
    user: { id: 1, name: "Ana" },
    orders: [{ id: 100, userId: 1 }],
    items: [{ sku: "abc", orderId: 100 }],
  });
});

test("refactorCallbackPyramid: propaga erro de qualquer etapa da cadeia", async () => {
  const api = {
    fetchUser: (id, cb) => setTimeout(() => cb(new Error("usuário não encontrado")), 0),
    fetchOrders: () => {
      throw new Error("não deveria ser chamado");
    },
    fetchOrderItems: () => {
      throw new Error("não deveria ser chamado");
    },
  };
  await assert.rejects(
    () => promisify(refactorCallbackPyramid)(1, api),
    /usuário não encontrado/,
  );
});

// --- processOrdersCallback ------------------------------------------------------------------

test("processOrdersCallback: valida, salva e resume os pedidos", async () => {
  const orders = [
    { id: 1, amount: 100 },
    { id: 2, amount: -10 },
    { id: 3, amount: 50 },
  ];
  const validateCb = (order, cb) => setTimeout(() => cb(null, order.amount > 0), 0);
  const saveCb = (order, cb) =>
    setTimeout(() => cb(null, { ...order, status: "saved" }), 0);

  const result = await promisify(processOrdersCallback)(orders, validateCb, saveCb);

  assert.deepEqual(result, {
    saved: [
      { id: 1, amount: 100, status: "saved" },
      { id: 3, amount: 50, status: "saved" },
    ],
    invalid: [2],
    totalRevenue: 150,
  });
});

test("processOrdersCallback: propaga erro vindo de saveCb", async () => {
  const orders = [{ id: 1, amount: 100 }];
  const validateCb = (order, cb) => setTimeout(() => cb(null, true), 0);
  const saveCb = (order, cb) => setTimeout(() => cb(new Error("falha ao salvar")), 0);

  await assert.rejects(
    () => promisify(processOrdersCallback)(orders, validateCb, saveCb),
    /falha ao salvar/,
  );
});
