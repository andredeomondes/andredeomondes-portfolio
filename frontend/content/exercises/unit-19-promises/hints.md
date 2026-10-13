# Dicas — Unidade 19

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `delayPromise`: o executor de `new Promise((resolve, reject) => ...)`
  roda imediatamente e de forma síncrona. O que dentro dele precisa ser
  assíncrono para o `resolve` só acontecer depois de `ms`?
- Para `resolveOrDefault`: por que `Promise.resolve` funciona tanto para
  um valor puro (`42`) quanto para uma Promise já existente?
- Para `tapPromise` vs `chainDoubleThenSquare`: os dois usam `.then`, mas
  um transforma o valor e o outro não. O que o `.then` de `tapPromise`
  precisa retornar para não alterar o valor?
- Para `promiseFromCallback`: você já escreveu isso "na mão" na Unidade
  18 (era basicamente o objetivo de `util.promisify`). O que muda aqui é
  que agora você escreve o wrapper, não usa um pronto.
- Para `sequentialReduce`: `Array.prototype.reduce` pode acumular
  qualquer coisa — inclusive uma Promise. O que o `callback` do `reduce`
  precisa retornar em cada passo?
- Para `fixMissingReturnInChain`: o que uma função que não tem `return`
  explícito retorna implicitamente em JavaScript? O que isso vira quando
  está dentro de um `.then`?

## Nível 2 — pista mais direta

- `delayPromise`: `return new Promise((resolve) => setTimeout(() => resolve(value), ms));`
- `resolveOrDefault`: `return Promise.resolve(promiseOrValue).catch(() => defaultValue);`
- `tapPromise`: `return promise.then((value) => { sideEffectFn(value); return value; });`
- `finallyCleanup`: `.finally()` não recebe o valor nem pode alterá-lo — ele
  só "passa direto". `return promise.finally(cleanupFn);` já preserva o
  resultado original (sucesso ou erro) automaticamente.
- `promiseFromCallback`: `return new Promise((resolve, reject) => { fn(...args, (err, result) => { if (err) reject(err); else resolve(result); }); });`
- `retryPromise`: função recursiva que, no `.catch` de `taskFn()`,
  decide se chama `taskFn()` de novo ou propaga o erro, dependendo de
  quantas tentativas já foram feitas.
- `timeoutPromise`: crie uma segunda Promise que só rejeita depois de
  `ms` (com `setTimeout`); dentro de `new Promise((resolve, reject) => ...)`,
  chame `.then(resolve, reject)` na `promise` original e agende o
  `setTimeout` que chama `reject` se disparar primeiro.
- `sequentialReduce`: `return items.reduce((accPromise, item) => accPromise.then((acc) => asyncFn(item).then((result) => [...acc, result])), Promise.resolve([]));`
- `fixMissingReturnInChain`: adicione `return` antes de
  `api.fetchOrders(user.id).then(...)`.
- `fixUnhandledRejectionSwallow`: dentro do `.catch`, depois de logar,
  adicione `throw err;` (ou remova o `.catch` inteiro, já que ele só
  precisa logar e deixar passar — mas relançar é mais explícito e
  didático).

## Nível 3 — quase o código, mas ainda não a solução

- `chainUserThenOrders`:
  ```js
  return fetchUserPromiseFn(userId).then((user) =>
    fetchOrdersPromiseFn(user.id).then((orders) => ({ user, orders })),
  );
  ```
- `refactorPromiseHell`: a versão achatada encadeia assim, guardando o
  que precisar em variáveis de escopo externo (ou retornando tuplas):
  ```js
  let user;
  return api
    .fetchUser(userId)
    .then((u) => {
      user = u;
      return api.fetchOrders(user.id);
    })
    .then((orders) => api.fetchOrderItems(orders[0]?.id).then((items) => ({ user, orders, items })));
  ```
  (Existem outras formas igualmente válidas — o critério é reduzir o
  aninhamento, não uma solução única.)
- `processOrdersPromise`: separe primeiro os pedidos válidos dos
  inválidos com `.filter` (síncrono, usando `validateFn`), depois use
  `sequentialReduce` (ou a mesma técnica de `reduce` + Promise) só nos
  válidos para chamar `savePromiseFn` em série e somar `amount` no
  caminho.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
