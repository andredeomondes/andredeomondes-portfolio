// Unidade 5 — Closures
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="makeCounter" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function makeCounter(start = 0) {
  let count = start;
  return function increment() {
    count++;
    return count;
  };
}

// test: node --test --test-name-pattern="makeGreeter" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function makeGreeter(greeting) {
  return (name) => `Prezado(a), ${name}!`;
}

// test: node --test --test-name-pattern="createBankAccount" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createBankAccount(initialBalance = 0) {
  return {
    deposit(amount) {
      if (amount <= 0) {
        throw new RangeError(`valor inválido`);
      }

      return (initialBalance += amount);
    },
    withdraw(amount) {
      if (amount <= 0) {
        throw new RangeError(`valor inválido`);
      }
      if (initialBalance < amount) {
        throw new Error(`saldo insuficiente`);
      }
      return (initialBalance -= amount);
    },
    getBalance() {
      return initialBalance;
    },
  };
}

// test: node --test --test-name-pattern="onceFn" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function onceFn(fn) {
  let count = 0;
  let result;
  return function wrapped() {
    if (count == 0) {
      result = fn();
    }
    count++;
    return result;
  };
}

// test: node --test --test-name-pattern="createToggle" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createToggle(initial = false) {
  return function () {
    initial = !initial;
    return initial;
  };
}

// test: node --test --test-name-pattern="createAccumulator" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createAccumulator(initial = 0) {
  return function add(n) {
    return (initial += n);
  };
}

// test: node --test --test-name-pattern="createStack" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createStack() {
  let stack = [];

  return {
    push(item) {
      return stack.push(item);
    },
    pop() {
      return stack.pop();
    },
    peek() {
      return stack[stack.length - 1];
    },
    size() {
      return stack.length;
    },
  };
}

// test: node --test --test-name-pattern="rememberLastCall" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function rememberLastCall(fn) {
  let lastCall = null;

  function wrapped(...args) {
    const result = fn(...args);
    lastCall = { args, result };
    return result;
  }

  wrapped.getLastCall = function () {
    return lastCall || null;
  };

  return wrapped;
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="createLoopClosuresFixed" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createLoopClosuresFixed(n) {
  let fns = [];
  for (let i = 0; i < n; i++) {
    fns.push(() => i);
  }
  return fns;
}

// test: node --test --test-name-pattern="memoize" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function memoize(fn) {
  const cache = new Map();

  return function wrapper(arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    }

    const result = fn(arg);
    cache.set(arg, result);

    return result;
  };
}

// test: node --test --test-name-pattern="createEventEmitter" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createEventEmitter() {
  const listeners = new Map();

  return {
    on(event, handler) {
      if (!listeners.has(event)) {
        listeners.set(event, []);
      }
      listeners.get(event).push(handler);
    },
    off(event, handler) {
      listeners.set(
        event,
        listeners.get(event).filter((item) => item !== handler),
      );
    },
    emit(event, payload) {
      if (listeners.has(event)) {
        listeners.get(event).forEach((fn) => fn(payload));
      }
    },
  };
}

// test: node --test --test-name-pattern="limitCalls" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function limitCalls(fn, maxCalls) {
  let count = 0;
  let result;
  return function wrapped(...args) {
    if (count < maxCalls) {
      count++;
      return fn(...args);
    }
  };
  return undefined;
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="createLoopClosuresBuggy" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createLoopClosuresBuggy(n) {
  // Sintoma relatado: era esperado que a função na posição i do array
  // retornasse i quando chamada (fns[0]() === 0, fns[1]() === 1, etc.),
  // mas todas as funções retornam o mesmo valor, igual a n.
  const fns = [];
  for (let i = 0; i < n; i++) {
    fns.push(function () {
      return i;
    });
  }
  return fns;
}

// test: node --test --test-name-pattern="createSharedCounterPair" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createSharedCounterPair() {
  // Sintoma relatado: era esperado que increment() e decrement() operassem
  // sobre o MESMO contador (compartilhado pela mesma closure), mas
  // decrement() sempre parece operar sobre um contador independente que
  // nunca é afetado por increment().
  let count = 0;
  function increment() {
    count += 1;
    return count;
  }
  function decrement() {
    count -= 1;
    return count;
  }
  return { increment, decrement };
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// duplicação e deixar o uso da closure mais claro, mantendo o mesmo
// comportamento observável.

// test: node --test --test-name-pattern="refactorCreateValidator" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function refactorCreateValidator(min, max) {
  return function (value) {
    if (typeof value == "number" && value >= min && value <= max) {
      return true;
    }
    return false;
  };
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="createRateLimiter" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createRateLimiter(maxCalls) {
  let count = 0;
  return {
    attempt() {
      if (count < maxCalls) {
        count++;
        return true;
      }
      return false;
    },
    reset() {
      count = 0;
    },
  };
}
