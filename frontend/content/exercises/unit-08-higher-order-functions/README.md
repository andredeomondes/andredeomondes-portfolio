# Unidade 8 — Funções de alta ordem

Fase 1, Unidade 8. Cobre: funções como valores, funções recebidas como
argumento, funções retornadas por outras funções, composição de funções e
closures aplicadas a estado (contadores, memoização, execução única).

Por que isso importa para backend: middlewares (Express/Koa/NestJS
interceptors), estratégias de retry, validadores compostos, decorators e
pipelines de transformação de dados são, no fundo, funções de alta ordem.
Entender esse padrão bem é pré-requisito direto para `map`/`filter`/`reduce`
(próxima unidade) e para lidar com callbacks assíncronos mais adiante.

## Antes de começar

Responda por escrito:

1. O que significa dizer que, em JavaScript, "funções são cidadãs de
   primeira classe" (first-class citizens)?
2. Qual a diferença entre uma função que **recebe** outra função como
   argumento e uma função que **retorna** outra função?
3. Por que uma função retornada por outra ainda "lembra" das variáveis do
   escopo em que foi criada, mesmo depois que a função externa já
   terminou de executar?

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Não use `Array.prototype.map/filter/reduce` para resolver os
   exercícios desta unidade — isso é assunto da Unidade 9. Aqui o foco é
   escrever suas próprias funções de alta ordem com laços e closures.

## Exercícios fundamentais (8)

1. **`applyOperation(a, b, operation)`** — recebe dois números e uma
   função `operation(a, b)`, e retorna o resultado de chamar
   `operation(a, b)`.
2. **`makeAdder(x)`** — retorna uma função `(y) => x + y`. Essa é uma
   fábrica de funções: cada chamada de `makeAdder` cria uma nova função
   com seu próprio `x` fixado.
3. **`makeMultiplier(factor)`** — retorna uma função `(n) => n * factor`.
4. **`invertPredicate(predicate)`** — recebe uma função que retorna
   `true`/`false` e retorna uma nova função que inverte esse resultado
   (aceita quaisquer argumentos e repassa para `predicate`).
5. **`repeatCall(n, fn)`** — chama `fn(i)` para `i` de `0` até `n - 1` e
   retorna um array com os resultados, na ordem.
6. **`pipeTwo(f, g)`** — retorna uma função `(x) => g(f(x))`: aplica `f`
   primeiro, depois `g`, na mesma ordem em que os parâmetros foram
   escritos (ordem "pipeline", da esquerda para a direita).
7. **`composeTwo(f, g)`** — retorna uma função `(x) => f(g(x))`: aplica
   `g` primeiro, depois `f` (ordem matemática de composição, de dentro
   para fora).
8. **`once(fn)`** — retorna uma função que executa `fn` apenas na
   primeira chamada, guarda o resultado e devolve o mesmo resultado
   guardado em qualquer chamada seguinte, sem executar `fn` de novo.

## Exercícios intermediários (4)

9. **`makeCounter(start = 0)`** — retorna um objeto
   `{ increment(), decrement(), value() }`. `increment()` aumenta o
   contador em 1 e retorna o novo valor; `decrement()` diminui em 1 e
   retorna o novo valor; `value()` apenas lê o valor atual sem alterá-lo.
   O estado (`count`) deve viver numa variável capturada por closure —
   não em uma propriedade do objeto retornado.
10. **`curry3(fn)`** — recebe uma função `fn(a, b, c)` de três parâmetros
    e retorna sua versão "curried": `a => b => c => fn(a, b, c)`.
11. **`memoize(fn)`** — recebe uma função de um único argumento e retorna
    uma versão que guarda em cache (`Map`) o resultado por argumento. Se
    a função memoizada for chamada de novo com o mesmo argumento, `fn`
    não deve ser executada de novo — o valor guardado é devolvido
    direto.
12. **`pipeAll(...fns)`** — versão variádica de `pipeTwo`: recebe
    qualquer quantidade de funções e retorna uma função que aplica todas
    elas em sequência, da esquerda para a direita. Sem argumentos,
    retorna a função identidade (`x => x`). Implemente com um laço
    (`for...of` sobre `fns`), não com `reduce` — isso é assunto da
    próxima unidade.

## Debugging (2)

13. **`fixOnceBug(fn)`** — a implementação atual guarda `result`, mas
    nunca marca `called` como verdadeiro, então `fn` é executada em
    todas as chamadas. Corrija sem mudar a assinatura.
14. **`fixCounterClosureBug()`** — a função `increment` interna declara
    `let count` de novo, criando uma variável nova que sombreia
    (*shadowing*) o `count` externo em vez de atualizá-lo. Corrija para
    que `increment` de fato incremente e lembre o `count` do escopo
    externo entre chamadas.

## Refatoração (1)

15. **`refactorMessyPipeline(value)`** — a implementação atual funciona,
    mas repete a mesma lógica de "somar 1, depois dobrar" três vezes com
    variáveis intermediárias (`step1`...`step5`). Refatore usando
    `pipeTwo`/`pipeAll` (ou funções auxiliares nomeadas) para deixar a
    sequência de transformações explícita, mantendo o mesmo resultado.

## Desafio integrador (1)

16. **`buildValidationPipeline(rules)`** — `rules` é um array de objetos
    `{ test: (value) => boolean, message: string }`. Retorne uma função
    `validate(value)` que roda `value` contra cada regra e retorna um
    array com as `message` de todas as regras cujo `test(value)` foi
    `false`, na ordem em que aparecem em `rules`. Sem falhas, o array
    retornado é vazio. Este exercício combina funções de alta ordem
    (função que retorna função, função recebida como argumento) com
    array/objeto (Unidade 7) e controle de fluxo (Unidade 2).

## Critérios de aceitação

- `npm test` sem falhas.
- Nenhuma solução usa `map`/`filter`/`reduce` nativos.
- Você consegue explicar, sem consultar o código, por que `makeCounter`
  precisa de uma variável fora das funções internas para manter estado
  entre chamadas.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
