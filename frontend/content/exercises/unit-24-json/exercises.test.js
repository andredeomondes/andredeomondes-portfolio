import { test } from "node:test";
import assert from "node:assert/strict";

import {
  toJsonString,
  prettyJsonString,
  parseJsonOrDefault,
  stripUndefinedFields,
  roundTripEquality,
  deepCloneViaJson,
  jsonStringByteSize,
  isValidJson,
  maskSensitiveFields,
  reviveDates,
  parseNdjson,
  safeMerge,
  serializeUserProfileBuggy,
  parseConfigBuggy,
  refactorNormalizeApiResponse,
  buildOrderReport,
} from "./exercises.js";

// --- toJsonString --------------------------------------------------------

test("toJsonString: serializa valores simples e objetos sem espaçamento", () => {
  assert.equal(toJsonString({ a: 1, b: "x" }), '{"a":1,"b":"x"}');
  assert.equal(toJsonString([1, 2, 3]), "[1,2,3]");
  assert.equal(toJsonString(null), "null");
});

// --- prettyJsonString ------------------------------------------------------

test("prettyJsonString: serializa com indentação de 2 espaços", () => {
  assert.equal(prettyJsonString({ a: 1 }), '{\n  "a": 1\n}');
});

// --- parseJsonOrDefault -----------------------------------------------------

test("parseJsonOrDefault: retorna o valor parseado quando o JSON é válido", () => {
  assert.deepEqual(parseJsonOrDefault('{"a":1}', {}), { a: 1 });
});

test("parseJsonOrDefault: retorna o default quando o JSON é inválido", () => {
  assert.deepEqual(parseJsonOrDefault("{invalid", { fallback: true }), {
    fallback: true,
  });
  assert.equal(parseJsonOrDefault("not json at all", null), null);
});

// --- stripUndefinedFields ----------------------------------------------------

test("stripUndefinedFields: remove chaves com valor undefined", () => {
  assert.deepEqual(stripUndefinedFields({ a: 1, b: undefined, c: "x" }), {
    a: 1,
    c: "x",
  });
});

test("stripUndefinedFields: mantém null (não é undefined)", () => {
  assert.deepEqual(stripUndefinedFields({ a: null, b: undefined }), { a: null });
});

// --- roundTripEquality --------------------------------------------------------

test("roundTripEquality: valores simples sobrevivem ao round-trip", () => {
  assert.equal(roundTripEquality(42), true);
  assert.equal(roundTripEquality("hello"), true);
  assert.equal(roundTripEquality({ a: 1, b: [1, 2, 3] }), true);
});

test("roundTripEquality: Date vira string e deixa de ser igual", () => {
  assert.equal(roundTripEquality(new Date()), false);
});

test("roundTripEquality: campos undefined somem no round-trip", () => {
  assert.equal(roundTripEquality({ a: undefined }), false);
});

test("roundTripEquality: NaN vira null no round-trip", () => {
  assert.equal(roundTripEquality(NaN), false);
});

// --- deepCloneViaJson ----------------------------------------------------------

test("deepCloneViaJson: clona profundamente, sem compartilhar referências aninhadas", () => {
  const original = { user: { name: "Ana", tags: ["a", "b"] } };
  const clone = deepCloneViaJson(original);
  clone.user.name = "Bruno";
  clone.user.tags.push("c");
  assert.equal(original.user.name, "Ana");
  assert.deepEqual(original.user.tags, ["a", "b"]);
  assert.deepEqual(clone, { user: { name: "Bruno", tags: ["a", "b", "c"] } });
});

// --- jsonStringByteSize ------------------------------------------------------------

test("jsonStringByteSize: tamanho em bytes considera caracteres multi-byte", () => {
  assert.equal(
    jsonStringByteSize({ text: "abc" }),
    Buffer.byteLength('{"text":"abc"}', "utf8"),
  );
  const withEmoji = { text: "café 😀" };
  const expected = Buffer.byteLength(JSON.stringify(withEmoji), "utf8");
  assert.equal(jsonStringByteSize(withEmoji), expected);
  assert.ok(expected > JSON.stringify(withEmoji).length);
});

// --- isValidJson -----------------------------------------------------------------

test("isValidJson: true para JSON válido, false para inválido", () => {
  assert.equal(isValidJson('{"a":1}'), true);
  assert.equal(isValidJson("[1,2,3]"), true);
  assert.equal(isValidJson("{a:1}"), false);
  assert.equal(isValidJson("{"), false);
});

// --- maskSensitiveFields -----------------------------------------------------------

test("maskSensitiveFields: mascara campos sensíveis em qualquer profundidade", () => {
  const obj = {
    username: "ana",
    password: "hunter2",
    profile: { email: "ana@example.com", ssn: "123-45-6789" },
  };
  const masked = maskSensitiveFields(obj, ["password", "ssn"]);
  assert.deepEqual(masked, {
    username: "ana",
    password: "***",
    profile: { email: "ana@example.com", ssn: "***" },
  });
});

