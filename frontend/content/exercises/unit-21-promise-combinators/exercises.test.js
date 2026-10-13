import { test } from "node:test";
import assert from "node:assert/strict";

import {
  fetchAllUsersAll,
  fetchAllUsersSettled,
  firstToRespond,
  firstSuccessful,
  summarizeSettled,
  allWithIndex,
  raceWithTimeout,
  anyWithFallback,
  batchProcessAll,
  allSettledPartitionErrors,
  raceMultipleSources,
  anyOfValidations,
  fixPromiseAllFailFastBug,
  fixRaceWinnerIndexBug,
  refactorSequentialToParallelAll,
  loadDashboardData,
} from "./exercises.js";

function delayValue(value, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function delayReject(message, ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
}

// --- fetchAllUsersAll --------------------------------------------------------------

test("fetchAllUsersAll: resolve com todos os usuários quando tudo dá certo", async () => {
  const fetchUserAsyncFn = async (id) => ({ id, name: `Usuário ${id}` });
  const result = await fetchAllUsersAll([1, 2, 3], fetchUserAsyncFn);
  assert.deepEqual(result, [
    { id: 1, name: "Usuário 1" },
    { id: 2, name: "Usuário 2" },
    { id: 3, name: "Usuário 3" },
  ]);
});

test("fetchAllUsersAll: rejeita se qualquer busca falhar", async () => {
  const fetchUserAsyncFn = async (id) => {
    if (id === 2) throw new Error("usuário 2 não encontrado");
    return { id };
  };
  await assert.rejects(
    () => fetchAllUsersAll([1, 2, 3], fetchUserAsyncFn),
    /não encontrado/,
  );
});

// --- fetchAllUsersSettled -----------------------------------------------------------

test("fetchAllUsersSettled: resolve com o status de cada busca, sem falhar rápido", async () => {
  const fetchUserAsyncFn = async (id) => {
    if (id === 2) throw new Error("usuário 2 não encontrado");
    return { id };
  };
  const result = await fetchAllUsersSettled([1, 2, 3], fetchUserAsyncFn);
  assert.equal(result.length, 3);
  assert.equal(result[0].status, "fulfilled");
  assert.deepEqual(result[0].value, { id: 1 });
  assert.equal(result[1].status, "rejected");
  assert.match(result[1].reason.message, /não encontrado/);
  assert.equal(result[2].status, "fulfilled");
});

// --- firstToRespond ------------------------------------------------------------------

test("firstToRespond: resolve com o valor da promise mais rápida", async () => {
  const result = await firstToRespond([delayValue("lento", 40), delayValue("rápido", 5)]);
  assert.equal(result, "rápido");
});

test("firstToRespond: rejeita se a mais rápida for uma rejeição", async () => {
  await assert.rejects(
    () => firstToRespond([delayReject("falhou rápido", 5), delayValue("lento", 40)]),
    /falhou rápido/,
  );
});

// --- firstSuccessful -----------------------------------------------------------------

test("firstSuccessful: resolve com o primeiro sucesso, ignorando rejeições mais rápidas", async () => {
  const result = await firstSuccessful([
    delayReject("falhou rápido", 5),
    delayValue("sucesso", 20),
  ]);
  assert.equal(result, "sucesso");
});

test("firstSuccessful: rejeita quando todas falham", async () => {
  await assert.rejects(() =>
    firstSuccessful([delayReject("erro 1", 5), delayReject("erro 2", 10)]),
  );
});

// --- summarizeSettled ------------------------------------------------------------------

test("summarizeSettled: separa valores cumpridos de motivos de rejeição", () => {
  const results = [
    { status: "fulfilled", value: 1 },
    { status: "rejected", reason: new Error("falhou") },
    { status: "fulfilled", value: 3 },
  ];
  const summary = summarizeSettled(results);
  assert.deepEqual(summary.fulfilled, [1, 3]);
  assert.equal(summary.rejected.length, 1);
  assert.equal(summary.rejected[0], "falhou");
});

// --- allWithIndex --------------------------------------------------------------------

test("allWithIndex: retorna valores junto com o índice original", async () => {
  const result = await allWithIndex([
    delayValue("a", 10),
    delayValue("b", 0),
    delayValue("c", 5),
  ]);
  assert.deepEqual(result, [
    { index: 0, value: "a" },
    { index: 1, value: "b" },
    { index: 2, value: "c" },
  ]);
});

// --- raceWithTimeout -------------------------------------------------------------------

test("raceWithTimeout: resolve normalmente quando termina a tempo", async () => {
  const result = await raceWithTimeout(delayValue("ok", 5), 50);
  assert.equal(result, "ok");
});

test("raceWithTimeout: rejeita com erro de timeout quando demora demais", async () => {
  await assert.rejects(() => raceWithTimeout(delayValue("tarde", 100), 10), /timeout/i);
});

// --- anyWithFallback -------------------------------------------------------------------

test("anyWithFallback: resolve com o primeiro sucesso", async () => {
  const result = await anyWithFallback(
    [delayReject("falhou", 5), delayValue("sucesso", 15)],
    "fallback",
  );
  assert.equal(result, "sucesso");
});

test("anyWithFallback: retorna o valor de fallback quando todas falham", async () => {
  const result = await anyWithFallback(
    [delayReject("erro 1", 5), delayReject("erro 2", 5)],
    "fallback",
  );
  assert.equal(result, "fallback");
});

// --- batchProcessAll -------------------------------------------------------------------

test("batchProcessAll: processa itens em lotes preservando a ordem", async () => {
  const active = [];
  let maxConcurrent = 0;
  const asyncFn = async (item) => {
    active.push(item);
    maxConcurrent = Math.max(maxConcurrent, active.length);
    await delayValue(null, 10);
    active.splice(active.indexOf(item), 1);
    return item * 2;
  };
  const results = await batchProcessAll([1, 2, 3, 4, 5], asyncFn, 2);
  assert.deepEqual(results, [2, 4, 6, 8, 10]);
  assert.ok(
    maxConcurrent <= 2,
    `esperava no máximo 2 tarefas simultâneas, teve ${maxConcurrent}`,
  );
});

// --- allSettledPartitionErrors -----------------------------------------------------------

test("allSettledPartitionErrors: separa sucessos e erros com contagens", async () => {
  const promises = [
    Promise.resolve("ok1"),
    Promise.reject(new Error("falha1")),
    Promise.resolve("ok2"),
  ];
  const result = await allSettledPartitionErrors(promises);
  assert.deepEqual(result.values, ["ok1", "ok2"]);
  assert.deepEqual(result.errors, ["falha1"]);
  assert.equal(result.successCount, 2);
  assert.equal(result.failureCount, 1);
});

// --- raceMultipleSources ---------------------------------------------------------------

test("raceMultipleSources: retorna o valor e a fonte que respondeu primeiro", async () => {
  const sources = ["cache", "banco", "api"];
  const fetchFn = (source) => {
    if (source === "banco") return delayValue("valor-do-banco", 5);
    if (source === "cache") return delayValue("valor-do-cache", 40);
    return delayValue("valor-da-api", 60);
  };
  const result = await raceMultipleSources(sources, fetchFn);
  assert.deepEqual(result, { source: "banco", value: "valor-do-banco" });
});

// --- anyOfValidations ------------------------------------------------------------------

test("anyOfValidations: true quando pelo menos um validador aprova", async () => {
  const isEven = async (n) => n % 2 === 0;
  const isNegative = async (n) => n < 0;
  const result = await anyOfValidations([isEven, isNegative], 4);
  assert.equal(result, true);
});

test("anyOfValidations: false quando nenhum validador aprova", async () => {
  const isEven = async (n) => n % 2 === 0;
  const isNegative = async (n) => n < 0;
  const result = await anyOfValidations([isEven, isNegative], 5);
  assert.equal(result, false);
});

// --- fixPromiseAllFailFastBug ------------------------------------------------------------

test("fixPromiseAllFailFastBug: reporta sucesso e falha sem rejeitar tudo", async () => {
  const fetchUserAsyncFn = async (id) => {
    if (id === 2) throw new Error("usuário 2 não encontrado");
    return { id };
  };
  const result = await fixPromiseAllFailFastBug([1, 2, 3], fetchUserAsyncFn);
  assert.equal(result.length, 3);
  assert.equal(result[0].status, "fulfilled");
  assert.equal(result[1].status, "rejected");
  assert.equal(result[2].status, "fulfilled");
});

// --- fixRaceWinnerIndexBug ---------------------------------------------------------------

test("fixRaceWinnerIndexBug: reporta o índice de quem realmente venceu a corrida", async () => {
  const sources = [
    () => delayValue("lento", 40),
    () => delayValue("rápido", 5),
    () => delayValue("médio", 20),
  ];
  const result = await fixRaceWinnerIndexBug(sources);
  assert.deepEqual(result, { value: "rápido", winnerIndex: 1 });
});

// --- refactorSequentialToParallelAll ------------------------------------------------------

test("refactorSequentialToParallelAll: mantém os resultados na ordem original", async () => {
  const asyncFn = async (item) => {
    await delayValue(null, 10);
    return item * 10;
  };
  const results = await refactorSequentialToParallelAll([1, 2, 3], asyncFn);
  assert.deepEqual(results, [10, 20, 30]);
});

test("refactorSequentialToParallelAll: roda as chamadas em paralelo, não em série", async () => {
  const asyncFn = async (item) => {
    await delayValue(null, 30);
    return item;
  };
  const start = Date.now();
  await refactorSequentialToParallelAll([1, 2, 3, 4], asyncFn);
  const elapsed = Date.now() - start;
  // Em série, 4 * 30ms = 120ms ou mais. Em paralelo, deve ficar bem
  // abaixo disso.
  assert.ok(elapsed < 90, `esperava execução em paralelo (<90ms), levou ${elapsed}ms`);
});

// --- loadDashboardData -----------------------------------------------------------------

test("loadDashboardData: monta o dashboard quando tudo dá certo", async () => {
  const api = {
    fetchUser: async (id) => ({ id, name: "Ana" }),
    fetchOrders: async () => [{ id: 1 }],
    fetchNotifications: async () => [{ id: "n1" }],
    fetchRecommendations: async () => [{ id: "r1" }],
  };
  const result = await loadDashboardData(1, api);
  assert.deepEqual(result, {
    user: { id: 1, name: "Ana" },
    orders: [{ id: 1 }],
    notifications: [{ id: "n1" }],
    recommendations: [{ id: "r1" }],
    errors: [],
  });
});

test("loadDashboardData: tolera falhas parciais em seções não essenciais", async () => {
  const api = {
    fetchUser: async (id) => ({ id, name: "Ana" }),
    fetchOrders: async () => [{ id: 1 }],
    fetchNotifications: async () => {
      throw new Error("serviço de notificações fora do ar");
    },
    fetchRecommendations: async () => [{ id: "r1" }],
  };
  const result = await loadDashboardData(1, api);
  assert.deepEqual(result.user, { id: 1, name: "Ana" });
  assert.deepEqual(result.orders, [{ id: 1 }]);
  assert.equal(result.notifications, null);
  assert.deepEqual(result.recommendations, [{ id: "r1" }]);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].section, "notifications");
});

test("loadDashboardData: propaga erro se o usuário (dado essencial) falhar", async () => {
  const api = {
    fetchUser: async () => {
      throw new Error("usuário não encontrado");
    },
    fetchOrders: async () => [],
    fetchNotifications: async () => [],
    fetchRecommendations: async () => [],
  };
  await assert.rejects(() => loadDashboardData(1, api), /usuário não encontrado/);
});
