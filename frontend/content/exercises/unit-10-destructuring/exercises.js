// Unidade 10 — Destructuring
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="extractFirstTwo" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function extractFirstTwo(arr) {
  throw new Error("not implemented: extractFirstTwo");
}

// test: node --test --test-name-pattern="swapPair" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function swapPair(pair) {
  throw new Error("not implemented: swapPair");
}

// test: node --test --test-name-pattern="getNameAndAge" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function getNameAndAge(person) {
  throw new Error("not implemented: getNameAndAge");
}

// test: node --test --test-name-pattern="extractWithDefault" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function extractWithDefault(options) {
  throw new Error("not implemented: extractWithDefault");
}

// test: node --test --test-name-pattern="extractNestedCity" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function extractNestedCity(user) {
  throw new Error("not implemented: extractNestedCity");
}

// test: node --test --test-name-pattern="skipMiddleElement" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function skipMiddleElement(arr) {
  throw new Error("not implemented: skipMiddleElement");
}

// test: node --test --test-name-pattern="renameKeys" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function renameKeys(record) {
  throw new Error("not implemented: renameKeys");
}

// test: node --test --test-name-pattern="describeProduct" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function describeProduct({ name, price }) {
  throw new Error("not implemented: describeProduct");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="swapMatrixRows" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function swapMatrixRows(matrix) {
  throw new Error("not implemented: swapMatrixRows");
}

// test: node --test --test-name-pattern="describeMinMax" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function describeMinMax(getMinMax, numbers) {
  throw new Error("not implemented: describeMinMax");
}

// test: node --test --test-name-pattern="describeShippingAddress" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function describeShippingAddress(order) {
  throw new Error("not implemented: describeShippingAddress");
}

// test: node --test --test-name-pattern="entriesToLines" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function entriesToLines(record) {
  throw new Error("not implemented: entriesToLines");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixSwappedDestructureBug" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function fixSwappedDestructureBug(rectangle) {
  // Sintoma relatado: a descrição "WxH" sai com os valores trocados —
  // parece que os nomes foram invertidos na hora de desestruturar.
  const { width: height, height: width } = rectangle;
  return `${width}x${height}`;
}

// test: node --test --test-name-pattern="fixNestedPathDestructureBug" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function fixNestedPathDestructureBug(order) {
  // Sintoma relatado: a função deveria retornar o país do endereço do
  // cliente (`order.customer.address.country`), mas lança
  // "Cannot destructure property 'address' of undefined" mesmo quando
  // o pedido tem um endereço válido.
  const {
    customer: {
      address: { country },
    },
  } = order.customer;
  return country;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar o acesso
// manual repetido a propriedades usando destructuring, mantendo o mesmo
// comportamento.

// test: node --test --test-name-pattern="refactorManualPropertyAccess" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function refactorManualPropertyAccess(user) {
  let summary = user.name + " (" + user.age + ") — ";
  summary = summary + user.address.city + "/" + user.address.state;
  if (user.contact.email) {
    summary = summary + " — " + user.contact.email;
  }
  return summary;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="parseConfigEntries" exercises/01-javascript-core/unit-10-destructuring/exercises.test.js
export function parseConfigEntries(entries) {
  throw new Error("not implemented: parseConfigEntries");
}
