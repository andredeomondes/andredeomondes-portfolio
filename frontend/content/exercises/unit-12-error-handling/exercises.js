// Unidade 12 — Tratamento de erros
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="divideOrThrow" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function divideOrThrow(a, b) {
  throw new Error("not implemented: divideOrThrow");
}

// test: node --test --test-name-pattern="parseIntStrict" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function parseIntStrict(str) {
  throw new Error("not implemented: parseIntStrict");
}

// test: node --test --test-name-pattern="tryParseJson" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function tryParseJson(str) {
  throw new Error("not implemented: tryParseJson");
}

// test: node --test --test-name-pattern="validateAge" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function validateAge(age) {
  throw new Error("not implemented: validateAge");
}

// test: node --test --test-name-pattern="runWithFinally" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function runWithFinally(fn, cleanup) {
  throw new Error("not implemented: runWithFinally");
}

// test: node --test --test-name-pattern="ValidationError" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// test: node --test --test-name-pattern="validateNonEmpty" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function validateNonEmpty(str) {
  throw new Error("not implemented: validateNonEmpty");
}

// test: node --test --test-name-pattern="catchAndRewrap" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function catchAndRewrap(fn, context) {
  throw new Error("not implemented: catchAndRewrap");
}

// test: node --test --test-name-pattern="firstSuccessful" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function firstSuccessful(fns) {
  throw new Error("not implemented: firstSuccessful");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="retryOperation" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function retryOperation(fn, attempts) {
  throw new Error("not implemented: retryOperation");
}

// test: node --test --test-name-pattern="validateUserPayload" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function validateUserPayload(payload) {
  throw new Error("not implemented: validateUserPayload");
}

// test: node --test --test-name-pattern="safeJsonParseWithDefault" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function safeJsonParseWithDefault(str, defaultValue) {
  throw new Error("not implemented: safeJsonParseWithDefault");
}

// test: node --test --test-name-pattern="propagateWithContext" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function propagateWithContext(fn, context) {
  throw new Error("not implemented: propagateWithContext");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixSwallowedErrorBug" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function fixSwallowedErrorBug(str) {
  // Sintoma relatado: quando `JSON.parse` recebe um texto inválido, a
  // função deveria propagar o erro para quem chamou. Em vez disso, o
  // erro é silenciosamente engolido e a função retorna `undefined` sem
  // avisar ninguém, escondendo o problema.
  try {
    return JSON.parse(str);
  } catch (error) {
    // TODO: não deveria estar vazio
  }
}

// test: node --test --test-name-pattern="fixFinallyReturnBug" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function fixFinallyReturnBug(riskyFn) {
  // Sintoma relatado: mesmo quando `riskyFn` lança um erro, esta função
  // nunca deixa o erro escapar — ela sempre retorna `"cleanup done"`,
  // porque o `finally` tem um `return` que sobrescreve tanto o valor
  // de retorno quanto o erro lançado no `try`.
  try {
    return riskyFn();
  } catch (error) {
    throw error;
  } finally {
    return "cleanup done";
  }
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar o
// try/catch profundamente aninhado para reduzir a duplicação, mantendo
// o mesmo comportamento.

// test: node --test --test-name-pattern="refactorNestedTryCatch" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function refactorNestedTryCatch(str) {
  try {
    const parsed = JSON.parse(str);
    try {
      if (typeof parsed.value !== "number") {
        throw new Error("value deve ser número");
      }
      try {
        if (parsed.value < 0) {
          throw new Error("value deve ser não-negativo");
        }
        return Math.sqrt(parsed.value);
      } catch (innerError) {
        throw new Error("erro de validação: " + innerError.message);
      }
    } catch (middleError) {
      throw new Error("erro de validação: " + middleError.message);
    }
  } catch (outerError) {
    throw new Error("falha ao processar entrada: " + outerError.message);
  }
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="processOrdersWithErrorReport" exercises/01-javascript-core/unit-12-error-handling/exercises.test.js
export function processOrdersWithErrorReport(orders, processFn) {
  throw new Error("not implemented: processOrdersWithErrorReport");
}
