# Unidade 21 — Promise.all, allSettled, race e any

Fase 1, Unidade 21. Cobre os quatro "combinadores" nativos de Promises:
`Promise.all`, `Promise.allSettled`, `Promise.race` e `Promise.any`. Cada
um responde a uma pergunta diferente sobre "o que fazer com várias
Promises ao mesmo tempo".

| Combinador | Pergunta que responde | Comportamento se uma falhar |
| --- | --- | --- |
| `Promise.all` | "quero todos os resultados, na ordem" | rejeita **tudo** no primeiro erro (fail-fast) |
| `Promise.allSettled` | "quero saber o que aconteceu com cada uma" | nunca rejeita; reporta status por item |
| `Promise.race` | "quero a primeira que terminar (sucesso ou erro)" | resolve/rejeita com a primeira que **settle** |
| `Promise.any` | "quero o primeiro sucesso" | só rejeita (com `AggregateError`) se **todas** falharem |

## Antes de começar

Responda por escrito:

1. Se você tem 3 Promises e uma delas rejeita, `Promise.all` deixa você
   ver os resultados das outras duas? E `Promise.allSettled`?
2. Qual a diferença entre `Promise.race` e `Promise.any`?
3. O que é um `AggregateError`, e quando ele aparece?

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez, usando o combinador certo para o que o
   enunciado pede — a escolha do combinador **é** o exercício.
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Alguns testes desta unidade checam **tempo decorrido** (para provar
   que chamadas independentes rodam em paralelo, não em série). Se um
   teste de timing falhar por poucos milissegundos em uma máquina lenta,
   isso não é um bug de lógica — é sensibilidade do ambiente. O importante
   é entender por que paralelo é mais rápido que série.

## Exercícios fundamentais (8)

1. **`fetchAllUsersAll(ids, fetchUserAsyncFn)`** — usa `Promise.all` para
   buscar todos os usuários de `ids` em paralelo. Se qualquer busca
   falhar, a função inteira rejeita.
2. **`fetchAllUsersSettled(ids, fetchUserAsyncFn)`** — mesma ideia, mas
   usa `Promise.allSettled` e retorna o array de resultados no formato
   nativo (`{ status: "fulfilled", value }` ou `{ status: "rejected", reason }`),
   sem nunca rejeitar.
3. **`firstToRespond(promises)`** — usa `Promise.race` para resolver ou
   rejeitar com o que "chegar" primeiro, seja sucesso ou erro.
4. **`firstSuccessful(promises)`** — usa `Promise.any` para resolver com
   o primeiro **sucesso**, ignorando rejeições que cheguem antes.
5. **`summarizeSettled(results)`** — função **síncrona** (sem `await`).
   Recebe um array no formato de `Promise.allSettled` e retorna
   `{ fulfilled: [...valores], rejected: [...mensagens de erro] }`.
6. **`allWithIndex(promises)`** — usa `Promise.all`, mas retorna um array
   de `{ index, value }`, preservando de qual posição original cada valor
   veio.
7. **`raceWithTimeout(promise, ms)`** — usa `Promise.race` entre
   `promise` e uma Promise de timeout que rejeita com
   `Error("timeout")` depois de `ms`.
8. **`anyWithFallback(promises, fallbackValue)`** — usa `Promise.any`;
   se todas as promises falharem (capturando o `AggregateError`), retorna
   `fallbackValue` em vez de propagar o erro.

## Exercícios intermediários (4)

9. **`batchProcessAll(items, asyncFn, batchSize)`** — divide `items` em
   lotes de tamanho `batchSize`; processa **um lote de cada vez**
   (em série entre lotes), mas dentro de cada lote usa `Promise.all` para
   rodar as chamadas em paralelo. Retorna todos os resultados numa lista
   só, na ordem original.
10. **`allSettledPartitionErrors(promises)`** — usa `Promise.allSettled`
    e retorna
    `{ values: [...], errors: [...mensagens], successCount, failureCount }`.
11. **`raceMultipleSources(sources, fetchFn)`** — `sources` é uma lista de
    identificadores (ex.: `["cache", "banco", "api"]`). Para cada um,
    chame `fetchFn(source)` (retorna uma Promise) e use `Promise.race`
    para descobrir **qual fonte respondeu primeiro** e com **qual
    valor**, retornando `{ source, value }`.
12. **`anyOfValidations(validators, value)`** — `validators` é uma lista
    de funções `async (value) => boolean`. Retorna `true` assim que
    **algum** validador resolver com `true` (mesmo que outros ainda
    estejam rodando ou já tenham resolvido `false`); retorna `false` se
    nenhum aprovar. Dica: `Promise.any` só olha para fulfilled/rejected,
    não para o valor — você precisa transformar um resultado `false` em
    rejeição para que `Promise.any` o ignore.

## Debugging (2)

13. **`fixPromiseAllFailFastBug(ids, fetchUserAsyncFn)`** — o objetivo é
    reportar o resultado de cada busca (sucesso ou falha) sem perder os
    sucessos quando uma busca falha. A implementação atual usa
    `Promise.all`, que rejeita a operação inteira no primeiro erro.
    Troque pelo combinador certo para essa pergunta.
14. **`fixRaceWinnerIndexBug(sources)`** — a função deveria informar o
    índice de qual `source` venceu a corrida, mas guarda o índice numa
    variável externa compartilhada que é sobrescrita a cada iteração do
    `.map` (que roda de forma síncrona) — no fim, o índice guardado é
    sempre o do último item do array, não o do vencedor real. Corrija
    associando o índice a cada Promise individualmente, não a uma
    variável compartilhada.

## Refatoração (1)

15. **`refactorSequentialToParallelAll(items, asyncFn)`** — a
    implementação atual funciona, mas processa os itens **em série**
    (`for...of` com `await` dentro do laço), mesmo as chamadas sendo
    independentes entre si. Refatore para usar `Promise.all` e ganhar
    paralelismo, mantendo o mesmo resultado e a mesma ordem.

## Desafio integrador (1)

16. **`loadDashboardData(userId, api)`** — `api` tem quatro métodos que
    retornam Promise: `fetchUser(id)`, `fetchOrders(id)`,
    `fetchNotifications(id)`, `fetchRecommendations(id)`. `fetchUser` é
    **essencial**: se falhar, deixe o erro propagar (não capture).
    As outras três são **não essenciais**: busque as três em paralelo com
    `Promise.allSettled`; para cada uma que falhar, guarde `null` no
    campo correspondente e registre a falha em `errors`. Retorne:

    ```js
    {
      user: {...},
      orders: [...] | null,
      notifications: [...] | null,
      recommendations: [...] | null,
      errors: [{ section: "notifications", message: "..." }, ...],
    }
    ```

    Este exercício combina `await` (Unidade 20), `Promise.allSettled`
    (desta unidade) e construção de objeto de resumo (Unidades 2 e 7).

## Critérios de aceitação

- `npm test` sem falhas.
- Cada exercício usa o combinador indicado no enunciado — não vale
  simular `Promise.all` com um `for` e `await` quando o exercício pede
  paralelismo de verdade.
- Você consegue explicar, sem consultar o código, quando usar `race` e
  quando usar `any` — eles parecem parecidos, mas respondem perguntas
  diferentes.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
