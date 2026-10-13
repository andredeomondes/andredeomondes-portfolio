import { test } from "node:test";
import assert from "node:assert/strict";

import {
  propagateRejection,
  catchAndRecover,
  ValidationError,
  validateAgeAsync,
  wrapAsyncErrors,
  asyncErrorChain,
  isRetryableError,
  retryOnRetryableError,
  asyncFinallyAlwaysRuns,
  errorBoundaryAsync,
  validateThenSaveAsync,
  safeAsyncMap,
  fixUnhandledRejectionBug,
  fixErrorSwallowedInAsyncCatch,
  refactorErrorHandlingDuplication,
  runPipelineWithErrorReport,
} from "./exercises.js";

// --- propagateRejection --------------------------------------------------------------

test("propagateRejection: retorna o valor normalmente em caso de sucesso", async () => {
  const result = await propagateRejection(Promise.resolve(42));
  assert.equal(result, 42);
});

test("propagateRejection: relança com mensagem enriquecida em caso de erro", async () => {
  await assert.rejects(
    () => propagateRejection(Promise.reject(new Error("falha original"))),
    /falha original/,
  );
});

// --- catchAndRecover -----------------------------------------------------------------

test("catchAndRecover: retorna o valor quando a promise resolve", async () => {
  const result = await catchAndRecover(Promise.resolve("ok"), "default");
  assert.equal(result, "ok");
});

test("catchAndRecover: retorna o fallback quando a promise rejeita", async () => {
  const result = await catchAndRecover(Promise.reject(new Error("falhou")), "default");
  assert.equal(result, "default");
});

// --- ValidationError -----------------------------------------------------------------

test("ValidationError: é uma subclasse de Error com nome próprio", () => {
  const err = new ValidationError("idade inválida");
  assert.ok(err instanceof Error);
  assert.ok(err instanceof ValidationError);
  assert.equal(err.name, "ValidationError");
  assert.equal(err.message, "idade inválida");
});

// --- validateAgeAsync ----------------------------------------------------------------

test("validateAgeAsync: aceita idade válida", async () => {
  const result = await validateAgeAsync(30);
  assert.equal(result, 30);
});

test("validateAgeAsync: rejeita com ValidationError para idade inválida", async () => {
  await assert.rejects(() => validateAgeAsync(-1), ValidationError);
  await assert.rejects(() => validateAgeAsync(200), ValidationError);
});

// --- wrapAsyncErrors -----------------------------------------------------------------

test("wrapAsyncErrors: retorna {ok:true, value} em caso de sucesso", async () => {
  const risky = async (n) => n * 2;
  const wrapped = wrapAsyncErrors(risky);
  const result = await wrapped(5);
  assert.deepEqual(result, { ok: true, value: 10 });
});

test("wrapAsyncErrors: identifica o tipo do erro capturado", async () => {
  const risky = async (age) => {
    if (age < 0) throw new ValidationError("idade inválida");
    return age;
  };
  const wrapped = wrapAsyncErrors(risky);
  const result = await wrapped(-5);
  assert.equal(result.ok, false);
  assert.equal(result.error, "idade inválida");
  assert.equal(result.type, "ValidationError");
});

// --- asyncErrorChain -----------------------------------------------------------------

test("asyncErrorChain: encadeia etapas com sucesso", async () => {
  const steps = [async (v) => v + 1, async (v) => v * 2, async (v) => v - 3];
  const result = await asyncErrorChain(steps, 5);
  assert.deepEqual(result, { ok: true, value: 9 }); // ((5+1)*2)-3 = 9
});

test("asyncErrorChain: reporta em qual etapa ocorreu a falha", async () => {
  const steps = [
    async (v) => v + 1,
    async () => {
      throw new Error("falha na etapa 2");
    },
    async (v) => v * 100,
  ];
  const result = await asyncErrorChain(steps, 5);
  assert.deepEqual(result, { ok: false, step: 1, error: "falha na etapa 2" });
});

