import { test } from "node:test";
import assert from "node:assert/strict";

import {
  sumWithSingleLoop,
  countAllPairsNested,
  hasDuplicateNestedLoop,
  getElementAtIndex,
  countHalvingSteps,
  estimateOperations,
  sumTwoSeparateLoops,
  sumMatrixNestedLoop,
  hasDuplicateWithSet,
  classifyGrowthFromSamples,
  countNestedLoopIterations,
  compareComplexityLabels,
  fixAccidentalQuadraticLookup,
  fixRedundantDoublePass,
  refactorQuadraticToLinear,
  analyzeFunctionComplexity,
} from "./exercises.js";

// --- sumWithSingleLoop --------------------------------------------------------

test("sumWithSingleLoop: soma todos os elementos com um laço O(n)", () => {
  assert.equal(sumWithSingleLoop([1, 2, 3, 4]), 10);
  assert.equal(sumWithSingleLoop([]), 0);
});

// --- countAllPairsNested ------------------------------------------------------------

test("countAllPairsNested: conta todos os pares i<j com laço aninhado O(n²)", () => {
  assert.equal(countAllPairsNested([1, 2, 3, 4]), 6);
  assert.equal(countAllPairsNested([1]), 0);
  assert.equal(countAllPairsNested([]), 0);
});

// --- hasDuplicateNestedLoop ------------------------------------------------------------

test("hasDuplicateNestedLoop: detecta duplicado comparando todos os pares", () => {
  assert.equal(hasDuplicateNestedLoop([1, 2, 3, 2]), true);
  assert.equal(hasDuplicateNestedLoop([1, 2, 3]), false);
});

// --- getElementAtIndex --------------------------------------------------------------------

test("getElementAtIndex: acesso direto O(1), independente do tamanho do array", () => {
  assert.equal(getElementAtIndex([10, 20, 30], 1), 20);
  assert.equal(getElementAtIndex([10, 20, 30], 5), undefined);
  assert.equal(getElementAtIndex([10, 20, 30], -1), undefined);
});

// --- countHalvingSteps -----------------------------------------------------------------------

test("countHalvingSteps: conta quantas vezes dá para dividir n por 2 até chegar a 1", () => {
  assert.equal(countHalvingSteps(1), 0);
  assert.equal(countHalvingSteps(8), 3);
  assert.equal(countHalvingSteps(16), 4);
  assert.equal(countHalvingSteps(100), 6);
});

// --- estimateOperations --------------------------------------------------------------------

test("estimateOperations: calcula a fórmula de operações de cada padrão para um dado n", () => {
  assert.equal(estimateOperations("single-loop", 5), 5);
  assert.equal(estimateOperations("nested-loop", 5), 25);
  assert.equal(estimateOperations("halving", 5), 2);
  assert.equal(estimateOperations("two-sequential-loops", 5), 10);
});

test("estimateOperations: lança erro para padrão desconhecido", () => {
  assert.throws(() => estimateOperations("padrao-inventado", 5));
});

// --- sumTwoSeparateLoops -----------------------------------------------------------------------

test("sumTwoSeparateLoops: soma dois arrays com dois laços sequenciais (não aninhados)", () => {
  assert.equal(sumTwoSeparateLoops([1, 2, 3], [10, 20]), 36);
  assert.equal(sumTwoSeparateLoops([], []), 0);
});

// --- sumMatrixNestedLoop -----------------------------------------------------------------------

test("sumMatrixNestedLoop: soma todos os elementos de uma matriz com laço aninhado", () => {
  assert.equal(
    sumMatrixNestedLoop([
      [1, 2],
      [3, 4],
      [5, 6],
    ]),
    21,
  );
});

// --- hasDuplicateWithSet -----------------------------------------------------------------------

test("hasDuplicateWithSet: mesmo resultado que a versão O(n²), mas em O(n)", () => {
  assert.equal(hasDuplicateWithSet([1, 2, 3, 2]), true);
  assert.equal(hasDuplicateWithSet([1, 2, 3]), false);
});

// --- classifyGrowthFromSamples -----------------------------------------------------------------

test("classifyGrowthFromSamples: reconhece crescimento constante", () => {
  assert.equal(
    classifyGrowthFromSamples([
      { n: 10, operations: 5 },
      { n: 100, operations: 5 },
    ]),
    "constant",
  );
});

test("classifyGrowthFromSamples: reconhece crescimento linear", () => {
  assert.equal(
    classifyGrowthFromSamples([
      { n: 10, operations: 10 },
      { n: 100, operations: 100 },
    ]),
    "linear",
  );
});

