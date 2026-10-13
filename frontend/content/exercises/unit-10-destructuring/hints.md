# Dicas — Unidade 10

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `swapPair`: o truque `[a, b] = [b, a]` funciona porque o lado
  direito é avaliado por completo (criando um array temporário) antes
  de qualquer atribuição acontecer. Isso vale também para trocar
  posições dentro de um array já existente (`swapMatrixRows`)?
- Para `skipMiddleElement`: como você "pula" uma posição em um padrão de
  destructuring de array sem dar nome a ela?
- Para `describeShippingAddress`: você pode combinar destructuring
  aninhado com valor padrão na mesma declaração? Em que nível da
  aninhação o padrão precisa estar?
- Para `fixNestedPathDestructureBug`: o que `order.customer` contém, e
  isso tem uma propriedade `customer` dentro dele?

## Nível 2 — pista mais direta

- `swapPair(pair)`: `let [a, b] = pair; [a, b] = [b, a]; return [a, b];`
- `skipMiddleElement([a, , c])`: use uma vírgula extra sem nome de
  variável entre `a` e `c` no padrão do array.
- `swapMatrixRows`: copie a matriz com `const rows = [...matrix];`
  (você ainda não viu spread formalmente, mas pode usar
  `matrix.map((row) => row)` também) e troque
  `[rows[0], rows[rows.length - 1]] = [rows[rows.length - 1], rows[0]];`.
- `fixSwappedDestructureBug`: troque
  `const { width: height, height: width } = rectangle;` por
  `const { width, height } = rectangle;`.
- `fixNestedPathDestructureBug`: troque `= order.customer;` por
  `= order;` no final da desestruturação.

## Nível 3 — quase o código, mas ainda não a solução

- `describeShippingAddress`:
  ```js
  const {
    customer: { name },
    shipping: {
      address: { city = "não informado", zip },
    },
  } = order;
  return `${name} - ${city} (${zip})`;
  ```
- `refactorManualPropertyAccess`:
  ```js
  const {
    name,
    age,
    address: { city, state },
    contact: { email },
  } = user;
  let summary = `${name} (${age}) — ${city}/${state}`;
  if (email) summary += ` — ${email}`;
  return summary;
  ```
- `parseConfigEntries`: dentro do `for (const [key, value] of entries)`,
  use `if (value === "true") ... else if (value === "false") ... else if (!Number.isNaN(Number(value)) && value.trim() !== "") ... else ...`
  para decidir o tipo de cada valor antes de atribuir a `result[key]`.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
