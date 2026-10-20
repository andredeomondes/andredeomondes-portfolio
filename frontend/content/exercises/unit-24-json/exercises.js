// Unidade 24 — JSON
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="toJsonString" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function toJsonString(value) {
  return JSON.stringify(value);
}

// test: node --test --test-name-pattern="prettyJsonString" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function prettyJsonString(value) {
  return JSON.stringify(value, null, 2);
}

// test: node --test --test-name-pattern="parseJsonOrDefault" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function parseJsonOrDefault(text, defaultValue) {
  try {
    return JSON.parse(text);
  } catch {
    return defaultValue;
  }
}

// test: node --test --test-name-pattern="stripUndefinedFields" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function stripUndefinedFields(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  );
}

// test: node --test --test-name-pattern="roundTripEquality" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function roundTripEquality(value) {
  let roundTripped;

  try {
    roundTripped = JSON.parse(JSON.stringify(value));
  } catch {
    return false;
  }

  function isEqual(original, parsed) {
    if (Object.is(original, parsed)) return true;
    if (original === null || parsed === null) return false;
    if (typeof original !== "object" || typeof parsed !== "object") return false;
    if (original instanceof Date || parsed instanceof Date) return false;
    if (Array.isArray(original) !== Array.isArray(parsed)) return false;

    const originalKeys = Object.keys(original);
    const parsedKeys = Object.keys(parsed);
    if (originalKeys.length !== parsedKeys.length) return false;

    return originalKeys.every(
      (key) => Object.hasOwn(parsed, key) && isEqual(original[key], parsed[key]),
    );
  }

  return isEqual(value, roundTripped);
}

// test: node --test --test-name-pattern="deepCloneViaJson" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function deepCloneViaJson(value) {
  return JSON.parse(JSON.stringify(value));
}

// test: node --test --test-name-pattern="jsonStringByteSize" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function jsonStringByteSize(value) {
  return Buffer.byteLength(JSON.stringify(value), "utf8");
}

// test: node --test --test-name-pattern="isValidJson" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function isValidJson(text) {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="maskSensitiveFields" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function maskSensitiveFields(obj, sensitiveKeys) {
  const sensitive = new Set(sensitiveKeys);

  function visit(value) {
    if (Array.isArray(value)) return value.map(visit);
    if (value === null || typeof value !== "object") return value;

    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        sensitive.has(key) ? "***" : visit(nestedValue),
      ]),
    );
  }

  return visit(obj);
}

// test: node --test --test-name-pattern="reviveDates" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function reviveDates(text) {
  const isoDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

  return JSON.parse(text, (_key, value) =>
    typeof value === "string" && isoDate.test(value) ? new Date(value) : value,
  );
}

// test: node --test --test-name-pattern="parseNdjson" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function parseNdjson(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

// test: node --test --test-name-pattern="safeMerge" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function safeMerge(base, patchJsonText) {
  let patch;

  try {
    patch = JSON.parse(patchJsonText);
  } catch (error) {
    throw new Error("JSON inválido no patch", { cause: error });
  }

  if (patch === null || Array.isArray(patch) || typeof patch !== "object") {
    throw new TypeError("O patch deve ser um objeto JSON válido");
  }

  const safePatch = Object.fromEntries(
    Object.entries(patch).filter(
      ([key]) => !["__proto__", "prototype", "constructor"].includes(key),
    ),
  );

  return { ...base, ...safePatch };
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
  const { passwordHash: _passwordHash, ...publicProfile } = user;
  return JSON.stringify(publicProfile);
}

// test: node --test --test-name-pattern="parseConfigBuggy" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function parseConfigBuggy(configText) {
  // Sintoma relatado: quando o arquivo de configuração vem corrompido
  // (JSON malformado), o processo inteiro derruba com uma exceção não
  // tratada em vez de cair de volta para a configuração padrão.
  const defaultConfig = { retries: 3, timeoutMs: 5000 };
  try {
    const parsed = JSON.parse(configText);
    return { ...defaultConfig, ...parsed };
  } catch {
    return defaultConfig;
  }
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
  } catch {
    return { ok: false, error: "invalid json", data: null };
  }

  if (data === null || typeof data !== "object") {
    return { ok: false, error: "expected an object or array", data: null };
  }

  if (!Array.isArray(data) && Object.hasOwn(data, "error")) {
    return { ok: false, error: String(data.error), data: null };
  }

  return { ok: true, error: null, data };
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="buildOrderReport" exercises/01-javascript-core/unit-24-json/exercises.test.js
export function buildOrderReport(ordersJsonText) {
  let orders;

  try {
    orders = JSON.parse(ordersJsonText);
  } catch (error) {
    throw new Error("JSON de pedidos inválido", { cause: error });
  }

  if (!Array.isArray(orders)) {
    throw new TypeError("O JSON de pedidos deve conter uma lista");
  }

  const report = orders.reduce(
    (summary, order) => {
      summary.totalOrders += 1;
      summary.byStatus[order.status] = (summary.byStatus[order.status] ?? 0) + 1;
      if (order.status === "paid") summary.totalRevenue += order.amount;
      return summary;
    },
    { totalOrders: 0, totalRevenue: 0, byStatus: {} },
  );

  return JSON.stringify(report, null, 2);
}
