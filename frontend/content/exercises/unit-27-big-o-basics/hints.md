# Dicas — Unidade 27

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `sumWithSingleLoop`/`countAllPairsNested`: quantas vezes o corpo
  de cada laço roda, em função de `arr.length`? Um laço só, uma vez cada
  elemento; dois laços aninhados, uma vez para cada **par**.
- Para `getElementAtIndex`: por que acessar `arr[5]` não depende de o
  array ter 5 ou 5 milhões de elementos?
- Para `countHalvingSteps`: qual operação você repete até `n` chegar a
  `1`? Quantas vezes dá pra dividir 100 por 2 (usando divisão inteira)
  antes de chegar a 1 ou menos?
- Para `hasDuplicateWithSet`: o que um `Set` te dá que um array simples
  não dá, em termos de velocidade para checar "esse valor já apareceu"?
- Para `classifyGrowthFromSamples`: se `n` decuplica (multiplica por 10)
  e `operations` também decuplica, isso parece linear ou quadrático? E se
  `operations` multiplicar por 100?
- Para `fixAccidentalQuadraticLookup`: o que `.find()` faz por baixo dos
  panos, exatamente? Ele "sabe" onde está o elemento, ou ele procura
  posição por posição?

## Nível 2 — pista mais direta

- `sumWithSingleLoop`: `for (const value of arr) { total += value; }`
- `countAllPairsNested`: laço externo `for (let i = 0; i < arr.length; i++)`,
  laço interno começando em `j = i + 1` (não em `0` — senão você conta
  cada par duas vezes e também compara um elemento com ele mesmo).
- `hasDuplicateNestedLoop`: mesma estrutura de laços de
  `countAllPairsNested`, mas em vez de contar, retorne `true` assim que
  `arr[i] === arr[j]`.
- `getElementAtIndex`: cheque `index < 0 || index >= arr.length` antes
  de acessar.
- `countHalvingSteps`: `while (current > 1) { current = Math.floor(current / 2); steps++; }`
- `estimateOperations`: um `switch` sobre `patternName`, com `default`
  lançando erro. O caso `"halving"` pode reaproveitar `countHalvingSteps`.
- `sumTwoSeparateLoops`: some `arrA` num laço, depois some `arrB` em
  **outro** laço (não aninhado), e retorne a soma dos dois totais.
- `sumMatrixNestedLoop`: laço externo sobre as linhas, laço interno sobre
  as colunas de cada linha.
- `hasDuplicateWithSet`: `const seen = new Set();` — para cada valor,
  se `seen.has(value)` retorne `true`; senão, `seen.add(value)`.
- `classifyGrowthFromSamples`: calcule `growthN = maiorN / menorN` e
  `growthOps = maiorOperations / menorOperations`. Se `growthOps` for
  próximo de `1`, é `"constant"`. Se for próximo de `growthN`, é
  `"linear"`. Se for próximo de `growthN²`, é `"quadratic"`. Caso
  contrário (crescimento bem mais lento que `growthN`), é
  `"logarithmic"`.
- `countNestedLoopIterations`: laço `for (let i = 0; i < n; i++)` com um
  laço `for (let j = 0; j < m; j++)` dentro, incrementando um contador.
- `compareComplexityLabels`: monte um array na ordem
  `["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)"]` e compare os
  índices de `a` e `b` nesse array com `.indexOf()`.
- `fixAccidentalQuadraticLookup`: construa
  `const byId = new Map(users.map((u) => [u.id, u]));` **antes** do laço
  sobre `ids`, e troque `.find()` por `byId.get(id)`.
- `fixRedundantDoublePass`: remova o segundo laço (`verifySum`) por
  completo — ele é redundante e tem o bug de índice. Calcule a média
  direto a partir do `sum` do primeiro laço.
- `refactorQuadraticToLinear`: construa um índice agrupando `orders` por
  `customerId` (um `Map<string, number[]>` ou objeto) **antes** do laço
  sobre `customerIds`, somando os valores durante a construção do índice.
- `analyzeFunctionComplexity`: para cada `n` em `sizes`, crie um contador
  local, chame `fn(n, () => contador++)`, monte `{ n, operations: contador }`
  e no final passe a lista de amostras para `classifyGrowthFromSamples`.

## Nível 3 — quase o código, mas ainda não a solução

- `classifyGrowthFromSamples` (versão final aproximada):
  ```js
  export function classifyGrowthFromSamples(samples) {
    const sorted = [...samples].sort((a, b) => a.n - b.n);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const growthN = last.n / first.n;
    const growthOps = last.operations / first.operations;

    if (growthOps <= 1.5) return "constant";
    if (growthOps >= growthN * growthN * 0.5) return "quadratic";
    if (growthOps >= growthN * 0.5) return "linear";
    return "logarithmic";
  }
  ```
- `fixAccidentalQuadraticLookup` (versão final aproximada):
  ```js
  export function fixAccidentalQuadraticLookup(users, ids) {
    const byId = new Map(users.map((u) => [u.id, u]));
    const result = [];
    for (const id of ids) {
      const found = byId.get(id);
      if (found) result.push(found);
    }
    return result;
  }
  ```
- `refactorQuadraticToLinear` (versão final aproximada):
  ```js
  export function refactorQuadraticToLinear(orders, customerIds) {
    const totalsById = new Map();
    for (const order of orders) {
      const current = totalsById.get(order.customerId) ?? 0;
      totalsById.set(order.customerId, current + order.amount);
    }
    return customerIds.map((id) => totalsById.get(id) ?? 0);
  }
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
