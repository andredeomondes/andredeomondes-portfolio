# Unidade 12 — Tratamento de erros

Fase 1, Unidade 12. Cobre: `try`/`catch`/`finally`, `throw`, erros
customizados (`class X extends Error`), propagação de erros (relançar
com contexto, `Error` com `{ cause }`) e estratégias comuns como retry e
fallback.

Por que isso importa para backend: uma API que engole erros
silenciosamente é uma API que falha em produção sem ninguém saber por
quê. Saber quando capturar um erro, quando deixá-lo propagar, quando
envolvê-lo com mais contexto e quando criar um tipo de erro próprio
(`ValidationError`, `NotFoundError`) é uma das habilidades que mais
separa código júnior de código pleno.

## Antes de começar

Responda por escrito:

1. Um bloco `catch` vazio (`catch (error) {}`) "resolve" o erro? O que
   acontece com a informação de que algo deu errado?
2. Se um `finally` tiver um `return`, o que acontece com um erro que
   tenha sido lançado dentro do `try` correspondente?
3. Qual a diferença entre criar `new Error("mensagem")` e criar
   `class ValidationError extends Error { ... }`? Quando vale a pena ter
   um tipo de erro próprio?

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — a pergunta 2 é uma pegadinha real da linguagem.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging, e a classe `ValidationError`, que
   já vem pronta). Isso é esperado.
5. Nunca deixe um `catch` vazio nos seus próprios exercícios — ou você
   relança o erro, ou você o transforma em outro valor de forma
   explícita (como em `tryParseJson`).

## Exercícios fundamentais (8)

1. **`divideOrThrow(a, b)`** — retorna `a / b`. Se `b` for `0`, lança
   `new Error("divisão por zero")` (ou mensagem equivalente que
   mencione "divis").
2. **`parseIntStrict(str)`** — converte `str` para número inteiro. Se
   `str` não representar um inteiro válido (contém letras, é vazia, é
   decimal como `"3.14"`), lança um erro em vez de retornar `NaN`.
3. **`tryParseJson(str)`** — tenta fazer `JSON.parse(str)` dentro de
   `try/catch`. Em caso de sucesso, retorna `{ ok: true, data }`. Em
   caso de erro, retorna `{ ok: false, error: mensagemDoErro }` (sem
   lançar nada para fora).
4. **`validateAge(age)`** — retorna `age` se estiver entre `0` e `150`
   (inclusive). Fora disso, lança `RangeError`.
5. **`runWithFinally(fn, cleanup)`** — executa `fn()` e retorna seu
   resultado. Independente de `fn` funcionar ou lançar erro, `cleanup()`
   deve ser chamada (use `finally`). Se `fn` lançar, o erro deve
   continuar se propagando normalmente depois do `cleanup`.
6. **`ValidationError`** — já vem implementada: uma subclasse de `Error`
   com `name = "ValidationError"`. Use-a nos próximos exercícios.
7. **`validateNonEmpty(str)`** — retorna `str` se ela não for vazia nem
   só espaços em branco. Caso contrário, lança `new ValidationError(...)`.
8. **`catchAndRewrap(fn, context)`** — executa `fn()`. Se `fn` lançar,
   captura o erro e lança um novo `Error` com mensagem
   `"<context>: <mensagem original>"`.

## Exercícios intermediários (4)

9. **`firstSuccessful(fns)`** — recebe um array de funções sem
   argumentos. Tenta cada uma em ordem; retorna o resultado da primeira
   que não lançar erro. Se todas lançarem, lança um novo erro
   resumindo a falha (pode incluir a mensagem da última tentativa).
10. **`retryOperation(fn, attempts)`** — chama `fn()` até `attempts`
    vezes. Retorna o resultado assim que uma chamada tiver sucesso. Se
    todas as tentativas falharem, lança o erro da **última** tentativa.
11. **`validateUserPayload(payload)`** — valida um objeto
    `{ name, email, age }`: `name` não pode ser vazio, `email` precisa
    conter `"@"`, `age` precisa ser número não-negativo. Colete
    **todas** as mensagens de erro encontradas (não pare na primeira) e,
    se houver alguma, lance um único `ValidationError` juntando as
    mensagens. Se tudo for válido, retorne o `payload`.
12. **`safeJsonParseWithDefault(str, defaultValue)`** — como
    `tryParseJson`, mas em vez de retornar um objeto `{ ok, ... }`,
    retorna diretamente os dados parseados ou `defaultValue` se o parse
    falhar.

## Debugging (2)

13. **`fixSwallowedErrorBug(str)`** — o `catch` está vazio, então
    qualquer erro de `JSON.parse` desaparece silenciosamente. Corrija
    para que o erro seja relançado (`throw error;`) em vez de engolido.
14. **`fixFinallyReturnBug(riskyFn)`** — o `finally` tem um `return
    "cleanup done";`, o que sobrescreve qualquer valor de retorno ou
    erro do `try`/`catch` correspondente. Corrija removendo o `return`
    do `finally`, mantendo a limpeza (se houvesse alguma ação real ali)
    sem interferir no fluxo de retorno/erro.

## Refatoração (1)

15. **`refactorNestedTryCatch(str)`** — a implementação atual tem três
    níveis de `try/catch` aninhados, cada um envolvendo a mensagem de
    erro do nível anterior. Refatore para um único `try/catch` (ou
    validações com `if`/`throw` antes de um `try` só para o parse),
    **mantendo exatamente as mesmas mensagens de erro observáveis** —
    incluindo o efeito colateral estranho de mensagens duplicadas que o
    aninhamento original produz para o caso de valor negativo. Ao
    terminar, você vai entender na prática por que aninhar
    `try/catch` demais é perigoso: erros relançados dentro de outro
    `try` podem ser recapturados sem querer pelo `catch` mais externo do
    mesmo bloco.

## Desafio integrador (1)

16. **`processOrdersWithErrorReport(orders, processFn)`** — percorre
    `orders`, chamando `processFn(order)` para cada um dentro de um
    `try/catch` individual (para que uma falha não interrompa o
    processamento dos demais). Retorne:

    ```js
    {
      successes: [{ order, result }, ...],
      failures: [{ order, error: mensagemDoErro }, ...],
    }
    ```

    Este exercício combina tratamento de erro por item com iteração
    (Unidade 2/9) e HOF (`processFn` é recebida como argumento —
    Unidade 8).

## Critérios de aceitação

- `npm test` sem falhas.
- Nenhum `catch` vazio nas suas próprias implementações.
- `ValidationError` é usada (não `Error` genérico) sempre que o
  enunciado pedir "erro de validação".
- Você consegue explicar, sem consultar o código, por que um `return`
  dentro de `finally` é perigoso.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
