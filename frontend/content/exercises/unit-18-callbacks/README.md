# Unidade 18 — Callbacks

Fase 1, Unidade 18. Cobre: código assíncrono no estilo callback, a
convenção "error-first callback" do Node.js (`callback(err, result)`),
composição de callbacks em série e em paralelo, e o problema conhecido como
"callback hell" (pirâmide da perdição).

Esta é a primeira das cinco unidades sobre assincronia. Ela existe mesmo
depois de promises e `async/await` existirem porque **você vai encontrar
APIs no estilo callback em produção** (streams do Node, alguns SDKs mais
antigos, `fs` sem `/promises`, event emitters) e precisa reconhecer o
padrão, seus riscos e como envolvê-lo (`util.promisify`) quando fizer
sentido.

## Antes de começar

Responda por escrito:

1. O que significa "error-first callback"? Por que o erro vem como
   primeiro parâmetro, e não o resultado?
2. O que pode dar errado se uma função chamar seu `callback` duas vezes?
3. Por que código com callbacks aninhados profundamente (a "pirâmide da
   perdição") é difícil de ler e de tratar erros corretamente?

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez, seguindo sempre a convenção
   `callback(err, result)`: em caso de erro, chame `callback(error)` (sem
   segundo argumento) e **retorne imediatamente** (`return callback(...)`)
   para não continuar executando nem chamar `callback` de novo.
3. Rode os testes:

   ```bash
   npm test
   ```

   Ou rode um exercício isolado, usando o comentário `// test: ...` que
   fica acima de cada função como referência de comando.

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Os testes usam `util.promisify` do Node para transformar as suas
   funções baseadas em callback em promises e poder usar `await` nos
   testes — isso não muda o que você precisa implementar (ainda é
   callback-style), é só uma forma prática de testar. `util.promisify`
   exige que o último parâmetro da função seja `callback(err, result)`,
   exatamente a convenção usada aqui.

## Exercícios fundamentais (8)

1. **`delayCallback(ms, value, callback)`** — depois de `ms`
   milissegundos (`setTimeout`), chama `callback(null, value)`.
2. **`safeDivideCallback(a, b, callback)`** — assíncrono (`setTimeout`).
   Se `b === 0`, chama `callback(new Error("divisão por zero"))`; senão,
   `callback(null, a / b)`.
3. **`fetchUserByIdCallback(id, users, callback)`** — assíncrono. Procura
   `id` no array `users` ({ id, name }). Se achar, `callback(null, user)`;
   se não, `callback(new Error(...))`.
4. **`validatePositiveCallback(n, callback)`** — se `n > 0`,
   `callback(null, n)`; senão, `callback(new Error(...))`.
5. **`mapSeriesCallback(items, asyncFn, callback)`** — aplica
   `asyncFn(item, cb)` a cada item de `items`, **um de cada vez** (em
   série, não em paralelo), acumulando os resultados na mesma ordem. Se
   qualquer chamada retornar erro, pare imediatamente e chame
   `callback(err)`.
6. **`parallelCallback(tasks, callback)`** — `tasks` é um array de funções
   `task(cb)`. Dispare todas ao mesmo tempo; quando todas terminarem,
   chame `callback(null, results)` com os resultados **na mesma ordem**
   de `tasks` (não na ordem em que terminaram). Se qualquer uma falhar,
   chame `callback(err)` com o primeiro erro encontrado.
7. **`waterfallCallback(tasks, callback)`** — `tasks` é um array de
   funções. A primeira é `task(cb)`; cada uma das seguintes é
   `task(previousResult, cb)` — recebe o resultado da anterior. No final,
   `callback(null, resultadoFinal)`.
8. **`retryCallback(taskFn, attempts, callback)`** — chama
   `taskFn(cb)`; se falhar, tenta de novo, até `attempts` tentativas no
   total. Se a última tentativa falhar, `callback(err)` com o erro da
   última tentativa. Se alguma tentativa tiver sucesso, `callback(null, resultado)`.

## Exercícios intermediários (4)

9. **`timeoutCallback(taskFn, ms, callback)`** — chama `taskFn(cb)`; se
   `cb` não for chamado dentro de `ms` milissegundos, chame
   `callback(new Error("timeout"))`. Se `taskFn` terminar depois do
   timeout já ter disparado, ignore (não chame `callback` de novo).
10. **`cacheCallback(fn)`** — `fn` é `fn(key, cb)`. Retorna uma nova
    função `(key, cb)` que, na primeira vez que vê uma `key`, chama `fn`
    normalmente e guarda o resultado; nas próximas vezes com a mesma
    `key`, chama `cb(null, valorEmCache)` **sem** chamar `fn` de novo.
11. **`seriesUntilCallback(items, predicateAsyncFn, callback)`** —
    `predicateAsyncFn(item, cb)` chama `cb(err, boolean)`. Percorra
    `items` em série; assim que um item satisfizer o predicado
    (`true`), pare e chame `callback(null, item)`. Se nenhum satisfizer,
    `callback(null, null)`.
12. **`composeUserOrdersCallback(fetchUserCb, fetchOrdersCb, userId, callback)`**
    — chama `fetchUserCb(userId, cb)` para obter o usuário, depois
    `fetchOrdersCb(user.id, cb)` para obter os pedidos, e finalmente
    `callback(null, { user, orders })`.

## Debugging (2)

13. **`fixDoubleCallbackBug(n, callback)`** — para `n` negativo, a função
    chama `callback` com erro **e também** continua e chama `callback` de
    novo com sucesso. Corrija para que `callback` seja chamado **uma única
    vez**.
14. **`fixSwallowedErrorCallback(id, users, callback)`** — quando o `id`
    não é encontrado, a função chama `callback(null, undefined)` como se
    tivesse sucesso. Corrija para reportar um erro de verdade quando o
    usuário não existe.

## Refatoração (1)

15. **`refactorCallbackPyramid(userId, api, callback)`** — a implementação
    atual funciona, mas aninha três chamadas de callback em cascata (a
    "pirâmide da perdição"), com tratamento de erro duplicado em cada
    nível. Refatore para reduzir o aninhamento — por exemplo, extraindo
    funções nomeadas para cada etapa — mantendo o mesmo comportamento
    observável (inclusive a propagação de erro de qualquer etapa).

## Desafio integrador (1)

16. **`processOrdersCallback(orders, validateCb, saveCb, callback)`** —
    recebe uma lista de pedidos (`{ id, amount }`), uma função
    `validateCb(order, cb)` que chama `cb(err, boolean)`, e uma função
    `saveCb(order, cb)` que chama `cb(err, savedOrder)`. Processe os
    pedidos **em série** (reaproveite a ideia de `mapSeriesCallback`):
    para cada pedido, valide; se inválido, registre o `id` em `invalid` e
    siga para o próximo (não chame `saveCb`); se válido, salve com
    `saveCb` e acumule o resultado. Ao final, chame:

    ```js
    callback(null, {
      saved: [...],        // pedidos salvos (retorno de saveCb)
      invalid: [...],       // ids dos pedidos que não passaram na validação
      totalRevenue: number, // soma de amount dos pedidos salvos
    });
    ```

    Se `validateCb` ou `saveCb` chamarem `callback` com erro em algum
    ponto, pare tudo e propague esse erro.

## Critérios de aceitação

- `npm test` sem falhas.
- Nenhuma função chama seu `callback` mais de uma vez.
- Toda função que pode falhar aceita e propaga erro no formato
  `callback(err)`, nunca lançando exceção síncrona nem retornando
  `undefined` silenciosamente.
- Você consegue explicar, sem consultar o código, por que
  `util.promisify` exige a convenção `callback(err, result)` para
  funcionar.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
