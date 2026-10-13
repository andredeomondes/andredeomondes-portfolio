# Dicas — Unidade 22

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `propagateRejection`: "enriquecer" um erro significa criar um novo
  `Error` cuja mensagem menciona a mensagem original — como você acessa a
  mensagem de um erro capturado num `catch`?
- Para `ValidationError`: toda subclasse de `Error` precisa chamar
  `super(...)` antes de usar `this`. O que `super(message)` já resolve
  para você (a propriedade `.message`)?
- Para `wrapAsyncErrors`: como você descobre o **nome da classe** de um
  erro capturado (não a mensagem, o nome da classe — `"ValidationError"`,
  `"TypeError"`, etc.)? Toda instância tem uma referência ao construtor
  que a criou.
- Para `retryOnRetryableError`: a decisão de tentar de novo depende de
  **duas** coisas — se o erro é retryable, e se ainda sobram tentativas.
  Em que ordem você checa essas duas condições?
- Para `asyncFinallyAlwaysRuns`: existe uma palavra-chave de JavaScript
  cujo bloco roda sempre, dê certo ou errado, dentro de um `try`. Qual é?
- Para `fixUnhandledRejectionBug`: `.forEach` espera a função de callback
  retornar `undefined` — ele nunca olha para o que a callback retorna, e
  muito menos "espera" uma Promise que ela produza. Que método de array
  produz um array de Promises que **pode** ser aguardado de uma vez?
- Para `fixErrorSwallowedInAsyncCatch`: o `catch` atual captura o erro
  mas devolve exatamente o mesmo formato do caminho de sucesso. O que
  deveria mudar no objeto retornado dentro do `catch`?

## Nível 2 — pista mais direta

- `propagateRejection`:
  ```js
  try {
    return await promise;
  } catch (err) {
    throw new Error(`falha ao processar: ${err.message}`);
  }
  ```
- `ValidationError`:
  ```js
  export class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = "ValidationError";
    }
  }
  ```
- `validateAgeAsync`: `if (age < 0 || age > 130) throw new ValidationError("idade fora do intervalo permitido");`
  depois retorne `age`.
- `wrapAsyncErrors`: retorne uma **nova** `async function` que envolve a
  chamada de `asyncFn` num `try/catch`; no `catch`, use
  `err.constructor.name` para o campo `type`.
- `asyncErrorChain`: percorra `steps` com um índice (`for` clássico, não
  `for...of`, para ter o índice à mão); dentro de um `try/catch` por
  iteração, se falhar, retorne imediatamente
  `{ ok: false, step: i, error: err.message }`.
- `retryOnRetryableError`:
  ```js
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await taskFn();
    } catch (err) {
      if (!isRetryableError(err)) throw err;
      lastError = err;
    }
  }
  throw lastError;
  ```
- `asyncFinallyAlwaysRuns`:
  ```js
  try {
    return await asyncFn();
  } finally {
    await cleanupFn();
  }
  ```
- `errorBoundaryAsync`:
  ```js
  try {
    return await asyncFn();
  } catch (err) {
    return onError(err);
  }
  ```
- `fixUnhandledRejectionBug`: troque `.forEach` por `.map` (que retorna
  um array de Promises) seguido de `await Promise.all(...)`.
- `fixErrorSwallowedInAsyncCatch`: no `catch`, retorne
  `{ ok: false, error: err.message }` em vez de
  `{ ok: true, value: undefined }`.

## Nível 3 — quase o código, mas ainda não a solução

- `validateThenSaveAsync`:
  ```js
  let validated;
  try {
    validated = await validateAsyncFn(input);
  } catch (err) {
    return { ok: false, stage: "validate", error: err.message };
  }
  try {
    const saved = await saveAsyncFn(validated);
    return { ok: true, value: saved };
  } catch (err) {
    return { ok: false, stage: "save", error: err.message };
  }
  ```
- `safeAsyncMap`:
  ```js
  return Promise.all(
    items.map(async (item) => {
      try {
        const value = await asyncFn(item);
        return { item, ok: true, value };
      } catch (err) {
        return { item, ok: false, error: err.message };
      }
    }),
  );
  ```
- `refactorErrorHandlingDuplication`:
  ```js
  const report = [];
  for (let step = 0; step < steps.length; step++) {
    try {
      const result = await steps[step]();
      report.push({ step, ok: true, value: result });
    } catch (err) {
      report.push({ step, ok: false, error: err.message });
    }
  }
  return report;
  ```
- `runPipelineWithErrorReport`: combine a ideia de `asyncErrorChain`
  (etapas em sequência, para de rodar as próximas etapas assim que uma
  falha) com a ideia de `safeAsyncMap` (processa todos os pedidos, um
  falhando não impede os outros):
  ```js
  const succeeded = [];
  const failed = [];
  for (const order of orders) {
    let current = order;
    let failedAt = null;
    for (let step = 0; step < steps.length; step++) {
      try {
        current = await steps[step](current);
      } catch (err) {
        failed.push({ id: order.id, step, error: err.message });
        failedAt = step;
        break;
      }
    }
    if (failedAt === null) succeeded.push(current);
  }
  return { succeeded, failed };
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