// --- isRetryableError ----------------------------------------------------------------

test("isRetryableError: true quando o erro é marcado como retryable", () => {
  const err = new Error("timeout de rede");
  err.retryable = true;
  assert.equal(isRetryableError(err), true);
});

test("isRetryableError: false por padrão", () => {
  assert.equal(isRetryableError(new Error("erro genérico")), false);
  assert.equal(isRetryableError(new ValidationError("idade inválida")), false);
});

// --- retryOnRetryableError -------------------------------------------------------------

test("retryOnRetryableError: tenta de novo apenas se o erro for retryable", async () => {
  let attempts = 0;
  const flaky = async () => {
    attempts += 1;
    if (attempts < 3) {
      const err = new Error("tente de novo");
      err.retryable = true;
      throw err;
    }
    return "sucesso";
  };
  const result = await retryOnRetryableError(flaky, 5);
  assert.equal(result, "sucesso");
  assert.equal(attempts, 3);
});

test("retryOnRetryableError: desiste imediatamente em erro não retryable", async () => {
  let attempts = 0;
  const fails = async () => {
    attempts += 1;
    throw new ValidationError("dado inválido");
  };
  await assert.rejects(() => retryOnRetryableError(fails, 5), ValidationError);
  assert.equal(attempts, 1);
});

// --- asyncFinallyAlwaysRuns ------------------------------------------------------------

test("asyncFinallyAlwaysRuns: executa cleanup e retorna o valor em caso de sucesso", async () => {
  let cleaned = false;
  const result = await asyncFinallyAlwaysRuns(
    async () => "valor",
    async () => {
      cleaned = true;
    },
  );
  assert.equal(result, "valor");
  assert.equal(cleaned, true);
});

test("asyncFinallyAlwaysRuns: executa cleanup e propaga o erro em caso de falha", async () => {
  let cleaned = false;
  await assert.rejects(
    () =>
      asyncFinallyAlwaysRuns(
        async () => {
          throw new Error("falhou");
        },
        async () => {
          cleaned = true;
        },
      ),
    /falhou/,
  );
  assert.equal(cleaned, true);
});

// --- errorBoundaryAsync ----------------------------------------------------------------

test("errorBoundaryAsync: retorna o valor normalmente em caso de sucesso", async () => {
  const result = await errorBoundaryAsync(
    async () => "ok",
    () => "fallback",
  );
  assert.equal(result, "ok");
});

test("errorBoundaryAsync: chama onError e retorna o valor dele em caso de falha", async () => {
  const result = await errorBoundaryAsync(
    async () => {
      throw new Error("quebrou");
    },
    (err) => `tratado: ${err.message}`,
  );
  assert.equal(result, "tratado: quebrou");
});

// --- validateThenSaveAsync -------------------------------------------------------------

test("validateThenSaveAsync: sucesso quando validação e salvamento passam", async () => {
  const validateAsyncFn = async (input) => {
    if (input.amount <= 0) throw new ValidationError("valor inválido");
    return input;
  };
  const saveAsyncFn = async (input) => ({ ...input, status: "saved" });

  const result = await validateThenSaveAsync(
    { amount: 10 },
    validateAsyncFn,
    saveAsyncFn,
  );
  assert.deepEqual(result, { ok: true, value: { amount: 10, status: "saved" } });
});

test("validateThenSaveAsync: reporta falha na etapa de validação", async () => {
  const validateAsyncFn = async (input) => {
    if (input.amount <= 0) throw new ValidationError("valor inválido");
    return input;
  };
  const saveAsyncFn = async () => {
    throw new Error("não deveria ser chamado");
  };

  const result = await validateThenSaveAsync(
    { amount: -5 },
    validateAsyncFn,
    saveAsyncFn,
  );
  assert.deepEqual(result, { ok: false, stage: "validate", error: "valor inválido" });
});

