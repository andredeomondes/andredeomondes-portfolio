// Unidade 1 — Valores, tipos e operadores
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

export function classifyValue(value) {
  if (value === null) {
    return "null";
  } else if (Number.isNaN(value)) {
    return "nan";
  } else if (Array.isArray(value)) {
    return "array";
  } else {
    return typeof value;
  }
}

export function isTruthyManually(value) {
  const falsyValues = [0, "", null, undefined, NaN, false];
  return !falsyValues.includes(value);
}

export function compareLooseAndStrict(a, b) {
  // { loose: a == b, strict: a === b }
  const isLoose = a == b;
  const isStrict = a === b;
  return {
    loose: isLoose,
    strict: isStrict,
  };
}

export function coerceToNumberManually(value) {
  // "10" -> 10
  if (typeof value === "string") {
    return +value;
  }
  // "" -> 0
  if (value === "") {
    return 0;
  }
  // true -> 1
  if (value === true) {
    return 1;
  }
  //  false -> 0
  if (value === false) {
    return 0;
  }
  // null -> 0
  if (value === null) {
    return 0;
  }
  // undefined = NaN
  if (value === undefined) {
    return NaN;
  }

  // number
  if (typeof value === "number") {
    return value;
  }
  //

  // [] -> 0
  if (Array.isArray(value) && value.length === 0) {
    return 0;
  }
  // [5] ->
  if (Array.isArray(value) && value.length === 1) {
    return value[0];
  }
  // [5...] NaN
  if (Array.isArray(value) && value.length > 1) {
    return NaN;
  }
}

export function sumOnlyNumbers(...values) {
  let total = 0;

  for (const value of values) {
    if (typeof value === "number") {
      total += value;
    }
  }

  return total;
}

export function concatenateAsStrings(...values) {
  let concatenatedStrings = "";

  for (const value of values) {
    String(value);
    concatenatedStrings += value;
  }

  return concatenatedStrings;
}

export function clampNumber(value, min, max) {
  // Validar tipo de numero das variaveis "value", "min", "max"
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError("Numero inválido!");
  }

  if (typeof min !== "number" || Number.isNaN(min)) {
    throw new TypeError("Numero inválido!");
  }

  if (typeof max !== "number" || Number.isNaN(max)) {
    throw new TypeError("Numero inválido!");
  }
  // Se o valor for menor que minimo retorna minimo
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  } else {
    return value;
  }
}

export function isSameValueZero(a, b) {
  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  } else if (a === b) {
    return true;
  } else {
    return false;
  }
}

// --- Intermediários --------------------------------------------------------

export function parsePercentageString(str) {
  if (!(typeof str === "string")) {
    return null;
  }

  if (!str.endsWith("%")) {
    return null;
  }

  str = parseFloat(str.slice(0, -1));

  if (Number.isNaN(str)) {
    return null;
  }
  return str / 100;
}

export function normalizeBooleanish(value) {
  const truthyValues = ["true", "yes", "1"];
  const falsyValues = ["false", "no", "0"];

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  if (truthyValues.includes(value.toLowerCase())) {
    return true;
  }

  if (falsyValues.includes(value.toLowerCase())) {
    return false;
  }

  return null;
}

export function safeDivide(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("Tipo number inválido");
  }

  if (b === 0) {
    throw new RangeError("Divisão por 0 é indefinido matematicamente");
  }

  return a / b;
}

export function deepTypeOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}
/*
12. **`deepTypeOf(value)`** — vai além de `typeof`: distingue
    `"array"`, `"date"`, `"regexp"`, `"map"`, `"set"`, `"null"` e
    `"object"` (para os demais objetos simples).
*/

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

export function fixEqualityBug(users, id) {
  // Sintoma relatado: buscar pelo id "" (string vazia) às vezes retorna
  // o usuário de id 0, quando deveria retornar undefined.
  return users.find((u) => String(u.id) === String(id));
}

export function fixCoercionBug(cart) {
  // Sintoma relatado: quando algum item chega com "price" como string
  // (ex: vindo de um formulário), o total final vem errado — vira uma
  // string concatenada em vez de uma soma numérica.
  let total = 0;
  for (const item of cart) {
    total += Number(item.price);
  }
  return total;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// aninhamento e duplicação, mantendo o mesmo comportamento observável.

export function refactorDiscountTier(amount) {
  if (amount >= 1000) {
    return 0.15;
  }
  if (amount >= 500) {
    return 0.1;
  }
  if (amount >= 100) {
    return 0.05;
  }
  return 0;
}

// --- Desafio integrador -------------------------------------------------------

export function normalizeOrderInput(rawOrder) {
  rawOrder.price = Number(rawOrder.price);
  rawOrder.quantity = Number(rawOrder.quantity);

  if (Number.isNaN(rawOrder.price)) {
    throw new TypeError("Não é um número: " + rawOrder.price);
  }

  if (Number.isNaN(rawOrder.quantity)) {
    throw new TypeError("Não é um número: " + rawOrder.quantity);
  }

  if (rawOrder.price < 0) {
    throw new TypeError("Price não pode ser negativo: " + rawOrder.price);
  }

  return {
    price: rawOrder.price,
    quantity: rawOrder.quantity,
    total: Math.round(rawOrder.price * rawOrder.quantity * 100) / 100,
  };
}
/*

16. **`normalizeOrderInput(rawOrder)`** — recebe um objeto que simula o
    corpo de uma requisição HTTP, onde `price` e `quantity` podem chegar
    como `string` ou `number`. Deve:
    - validar que `price` e `quantity`, depois de convertidos, são
      números válidos e não negativos;
    - lançar `TypeError` com mensagem descritiva quando inválidos;
    - retornar `{ price: number, quantity: number, total: number }`
      com `total = price * quantity`.

    Este exercício combina classificação de tipo, coerção e validação —
    os mesmos três temas da unidade.
 */
