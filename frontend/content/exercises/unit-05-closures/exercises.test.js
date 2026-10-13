import { test } from "node:test";
import assert from "node:assert/strict";

import {
  makeCounter,
  makeGreeter,
  createBankAccount,
  onceFn,
  createToggle,
  createAccumulator,
  createStack,
  rememberLastCall,
  createLoopClosuresFixed,
  memoize,
  createEventEmitter,
  limitCalls,
  createLoopClosuresBuggy,
  createSharedCounterPair,
  refactorCreateValidator,
  createRateLimiter,
} from "./exercises.js";

// --- makeCounter -----------------------------------------------------------

test("makeCounter: incrementa a partir de start", () => {
  const counter = makeCounter(5);
  assert.equal(counter(), 6);
  assert.equal(counter(), 7);
});

test("makeCounter: default start é 0 e contadores são independentes", () => {
  const a = makeCounter();
  const b = makeCounter();
  assert.equal(a(), 1);
  assert.equal(a(), 2);
  assert.equal(b(), 1);
});

// --- makeGreeter -------------------------------------------------------------

test("makeGreeter: reaproveita a saudação capturada", () => {
  const greetFormally = makeGreeter("Prezado(a)");
  assert.equal(greetFormally("Ana"), "Prezado(a), Ana!");
  assert.equal(greetFormally("Bruno"), "Prezado(a), Bruno!");
});

// --- createBankAccount ----------------------------------------------------------

test("createBankAccount: deposita e saca corretamente", () => {
  const account = createBankAccount(100);
  account.deposit(50);
  assert.equal(account.getBalance(), 150);
  account.withdraw(30);
  assert.equal(account.getBalance(), 120);
});

test("createBankAccount: rejeita valores não positivos", () => {
  const account = createBankAccount(100);
  assert.throws(() => account.deposit(0), RangeError);
  assert.throws(() => account.withdraw(-10), RangeError);
});

test("createBankAccount: rejeita saque maior que o saldo", () => {
  const account = createBankAccount(10);
  assert.throws(() => account.withdraw(20), /saldo insuficiente/);
});

// --- onceFn ------------------------------------------------------------------------

test("onceFn: executa fn apenas na primeira chamada", () => {
  let calls = 0;
  const wrapped = onceFn(() => {
    calls += 1;
    return calls;
  });
  assert.equal(wrapped(), 1);
  assert.equal(wrapped(), 1);
  assert.equal(wrapped(), 1);
  assert.equal(calls, 1);
});

// --- createToggle -----------------------------------------------------------------------

test("createToggle: inverte o valor a cada chamada", () => {
  const toggle = createToggle();
  assert.equal(toggle(), true);
  assert.equal(toggle(), false);
  assert.equal(toggle(), true);
});

test("createToggle: respeita o valor inicial informado", () => {
  const toggle = createToggle(true);
  assert.equal(toggle(), false);
  assert.equal(toggle(), true);
});

// --- createAccumulator -------------------------------------------------------------------------

test("createAccumulator: soma e persiste o total entre chamadas", () => {
  const add = createAccumulator(10);
  assert.equal(add(5), 15);
  assert.equal(add(-3), 12);
  assert.equal(add(0), 12);
});

// --- createStack ----------------------------------------------------------------------------------

test("createStack: push, pop, peek e size operam sobre estado privado", () => {
  const stack = createStack();
  assert.equal(stack.size(), 0);
  stack.push(1);
  stack.push(2);
  assert.equal(stack.peek(), 2);
  assert.equal(stack.size(), 2);
  assert.equal(stack.pop(), 2);
  assert.equal(stack.size(), 1);
});

test("createStack: pop em pilha vazia retorna undefined", () => {
  const stack = createStack();
  assert.equal(stack.pop(), undefined);
});

// --- rememberLastCall ------------------------------------------------------------------------------

test("rememberLastCall: retorna o resultado e guarda a última chamada", () => {
  const wrapped = rememberLastCall((a, b) => a + b);
  assert.equal(wrapped.getLastCall(), null);
  assert.equal(wrapped(2, 3), 5);
  assert.deepEqual(wrapped.getLastCall(), { args: [2, 3], result: 5 });
  wrapped(10, -1);
  assert.deepEqual(wrapped.getLastCall(), { args: [10, -1], result: 9 });
});

