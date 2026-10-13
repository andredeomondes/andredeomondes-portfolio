# Dicas — Unidade 12

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `parseIntStrict`: `Number("42abc")` retorna `NaN`, mas
  `parseInt("42abc")` retorna `42` (ignora o resto). Nenhum dos dois
  sozinho resolve o exercício — você precisa **validar o formato**
  antes de converter. Uma regex simples (`/^-?\d+$/`) ajuda?
- Para `firstSuccessful`/`retryOperation`: os dois têm a mesma estrutura
  de "tentar várias vezes até funcionar", mas com fontes diferentes de
  tentativas (funções diferentes vs. a mesma função repetida). O que
  você precisa guardar entre as tentativas para poder relançar algo
  útil se todas falharem?
- Para `validateUserPayload`: se você usar `throw` no primeiro campo
  inválido, você nunca vai saber se os outros campos também estão
  errados. Que estrutura de dados acumula problemas sem interromper a
  validação?
- Para `fixFinallyReturnBug`: o que acontece com uma exceção lançada
  dentro de um `try` se o `finally` correspondente tiver um `return`?
  (Regra da linguagem: o `return`/`throw` do `finally` sempre vence.)

## Nível 2 — pista mais direta

- `divideOrThrow`: `if (b === 0) throw new Error("divisão por zero");`
  antes do `return a / b;`.
- `tryParseJson`: `try { return { ok: true, data: JSON.parse(str) }; } catch (error) { return { ok: false, error: error.message }; }`.
- `validateAge`: `if (age < 0 || age > 150) throw new RangeError(...);`.
- `catchAndRewrap`: `try { return fn(); } catch (error) { throw new Error(\`${context}: ${error.message}\`); }`.
- `firstSuccessful`: guarde `let lastError;` fora do laço; dentro de
  cada tentativa, `try { return fn(); } catch (error) { lastError = error; }`;
  depois do laço, lance um erro usando `lastError`.
- `retryOperation`: mesmo padrão de `firstSuccessful`, mas chamando a
  **mesma** `fn` repetidamente em vez de percorrer um array de funções.
  Ao final do laço, `throw lastError;` (relance o erro real, não um
  novo).
- `propagateWithContext`: `throw new Error(msg, { cause: error });` — o
  segundo argumento de `Error` aceita `{ cause }` desde ES2022.
- `fixSwallowedErrorBug`: adicione `throw error;` dentro do `catch`
  vazio.
- `fixFinallyReturnBug`: apague a linha `return "cleanup done";` do
  `finally` (ou troque por uma ação sem `return`, como só um log).

## Nível 3 — quase o código, mas ainda não a solução

- `validateUserPayload`:
  ```js
  const errors = [];
  if (!payload.name || payload.name.trim() === "") errors.push("name é obrigatório");
  if (!payload.email || !payload.email.includes("@")) errors.push("email inválido");
  if (typeof payload.age !== "number" || payload.age < 0) errors.push("age deve ser um número não-negativo");
  if (errors.length > 0) throw new ValidationError(errors.join("; "));
  return payload;
  ```
- `processOrdersWithErrorReport`:
  ```js
  const successes = [];
  const failures = [];
  for (const order of orders) {
    try {
      successes.push({ order, result: processFn(order) });
    } catch (error) {
      failures.push({ order, error: error.message });
    }
  }
  return { successes, failures };
  ```
- `refactorNestedTryCatch`: pense em validar tudo com `if`/`throw`
  simples ANTES do `try` que só cerca o `JSON.parse` e o `Math.sqrt`, e
  use um único `catch` externo para adicionar o prefixo
  `"falha ao processar entrada: "`. O desafio é reproduzir a mensagem
  duplicada do caso `value < 0` — rode o código original mentalmente (ou
  no console) para ver exatamente que string ele produz antes de tentar
  igualar isso na versão refatorada.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
