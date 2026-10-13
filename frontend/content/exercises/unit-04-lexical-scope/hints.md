# Dicas — Unidade 4

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `trackLastEvenFunctionScoped`: se você declarar a variável com
  `let` em vez de `var` dentro do `if`, ela continua acessível depois do
  laço? Por que o exercício pede `var` explicitamente?
- Para `attemptConstReassignment`: o que acontece quando você tenta
  reatribuir uma `const`? É um erro em tempo de execução ou de sintaxe?
- Para `createIifeCounter`: uma IIFE roda imediatamente e retorna algo. O
  que ela precisa retornar para que o "de fora" consiga incrementar e ler
  `count`, mas não acessar `count` diretamente?
- Para `sumOrderTotals`: cada `var total = ...` dentro do `if`/`else` é uma
  nova declaração ou é a mesma variável de fora? O que isso implica sobre
  o que sobra depois do laço?
- Para `computeDiscountedPrice`: em que linha `discount` é lido? Em que
  linha ele é declarado? A ordem dessas duas linhas no código-fonte
  importa para `let`.

## Nível 2 — pista mais direta

- `trackLastEvenFunctionScoped`: `var` tem escopo de **função**, não de
  bloco — uma vez declarada dentro do `if`, ela existe em toda a função,
  inclusive depois do laço `for` terminar.
- `attemptConstReassignment`: reatribuir uma `const` lança
  `TypeError: Assignment to constant variable.` em tempo de execução —
  use `try { valor = 2; } catch (e) { return e instanceof TypeError; }`.
- `createIifeCounter`: `(() => { let count = 0; return { increment: () => { count++; }, getValue: () => count }; })()`.
- `sumOrderTotals`: como `var` é escopada por função, as duas linhas
  `var total = ...` **substituem** o valor de `total`, elas não somam.
  A correção é usar `total +=` (ou `total =` sem a palavra `var`) dentro
  do `if`/`else`.
- `computeDiscountedPrice`: mova `let discount = 0.1;` para **antes** da
  linha que usa `discount` no cálculo — dentro do TDZ, ler a variável
  antes da declaração `let` lança erro, mesmo que ambas estejam no mesmo
  bloco.

## Nível 3 — quase o código, mas ainda não a solução

- `compareVarAndLetLeak`: dentro do `if (shouldRun) { var leakyVar = "vazou"; let scopedLet = "não vazou"; }`,
  depois do bloco use `typeof leakyVar !== "undefined"` e
  `typeof scopedLet !== "undefined"` — `typeof` nunca lança erro para uma
  variável não declarada naquele escopo, só retorna `"undefined"`.
- `varDeclaredValueBeforeAssignment`: `const before = typeof x; var x = 10; return before;`
  — a leitura de `typeof x` antes da linha `var x = 10;` não lança erro
  porque `var` é hoisted (a declaração "sobe", mas não a atribuição).
- `hoistedFunctionCall`: `function hoistedFunctionCall() { return helper(); function helper() { return "hoisted"; } }`
  — declarações de função (não `const helper = () => {}`) sofrem hoisting
  completo, corpo incluído.
- `createSequentialIdGenerator`: `function createSequentialIdGenerator(prefix) { let count = 0; return function nextId() { count += 1; return `${prefix}-${count}`; }; }`.
- `refactorScoreSummary`: a variável do `for` vira `let i` local ao laço;
  `total`, `max` e `min` continuam precisando ser `let` (são reatribuídas);
  `s` dentro do laço e `avg` no final podem virar `const`.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
