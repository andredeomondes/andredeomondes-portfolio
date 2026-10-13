# Dicas — Unidade 23

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `syncBeforeAsync`: se você escrevesse tudo em ordem de leitura no
  código (setTimeout antes do Promise.then, por exemplo), a ordem de
  execução seria a mesma da ordem de leitura? Por quê não?
- Para `demoAsyncSyncPortion`: o que uma função `async` faz de diferente
  de uma função normal *antes* de encontrar seu primeiro `await`?
- Para `timeoutOrder`: como você sabe quando "todos os timeouts já
  dispararam" para poder resolver a Promise externa?
- Para `nextTickBeforeTimeout`: o Node tem uma fila que ele sempre
  esvazia por completo antes de deixar o event loop avançar para a fase
  de timers — mesmo que o timer já esteja "pronto" para disparar. Qual
  API expõe essa fila?
- Para `pollUntilReadyMessy`: o que a versão com callbacks aninhados faz
  em cada "tentativa"? Consegue descrever o mesmo fluxo como um laço
  `while` com `await` dentro?
- Para `processQueueWithConcurrencyLimit`: se você disparasse todos os
  `worker(item)` de uma vez com `Promise.all`, o que aconteceria com o
  "limite" de execuções simultâneas?

## Nível 2 — pista mais direta

- `syncBeforeAsync`: use `order.push(...)` de forma síncrona duas vezes,
  agende `setTimeout(() => order.push("timeout"), 0)`, agende
  `Promise.resolve().then(() => order.push("microtask"))`, e resolva a
  Promise de retorno com um `setTimeout` cujo atraso seja maior que 0
  (ex.: 10ms) para garantir que tanto a microtask quanto o timeout já
  rodaram.
- `demoAsyncSyncPortion`: chame a função interna async sem `await`
  primeiro (`const p = inner()`), registre `"after-call"`, e só então
  `await p`.
- `timeoutOrder`: crie um array vazio, um `setTimeout` por item que
  empurra o índice original no callback, e uma Promise externa que
  resolve depois que o maior atraso + uma margem já passou (ou conte
  quantos já dispararam e resolva quando o contador bater com
  `delays.length`).
- `nextTickBeforeTimeout`: mesmo se `setTimeout(() => order.push("timeout"), 0)`
  for chamado primeiro no código, um `process.nextTick(() => order.push("next-tick"))`
  chamado logo depois ainda roda antes do timeout.
- `pollUntilReadyMessy`: um `while (true) { if (await checkFn()) return true; attempts++; if (attempts >= maxAttempts) throw ...; await delay(intervalMs); }`
  cobre o mesmo comportamento sem funções aninhadas.
- `processQueueWithConcurrencyLimit`: mantenha um "pool" de no máximo
  `limit` promises em execução; quando uma termina, inicie a próxima
  pendente. Um array de resultados pré-alocado (por índice) evita perder
  a ordem original.

## Nível 3 — quase o código, mas ainda não a solução

- `multipleMicrotasksBeforeTimeout` / `microtaskBeforeQueuedTimeout`: a
  ordem de agendamento no código determina a ordem dentro da mesma fila.
  Chamadas de `Promise.then` e `queueMicrotask` entram na **mesma** fila
  de microtasks — a ordem entre elas é a ordem em que você as chamou, não
  qual API você usou.
- `timeoutFallback`: `Promise.race([promise, delay(ms, fallbackValue)])`
  resolve/rejeita com o que "vencer" primeiro. Cuidado: se `promise`
  rejeitar antes do timeout, o `race` deve propagar essa rejeição — não
  precisa tratar isso manualmente, `Promise.race` já faz isso.
- `batchMicrotaskFlood`: um `for (let i = 0; i < count; i++) { Promise.resolve().then(() => order.push(\`micro-${i}\`)); }`
  antes de qualquer `setTimeout` já garante que todas rodem antes dele,
  mesmo que `count` seja grande — a fila de microtasks é drenada até
  ficar vazia antes do event loop seguir para a fase de timers.
- `pollUntilReadyMessy` (versão final): função `async`, laço `for` ou
  `while` com contador de tentativas, `await delay(intervalMs, null)`
  entre tentativas, `throw new Error(...)` ao esgotar `maxAttempts`.
- `processQueueWithConcurrencyLimit`: um padrão comum é criar um array de
  "workers ativos" com no máximo `limit` promises; cada worker, ao
  terminar seu item, pega o próximo índice pendente de uma fila
  compartilhada (um contador incremental funciona) até não sobrar mais
  nada; depois, `await Promise.all(activeWorkers)`.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
