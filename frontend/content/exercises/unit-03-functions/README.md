# Unidade 3 — Funções

Fase 1, Unidade 3. Cobre: declaração de função, expressão de função, arrow
functions, parâmetros default, `rest`/`arguments`, retorno implícito vs.
explícito e funções como valores (recebidas e retornadas por outras
funções).

## Antes de começar

Responda por escrito (pode ser neste README, numa cópia local, ou em
`notes/concepts/` se quiser guardar):

1. Qual a diferença prática entre `function soma() {}` (declaração) e
   `const soma = function () {}` (expressão)? Uma delas sofre hoisting
   completo e a outra não — qual?
2. Uma arrow function `(n) => { n * 2 }` retorna o quê? E
   `(n) => n * 2`? Por que o resultado é diferente?
3. Se uma função tem um parâmetro com valor default, esse default é
   avaliado quando a função é **definida** ou quando ela é **chamada**?

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Por que isso importa para backend

Backends são, em essência, funções que recebem uma entrada (uma requisição,
uma linha de fila, uma mensagem) e produzem uma saída. Entender com
precisão quando um parâmetro default é avaliado, o que uma arrow function
com corpo em bloco retorna sem `return` explícito, e como uma função pode
receber e devolver outras funções é a base de middlewares, validadores,
fábricas de handlers e qualquer camada de composição que você vai construir
nas próximas fases.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-03-functions/exercises.test.js
   ```

   ou, para rodar toda a suíte do repositório:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Use a linha `// test: node --test --test-name-pattern=...` acima de cada
   função para rodar só aquele exercício enquanto trabalha nele.

## Exercícios fundamentais (8)

1. **`sum(a, b)`** — função declarada (`function sum`). Retorna `a + b`. Se
   `b` não for passado, use `0` como default.
2. **`greet(name)`** — retorna `"Olá, <name>!"`. Se `name` não for passado,
   use `"visitante"` como valor default do parâmetro.
3. **`multiplyAll(...numbers)`** — arrow function (já declarada como
   `const`) que recebe qualquer quantidade de números via `rest` e retorna
   o produto de todos. Retorna `1` se nenhum argumento for passado.
4. **`isEven(n)`** — arrow function de uma linha (retorno implícito) que
   retorna `true`/`false` conforme `n` seja par.
5. **`makeAdder(x)`** — retorna uma **função** que soma `x` a qualquer
   número recebido. Ou seja, `makeAdder(5)(3)` deve retornar `8`.
6. **`describePerson({ name, age, city })`** — recebe um objeto
   desestruturado no próprio parâmetro. Retorna uma string no formato
   `"<name>, <age> anos, mora em <city>"`. Se `city` não vier no objeto,
   use `"cidade não informada"` (já está no default do parâmetro — não
   remova). Se o objeto inteiro não for passado, `describePerson()` sem
   argumentos não deve lançar erro (o parâmetro já tem `= {}` como
   fallback).
7. **`applyDiscount(price, discountPercent)`** — retorna `price` com o
   desconto aplicado. `discountPercent` é default `0` e representa uma
   porcentagem (`10` = 10%). Lança `RangeError` se `discountPercent` estiver
   fora de `[0, 100]`.
8. **`firstArgumentType(...args)`** — retorna o resultado de `typeof` do
   primeiro argumento recebido, ou a string `"none"` se a função for
   chamada sem argumentos.

## Exercícios intermediários (4)

9. **`composeTwo(f, g)`** — retorna uma nova função `h` tal que
   `h(x) === f(g(x))`. Ou seja, compõe duas funções de um argumento.
10. **`invokeNTimes(fn, n)`** — chama `fn(i)` para `i` de `0` até `n - 1`
    (inclusive o `0`, exclusive o `n`) e retorna um array com os `n`
    resultados, na ordem.
11. **`curriedAdd(a)`** — retorna uma função que recebe `b` e retorna outra
    função que recebe `c`, de forma que `curriedAdd(1)(2)(3)` seja `6`.
    Isso é chamado de **currying**: transformar uma função de vários
    argumentos em uma cadeia de funções de um argumento cada.
12. **`formatPrice(amount, currency)`** — retorna uma string como
    `"R$ 10.50"` para `formatPrice(10.5)` (default `currency = "BRL"`) ou
    `"$ 10.50"` para `formatPrice(10.5, "USD")`. Use um objeto de símbolos
    `{ BRL: "R$", USD: "$", EUR: "€" }`; se a moeda não estiver no mapa, use
    o próprio código da moeda seguido de espaço (ex.: `"JPY 500.00"`). Lança
    `RangeError` se `amount` for negativo. Use `.toFixed(2)` para as duas
    casas decimais.

## Debugging (2)

13. **`averageOrZero(numbers)`** — o sintoma relatado é que
    `averageOrZero()` ou `averageOrZero([])` deveriam retornar `0`, mas
    retornam `NaN`. O parâmetro já tem `= []` como default — o bug está em
    outro lugar da função. Rode a função mentalmente com uma lista vazia
    para achar a divisão problemática.
14. **`makeMultiplier(factor)`** — o sintoma relatado é que a função
    retornada por `makeMultiplier` sempre devolve `undefined`, em vez do
    produto esperado. Olhe com atenção para o corpo da arrow function
    interna: ela usa chaves `{ }`. O que chaves em uma arrow function
    exigem para que ela retorne algo?

## Refatoração (1)

15. **`refactorOrderTotal(order)`** — a implementação atual funciona (soma
    `price * quantity` com desconto, zera se negativo), mas usa `var` e
    quatro blocos `if` só para aplicar valores default. Refatore para usar
    **desestruturação do parâmetro com valores default**
    (`{ price = 0, quantity = 1, discount = 0 }`), mantendo exatamente o
    mesmo comportamento observável (incluindo o `total` nunca ser
    negativo).

## Desafio integrador (1)

16. **`buildOrderProcessor(taxRate)`** — combina "funções que retornam
    funções" (desta unidade) com laços e `switch`/`if` (Unidade 2).
    `taxRate` é default `0` (ex.: `0.1` = 10% de imposto). Retorna uma
    função `processOrders(orders)` que:

    - recebe uma lista de pedidos `{ status, amount }`, onde `status` é
      `"pending"`, `"paid"` ou `"cancelled"`;
    - ignora completamente pedidos `"cancelled"` (não contam em nada);
    - para pedidos `"pending"` e `"paid"`, aplica `taxRate` sobre `amount`
      (ex.: `amount = 100` e `taxRate = 0.1` vira `110`) e soma ao total;
    - retorna `{ totalWithTax, processedCount }`, onde `processedCount` é
      a quantidade de pedidos não cancelados.

    ```js
    const processOrders = buildOrderProcessor(0.1);
    processOrders([
      { status: "paid", amount: 100 },
      { status: "cancelled", amount: 50 },
      { status: "pending", amount: 20 },
    ]);
    // => { totalWithTax: 132, processedCount: 2 }
    ```

## Critérios de aceitação

- `npm test` sem falhas.
- Você consegue explicar, sem consultar o código, por que uma arrow
  function com corpo em bloco (`{ }`) precisa de `return` explícito, e por
  que uma função retornando outra função é diferente de simplesmente
  chamar duas funções em sequência.
- Você consegue explicar o que é currying com suas próprias palavras.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
