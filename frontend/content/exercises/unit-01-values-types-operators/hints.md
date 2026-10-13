# Dicas — Unidade 1

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `classifyValue`: `typeof` cobre quase tudo, mas tem duas exceções
  famosas. Quais valores fazem `typeof` "mentir"?
- Para `isTruthyManually`: liste os 7 valores falsy do JavaScript antes
  de escrever qualquer `if`.
- Para `coerceToNumberManually`: pense em como `Number("")`,
  `Number([])` e `Number([1,2])` se comportam antes de tentar
  reimplementar — rode isso no console primeiro (sem usar no código).
- Para `fixEqualityBug`: escreva à mão a tabela de coerção de `==` para
  `0`, `""`, `false`, `null`, `undefined`. Onde `""` se encontra com `0`?
- Para `fixCoercionBug`: o que `0 + "10"` retorna? E `"0" + 5`?
- Para `refactorDiscountTier`: qual estrutura de controle do JavaScript
  substitui uma cadeia de `if/else if` por faixas de valor de forma mais
  plana?

## Nível 2 — pista mais direta

- `classifyValue`: `typeof null === "object"` e `typeof NaN === "number"`.
  Trate esses dois casos antes do `typeof` genérico.
- `coerceToNumberManually`: arrays vazios coagem para `0`; arrays de um
  elemento coagem para o valor coagido daquele elemento; arrays com mais
  de um elemento coagem para `NaN`.
- `fixEqualityBug`: comparar `String(u.id) === String(id)` resolve o
  caso de tipos diferentes sem reintroduzir a coerção perigosa de `==`.
- `fixCoercionBug`: converta `item.price` para número antes de somar —
  mas decida onde é mais seguro fazer essa conversão.
- `refactorDiscountTier`: um array de faixas `[{ min, rate }]` percorrido
  com `find` ou `some` elimina o aninhamento.

## Nível 3 — quase o código, mas ainda não a solução

- `classifyValue`: comece com
  ```js
  if (value === null) return "null";
  if (Number.isNaN(value)) return "nan";
  ```
  e complete o restante com `typeof` e `Array.isArray`.
- `coerceToNumberManually`: trate `Array.isArray(value)` primeiro,
  depois `typeof value === "boolean"`, depois `value === null` /
  `value === undefined`, e só então strings.
- `fixEqualityBug`: a correção é uma troca de uma linha —
  `u.id == id` vira uma comparação baseada em `String(...)`.
- `fixCoercionBug`: `total += Number(item.price)` resolve, mas pense se
  faz sentido validar `Number.isNaN` antes de somar.
- `refactorDiscountTier`: as faixas em ordem decrescente, retornando a
  primeira cujo `amount >= min`, reproduzem exatamente o comportamento
  atual.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
