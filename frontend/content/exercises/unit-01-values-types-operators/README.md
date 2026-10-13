# Unidade 1 — Valores, tipos e operadores

Fase 1, Unidade 1. Cobre: valores, tipos, operadores, coerção,
truthy/falsy e igualdade estrita.

## Antes de começar

Responda por escrito (pode ser neste README, numa cópia local, ou em
`notes/concepts/` se quiser guardar):

1. O que você acha que `typeof null` retorna? Por quê?
      R = Retorna um tipo object devido aos bugs iniciais do JavaScript e por 
2. `"5" + 3` e `"5" - 3` retornam a mesma coisa?
      R = Um concatena e o outro não
3. `NaN === NaN` é `true` ou `false`? Por quê?
      R = False porque NaN representa um valor indefinido

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando. Isso é esperado — vá fazendo passar
   um de cada vez.
5. Não use bibliotecas externas. Use apenas JavaScript padrão.
6. Não use `any`/TypeScript aqui — esta unidade ainda é JavaScript puro.

## Exercícios fundamentais (8)

1. **`classifyValue(value)`** — retorna uma string descrevendo o tipo real
   do valor: `"null"`, `"undefined"`, `"nan"`, `"number"`, `"string"`,
   `"boolean"`, `"array"`, `"function"`, `"symbol"`, `"bigint"` ou
   `"object"`. Cuidado com o resultado de `typeof null` e com `NaN`.
2. **`isTruthyManually(value)`** — retorna `true`/`false` reimplementando
   manualmente a tabela de truthy/falsy, **sem** usar `Boolean(value)`
   nem `!!value`.
3. **`compareLooseAndStrict(a, b)`** — retorna
   `{ loose: a == b, strict: a === b }`.
4. **`coerceToNumberManually(value)`** — reimplementa o comportamento de
   `Number(value)` para: string numérica, string vazia, booleano, `null`,
   `undefined`, array vazio, array de um elemento numérico e array com
   mais de um elemento (que deve virar `NaN`). **Não use `Number()`,
   `parseFloat` ou `parseInt` diretamente** — o objetivo é entender a
   conversão, não chamar a função pronta.
5. **`sumOnlyNumbers(...values)`** — soma apenas os argumentos cujo tipo
   já é `number` (sem coerção) e ignora os demais.
6. **`concatenateAsStrings(...values)`** — converte cada argumento para
   string com as mesmas regras de `String(value)` e concatena tudo.
7. **`clampNumber(value, min, max)`** — restringe `value` ao intervalo
   `[min, max]`. Se `value`, `min` ou `max` não forem `number` válidos
   (nem `NaN`), lança `TypeError` com mensagem clara.
8. **`isSameValueZero(a, b)`** — implementa igualdade "SameValueZero"
   (a mesma usada por `Array.prototype.includes` e `Map`/`Set`): trata
   `NaN` como igual a `NaN`, mas não distingue `+0` de `-0`.

## Exercícios intermediários (4)

9. **`parsePercentageString(str)`** — converte `"42%"` em `0.42`. Entradas
   inválidas (`"abc"`, `"%"`, `null`, número puro sem `%`) retornam `null`.
10. **`normalizeBooleanish(value)`** — aceita `true`/`false`,
    `"true"`/`"false"`, `"yes"`/`"no"`, `"1"`/`"0"` (case-insensitive) e
    retorna o booleano correspondente. Qualquer outra entrada retorna
    `null`.
11. **`safeDivide(a, b)`** — divide `a` por `b`. Lança `TypeError` se `a`
    ou `b` não forem `number` válidos. Lança `RangeError` com mensagem
    própria se `b === 0`.
12. **`deepTypeOf(value)`** — vai além de `typeof`: distingue
    `"array"`, `"date"`, `"regexp"`, `"map"`, `"set"`, `"null"` e
    `"object"` (para os demais objetos simples).

## Debugging (2)

13. **`fixEqualityBug(users, id)`** — a implementação atual usa `==` e
    tem um bug de comparação entre `string` e `number` que faz o usuário
    errado ser retornado. Leia o comportamento atual, escreva um teste
    mental do caso que falha, e corrija **sem mudar a assinatura**.
14. **`fixCoercionBug(cart)`** — a implementação atual soma preços via
    concatenação de string em vez de soma numérica quando os preços vêm
    como string (comum em dados vindos de formulário/API). Corrija.

## Refatoração (1)

15. **`refactorDiscountTier(amount)`** — a implementação atual funciona,
    mas tem `if/else` aninhados e repetição. Refatore para algo mais
    simples e legível **sem mudar o comportamento observável** (mesmos
    testes devem continuar passando).

## Desafio integrador (1)

16. **`normalizeOrderInput(rawOrder)`** — recebe um objeto que simula o
    corpo de uma requisição HTTP, onde `price` e `quantity` podem chegar
    como `string` ou `number`. Deve:
    - validar que `price` e `quantity`, depois de convertidos, são
      números válidos e não negativos;
    - lançar `TypeError` com mensagem descritiva quando inválidos;
    - retornar `{ price: number, quantity: number, total: number }`
      com `total = price * quantity`.

    Este exercício combina classificação de tipo, coerção e validação —
    os mesmos três temas da unidade.

## Critérios de aceitação

- `npm test` sem falhas.
- Nenhuma função usa `any` implícito (não se aplica aqui, é JS puro) nem
  suprime erros silenciosamente.
- Erros lançados usam o tipo de erro nativo apropriado (`TypeError`,
  `RangeError`) com mensagem legível.
- Você consegue explicar, sem consultar o código, a diferença entre
  `==` e `===`, e por que `typeof null === "object"`.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
