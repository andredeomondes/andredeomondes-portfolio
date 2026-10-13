# Dicas — Unidade 21

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `fetchAllUsersAll` vs `fetchAllUsersSettled`: os dois recebem os
  mesmos parâmetros. O que muda no **comportamento observável** quando
  uma das buscas falha?
- Para `firstToRespond` vs `firstSuccessful`: se a primeira Promise a
  terminar for uma rejeição, o que cada uma retorna?
- Para `anyWithFallback`: que tipo de erro `Promise.any` lança quando
  **todas** as promises falham? Isso te dá uma pista de qual `catch`
  escrever.
- Para `batchProcessAll`: como você divide um array em pedaços de
  tamanho fixo antes de processá-los? (Pense em `slice` dentro de um
  laço que avança `batchSize` por vez.)
- Para `anyOfValidations`: `Promise.any` ignora rejeições e olha só para
  o primeiro *fulfilled*. Como transformar `false` (que tecnicamente é
  "resolvido", só que sem sucesso) em algo que `Promise.any` trate como
  se tivesse falhado?
- Para `fixRaceWinnerIndexBug`: `.map` executa a função de callback para
  **todos** os itens de forma síncrona, um atrás do outro, antes de
  qualquer Promise de fato resolver. Isso significa que a variável
  `winnerIndex` é reatribuída 3 vezes **antes** de `Promise.race`
  sequer começar a esperar. Onde índice e resultado deveriam estar
  amarrados, se não numa variável externa?

## Nível 2 — pista mais direta

- `fetchAllUsersAll`: `return Promise.all(ids.map((id) => fetchUserAsyncFn(id)));`
- `fetchAllUsersSettled`: `return Promise.allSettled(ids.map((id) => fetchUserAsyncFn(id)));`
- `firstToRespond`: `return Promise.race(promises);`
- `firstSuccessful`: `return Promise.any(promises);`
- `summarizeSettled`:
  ```js
  const fulfilled = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
  const rejected = results.filter((r) => r.status === "rejected").map((r) => r.reason.message);
  return { fulfilled, rejected };
  ```
- `raceWithTimeout`: mesma estrutura de `asyncTimeout` da Unidade 20 —
  `Promise.race([promise, timeoutQueRejeitaComErro])`.
- `anyWithFallback`:
  ```js
  try {
    return await Promise.any(promises);
  } catch {
    return fallbackValue;
  }
  ```
- `fixPromiseAllFailFastBug`: troque `Promise.all` por
  `Promise.allSettled` e ajuste o `.map` seguinte (ou remova-o, já que o
  formato de `allSettled` já é `{ status, value }` / `{ status, reason }`).
- `fixRaceWinnerIndexBug`: em vez de atribuir `winnerIndex = index` numa
  variável de fora, faça cada Promise "carregar" seu próprio índice:
  `source().then((value) => ({ value, index }))`, e depois de
  `Promise.race`, desestruture `{ value, index }` do vencedor.

## Nível 3 — quase o código, mas ainda não a solução

- `batchProcessAll`:
  ```js
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((item) => asyncFn(item)));
    results.push(...batchResults);
  }
  return results;
  ```
- `raceMultipleSources`:
  ```js
  const promises = sources.map((source) =>
    fetchFn(source).then((value) => ({ source, value })),
  );
  return Promise.race(promises);
  ```
- `anyOfValidations`:
  ```js
  try {
    await Promise.any(
      validators.map((validate) =>
        validate(value).then((result) => {
          if (!result) throw new Error("reprovado");
          return true;
        }),
      ),
    );
    return true;
  } catch {
    return false;
  }
  ```
- `loadDashboardData`: primeiro `const user = await api.fetchUser(userId);`
  (sem `try/catch` — deixe propagar). Depois:
  ```js
  const [ordersResult, notificationsResult, recommendationsResult] = await Promise.allSettled([
    api.fetchOrders(userId),
    api.fetchNotifications(userId),
    api.fetchRecommendations(userId),
  ]);
  ```
  Para cada resultado, se `status === "fulfilled"` use `.value`; senão,
  use `null` e empurre `{ section: "...", message: result.reason.message }`
  em `errors`.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
