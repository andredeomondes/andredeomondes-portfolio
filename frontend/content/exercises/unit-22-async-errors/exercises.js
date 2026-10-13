// Unidade 22 — Erros assíncronos
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.
//
// Todas as funções desta unidade são `async function` (exceto onde
// indicado). Para os stubs, `throw new Error(...)` já produz uma Promise
// rejeitada.

// --- Fundamentais -----------------------------------------------------------

// test: node --test --test-name-pattern="propagateRejection" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export async function propagateRejection(promise) {
  throw new Error("not implemented: propagateRejection");
}

// test: node --test --test-name-pattern="catchAndRecover" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export async function catchAndRecover(promise, fallbackValue) {
  throw new Error("not implemented: catchAndRecover");
}

// test: node --test --test-name-pattern="ValidationError" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export class ValidationError extends Error {
  constructor(message) {
    throw new Error("not implemented: ValidationError");
  }
}

// test: node --test --test-name-pattern="validateAgeAsync" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export async function validateAgeAsync(age) {
  throw new Error("not implemented: validateAgeAsync");
}

// test: node --test --test-name-pattern="wrapAsyncErrors" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export function wrapAsyncErrors(asyncFn) {
  throw new Error("not implemented: wrapAsyncErrors");
}

// test: node --test --test-name-pattern="asyncErrorChain" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export async function asyncErrorChain(steps, input) {
  throw new Error("not implemented: asyncErrorChain");
}

// test: node --test --test-name-pattern="isRetryableError" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export function isRetryableError(error) {
  throw new Error("not implemented: isRetryableError");
}

// test: node --test --test-name-pattern="retryOnRetryableError" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export async function retryOnRetryableError(taskFn, attempts) {
  throw new Error("not implemented: retryOnRetryableError");
}

// --- Intermediários ----------------------------------------------------------

// test: node --test --test-name-pattern="asyncFinallyAlwaysRuns" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export async function asyncFinallyAlwaysRuns(asyncFn, cleanupFn) {
  throw new Error("not implemented: asyncFinallyAlwaysRuns");
}

// test: node --test --test-name-pattern="errorBoundaryAsync" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export async function errorBoundaryAsync(asyncFn, onError) {
  throw new Error("not implemented: errorBoundaryAsync");
}

// test: node --test --test-name-pattern="validateThenSaveAsync" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export async function validateThenSaveAsync(input, validateAsyncFn, saveAsyncFn) {
  throw new Error("not implemented: validateThenSaveAsync");
}

// test: node --test --test-name-pattern="safeAsyncMap" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export async function safeAsyncMap(items, asyncFn) {
  throw new Error("not implemented: safeAsyncMap");
}

// --- Debugging ----------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixUnhandledRejectionBug" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export async function fixUnhandledRejectionBug(items, riskyAsyncFn) {
  // Sintoma relatado: quando `riskyAsyncFn` falha para QUALQUER item, o
  // processo Node.js encerra com um aviso de "unhandled rejection" — o
  // `.forEach` dispara as chamadas assíncronas, mas ninguém espera por
  // elas nem captura os erros, então as rejeições ficam "soltas".
  const results = [];
  items.forEach(async (item) => {
    const value = await riskyAsyncFn(item);
    results.push(value);
  });
  return results;
}

// test: node --test --test-name-pattern="fixErrorSwallowedInAsyncCatch" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export async function fixErrorSwallowedInAsyncCatch(promise) {
  // Sintoma relatado: mesmo quando `promise` rejeita, esta função sempre
  // retorna `{ ok: true, value: undefined }` — o chamador não tem como
  // saber que algo deu errado, porque o `catch` está mascarando a falha
  // como se fosse sucesso.
  try {
    const value = await promise;
    return { ok: true, value };
  } catch (err) {
    return { ok: true, value: undefined };
  }
}

// --- Refatoração ---------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// a duplicação de try/catch repetido por etapa, mantendo o mesmo
// comportamento observável (inclusive o formato do relatório por etapa).

// test: node --test --test-name-pattern="refactorErrorHandlingDuplication" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export async function refactorErrorHandlingDuplication(steps) {
  const report = [];

  try {
    const result = await steps[0]();
    report.push({ step: 0, ok: true, value: result });
  } catch (err) {
    report.push({ step: 0, ok: false, error: err.message });
  }

  try {
    const result = await steps[1]();
    report.push({ step: 1, ok: true, value: result });
  } catch (err) {
    report.push({ step: 1, ok: false, error: err.message });
  }

  try {
    const result = await steps[2]();
    report.push({ step: 2, ok: true, value: result });
  } catch (err) {
    report.push({ step: 2, ok: false, error: err.message });
  }

  return report;
}

// --- Desafio integrador -----------------------------------------------------------

// test: node --test --test-name-pattern="runPipelineWithErrorReport" exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
export async function runPipelineWithErrorReport(orders, steps) {
  throw new Error("not implemented: runPipelineWithErrorReport");
}
