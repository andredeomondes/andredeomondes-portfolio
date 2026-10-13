# Unidade 25 — Imutabilidade

Fase 1, Unidade 25. Cobre: `Object.freeze`, cópias imutáveis de objetos e
arrays, padrões de atualização sem mutação (spread, `slice`, `map`),
congelamento profundo (deep freeze) e atualização de estruturas aninhadas
preservando imutabilidade em cada nível do caminho.

## Por que isso importa para backend

Estado mutável compartilhado é uma das fontes mais comuns de bugs difíceis
de reproduzir: uma função que recebe um array "só para ler" e o ordena no
lugar, um objeto de configuração que é alterado por um módulo distante e
quebra outro, um cache que muda "por baixo dos panos" enquanto outra parte
do código ainda segura uma referência antiga. Trabalhar com cópias
imutáveis torna o fluxo de dados previsível: quem recebe um valor sabe que
ele não vai mudar sozinho, e quem quer uma versão nova precisa pedir
explicitamente (e recebe uma referência nova, rastreável).

## Antes de começar

Responda por escrito antes de abrir qualquer documentação:

1. `Object.freeze(obj)` impede que `obj.propriedade = x` funcione. Isso
   também impede `obj.propriedadeAninhada.outraPropriedade = x`? Por quê?
2. Em um módulo ES (`import`/`export`), o código roda sempre em modo
   estrito (`"use strict"` implícito). O que acontece, exatamente, ao
   tentar atribuir uma propriedade em um objeto congelado nesse modo —
   comparado ao modo não estrito?
3. `[...arr]` e `arr.slice()` produzem o mesmo resultado para copiar um
   array raso. Isso também vale para `{...obj}` e `Object.assign({}, obj)`?

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-25-immutability/exercises.test.js
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Regra da unidade: nenhuma função pode mutar o objeto/array/`Set` que
   recebeu como argumento. Se o teste comparar o valor original antes e
   depois da chamada e ele tiver mudado, a implementação está errada —
   mesmo que o valor de retorno esteja certo.

## Exercícios fundamentais (8)

1. **`freezeConfig(config)`** — retorna o próprio `config` depois de
   aplicar `Object.freeze`, tornando suas propriedades de primeiro nível
   somente leitura.
2. **`safeAssign(frozenObj, key, value)`** — tenta atribuir
   `frozenObj[key] = value`. Como o código roda em modo estrito, essa
   atribuição lança `TypeError` quando `frozenObj` está congelado. Capture
   o erro e retorne `{ success: false, error: <mensagem> }`; se a
   atribuição funcionar (objeto não congelado), retorne
   `{ success: true, value }`.
3. **`updateImmutable(obj, key, value)`** — retorna um **novo** objeto com
   `key` atualizado para `value`, sem alterar `obj`.
4. **`addItemImmutable(arr, item)`** — retorna um **novo** array com
   `item` adicionado ao final, sem usar `.push()` no array original.
5. **`removeItemImmutable(arr, index)`** — retorna um **novo** array sem o
   elemento na posição `index`, sem usar `.splice()` no array original.
6. **`updateItemImmutable(arr, index, updater)`** — retorna um **novo**
   array onde o elemento em `index` foi substituído por
   `updater(elementoAtual)`; os demais elementos permanecem os mesmos.
7. **`sortImmutable(arr, compareFn)`** — retorna um **novo** array
   ordenado por `compareFn`, sem alterar a ordem do array original.
8. **`mergeObjectsImmutable(base, overrides)`** — retorna um **novo**
   objeto com as propriedades de `base` sobrescritas pelas de `overrides`
   (mescla rasa), sem alterar nenhum dos dois.

## Exercícios intermediários (4)

9. **`deepFreeze(obj)`** — congela `obj` e, recursivamente, todo objeto ou
   array aninhado dentro dele (valores primitivos não precisam de
   tratamento especial). Retorna o próprio `obj`, agora profundamente
   congelado.
10. **`updateNestedImmutable(obj, path, value)`** — `path` é um array de
    chaves (ex.: `["a", "b", "c"]`). Retorna uma **nova** cópia de `obj`
    com o valor no caminho aninhado atualizado para `value`, criando uma
    nova cópia em **cada nível do caminho** (não só no objeto raiz) — os
    ramos que não fazem parte do caminho podem continuar apontando para os
    mesmos objetos internos do original.
11. **`toggleSetImmutable(set, value)`** — recebe um `Set`. Se `value` já
    está no `Set`, retorna um **novo** `Set` sem ele; se não está, retorna
    um **novo** `Set` com ele adicionado. O `Set` original nunca é
    alterado.
12. **`withoutKeysImmutable(obj, keys)`** — `keys` é um array de nomes de
    propriedade. Retorna um **novo** objeto sem essas chaves, sem alterar
    `obj`.

## Debugging (2)

13. **`fixMutatingSort(products)`** — a implementação atual chama
    `.sort()` diretamente no array recebido, o que reordena o array do
    chamador "por baixo dos panos". Corrija para retornar uma lista
    ordenada sem mutar `products`.
14. **`fixFrozenIgnoredMutation(state, key, value)`** — a implementação
    atual tenta atribuir a propriedade diretamente em `state` (que está
    congelado) dentro de um `try/catch` que engole o erro em silêncio. A
    função nunca atualiza nada e ninguém percebe. Corrija para que a
    função retorne corretamente um **novo** objeto de estado com `key`
    atualizado para `value`, sem depender de mutar um objeto congelado.

## Refatoração (1)

15. **`refactorMutatingCartOperations(cart, action)`** — a implementação
    atual funciona, mas muta `cart` e `cart.items` diretamente
    (`.push()`, `.pop()`, `cart.items.length = 0`, atribuições diretas em
    `cart.itemCount`). Refatore para que a função **nunca** mute o `cart`
    recebido, retornando sempre um novo objeto de carrinho, mantendo o
    mesmo comportamento observável para as ações `"add"`, `"removeLast"`
    e `"clear"`.

## Desafio integrador (1)

16. **`applyImmutablePatch(state, patches)`** — recebe um estado inicial e
    uma lista de `patches` (`{ path: string[], value }`). Aplique cada
    patch de forma imutável (usando a mesma lógica de
    `updateNestedImmutable`) e retorne um array com o **histórico
    completo de estados**: o estado inicial seguido do estado resultante
    depois de cada patch. Nenhum estado do histórico pode ser afetado por
    patches aplicados depois dele — para garantir isso, cada estado do
    histórico deve ser retornado congelado (`Object.freeze`). Este
    exercício combina cópia imutável, atualização aninhada e
    congelamento — os mesmos temas da unidade.

## Critérios de aceitação

- `node --test exercises/01-javascript-core/unit-25-immutability/exercises.test.js`
  sem falhas.
- Nenhuma função da unidade muta o argumento que recebeu (arrays,
  objetos ou `Set`s), exceto onde o próprio enunciado pede explicitamente
  `Object.freeze` sobre o valor retornado.
- Você consegue explicar, sem consultar o código, por que
  `Object.freeze` é raso (afeta só o primeiro nível) e o que isso implica
  para objetos aninhados.
- Você consegue explicar por que uma atribuição em um objeto congelado
  lança erro em módulos ES, mesmo sem `"use strict"` explícito no arquivo.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
