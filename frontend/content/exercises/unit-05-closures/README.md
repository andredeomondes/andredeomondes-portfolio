# Unidade 5 — Closures

Fase 1, Unidade 5. Cobre: fábricas de função (funções que retornam
funções com estado privado), encapsulamento via closure e as armadilhas
mais comuns — principalmente a variável de loop compartilhada entre
closures criadas com `var`.

## Antes de começar

Responda por escrito (pode ser neste README, numa cópia local, ou em
`notes/concepts/` se quiser guardar):

1. Em uma frase, o que é uma closure?
   `R = é uma função que tem acesso a função pai`
2. Se uma função interna lê uma variável da função externa, e a função
   externa já retornou, essa variável ainda existe em algum lugar? Onde?
   `R = na memória heap`
3. Por que criar funções dentro de um `for (var i = ...)` é uma armadilha
   clássica de closures? O que muda se você usar `let` no lugar de `var`?
   `R = let tem escopo de bloco e é criada uma variável em cada iteração,
    já o var tem escopo de função e ao invés de criar, ele reatribui 
    o valor várias vezes`
   Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
   função — você vai comparar com o resultado real ao rodar os testes.

## Por que isso importa para backend

Closures são a base de fábricas de middleware, memoização de resultados
caros, rate limiters, contadores de métricas, event emitters e qualquer
padrão que precise de estado privado sem criar uma classe. Entender
exatamente o que uma closure "captura" (a variável, não o valor no
momento da criação) evita bugs sutis em código que registra callbacks em
loop — um erro real e recorrente em bases de código de produção.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-05-closures/exercises.test.js
   ```

   ou, para rodar toda a suíte do repositório:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Use a linha `// test: node --test --test-name-pattern=...` acima de cada
   função para rodar só aquele exercício enquanto trabalha nele.

## Exercícios fundamentais (8)

1. **`makeCounter(start)`** — retorna uma função `increment()` sem
   parâmetros. Cada chamada soma `1` a um contador privado (que começa em
   `start`, default `0`) e retorna o novo valor.
2. **`makeGreeter(greeting)`** — retorna uma função `(name) => ...` que
   monta `"<greeting>, <name>!"`, reaproveitando o `greeting` capturado.
3. **`createBankAccount(initialBalance)`** — retorna
   `{ deposit(amount), withdraw(amount), getBalance() }` operando sobre um
   saldo privado (default `0`). `deposit` e `withdraw` lançam `RangeError`
   se `amount <= 0`. `withdraw` lança `Error` com a mensagem
   `"saldo insuficiente"` se `amount` for maior que o saldo atual.
4. **`onceFn(fn)`** — retorna uma função que executa `fn` apenas na
   **primeira** chamada, guardando o resultado. Chamadas seguintes (com
   quaisquer argumentos) retornam sempre o mesmo resultado da primeira
   chamada, sem executar `fn` de novo.
5. **`createToggle(initial)`** — retorna uma função sem parâmetros que, a
   cada chamada, inverte um booleano privado (default inicial `false`) e
   retorna o novo valor.
6. **`createAccumulator(initial)`** — retorna uma função `add(n)` que soma
   `n` a um total privado (default inicial `0`) e retorna o **novo total**
   a cada chamada (o total persiste entre chamadas — isso é diferente de
   uma função pura que sempre recalcula do zero).
7. **`createStack()`** — retorna
   `{ push(item), pop(), peek(), size() }` operando sobre um array
   privado. `pop()` remove e retorna o último item (ou `undefined` se
   vazio). `peek()` retorna o último item sem remover.
8. **`rememberLastCall(fn)`** — retorna uma função `wrapped(...args)` que
   chama `fn(...args)`, guarda `{ args, result }` numa closure e retorna o
   `result`. A função retornada também deve ter um método
   `wrapped.getLastCall()` que devolve o último `{ args, result }`
   guardado, ou `null` se `wrapped` nunca foi chamada.

