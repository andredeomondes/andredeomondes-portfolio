# Unidade 22 — Erros assíncronos

Fase 1, Unidade 22. Cobre: propagação de erros em Promises/`async`/`await`,
rejeições não tratadas (unhandled rejections), `try/catch/finally` em
código assíncrono, erros customizados, retry condicional, e como não
mascarar (nem perder) uma falha em código assíncrono.

## Por que isso importa para backend

Um erro assíncrono que não é tratado corretamente não aparece como um
crash óbvio na hora — ele aparece como um "unhandled rejection" no log
(ou, dependendo da configuração do Node, derruba o processo inteiro), ou
pior: é silenciosamente engolido e o sistema segue operando com dado
incompleto, achando que deu tudo certo. Saber propagar, capturar,
recuperar e relatar erros assíncronos com precisão é a diferença entre um
serviço que falha alto e rápido (fácil de depurar) e um que falha baixo e
tarde (difícil de rastrear).

## Antes de começar

Responda por escrito antes de abrir qualquer documentação:

1. O que acontece quando uma `async function` lança (`throw`) um erro?
   Isso vira uma exceção normal ou uma Promise rejeitada?
2. Dentro de um `try/catch` que envolve um `await`, o `catch` roda quando
   a Promise **rejeita**, ou também quando ela demora muito?
3. O que é uma "unhandled rejection"? Dê um exemplo de código que causa
   uma sem querer.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-22-async-errors/exercises.test.js
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Todas as funções desta unidade são `async function` (exceto onde o
   enunciado diz o contrário — ex.: `isRetryableError` é síncrona). Use
   `await` dentro delas; não misture `.then()`/`.catch()` com `async` sem
   necessidade.
6. Nunca capture um erro só para descartá-lo silenciosamente. Se o
   enunciado pede para "reportar" ou "recuperar" de um erro, o chamador
   sempre precisa conseguir saber que algo deu errado.

## Exercícios fundamentais (8)

1. **`propagateRejection(promise)`** — `await` a `promise`; se ela
   resolver, retorne o valor. Se ela rejeitar, capture o erro e relance
   um novo `Error` cuja mensagem **inclua** a mensagem original (erro
   "enriquecido" com mais contexto), sem perder a informação original.
2. **`catchAndRecover(promise, fallbackValue)`** — `await` a `promise`;
   se rejeitar, retorne `fallbackValue` em vez de propagar o erro.
3. **`class ValidationError extends Error`** — classe de erro customizada.
   O construtor recebe `message`, chama `super(message)`, e define
   `this.name = "ValidationError"`.
4. **`validateAgeAsync(age)`** — função `async` que resolve com `age` se
   `age` estiver entre `0` e `130` (inclusive), ou rejeita com
   `new ValidationError(...)` com mensagem legível caso contrário.
5. **`wrapAsyncErrors(asyncFn)`** — recebe uma função assíncrona e
   retorna uma nova função assíncrona que **nunca rejeita**: em vez
   disso, resolve com `{ ok: true, value }` em caso de sucesso, ou
   `{ ok: false, error: err.message, type: err.constructor.name }` em
   caso de erro (capturando o nome da classe do erro, ex.:
   `"ValidationError"`, `"Error"`, `"TypeError"`).
6. **`asyncErrorChain(steps, input)`** — `steps` é um array de funções
   `async (valor) => novoValor`. Execute-as em sequência, passando o
   resultado de uma para a próxima. Se todas passarem, retorne
   `{ ok: true, value: resultadoFinal }`. Se alguma etapa falhar, pare
   imediatamente e retorne `{ ok: false, step: índiceDaEtapa, error: err.message }`.
7. **`isRetryableError(error)`** — função **síncrona**. Retorna `true` se
   `error.retryable === true`, `false` caso contrário (inclusive quando a
   propriedade não existe).
8. **`retryOnRetryableError(taskFn, attempts)`** — chama `taskFn()`
   (uma função `async` sem argumentos). Se ela rejeitar com um erro
   **retryable** (`isRetryableError(err)` verdadeiro), tenta de novo, até
   no máximo `attempts` tentativas no total. Se rejeitar com um erro
   **não retryable**, desiste imediatamente e propaga o erro (sem gastar
   as tentativas restantes). Se todas as tentativas se esgotarem, propaga
   o último erro.

## Exercícios intermediários (4)

