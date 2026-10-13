// Unidade 24 — JSON
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="toJsonString" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function toJsonString(value) {
  throw new Error("not implemented: toJsonString");
}

// test: node --test --test-name-pattern="prettyJsonString" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function prettyJsonString(value) {
  throw new Error("not implemented: prettyJsonString");
}

// test: node --test --test-name-pattern="parseJsonOrDefault" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function parseJsonOrDefault(text, defaultValue) {
  throw new Error("not implemented: parseJsonOrDefault");
}

// test: node --test --test-name-pattern="stripUndefinedFields" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function stripUndefinedFields(obj) {
  throw new Error("not implemented: stripUndefinedFields");
}

// test: node --test --test-name-pattern="roundTripEquality" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function roundTripEquality(value) {
  throw new Error("not implemented: roundTripEquality");
}

// test: node --test --test-name-pattern="deepCloneViaJson" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function deepCloneViaJson(value) {
  throw new Error("not implemented: deepCloneViaJson");
}

// test: node --test --test-name-pattern="jsonStringByteSize" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function jsonStringByteSize(value) {
  throw new Error("not implemented: jsonStringByteSize");
}

// test: node --test --test-name-pattern="isValidJson" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function isValidJson(text) {
  throw new Error("not implemented: isValidJson");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="maskSensitiveFields" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function maskSensitiveFields(obj, sensitiveKeys) {
  throw new Error("not implemented: maskSensitiveFields");
}

// test: node --test --test-name-pattern="reviveDates" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function reviveDates(text) {
  throw new Error("not implemented: reviveDates");
}

// test: node --test --test-name-pattern="parseNdjson" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function parseNdjson(text) {
  throw new Error("not implemented: parseNdjson");
}

// test: node --test --test-name-pattern="safeMerge" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function safeMerge(base, patchJsonText) {
  throw new Error("not implemented: safeMerge");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="serializeUserProfileBuggy" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function serializeUserProfileBuggy(user) {
  // Sintoma relatado: o campo `passwordHash` do usuário está aparecendo no
  // JSON enviado para o front-end, vazando dados sensíveis que nunca
  // deveriam sair do servidor.
  return JSON.stringify(user);
}

// test: node --test --test-name-pattern="parseConfigBuggy" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function parseConfigBuggy(configText) {
  // Sintoma relatado: quando o arquivo de configuração vem corrompido
  // (JSON malformado), o processo inteiro derruba com uma exceção não
  // tratada em vez de cair de volta para a configuração padrão.
  const defaultConfig = { retries: 3, timeoutMs: 5000 };
  const parsed = JSON.parse(configText);
  return { ...defaultConfig, ...parsed };
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// aninhamento e duplicação, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorNormalizeApiResponse" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function refactorNormalizeApiResponse(responseText) {
  let data;
  try {
    data = JSON.parse(responseText);
  } catch (err) {
    return { ok: false, error: "invalid json", data: null };
  }
  if (data !== null) {
    if (typeof data === "object") {
      if (!Array.isArray(data)) {
        if (Object.prototype.hasOwnProperty.call(data, "error")) {
          return { ok: false, error: String(data.error), data: null };
        } else {
          return { ok: true, error: null, data: data };
        }
      } else {
        return { ok: true, error: null, data: data };
      }
    } else {
      return { ok: false, error: "expected an object or array", data: null };
    }
  } else {
    return { ok: false, error: "expected an object or array", data: null };
  }
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="buildOrderReport" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function buildOrderReport(ordersJsonText) {
  throw new Error("not implemented: buildOrderReport");
}
