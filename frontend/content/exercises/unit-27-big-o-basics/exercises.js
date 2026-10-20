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
  let total = 0;
  for (const value of arr) total += value;
  return total;
}

// test: node --test --test-name-pattern="countAllPairsNested" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function countAllPairsNested(arr) {
  let pairs = 0;

  for (let first = 0; first < arr.length; first += 1) {
    for (let second = first + 1; second < arr.length; second += 1) {
      pairs += 1;
    }
  }

  return pairs;
}

// test: node --test --test-name-pattern="hasDuplicateNestedLoop" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function hasDuplicateNestedLoop(arr) {
  for (let first = 0; first < arr.length; first += 1) {
    for (let second = first + 1; second < arr.length; second += 1) {
      if (Object.is(arr[first], arr[second])) return true;
    }
  }

  return false;
}

// test: node --test --test-name-pattern="getElementAtIndex" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function getElementAtIndex(arr, index) {
  return arr[index];
}

// test: node --test --test-name-pattern="countHalvingSteps" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function countHalvingSteps(n) {
  let value = Math.floor(n);
  let steps = 0;

  while (value > 1) {
    value = Math.floor(value / 2);
    steps += 1;
  }

  return steps;
}

// test: node --test --test-name-pattern="estimateOperations" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function estimateOperations(patternName, n) {
  const estimators = {
    "single-loop": () => n,
    "nested-loop": () => n * n,
    halving: () => countHalvingSteps(n),
    "two-sequential-loops": () => 2 * n,
  };

  const estimate = estimators[patternName];
  if (!estimate) throw new Error(`padrão desconhecido: ${patternName}`);
  return estimate();
}

// test: node --test --test-name-pattern="sumTwoSeparateLoops" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function sumTwoSeparateLoops(arrA, arrB) {
  let total = 0;
  for (const value of arrA) total += value;
  for (const value of arrB) total += value;
  return total;
}

// test: node --test --test-name-pattern="sumMatrixNestedLoop" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function sumMatrixNestedLoop(matrix) {
  let total = 0;
  for (const row of matrix) {
    for (const value of row) total += value;
  }
  return total;
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="hasDuplicateWithSet" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function hasDuplicateWithSet(arr) {
  const seen = new Set();

  for (const value of arr) {
    if (seen.has(value)) return true;
    seen.add(value);
  }

  return false;
}

// test: node --test --test-name-pattern="classifyGrowthFromSamples" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function classifyGrowthFromSamples(samples) {
  if (samples.length < 2) {
    throw new Error("são necessárias ao menos duas amostras");
  }

  const first = samples[0];
  const last = samples.at(-1);
  const observedRatio = last.operations / first.operations;
  const inputRatio = last.n / first.n;
  const expectedRatios = {
    constant: 1,
    logarithmic: Math.log2(last.n) / Math.log2(first.n),
    linear: inputRatio,
    quadratic: inputRatio ** 2,
  };

  return Object.entries(expectedRatios).reduce(
    (best, [label, expectedRatio]) => {
      const error = Math.abs(Math.log(observedRatio / expectedRatio));
      return error < best.error ? { label, error } : best;
    },
    { label: "constant", error: Number.POSITIVE_INFINITY },
  ).label;
}

// test: node --test --test-name-pattern="countNestedLoopIterations" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function countNestedLoopIterations(n, m) {
  let iterations = 0;
  for (let row = 0; row < n; row += 1) {
    for (let column = 0; column < m; column += 1) iterations += 1;
  }
  return iterations;
}

// test: node --test --test-name-pattern="compareComplexityLabels" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function compareComplexityLabels(a, b) {
  const order = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)"];
  const rankA = order.indexOf(a);
  const rankB = order.indexOf(b);

  if (rankA === -1 || rankB === -1) {
    throw new Error("rótulo de complexidade desconhecido");
  }

  return Math.sign(rankA - rankB);
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
  const usersById = new Map(users.map((user) => [user.id, user]));
  return ids.flatMap((id) => {
    const user = usersById.get(id);
    return user ? [user] : [];
  });
}

// test: node --test --test-name-pattern="fixRedundantDoublePass" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function fixRedundantDoublePass(scores) {
  // Sintoma relatado: para uma lista de uma única nota, a função deveria
  // retornar a própria nota como média, mas retorna 0. Para listas
  // maiores, a média também vem sistematicamente menor do que deveria.
  if (scores.length === 0) return 0;

  let sum = 0;
  for (const score of scores) sum += score;
  return sum / scores.length;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// o número de operações (de proporcional a `orders.length * customerIds.length`
// para proporcional a `orders.length + customerIds.length`), mantendo o
// mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorQuadraticToLinear" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function refactorQuadraticToLinear(orders, customerIds) {
  const totalsByCustomer = new Map();

  for (const order of orders) {
    const currentTotal = totalsByCustomer.get(order.customerId) ?? 0;
    totalsByCustomer.set(order.customerId, currentTotal + order.amount);
  }

  return customerIds.map((id) => totalsByCustomer.get(id) ?? 0);
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="analyzeFunctionComplexity" exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
export function analyzeFunctionComplexity(fn, sizes) {
  const samples = sizes.map((n) => {
    let operations = 0;
    fn(n, () => {
      operations += 1;
    });
    return { n, operations };
  });

  return classifyGrowthFromSamples(samples);
}
