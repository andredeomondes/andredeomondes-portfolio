# Dicas — Unidade 3

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `makeAdder`: uma função pode ter `return` de outra função? O que
  `makeAdder(5)` sozinho (sem chamar de novo) deveria retornar?
- Para `composeTwo`: se `h = composeTwo(f, g)`, o que `h(x)` deveria
  calcular primeiro, `f` ou `g`?
- Para `curriedAdd`: quantos `return` de função você precisa encadear para
  chegar a três parâmetros, um de cada vez?
- Para `formatPrice`: como você mapeia um código de moeda para um símbolo
  sem usar `if/else` para cada caso? Pense em um objeto literal.
- Para `averageOrZero`: o que é `0 / 0` em JavaScript? Isso é igual a `0`?
- Para `makeMultiplier`: uma arrow function `(n) => { ... }` com chaves se
  comporta como o corpo de uma função normal. O que falta para ela devolver
  um valor?
- Para `refactorOrderTotal`: os três `if` que atribuem default podem virar
  parte da assinatura da função?

## Nível 2 — pista mais direta

- `makeAdder`: `function makeAdder(x) { return function (n) { return x + n; }; }`
  — ou a versão arrow equivalente.
- `composeTwo`: `g` é aplicado primeiro (é o argumento mais "interno"),
  depois `f` recebe o resultado de `g`.
- `curriedAdd`: `(a) => (b) => (c) => a + b + c`.
- `formatPrice`: `const symbols = { BRL: "R$", USD: "$", EUR: "€" }`; se
  `symbols[currency]` for `undefined`, use `currency` mesmo como prefixo.
- `averageOrZero`: `0 / 0` é `NaN`, não `0`. Você precisa de uma checagem
  explícita para lista vazia antes de dividir.
- `makeMultiplier`: troque `{ n * factor }` por `{ return n * factor; }`,
  ou remova as chaves e use retorno implícito: `(n) => n * factor`.
- `refactorOrderTotal`: `function refactorOrderTotal({ price = 0, quantity = 1, discount = 0 })`
  já substitui os três `if`.

## Nível 3 — quase o código, mas ainda não a solução

- `buildOrderProcessor`: dentro da função retornada, percorra `orders` com
  `for...of`, use `if (status === "cancelled") continue;` para pular, some
  `amount * (1 + taxRate)` ao total para os demais e incremente um
  contador. Retorne `{ totalWithTax, processedCount }` ao final do laço.
- `invokeNTimes`: `const results = []; for (let i = 0; i < n; i++) { results.push(fn(i)); } return results;`
- `applyDiscount`: valide primeiro (`if (discountPercent < 0 || discountPercent > 100) throw new RangeError(...)`),
  depois retorne `price * (1 - discountPercent / 100)`.
- `describePerson`: lembre que o parâmetro inteiro também precisa de um
  default (`= {}`) para `describePerson()` sem argumentos não quebrar antes
  mesmo de desestruturar.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
