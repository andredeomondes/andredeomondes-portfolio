# Unidade 23 — Event loop em nível de linguagem

Fase 1, Unidade 23. Cobre: call stack, fila de macrotasks (`setTimeout`),
fila de microtasks (`Promise.then`, `queueMicrotask`), a fila de
`process.nextTick` do Node, e a ordem de execução entre código síncrono,
microtasks e macrotasks.

Esta unidade assume que você já domina `Promise`, `async/await` e os
combinadores (unidades 19–22). Aqui o foco muda: não é "como usar
promises", é "quando exatamente o motor do JavaScript decide rodar cada
pedaço de código".

## Por que isso importa para backend

Em produção, entender o event loop é o que separa "meu servidor trava sob
carga" de "meu servidor lida com milhares de requisições concorrentes sem
travar". Bugs de ordem de execução (uma resposta HTTP enviada antes dos
dados estarem prontos, um timeout que nunca é limpo e vaza memória, um
loop que bloqueia o event loop inteiro) são comuns e sutis. Saber
exatamente a ordem call stack → microtasks → macrotasks é o que permite
prever e depurar esse tipo de problema sem tentativa e erro.

## Antes de começar

Responda por escrito antes de abrir qualquer documentação:

1. Se eu tenho `console.log("a")`, depois `setTimeout(() => console.log("b"), 0)`,
   depois `Promise.resolve().then(() => console.log("c"))`, depois
   `console.log("d")`, em que ordem os quatro logs aparecem? Por quê?
2. Uma função `async` sempre é assíncrona desde a primeira linha, ou ela
   roda algum trecho de forma síncrona?
3. O que acontece com o event loop se uma função síncrona nunca retorna
   (por exemplo, um loop infinito sem `await`)?

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-23-event-loop/exercises.test.js
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Os testes desta unidade dependem de ordem de execução real, não só de
   valores de retorno. Preste atenção especial em qual API você usa
   (`setTimeout` vs `Promise.then` vs `queueMicrotask` vs
   `process.nextTick`) — a API escolhida muda a fila em que o callback
   entra, e isso muda a ordem observável.

## Exercícios fundamentais (8)

1. **`syncBeforeAsync()`** — retorna uma `Promise` que resolve com um
   array mostrando a ordem: todo o código síncrono roda primeiro, depois
   uma microtask (`Promise.then`), depois uma macrotask (`setTimeout`).
   Resultado esperado: `["sync-start", "sync-end", "microtask", "timeout"]`.
2. **`multipleMicrotasksBeforeTimeout()`** — agende um `setTimeout(0)` e,
   antes dele já ter disparado, três microtasks via `Promise.resolve().then`.
   Retorne a ordem final: as três microtasks devem aparecer antes do
   timeout.
3. **`demoAsyncSyncPortion()`** — demonstre que uma função `async` executa
   de forma síncrona até encontrar o primeiro `await`. Dentro da função
   principal, chame uma função `async` interna (sem `await` imediato),
   registre um valor logo após a chamada, e só depois dê `await` no
   resultado. A ordem esperada mostra que o trecho antes do `await`
   interno roda antes do código que vem depois da chamada externa.
4. **`delay(ms, value)`** — utilitário clássico: retorna uma `Promise`
   que resolve com `value` depois de `ms` milissegundos, usando
   `setTimeout`.
5. **`queueMicrotaskOrder()`** — agende duas chamadas a `queueMicrotask`
   (não `Promise.then`) e retorne a ordem em que elas rodam. Confirme que
   `queueMicrotask` respeita FIFO.
6. **`microtaskBeforeQueuedTimeout()`** — agende, nesta ordem: um
   `setTimeout(0)`, um `queueMicrotask`, e um `Promise.resolve().then`.
   Retorne a ordem final de execução. As duas microtasks devem rodar
   antes do timeout, na ordem em que foram agendadas.
7. **`runTasksSequentially(taskFns)`** — recebe um array de funções que
   retornam `Promise`s. Execute-as **uma de cada vez** (não todas ao
   mesmo tempo) usando `await` dentro de um laço, retornando um array com
   os resultados na ordem original.
