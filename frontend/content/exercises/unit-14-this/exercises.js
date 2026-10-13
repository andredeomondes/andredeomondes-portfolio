// Unidade 14 — `this`
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.
//
// Lembrete: este arquivo é um módulo ES (`"type": "module"` no
// package.json), então todo o código aqui já roda em modo estrito por
// padrão — isso importa para vários exercícios desta unidade.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="whatIsThisUnbound" exercises/01-javascript-core/unit-14-this/exercises.test.js
export function whatIsThisUnbound() {
  return typeof this === "undefined";
}

// test: node --test --test-name-pattern="createPerson" exercises/01-javascript-core/unit-14-this/exercises.test.js
export function createPerson(name) {
  throw new Error("not implemented: createPerson");
}

// test: node --test --test-name-pattern="extractAndCallLoosely" exercises/01-javascript-core/unit-14-this/exercises.test.js
export function extractAndCallLoosely(obj, methodName) {
  throw new Error("not implemented: extractAndCallLoosely");
}

// test: node --test --test-name-pattern="bindMethodToObject" exercises/01-javascript-core/unit-14-this/exercises.test.js
export function bindMethodToObject(obj, methodName) {
  throw new Error("not implemented: bindMethodToObject");
}

// test: node --test --test-name-pattern="sumWithCall" exercises/01-javascript-core/unit-14-this/exercises.test.js
export function sumWithCall(fn, thisArg, a, b) {
  throw new Error("not implemented: sumWithCall");
}

// test: node --test --test-name-pattern="sumWithApply" exercises/01-javascript-core/unit-14-this/exercises.test.js
export function sumWithApply(fn, thisArg, argsArray) {
  throw new Error("not implemented: sumWithApply");
}

// test: node --test --test-name-pattern="createArrowCounter" exercises/01-javascript-core/unit-14-this/exercises.test.js
export function createArrowCounter() {
  throw new Error("not implemented: createArrowCounter");
}

// test: node --test --test-name-pattern="bindAllMethods" exercises/01-javascript-core/unit-14-this/exercises.test.js
export function bindAllMethods(obj) {
  throw new Error("not implemented: bindAllMethods");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="createChainableCalculator" exercises/01-javascript-core/unit-14-this/exercises.test.js
export function createChainableCalculator(initial = 0) {
  throw new Error("not implemented: createChainableCalculator");
}

// test: node --test --test-name-pattern="partialWithBind" exercises/01-javascript-core/unit-14-this/exercises.test.js
export function partialWithBind(fn, ...presetArgs) {
  throw new Error("not implemented: partialWithBind");
}

// test: node --test --test-name-pattern="borrowArrayMethod" exercises/01-javascript-core/unit-14-this/exercises.test.js
export function borrowArrayMethod(arrayLike) {
  throw new Error("not implemented: borrowArrayMethod");
}

// test: node --test --test-name-pattern="createEventBus" exercises/01-javascript-core/unit-14-this/exercises.test.js
export function createEventBus() {
  throw new Error("not implemented: createEventBus");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções/classes abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug
// real relacionado a `this`. Sua tarefa não é reescrever do zero: é
// diagnosticar e corrigir.

// test: node --test --test-name-pattern="sumArrayWithContext" exercises/01-javascript-core/unit-14-this/exercises.test.js
export function sumArrayWithContext(obj) {
  // Sintoma relatado: `obj.total` nunca muda — a soma sempre lança
  // "Cannot read properties of undefined (reading 'total')" ou continua
  // sempre com o valor inicial, dependendo do motor JS.
  obj.numbers.forEach(function (n) {
    this.total += n;
  });
  return obj.total;
}

// test: node --test --test-name-pattern="BuggyCounter" exercises/01-javascript-core/unit-14-this/exercises.test.js
export class BuggyCounter {
  // Sintoma relatado: pegar a função de incremento separada do objeto
  // (para usar como callback em outro lugar) e chamá-la lança
  // "Cannot read properties of undefined (reading 'count')".
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count++;
    return this.count;
  }

  getIncrementFunction() {
    return this.increment;
  }
}

// --- Refatoração -------------------------------------------------------------
//
// Esta classe já funciona corretamente. A tarefa é refatorar para reduzir
// a repetição de `.bind(this)` linha por linha, mantendo o mesmo
// comportamento observável (os métodos continuam funcionando quando
// extraídos e chamados soltos).

// test: node --test --test-name-pattern="Widget" exercises/01-javascript-core/unit-14-this/exercises.test.js
export class Widget {
  constructor(label) {
    this.label = label;
    this.clicks = 0;
    this.handleClick = this.handleClick.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.reset = this.reset.bind(this);
  }

  handleClick() {
    this.clicks++;
    return this.clicks;
  }

  handleHover() {
    return `hover: ${this.label}`;
  }

  handleFocus() {
    return `focus: ${this.label}`;
  }

  reset() {
    this.clicks = 0;
    return this.clicks;
  }
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="createRateLimiter" exercises/01-javascript-core/unit-14-this/exercises.test.js
export function createRateLimiter(limit) {
  throw new Error("not implemented: createRateLimiter");
}
