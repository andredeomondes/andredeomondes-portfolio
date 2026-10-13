// Unidade 2 — Controle de fluxo
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="classifyTriangle" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function classifyTriangle(a, b, c) {
  if (a <= 0 || b <= 0 || c <= 0) {
    return "invalid";
  }
  if (a + b <= c || a + c <= b || b + c <= a) {
    return "invalid";
  }

  if (a === b && b === c) {
    return "equilateral";
  }

  if ((a === b && a !== c) || (a === c && a !== b) || (b === c && b !== a)) {
    return "isosceles";
  }

  if (a !== b && a !== c && b !== c) {
    return "scalene";
  }
  return "invalid";
}

// test: node --test --test-name-pattern="fizzBuzzRange" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function fizzBuzzRange(start, end) {
  const result = [];
  for (let i = start; i <= end; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      result.push("FizzBuzz");
    } else if (i % 3 === 0) {
      result.push("Fizz");
    } else if (i % 5 === 0) {
      result.push("Buzz");
    } else {
      result.push(String(i));
    }
  }

  return result;
}

// test: node --test --test-name-pattern="countVowels" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function countVowels(str) {
  const vowels = ["a", "e", "i", "o", "u"];
  let count = 0;

  str = str.toLowerCase();

  for (let i = 0; i < str.length; i++) {
    if (vowels.includes(str[i])) {
      count++;
    }
  }
  return count;
}

// test: node --test --test-name-pattern="findFirstNegative" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function findFirstNegative(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] < 0) {
      return numbers[i];
    }
  }
  return undefined;
}

// test: node --test --test-name-pattern="sumUntilNegative" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function sumUntilNegative(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] >= 0) {
      sum += numbers[i];
    } else {
      return sum;
    }
  }
  return sum;
}

// test: node --test --test-name-pattern="daysInMonth" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function daysInMonth(month, year) {
  switch (month) {
    case 1:
      return 31;
      break;
    case 2:
      if (year % 400 == 0) {
        return 29;
      }
      if (year % 4 == 0 && year % 100 != 0) {
        return 29;
      }
      return 28;
      break;
    case 3:
      return 31;
      break;
    case 4:
      return 30;
      break;
    case 5:
      return 31;
      break;
    case 6:
      return 30;
      break;
    case 7:
      return 31;
      break;
    case 8:
      return 31;
      break;
    case 9:
      return 30;
      break;
    case 10:
      return 31;
      break;
    case 11:
      return 30;
      break;
    case 12:
      return 31;
      break;
  }
}

// test: node --test --test-name-pattern="gradeLabel" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function gradeLabel(score) {
  if (score < 0 || score > 100) {
    throw new RangeError("A nota deve estar entre 0 e 100.");
  }

  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

// test: node --test --test-name-pattern="reverseStringLoop" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function reverseStringLoop(str) {
  if (!str) {
    return str;
  }
  let result = "";

  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }

  return result;
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="flattenShallow" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function flattenShallow(arrayOfArrays) {
  let oneArray = [];
  for (let i = 0; i < arrayOfArrays.length; i++) {
    for (let j = 0; j < arrayOfArrays[i].length; j++) {
      oneArray.push(arrayOfArrays[i][j]);
    }
  }
  return oneArray;
}

// test: node --test --test-name-pattern="findDuplicateLoop" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function findDuplicateLoop(arr) {
  let seen = [];
  for (let i = 0; i < arr.length; i++) {
    if (seen.includes(arr[i])) {
      return arr[i];
    }

    seen.push(arr[i]);
  }
  return null;
}

// test: node --test --test-name-pattern="matrixDiagonalSum" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function matrixDiagonalSum(matrix) {
  let sum = 0;
  for (let i = 0; i < matrix.length; i++) {
    sum += matrix[i][i];
  }
  return sum;
}

// test: node --test --test-name-pattern="safeGetNested" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function safeGetNested(obj, path, defaultValue) {
  let current = obj;
  for (let i = 0; i < path.length; i++) {
    if (current == undefined || current == null) {
      return defaultValue;
    } else {
      current = current[path[i]];
    }
  }
  return current; // <- aqui, depois do } que fecha o for
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixOffByOneLoop" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function fixOffByOneLoop(items) {
  // Sintoma relatado: ao somar os tamanhos (`.length`) de uma lista de
  // strings, o resultado vem maior que o esperado e o programa às vezes
  // lança "Cannot read properties of undefined" para listas curtas.
  let totalLength = 0;
  for (let i = 0; i < items.length; i++) {
    totalLength += items[i].length;
  }
  return totalLength;
}

// test: node --test --test-name-pattern="fixSwitchFallthroughBug" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function fixSwitchFallthroughBug(status) {
  // Sintoma relatado: pedidos com status "paid" estão sendo rotulados como
  // "Reembolsado" na interface, o que confunde o time de suporte.
  let label;
  switch (status) {
    case "pending":
      label = "Pendente";
      break;
    case "paid":
      label = "Pago";
      break;
    case "refunded":
      label = "Reembolsado";
      break;
    case "cancelled":
      label = "Cancelado";
      break;
    default:
      label = "Desconhecido";
      break;
  }
  return label;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// aninhamento e duplicação, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorNestedConditionals" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function refactorNestedConditionals(user) {
  if (!user) {
    return "usuário inválido";
  }
  if (!user.active) {
    return "conta inativa";
  }
  if (user.age < 18) {
    return "menor de idade";
  }
  if (!user.verified) {
    return "precisa verificar conta";
  }
  return "elegível";
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="classifyAndSummarizeOrders" exercises/01-javascript-core/unit-02-control-flow/exercises.test.js
export function classifyAndSummarizeOrders(orders) {
  let resultado = {
    pending: 0,
    paid: 0,
    cancelled: 0,
    refunded: 0,
    totalRevenue: 0,
  };

  for (const order of orders) {
    switch (order.status) {
      case "pending":
        resultado.pending += 1;
        break;
      case "paid":
        resultado.totalRevenue += order.amount;
        resultado.paid += 1;
        break;
      case "cancelled":
        resultado.cancelled += 1;
        break;
      case "refunded":
        resultado.totalRevenue -= order.amount;
        resultado.refunded += 1;
        break;
    }
  }
  return resultado;
}
