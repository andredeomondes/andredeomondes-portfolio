import { test } from "node:test";
import assert from "node:assert/strict";

import {
  syncBeforeAsync,
  multipleMicrotasksBeforeTimeout,
  demoAsyncSyncPortion,
  delay,
  queueMicrotaskOrder,
  microtaskBeforeQueuedTimeout,
  runTasksSequentially,
  timeoutOrder,
  nextTickBeforeTimeout,
  chainedThenOrder,
  timeoutFallback,
  batchMicrotaskFlood,
  raceAgainstTimeoutBuggy,
  flushOrderBuggy,
  pollUntilReadyMessy,
  processQueueWithConcurrencyLimit,
} from "./exercises.js";

// --- syncBeforeAsync ----------------------------------------------------------

test("syncBeforeAsync: código síncrono roda antes de microtask e macrotask", async () => {
  const order = await syncBeforeAsync();
  assert.deepEqual(order, ["sync-start", "sync-end", "microtask", "timeout"]);
});

// --- multipleMicrotasksBeforeTimeout -------------------------------------------

test("multipleMicrotasksBeforeTimeout: todas as microtasks rodam antes do timeout", async () => {
  const order = await multipleMicrotasksBeforeTimeout();
  assert.deepEqual(order, ["micro-1", "micro-2", "micro-3", "timeout"]);
});

// --- demoAsyncSyncPortion -------------------------------------------------------

test("demoAsyncSyncPortion: função async roda de forma síncrona até o primeiro await", async () => {
  const log = await demoAsyncSyncPortion();
  assert.deepEqual(log, ["inner-start", "after-call", "inner-end"]);
});

// --- delay ------------------------------------------------------------------------

test("delay: resolve com o valor após o tempo informado", async () => {
  const result = await delay(5, "ok");
  assert.equal(result, "ok");
});

test("delay: é assíncrono (não resolve antes do código síncrono seguinte rodar)", async () => {
  const order = [];
  const promise = delay(0, "done").then(() => order.push("resolved"));
  order.push("sync-after-call");
  await promise;
  assert.deepEqual(order, ["sync-after-call", "resolved"]);
});

// --- queueMicrotaskOrder ----------------------------------------------------------

test("queueMicrotaskOrder: microtasks agendadas com queueMicrotask rodam em ordem FIFO", async () => {
  const order = await queueMicrotaskOrder();
  assert.deepEqual(order, ["first", "second"]);
});

// --- microtaskBeforeQueuedTimeout --------------------------------------------------

test("microtaskBeforeQueuedTimeout: queueMicrotask e Promise.then rodam antes do timeout, em ordem de agendamento", async () => {
  const order = await microtaskBeforeQueuedTimeout();
  assert.deepEqual(order, ["qm", "promise", "timeout"]);
});

// --- runTasksSequentially -----------------------------------------------------------

test("runTasksSequentially: executa tarefas uma de cada vez, na ordem, não em paralelo", async () => {
  const startedOrder = [];
  const makeTask = (id, ms) => async () => {
    startedOrder.push(`start-${id}`);
    await delay(ms, null);
    startedOrder.push(`end-${id}`);
    return id;
  };
  const tasks = [makeTask("a", 5), makeTask("b", 1), makeTask("c", 1)];
  const results = await runTasksSequentially(tasks);
  assert.deepEqual(results, ["a", "b", "c"]);
  // Se fossem executadas em paralelo, "start-b" e "start-c" apareceriam
  // antes de "end-a" (já que "a" tem o maior atraso).
  assert.deepEqual(startedOrder, [
    "start-a",
    "end-a",
    "start-b",
    "end-b",
    "start-c",
    "end-c",
  ]);
});

// --- timeoutOrder ---------------------------------------------------------------------

test("timeoutOrder: retorna os índices na ordem em que os timeouts disparam", async () => {
  const order = await timeoutOrder([30, 5, 15]);
  assert.deepEqual(order, [1, 2, 0]);
});

// --- nextTickBeforeTimeout ------------------------------------------------------------

