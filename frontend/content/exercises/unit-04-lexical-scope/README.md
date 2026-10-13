# Unidade 4 — Escopo léxico

Fase 1, Unidade 4. Cobre: `var` vs `let` vs `const`, hoisting, escopo de
bloco (`{ }`) vs escopo de função, temporal dead zone (TDZ) e shadowing de
variáveis.

## Antes de começar

Responda por escrito (pode ser neste README, numa cópia local, ou em
`notes/concepts/` se quiser guardar):

1. Uma variável declarada com `var` dentro de um `if { }` continua
   acessível depois do `if`? E uma declarada com `let`?
   `R =  var continua acessível, let não.`
2. O que significa "hoisting"? Ele funciona igual para `var`, `let`,
   `const` e declarações de função?
   `R = Hoisting é o comportamento pelo qual declarações são registradas no escopo antes da execução. var é inicializada com undefined, enquanto let e const ficam na Temporal Dead Zone até sua declaração ser executada. Function declarations ficam disponíveis completamente antes da linha onde aparecem, enquanto function expressions e arrow functions seguem as regras da variável usada para armazená-las.`

3. O que é a "temporal dead zone" (TDZ)? Em que situação você recebe o erro
   `Cannot access 'x' before initialization`?
   `R = A Temporal Dead Zone (TDZ) é o intervalo entre o momento em que um bloco/escopo começa e o momento em que uma variável declarada com let ou const é efetivamente inicializada.`

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Por que isso importa para backend

Bugs de escopo são dos mais traiçoeiros em produção: uma variável `var`
que "vaza" de um `if` e é reaproveitada sem querer em outro branch, um
loop que captura a variável errada, um módulo que expõe estado que
deveria ser privado. Entender exatamente onde uma variável vive — e por
quanto tempo — evita corrupção de estado silenciosa em serviços que rodam
por dias sem reiniciar.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
   ```

   ou, para rodar toda a suíte do repositório:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Use a linha `// test: node --test --test-name-pattern=...` acima de cada
   função para rodar só aquele exercício enquanto trabalha nele.
6. Alguns exercícios pedem explicitamente o uso de `var` — é proposital,
   para você experimentar o comportamento na prática, não porque `var`
   seja recomendado em código novo (use `let`/`const` fora desses casos).

## Exercícios fundamentais (8)

1. **`sumUsingBlockScope(a, b)`** — calcule a soma usando um `let`
   declarado dentro de um bloco `{ }` interno (uma variável intermediária
   que não precisa existir fora dali) e retorne o resultado.
2. **`maxOfThreeBlockScoped(a, b, c)`** — encontre o maior dos três valores
   usando variáveis `let` declaradas dentro de blocos, sem deixar nenhuma
   variável auxiliar vazar para fora do escopo onde é necessária.
3. **`describeShadowing(outerValue)`** — dentro de um bloco `{ }`, declare
   `let outerValue = outerValue + 10` (isso é _shadowing_: uma nova
   variável com o mesmo nome do parâmetro, válida só dentro do bloco).
   Retorne `{ outer: <valor original do parâmetro>, inner: <valor dentro do bloco> }`.
4. **`trackLastEvenFunctionScoped(numbers)`** — usando **`var`** (de
   propósito) dentro de um `if` que está dentro de um `for`, guarde o
   último número par encontrado. Retorne essa variável **depois** do
   laço — isso só funciona porque `var` tem escopo de função, não de
   bloco. Retorne `undefined` se não houver nenhum par.
5. **`pushIntoConstArray(items)`** — declare `const arr = []`, adicione
   todos os elementos de `items` a `arr` usando `.push()` dentro de um
   laço, e retorne `arr`. O objetivo é comprovar que `const` impede
   **reatribuição** da variável, não mutação do valor referenciado.
6. **`reassignLetInLoop(start, times)`** — declare `let counter = start` e,
   em um laço `while` que roda `times` vezes, reatribua `counter += 1` a
   cada iteração. Retorne o valor final de `counter`.
7. **`attemptConstReassignment()`** — declare `const valor = 1` dentro da
   função, tente reatribuir `valor = 2` dentro de um `try/catch`, e
   retorne `true` se a reatribuição lançou `TypeError`, ou `false` caso
   contrário.
8. **`nestedBlockCounter(operations)`** — `operations` é um array de
   strings `"+1"` ou `"-1"`. Usando um `let count = 0` e um bloco `{ }`
   aninhado por operação (não é obrigatório, mas pratique blocos), some ou
   subtraia 1 para cada operação e retorne o total final.

