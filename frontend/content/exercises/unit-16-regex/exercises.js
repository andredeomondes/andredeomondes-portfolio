// Unidade 16 — Regular expressions
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="isValidEmailSimple" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function isValidEmailSimple(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

// test: node --test --test-name-pattern="extractNumbers" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function extractNumbers(str) {
  throw new Error("not implemented: extractNumbers");
}

// test: node --test --test-name-pattern="maskCreditCard" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function maskCreditCard(str) {
  throw new Error("not implemented: maskCreditCard");
}

// test: node --test --test-name-pattern="countWordOccurrences" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function countWordOccurrences(text, word) {
  throw new Error("not implemented: countWordOccurrences");
}

// test: node --test --test-name-pattern="slugify" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function slugify(str) {
  throw new Error("not implemented: slugify");
}

// test: node --test --test-name-pattern="extractHashtags" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function extractHashtags(text) {
  throw new Error("not implemented: extractHashtags");
}

// test: node --test --test-name-pattern="isStrongPassword" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function isStrongPassword(str) {
  throw new Error("not implemented: isStrongPassword");
}

// test: node --test --test-name-pattern="normalizeWhitespace" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function normalizeWhitespace(str) {
  throw new Error("not implemented: normalizeWhitespace");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="parseQueryString" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function parseQueryString(str) {
  throw new Error("not implemented: parseQueryString");
}

// test: node --test --test-name-pattern="extractDateParts" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function extractDateParts(str) {
  throw new Error("not implemented: extractDateParts");
}

// test: node --test --test-name-pattern="replaceTemplateVars" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function replaceTemplateVars(template, data) {
  throw new Error("not implemented: replaceTemplateVars");
}

// test: node --test --test-name-pattern="splitOnMultipleDelimiters" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function splitOnMultipleDelimiters(str) {
  throw new Error("not implemented: splitOnMultipleDelimiters");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="isValidPhoneNumber" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function isValidPhoneNumber(str) {
  // Sintoma relatado: strings como "abc123-456-7890xyz" (lixo antes e
  // depois de um número válido) estão sendo aceitas como telefones
  // válidos, quando deveriam ser rejeitadas.
  const pattern = /\d{3}-\d{3}-\d{4}/;
  return pattern.test(str);
}

// test: node --test --test-name-pattern="extractAllPrices" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function extractAllPrices(text) {
  // Sintoma relatado: quando o texto tem mais de um preço, apenas o
  // primeiro é retornado — os demais somem.
  const pattern = /R\$\s?(\d+(?:[.,]\d{2})?)/;
  const matches = text.match(pattern);
  return matches ? [matches[0]] : [];
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// a repetição de testes de regex sequenciais, mantendo o mesmo
// comportamento observável.

// test: node --test --test-name-pattern="messyValidateUsername" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function messyValidateUsername(str) {
  if (typeof str !== "string") {
    return false;
  }
  if (str.length < 3 || str.length > 16) {
    return false;
  }
  if (!/^[a-zA-Z]/.test(str)) {
    return false;
  }
  if (/[^a-zA-Z0-9_]/.test(str)) {
    return false;
  }
  if (/__/.test(str)) {
    return false;
  }
  return true;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="parseLogLine" exercises/01-javascript-core/unit-16-regex/exercises.test.js
export function parseLogLine(line) {
  throw new Error("not implemented: parseLogLine");
}
