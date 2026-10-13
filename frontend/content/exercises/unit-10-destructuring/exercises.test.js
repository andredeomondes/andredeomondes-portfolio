import { test } from "node:test";
import assert from "node:assert/strict";

import {
  extractFirstTwo,
  swapPair,
  getNameAndAge,
  extractWithDefault,
  extractNestedCity,
  skipMiddleElement,
  renameKeys,
  describeProduct,
  swapMatrixRows,
  describeMinMax,
  describeShippingAddress,
  entriesToLines,
  fixSwappedDestructureBug,
  fixNestedPathDestructureBug,
  refactorManualPropertyAccess,
  parseConfigEntries,
} from "./exercises.js";

// --- extractFirstTwo --------------------------------------------------------

test("extractFirstTwo: retorna os dois primeiros elementos do array", () => {
  assert.deepEqual(extractFirstTwo([1, 2, 3, 4]), { first: 1, second: 2 });
});

// --- swapPair ---------------------------------------------------------------

test("swapPair: troca a ordem de um par usando destructuring", () => {
  assert.deepEqual(swapPair([1, 2]), [2, 1]);
  assert.deepEqual(swapPair(["a", "b"]), ["b", "a"]);
});

// --- getNameAndAge ------------------------------------------------------------

test("getNameAndAge: desestrutura nome e idade de um objeto", () => {
  assert.equal(getNameAndAge({ name: "Ana", age: 30 }), "Ana, 30 anos");
});

// --- extractWithDefault ---------------------------------------------------------

test("extractWithDefault: usa valores padrão quando ausentes", () => {
  assert.deepEqual(extractWithDefault({}), { retries: 3, timeout: 1000 });
  assert.deepEqual(extractWithDefault({ retries: 5 }), {
    retries: 5,
    timeout: 1000,
  });
});

// --- extractNestedCity -------------------------------------------------------------

test("extractNestedCity: acessa cidade em objeto aninhado", () => {
  assert.equal(extractNestedCity({ address: { city: "Recife", state: "PE" } }), "Recife");
});

// --- skipMiddleElement --------------------------------------------------------------

test("skipMiddleElement: pula o elemento do meio de um array de 3", () => {
  assert.deepEqual(skipMiddleElement([1, 2, 3]), [1, 3]);
  assert.deepEqual(skipMiddleElement(["a", "b", "c"]), ["a", "c"]);
});

// --- renameKeys -----------------------------------------------------------------------

test("renameKeys: renomeia chaves durante a desestruturação", () => {
  assert.deepEqual(renameKeys({ id: 42, name: "produto" }), {
    identifier: 42,
    label: "produto",
  });
});

// --- describeProduct --------------------------------------------------------------------

test("describeProduct: desestrutura direto nos parâmetros da função", () => {
  assert.equal(describeProduct({ name: "Teclado", price: 250 }), "Teclado: $250");
});

// --- swapMatrixRows -----------------------------------------------------------------------

test("swapMatrixRows: troca a primeira e a última linha da matriz", () => {
  const matrix = [
    [1, 2],
    [3, 4],
    [5, 6],
  ];
  assert.deepEqual(swapMatrixRows(matrix), [
    [5, 6],
    [3, 4],
    [1, 2],
  ]);
});

test("swapMatrixRows: não modifica a matriz original", () => {
  const matrix = [
    [1, 2],
    [3, 4],
  ];
  swapMatrixRows(matrix);
  assert.deepEqual(matrix, [
    [1, 2],
    [3, 4],
  ]);
});

// --- describeMinMax --------------------------------------------------------------------------

test("describeMinMax: desestrutura a tupla [min, max] retornada por getMinMax", () => {
  const getMinMax = (nums) => {
    let min = nums[0];
    let max = nums[0];
    for (const n of nums) {
      if (n < min) min = n;
      if (n > max) max = n;
    }
    return [min, max];
  };
  assert.equal(describeMinMax(getMinMax, [5, 1, 9, 3]), "min=1, max=9");
});

// --- describeShippingAddress ------------------------------------------------------------------

test("describeShippingAddress: combina nome, cidade e cep aninhados", () => {
  const order = {
    customer: { name: "Léo" },
    shipping: { address: { city: "Porto Alegre", zip: "90000-000" } },
  };
  assert.equal(describeShippingAddress(order), "Léo - Porto Alegre (90000-000)");
});

test("describeShippingAddress: usa valor padrão quando a cidade está ausente", () => {
  const order = {
    customer: { name: "Léo" },
    shipping: { address: { zip: "90000-000" } },
  };
  assert.equal(describeShippingAddress(order), "Léo - não informado (90000-000)");
});

// --- entriesToLines ----------------------------------------------------------------------------

test("entriesToLines: transforma pares [chave, valor] em linhas de texto", () => {
  assert.deepEqual(entriesToLines({ nome: "Ana", cidade: "Recife" }), [
    "nome: Ana",
    "cidade: Recife",
  ]);
});

// --- fixSwappedDestructureBug --------------------------------------------------------------------

test("fixSwappedDestructureBug: não troca width e height", () => {
  assert.equal(fixSwappedDestructureBug({ width: 4, height: 9 }), "4x9");
});

// --- fixNestedPathDestructureBug ------------------------------------------------------------------

test("fixNestedPathDestructureBug: acessa o país corretamente", () => {
  const order = { customer: { address: { country: "Brasil" } } };
  assert.equal(fixNestedPathDestructureBug(order), "Brasil");
});

// --- refactorManualPropertyAccess ------------------------------------------------------------------

test("refactorManualPropertyAccess: mantém o comportamento original", () => {
  const user = {
    name: "Bia",
    age: 27,
    address: { city: "Salvador", state: "BA" },
    contact: { email: "bia@example.com" },
  };
  assert.equal(
    refactorManualPropertyAccess(user),
    "Bia (27) — Salvador/BA — bia@example.com",
  );
});

test("refactorManualPropertyAccess: omite email quando ausente", () => {
  const user = {
    name: "Caio",
    age: 40,
    address: { city: "Fortaleza", state: "CE" },
    contact: {},
  };
  assert.equal(refactorManualPropertyAccess(user), "Caio (40) — Fortaleza/CE");
});

// --- parseConfigEntries ---------------------------------------------------------------------------

test("parseConfigEntries: converte valores string para tipos apropriados", () => {
  const entries = [
    ["debug", "true"],
    ["retries", "3"],
    ["mode", "production"],
    ["verbose", "false"],
  ];
  assert.deepEqual(parseConfigEntries(entries), {
    debug: true,
    retries: 3,
    mode: "production",
    verbose: false,
  });
});

test("parseConfigEntries: lista vazia retorna objeto vazio", () => {
  assert.deepEqual(parseConfigEntries([]), {});
});
