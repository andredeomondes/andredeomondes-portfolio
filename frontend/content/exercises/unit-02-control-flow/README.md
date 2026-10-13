# Unidade 2 — Controle de fluxo

Fase 1, Unidade 2. Cobre: `if`/`else`, `switch`, `for`, `while`,
`do...while`, `for...of`, `for...in`, `break`, `continue`, laços rotulados
(`label:`), operador ternário e curto-circuito (`&&`, `||`, `??`).

## Antes de começar

Responda por escrito (pode ser neste README, numa cópia local, ou em
`notes/concepts/` se quiser guardar):

1. Qual a diferença entre `break` e `continue` dentro de um loop?

  ``R = "break" ele para tudo e "continue" ele vai para a proxima rodada do loop``

2. Um `switch` sem `break` em um `case` faz o quê exatamente?

  ``R = Ele executa todos os outros "case" abaixo até encontrar o default ou o "break"``

3. `for...of` e `for...in` iteram sobre coisas diferentes. O que cada um
   percorre em um array? E em um objeto comum?

  ``R = Ele percorre todos os INdices "For in" e "For of" os valores``

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Não use bibliotecas externas nem métodos que resolvem o problema
   "de graça" quando o enunciado pedir explicitamente para usar um laço
   (ex.: não use `Array.prototype.flat()` em `flattenShallow`, nem
   `.split("").reverse().join("")` em `reverseStringLoop`) — o objetivo é
   praticar controle de fluxo manual, não a API pronta.

## Exercícios fundamentais (8)

1. **`classifyTriangle(a, b, c)`** — retorna `"equilateral"`,
   `"isosceles"`, `"scalene"` ou `"invalid"`. É inválido se algum lado for
   `<= 0` ou se não satisfizer a desigualdade triangular
   (soma de dois lados sempre maior que o terceiro).
2. **`fizzBuzzRange(start, end)`** — retorna um array de strings de
   `start` até `end` (inclusive): múltiplos de 3 viram `"Fizz"`, de 5
   viram `"Buzz"`, de 15 viram `"FizzBuzz"`, os demais viram o próprio
   número como string.
3. **`countVowels(str)`** — conta quantas vogais (`a`, `e`, `i`, `o`, `u`,
   maiúsculas ou minúsculas) existem na string, usando um laço (`for` ou
   `for...of`), sem regex.
4. **`findFirstNegative(numbers)`** — retorna o primeiro número negativo
   encontrado no array, ou `undefined` se não houver nenhum. Use `break`
   ou `return` antecipado — não percorra o array inteiro à toa.
5. **`sumUntilNegative(numbers)`** — soma os números do array até
   encontrar o primeiro negativo (o negativo não entra na soma, e os
   números depois dele são ignorados).
6. **`daysInMonth(month, year)`** — retorna o número de dias do mês
   (`month` de 1 a 12) usando `switch`. Fevereiro depende do ano ser
   bissexto (divisível por 4, exceto séculos não divisíveis por 400).
7. **`gradeLabel(score)`** — retorna `"A"` (90-100), `"B"` (80-89),
   `"C"` (70-79), `"D"` (60-69) ou `"F"` (abaixo de 60). Lança
   `RangeError` se `score` estiver fora do intervalo `[0, 100]`.
8. **`reverseStringLoop(str)`** — inverte a string usando um laço manual
   (`while` ou `for`), sem usar `.reverse()`.

## Exercícios intermediários (4)

9. **`flattenShallow(arrayOfArrays)`** — recebe um array de arrays e
   retorna um único array achatado em um nível, usando laços aninhados
   (sem `Array.prototype.flat`).
10. **`findDuplicateLoop(arr)`** — retorna o primeiro valor que aparece
    repetido no array (na ordem em que a repetição é detectada), ou
    `null` se não houver duplicado. Pense se um laço rotulado
    (`outer: for (...) { for (...) { ... break outer; } }`) ajuda a sair
    de dois laços aninhados de uma vez — mas também existe uma solução de
    um laço só usando uma estrutura para "já visto".
11. **`matrixDiagonalSum(matrix)`** — recebe uma matriz quadrada
    (array de arrays) e retorna a soma dos elementos da diagonal
    principal, usando laço(s) `for`.
12. **`safeGetNested(obj, path, defaultValue)`** — `path` é um array de
    chaves (ex.: `["user", "address", "city"]`). Percorra o caminho com
    um laço; se em qualquer nível o valor for `null`/`undefined`, retorne
    `defaultValue` imediatamente em vez de lançar erro.

## Debugging (2)

13. **`fixOffByOneLoop(items)`** — o laço atual usa `i <= items.length`,
    o que acessa uma posição inexistente do array na última iteração.
    Corrija a condição do laço.
14. **`fixSwitchFallthroughBug(status)`** — o `switch` atual está faltando
    `break` em alguns `case`, causando fallthrough (a execução "cai" para
    o próximo `case`) e retornando o rótulo errado. Corrija sem mudar a
    assinatura nem os rótulos esperados.

## Refatoração (1)

15. **`refactorNestedConditionals(user)`** — a implementação atual
    funciona, mas tem quatro níveis de `if/else` aninhados. Refatore
    usando **guard clauses** (retornos antecipados) para achatar a
    estrutura, mantendo o mesmo comportamento observável.

## Desafio integrador (1)

16. **`classifyAndSummarizeOrders(orders)`** — recebe uma lista de pedidos
    (`{ status, amount }`, onde `status` é `"pending"`, `"paid"`,
    `"cancelled"` ou `"refunded"`). Percorra a lista com um laço e, usando
    `switch` (ou `if/else` equivalente), monte e retorne:

    ```js
    {
      pending: number,   // quantidade de pedidos "pending"
      paid: number,       // quantidade de pedidos "paid"
      cancelled: number,  // quantidade de pedidos "cancelled"
      refunded: number,   // quantidade de pedidos "refunded"
      totalRevenue: number // soma de amount apenas de "paid" e "refunded"
    }
    ```

    Este exercício combina laço, `switch` e acumulação condicional — os
    mesmos temas da unidade.

## Critérios de aceitação

- `npm test` sem falhas.
- Nenhuma função usa recursão para resolver o que o enunciado pede como
  laço explícito (essa técnica chega em unidade futura).
- Erros lançados usam o tipo de erro nativo apropriado (`RangeError`) com
  mensagem legível.
- Você consegue explicar, sem consultar o código, a diferença entre
  `break` e `continue`, e por que esquecer um `break` num `switch` é um
  bug comum e silencioso.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
