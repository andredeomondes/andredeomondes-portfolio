# Dicas — Unidade 20

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `delayAsync`: você já escreveu `new Promise((resolve) => setTimeout(...))`
  na Unidade 19. O que muda agora é só a palavra `await` na frente da
  chamada, dentro de uma `async function`.
- Para `sumAsyncValues` vs `Promise.all`: por que percorrer com
  `for...of` e `await` dentro do laço processa as Promises **em série**,
  mesmo que elas já existam todas de antemão no array?
- Para `fetchWithRetryAsync`: como fica um laço `for` que tenta algo, e
  se der erro, só relança na **última** iteração?
- Para `safeAsyncWrapper`: repare que a função em si não é `async` — ela
  **retorna** uma função. Que tipo de função ela precisa retornar para
  que quem a chamar possa dar `await` no resultado?
- Para `fixMissingAwaitBug`: o que `fetchUserByIdAsync(id, users)` retorna
  quando você não usa `await` na chamada?
- Para `fixTryCatchScopeBug`: rode mentalmente o código atual. Em que
  linha exatamente a Promise rejeitada de `safeDivideAsync` é
  "observada" (isto é, quando o `await` de fato acontece)? Essa linha
  está dentro ou fora do `try`?

## Nível 2 — pista mais direta

- `delayAsync`: `await new Promise((resolve) => setTimeout(resolve, ms)); return value;`
- `safeDivideAsync`: `if (b === 0) throw new Error("divisão por zero"); return a / b;`
- `sumAsyncValues`: `let total = 0; for (const p of promises) { total += await p; } return total;`
- `fetchWithRetryAsync`:
  ```js
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await taskFn();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
  ```
- `safeAsyncWrapper`:
  ```js
  return async (...args) => {
    try {
      const value = await asyncFn(...args);
      return { ok: true, value };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };
  ```
- `fixMissingAwaitBug`: troque `const userPromise = fetchUserByIdAsync(id, users);`
  por `const user = await fetchUserByIdAsync(id, users);` e ajuste o
  objeto retornado para `{ user, fetchedAt: Date.now() }`.
- `fixTryCatchScopeBug`: troque
  `result = safeDivideAsync(a, b);` (sem `await`, dentro do `try`) e
  `const value = await result;` (fora do `try`) por um único
  `const value = await safeDivideAsync(a, b);` dentro do `try`.

## Nível 3 — quase o código, mas ainda não a solução

- `asyncPipeline`:
  ```js
  const user = await fetchUserAsyncFn(userId);
  const orders = await fetchOrdersAsyncFn(user.id);
  return { user, orders };
  ```
- `asyncTimeout`:
  ```js
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), ms),
  );
  return await Promise.race([promise, timeout]);
  ```
- `refactorPromiseChainToAsync`: a versão `async/await` correspondente
  tem um único `try` envolvendo os dois `await` (usuário e pedidos), e um
  `catch` que retorna `{ error: err.message }` — exatamente o mesmo
  formato do `.catch` original.
- `processOrdersAsync`: para cada pedido, `await validateAsyncFn(order)`;
  se `false`, empurre `order.id` em `invalid` e `continue`; se `true`,
  `const saved = await saveAsyncFn(order)`, empurre em `saved` e some
  `order.amount` no total. Não envolva a chamada de `saveAsyncFn` em
  `try/catch` — o enunciado pede para deixar o erro propagar.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
