# Dicas — Unidade 18

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `delayCallback`: qual função nativa do JS executa algo depois de um
  tempo, sem bloquear o resto do programa?
- Para `mapSeriesCallback`: se você chamar `asyncFn` para todos os itens
  de uma vez dentro de um `for`, isso é série ou paralelo? O que precisa
  acontecer para a próxima chamada só começar depois da anterior
  terminar?
- Para `parallelCallback`: como você sabe quando **todas** as tarefas
  terminaram, se elas podem terminar em qualquer ordem? Que tipo de
  contador ajuda aqui?
- Para `waterfallCallback`: cada tarefa (exceto a primeira) recebe um
  parâmetro a mais que as de `parallelCallback`. Qual é?
- Para `retryCallback`: o que muda entre "a tarefa falhou e ainda tenho
  tentativas sobrando" e "a tarefa falhou e essa era a última tentativa"?
- Para `cacheCallback`: o que você precisa guardar entre uma chamada e
  outra da função retornada? Uma variável dentro da função não sobrevive
  entre chamadas — o que sobrevive?
- Para `fixDoubleCallbackBug`: depois de chamar `callback(erro)` no bloco
  `if`, o que impede o resto da função de continuar executando?

## Nível 2 — pista mais direta

- `delayCallback`: `setTimeout(() => callback(null, value), ms)`.
- `mapSeriesCallback`: defina uma função interna `processIndex(i)` que
  chama `asyncFn(items[i], (err, result) => { ...; if (i + 1 < items.length) processIndex(i + 1); else callback(...) })`.
- `parallelCallback`: mantenha `results = new Array(tasks.length)` e um
  contador `completed`; cada `task(cb)` grava seu resultado no índice
  certo (`results[i] = result`) e incrementa `completed`; quando
  `completed === tasks.length`, chame o `callback` final. Guarde uma
  flag `hasFailed` para não chamar o `callback` de erro mais de uma vez.
- `waterfallCallback`: comece chamando `tasks[0]`, cujo resultado vira o
  primeiro argumento de `tasks[1]`, e assim por diante.
- `retryCallback`: `tentativa = 0; function attempt() { tentativa++; taskFn((err, result) => { if (!err) return callback(null, result); if (tentativa >= attempts) return callback(err); attempt(); }); }`.
- `timeoutCallback`: dispare um `setTimeout` que chama `callback(new Error("timeout"))`;
  guarde uma flag `settled` para garantir que só um dos dois (timeout ou
  `taskFn`) realmente chame o `callback` final.
- `cacheCallback`: um objeto `{}` (ou `Map`) declarado **fora** da função
  retornada, no escopo de `cacheCallback` — isso é uma closure guardando
  estado entre chamadas.
- `fixDoubleCallbackBug`: adicione `return` logo depois de
  `callback(new Error(...))`.
- `fixSwallowedErrorCallback`: troque `callback(null, user)` por uma
  checagem: se `user` for `undefined`, `callback(new Error(...))`; senão,
  `callback(null, user)`.

## Nível 3 — quase o código, mas ainda não a solução

- `seriesUntilCallback`: é uma variação de `mapSeriesCallback`, mas em vez
  de acumular todos os resultados, você para e retorna assim que
  `predicateAsyncFn` disser `true` para um item.
- `composeUserOrdersCallback`: `fetchUserCb(userId, (err, user) => { if (err) return callback(err); fetchOrdersCb(user.id, (err2, orders) => { if (err2) return callback(err2); callback(null, { user, orders }); }); });`
- `refactorCallbackPyramid`: extraia uma função nomeada por etapa
  (`onUser`, `onOrders`, `onItems`), cada uma recebendo `(err, resultado)`
  e decidindo se chama `callback(err)` ou segue para a próxima etapa —
  isso já é essencialmente o padrão "waterfall" que você implementou no
  exercício 7.
- `processOrdersCallback`: para cada pedido, chame `validateCb`; se
  `isValid` for `false`, empurre `order.id` em `invalid` e siga (não
  chame `saveCb`); se for `true`, chame `saveCb` e empurre o resultado em
  `saved`, somando `amount` em `totalRevenue`. Use a mesma estrutura de
  processamento em série de `mapSeriesCallback`.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
