# Unidade 27 — Big O básico

Fase 1, Unidade 27 — última unidade da Fase 1 (JavaScript profundo para
backend). Cobre: intuição de complexidade (`O(1)`, `O(log n)`, `O(n)`,
`O(n log n)`, `O(n²)`) em laços e arrays comuns, contando operações "na
mão" em vez de provar formalmente a complexidade de algoritmos.

## Nível desta unidade

Esta é uma introdução **de linguagem**, não uma unidade de estruturas de
dados e algoritmos. O objetivo é você olhar para um laço simples ou um
laço aninhado e sentir, de forma intuitiva e prática, como o número de
operações cresce com o tamanho da entrada — o suficiente para reconhecer
um `for` dentro de outro `for` como um sinal de alerta, e para não se
assustar quando alguém falar "isso aqui é O(n²)" numa reunião.

Se você quer profundidade algorítmica de verdade (análise formal,
estruturas de dados, provas de complexidade), isso vive na trilha
paralela em `exercises/12-dsa-algorithms/` (comece por
`session-01-big-o-arrays`, se ainda não viu). Esta unidade não repete
aquele conteúdo — ela existe para fechar a Fase 1 com o vocabulário
mínimo de complexidade que qualquer código de backend exige, mesmo antes
de estudar algoritmos a fundo.

## Por que isso importa para backend

Um endpoint que responde em 50ms com 100 registros no banco de
desenvolvimento e trava com 500ms+ em produção com 100 mil registros quase
sempre esconde um laço aninhado, uma busca linear dentro de outro laço, ou
uma cópia desnecessária de dados repetida a cada iteração. Você não
precisa provar formalmente a complexidade do seu código todo dia — mas
precisa conseguir olhar para ele e perguntar "isso aqui faz mais trabalho
do que parece, à medida que a entrada cresce?" antes que o incidente em
produção te obrigue a perguntar isso sob pressão.

## Antes de começar

Responda por escrito antes de abrir qualquer documentação:

1. Se um laço simples percorre um array de tamanho `n` uma vez, quantas
   operações (aproximadamente) ele faz? E se, dentro desse laço, houver
   outro laço que também percorre o array inteiro?
2. Por que `array[5]` (acessar um índice específico) não fica mais lento
   conforme o array cresce, mas `array.find(...)` ou `array.includes(...)`
   ficam?
3. O que significa, na prática, "trocar espaço por tempo"? Pense em usar
   um `Set` ou um `Map` para evitar buscas repetidas dentro de um laço.

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging, e o de refatoração, que já
   funciona corretamente). Isso é esperado.
5. Um dos testes de debugging mede tempo de execução real
   (`Date.now()`) com uma entrada grande, para tornar visível a diferença
   entre uma implementação O(n·m) e uma O(n+m). Se ele passar mesmo com a
   implementação "ruim" na sua máquina (hardware muito rápido), não é um
   problema do exercício — implemente a correção de qualquer forma, ela
   continua sendo a resposta certa.

## Exercícios fundamentais (8)

1. **`sumWithSingleLoop(arr)`** — soma todos os elementos de `arr` com um
   único laço. Exemplo de trabalho proporcional a `n`: **O(n)**.
2. **`countAllPairsNested(arr)`** — conta quantos pares `(i, j)` com
   `i < j` existem em `arr`, usando dois laços aninhados (um dentro do
   outro). Exemplo de trabalho proporcional a `n²`: **O(n²)**.
3. **`hasDuplicateNestedLoop(arr)`** — retorna `true` se existir algum
   valor repetido em `arr`, comparando cada elemento com todos os
   outros através de laços aninhados. Também **O(n²)** — você vai
   reescrever essa mesma lógica de forma mais eficiente no exercício 9.
4. **`getElementAtIndex(arr, index)`** — retorna `arr[index]`, ou
   `undefined` se `index` estiver fora dos limites. Não importa se
   `arr` tem 10 ou 10 milhões de elementos: o custo é o mesmo. **O(1)**.
5. **`countHalvingSteps(n)`** — conta quantas vezes é possível dividir
   `n` por 2 (usando divisão inteira) até chegar a `1`. Esse é o padrão
   por trás de algoritmos como busca binária: **O(log n)**.
6. **`estimateOperations(patternName, n)`** — recebe o nome de um padrão
   (`"single-loop"`, `"nested-loop"`, `"halving"` ou
   `"two-sequential-loops"`) e um tamanho `n`, e retorna quantas
   operações esse padrão realiza para aquele `n` (respectivamente: `n`,
   `n * n`, o resultado de `countHalvingSteps(n)`, e `2 * n`). Lança erro
   para um nome de padrão desconhecido.
