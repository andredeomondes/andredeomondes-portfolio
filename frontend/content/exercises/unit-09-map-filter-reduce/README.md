# Unidade 9 — map, filter, find, some, every, reduce

Fase 1, Unidade 9. Cobre: `Array.prototype.map`, `filter`, `find`,
`some`, `every` e `reduce`.

Por que isso importa para backend: transformar linhas de banco de dados
em DTOs, filtrar registros por permissão, checar se algum item de um
lote falhou, agregar totais de pedidos — quase todo processamento de
coleções em uma API passa por esses métodos. Escrever loops manuais para
isso (como você fez na Unidade 2) ainda é útil para entender o mecanismo,
mas no dia a dia essas funções de alta ordem (Unidade 8) prontas da
linguagem são o padrão.

## Antes de começar

Responda por escrito:

1. `map` sempre retorna um array do mesmo tamanho que o original. Por
   quê? O que isso implica quando você quer "filtrar e transformar" ao
   mesmo tempo?
2. Qual a diferença entre `some` e `every`? O que cada um retorna para
   um array vazio?
3. `reduce` sem valor inicial usa o primeiro elemento do array como
   valor inicial. Por que isso é perigoso quando o array pode estar
   vazio?

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Use os métodos da unidade (`map`, `filter`, `find`, `some`, `every`,
   `reduce`) em vez de laços `for` manuais — esse é o ponto da unidade.
   Exceção: nos exercícios de debugging e refatoração, o código de
   partida já existe e você só ajusta o necessário.

## Exercícios fundamentais (8)

1. **`doubleAll(numbers)`** — retorna um novo array com cada número
   multiplicado por 2, usando `map`.
2. **`keepEven(numbers)`** — retorna apenas os números pares, usando
   `filter`.
3. **`findFirstAbove(numbers, threshold)`** — retorna o primeiro número
   estritamente maior que `threshold`, usando `find`. Retorna
   `undefined` se nenhum satisfizer.
4. **`hasNegative(numbers)`** — retorna `true` se existir ao menos um
   número negativo, usando `some`.
5. **`allPositive(numbers)`** — retorna `true` se todos os números forem
   positivos, usando `every` (um array vazio é considerado `true`).
6. **`sumAll(numbers)`** — soma todos os números usando `reduce` **com
   valor inicial** `0` (assim funciona também para array vazio).
7. **`pluck(objects, key)`** — recebe um array de objetos e retorna um
   array só com os valores de `key` de cada objeto, usando `map`.
8. **`countMatching(items, predicate)`** — conta quantos itens
   satisfazem `predicate`, usando `filter` (e `.length`).

## Exercícios intermediários (4)

9. **`groupByKey(items, key)`** — agrupa os itens em um objeto, onde
   cada chave é um valor distinto de `item[key]` e o valor é um array
   com os itens daquele grupo, na ordem original. Use `reduce`.
10. **`maxBy(items, fn)`** — retorna o item cujo `fn(item)` é o maior
    entre todos, usando `reduce`. Retorna `undefined` para array vazio.
    Note que o retorno é o **item inteiro**, não o valor calculado.
11. **`sumNested(arrayOfArrays)`** — recebe um array de arrays de
    números e retorna a soma de todos os números de todos os
    sub-arrays, combinando `reduce` (externo) com `reduce` ou soma
    (interno).
12. **`uniqueBy(items, key)`** — retorna um novo array mantendo apenas a
    **primeira** ocorrência de cada valor distinto de `item[key]`, na
    ordem original, usando `filter` e uma estrutura auxiliar (`Set`) para
    rastrear o que já foi visto.

## Debugging (2)

13. **`fixFilterThresholdBug(numbers, threshold)`** — o filtro atual usa
    `>=`, mantendo números iguais a `threshold`, mas o comportamento
    esperado é manter apenas números **estritamente maiores**. Corrija o
    operador.
14. **`fixReduceInitialValueBug(prices)`** — o `reduce` atual não recebe
    valor inicial, o que faz a função lançar erro para uma lista vazia.
    Adicione o valor inicial correto.

## Refatoração (1)

15. **`refactorImperativeTotal(orders)`** — a implementação atual usa um
    `for` manual com `if` para somar `amount * quantity` apenas dos
    pedidos com `status === "paid"`. Refatore usando `filter` seguido de
    `reduce` (ou `reduce` sozinho com uma checagem interna), mantendo o
    mesmo resultado.

## Desafio integrador (1)

16. **`summarizeSalesByCategory(transactions)`** — recebe uma lista de
    transações (`{ category, amount }`) e retorna:

    ```js
    {
      byCategory: { [category]: totalDaCategoria, ... },
      grandTotal: somaDeTudo,
    }
    ```

    Combine `reduce` para montar `byCategory` e `reduce` (ou a soma dos
    valores de `byCategory`) para `grandTotal`. Lista vazia retorna
    `{ byCategory: {}, grandTotal: 0 }`.

## Critérios de aceitação

- `npm test` sem falhas.
- Nenhuma solução dos exercícios fundamentais/intermediários/desafio usa
  laço `for`/`while` manual — apenas os métodos de array desta unidade.
- Você consegue explicar, sem consultar o código, por que `reduce` sem
  valor inicial quebra para array vazio.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
