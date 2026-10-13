# Unidade 11 — Spread e rest

Fase 1, Unidade 11. Cobre: o operador `...` nas suas duas formas —
**spread** (expandir um array/objeto em elementos/propriedades
individuais) e **rest** (coletar múltiplos argumentos ou elementos
restantes em um único array).

Por que isso importa para backend: copiar objetos sem mutar o original
(imutabilidade — assunto que volta com força na Unidade 26), fazer merge
de configuração com overrides, montar payloads de resposta a partir de
dados existentes mais alguns campos extras, e escrever funções que
aceitam número variável de argumentos (como um logger) são tudo isso.

## Antes de começar

Responda por escrito:

1. `[...arr]` copia um array. Essa cópia é profunda (todos os níveis) ou
   rasa (só o primeiro nível)? O que acontece se um item do array
   original for um objeto?
2. Qual a diferença entre usar `...` do lado de quem **chama** uma
   função (`fn(...args)`) e do lado de quem **declara** os parâmetros da
   função (`function fn(...args)`)?
3. Em `{...base, ...overrides}`, se `base` e `overrides` tiverem a mesma
   chave, qual valor "vence"? Isso depende da ordem?

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
5. Nenhuma função deve mutar os arrays/objetos recebidos como parâmetro
   — sempre retorne uma cópia nova quando o enunciado pedir "novo
   array"/"novo objeto".

## Exercícios fundamentais (8)

1. **`cloneArray(arr)`** — retorna uma cópia rasa do array usando
   spread (`[...arr]`).
2. **`mergeArrays(a, b)`** — retorna um novo array com os elementos de
   `a` seguidos dos de `b`, usando spread.
3. **`cloneObject(obj)`** — retorna uma cópia rasa do objeto usando
   spread (`{...obj}`).
4. **`mergeObjectsWithOverride(base, overrides)`** — retorna um novo
   objeto combinando `base` e `overrides`, onde os campos de
   `overrides` sobrescrevem os de `base` quando há conflito de chave.
5. **`sumAllArgs(...numbers)`** — usa parâmetro rest para aceitar
   qualquer quantidade de números e retornar a soma (`0` se nenhum for
   passado).
6. **`firstAndRest(arr)`** — usa destructuring com rest
   (`const [first, ...rest] = arr`) e retorna `{ first, rest }`.
7. **`spreadIntoCall(numbers, fn)`** — chama `fn` espalhando os
   elementos de `numbers` como argumentos posicionais (`fn(...numbers)`)
   e retorna o resultado.
8. **`addProperty(obj, key, value)`** — retorna um **novo** objeto igual
   a `obj`, mas com `key` definida como `value` (adicionando ou
   sobrescrevendo), sem alterar `obj`.

## Exercícios intermediários (4)

9. **`describeMainAndExtras(first, second, ...rest)`** — os dois
   primeiros parâmetros são nomeados, o restante é coletado com rest.
   Retorne a string
   `"<first>, <second> e mais <rest.length>: <rest.join(', ')>"`.
10. **`shallowMergeConfig(base, patch)`** — faz merge raso
    (`{...base, ...patch}`) entre dois objetos de configuração. Um dos
    testes existe justamente para você observar que, quando uma chave
    de `patch` é um objeto aninhado, ela **substitui inteiramente** o
    objeto aninhado correspondente em `base` — spread não faz merge
    profundo.
11. **`removeKey(obj, keyToRemove)`** — retorna um novo objeto igual a
    `obj`, mas sem a propriedade `keyToRemove`. Use destructuring com
    rest para "capturar" a chave indesejada separadamente e devolver o
    resto (`const { [keyToRemove]: removed, ...rest } = obj`).
12. **`combineArraysUnique(...arrays)`** — recebe qualquer quantidade de
    arrays (rest) e retorna um único array com todos os elementos
    combinados (spread) e sem duplicados (`Set`), mantendo a ordem de
    primeira aparição.

## Debugging (2)

13. **`fixSpreadMutationBug(cart, newItem)`** — a implementação atual
    usa `cart.push(newItem)`, que **muta** o array original em vez de
    criar um novo. Corrija usando spread para retornar um novo array,
    deixando `cart` intocado.
14. **`fixRestParamsOrderBug(label, ...values)`** — a implementação
    monta `all = [label, ...values]` e depois junta `all`, fazendo o
    rótulo aparecer duplicado no texto final. Corrija para que o rótulo
    apareça só uma vez, antes dos dois-pontos.

## Refatoração (1)

15. **`refactorConcatViaPush(arrays)`** — a implementação atual usa dois
    laços `for` aninhados com `.push()` para concatenar um array de
    arrays em um único array. Refatore usando spread (dentro de um laço
    `for...of`, ou com `Array.prototype.concat`/spread direto),
    mantendo o mesmo resultado.

## Desafio integrador (1)

16. **`buildUpdatedOrder(order, updates, extraItems)`** — `order` é
    `{ id, status, items: [{ name, price, qty }], total }`. Retorne um
    **novo** objeto de pedido que:
    - aplica os campos de `updates` por cima de `order` (spread com
      override, como no exercício 4);
    - adiciona `extraItems` ao final da lista `items` (spread de
      arrays);
    - recalcula `total` como a soma de `price * qty` de **todos** os
      itens (originais + extras), usando `reduce` (Unidade 9).

    O pedido original (`order`) não deve ser modificado. Este exercício
    combina spread de objetos, spread de arrays e `reduce`.

## Critérios de aceitação

- `npm test` sem falhas.
- Nenhuma função muta os parâmetros recebidos, exceto onde o enunciado
  de debugging pede para você corrigir exatamente essa mutação.
- Você consegue explicar, sem consultar o código, por que
  `{...base, ...patch}` faz merge raso, e o que isso implica quando uma
  chave é um objeto aninhado.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