8. **`timeoutOrder(delays)`** — recebe um array de atrasos em ms. Agende
   um `setTimeout` para cada índice com seu respectivo atraso, e retorne
   um array com os **índices originais** na ordem em que os timeouts
   dispararam de fato (do menor atraso para o maior).

## Exercícios intermediários (4)

9. **`nextTickBeforeTimeout()`** — no Node.js, `process.nextTick` drena
    numa fila própria que o Node sempre esvazia **antes** de seguir para
    a fase de timers do event loop. Agende um `setTimeout(0)` e, depois
    dele no código, um `process.nextTick` — e retorne a ordem real de
    execução (dica: a ordem no código não é a ordem de execução aqui).
10. **`chainedThenOrder()`** — construa uma cadeia
    `Promise.resolve().then(...).then(...).then(...)`, cada elo
    registrando seu próprio passo. Agende também um `setTimeout(0)`
    **antes** de iniciar a cadeia. Retorne a ordem final — a cadeia
    inteira (múltiplas microtasks) deve rodar antes do timeout.
11. **`timeoutFallback(promise, ms, fallbackValue)`** — retorna o que
    resolver primeiro: `promise`, ou `fallbackValue` depois de `ms`
    milissegundos caso `promise` ainda não tenha resolvido. Use a função
    `delay` (ou equivalente) combinada com `Promise.race`.
12. **`batchMicrotaskFlood(count)`** — agende, num laço, `count`
    microtasks (`Promise.resolve().then`) cada uma registrando seu
    índice, e um único `setTimeout(0)` agendado antes do laço. Retorne a
    ordem final: todas as microtasks devem aparecer antes do timeout,
    mesmo quando `count` é grande — a fila de microtasks drena
    completamente antes de qualquer macrotask rodar.

## Debugging (2)

13. **`raceAgainstTimeoutBuggy(promise, ms)`** — deveria rejeitar com um
    erro quando `promise` demora mais que `ms` para resolver. Em vez
    disso, resolve silenciosamente com a string `"timeout"`, escondendo a
    falha de quem chamou a função. Corrija sem mudar a assinatura.
14. **`flushOrderBuggy()`** — deveria retornar
    `["sync", "microtask", "timeout"]`, mas retorna
    `["sync", "timeout", "microtask"]`. O nome de uma variável interna diz
    "microtask", mas o código usa a API errada para agendar esse
    callback. Corrija sem mudar o formato do retorno.

## Refatoração (1)

15. **`pollUntilReadyMessy(checkFn, intervalMs, maxAttempts)`** — já
    funciona: chama `checkFn` repetidamente a cada `intervalMs`
    milissegundos até que ela retorne `true` (resolve `true`) ou até
    atingir `maxAttempts` tentativas (rejeita com erro). A implementação
    atual usa uma função nomeada recursiva com callbacks aninhados dentro
    de uma `Promise`, misturando `.then()`/`.catch()` com `setTimeout`.
    Refatore usando `async`/`await` para reduzir aninhamento, mantendo o
    mesmo comportamento observável (mesma assinatura, mesma resolução,
    mesma rejeição).

## Desafio integrador (1)

16. **`processQueueWithConcurrencyLimit(items, worker, limit)`** —
    processa `items` chamando `worker(item)` (que retorna uma `Promise`)
    para cada um, mas nunca deixa mais que `limit` chamadas de `worker`
    "em voo" ao mesmo tempo. Retorna um array com os resultados **na
    ordem original de `items`**, não na ordem em que terminaram. Combina
    event loop (controle de quando cada tarefa começa), promises,
    `async/await` e funções de alta ordem (unidades 8–22).

## Critérios de aceitação

- `node --test exercises/01-javascript-core/unit-23-event-loop/exercises.test.js`
  sem falhas.
- Você consegue explicar, sem consultar o código, por que
  `Promise.resolve().then(fn)` sempre roda antes de `setTimeout(fn, 0)`,
  mesmo quando o `setTimeout` é escrito primeiro no código.
- Você consegue explicar por que `process.nextTick` sempre roda antes de
  qualquer `setTimeout`, mesmo quando é agendado depois dele no código.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
