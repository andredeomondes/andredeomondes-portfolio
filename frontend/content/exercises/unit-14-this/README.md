# Unidade 14 — `this`

Fase 1, Unidade 14. Cobre: binding implícito (`obj.metodo()`), binding
explícito (`call`, `apply`, `bind`), arrow functions e `this` léxico, o
que acontece quando um método é extraído do objeto e chamado "solto", e
por que isso é uma fonte constante de bugs sutis em callbacks.

## Antes de começar

Responda por escrito (pode ser neste README, numa cópia local, ou em
`notes/concepts/` se quiser guardar):

1. O valor de `this` dentro de uma função é decidido quando a função é
   **definida** ou quando ela é **chamada**? E numa arrow function?
2. Se você faz `const fn = obj.metodo; fn();`, `this` dentro de `fn`
   ainda aponta para `obj`? Por quê?
3. Qual a diferença entre `fn.call(thisArg, a, b)` e
   `fn.apply(thisArg, [a, b])`?

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.js`. O primeiro exercício (`whatIsThisUnbound`) já vem
   resolvido como exemplo de estilo — leia com atenção antes de seguir.
2. Os demais exercícios têm `throw new Error("not implemented: <nome>")`.
3. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-14-this/exercises.test.js
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging, e o primeiro exercício, que já
   está implementado). Isso é esperado.
5. Não use bibliotecas externas.

## Exercícios fundamentais (8)

1. **`whatIsThisUnbound()`** — retorna `true` se `this` dentro dessa
   função, chamada sem nenhum objeto na frente, é `undefined`. **Já
   implementado como exemplo** (módulos ES rodam em modo estrito, então
   `this` de uma função "solta" não vira `globalThis` como no script
   clássico).
2. **`createPerson(name)`** — retorna um objeto
   `{ name, greet() { ... } }` cujo `greet()` retorna
   `"Oi, eu sou <name>"` usando `this.name` (binding implícito: o valor
   de `this` vem de "quem está à esquerda do ponto" na hora da chamada).
3. **`extractAndCallLoosely(obj, methodName)`** — extrai
   `obj[methodName]` para uma variável separada e chama essa variável
   **sem** receptor (sem `obj.` na frente). Capture o erro que isso
   provoca (`try/catch`) e retorne a string
   `` `Erro: ${err.message}` ``. Este exercício existe para você ver, na
   prática, o binding implícito se perdendo.
4. **`bindMethodToObject(obj, methodName)`** — retorna
   `obj[methodName]` já "preso" a `obj` via `.bind(obj)`, de forma que a
   função resultante funcione corretamente mesmo chamada solta.
5. **`sumWithCall(fn, thisArg, a, b)`** — chama `fn` com `this` igual a
   `thisArg` e argumentos `a, b`, usando `Function.prototype.call`.
6. **`sumWithApply(fn, thisArg, argsArray)`** — mesma ideia do anterior,
   mas usando `Function.prototype.apply`, que recebe os argumentos como
   um array.
7. **`createArrowCounter()`** — retorna um objeto
   `{ count: 0, incrementLater() { ... } }` em que `incrementLater` é um
   método normal que, internamente, define e chama uma **arrow
   function** que faz `this.count++`. A arrow function não tem seu
   próprio `this` — ela usa o `this` do escopo onde foi definida (o
   método `incrementLater`).
8. **`bindAllMethods(obj)`** — recebe um objeto qualquer e retorna um
   **novo objeto** com as mesmas chaves, mas onde todo valor que é
   função vem pré-ligado (`.bind(obj)`) ao objeto original. Isso
   significa que, mesmo extraindo um método do objeto retornado e
   chamando solto, ele continua enxergando o `this` correto.

## Exercícios intermediários (4)

9. **`createChainableCalculator(initial = 0)`** — retorna um objeto com
   `value` inicial, e métodos `add(n)` e `subtract(n)` que alteram
   `this.value` e **retornam `this`** (permitindo encadear chamadas), e
   `result()` que retorna o valor atual.
10. **`partialWithBind(fn, ...presetArgs)`** — retorna uma nova função
    que, quando chamada com argumentos adicionais, chama `fn` com
    `presetArgs` seguidos dos novos argumentos. Use `fn.bind(null, ...)`
    — o primeiro argumento de `bind` também define `this`, mas aqui você
    não precisa dele, então pode passar `null`.
11. **`borrowArrayMethod(arrayLike)`** — recebe um objeto "parecido com
    array" (tem `length` e índices numéricos, mas não é um `Array` de
    verdade) e retorna um array real, "emprestando" um método de
    `Array.prototype` (como `slice`) via `.call()` ou `.apply()` sobre o
    `arrayLike`.
12. **`createEventBus()`** — retorna um objeto com `on(event, handler)`
    e `emit(event, ...args)`. Ao emitir, cada handler deve ser chamado
    com `this` apontando para o **próprio bus** (use `.call()` ou
    `.apply()` explicitamente ao invocar o handler).

## Debugging (2)

13. **`sumArrayWithContext(obj)`** — recebe `{ total, numbers }` e deveria
    somar todos os `numbers` em `obj.total`, mas o `forEach` atual perde
    o `this` dentro do callback (função comum, sem `thisArg` passado
    para `forEach` e sem capturar `obj` de outra forma). Corrija sem
    mudar a assinatura.
14. **`BuggyCounter`** — a classe já está implementada, mas
    `getIncrementFunction()` retorna o método `increment` sem preservar
    o `this`, então usá-lo separado do objeto quebra. Corrija.

## Refatoração (1)

15. **`Widget`** — o construtor já funciona corretamente, ligando cada
    método a `this` manualmente, uma linha por método
    (`this.metodo = this.metodo.bind(this)`), o que fica repetitivo à
    medida que a classe cresce. Refatore para eliminar a repetição
    (por exemplo, percorrendo os métodos do protótipo em um laço),
    mantendo o mesmo comportamento observável: todo método continua
    funcionando corretamente quando extraído e chamado solto.

## Desafio integrador (1)

16. **`createRateLimiter(limit)`** — combina `this`, closures e binding.
    Retorna um objeto com:
    - `attempt()` — retorna `true` e conta uma tentativa se ainda não
      atingiu `limit`; retorna `false` caso contrário;
    - `reset()` — zera o contador de tentativas, e **deve continuar
      funcionando mesmo se extraído do objeto** (`const r = limiter.reset; r();`).

## Critérios de aceitação

- Os testes da unidade passam sem falhas.
- Você consegue explicar, sem consultar o código, por que
  `const fn = obj.metodo; fn();` frequentemente quebra código que
  funcionava como `obj.metodo()`.
- Você sabe escolher entre `call`, `apply`, `bind` e arrow function para
  resolver um problema de `this` perdido, e justificar a escolha.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
