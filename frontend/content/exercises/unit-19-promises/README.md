# Unidade 19 — Promises

Fase 1, Unidade 19. Cobre: criação de Promises (`new Promise`), `.then`,
`.catch`, `.finally`, encadeamento (chaining), `Promise.resolve` e
`Promise.reject`, e a conversão de callbacks em Promises.

Promises resolvem o principal problema da Unidade 18: a pirâmide de
callbacks aninhados. Elas dão a você um objeto que representa "um valor
que ainda não existe, mas vai existir (ou vai falhar)", e permitem
encadear passos com `.then` em vez de aninhar.

## Antes de começar

Responda por escrito:

1. Uma Promise tem três estados possíveis. Quais são, e uma vez que ela
   sai do estado inicial, ela pode voltar?
2. O que acontece se você **esquecer** de dar `return` dentro de um
   `.then(callback)` que contém outra Promise?
3. Qual a diferença entre `.catch(fn)` e o segundo argumento de `.then(onFulfilled, onRejected)`?

## Como trabalhar

1. Abra `exercises.js`. Cada função tem
   `return Promise.reject(new Error("not implemented: <nome>"))`.
2. Implemente uma função por vez. Toda função aqui **retorna uma Promise**
   — não usa `callback` nem `async/await` (isso é o assunto da próxima
   unidade; aqui o objetivo é dominar `.then`/`.catch`/`.finally` puros).
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Regra de ouro do encadeamento: **todo `.then` que precisa esperar outra
   Promise deve dar `return` dela**. Esquecer o `return` é o bug mais
   comum com Promises — e é exatamente o bug do exercício 13.

## Exercícios fundamentais (8)

1. **`delayPromise(ms, value)`** — retorna uma nova `Promise` que resolve
   com `value` depois de `ms` milissegundos (`setTimeout` dentro do
   executor da Promise).
2. **`safeDividePromise(a, b)`** — retorna uma Promise que rejeita com
   `Error("divisão por zero")` se `b === 0`, ou resolve com `a / b`.
3. **`fetchUserByIdPromise(id, users)`** — retorna uma Promise que resolve
   com o usuário encontrado em `users` ou rejeita se `id` não existir.
4. **`resolveOrDefault(promiseOrValue, defaultValue)`** — use
   `Promise.resolve(promiseOrValue)` para normalizar tanto um valor puro
   quanto uma Promise, e `.catch` para devolver `defaultValue` caso
   rejeite.
5. **`chainDoubleThenSquare(promise)`** — recebe uma Promise que resolve
   com um número; encadeie `.then` para dobrar o valor e depois elevá-lo
   ao quadrado, retornando a Promise resultante.
6. **`tapPromise(promise, sideEffectFn)`** — encadeia um `.then` que chama
   `sideEffectFn(value)` (por exemplo, para logging) **sem alterar** o
   valor que segue adiante na cadeia.
7. **`finallyCleanup(promise, cleanupFn)`** — usa `.finally(cleanupFn)`
   para garantir que `cleanupFn` rode tanto em sucesso quanto em falha,
   preservando o resultado (ou erro) original da `promise`.
8. **`promiseFromCallback(fn, ...args)`** — recebe uma função no estilo
   error-first callback (`fn(...args, callback)`) e retorna uma Promise
   equivalente, usando `new Promise((resolve, reject) => ...)`. Essa é a
   ponte entre a Unidade 18 e esta unidade.

## Exercícios intermediários (4)

9. **`chainUserThenOrders(fetchUserPromiseFn, fetchOrdersPromiseFn, userId)`**
   — encadeia duas funções que retornam Promise: primeiro busca o
   usuário, depois (usando o `id` dele) busca os pedidos, retornando
   `{ user, orders }`.
10. **`retryPromise(taskFn, attempts)`** — `taskFn()` retorna uma Promise.
    Se rejeitar, tente de novo, até `attempts` vezes no total. Se a última
    tentativa falhar, a Promise retornada rejeita com o erro dela.
11. **`timeoutPromise(promise, ms)`** — retorna uma nova Promise que
    resolve/rejeita como `promise`, a menos que `ms` milissegundos se
    passem antes — nesse caso, rejeita com `Error("timeout")`. (Você pode
    implementar isso manualmente com `new Promise` + `setTimeout`; a
    forma "oficial" com `Promise.race` é o assunto da Unidade 21.)
12. **`sequentialReduce(items, asyncFn)`** — `asyncFn(item)` retorna uma
    Promise. Processe os itens de `items` **em série** (um só começa
    depois que o anterior resolveu), acumulando os resultados num array
    na mesma ordem. Dica: `Array.prototype.reduce` com um acumulador que
    é uma Promise.

## Debugging (2)

13. **`fixMissingReturnInChain(userId, api)`** — dentro do `.then` externo,
    a chamada a `api.fetchOrders(...).then(...)` não tem `return`. Isso
    faz a Promise externa resolver antes da interna terminar, com o valor
    errado. Corrija adicionando o `return` que falta.
14. **`fixUnhandledRejectionSwallow(promise)`** — a função captura o erro
    com `.catch`, só loga e não relança nem retorna nada útil — quem
    chama não sabe que algo falhou. Corrija para que o erro continue
    sendo propagado (ainda pode logar, mas precisa relançar).

## Refatoração (1)

15. **`refactorPromiseHell(userId, api)`** — a implementação atual
    funciona, mas aninha três `.then` em cascata (a versão "Promise" da
    pirâmide da perdição). Refatore para uma cadeia plana de `.then`,
    mantendo o mesmo comportamento observável (inclusive a propagação de
    rejeição de qualquer etapa).

## Desafio integrador (1)

16. **`processOrdersPromise(orders, validateFn, savePromiseFn)`** —
    `orders` é uma lista de `{ id, amount }`. `validateFn(order)` é
    **síncrona** e retorna um `boolean` (reaproveite o que você aprendeu
    sobre funções de alta ordem nas unidades 9/10). `savePromiseFn(order)`
    retorna uma Promise que resolve com o pedido salvo. Processe os
    pedidos em série (reaproveite a ideia de `sequentialReduce`): pedidos
    que não passam em `validateFn` vão para `invalid` (pelo `id`) e não
    são salvos; os demais são salvos com `savePromiseFn`. Retorne uma
    Promise que resolve com:

    ```js
    {
      saved: [...],
      invalid: [...],
      totalRevenue: number, // soma de amount dos pedidos salvos
    }
    ```

    Se `savePromiseFn` rejeitar em qualquer ponto, a Promise retornada
    deve rejeitar com o mesmo erro.

## Critérios de aceitação

- `npm test` sem falhas.
- Nenhum `.then` que contém uma Promise interna esquece o `return`.
- Nenhum `.catch` "engole" um erro sem relançar ou tratar de forma
  explícita e documentada.
- Você consegue explicar, sem consultar o código, por que
  `Promise.resolve(valorQueJaEUmaPromise)` não cria "Promise de Promise".

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
