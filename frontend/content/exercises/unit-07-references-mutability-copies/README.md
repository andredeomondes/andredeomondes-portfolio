# Unidade 7 — Referências, mutabilidade e cópias

Fase 1, Unidade 7. Cobre: valor vs. referência, cópia rasa (`shallow copy`)
vs. cópia profunda (`deep copy`), mutação em memória vs. criação de um
novo valor, e efeitos colaterais (`side effects`) causados por
compartilhar a mesma referência.

## Antes de começar

Responda por escrito (pode ser neste README, numa cópia local, ou em
`notes/concepts/` se quiser guardar):

1. Quando você faz `const b = a` com `a` sendo um array, `b` é uma cópia
   de `a` ou os dois apontam para o mesmo array na memória?
2. O que é uma "cópia rasa"? Se um objeto tem uma propriedade que é, ela
   mesma, outro objeto (um objeto aninhado), o que uma cópia rasa faz com
   essa propriedade aninhada — copia o valor ou copia a referência?
3. Por que passar um array para uma função e a função chamar `.push()`
   nele é diferente de passar um número para uma função e a função somar
   `1` a ele? O número "muda" para quem chamou a função?

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Por que isso importa para backend

Bugs de referência compartilhada são uma das causas mais comuns e mais
silenciosas de comportamento errado em produção: um cache que "vaza"
dados entre requisições, um objeto de configuração que muda para todo
mundo porque só uma parte do sistema devia ter mudado a própria cópia,
um array que some do banco de dados em memória porque alguém ordenou "só
para ler". Saber exatamente quando um valor é copiado e quando é
compartilhado é pré-requisito para escrever código concorrente e código
que lida com estado sem se surpreender.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-07-references-mutability-copies/exercises.test.js
   ```

   ou, para rodar toda a suíte do repositório:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Use a linha `// test: node --test --test-name-pattern=...` acima de cada
   função para rodar só aquele exercício enquanto trabalha nele.
6. Quando o enunciado disser "sem mutar" um argumento, os testes verificam
   isso comparando o valor antes e depois da chamada — retornar um novo
   valor é obrigatório, não só recomendado. Quando o enunciado pedir
   mutação explícita, os testes verificam que a referência retornada é a
   **mesma** do argumento recebido.

## Exercícios fundamentais (8)

1. **`isPrimitiveValue(value)`** — retorna `true` se `value` for um tipo
   primitivo (`string`, `number`, `boolean`, `null`, `undefined`), e
   `false` se for objeto, array ou função.
2. **`sameReference(a, b)`** — retorna `true` se `a` e `b` apontam para o
   **mesmo** objeto/array na memória, `false` caso contrário — mesmo que
   `a` e `b` tenham exatamente o mesmo conteúdo, mas sejam dois objetos
   diferentes.
3. **`shallowCopyArray(arr)`** — retorna uma cópia rasa de `arr` (um novo
   array, com os mesmos elementos no nível mais alto). Não modifique
   `arr`.
4. **`shallowCopyObject(obj)`** — retorna uma cópia rasa de `obj` (um novo
   objeto, com as mesmas propriedades no nível mais alto). Não modifique
   `obj`.
5. **`mutateInPlacePush(arr, item)`** — adiciona `item` ao **próprio**
   `arr` recebido (mutação intencional, sem criar um array novo) e
   retorna esse mesmo array.
6. **`appendImmutable(arr, item)`** — retorna um **novo** array com `item`
   adicionado ao final, sem modificar `arr`.
7. **`updateNestedPropertyMutating(obj, key, value)`** — atualiza
   `obj[key] = value` diretamente no objeto recebido (mutação intencional)
   e retorna esse mesmo objeto.
8. **`updateNestedPropertyImmutable(obj, key, value)`** — retorna um
   **novo** objeto com `key` atualizada para `value`, sem modificar `obj`.

## Exercícios intermediários (4)

9. **`shallowCopyKeepsNestedReference(obj)`** — recebe um objeto com uma
   propriedade `nested` (um objeto aninhado). Retorna
   `{ copy, sameNestedRef }`, onde `copy` é uma cópia rasa de `obj` e
   `sameNestedRef` é um booleano indicando se `copy.nested` e `obj.nested`
   apontam para o **mesmo** objeto na memória (a resposta certa demonstra
   por que cópia rasa não protege propriedades aninhadas).
