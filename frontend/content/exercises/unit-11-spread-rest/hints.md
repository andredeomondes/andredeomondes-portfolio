# Dicas — Unidade 11

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `mergeObjectsWithOverride`: em `{...a, ...b}`, o que "vence"
  quando as duas fontes têm a mesma chave — a primeira ou a última que
  aparece na expressão?
- Para `removeKey`: destructuring com rest permite "capturar" uma
  propriedade específica em uma variável e todo o resto em outra. Como
  você usaria uma chave **computada** (uma variável, não um nome fixo)
  como nome da propriedade a capturar?
- Para `combineArraysUnique`: depois de juntar tudo em um único array
  (spread dentro de um laço, ou `arrays.flat()`), qual estrutura de
  dados remove duplicados automaticamente mantendo a ordem?
- Para `fixSpreadMutationBug`: `.push()` retorna o novo tamanho do
  array e modifica o array original. Qual operador cria um array novo
  com os elementos antigos mais um novo, sem tocar no original?

## Nível 2 — pista mais direta

- `cloneArray`/`cloneObject`: `[...arr]` e `{...obj}`.
- `sumAllArgs`: `numbers.reduce((a, b) => a + b, 0)` — lembrando que
  `numbers` já é um array de verdade dentro da função (o rest parameter
  cria um array, diferente do antigo `arguments`).
- `removeKey(obj, keyToRemove)`:
  `const { [keyToRemove]: removed, ...rest } = obj; return rest;`
  — colchetes ao redor de `keyToRemove` fazem a chave computada.
- `fixSpreadMutationBug`: troque `cart.push(newItem); return cart;` por
  `return [...cart, newItem];`.
- `fixRestParamsOrderBug`: o `label` já está fora de `values` (porque é
  um parâmetro nomeado antes do rest). Não é preciso recriar `all` —
  use `values.join(", ")` diretamente.

## Nível 3 — quase o código, mas ainda não a solução

- `combineArraysUnique`:
  ```js
  const combined = [];
  for (const arr of arrays) {
    combined.push(...arr);
  }
  return [...new Set(combined)];
  ```
- `shallowMergeConfig`: `return { ...base, ...patch };` — depois rode o
  teste e observe no resultado que `server` virou só
  `{ port: 8080 }`, perdendo `host`, porque o objeto aninhado inteiro
  foi substituído.
- `buildUpdatedOrder`:
  ```js
  const items = [...order.items, ...extraItems];
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { ...order, ...updates, items, total };
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
