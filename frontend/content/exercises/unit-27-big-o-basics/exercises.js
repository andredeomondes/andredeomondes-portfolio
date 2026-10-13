// Unidade 27 — Big O básico
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.
//
// Esta unidade é introdutória e de nível de linguagem: o objetivo é
// desenvolver intuição sobre como o número de operações de um trecho de
// código cresce com o tamanho da entrada (O(1), O(log n), O(n), O(n²)),
// contando operações "na mão" em vez de provar formalmente complexidade
// de algoritmos (isso fica para a trilha de estruturas de dados e
// algoritmos, em `exercises/12-dsa-algorithms/`).

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="sumWithSingleLoop" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function sumWithSingleLoop(arr) {
  throw new Error("not implemented: sumWithSingleLoop");
}

// test: node --test --test-name-pattern="countAllPairsNested" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function countAllPairsNested(arr) {
  throw new Error("not implemented: countAllPairsNested");
}

// test: node --test --test-name-pattern="hasDuplicateNestedLoop" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function hasDuplicateNestedLoop(arr) {
  throw new Error("not implemented: hasDuplicateNestedLoop");
}

// test: node --test --test-name-pattern="getElementAtIndex" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function getElementAtIndex(arr, index) {
  throw new Error("not implemented: getElementAtIndex");
}

// test: node --test --test-name-pattern="countHalvingSteps" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function countHalvingSteps(n) {
  throw new Error("not implemented: countHalvingSteps");
}

// test: node --test --test-name-pattern="estimateOperations" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function estimateOperations(patternName, n) {
  throw new Error("not implemented: estimateOperations");
}

// test: node --test --test-name-pattern="sumTwoSeparateLoops" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function sumTwoSeparateLoops(arrA, arrB) {
  throw new Error("not implemented: sumTwoSeparateLoops");
}

// test: node --test --test-name-pattern="sumMatrixNestedLoop" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function sumMatrixNestedLoop(matrix) {
  throw new Error("not implemented: sumMatrixNestedLoop");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="hasDuplicateWithSet" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function hasDuplicateWithSet(arr) {
  throw new Error("not implemented: hasDuplicateWithSet");
}

// test: node --test --test-name-pattern="classifyGrowthFromSamples" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function classifyGrowthFromSamples(samples) {
  throw new Error("not implemented: classifyGrowthFromSamples");
}

// test: node --test --test-name-pattern="countNestedLoopIterations" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function countNestedLoopIterations(n, m) {
  throw new Error("not implemented: countNestedLoopIterations");
}

// test: node --test --test-name-pattern="compareComplexityLabels" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function compareComplexityLabels(a, b) {
  throw new Error("not implemented: compareComplexityLabels");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixAccidentalQuadraticLookup" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function fixAccidentalQuadraticLookup(users, ids) {
  // Sintoma relatado: em produção, com listas de milhares de usuários e
  // ids, essa função demora segundos para responder — e deveria ser quase
  // instantânea. Ela funciona (o resultado está correto), o problema é a
  // quantidade de trabalho que ela faz: para cada id, ela varre a lista
  // inteira de usuários de novo com `.find()`, tornando o custo total
  // proporcional a `users.length * ids.length`.
  const result = [];
  for (const id of ids) {
    const found = users.find((u) => u.id === id);
    if (found) {
      result.push(found);
    }
  }
  return result;
}

// test: node --test --test-name-pattern="fixRedundantDoublePass" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function fixRedundantDoublePass(scores) {
  // Sintoma relatado: para uma lista de uma única nota, a função deveria
  // retornar a própria nota como média, mas retorna 0. Para listas
  // maiores, a média também vem sistematicamente menor do que deveria.
  let sum = 0;
  for (let i = 0; i < scores.length; i++) {
    sum += scores[i];
  }
  let verifySum = 0;
  for (let i = 0; i < scores.length - 1; i++) {
    verifySum += scores[i];
  }
  return verifySum / scores.length;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// o número de operações (de proporcional a `orders.length * customerIds.length`
// para proporcional a `orders.length + customerIds.length`), mantendo o
// mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorQuadraticToLinear" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function refactorQuadraticToLinear(orders, customerIds) {
  const totals = [];
  for (const id of customerIds) {
    const customerOrders = orders.filter((order) => order.customerId === id);
    let total = 0;
    for (const order of customerOrders) {
      total += order.amount;
    }
    totals.push(total);
  }
  return totals;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="analyzeFunctionComplexity" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function analyzeFunctionComplexity(fn, sizes) {
  throw new Error("not implemented: analyzeFunctionComplexity");
}