test("validateThenSaveAsync: reporta falha na etapa de salvamento", async () => {
  const validateAsyncFn = async (input) => input;
  const saveAsyncFn = async () => {
    throw new Error("erro de banco de dados");
  };

  const result = await validateThenSaveAsync(
    { amount: 10 },
    validateAsyncFn,
    saveAsyncFn,
  );
  assert.deepEqual(result, { ok: false, stage: "save", error: "erro de banco de dados" });
});

// --- safeAsyncMap ----------------------------------------------------------------------

test("safeAsyncMap: coleta sucessos e falhas sem parar no primeiro erro", async () => {
  const asyncFn = async (n) => {
    if (n === 2) throw new Error("erro no item 2");
    return n * 10;
  };
  const results = await safeAsyncMap([1, 2, 3], asyncFn);
  assert.deepEqual(results, [
    { item: 1, ok: true, value: 10 },
    { item: 2, ok: false, error: "erro no item 2" },
    { item: 3, ok: true, value: 30 },
  ]);
});

// --- fixUnhandledRejectionBug ------------------------------------------------------------

test("fixUnhandledRejectionBug: coleta os resultados aguardando corretamente", async () => {
  const riskyAsyncFn = async (item) => item * 2;
  const results = await fixUnhandledRejectionBug([1, 2, 3], riskyAsyncFn);
  assert.deepEqual(results, [2, 4, 6]);
});

test("fixUnhandledRejectionBug: propaga o erro em vez de deixá-lo sem tratamento", async () => {
  const riskyAsyncFn = async (item) => {
    if (item === 2) throw new Error("item 2 falhou");
    return item;
  };
  await assert.rejects(
    () => fixUnhandledRejectionBug([1, 2, 3], riskyAsyncFn),
    /item 2 falhou/,
  );
});

// --- fixErrorSwallowedInAsyncCatch -------------------------------------------------------

test("fixErrorSwallowedInAsyncCatch: retorna sucesso quando a promise resolve", async () => {
  const result = await fixErrorSwallowedInAsyncCatch(Promise.resolve("valor"));
  assert.deepEqual(result, { ok: true, value: "valor" });
});

test("fixErrorSwallowedInAsyncCatch: retorna falha real quando a promise rejeita", async () => {
  const result = await fixErrorSwallowedInAsyncCatch(
    Promise.reject(new Error("quebrou")),
  );
  assert.equal(result.ok, false);
  assert.equal(result.error, "quebrou");
});

// --- refactorErrorHandlingDuplication -----------------------------------------------------

test("refactorErrorHandlingDuplication: relata sucesso e falha por etapa", async () => {
  const steps = [
    async () => "resultado 0",
    async () => {
      throw new Error("falha na etapa 1");
    },
    async () => "resultado 2",
  ];
  const report = await refactorErrorHandlingDuplication(steps);
  assert.deepEqual(report, [
    { step: 0, ok: true, value: "resultado 0" },
    { step: 1, ok: false, error: "falha na etapa 1" },
    { step: 2, ok: true, value: "resultado 2" },
  ]);
});

// --- runPipelineWithErrorReport ------------------------------------------------------------

test("runPipelineWithErrorReport: processa pedidos por múltiplas etapas, isolando falhas", async () => {
  const orders = [
    { id: 1, amount: 100 },
    { id: 2, amount: -10 },
    { id: 3, amount: 50 },
  ];
  const steps = [
    async (order) => {
      if (order.amount <= 0) throw new ValidationError("valor inválido");
      return order;
    },
    async (order) => ({ ...order, status: "saved" }),
  ];

  const result = await runPipelineWithErrorReport(orders, steps);

  assert.deepEqual(result.succeeded, [
    { id: 1, amount: 100, status: "saved" },
    { id: 3, amount: 50, status: "saved" },
  ]);
  assert.equal(result.failed.length, 1);
  assert.equal(result.failed[0].id, 2);
  assert.equal(result.failed[0].step, 0);
  assert.equal(result.failed[0].error, "valor inválido");
});
