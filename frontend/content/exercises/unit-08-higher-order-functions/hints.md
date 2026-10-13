# Dicas — Unidade 8

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `makeAdder`/`makeMultiplier`: o que a função externa precisa
  fazer no `return`? Ela retorna um valor calculado, ou retorna outra
  função?
- Para `once`: quantas variáveis você precisa para lembrar "já rodou" e
  "qual foi o resultado"? Onde essas variáveis devem viver para
  sobreviver entre chamadas?
- Para `makeCounter`: se `count` fosse declarado dentro de `increment`,
  ele resetaria a cada chamada. Onde `count` precisa estar declarado
  para ser compartilhado entre `increment`, `decrement` e `value`?
- Para `curry3`: quantas funções aninhadas (`a => ... `) você precisa
  escrever para "guardar" três argumentos antes de chamar `fn`?
- Para `fixCounterClosureBug`: rode mentalmente `increment()` duas
  vezes. Em que linha o valor "novo" de `count` é perdido?

## Nível 2 — pista mais direta

- `makeAdder(x)`: `return function (y) { return x + y; };` — `x` fica
  "preso" na closure.
- `once(fn)`: use duas variáveis fora da função retornada:
  `let called = false; let result;`. Dentro da função retornada, se
  `!called`, calcule `result = fn(...args)` e marque `called = true`.
- `memoize(fn)`: `const cache = new Map();` fora da função retornada. Ao
  chamar, verifique `cache.has(arg)` antes de calcular; se não tiver,
  calcule e `cache.set(arg, resultado)`.
- `pipeAll(...fns)`: comece com `let result = x;` e faça
  `for (const fn of fns) { result = fn(result); }`.
- `fixCounterClosureBug`: a linha `let count = count + 1;` dentro de
  `increment` declara uma variável local nova (erro de
  *temporal dead zone*/shadowing). Remova o `let count =` e apenas
  faça `count += 1;` (ou `count = count + 1;`) usando o `count` externo.

## Nível 3 — quase o código, mas ainda não a solução

- `makeCounter(start = 0)`:
  ```js
  let count = start;
  return {
    increment() { count += 1; return count; },
    decrement() { count -= 1; return count; },
    value() { return count; },
  };
  ```
- `curry3(fn)`: `return (a) => (b) => (c) => fn(a, b, c);`
- `buildValidationPipeline(rules)`: retorne
  `function validate(value) { const messages = []; for (const rule of rules) { if (!rule.test(value)) { messages.push(rule.message); } } return messages; }`.
- `fixOnceBug`: adicione `called = true;` logo depois de calcular
  `result = fn(...args);`, dentro do `if (!called)`.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