9. **`asyncFinallyAlwaysRuns(asyncFn, cleanupFn)`** — chama `asyncFn()`.
   Independente de sucesso ou falha, `cleanupFn()` deve rodar (`await`
   nela também, já que ela é `async`) antes da função retornar ou
   propagar o erro. Em caso de sucesso, retorne o valor de `asyncFn()`.
   Em caso de falha, propague o erro original depois do cleanup.
10. **`errorBoundaryAsync(asyncFn, onError)`** — chama `asyncFn()`. Se
    resolver, retorna o valor. Se rejeitar, chama `onError(err)`
    (**síncrona**) e retorna o valor que `onError` devolver, em vez de
    propagar o erro.
11. **`validateThenSaveAsync(input, validateAsyncFn, saveAsyncFn)`** —
    chama `validateAsyncFn(input)`; se rejeitar, retorne
    `{ ok: false, stage: "validate", error: err.message }` sem chamar
    `saveAsyncFn`. Se validar com sucesso, chame
    `saveAsyncFn(resultadoValidado)`; se rejeitar, retorne
    `{ ok: false, stage: "save", error: err.message }`. Se tudo der
    certo, retorne `{ ok: true, value: resultadoSalvo }`.
12. **`safeAsyncMap(items, asyncFn)`** — aplica `asyncFn` a cada item de
    `items`, mas **sem parar no primeiro erro**: retorna um array na
    mesma ordem com `{ item, ok: true, value }` para sucessos e
    `{ item, ok: false, error: err.message }` para falhas.

## Debugging (2)

13. **`fixUnhandledRejectionBug(items, riskyAsyncFn)`** — o objetivo é
    esperar todas as chamadas assíncronas terminarem e retornar os
    resultados na ordem, propagando qualquer erro real (não deixando-o
    "solto"). A implementação atual usa `.forEach` com uma callback
    `async`, que dispara as Promises mas nunca é aguardada — os erros
    ficam sem tratamento (unhandled rejection) e a função retorna antes
    de as chamadas terminarem. Corrija para aguardar corretamente.
14. **`fixErrorSwallowedInAsyncCatch(promise)`** — deveria retornar
    `{ ok: true, value }` em sucesso e `{ ok: false, error: mensagem }`
    em falha. A implementação atual sempre retorna `{ ok: true, value: undefined }`,
    mesmo quando `promise` rejeita — o `catch` está mascarando o erro em
    vez de reportá-lo. Corrija sem mudar a assinatura.

## Refatoração (1)

15. **`refactorErrorHandlingDuplication(steps)`** — já funciona: executa
    `steps[0]`, `steps[1]` e `steps[2]` (sempre exatamente três etapas),
    cada uma dentro do seu próprio `try/catch`, e monta um relatório por
    etapa. A implementação atual repete o mesmo bloco `try/catch` três
    vezes. Refatore para eliminar a duplicação (ex.: um laço sobre
    `steps`), mantendo exatamente o mesmo formato de relatório de saída.

## Desafio integrador (1)

16. **`runPipelineWithErrorReport(orders, steps)`** — `orders` é uma
    lista de pedidos; `steps` é uma lista de funções `async (pedido) => novoPedido`
    aplicadas em sequência a cada pedido (como em `asyncErrorChain`, mas
    para vários pedidos). Processe **todos** os pedidos, mesmo que algum
    falhe em alguma etapa, e retorne:

    ```js
    {
      succeeded: [...pedidosProcessadosComSucesso],
      failed: [{ id: pedido.id, step: índiceDaEtapaQueFalhou, error: mensagem }, ...],
    }
    ```

    Este exercício combina `try/catch` assíncrono, encadeamento de etapas
    (como `asyncErrorChain`) e agregação de resultados sem parar no
    primeiro erro (como `safeAsyncMap`) — os principais temas desta
    unidade, aplicados juntos.

## Critérios de aceitação

- `node --test exercises/01-javascript-core/unit-22-async-errors/exercises.test.js`
  sem falhas.
- Nenhuma função dispara uma Promise assíncrona sem aguardá-la ou
  encadear um tratamento de erro (nada de `.forEach(async ...)` sem
  `await`, nada de "fire and forget" onde o enunciado pede para esperar).
- Nenhum `catch` devolve sucesso disfarçado — todo erro capturado é
  reportado, transformado, ou reaplicado; nunca simplesmente descartado.
- Você consegue explicar, sem consultar o código, o que é uma unhandled
  rejection e por que `items.forEach(async (item) => { await ... })` é um
  padrão perigoso.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
