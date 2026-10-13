# Dicas — Unidade 5

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `makeCounter`: onde a variável que guarda o valor atual precisa ser
  declarada para que a função retornada consiga lê-la e alterá-la a cada
  chamada, mas ninguém de fora consiga acessá-la diretamente?
- Para `onceFn`: você precisa de duas coisas guardadas na closure — o
  resultado da primeira chamada, e algo que diga "já rodei uma vez". Um
  booleano resolve o segundo problema?
- Para `memoize`: um `Map` guardado fora da função retornada, mas dentro
  da função externa, sobrevive entre chamadas de `wrapped`?
- Para `createLoopClosuresBuggy`/`createLoopClosuresFixed`: quantas
  variáveis `i` diferentes existem se você usa `let` num `for`? E se usa
  `var`?
- Para `createSharedCounterPair`: as duas funções internas (`increment` e
  `decrement`) precisam compartilhar a mesma variável `count`. Isso é
  possível se cada uma declarar seu próprio `let count` dentro do próprio
  corpo?

## Nível 2 — pista mais direta

- `makeCounter`: `let value = start; return () => { value += 1; return value; };`
- `onceFn`: `let called = false; let result; return (...args) => { if (!called) { result = fn(...args); called = true; } return result; };`
- `memoize`: `const cache = new Map(); return (arg) => { if (cache.has(arg)) return cache.get(arg); const result = fn(arg); cache.set(arg, result); return result; };`
- `createLoopClosuresFixed`: troque `var i` por `let i` no `for` — cada
  iteração de um `for (let ...)` cria uma **nova ligação** da variável,
  então cada closure captura a sua própria cópia.
- `createSharedCounterPair`: declare `let count = 0;` **uma vez**, fora e
  acima das duas funções internas, e faça ambas lerem/alterarem essa mesma
  variável — não uma `let count` própria dentro de cada uma.

## Nível 3 — quase o código, mas ainda não a solução

- `createBankAccount`: valide `amount <= 0` lançando `RangeError` no topo
  de `deposit` e `withdraw` antes de qualquer outra lógica; em `withdraw`,
  depois da validação de `amount`, cheque `amount > balance` e lance
  `new Error("saldo insuficiente")`.
- `rememberLastCall`: guarde `let lastCall = null;`; dentro da função
  retornada, calcule `const result = fn(...args);`, atualize
  `lastCall = { args, result };` e retorne `result`; anexe
  `wrapped.getLastCall = () => lastCall;` à função antes de retorná-la.
- `createEventEmitter`: guarde `const handlers = {};` (ou `new Map()`);
  `on` faz `(handlers[event] ??= []).push(handler)`; `emit` faz
  `(handlers[event] ?? []).forEach((h) => h(payload))`; `off` filtra o
  array removendo o handler específico.
- `createRateLimiter`: guarde `let count = 0;`; `attempt()` retorna
  `false` se `count >= maxCalls`, senão incrementa `count` e retorna
  `true`; `reset()` zera `count`.
- `refactorCreateValidator`: uma única expressão
  `typeof value === "number" && value >= min && value <= max` substitui os
  três `if`.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