// --- createLoopClosuresFixed -------------------------------------------------------------------------

test("createLoopClosuresFixed: cada função retorna seu próprio índice", () => {
  const fns = createLoopClosuresFixed(3);
  assert.equal(fns.length, 3);
  assert.equal(fns[0](), 0);
  assert.equal(fns[1](), 1);
  assert.equal(fns[2](), 2);
});

// --- memoize ------------------------------------------------------------------------------------------

test("memoize: chama fn apenas uma vez por argumento", () => {
  let calls = 0;
  const slowSquare = memoize((n) => {
    calls += 1;
    return n * n;
  });
  assert.equal(slowSquare(4), 16);
  assert.equal(slowSquare(4), 16);
  assert.equal(slowSquare(5), 25);
  assert.equal(calls, 2);
});

// --- createEventEmitter -----------------------------------------------------------------------------------

test("createEventEmitter: registra e dispara handlers na ordem", () => {
  const emitter = createEventEmitter();
  const received = [];
  emitter.on("greet", (payload) => received.push(`a:${payload}`));
  emitter.on("greet", (payload) => received.push(`b:${payload}`));
  emitter.emit("greet", "oi");
  assert.deepEqual(received, ["a:oi", "b:oi"]);
});

test("createEventEmitter: emit sem handlers não lança erro", () => {
  const emitter = createEventEmitter();
  assert.doesNotThrow(() => emitter.emit("sem-handlers", {}));
});

test("createEventEmitter: off remove um handler específico", () => {
  const emitter = createEventEmitter();
  const received = [];
  const handler = (payload) => received.push(payload);
  emitter.on("evt", handler);
  emitter.off("evt", handler);
  emitter.emit("evt", "x");
  assert.deepEqual(received, []);
});

// --- limitCalls ---------------------------------------------------------------------------------------------

test("limitCalls: chama fn normalmente até o limite, depois retorna undefined", () => {
  let calls = 0;
  const wrapped = limitCalls(() => {
    calls += 1;
    return calls;
  }, 2);
  assert.equal(wrapped(), 1);
  assert.equal(wrapped(), 2);
  assert.equal(wrapped(), undefined);
  assert.equal(calls, 2);
});

// --- createLoopClosuresBuggy -----------------------------------------------------------------------------------

test("createLoopClosuresBuggy: cada função deveria retornar seu próprio índice", () => {
  const fns = createLoopClosuresBuggy(3);
  assert.equal(fns[0](), 0);
  assert.equal(fns[1](), 1);
  assert.equal(fns[2](), 2);
});

// --- createSharedCounterPair -----------------------------------------------------------------------------------

test("createSharedCounterPair: increment e decrement compartilham o mesmo contador", () => {
  const { increment, decrement } = createSharedCounterPair();
  assert.equal(increment(), 1);
  assert.equal(increment(), 2);
  assert.equal(decrement(), 1);
  assert.equal(decrement(), 0);
});

// --- refactorCreateValidator -----------------------------------------------------------------------------------

test("refactorCreateValidator: mantém o comportamento original", () => {
  const isValidAge = refactorCreateValidator(0, 120);
  assert.equal(isValidAge(30), true);
  assert.equal(isValidAge(-1), false);
  assert.equal(isValidAge(200), false);
  assert.equal(isValidAge("30"), false);
});

// --- createRateLimiter -------------------------------------------------------------------------------------------

test("createRateLimiter: permite até maxCalls chamadas, depois bloqueia", () => {
  const limiter = createRateLimiter(2);
  assert.equal(limiter.attempt(), true);
  assert.equal(limiter.attempt(), true);
  assert.equal(limiter.attempt(), false);
  assert.equal(limiter.attempt(), false);
});

test("createRateLimiter: reset libera novas chamadas", () => {
  const limiter = createRateLimiter(1);
  assert.equal(limiter.attempt(), true);
  assert.equal(limiter.attempt(), false);
  limiter.reset();
  assert.equal(limiter.attempt(), true);
});
