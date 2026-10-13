import { test } from "node:test";
import assert from "node:assert/strict";

import {
  isValidEmailSimple,
  extractNumbers,
  maskCreditCard,
  countWordOccurrences,
  slugify,
  extractHashtags,
  isStrongPassword,
  normalizeWhitespace,
  parseQueryString,
  extractDateParts,
  replaceTemplateVars,
  splitOnMultipleDelimiters,
  isValidPhoneNumber,
  extractAllPrices,
  messyValidateUsername,
  parseLogLine,
} from "./exercises.js";

// --- isValidEmailSimple ----------------------------------------------------------

test("isValidEmailSimple: aceita formato básico usuario@dominio.tld", () => {
  assert.equal(isValidEmailSimple("ana@example.com"), true);
  assert.equal(isValidEmailSimple("ana@example"), false);
  assert.equal(isValidEmailSimple("ana example.com"), false);
  assert.equal(isValidEmailSimple(""), false);
});

// --- extractNumbers -----------------------------------------------------------------

test("extractNumbers: extrai todas as sequências numéricas como números", () => {
  assert.deepEqual(extractNumbers("Sala 42, Andar 3, construído em 1998"), [42, 3, 1998]);
  assert.deepEqual(extractNumbers("sem números aqui"), []);
});

// --- maskCreditCard ------------------------------------------------------------------

test("maskCreditCard: mascara todos os dígitos exceto os últimos 4", () => {
  assert.equal(maskCreditCard("1234567812345678"), "************5678");
  assert.equal(
    maskCreditCard("Cartão: 1234567812345678 aprovado"),
    "Cartão: ************5678 aprovado",
  );
});

// --- countWordOccurrences --------------------------------------------------------------

test("countWordOccurrences: conta palavra inteira, case-insensitive", () => {
  assert.equal(countWordOccurrences("The cat sat on the mat. THE cat ran.", "the"), 3);
  assert.equal(countWordOccurrences("cats category catalog", "cat"), 0);
});

// --- slugify -----------------------------------------------------------------------

test("slugify: minúsculas, hífens, sem sobras", () => {
  assert.equal(slugify("Hello, World!"), "hello-world");
  assert.equal(slugify("  Multiple   Spaces  "), "multiple-spaces");
  assert.equal(slugify("JavaScript & Node.js"), "javascript-node-js");
});

// --- extractHashtags -----------------------------------------------------------------

test("extractHashtags: extrai hashtags sem o símbolo #", () => {
  assert.deepEqual(
    extractHashtags("Amando #JavaScript e #Node.js hoje! #100DaysOfCode"),
    ["JavaScript", "Node", "100DaysOfCode"],
  );
  assert.deepEqual(extractHashtags("sem hashtags aqui"), []);
});

// --- isStrongPassword ----------------------------------------------------------------

test("isStrongPassword: exige maiúscula, minúscula, dígito, especial e 8+ chars", () => {
  assert.equal(isStrongPassword("Abcdef1!"), true);
  assert.equal(isStrongPassword("abcdefgh"), false);
  assert.equal(isStrongPassword("Short1!"), false);
  assert.equal(isStrongPassword("ALLCAPS1!"), false);
});

// --- normalizeWhitespace -------------------------------------------------------------

test("normalizeWhitespace: colapsa espaços/tabs/quebras em um único espaço", () => {
  assert.equal(normalizeWhitespace("  Hello   world\n\tfoo  "), "Hello world foo");
});

// --- parseQueryString ------------------------------------------------------------------

test("parseQueryString: converte querystring em objeto", () => {
  assert.deepEqual(parseQueryString("a=1&b=2&c=hello"), { a: "1", b: "2", c: "hello" });
  assert.deepEqual(parseQueryString(""), {});
});

// --- extractDateParts -------------------------------------------------------------------

test("extractDateParts: captura ano, mês e dia de datas ISO", () => {
  assert.deepEqual(extractDateParts("2026-07-24"), { year: 2026, month: 7, day: 24 });
  assert.equal(extractDateParts("24/07/2026"), null);
});

// --- replaceTemplateVars ----------------------------------------------------------------

test("replaceTemplateVars: substitui {{chave}} pelos valores de data", () => {
  assert.equal(
    replaceTemplateVars("Olá {{name}}, você tem {{count}} itens", {
      name: "Ana",
      count: 3,
    }),
    "Olá Ana, você tem 3 itens",
  );
  assert.equal(replaceTemplateVars("Olá {{name}}", {}), "Olá ");
});

// --- splitOnMultipleDelimiters -------------------------------------------------------------

test("splitOnMultipleDelimiters: separa por vírgula, ponto-e-vírgula ou pipe", () => {
  assert.deepEqual(splitOnMultipleDelimiters("a, b; c|d ,e"), ["a", "b", "c", "d", "e"]);
});

// --- isValidPhoneNumber (debugging) ---------------------------------------------------------

test("isValidPhoneNumber: aceita apenas o formato completo ###-###-####", () => {
  assert.equal(isValidPhoneNumber("123-456-7890"), true);
  assert.equal(isValidPhoneNumber("abc123-456-7890xyz"), false);
  assert.equal(isValidPhoneNumber("123-45-6789"), false);
});

// --- extractAllPrices (debugging) -----------------------------------------------------------

test("extractAllPrices: retorna todos os preços do texto, não só o primeiro", () => {
  assert.deepEqual(extractAllPrices("Item A: R$10,00, Item B: R$25,50 e Item C: R$5"), [
    "R$10,00",
    "R$25,50",
    "R$5",
  ]);
});

// --- messyValidateUsername (refatoração) ------------------------------------------------------

test("messyValidateUsername: mantém as mesmas regras após a refatoração", () => {
  assert.equal(messyValidateUsername("abc_123"), true);
  assert.equal(messyValidateUsername("ab"), false);
  assert.equal(messyValidateUsername("1abc"), false);
  assert.equal(messyValidateUsername("abc def"), false);
  assert.equal(messyValidateUsername("abc__def"), false);
  assert.equal(messyValidateUsername("averylongusername1234567"), false);
  assert.equal(messyValidateUsername(42), false);
});

// --- parseLogLine (desafio integrador) --------------------------------------------------------

test("parseLogLine: extrai campos nomeados de uma linha de log", () => {
  assert.deepEqual(
    parseLogLine("[2026-07-24 10:15:00] ERROR: Payment failed for order #4521"),
    {
      timestamp: "2026-07-24 10:15:00",
      level: "ERROR",
      message: "Payment failed for order",
      orderId: "4521",
    },
  );
  assert.equal(parseLogLine("not a valid log line"), null);
});
