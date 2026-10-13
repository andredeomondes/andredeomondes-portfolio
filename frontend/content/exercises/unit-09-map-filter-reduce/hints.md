# Dicas — Unidade 9

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `groupByKey`: o acumulador do `reduce` é um objeto, não um
  número. O que você faz no callback quando a chave ainda não existe no
  acumulador? E quando já existe?
- Para `maxBy`: o acumulador do `reduce` deve guardar o **item**
  vencedor até agora, não só o número. A cada passo, você compara
  `fn(item atual)` com `fn(item acumulado)`.
- Para `uniqueBy`: `filter` roda um callback por item que retorna
  `true`/`false`. Como usar um `Set` para saber, dentro desse callback,
  se a chave já apareceu antes?
- Para `fixReduceInitialValueBug`: o que `reduce` faz internamente
  quando não recebe segundo argumento e o array está vazio?

## Nível 2 — pista mais direta

- `groupByKey`: `items.reduce((acc, item) => { const k = item[key]; if (!acc[k]) acc[k] = []; acc[k].push(item); return acc; }, {})`.
- `maxBy`: `items.reduce((best, item) => (best === undefined || fn(item) > fn(best) ? item : best), undefined)`.
- `sumNested`: `arrayOfArrays.reduce((total, sub) => total + sub.reduce((a, b) => a + b, 0), 0)`.
- `uniqueBy`: crie `const seen = new Set()` fora do `filter`. Dentro,
  `if (seen.has(item[key])) return false; seen.add(item[key]); return true;`.
- `fixFilterThresholdBug`: troque `n >= threshold` por `n > threshold`.
- `fixReduceInitialValueBug`: adicione `, 0` como segundo argumento do
  `reduce`.

## Nível 3 — quase o código, mas ainda não a solução

- `refactorImperativeTotal`:
  ```js
  return orders
    .filter((order) => order.status === "paid")
    .reduce((total, order) => total + order.amount * order.quantity, 0);
  ```
- `summarizeSalesByCategory`:
  ```js
  const byCategory = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + t.amount;
    return acc;
  }, {});
  const grandTotal = transactions.reduce((total, t) => total + t.amount, 0);
  return { byCategory, grandTotal };
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
