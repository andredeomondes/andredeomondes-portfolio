# Unidade 15 — Iterables e generators

Fase 1, Unidade 15. Cobre: o protocolo de iteração (`Symbol.iterator`,
objetos com `next()` retornando `{ value, done }`), `function*` e
`yield`, consumo manual de generators (`.next()`), generators infinitos,
e composição lazy (map/filter/take sobre iteráveis, sem criar arrays
intermediários).

## Antes de começar

Responda por escrito (pode ser neste README, numa cópia local, ou em
`notes/concepts/` se quiser guardar):

1. O que faz `for...of` funcionar em um array, mas **não** em um objeto
   comum `{ a: 1, b: 2 }`? O que teria que existir no objeto para que
   `for...of` funcionasse nele?
2. Um generator (`function*`) roda tudo de uma vez quando é chamado, ou
   só quando você pede o próximo valor?
3. Por que é possível ter um generator que produz uma sequência
   **infinita** de valores sem travar o programa?

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.js`. O primeiro exercício (`createRangeIterable`) já
   vem resolvido como exemplo de estilo — leia com atenção antes de
   seguir.
2. Os demais exercícios têm `throw new Error("not implemented: <nome>")`.
3. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-15-iterables-generators/exercises.test.js
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging, e o primeiro exercício, que já
   está implementado). Isso é esperado.
5. Não use bibliotecas externas.

## Exercícios fundamentais (8)

1. **`createRangeIterable(start, end)`** — retorna um objeto que
   implementa o protocolo de iteração **manualmente** (sem `function*`):
   define `[Symbol.iterator]()` retornando um objeto com `next()` que
   devolve `{ value, done }`. **Já implementado como exemplo.**
2. **`isIterable(value)`** — retorna `true` se `value` tem um método em
   `value[Symbol.iterator]`, `false` caso contrário (incluindo `null` e
   tipos primitivos sem essa interface).
3. **`collectToArray(iterable)`** — percorre qualquer iterável com
   `for...of` e retorna um array com todos os valores.
4. **`countUpTo(n)`** — generator (`function*`) que gera `1, 2, ..., n`.
5. **`take(iterable, n)`** — generator que recebe **qualquer** iterável
   (inclusive um infinito) e produz apenas os `n` primeiros valores,
   parando de consumir o resto.
6. **`fibonacciGenerator()`** — generator **infinito** que produz a
   sequência de Fibonacci: `0, 1, 1, 2, 3, 5, 8, ...`.
7. **`sumFirstN(generatorFn, n)`** — recebe uma função geradora (não
   chamada ainda) e um `n`; chama `generatorFn()` para obter o iterador e
   consome manualmente `n` valores usando `.next()`, somando-os.
8. **`createLinkedListIterable()`** — retorna um objeto com
   `append(value)` (adiciona ao final, retorna o próprio objeto para
   encadear chamadas) que também implementa `[Symbol.iterator]`, de
   forma que `for...of` (ou spread `[...lista]`) funcione diretamente
   sobre a lista.

## Exercícios intermediários (4)

9. **`mapGenerator(iterable, fn)`** — generator que aplica `fn` a cada
   item de `iterable`, produzindo os resultados **um de cada vez**
   (lazy), sem construir um array intermediário.
10. **`filterGenerator(iterable, predicate)`** — generator que produz
    apenas os itens de `iterable` para os quais `predicate(item)` é
    verdadeiro, também de forma lazy.
11. **`zipGenerators(iterA, iterB)`** — generator que produz pares
    `[a, b]` combinando os dois iteráveis posição a posição, parando
    assim que qualquer um dos dois se esgotar.
12. **`createPaginatedCollection(items, pageSize)`** — retorna um objeto
    com `totalPages()` (quantas páginas de tamanho `pageSize` cabem em
    `items`) e que é **diretamente iterável** (`[Symbol.iterator]`),
    produzindo uma página (array) por vez.

## Debugging (2)

13. **`brokenRange(start, end)`** — deveria gerar `start, start+1, ..., end`
    (inclusive), mas o primeiro valor (`start`) nunca aparece na saída
    por causa da ordem entre o incremento e o `yield`. Corrija.
14. **`brokenTakeEvery(iterable)`** — deveria produzir os itens de índice
    par (posições `0, 2, 4, ...`), mas está produzindo os de índice ímpar
    por um erro na contagem do índice. Corrija.

## Refatoração (1)

15. **`messyPipeline(numbers)`** — já funciona corretamente: dobra cada
    número, filtra os que continuam pares, e produz (via `yield`) os 3
    primeiros. Mas usa três laços `for` separados com arrays
    intermediários. Refatore usando os generators desta própria unidade
    (`mapGenerator`, `filterGenerator`, `take`) ou uma versão mais
    enxuta, mantendo o mesmo comportamento observável.

## Desafio integrador (1)

16. **`createTypedNumberGenerator(values)`** — recebe um array de valores
    mistos e retorna uma **função geradora** (chamável, sem argumentos)
    que, ao ser iterada:
    - ignora valores que não sejam `number` válido nem string numérica
      convertível (ex.: `"42"`, `"3.5"` valem, `"abc"`, `null` não);
    - converte strings numéricas válidas para `number` antes do `yield`;
    - **para imediatamente** (sem consumir o restante do array) se
      encontrar o valor sentinela `"STOP"`.

    Este exercício combina generators com classificação de tipos e
    coerção (unidades 1 e 2).

## Critérios de aceitação

- Os testes da unidade passam sem falhas.
- Você consegue explicar, sem consultar o código, por que um generator
  infinito (como `fibonacciGenerator`) não trava o programa quando você
  só pega os primeiros valores dele.
- Você entende a diferença entre construir um array intermediário em
  cada etapa de um pipeline e encadear generators lazy.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
