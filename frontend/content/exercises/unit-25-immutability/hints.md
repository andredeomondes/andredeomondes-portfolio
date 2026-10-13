# Dicas — Unidade 25

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `freezeConfig`: qual método nativo torna um objeto somente leitura
  no primeiro nível?
- Para `safeAssign`: o que acontece com uma atribuição inválida dentro de
  um `try`? Qual bloco captura isso?
- Para `updateImmutable`/`mergeObjectsImmutable`: qual operador cria uma
  cópia rasa de um objeto dentro de chaves `{}`?
- Para `addItemImmutable`/`removeItemImmutable`/`sortImmutable`: existe um
  operador equivalente ao spread de objeto, mas para arrays, dentro de
  colchetes `[]`?
- Para `deepFreeze`: se `Object.freeze` só congela o primeiro nível, como
  você chegaria nos níveis mais profundos? Pense em uma função que chama
  a si mesma.
- Para `updateNestedImmutable`: se você só copiar o objeto raiz e
  sobrescrever um valor aninhado diretamente, o objeto interno original
  também é afetado?
- Para `toggleSetImmutable`: um `Set` tem construtor que aceita um
  iterável. Como você criaria um novo `Set` a partir de um array
  filtrado ou concatenado?

## Nível 2 — pista mais direta

- `freezeConfig`: `return Object.freeze(config);` já resolve — a função
  não precisa copiar nada, só congelar o que recebeu.
- `safeAssign`:
  ```js
  try {
    frozenObj[key] = value;
    return { success: true, value: frozenObj[key] };
  } catch (err) {
    return { success: false, error: err.message };
  }
  ```
- `updateImmutable`: `return { ...obj, [key]: value };`
- `addItemImmutable`: `return [...arr, item];`
- `removeItemImmutable`: `return [...arr.slice(0, index), ...arr.slice(index + 1)];`
- `updateItemImmutable`: use `.map()` — para o índice alvo retorne
  `updater(item)`, para os demais retorne `item` sem alteração.
- `sortImmutable`: copie primeiro (`[...arr]`), depois chame `.sort()` na
  cópia — nunca em `arr` diretamente.
- `mergeObjectsImmutable`: `return { ...base, ...overrides };` (a ordem
  importa: `overrides` deve vir depois para sobrescrever).
- `deepFreeze`: depois de `Object.freeze(obj)`, percorra
  `Object.values(obj)` e chame `deepFreeze` recursivamente em cada valor
  que seja `typeof value === "object" && value !== null`.
- `updateNestedImmutable`: recursão — no caso base (`path.length === 0`),
  retorne `value`; caso contrário, copie o objeto atual com spread e
  substitua `path[0]` pelo resultado de `updateNestedImmutable` chamado
  no restante do caminho (`path.slice(1)`).
- `toggleSetImmutable`: `set.has(value)` decide se você monta o novo
  `Set` com `[...set].filter((v) => v !== value)` ou com
  `[...set, value]`.
- `withoutKeysImmutable`: `Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))`.

## Nível 3 — quase o código, mas ainda não a solução

- `fixMutatingSort`: troque `products.sort(...)` por
  `[...products].sort(...)` e retorne o resultado dessa cópia.
- `fixFrozenIgnoredMutation`: remova o `try/catch` inteiro e a atribuição
  direta; a função inteira vira uma linha:
  `return { ...state, [key]: value };`.
- `refactorMutatingCartOperations`: para cada `action.type`, construa e
  retorne um objeto novo (`{ items: [...], itemCount: ... }`) usando
  spread nos arrays em vez de `.push()`/`.pop()`/`.length = 0`. Para
  `"removeLast"`, calcule o item removido a partir de
  `cart.items[cart.items.length - 1]` antes de fatiar o array com
  `.slice(0, -1)`.
- `applyImmutablePatch`: comece com
  `const history = [Object.freeze(structuredClone(state))];` e uma
  variável `current = state`. Para cada patch, faça
  `current = updateNestedImmutable(current, patch.path, patch.value);`
  e depois `history.push(Object.freeze(structuredClone(current)));`.
  Congelar uma **cópia** (`structuredClone`) garante que patches futuros
  não conseguem afetar o que já foi guardado no histórico.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
