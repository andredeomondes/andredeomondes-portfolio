import { test } from "node:test";
import assert from "node:assert/strict";

import {
  calcTotalPriceMessy,
  formatUserNameMessy,
  logAndCheckPositiveMessy,
  sumArrayWeirdMessy,
  parseCsvLineMessy,
  getDiscountLabelMessy,
  processOrderMessy,
  buildUserReportMessy,
  updateInventoryMessy,
  computeStatsMessy,
  fixShadowedVariableBug,
  fixCopyPasteBug,
  refactorGodFunctionOrderPipeline,
  refactorSideEffectHeavyLogger,
  refactorAndExtendReportModuleMessy,
  refactorMessyValidationPipeline,
} from "./exercises.js";

// --- calcTotalPriceMessy --------------------------------------------------------

test("calcTotalPriceMessy: soma preço*qtd e aplica 10% de imposto", () => {
  const items = [
    { price: 10, qty: 2 },
    { price: 5, qty: 1 },
  ];
  assert.equal(calcTotalPriceMessy(items), 27.5);
});

test("calcTotalPriceMessy: lista vazia retorna 0", () => {
  assert.equal(calcTotalPriceMessy([]), 0);
});

// --- formatUserNameMessy ------------------------------------------------------

test("formatUserNameMessy: combina primeiro e último nome", () => {
  assert.equal(formatUserNameMessy({ first: " Ana ", last: " Silva " }), "Ana Silva");
});

test("formatUserNameMessy: lida com nomes parciais e ausentes", () => {
  assert.equal(formatUserNameMessy({ first: "Ana" }), "Ana");
  assert.equal(formatUserNameMessy({ last: "Silva" }), "Silva");
  assert.equal(formatUserNameMessy({}), "");
});

// --- logAndCheckPositiveMessy --------------------------------------------------

test("logAndCheckPositiveMessy: retorna true e registra positivo", () => {
  const log = [];
  const result = logAndCheckPositiveMessy(5, log);
  assert.equal(result, true);
  assert.deepEqual(log, ["checked 5: positive"]);
});

test("logAndCheckPositiveMessy: retorna false e registra não positivo", () => {
  const log = [];
  const result = logAndCheckPositiveMessy(-3, log);
  assert.equal(result, false);
  assert.deepEqual(log, ["checked -3: not positive"]);
});

// --- sumArrayWeirdMessy ---------------------------------------------------------

test("sumArrayWeirdMessy: soma todos os números do array", () => {
  assert.equal(sumArrayWeirdMessy([1, 2, 3, 4]), 10);
  assert.equal(sumArrayWeirdMessy([]), 0);
});

// --- parseCsvLineMessy -----------------------------------------------------------

test("parseCsvLineMessy: divide, remove espaços e descarta campos vazios", () => {
  assert.deepEqual(parseCsvLineMessy(" a , b,, c "), ["a", "b", "c"]);
});

// --- getDiscountLabelMessy --------------------------------------------------------

test("getDiscountLabelMessy: retorna o rótulo correto por faixa", () => {
  assert.equal(getDiscountLabelMessy(1500), "platinum");
  assert.equal(getDiscountLabelMessy(600), "gold");
  assert.equal(getDiscountLabelMessy(150), "silver");
  assert.equal(getDiscountLabelMessy(50), "none");
});

// --- processOrderMessy -----------------------------------------------------------

test("processOrderMessy: monta resumo com subtotal, desconto e total", () => {
  const order = {
    customer: { name: "Ana" },
    items: [{ price: 100, qty: 2 }],
    couponPercent: 10,
  };
  // subtotal = 200, desconto = 20, total após desconto = 180, imposto 10% = 18, grandTotal = 198
  assert.equal(
    processOrderMessy(order),
    "Ana: subtotal R$200, desconto R$20, total R$198",
  );
});

test("processOrderMessy: lança erro para pedido vazio", () => {
  assert.throws(
    () => processOrderMessy({ customer: { name: "Ana" }, items: [] }),
    /empty order/,
  );
});

// --- buildUserReportMessy ---------------------------------------------------------

test("buildUserReportMessy: filtra ativos, ordena por nome e formata linhas", () => {
  const users = [
    { name: "Carlos", active: true, score: 10 },
    { name: "Ana", active: true, score: 20 },
    { name: "Bruno", active: false, score: 30 },
  ];
  assert.equal(
    buildUserReportMessy(users),
    "Relatório de usuários ativos:\nAna (20 pts)\nCarlos (10 pts)",
  );
});

// --- updateInventoryMessy ---------------------------------------------------------