7. **`sumTwoSeparateLoops(arrA, arrB)`** — soma os elementos de `arrA` e
   depois, num laço **separado** (não aninhado), os elementos de `arrB`,
   retornando o total. Dois laços sequenciais custam `n + m`, não
   `n * m` — continuam sendo, no fundo, **O(n)**.
8. **`sumMatrixNestedLoop(matrix)`** — soma todos os elementos de uma
   matriz (array de arrays) usando laços aninhados — aqui o aninhamento é
   genuinamente necessário, porque você precisa visitar cada célula de
   uma estrutura bidimensional.

## Exercícios intermediários (4)

9. **`hasDuplicateWithSet(arr)`** — resolve o mesmo problema do exercício
   3, mas usando um `Set` para registrar valores já vistos, sem laços
   aninhados. Isso troca espaço extra (o `Set`) por tempo, reduzindo o
   custo de **O(n²)** para **O(n)**.
10. **`classifyGrowthFromSamples(samples)`** — recebe uma lista de
    amostras `{ n, operations }` (pelo menos duas, com `n` diferentes) e
    classifica o padrão de crescimento como `"constant"`, `"linear"`,
    `"quadratic"` ou `"logarithmic"`, comparando como `operations` cresce
    em relação a como `n` cresce entre a menor e a maior amostra.
11. **`countNestedLoopIterations(n, m)`** — conta quantas iterações um
    laço aninhado de tamanhos `n` e `m` realiza (`n * m`), sem usar
    multiplicação diretamente — use dois laços `for` de verdade. Compare
    mentalmente com `sumTwoSeparateLoops`: aninhado multiplica, sequencial
    soma.
12. **`compareComplexityLabels(a, b)`** — recebe dois rótulos dentre
    `"O(1)"`, `"O(log n)"`, `"O(n)"`, `"O(n log n)"`, `"O(n^2)"` (nessa
    ordem, do que cresce mais devagar para o que cresce mais rápido) e
    retorna `-1` se `a` cresce mais devagar que `b`, `1` se cresce mais
    rápido, e `0` se forem iguais.

## Debugging (2)

13. **`fixAccidentalQuadraticLookup(users, ids)`** — o resultado está
    correto, mas a função é acidentalmente **O(n·m)**: para cada `id`,
    ela varre a lista inteira de `users` de novo com `.find()`. Corrija
    para **O(n+m)**, construindo um índice (`Map`) de `users` por `id`
    uma única vez, antes do laço sobre `ids`.
14. **`fixRedundantDoublePass(scores)`** — deveria calcular a média de
    `scores`, mas faz um segundo laço "de verificação" desnecessário (e
    redundante) com um bug de índice (`scores.length - 1`) que ignora o
    último elemento, retornando uma média sistematicamente errada — e
    `0` para listas de um único valor. Corrija unificando em um único
    laço correto.

## Refatoração (1)

15. **`refactorQuadraticToLinear(orders, customerIds)`** — a
    implementação atual funciona corretamente, mas para cada
    `customerId` ela filtra a lista `orders` inteira de novo
    (`.filter()` dentro de um laço), custando **O(n·m)**. Refatore
    construindo uma estrutura de índice (`Map` ou objeto agrupando
    pedidos por `customerId`) uma única vez, reduzindo o custo para
    **O(n+m)**, mantendo o mesmo comportamento observável.

## Desafio integrador (1)

16. **`analyzeFunctionComplexity(fn, sizes)`** — recebe uma função
    `fn(n, tick)` que, internamente, chama `tick()` uma vez para cada
    "operação fundamental" que realiza, e uma lista de tamanhos `sizes`
    (pelo menos dois valores). Para cada tamanho, execute `fn(n, tick)`
    contando quantas vezes `tick` foi chamada, monte a lista de amostras
    `{ n, operations }` e classifique o crescimento usando a mesma lógica
    de `classifyGrowthFromSamples`. Este exercício une medição prática
    (contar operações de verdade) com classificação de crescimento — os
    dois lados da intuição de Big O que a unidade trabalhou.

## Critérios de aceitação

- `node --test exercises/01-javascript-core/unit-27-big-o-basics/exercises.test.js`
  sem falhas.
- Você consegue olhar para um `for` dentro de outro `for`, percorrendo a
  mesma coleção (ou coleções de tamanho comparável), e reconhecer isso
  como um candidato a **O(n²)** — mesmo sem calcular nada formalmente.
- Você consegue explicar, sem consultar o código, por que trocar uma
  busca linear repetida (`.find()`/`.includes()` dentro de um laço) por
  um índice (`Map`/`Set`/objeto) construído uma única vez reduz o
  trabalho total.
- Você fecha a Fase 1 conseguindo, junto com as unidades anteriores,
  cumprir o "gate da fase" descrito em `BACKEND_ENGINEERING_FORGE.md`:
  entre outras coisas, **analisar complexidade básica** de um trecho de
  código sem ajuda.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