## Exercícios intermediários (4)

9. **`createLoopClosuresFixed(n)`** — retorna um array com `n` funções,
   onde a função na posição `i` retorna `i` quando chamada
   (`fns[0]()` `=== 0`, `fns[2]()` `=== 2`, etc.). Use `let` no laço para
   que cada closure capture sua própria cópia da variável (compare com o
   exercício de debugging 13, que mostra a versão quebrada com `var`).
10. **`memoize(fn)`** — retorna uma função `wrapped(arg)` que guarda em
    cache (um `Map`, capturado pela closure) o resultado de `fn(arg)` por
    valor de `arg`. Se `wrapped` for chamada de novo com o mesmo `arg`,
    retorna o valor em cache sem chamar `fn` de novo.
11. **`createEventEmitter()`** — retorna
    `{ on(event, handler), off(event, handler), emit(event, payload) }`.
    `on` registra um `handler` para um `event` (string). `emit` chama, na
    ordem de registro, todos os handlers registrados para aquele `event`
    passando `payload`, e não faz nada se não houver handlers. `off`
    remove um handler específico daquele evento.
12. **`limitCalls(fn, maxCalls)`** — retorna uma função `wrapped(...args)`
    que chama `fn(...args)` normalmente enquanto o número de chamadas for
    menor que `maxCalls`. A partir da chamada que excede o limite,
    `wrapped` não chama mais `fn` e retorna `undefined`.

## Debugging (2)

13. **`createLoopClosuresBuggy(n)`** — o sintoma relatado é que era
    esperado `fns[i]()` retornar `i`, mas todas as funções do array
    retornam o mesmo valor (`n`). Olhe a palavra-chave usada para declarar
    a variável do laço — ela tem escopo de bloco ou de função? Quantas
    "cópias" dessa variável existem depois que o laço termina?
14. **`createSharedCounterPair()`** — o sintoma relatado é que
    `increment()` e `decrement()` deveriam operar sobre o **mesmo**
    contador privado (uma closure compartilhada), mas cada chamada de
    `decrement()` parece ignorar completamente o que `increment()` fez.
    Onde a variável `count` está declarada em cada função? Ela está sendo
    capturada de um escopo compartilhado, ou recriada a cada chamada?

## Refatoração (1)

15. **`refactorCreateValidator(min, max)`** — a implementação atual
    funciona (retorna uma função que valida se um valor é um número dentro
    do intervalo `[min, max]`), mas usa três `if` sequenciais para algo que
    cabe em uma única expressão booleana. Refatore o corpo da função
    interna para uma única linha de retorno, mantendo o mesmo
    comportamento observável.

## Desafio integrador (1)

16. **`createRateLimiter(maxCalls)`** — combina fábricas de função
    (Unidade 3) com estado privado via closure (Unidade 5). Retorna um
    objeto `{ attempt(), reset() }`:

    - `attempt()` retorna `true` e incrementa um contador privado de
      chamadas bem-sucedidas, enquanto esse contador for menor que
      `maxCalls`;
    - a partir da chamada que excederia `maxCalls`, `attempt()` retorna
      `false` e **não** incrementa o contador;
    - `reset()` zera o contador privado, permitindo `maxCalls` novas
      chamadas bem-sucedidas.

    ```js
    const limiter = createRateLimiter(2);
    limiter.attempt(); // true
    limiter.attempt(); // true
    limiter.attempt(); // false
    limiter.reset();
    limiter.attempt(); // true
    ```

## Critérios de aceitação

- `npm test` sem falhas.
- Você consegue explicar, sem consultar o código, por que closures criadas
  dentro de um `for (var i = ...)` compartilham a mesma variável `i`, e por
  que trocar `var` por `let` resolve isso.
- Você consegue implementar `makeCounter` ou `createToggle` de memória, sem
  olhar a solução, numa folha em branco.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