test("updateInventoryMessy: aplica deltas e não deixa estoque negativo", () => {
  const inventory = { a: 5, b: 2 };
  const result = updateInventoryMessy(inventory, [
    { sku: "a", delta: -2 },
    { sku: "b", delta: -10 },
    { sku: "c", delta: 5 },
  ]);
  assert.deepEqual(result, { a: 3, b: 0 });
});

// --- computeStatsMessy ------------------------------------------------------------

test("computeStatsMessy: calcula soma, mínimo, máximo e média", () => {
  assert.deepEqual(computeStatsMessy([4, 1, 7, 3]), {
    sum: 15,
    min: 1,
    max: 7,
    avg: 3.75,
  });
});

// --- fixShadowedVariableBug --------------------------------------------------------

test("fixShadowedVariableBug: soma o amount de todos os itens de todos os registros", () => {
  const records = [
    { items: [{ amount: 10 }, { amount: 5 }] },
    { items: [{ amount: 3 }] },
  ];
  assert.equal(fixShadowedVariableBug(records), 18);
});

test("fixShadowedVariableBug: lista de registros vazia retorna 0", () => {
  assert.equal(fixShadowedVariableBug([]), 0);
});

// --- fixCopyPasteBug -------------------------------------------------------------------

test("fixCopyPasteBug: calcula subtotal de cada categoria de forma independente", () => {
  const cart = {
    electronics: [{ price: 100, qty: 1 }],
    clothing: [{ price: 30, qty: 2 }],
  };
  assert.deepEqual(fixCopyPasteBug(cart), {
    electronicsSubtotal: 100,
    clothingSubtotal: 60,
    total: 160,
  });
});

// --- refactorGodFunctionOrderPipeline --------------------------------------------------

test("refactorGodFunctionOrderPipeline: calcula subtotal, desconto, imposto e total", () => {
  const rawOrder = { items: [{ price: 50, qty: 2 }], couponCode: "PROMO10" };
  // subtotal = 100, desconto = 10, afterDiscount = 90, tax = 7.2, grandTotal = 97.2
  assert.deepEqual(refactorGodFunctionOrderPipeline(rawOrder), {
    subtotal: 100,
    discount: 10,
    tax: 7.2,
    grandTotal: 97.2,
  });
});

test("refactorGodFunctionOrderPipeline: sem cupom não aplica desconto", () => {
  const rawOrder = { items: [{ price: 50, qty: 1 }] };
  assert.deepEqual(refactorGodFunctionOrderPipeline(rawOrder), {
    subtotal: 50,
    discount: 0,
    tax: 4,
    grandTotal: 54,
  });
});

test("refactorGodFunctionOrderPipeline: lança erro para pedido vazio", () => {
  assert.throws(() => refactorGodFunctionOrderPipeline({ items: [] }), /pedido vazio/);
  assert.throws(() => refactorGodFunctionOrderPipeline({}), /pedido vazio/);
});

// --- refactorSideEffectHeavyLogger ----------------------------------------------------

test("refactorSideEffectHeavyLogger: conta ocorrências por tipo de evento", () => {
  const events = [
    { type: "click" },
    { type: "view" },
    { type: "click" },
    { type: "click" },
  ];
  assert.deepEqual(refactorSideEffectHeavyLogger(events), { click: 3, view: 1 });
});

// --- refactorAndExtendReportModuleMessy -----------------------------------------------

test("refactorAndExtendReportModuleMessy: soma créditos e débitos válidos e calcula saldo", () => {
  const transactions = [
    { type: "credit", amount: 100 },
    { type: "debit", amount: 40 },
    { type: "credit", amount: -5 }, // inválido: negativo
    { type: "debit", amount: "10" }, // inválido: não é number
    { type: "credit", amount: 20 },
  ];
  assert.deepEqual(refactorAndExtendReportModuleMessy(transactions), {
    totalCredit: 120,
    totalDebit: 40,
    balance: 80,
    validCount: 3,
  });
});

// --- refactorMessyValidationPipeline ---------------------------------------------------

test("refactorMessyValidationPipeline: retorna lista vazia quando tudo é válido", () => {
  assert.deepEqual(
    refactorMessyValidationPipeline({ name: "Ana", email: "ana@example.com", age: 30 }),
    [],
  );
});

test("refactorMessyValidationPipeline: retorna todos os erros na ordem esperada", () => {
  assert.deepEqual(
    refactorMessyValidationPipeline({ name: "", email: "invalido", age: -1 }),
    ["nome é obrigatório", "email inválido", "idade inválida"],
  );
});
