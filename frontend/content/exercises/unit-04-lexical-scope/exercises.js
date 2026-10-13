// Unidade 4 — Escopo léxico
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="sumUsingBlockScope" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function sumUsingBlockScope(a, b) {
  let result;
  {
    let sum = a + b;
    result = sum;
  }
  return result;
}

// test: node --test --test-name-pattern="maxOfThreeBlockScoped" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function maxOfThreeBlockScoped(a, b, c) {
  {
    let maior = a;

    if (b > maior) {
      maior = b;
    }

    if (c > maior) {
      maior = c;
    }

    return maior;
  }
}
// test: node --test --test-name-pattern="describeShadowing" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function describeShadowing(outerValue) {
  const original = outerValue;
  let inner;
  {
    let outerValue = original + 10;
    inner = outerValue;
  }
  return {
    outer: outerValue,
    inner: inner,
  };
}

// test: node --test --test-name-pattern="trackLastEvenFunctionScoped" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function trackLastEvenFunctionScoped(numbers) {
  var lastEven;

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] % 2 === 0) {
      lastEven = numbers[i];
    }
  }

  return lastEven;
}

// test: node --test --test-name-pattern="pushIntoConstArray" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function pushIntoConstArray(items) {
  const arr = [];

  for (let i = 0; i < items.length; i++) {
    arr.push(items[i]);
  }

  return arr;
}

// test: node --test --test-name-pattern="reassignLetInLoop" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function reassignLetInLoop(start, times) {
  let counter = start;
  let i = 0;
  while (i < times) {
    counter += 1;
    i += 1;
  }
  return counter;
}

// test: node --test --test-name-pattern="attemptConstReassignment" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function attemptConstReassignment() {
  const valor = 1;
  try {
    valor = 2;
  } catch (erro) {
    return erro instanceof TypeError;
  }
  return false;
}
// test: node --test --test-name-pattern="nestedBlockCounter" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function nestedBlockCounter(operations) {
  let count = 0;
  for (let i = 0; i < operations.length; i++) {
    count += Number(operations[i]);
  }
  return count;
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="hoistedFunctionCall" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function hoistedFunctionCall() {
  return helper();
  function helper() {
    return "hoisted";
  }
}

// test: node --test --test-name-pattern="varDeclaredValueBeforeAssignment" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function varDeclaredValueBeforeAssignment() {
  const result = typeof x;
  var x = 10;
  return result;
}

// test: node --test --test-name-pattern="compareVarAndLetLeak" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function compareVarAndLetLeak(shouldRun) {
  if (shouldRun) {
    var leakyVar = "vazou";
    let scopedLet = "não vazou";
  } else {
    return { varLeaked: false, letLeaked: false };
  }

  const varLeaked = typeof leakyVar !== "undefined";
  const letLeaked = typeof scopedLet !== "undefined";
  return {
    varLeaked,
    letLeaked,
  };
}
// test: node --test --test-name-pattern="createIifeCounter" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function createIifeCounter() {
  return (function () {
    let count = 0;
    return {
      increment() {
        count = count += 1;
      },
      getValue() {
        return count;
      },
    };
  })();
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="sumOrderTotals" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function sumOrderTotals(items) {
  // Sintoma relatado: o total final vem sempre igual ao valor do último
  // item da lista, como se os anteriores tivessem sido ignorados.
  var total = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].hasFee) {
      total += items[i].price * 1.1;
    } else {
      total += items[i].price;
    }
  }
  return total;
}

// test: node --test --test-name-pattern="computeDiscountedPrice" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function computeDiscountedPrice(price, isMember) {
  // Sintoma relatado: chamar a função com isMember = true lança
  // "Cannot access 'discount' before initialization" em vez de aplicar o
  // desconto normalmente.
  let finalPrice = 0;
  if (isMember) {
    let discount = 0.1;
    finalPrice = price * (1 - discount);
  } else {
    finalPrice = price;
  }
  return finalPrice;
}
// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para usar
// `const`/`let` no lugar de `var`, restringindo cada variável ao menor
// escopo possível, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorScoreSummary" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function refactorScoreSummary(scores) {
  let total = 0;
  let max = -Infinity;
  let min = Infinity;
  for (let i = 0; i < scores.length; i++) {
    let s = scores[i];
    total += s;
    if (s > max) {
      max = s;
    }
    if (s < min) {
      min = s;
    }
  }
  const avg = total / scores.length;
  return { total: total, max: max, min: min, average: avg };
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="createSequentialIdGenerator" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function createSequentialIdGenerator(prefix) {
  let count = 0;

  return function nextId() {
    count += 1;

    return `${prefix}-${count}`;
  };
}