test("classifyGrowthFromSamples: reconhece crescimento quadrático", () => {
  assert.equal(
    classifyGrowthFromSamples([
      { n: 10, operations: 100 },
      { n: 100, operations: 10000 },
    ]),
    "quadratic",
  );
});

test("classifyGrowthFromSamples: reconhece crescimento logarítmico", () => {
  assert.equal(
    classifyGrowthFromSamples([
      { n: 16, operations: 4 },
      { n: 256, operations: 8 },
    ]),
    "logarithmic",
  );
});

// --- countNestedLoopIterations -----------------------------------------------------------------

test("countNestedLoopIterations: multiplica os tamanhos de dois laços aninhados", () => {
  assert.equal(countNestedLoopIterations(3, 4), 12);
  assert.equal(countNestedLoopIterations(0, 5), 0);
});

// --- compareComplexityLabels -----------------------------------------------------------------

test("compareComplexityLabels: ordena rótulos de complexidade por crescimento", () => {
  assert.equal(compareComplexityLabels("O(1)", "O(n)"), -1);
  assert.equal(compareComplexityLabels("O(n^2)", "O(log n)"), 1);
  assert.equal(compareComplexityLabels("O(n)", "O(n)"), 0);
  assert.equal(compareComplexityLabels("O(log n)", "O(n log n)"), -1);
});

// --- fixAccidentalQuadraticLookup -----------------------------------------------------------------

test("fixAccidentalQuadraticLookup: retorna os usuários correspondentes aos ids, na ordem dos ids", () => {
  const users = [
    { id: 1, name: "Ana" },
    { id: 2, name: "Bruno" },
    { id: 3, name: "Carla" },
  ];
  const result = fixAccidentalQuadraticLookup(users, [3, 1, 99]);
  assert.deepEqual(result, [
    { id: 3, name: "Carla" },
    { id: 1, name: "Ana" },
  ]);
});

test("fixAccidentalQuadraticLookup: é rápida mesmo com listas grandes (não pode ser O(n*m))", () => {
  const userCount = 60000;
  const users = Array.from({ length: userCount }, (_, i) => ({
    id: i,
    name: `user-${i}`,
  }));
  const ids = Array.from({ length: userCount }, (_, i) => userCount - 1 - i);

  const start = Date.now();
  const result = fixAccidentalQuadraticLookup(users, ids);
  const elapsedMs = Date.now() - start;

  assert.equal(result.length, userCount);
  assert.equal(result[0].id, userCount - 1);
  // Numa implementação O(n+m) isso roda em poucos milissegundos (~10-20ms
  // nesta máquina de referência). A versão O(n*m) original leva mais de
  // 1 segundo com esse tamanho de entrada — este limite generoso ainda
  // assim é suficiente para separar as duas implementações com folga.
  assert.ok(
    elapsedMs < 800,
    `esperado terminar em menos de 800ms, levou ${elapsedMs}ms — provável busca O(n*m)`,
  );
});

// --- fixRedundantDoublePass -----------------------------------------------------------------------

test("fixRedundantDoublePass: calcula a média corretamente, inclusive com um único valor", () => {
  assert.equal(fixRedundantDoublePass([10]), 10);
  assert.equal(fixRedundantDoublePass([10, 20, 30]), 20);
});

// --- refactorQuadraticToLinear -----------------------------------------------------------------------

test("refactorQuadraticToLinear: soma o total gasto por cliente, na ordem de customerIds", () => {
  const orders = [
    { customerId: "a", amount: 10 },
    { customerId: "b", amount: 5 },
    { customerId: "a", amount: 20 },
    { customerId: "c", amount: 1 },
  ];
  assert.deepEqual(refactorQuadraticToLinear(orders, ["a", "b", "z"]), [30, 5, 0]);
});

// --- analyzeFunctionComplexity -----------------------------------------------------------------------

test("analyzeFunctionComplexity: classifica uma função O(1) como constante", () => {
  function constantFn(n, tick) {
    tick();
  }
  assert.equal(analyzeFunctionComplexity(constantFn, [10, 100]), "constant");
});

test("analyzeFunctionComplexity: classifica uma função O(n) como linear", () => {
  function linearFn(n, tick) {
    for (let i = 0; i < n; i++) {
      tick();
    }
  }
  assert.equal(analyzeFunctionComplexity(linearFn, [10, 100]), "linear");
});

test("analyzeFunctionComplexity: classifica uma função O(n²) como quadrática", () => {
  function quadraticFn(n, tick) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        tick();
      }
    }
  }
  assert.equal(analyzeFunctionComplexity(quadraticFn, [10, 100]), "quadratic");
});