10. **`deepCloneJSON(obj)`** — clona `obj` profundamente usando
    `JSON.parse(JSON.stringify(obj))`. Funciona apenas para dados
    "seguros para JSON" (números, strings, booleanos, `null`, arrays e
    objetos aninhados — sem funções, `undefined`, `Date`, etc.).
11. **`deepCloneManual(value)`** — clona `value` profundamente (objeto ou
    array, com aninhamento arbitrário) **sem** usar `JSON.parse`/
    `JSON.stringify` nem `structuredClone`. Use recursão: se o valor for
    array, clone cada elemento; se for objeto, clone cada propriedade; se
    for primitivo, retorne-o diretamente (primitivos não precisam de
    cópia).
12. **`hasSideEffect(fn, arg)`** — recebe uma função `fn` e um argumento
    `arg` (objeto ou array). Chama `fn(arg)` e retorna `true` se `arg` foi
    modificado como efeito colateral da chamada (compare o estado de
    `arg` antes e depois), ou `false` se `arg` permaneceu intacto.

## Debugging (2)

13. **`fixMutatingSortBug(items)`** — o sintoma relatado é que, depois de
    pedir "os 3 produtos mais baratos" através dessa função, a lista
    original de produtos (mantida em outra parte do sistema, que só tinha
    passado a mesma referência de array) aparece reordenada, mesmo que
    ninguém tenha pedido para reordenar nada além do resultado. Corrija
    para que `items` não seja modificado.
14. **`fixSharedDefaultArrayBug(name, tags)`** — o sintoma relatado é que
    usuários criados sem passar `tags` explicitamente começam a "herdar"
    tags adicionadas em chamadas anteriores, mesmo que cada chamada pareça
    independente. Olhe de onde vem o valor padrão de `tags` e o que a
    função faz com ele.

## Refatoração (1)

15. **`refactorDeepUpdateChain(state, newCity)`** — a implementação atual
    funciona (atualiza `state.user.address.city` para `newCity`), mas
    modifica `state` e seus objetos aninhados diretamente (mutação em
    cadeia). Refatore para retornar um **novo** objeto em todos os níveis
    afetados (`state`, `state.user` e `state.user.address` devem ser
    todos novos objetos no resultado), sem modificar o `state` original,
    mantendo o mesmo comportamento observável para quem lê o resultado.

## Desafio integrador (1)

16. **`applyPatchImmutable(state, patch)`** — combina cópia rasa e cópia
    "um nível a mais" (Unidades 6 e 7). Recebe um `state` e um `patch`,
    ambos objetos simples que podem ter propriedades de nível superior
    cujo valor é, ele mesmo, um objeto simples (ex.: `profile`). Retorna
    um **novo** objeto onde:

    - toda propriedade de nível superior presente em `patch` sobrescreve a
      de `state`;
    - se uma propriedade existir em **ambos** e o valor de ambos for um
      objeto simples (não array, não `null`), o resultado faz o merge
      dessa propriedade um nível a mais, em vez de simplesmente substituir
      o objeto inteiro;
    - nem `state` nem `patch` (nem seus objetos aninhados) podem ser
      modificados.

    ```js
    applyPatchImmutable(
      { name: "Ana", profile: { age: 30, city: "SP" }, active: true },
      { profile: { city: "RJ" }, active: false },
    );
    // => {
    //   name: "Ana",
    //   profile: { age: 30, city: "RJ" },
    //   active: false,
    // }
    ```

## Critérios de aceitação

- `npm test` sem falhas.
- Nenhuma função marcada como "sem mutar" no enunciado modifica seus
  argumentos de entrada, em nenhum nível — você consegue provar isso
  comparando o valor original antes e depois da chamada.
- Você consegue explicar, sem consultar o código, a diferença entre cópia
  rasa e cópia profunda, e dar um exemplo de bug real que uma cópia rasa
  não evita.
- Você consegue explicar por que primitivos "passados" para uma função
  nunca mudam para quem chamou, enquanto objetos e arrays podem.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
