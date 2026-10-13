// Unidade 8 — Funções de alta ordem
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="applyOperation" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function applyOperation(a, b, operation) {
  return operation(a, b);
}

// test: node --test --test-name-pattern="makeAdder" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function makeAdder(x) {
  return (y) => x + y;
}

// test: node --test --test-name-pattern="makeMultiplier" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function makeMultiplier(factor) {
  return (n) => n * factor;
}

// test: node --test --test-name-pattern="invertPredicate" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function invertPredicate(predicate) {
  return (...args) => !predicate(...args);
}

// test: node --test --test-name-pattern="repeatCall" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function repeatCall(n, fn) {
  const result = [];
  for (let i = 0; i < n; i++) {
    const f = fn(i);
    result.push(f);
  }

  return result;
}

// test: node --test --test-name-pattern="pipeTwo" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function pipeTwo(f, g) {
  return (x) => g(f(x));
}

// test: node --test --test-name-pattern="composeTwo" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function composeTwo(f, g) {
  return (x) => f(g(x));
}

// test: node --test --test-name-pattern="once" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function once(fn) {
  let called = false;
  let result;
  return function () {
    if (called == false) {
      result = fn();
    }
    called = true;
    return result;
  };
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="makeCounter" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function makeCounter(start = 0) {
  let counter = start;
  function increment() {
    counter++;
    return counter;
  }

  function decrement() {
    counter--;
    return counter;
  }

  function value() {
    return counter;
  }

  return {
    increment: increment,
    decrement: decrement,
    value: value,
  };
}

// test: node --test --test-name-pattern="curry3" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function curry3(fn) {
  return (a) => (b) => (c) => fn(a, b, c);
}

// test: node --test --test-name-pattern="memoize" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function memoize(fn) {
  const cache = new Map();
  return function (arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    }
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

// test: node --test --test-name-pattern="pipeAll" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function pipeAll(...fns) {
  return function (x) {
    for (const item of fns) {
      x = item(x);
    }
    return x;
  };
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixOnceBug" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function fixOnceBug(fn) {
  // Sintoma relatado: a função retornada por `fixOnceBug` deveria executar
  // `fn` apenas na primeira chamada e devolver o mesmo resultado guardado
  // nas chamadas seguintes, mas `fn` está sendo executada toda vez.
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      result = fn(...args);
      called = true;
    }
    return result;
  };
}

// test: node --test --test-name-pattern="fixCounterClosureBug" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function fixCounterClosureBug() {
  // Sintoma relatado: a função `increment` retornada deveria aumentar e
  // lembrar o valor de `count` a cada chamada, mas ela sempre retorna 1,
  // como se `count` fosse reiniciado toda vez.
  let count = 0;
  function increment() {
    count++;
    return count;
  }
  return increment;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// duplicação usando composição de funções, mantendo o mesmo comportamento
// observável.

// test: node --test --test-name-pattern="refactorMessyPipeline" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function refactorMessyPipeline(value) {
  const addOne = (n) => ++n;
  const double = (n) => n * 2;
  return pipeAll(addOne, double, addOne, double, addOne)(value);
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="buildValidationPipeline" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function buildValidationPipeline(rules) {
  return function (value) {
    const messages = [];
    for (const rule of rules) {
      if (!rule.test(value)) {
        messages.push(rule.message);
      }
    }
    return messages;
  };
}
