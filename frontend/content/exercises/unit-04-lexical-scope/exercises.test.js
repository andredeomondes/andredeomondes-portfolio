import { test } from "node:test";
import assert from "node:assert/strict";

import {
  sumUsingBlockScope,
  maxOfThreeBlockScoped,
  describeShadowing,
  trackLastEvenFunctionScoped,
  pushIntoConstArray,
  reassignLetInLoop,
  attemptConstReassignment,
  nestedBlockCounter,
  hoistedFunctionCall,
  varDeclaredValueBeforeAssignment,
  compareVarAndLetLeak,
  createIifeCounter,
  sumOrderTotals,
  computeDiscountedPrice,
  refactorScoreSummary,
  createSequentialIdGenerator,
} from "./exercises.js";

// --- sumUsingBlockScope ----------------------------------------------------

test("sumUsingBlockScope: soma dois números", () => {
  assert.equal(sumUsingBlockScope(2, 3), 5);
  assert.equal(sumUsingBlockScope(-1, 1), 0);
});

// --- maxOfThreeBlockScoped ----------------------------------------------------

test("maxOfThreeBlockScoped: encontra o maior dos três", () => {
  assert.equal(maxOfThreeBlockScoped(1, 5, 3), 5);
  assert.equal(maxOfThreeBlockScoped(9, 2, 3), 9);
  assert.equal(maxOfThreeBlockScoped(1, 2, 9), 9);
});

// --- describeShadowing ------------------------------------------------------

test("describeShadowing: valor externo não é afetado pelo shadowing interno", () => {
  assert.deepEqual(describeShadowing(5), { outer: 5, inner: 15 });
});

// --- trackLastEvenFunctionScoped ---------------------------------------------

test("trackLastEvenFunctionScoped: retorna o último par encontrado", () => {
  assert.equal(trackLastEvenFunctionScoped([1, 2, 3, 4, 5, 6, 7]), 6);
});

test("trackLastEvenFunctionScoped: retorna undefined sem pares", () => {
  assert.equal(trackLastEvenFunctionScoped([1, 3, 5]), undefined);
});

// --- pushIntoConstArray -----------------------------------------------------

test("pushIntoConstArray: acumula itens em um array const", () => {
  assert.deepEqual(pushIntoConstArray([1, 2, 3]), [1, 2, 3]);
  assert.deepEqual(pushIntoConstArray([]), []);
});

// --- reassignLetInLoop -------------------------------------------------------

test("reassignLetInLoop: incrementa counter times vezes", () => {
  assert.equal(reassignLetInLoop(0, 5), 5);
  assert.equal(reassignLetInLoop(10, 0), 10);
});

// --- attemptConstReassignment -------------------------------------------------

test("attemptConstReassignment: reatribuir const lança TypeError", () => {
  assert.equal(attemptConstReassignment(), true);
});

// --- nestedBlockCounter -------------------------------------------------------

test("nestedBlockCounter: soma e subtrai conforme as operações", () => {
  assert.equal(nestedBlockCounter(["+1", "+1", "-1", "+1"]), 2);
  assert.equal(nestedBlockCounter([]), 0);
});

// --- hoistedFunctionCall -------------------------------------------------------

test("hoistedFunctionCall: chama um helper declarado depois no código", () => {
  assert.equal(hoistedFunctionCall(), "hoisted");
});

// --- varDeclaredValueBeforeAssignment --------------------------------------------

test("varDeclaredValueBeforeAssignment: var lido antes da atribuição é undefined", () => {
  assert.equal(varDeclaredValueBeforeAssignment(), "undefined");
});

// --- compareVarAndLetLeak -----------------------------------------------------------

test("compareVarAndLetLeak: var vaza do bloco, let não", () => {
  assert.deepEqual(compareVarAndLetLeak(true), { varLeaked: true, letLeaked: false });
});

test("compareVarAndLetLeak: bloco não executado, nada vaza", () => {
  assert.deepEqual(compareVarAndLetLeak(false), { varLeaked: false, letLeaked: false });
});

// --- createIifeCounter ----------------------------------------------------------------

test("createIifeCounter: incrementa e lê o valor sem expor a variável interna", () => {
  const counter = createIifeCounter();
  assert.equal(counter.getValue(), 0);
  counter.increment();
  counter.increment();
  assert.equal(counter.getValue(), 2);
  assert.equal(counter.count, undefined);
});

test("createIifeCounter: instâncias diferentes não compartilham estado", () => {
  const a = createIifeCounter();
  const b = createIifeCounter();
  a.increment();
  assert.equal(a.getValue(), 1);
  assert.equal(b.getValue(), 0);
});

// --- sumOrderTotals -----------------------------------------------------------------------

test("sumOrderTotals: soma todos os itens, aplicando taxa quando necessário", () => {
  const items = [
    { price: 10, hasFee: false },
    { price: 20, hasFee: true },
    { price: 5, hasFee: false },
  ];
  assert.equal(sumOrderTotals(items), 10 + 20 * 1.1 + 5);
});

test("sumOrderTotals: lista vazia soma 0", () => {
  assert.equal(sumOrderTotals([]), 0);
});

// --- computeDiscountedPrice -----------------------------------------------------------------

test("computeDiscountedPrice: aplica desconto para membros", () => {
  assert.equal(computeDiscountedPrice(100, true), 90);
});

test("computeDiscountedPrice: não aplica desconto para não membros", () => {
  assert.equal(computeDiscountedPrice(100, false), 100);
});

// --- refactorScoreSummary --------------------------------------------------------------------

test("refactorScoreSummary: mantém o comportamento original", () => {
  assert.deepEqual(refactorScoreSummary([7, 9, 5, 8]), {
    total: 29,
    max: 9,
    min: 5,
    average: 7.25,
  });
});

// --- createSequentialIdGenerator ------------------------------------------------------------

test("createSequentialIdGenerator: gera ids sequenciais com o prefixo", () => {
  const nextId = createSequentialIdGenerator("user");
  assert.equal(nextId(), "user-1");
  assert.equal(nextId(), "user-2");
  assert.equal(nextId(), "user-3");
});

test("createSequentialIdGenerator: geradores diferentes não compartilham contador", () => {
  const nextUserId = createSequentialIdGenerator("user");
  const nextOrderId = createSequentialIdGenerator("order");
  assert.equal(nextUserId(), "user-1");
  assert.equal(nextOrderId(), "order-1");
  assert.equal(nextUserId(), "user-2");
});
