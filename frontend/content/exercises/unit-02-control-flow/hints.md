# Dicas — Unidade 2

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `classifyTriangle`: antes de comparar os lados entre si, valide a
  desigualdade triangular. Quais três comparações isso exige?
- Para `fizzBuzzRange`: qual operador testa "divisível por"? Em que ordem
  você deve checar 15, 3 e 5 para não retornar `"Fizz"` quando deveria
  retornar `"FizzBuzz"`?
- Para `daysInMonth`: a regra de ano bissexto tem três condições
  combinadas com `&&`/`||`. Escreva a regra em português antes de traduzir
  para código.
- Para `findDuplicateLoop`: existe uma forma de resolver com dois laços
  aninhados e outra com um único laço e uma estrutura auxiliar. Qual delas
  é O(n²) e qual é O(n)?
- Para `fixSwitchFallthroughBug`: rode o código atual mentalmente com
  `status = "pending"`. Em que `case` a execução entra, e onde ela para?
- Para `refactorNestedConditionals`: o que aconteceria se você invertesse
  cada condição e retornasse cedo em vez de aninhar o `else`?

## Nível 2 — pista mais direta

- `classifyTriangle`: a desigualdade triangular falha quando
  `a + b <= c` ou `a + c <= b` ou `b + c <= a` (para quaisquer três lados
  positivos).
- `fizzBuzzRange`: cheque `n % 15 === 0` primeiro; se você checar
  `% 3 === 0` antes, nunca vai alcançar o caso `"FizzBuzz"`.
- `daysInMonth`: bissexto é
  `year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)`.
- `findDuplicateLoop`: com laço rotulado, `outer: for (...) { for (...) { if (...) { encontrado = arr[i]; break outer; } } }`
  sai dos dois laços de uma vez ao achar o par repetido.
- `fixSwitchFallthroughBug`: `"pending"` cai sem `break` até o primeiro
  `case` que tem `break`, sobrescrevendo `label` no caminho. Cada `case`
  que deve retornar seu próprio valor precisa do próprio `break`.
- `refactorNestedConditionals`: guard clauses ficam assim:
  ```js
  if (!user) return "usuário inválido";
  if (!user.active) return "conta inativa";
  // ...
  ```

## Nível 3 — quase o código, mas ainda não a solução

- `classifyTriangle`: depois de validar a desigualdade triangular, conte
  quantos dos três pares `a === b`, `b === c`, `a === c` são verdadeiros:
  3 pares → `"equilateral"`, 1 par → `"isosceles"`, 0 pares → `"scalene"`.
- `fizzBuzzRange`: laço `for (let n = start; n <= end; n++)`, dentro dele
  uma cadeia `if (n % 15 === 0) ... else if (n % 3 === 0) ... else if (n % 5 === 0) ... else ...`.
- `findDuplicateLoop` (versão O(n)): percorra com `for...of`, mantenha um
  `Set` de valores já vistos; se o valor já está no `Set`, retorne-o
  imediatamente; senão, adicione ao `Set`. Retorne `null` após o laço.
- `fixSwitchFallthroughBug`: adicione `break;` logo após
  `label = "Pendente";` e após `label = "Pago";`, mantendo o `break`
  que já existe em `"refunded"` e `"cancelled"`.
- `refactorNestedConditionals`: a versão final tem quatro `if` sequenciais
  com retorno antecipado, na mesma ordem de prioridade da versão original
  (inválido → inativo → menor de idade → não verificado → elegível).

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
