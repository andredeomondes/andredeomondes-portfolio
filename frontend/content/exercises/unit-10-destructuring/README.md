# Unidade 10 — Destructuring

Fase 1, Unidade 10. Cobre: destructuring de arrays, de objetos,
aninhado, com valores padrão, com renomeação de chaves e diretamente em
parâmetros de função.

Por que isso importa para backend: extrair campos de um `req.body`, ler
configuração com defaults, desmontar o resultado de uma query, ou
declarar parâmetros nomeados de uma função de serviço — tudo isso fica
mais legível com destructuring do que com acesso manual repetido a
`objeto.propriedade`.

## Antes de começar

Responda por escrito:

1. Quando você desestrutura um array (`const [a, b] = arr`), o que
   importa: a **posição** ou o **nome** da variável? E em um objeto
   (`const { x } = obj`)?
2. O que acontece se você tentar desestruturar uma propriedade aninhada
   de um valor que é `undefined` no meio do caminho (ex.:
   `const { a: { b } } = { a: undefined }`)?
3. Um valor padrão em destructuring (`const { x = 10 } = obj`) é usado
   quando `x` é `undefined`, ou também quando `x` é `null`?

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — a pergunta 3 tem uma resposta que costuma surpreender.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Resolva os exercícios usando destructuring de verdade (na declaração
   ou no parâmetro da função) — evitar `obj.propriedade` repetido é o
   ponto da unidade.

## Exercícios fundamentais (8)

1. **`extractFirstTwo(arr)`** — retorna `{ first, second }` com os dois
   primeiros elementos do array, usando destructuring de array.
2. **`swapPair(pair)`** — recebe `[a, b]` e retorna `[b, a]`, usando o
   truque de troca `[a, b] = [b, a]` por destructuring.
3. **`getNameAndAge(person)`** — recebe `{ name, age }` e retorna a
   string `"<name>, <age> anos"`.
4. **`extractWithDefault(options)`** — recebe um objeto que pode conter
   `retries` e `timeout`; retorna `{ retries, timeout }` usando valores
   padrão `3` e `1000` na desestruturação quando ausentes.
5. **`extractNestedCity(user)`** — recebe `{ address: { city, state } }`
   e retorna apenas `city`, usando destructuring aninhado direto na
   declaração.
6. **`skipMiddleElement(arr)`** — recebe um array de exatamente 3
   elementos e retorna `[primeiro, terceiro]`, pulando o elemento do
   meio com a sintaxe de "buraco" (`[a, , c]`).
7. **`renameKeys(record)`** — recebe `{ id, name }` e retorna
   `{ identifier, label }`, renomeando as variáveis durante a
   desestruturação (`{ id: identifier, name: label }`).
8. **`describeProduct({ name, price })`** — a assinatura já desestrutura
   o parâmetro. Retorne a string `"<name>: $<price>"`.

## Exercícios intermediários (4)

9. **`swapMatrixRows(matrix)`** — recebe uma matriz (array de arrays) e
   retorna uma **nova** matriz com a primeira e a última linha
   trocadas de posição, usando destructuring de atribuição sobre os
   elementos do array (`[a, b] = [b, a]`). Não modifique o array
   original.
10. **`describeMinMax(getMinMax, numbers)`** — `getMinMax` é uma função
    que recebe `numbers` e retorna uma tupla `[min, max]`. Desestruture
    essa tupla e retorne a string `"min=<min>, max=<max>"`.
11. **`describeShippingAddress(order)`** — `order` tem o formato
    `{ customer: { name }, shipping: { address: { city, zip } } }`.
    Desestruture tudo de uma vez (aninhado + renomeação/omissão não
    necessária) e retorne `"<name> - <city> (<zip>)"`. Se `city` estiver
    ausente, use o valor padrão `"não informado"` na própria
    desestruturação.
12. **`entriesToLines(record)`** — percorra `Object.entries(record)`
    com `for...of`, desestruturando cada par como `[key, value]`, e
    retorne um array de strings `"<key>: <value>"`.

## Debugging (2)

13. **`fixSwappedDestructureBug(rectangle)`** — a desestruturação atual
    renomeia `width` para `height` e vice-versa
    (`{ width: height, height: width }`), invertendo os valores.
    Corrija para desestruturar sem renomear.
14. **`fixNestedPathDestructureBug(order)`** — o código desestrutura a
    partir de `order.customer` em vez de `order`, então tenta acessar
    `customer.address` dentro de um objeto que já É o customer (que não
    tem uma propriedade `customer` aninhada). Corrija a origem da
    desestruturação.

## Refatoração (1)

15. **`refactorManualPropertyAccess(user)`** — a implementação atual
    acessa `user.name`, `user.age`, `user.address.city`,
    `user.address.state` e `user.contact.email` repetidamente com
    notação de ponto. Refatore usando destructuring (aninhado, com
    renomeação se achar útil) no topo da função, mantendo o mesmo
    resultado — inclusive o caso em que `email` está ausente.

## Desafio integrador (1)

16. **`parseConfigEntries(entries)`** — `entries` é um array de pares
    `[chave, valorString]` (como o retorno de `Object.entries`).
    Percorra com `for...of` desestruturando `[key, value]` e monte um
    objeto de configuração convertendo os valores:
    - `"true"` vira `true`, `"false"` vira `false` (booleano);
    - strings que representam número (ex.: `"3"`) viram `number`;
    - qualquer outro valor permanece string.

    Isso combina destructuring de array (a cada iteração) com controle
    de fluxo (Unidade 2) e construção de objeto (Unidade 7).

## Critérios de aceitação

- `npm test` sem falhas.
- As soluções usam destructuring em vez de acesso repetido por ponto
  onde isso deixa o código mais claro.
- Você consegue explicar, sem consultar o código, por que
  `const { x = 10 } = { x: null }` resulta em `x === null` (o padrão só
  entra em ação para `undefined`).

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
