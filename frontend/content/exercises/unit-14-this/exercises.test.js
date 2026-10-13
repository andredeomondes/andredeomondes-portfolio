import { test } from "node:test";
import assert from "node:assert/strict";

import {
  whatIsThisUnbound,
  createPerson,
  extractAndCallLoosely,
  bindMethodToObject,
  sumWithCall,
  sumWithApply,
  createArrowCounter,
  bindAllMethods,
  createChainableCalculator,
  partialWithBind,
  borrowArrayMethod,
  createEventBus,
  sumArrayWithContext,
  BuggyCounter,
  Widget,
  createRateLimiter,
} from "./exercises.js";

// --- whatIsThisUnbound ----------------------------------------------------------

test("whatIsThisUnbound: this é undefined em função solta dentro de módulo ES", () => {
  assert.equal(whatIsThisUnbound(), true);
});

// --- createPerson ---------------------------------------------------------------

test("createPerson: greet usa this.name com binding implícito", () => {
  const person = createPerson("Ana");
  assert.equal(person.greet(), "Oi, eu sou Ana");
});

// --- extractAndCallLoosely -------------------------------------------------------

test("extractAndCallLoosely: perde o binding ao extrair o método", () => {
  const person = createPerson("Ana");
  const result = extractAndCallLoosely(person, "greet");
  assert.equal(typeof result, "string");
  assert.match(result, /^Erro: /);
});

// --- bindMethodToObject -----------------------------------------------------------

test("bindMethodToObject: método continua funcionando mesmo extraído", () => {
  const person = createPerson("Bob");
  const bound = bindMethodToObject(person, "greet");
  assert.equal(bound(), "Oi, eu sou Bob");
});

// --- sumWithCall -------------------------------------------------------------------

test("sumWithCall: usa Function.prototype.call para definir this", () => {
  function sum(a, b) {
    return this.base + a + b;
  }
  assert.equal(sumWithCall(sum, { base: 10 }, 1, 2), 13);
});

// --- sumWithApply -------------------------------------------------------------------

test("sumWithApply: usa Function.prototype.apply com array de argumentos", () => {
  function sum(a, b) {
    return this.base + a + b;
  }
  assert.equal(sumWithApply(sum, { base: 100 }, [1, 2]), 103);
});

// --- createArrowCounter -------------------------------------------------------------

test("createArrowCounter: arrow function preserva o this léxico do método", () => {
  const counter = createArrowCounter();
  assert.equal(counter.incrementLater(), 1);
  assert.equal(counter.incrementLater(), 2);
});

// --- bindAllMethods -----------------------------------------------------------------

test("bindAllMethods: métodos extraídos continuam ligados ao objeto original", () => {
  const obj = {
    count: 0,
    inc() {
      this.count++;
      return this.count;
    },
  };
  const bound = bindAllMethods(obj);
  const incAlone = bound.inc;
  assert.equal(incAlone(), 1);
  assert.equal(obj.count, 1);
});

// --- createChainableCalculator -------------------------------------------------------

test("createChainableCalculator: métodos retornam this para encadeamento", () => {
  const calc = createChainableCalculator(10);
  assert.equal(calc.add(5).subtract(3).result(), 12);
});

// --- partialWithBind -----------------------------------------------------------------

test("partialWithBind: aplica argumentos parciais com bind", () => {
  function add3(a, b, c) {
    return a + b + c;
  }
  const add10 = partialWithBind(add3, 10);
  assert.equal(add10(5, 5), 20);
});

// --- borrowArrayMethod ---------------------------------------------------------------

test("borrowArrayMethod: converte array-like em array real", () => {
  const result = borrowArrayMethod({ 0: "a", 1: "b", length: 2 });
  assert.ok(Array.isArray(result));
  assert.deepEqual(result, ["a", "b"]);
});

// --- createEventBus ------------------------------------------------------------------

test("createEventBus: emit invoca handlers com o bus como this", () => {
  const bus = createEventBus();
  const received = [];
  bus.on("x", function (value) {
    received.push(this === bus ? `bus:${value}` : `other:${value}`);
  });
  bus.emit("x", 5);
  assert.deepEqual(received, ["bus:5"]);
});

// --- sumArrayWithContext (debugging) --------------------------------------------------

test("sumArrayWithContext: soma corretamente usando o this de obj", () => {
  const obj = { total: 0, numbers: [1, 2, 3, 4] };
  assert.equal(sumArrayWithContext(obj), 10);
});

// --- BuggyCounter (debugging) ---------------------------------------------------------

test("BuggyCounter: getIncrementFunction retorna função utilizável isoladamente", () => {
  const counter = new BuggyCounter();
  const inc = counter.getIncrementFunction();
  assert.equal(inc(), 1);
  assert.equal(inc(), 2);
  assert.equal(counter.count, 2);
});

// --- Widget (refatoração) ---------------------------------------------------------------

test("Widget: métodos continuam ligados à instância mesmo extraídos", () => {
  const widget = new Widget("botao-salvar");
  const click = widget.handleClick;
  const hover = widget.handleHover;
  const reset = widget.reset;

  assert.equal(click(), 1);
  assert.equal(click(), 2);
  assert.equal(hover(), "hover: botao-salvar");
  assert.equal(reset(), 0);
  assert.equal(widget.clicks, 0);
});

// --- createRateLimiter (desafio integrador) ---------------------------------------------

test("createRateLimiter: limita tentativas e reset funciona extraído", () => {
  const limiter = createRateLimiter(2);
  assert.equal(limiter.attempt(), true);
  assert.equal(limiter.attempt(), true);
  assert.equal(limiter.attempt(), false);

  const reset = limiter.reset;
  reset();
  assert.equal(limiter.attempt(), true);
});
