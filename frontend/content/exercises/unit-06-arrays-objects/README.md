# Unidade 6 — Arrays e objetos

Fase 1, Unidade 6. Cobre: criação de arrays e objetos, métodos comuns de
array (`.map`, `.filter`, `.find`, `.push`, `.slice`, `.sort` — usados aqui
de forma pontual; a Unidade 9 aprofunda `map`/`filter`/`reduce`), iteração
sobre objetos (`Object.keys`, `Object.values`, `Object.entries`) e
propriedades computadas.

## Antes de começar

Responda por escrito (pode ser neste README, numa cópia local, ou em
`notes/concepts/` se quiser guardar):

1. Qual a diferença entre `.push()` e `.concat()` (ou spread `[...arr, x]`)
   `R = .push() adiciona aquele elemento ao array e . concat faz o merge de dois arrays`
   ao adicionar um item a um array? Uma delas modifica o array original?
   `R = .push()`
2. `Object.keys(obj)`, `Object.values(obj)` e `Object.entries(obj)`
   retornam coisas diferentes. O que cada um devolve para
   `{ a: 1, b: 2 }`?
   `R= Keys - A, Values - 1, Entries A-1 chave valor`
3. Se dois objetos diferentes guardam uma referência para o **mesmo**
   array (ex.: `const b = { tags: a.tags }`), o que acontece com `b.tags`
   se você fizer `a.tags.push("x")`?
   `R = os dois serão modificados`

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Por que isso importa para backend

Praticamente todo payload de API, linha de banco de dados ou mensagem de
fila chega como array ou objeto. Transformar listas sem mutar a original,
agrupar registros por uma chave, remover duplicados e montar objetos de
resposta são operações que você vai escrever dezenas de vezes por semana
em qualquer backend real.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
   ```

   ou, para rodar toda a suíte do repositório:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Use a linha `// test: node --test --test-name-pattern=...` acima de cada
   função para rodar só aquele exercício enquanto trabalha nele.
6. Quando o enunciado disser "sem mutar o array/objeto original", os
   testes verificam isso — retornar um novo array/objeto é obrigatório,
   não só recomendado.

## Exercícios fundamentais (8)

1. **`buildRangeArray(start, end)`** — retorna um array com todos os
   inteiros de `start` até `end`, inclusive.
2. **`pushAndSlice(items, newItem, maxLength)`** — retorna um **novo**
   array com `newItem` adicionado ao final de `items`; se o resultado
   tiver mais de `maxLength` itens, mantenha apenas os `maxLength` mais
   recentes (descarte os mais antigos do início). Não modifique `items`.
3. **`joinNames(people)`** — `people` é um array de objetos `{ name }`.
   Retorna uma string com todos os nomes separados por `", "` (ex.:
   `"Ana, Bruno, Caio"`). Retorna `""` para lista vazia.
4. **`findProductById(products, id)`** — retorna o objeto de `products`
   cujo `id` é igual ao informado, ou `undefined` se não existir.
5. **`countByKey(items, key)`** — retorna um objeto que mapeia cada valor
   distinto de `items[i][key]` para a quantidade de itens que têm aquele
   valor. Ex.: `countByKey([{status:"ok"},{status:"fail"},{status:"ok"}], "status")`
   `=> { ok: 2, fail: 1 }`.
6. **`buildUserObject(id, name, email)`** — retorna um objeto
   `{ id, name, email }` usando a sintaxe abreviada de propriedades (não
   escreva `{ id: id, name: name, email: email }`).
7. **`listObjectKeysSorted(obj)`** — retorna um array com as chaves de
   `obj`, ordenadas alfabeticamente.
8. **`mergeObjectsShallow(base, overrides)`** — retorna um **novo** objeto
   com todas as propriedades de `base`, sobrescritas pelas propriedades
   presentes em `overrides` quando houver conflito de chave. Não modifique
   `base` nem `overrides`.

## Exercícios intermediários (4)

9. **`groupByStatus(orders)`** — `orders` é um array de objetos
   `{ status, ... }`. Retorna um objeto onde cada chave é um valor de
   `status` encontrado, e o valor é um array com **todos os pedidos
   completos** (o objeto inteiro, não só o status) que têm aquele status,
   na ordem original.
10. **`invertObject(obj)`** — retorna um novo objeto onde cada chave
    original vira valor, e cada valor original (convertido para string)
    vira chave. Ex.: `invertObject({ a: 1, b: 2 })` `=> { 1: "a", 2: "b" }`.
    Assuma que os valores de `obj` são únicos.
11. **`removeDuplicatesByKey(items, key)`** — retorna um novo array
    mantendo apenas a **primeira** ocorrência de cada valor distinto de
    `items[i][key]`, na ordem original, sem alterar `items`.
12. **`buildFrequencyTable(words)`** — recebe um array de strings e
    retorna um objeto que mapeia cada string distinta para a quantidade de
    vezes que ela aparece no array. Ex.:
    `buildFrequencyTable(["a", "b", "a", "c", "b", "a"])`
    `=> { a: 3, b: 2, c: 1 }`. Retorna `{}` para array vazio.

## Debugging (2)

13. **`sumPricesBuggy(products)`** — o sintoma relatado é que o total
    somado vem sempre maior que a soma real dos preços, e às vezes o
    programa lança `TypeError: Cannot read properties of undefined`.
    Repare na condição do laço: ela usa `<=` para comparar com
    `products.length`. O que acontece na última iteração?
14. **`addTagBuggy(article, tag)`** — o sintoma relatado é que, depois de
    "adicionar uma tag" a um artigo específico, artigos **diferentes**
    (que nunca foram tocados diretamente) também aparecem com a nova tag.
    Isso acontece quando dois objetos compartilham a **mesma referência**
    de array em `tags`. A função atual usa `.push()`, que modifica o
    array original _in place_. Reescreva para retornar um novo objeto com
    um novo array `tags` (sem alterar o array original), evitando que
    outros objetos que apontam para o mesmo array sejam afetados.

## Refatoração (1)

15. **`refactorActiveUserNames(users)`** — a implementação atual funciona
    (retorna os nomes dos usuários ativos), mas usa `var`, um laço manual
    e um array mutado passo a passo. Refatore usando `.filter()` e
    `.map()` encadeados, mantendo o mesmo comportamento observável.

## Desafio integrador (1)

16. **`buildInventoryReport(products)`** — combina objetos, arrays e
    funções auxiliares (Unidades 3 e 6). `products` é um array de objetos
    `{ name, category, price, quantity }`. Retorna:

    ```js
    {
      totalProducts: number,       // quantidade de produtos na lista
      totalValue: number,          // soma de (price * quantity) de todos
      byCategory: {                // quantidade de produtos por categoria
        [category]: number,
      },
    }
    ```

    ```js
    buildInventoryReport([
      { name: "Teclado", category: "periféricos", price: 100, quantity: 2 },
      { name: "Mouse", category: "periféricos", price: 50, quantity: 3 },
      { name: "Monitor", category: "telas", price: 800, quantity: 1 },
    ]);
    // => {
    //   totalProducts: 3,
    //   totalValue: 100*2 + 50*3 + 800*1, // 1150
    //   byCategory: { "periféricos": 2, "telas": 1 },
    // }
    ```

## Critérios de aceitação

- `npm test` sem falhas.
- Nenhuma função marcada como "sem mutar" no enunciado modifica seus
  argumentos de entrada — você consegue provar isso comparando o array ou
  objeto original antes e depois da chamada.
- Você consegue explicar, sem consultar o código, por que dois objetos que
  compartilham a mesma referência de array podem "vazar" mudanças um para
  o outro.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