test("maskSensitiveFields: não modifica o objeto original", () => {
  const obj = { token: "secret" };
  maskSensitiveFields(obj, ["token"]);
  assert.equal(obj.token, "secret");
});

// --- reviveDates ----------------------------------------------------------------------

test("reviveDates: converte strings ISO de data em instâncias de Date", () => {
  const text = JSON.stringify({
    createdAt: "2024-01-15T10:30:00.000Z",
    label: "not a date",
    nested: { updatedAt: "2024-06-01T00:00:00.000Z" },
  });
  const result = reviveDates(text);
  assert.ok(result.createdAt instanceof Date);
  assert.equal(result.createdAt.toISOString(), "2024-01-15T10:30:00.000Z");
  assert.equal(result.label, "not a date");
  assert.ok(result.nested.updatedAt instanceof Date);
});

// --- parseNdjson --------------------------------------------------------------------------

test("parseNdjson: parseia JSON delimitado por linha, ignorando linhas vazias", () => {
  const text = '{"id":1}\n{"id":2}\n\n{"id":3}\n';
  assert.deepEqual(parseNdjson(text), [{ id: 1 }, { id: 2 }, { id: 3 }]);
});

// --- safeMerge -----------------------------------------------------------------------------

test("safeMerge: aplica o patch sobre uma cópia do base", () => {
  const base = { name: "Ana", age: 30 };
  const merged = safeMerge(base, '{"age":31,"city":"SP"}');
  assert.deepEqual(merged, { name: "Ana", age: 31, city: "SP" });
  assert.deepEqual(base, { name: "Ana", age: 30 });
});

test("safeMerge: lança erro descritivo quando o patch é JSON inválido", () => {
  assert.throws(() => safeMerge({ a: 1 }, "{invalid"), /invalid|inválid/i);
});

test("safeMerge: ignora __proto__ no patch para evitar poluição de protótipo", () => {
  const base = { a: 1 };
  const merged = safeMerge(base, '{"__proto__":{"polluted":true}}');
  assert.equal({}.polluted, undefined);
  assert.equal(merged.polluted, undefined);
});

// --- serializeUserProfileBuggy --------------------------------------------------------------

test("serializeUserProfileBuggy: não vaza passwordHash no JSON gerado", () => {
  const user = { id: 1, name: "Ana", passwordHash: "abc123hash" };
  const json = serializeUserProfileBuggy(user);
  assert.ok(!json.includes("passwordHash"));
  assert.ok(!json.includes("abc123hash"));
  const parsed = JSON.parse(json);
  assert.equal(parsed.id, 1);
  assert.equal(parsed.name, "Ana");
});

// --- parseConfigBuggy -----------------------------------------------------------------------

test("parseConfigBuggy: mescla config válida sobre o default", () => {
  const config = parseConfigBuggy('{"retries":5}');
  assert.deepEqual(config, { retries: 5, timeoutMs: 5000 });
});

test("parseConfigBuggy: cai para o default quando o JSON está corrompido", () => {
  const config = parseConfigBuggy("{not valid json");
  assert.deepEqual(config, { retries: 3, timeoutMs: 5000 });
});

// --- refactorNormalizeApiResponse ------------------------------------------------------------

test("refactorNormalizeApiResponse: mantém o comportamento original", () => {
  assert.deepEqual(refactorNormalizeApiResponse("{invalid"), {
    ok: false,
    error: "invalid json",
    data: null,
  });
  assert.deepEqual(refactorNormalizeApiResponse('{"error":"not found"}'), {
    ok: false,
    error: "not found",
    data: null,
  });
  assert.deepEqual(refactorNormalizeApiResponse('{"id":1,"name":"x"}'), {
    ok: true,
    error: null,
    data: { id: 1, name: "x" },
  });
  assert.deepEqual(refactorNormalizeApiResponse("[1,2,3]"), {
    ok: true,
    error: null,
    data: [1, 2, 3],
  });
  assert.deepEqual(refactorNormalizeApiResponse("42"), {
    ok: false,
    error: "expected an object or array",
    data: null,
  });
});

// --- buildOrderReport -----------------------------------------------------------------------

test("buildOrderReport: agrega pedidos em um relatório JSON formatado", () => {
  const ordersJsonText = JSON.stringify([
    { id: 1, status: "paid", amount: 100 },
    { id: 2, status: "paid", amount: 50 },
    { id: 3, status: "pending", amount: 20 },
    { id: 4, status: "cancelled", amount: 30 },
  ]);
  const reportText = buildOrderReport(ordersJsonText);
  const report = JSON.parse(reportText);
  assert.deepEqual(report, {
    totalOrders: 4,
    totalRevenue: 150,
    byStatus: { paid: 2, pending: 1, cancelled: 1 },
  });
  // A saída deve ser JSON formatado (indentado), não uma única linha.
  assert.ok(reportText.includes("\n"));
});

test("buildOrderReport: lança erro descritivo para JSON de pedidos inválido", () => {
  assert.throws(() => buildOrderReport("{not valid"), /invalid|inválid/i);
});