## Exercícios intermediários (4)

9. **`hoistedFunctionCall()`** — dentro da função, **chame** um helper
   antes de declará-lo no código (ex.: `return helper();` seguido, mais
   abaixo no mesmo corpo, da declaração `function helper() { return "hoisted"; }`).
   Isso funciona porque declarações de função (não expressões) sofrem
   hoisting completo, incluindo o corpo. Retorne o resultado da chamada.
10. **`varDeclaredValueBeforeAssignment()`** — dentro da função, leia
    `typeof x` **antes** da linha `var x = 10;` e guarde esse resultado em
    uma constante. Depois declare `var x = 10;`. Retorne o resultado
    guardado (deve ser a string `"undefined"`, não um erro — isso
    comprova que `var` é hoisted e inicializado com `undefined`, diferente
    de `let`/`const`).
11. **`compareVarAndLetLeak(shouldRun)`** — se `shouldRun` for `true`,
    dentro de um bloco `if` declare `var leakyVar = "vazou"` e
    `let scopedLet = "não vazou"`. Depois do bloco (fora dele), use
    `typeof leakyVar` e `typeof scopedLet` para checar se cada uma ainda
    existe naquele escopo. Retorne
    `{ varLeaked: boolean, letLeaked: boolean }`. Se `shouldRun` for
    `false`, retorne `{ varLeaked: false, letLeaked: false }` sem executar
    o bloco.
12. **`createIifeCounter()`** — use uma **IIFE** (`(function () { ... })()`
    ou `(() => { ... })()`) para criar um escopo privado com uma variável
    `count` que não é acessível de fora. A IIFE deve retornar um objeto
    `{ increment, getValue }`, onde `increment()` soma 1 a `count` e
    `getValue()` retorna o valor atual. `createIifeCounter()` retorna esse
    objeto.

## Debugging (2)

13. **`sumOrderTotals(items)`** — o sintoma relatado é que o total final
    vem sempre igual ao valor do último item da lista, como se os
    anteriores fossem ignorados. Repare que o código usa `var total = ...`
    (com a palavra-chave `var` de novo) dentro de cada branch do `if`, em
    vez de reatribuir a variável já existente. Pense: já que `var` é
    escopada por função, o que essas duas linhas com `var total = ...`
    fazem de fato ao valor de `total`, iteração após iteração?
14. **`computeDiscountedPrice(price, isMember)`** — o sintoma relatado é
    que chamar a função com `isMember = true` lança
    `Cannot access 'discount' before initialization` em vez de aplicar o
    desconto. Localize onde `discount` é **usado** e onde ele é
    **declarado** com `let` dentro do mesmo bloco — a ordem entre essas
    duas linhas é o problema (temporal dead zone).

## Refatoração (1)

15. **`refactorScoreSummary(scores)`** — a implementação atual funciona
    (calcula total, máximo, mínimo e média de uma lista de notas), mas usa
    `var` para tudo, inclusive a variável do laço. Refatore substituindo
    `var` por `let`/`const` conforme cada variável realmente precisa ou
    não ser reatribuída, e restrinja cada uma ao menor escopo possível
    (por exemplo, a variável do laço `for` não precisa existir fora dele).
    Mantenha o mesmo objeto de retorno.

## Desafio integrador (1)

16. **`createSequentialIdGenerator(prefix)`** — combina "funções que
    retornam funções" (Unidade 3) com uma variável de contagem mantida em
    escopo léxico privado (Unidade 4, e uma prévia do que a Unidade 5 vai
    aprofundar: closures). Retorna uma função `nextId()` tal que cada
    chamada devolve `"<prefix>-1"`, depois `"<prefix>-2"`, e assim por
    diante — o contador não pode ser acessível de fora da função retornada.

    ```js
    const nextId = createSequentialIdGenerator("user");
    nextId(); // "user-1"
    nextId(); // "user-2"
    nextId(); // "user-3"
    ```

## Critérios de aceitação

- `npm test` sem falhas.
- Você consegue explicar, sem consultar o código, a diferença entre escopo
  de bloco e escopo de função, e por que `var` "vaza" de um `if` mas `let`
  não.
- Você consegue explicar o que é a temporal dead zone com suas próprias
  palavras, sem usar o termo em inglês como muleta.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
