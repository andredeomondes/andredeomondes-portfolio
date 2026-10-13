import { test } from "node:test";
import assert from "node:assert/strict";

import {
  applyOperation,
  makeAdder,
  makeMultiplier,
  invertPredicate,
  repeatCall,
  pipeTwo,
  composeTwo,
  once,
  makeCounter,
  curry3,
  memoize,
  pipeAll,
  fixOnceBug,
  fixCounterClosureBug,
  refactorMessyPipeline,
  buildValidationPipeline,
} from "./exercises.js";

// --- applyOperation --------------------------------------------------------

test("applyOperation: recebe uma função e a aplica aos dois valores", () => {
  assert.equal(
    applyOperation(3, 4, (a, b) => a + b),
    7,
  );
  assert.equal(
    applyOperation(3, 4, (a, b) => a * b),
    12,
  );
});

// --- makeAdder ---------------------------------------------------------------

test("makeAdder: retorna função que soma x ao argumento", () => {
  const add10 = makeAdder(10);
  assert.equal(add10(5), 15);
  assert.equal(add10(-3), 7);
});

// --- makeMultiplier ------------------------------------------------------------

test("makeMultiplier: retorna função que multiplica pelo fator", () => {
  const triple = makeMultiplier(3);
  assert.equal(triple(4), 12);
  assert.equal(triple(0), 0);
});

// --- invertPredicate -----------------------------------------------------------

test("invertPredicate: inverte o resultado booleano do predicado", () => {
  const isEven = (n) => n % 2 === 0;
  const isOdd = invertPredicate(isEven);
  assert.equal(isOdd(3), true);
  assert.equal(isOdd(4), false);
});

// --- repeatCall ------------------------------------------------------------------

test("repeatCall: chama fn(i) para i de 0 até n-1 e coleta resultados", () => {
  assert.deepEqual(
    repeatCall(4, (i) => i * i),
    [0, 1, 4, 9],
  );
  assert.deepEqual(
    repeatCall(0, (i) => i),
    [],
  );
});

// --- pipeTwo ------------------------------------------------------------------------

test("pipeTwo: aplica f e depois g, na ordem de leitura", () => {
  const addOne = (n) => n + 1;
  const double = (n) => n * 2;
  const addThenDouble = pipeTwo(addOne, double);
  assert.equal(addThenDouble(3), 8); // (3+1)*2
});

// --- composeTwo ---------------------------------------------------------------------

test("composeTwo: aplica g primeiro, depois f (ordem matemática)", () => {
  const addOne = (n) => n + 1;
  const double = (n) => n * 2;
  const composed = composeTwo(addOne, double);
  assert.equal(composed(3), 7); // addOne(double(3)) = addOne(6)
});

// --- once ------------------------------------------------------------------------------

test("once: executa fn apenas na primeira chamada", () => {
  let calls = 0;
  const init = once(() => {
    calls += 1;
    return "initialized";
  });
  assert.equal(init(), "initialized");
  assert.equal(init(), "initialized");
  assert.equal(init(), "initialized");
  assert.equal(calls, 1);
});

// --- makeCounter --------------------------------------------------------------------

test("makeCounter: increment/decrement mantêm estado via closure", () => {
  const counter = makeCounter(5);
  assert.equal(counter.value(), 5);
  assert.equal(counter.increment(), 6);
  assert.equal(counter.increment(), 7);
  assert.equal(counter.decrement(), 6);
  assert.equal(counter.value(), 6);
});

test("makeCounter: inicia em 0 quando start não é informado", () => {
  const counter = makeCounter();
  assert.equal(counter.value(), 0);
  assert.equal(counter.increment(), 1);
});

// --- curry3 -----------------------------------------------------------------------------

test("curry3: transforma fn(a, b, c) em a => b => c => fn(a, b, c)", () => {
  const sum3 = (a, b, c) => a + b + c;
  const curried = curry3(sum3);
  assert.equal(curried(1)(2)(3), 6);
  assert.equal(curried(10)(20)(30), 60);
});

// --- memoize -------------------------------------------------------------------------------

test("memoize: chama fn apenas uma vez por argumento distinto", () => {
  let calls = 0;
  const square = memoize((n) => {
    calls += 1;
    return n * n;
  });
  assert.equal(square(4), 16);
  assert.equal(square(4), 16);
  assert.equal(square(5), 25);
  assert.equal(calls, 2);
});

// --- pipeAll -----------------------------------------------------------------------------

test("pipeAll: encadeia um número variável de funções da esquerda para a direita", () => {
  const addOne = (n) => n + 1;
  const double = (n) => n * 2;
  const square = (n) => n * n;
  const pipeline = pipeAll(addOne, double, square);
  assert.equal(pipeline(2), 36); // ((2+1)*2)^2 = 36
});

test("pipeAll: sem funções, retorna o valor original", () => {
  const identity = pipeAll();
  assert.equal(identity(42), 42);
});

// --- fixOnceBug -----------------------------------------------------------------------------

test("fixOnceBug: executa fn apenas uma vez, mesmo com múltiplas chamadas", () => {
  let calls = 0;
  const setup = fixOnceBug(() => {
    calls += 1;
    return "done";
  });
  assert.equal(setup(), "done");
  assert.equal(setup(), "done");
  assert.equal(calls, 1);
});

// --- fixCounterClosureBug -----------------------------------------------------------------------

test("fixCounterClosureBug: increment lembra o valor entre chamadas", () => {
  const increment = fixCounterClosureBug();
  assert.equal(increment(), 1);
  assert.equal(increment(), 2);
  assert.equal(increment(), 3);
});

// --- refactorMessyPipeline -----------------------------------------------------------------------

test("refactorMessyPipeline: mantém o comportamento original", () => {
  assert.equal(refactorMessyPipeline(0), 7); // (((0+1)*2+1)*2+1)
  assert.equal(refactorMessyPipeline(1), 11);
});

// --- buildValidationPipeline -----------------------------------------------------------------------

test("buildValidationPipeline: retorna as mensagens das regras que falharam", () => {
  const rules = [
    { test: (v) => typeof v === "string", message: "deve ser string" },
    { test: (v) => v.length >= 3, message: "deve ter ao menos 3 caracteres" },
    { test: (v) => v.trim() === v, message: "não pode ter espaços nas bordas" },
  ];
  const validate = buildValidationPipeline(rules);
  assert.deepEqual(validate("ok"), ["deve ter ao menos 3 caracteres"]);
  assert.deepEqual(validate("valid"), []);
  assert.deepEqual(validate(" a"), [
    "deve ter ao menos 3 caracteres",
    "não pode ter espaços nas bordas",
  ]);
});

test("buildValidationPipeline: nenhuma regra sempre retorna array vazio", () => {
  const validate = buildValidationPipeline([]);
  assert.deepEqual(validate("qualquer coisa"), []);
});
