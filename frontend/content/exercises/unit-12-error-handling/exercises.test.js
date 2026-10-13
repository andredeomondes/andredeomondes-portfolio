import { test } from "node:test";
import assert from "node:assert/strict";

import {
  divideOrThrow,
  parseIntStrict,
  tryParseJson,
  validateAge,
  runWithFinally,
  ValidationError,
  validateNonEmpty,
  catchAndRewrap,
  firstSuccessful,
  retryOperation,
  validateUserPayload,
  safeJsonParseWithDefault,
  propagateWithContext,
  fixSwallowedErrorBug,
  fixFinallyReturnBug,
  refactorNestedTryCatch,
  processOrdersWithErrorReport,
} from "./exercises.js";

// --- divideOrThrow --------------------------------------------------------

test("divideOrThrow: divide normalmente quando b é diferente de zero", () => {
  assert.equal(divideOrThrow(10, 2), 5);
});

test("divideOrThrow: lança erro ao dividir por zero", () => {
  assert.throws(() => divideOrThrow(10, 0), /divis/i);
});

// --- parseIntStrict -----------------------------------------------------------

test("parseIntStrict: converte strings numéricas válidas", () => {
  assert.equal(parseIntStrict("42"), 42);
  assert.equal(parseIntStrict("-7"), -7);
});

test("parseIntStrict: lança erro para strings inválidas", () => {
  assert.throws(() => parseIntStrict("42abc"));
  assert.throws(() => parseIntStrict(""));
  assert.throws(() => parseIntStrict("3.14"));
});

// --- tryParseJson ---------------------------------------------------------------

test("tryParseJson: retorna ok:true e os dados quando o JSON é válido", () => {
  assert.deepEqual(tryParseJson('{"a":1}'), { ok: true, data: { a: 1 } });
});

test("tryParseJson: retorna ok:false e a mensagem de erro quando inválido", () => {
  const result = tryParseJson("{invalido");
  assert.equal(result.ok, false);
  assert.equal(typeof result.error, "string");
});

// --- validateAge -----------------------------------------------------------------

test("validateAge: retorna a idade quando válida", () => {
  assert.equal(validateAge(30), 30);
  assert.equal(validateAge(0), 0);
});

test("validateAge: lança RangeError para idades inválidas", () => {
  assert.throws(() => validateAge(-1), RangeError);
  assert.throws(() => validateAge(151), RangeError);
});

// --- runWithFinally --------------------------------------------------------------------

test("runWithFinally: roda cleanup mesmo quando fn funciona", () => {
  let cleaned = false;
  const result = runWithFinally(
    () => "resultado",
    () => {
      cleaned = true;
    },
  );
  assert.equal(result, "resultado");
  assert.equal(cleaned, true);
});

test("runWithFinally: roda cleanup e propaga o erro quando fn falha", () => {
  let cleaned = false;
  assert.throws(() =>
    runWithFinally(
      () => {
        throw new Error("falhou");
      },
      () => {
        cleaned = true;
      },
    ),
  );
  assert.equal(cleaned, true);
});

// --- ValidationError -------------------------------------------------------------------------

test("ValidationError: é uma subclasse de Error com name próprio", () => {
  const error = new ValidationError("campo inválido");
  assert.ok(error instanceof Error);
  assert.ok(error instanceof ValidationError);
  assert.equal(error.name, "ValidationError");
  assert.equal(error.message, "campo inválido");
});

// --- validateNonEmpty ---------------------------------------------------------------------------

test("validateNonEmpty: retorna a string quando não está vazia", () => {
  assert.equal(validateNonEmpty("olá"), "olá");
});

test("validateNonEmpty: lança ValidationError para strings vazias ou só espaço", () => {
  assert.throws(() => validateNonEmpty(""), ValidationError);
  assert.throws(() => validateNonEmpty("   "), ValidationError);
});

// --- catchAndRewrap --------------------------------------------------------------------------------

test("catchAndRewrap: retorna o valor quando fn não lança", () => {
  assert.equal(
    catchAndRewrap(() => 42, "cálculo"),
    42,
  );
});

test("catchAndRewrap: relança com contexto quando fn lança", () => {
  assert.throws(
    () =>
      catchAndRewrap(() => {
        throw new Error("original");
      }, "cálculo"),
    /cálculo: original/,
  );
});

// --- firstSuccessful -----------------------------------------------------------------------------------

test("firstSuccessful: retorna o resultado da primeira função que não lança", () => {
  const fns = [
    () => {
      throw new Error("falhou 1");
    },
    () => {
      throw new Error("falhou 2");
    },
    () => "sucesso",
  ];
  assert.equal(firstSuccessful(fns), "sucesso");
});

test("firstSuccessful: lança erro se todas as funções falharem", () => {
  const fns = [
    () => {
      throw new Error("falhou 1");
    },
    () => {
      throw new Error("falhou 2");
    },
  ];
  assert.throws(() => firstSuccessful(fns));
});

// --- retryOperation -------------------------------------------------------------------------------------

