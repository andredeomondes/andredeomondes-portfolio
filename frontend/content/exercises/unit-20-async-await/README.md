# Unidade 20 — async/await

Fase 1, Unidade 20. Cobre: sintaxe `async function`/`await`,
`try/catch` combinado com `await`, e a conversão de código baseado em
`.then`/`.catch` para `async/await`.

`async/await` não é um jeito novo de fazer assincronia — é **açúcar
sintático sobre Promises**. Toda `async function` retorna uma Promise, e
`await` "pausa" a função até a Promise ser resolvida ou rejeitada. Depois
desta unidade, você deveria conseguir ler qualquer um dos dois estilos
(`.then` ou `await`) e converter de um para o outro sem esforço.

## Antes de começar

Responda por escrito:

1. Uma `async function` sempre retorna o quê, mesmo se o corpo dela tiver
   só `return 42;`?
2. Se você chama uma `async function` mas **não** usa `await` na chamada,
   o que você recebe de volta?
3. Por que `await` fora de um bloco `try` não é capturado por um `catch`
   logo depois?

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`
   dentro de uma `async function` — isso já produz uma Promise rejeitada,
   sem precisar escrever `return Promise.reject(...)` manualmente.
2. Implemente uma função por vez, usando `async/await`. Evite misturar
   `.then` com `await` na mesma função (exceto onde o enunciado permitir
   explicitamente, como em `asyncTimeout`).
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Regra de ouro: se uma chamada pode rejeitar e você precisa tratar o
   erro *dentro* da função, o `await` dessa chamada **precisa** estar
   dentro do `try`. `await` fora do `try` deixa o erro escapar direto
   para quem chamou a função — é exatamente o bug do exercício 14.

## Exercícios fundamentais (8)

1. **`delayAsync(ms, value)`** — `await` uma `Promise` criada com
   `setTimeout`, depois retorne `value`.
2. **`safeDivideAsync(a, b)`** — se `b === 0`, `throw new Error("divisão por zero")`;
   senão, retorne `a / b`.
3. **`fetchUserByIdAsync(id, users)`** — retorna o usuário encontrado em
   `users`, ou lança erro se `id` não existir.
4. **`sumAsyncValues(promises)`** — recebe um array de Promises; some os
   valores resolvidos percorrendo com `for...of` e `await` (sem usar
   `Promise.all`, que é o assunto da Unidade 21).
5. **`tryCatchDivide(a, b)`** — usa `try/catch` em volta de
   `await safeDivideAsync(a, b)`; retorna `{ ok: true, value }` em
   sucesso, ou `{ ok: false, error: err.message }` em falha.
6. **`convertThenChainToAsync(promise)`** — mesma lógica do exercício 5 da
   Unidade 19 (dobrar e elevar ao quadrado), mas reescrita com
   `await` em vez de `.then` encadeado.
7. **`fetchWithRetryAsync(taskFn, attempts)`** — `taskFn()` é uma
   `async function`. Tente chamá-la; se lançar erro, tente de novo, até
   `attempts` vezes no total, usando um laço com `try/catch`. Se a
   última tentativa falhar, propague o erro dela.
8. **`sequentialAsyncMap(items, asyncFn)`** — percorra `items` com
   `for...of`, chamando `await asyncFn(item)` **em série** (não dispare
   todas de uma vez), acumulando os resultados num array na mesma ordem.

## Exercícios intermediários (4)

9. **`asyncPipeline(userId, fetchUserAsyncFn, fetchOrdersAsyncFn)`** —
   `await` o usuário, depois `await` os pedidos dele, retornando
   `{ user, orders }`.
10. **`asyncTimeout(promise, ms)`** — dentro de uma `async function`, use
    `await Promise.race([promise, umaPromiseDeTimeout])` para rejeitar
    com `Error("timeout")` se `promise` não resolver em `ms`
    milissegundos. (`Promise.race` é formalmente o assunto da Unidade 21
    — usá-lo aqui é uma prévia intencional.)
11. **`asyncReduceTotal(items, asyncFn)`** — some um total percorrendo
    `items` com um laço e `await asyncFn(item)`, sem usar
    `Array.prototype.reduce` (o objetivo é praticar o laço com `await`
    dentro).
12. **`safeAsyncWrapper(asyncFn)`** — **não é** uma `async function**;
    é uma função normal que **retorna** uma nova `async function`. Essa
    nova função, ao ser chamada, executa `asyncFn(...args)` dentro de um
    `try/catch` e retorna `{ ok: true, value }` ou
    `{ ok: false, error: err.message }` — generalizando o padrão do
    exercício 5 para qualquer função assíncrona.

## Debugging (2)

13. **`fixMissingAwaitBug(id, users)`** — a função chama
    `fetchUserByIdAsync(id, users)` mas não usa `await`, então
    `result.user` fica sendo uma Promise pendente em vez do usuário já
    resolvido. Corrija adicionando o `await` que falta.
14. **`fixTryCatchScopeBug(a, b)`** — `safeDivideAsync(a, b)` é chamada
    dentro do `try`, mas sem `await` — como ela é assíncrona, a rejeição
    só acontece depois, quando `result` é finalmente `await`ado **fora**
    do `try`. Corrija movendo o `await` para dentro do bloco `try`.

## Refatoração (1)

15. **`refactorPromiseChainToAsync(userId, api)`** — a implementação
    atual usa `.then`/`.catch` encadeados e já funciona corretamente.
    Reescreva usando `async/await` com `try/catch`, mantendo o mesmo
    comportamento observável (inclusive o formato do retorno em caso de
    erro, `{ error: mensagem }`). Dica: essa função deixa de precisar
    retornar uma Promise manualmente — ao virar `async function`, o
    `return` já cuida disso.

## Desafio integrador (1)

16. **`processOrdersAsync(orders, validateAsyncFn, saveAsyncFn)`** —
    `orders` é uma lista de `{ id, amount }`. `validateAsyncFn(order)` e
    `saveAsyncFn(order)` são `async function`s. Processe os pedidos em
    série com `for...of` e `await`: pedidos que não passam em
    `validateAsyncFn` vão para `invalid` (pelo `id`); os demais são
    salvos com `saveAsyncFn` e acumulados. Retorne:

    ```js
    {
      saved: [...],
      invalid: [...],
      totalRevenue: number, // soma de amount dos pedidos salvos
    }
    ```

    Se `saveAsyncFn` lançar erro em qualquer ponto, deixe o erro
    propagar (não capture — quem chama `processOrdersAsync` decide o que
    fazer com ele).

## Critérios de aceitação

- `npm test` sem falhas.
- Todo `await` que precisa ser tratado com `try/catch` está **dentro**
  do bloco `try`.
- Nenhuma função "esquece" o `await` em uma chamada cujo resultado é
  usado em seguida.
- Você consegue explicar, sem consultar o código, por que
  `async function f() { return 42; }` e
  `function f() { return Promise.resolve(42); }` são equivalentes para
  quem chama `f()`.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
