# Dicas — Unidade 6

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `pushAndSlice`: como você cria um **novo** array que já contém
  `newItem` no final, sem usar `.push()` no array recebido? Depois de
  montar esse array maior, qual método de array pega só os últimos `n`
  elementos?
- Para `countByKey`: percorra os itens; para cada um, olhe o valor de
  `item[key]` — esse valor vira uma chave do objeto acumulador. O que você
  faz na primeira vez que uma chave aparece, e o que faz nas vezes
  seguintes?
- Para `mergeObjectsShallow`: existe uma sintaxe de espalhamento de objeto
  (`{ ...a, ...b }`) em que a ordem dos operandos decide quem "vence" um
  conflito de chave.
- Para `groupByStatus`: é como `countByKey`, mas em vez de guardar um
  número no acumulador, você guarda um array e empurra o item inteiro
  nele.
- Para `removeDuplicatesByKey`: percorra os itens mantendo um `Set` (ou
  objeto) com as chaves já vistas. O que decide se um item entra no
  resultado?
- Para `addTagBuggy`: o array `tags` do artigo é o **mesmo** array em
  memória que outro objeto também aponta. `.push()` muda esse array no
  lugar. O que aconteceria se, em vez disso, você criasse um array novo
  com spread?

## Nível 2 — pista mais direta

- `buildRangeArray`: `for (let i = start; i <= end; i++) result.push(i)`.
- `pushAndSlice`: `const combined = [...items, newItem]; return combined.slice(-maxLength);`
  (quando `combined.length <= maxLength`, `.slice(-maxLength)` ainda
  devolve o array inteiro).
- `joinNames`: `people.map((p) => p.name).join(", ")`.
- `countByKey`: `items.forEach((item) => { const k = item[key]; acc[k] = (acc[k] ?? 0) + 1; })`
  com `acc` começando como `{}`.
- `mergeObjectsShallow`: `return { ...base, ...overrides };`.
- `groupByStatus`: `orders.forEach((order) => { const s = order.status; if (!acc[s]) acc[s] = []; acc[s].push(order); })`.
- `invertObject`: `Object.entries(obj)` te dá pares `[chave, valor]`; monte
  o objeto invertido a partir deles.
- `removeDuplicatesByKey`: `const seen = new Set(); return items.filter((item) => { if (seen.has(item[key])) return false; seen.add(item[key]); return true; });`
- `buildFrequencyTable`: é `countByKey`, mas cada elemento do array já é a
  própria chave (não `item[key]`).
- `sumPricesBuggy`: a condição do laço usa `i <= products.length`; troque
  por `i < products.length`.
- `addTagBuggy`: `return { ...article, tags: [...article.tags, tag] };`.

## Nível 3 — quase o código, mas ainda não a solução

- `listObjectKeysSorted`: `Object.keys(obj).sort()` — atenção: `.sort()`
  sem comparador ordena como string, o que funciona bem para chaves de
  texto.
- `invertObject`:
  ```js
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[value] = key;
  }
  return result;
  ```
- `refactorActiveUserNames`: a versão final é
  `return users.filter((u) => u.active).map((u) => u.name);` — sem `var`,
  sem laço manual, sem array mutado passo a passo.
- `buildInventoryReport`: combine `.length`, `.reduce()` para o valor
  total (`price * quantity` de cada item) e uma lógica parecida com
  `countByKey` para `byCategory`.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