test("retryOperation: retorna o resultado assim que fn funciona", () => {
  let calls = 0;
  const fn = () => {
    calls += 1;
    if (calls < 3) throw new Error("tenta de novo");
    return "ok";
  };
  assert.equal(retryOperation(fn, 5), "ok");
  assert.equal(calls, 3);
});

test("retryOperation: lança o último erro se todas as tentativas falharem", () => {
  let calls = 0;
  const fn = () => {
    calls += 1;
    throw new Error(`falha ${calls}`);
  };
  assert.throws(() => retryOperation(fn, 3), /falha 3/);
  assert.equal(calls, 3);
});

// --- validateUserPayload --------------------------------------------------------------------------------

test("validateUserPayload: retorna o payload quando válido", () => {
  const payload = { name: "Ana", email: "ana@example.com", age: 25 };
  assert.deepEqual(validateUserPayload(payload), payload);
});

test("validateUserPayload: lança ValidationError listando todos os campos inválidos", () => {
  const payload = { name: "", email: "sem-arroba", age: -5 };
  try {
    validateUserPayload(payload);
    assert.fail("deveria ter lançado");
  } catch (error) {
    assert.ok(error instanceof ValidationError);
    assert.match(error.message, /name/);
    assert.match(error.message, /email/);
    assert.match(error.message, /age/);
  }
});

// --- safeJsonParseWithDefault ----------------------------------------------------------------------------

test("safeJsonParseWithDefault: retorna os dados quando o JSON é válido", () => {
  assert.deepEqual(safeJsonParseWithDefault('{"x":1}', {}), { x: 1 });
});

test("safeJsonParseWithDefault: retorna o valor padrão quando inválido", () => {
  assert.deepEqual(safeJsonParseWithDefault("{invalido", { fallback: true }), {
    fallback: true,
  });
});

// --- propagateWithContext -------------------------------------------------------------------------------

test("propagateWithContext: relança preservando o erro original em `cause`", () => {
  const original = new Error("erro de baixo nível");
  try {
    propagateWithContext(() => {
      throw original;
    }, "camada de serviço");
    assert.fail("deveria ter lançado");
  } catch (error) {
    assert.match(error.message, /camada de serviço/);
    assert.equal(error.cause, original);
  }
});

// --- fixSwallowedErrorBug --------------------------------------------------------------------------------

test("fixSwallowedErrorBug: propaga o erro em vez de engolir", () => {
  assert.throws(() => fixSwallowedErrorBug("{invalido"));
});

test("fixSwallowedErrorBug: ainda retorna o valor certo para JSON válido", () => {
  assert.deepEqual(fixSwallowedErrorBug('{"a":1}'), { a: 1 });
});

// --- fixFinallyReturnBug ---------------------------------------------------------------------------------

test("fixFinallyReturnBug: deixa o erro de riskyFn escapar", () => {
  assert.throws(
    () =>
      fixFinallyReturnBug(() => {
        throw new Error("falha real");
      }),
    /falha real/,
  );
});

test("fixFinallyReturnBug: ainda retorna o valor de riskyFn quando não há erro", () => {
  assert.equal(
    fixFinallyReturnBug(() => "valor normal"),
    "valor normal",
  );
});

// --- refactorNestedTryCatch -------------------------------------------------------------------------------

test("refactorNestedTryCatch: calcula raiz quadrada para entrada válida", () => {
  assert.equal(refactorNestedTryCatch(JSON.stringify({ value: 16 })), 4);
});

test("refactorNestedTryCatch: mantém as mensagens de erro originais", () => {
  assert.throws(() => refactorNestedTryCatch("not json"), /falha ao processar entrada:/);
  assert.throws(
    () => refactorNestedTryCatch(JSON.stringify({ value: "x" })),
    /falha ao processar entrada: erro de validação: value deve ser número/,
  );
  assert.throws(
    () => refactorNestedTryCatch(JSON.stringify({ value: -4 })),
    /value deve ser não-negativo/,
  );
});

// --- processOrdersWithErrorReport -------------------------------------------------------------------------------

test("processOrdersWithErrorReport: separa sucessos e falhas por pedido", () => {
  const orders = [
    { id: 1, amount: 100 },
    { id: 2, amount: -50 },
    { id: 3, amount: 200 },
  ];
  const processFn = (order) => {
    if (order.amount < 0) {
      throw new Error(`valor inválido para o pedido ${order.id}`);
    }
    return order.amount * 2;
  };

  const report = processOrdersWithErrorReport(orders, processFn);

  assert.deepEqual(report.successes, [
    { order: orders[0], result: 200 },
    { order: orders[2], result: 400 },
  ]);
  assert.equal(report.failures.length, 1);
  assert.equal(report.failures[0].order, orders[1]);
  assert.match(report.failures[0].error, /valor inválido para o pedido 2/);
});

test("processOrdersWithErrorReport: lista vazia retorna listas vazias", () => {
  const report = processOrdersWithErrorReport([], () => {});
  assert.deepEqual(report, { successes: [], failures: [] });
});