test("nextTickBeforeTimeout: process.nextTick roda antes de qualquer macrotask (setTimeout)", async () => {
  const order = await nextTickBeforeTimeout();
  assert.deepEqual(order, ["next-tick", "timeout"]);
});

// --- chainedThenOrder ---------------------------------------------------------------------

test("chainedThenOrder: uma cadeia de .then() inteira roda antes de um timeout agendado antes dela", async () => {
  const order = await chainedThenOrder();
  assert.deepEqual(order, ["then-1", "then-2", "then-3", "timeout"]);
});

// --- timeoutFallback ------------------------------------------------------------------------

test("timeoutFallback: retorna o valor da promise quando ela resolve antes do timeout", async () => {
  const result = await timeoutFallback(delay(1, "fast"), 50, "fallback");
  assert.equal(result, "fast");
});

test("timeoutFallback: retorna o valor de fallback quando o timeout vence", async () => {
  const neverResolves = new Promise(() => {});
  const result = await timeoutFallback(neverResolves, 5, "fallback");
  assert.equal(result, "fallback");
});

// --- batchMicrotaskFlood --------------------------------------------------------------------

test("batchMicrotaskFlood: todas as microtasks agendadas em massa rodam antes do timeout único", async () => {
  const order = await batchMicrotaskFlood(5);
  assert.deepEqual(order, [
    "micro-0",
    "micro-1",
    "micro-2",
    "micro-3",
    "micro-4",
    "timeout",
  ]);
});

// --- raceAgainstTimeoutBuggy -----------------------------------------------------------------

test("raceAgainstTimeoutBuggy: rejeita quando a promise demora mais que o timeout", async () => {
  const neverResolves = new Promise(() => {});
  await assert.rejects(() => raceAgainstTimeoutBuggy(neverResolves, 5));
});

test("raceAgainstTimeoutBuggy: resolve com o valor da promise quando ela vence a corrida", async () => {
  const result = await raceAgainstTimeoutBuggy(delay(1, "winner"), 50);
  assert.equal(result, "winner");
});

// --- flushOrderBuggy -----------------------------------------------------------------------

test("flushOrderBuggy: microtask sempre roda antes de qualquer macrotask", async () => {
  const order = await flushOrderBuggy();
  assert.deepEqual(order, ["sync", "microtask", "timeout"]);
});

// --- pollUntilReadyMessy -------------------------------------------------------------------

test("pollUntilReadyMessy: resolve true assim que checkFn retorna true", async () => {
  let calls = 0;
  const checkFn = () => {
    calls += 1;
    return calls >= 3;
  };
  const result = await pollUntilReadyMessy(checkFn, 1, 10);
  assert.equal(result, true);
  assert.equal(calls, 3);
});

test("pollUntilReadyMessy: rejeita ao atingir o número máximo de tentativas", async () => {
  const checkFn = () => false;
  await assert.rejects(() => pollUntilReadyMessy(checkFn, 1, 3));
});

// --- processQueueWithConcurrencyLimit --------------------------------------------------------

test("processQueueWithConcurrencyLimit: retorna resultados na ordem original dos itens", async () => {
  const items = [3, 1, 4, 1, 5, 9, 2];
  const worker = async (n) => {
    await delay(n % 3, null);
    return n * 10;
  };
  const results = await processQueueWithConcurrencyLimit(items, worker, 2);
  assert.deepEqual(results, [30, 10, 40, 10, 50, 90, 20]);
});

test("processQueueWithConcurrencyLimit: nunca executa mais que `limit` tarefas ao mesmo tempo", async () => {
  const items = [1, 2, 3, 4, 5, 6];
  let inFlight = 0;
  let maxInFlight = 0;
  const worker = async (n) => {
    inFlight += 1;
    maxInFlight = Math.max(maxInFlight, inFlight);
    await delay(3, null);
    inFlight -= 1;
    return n;
  };
  const results = await processQueueWithConcurrencyLimit(items, worker, 2);
  assert.deepEqual(results, items);
  assert.ok(
    maxInFlight <= 2,
    `esperava no máximo 2 tarefas simultâneas, obteve ${maxInFlight}`,
  );
});
