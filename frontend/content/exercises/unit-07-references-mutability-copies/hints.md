# Dicas — Unidade 7

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `isPrimitiveValue`: quais são os tipos primitivos de JavaScript?
  `typeof` retorna algo diferente para cada um deles, exceto para um caso
  especial (`null`). Qual é esse caso?
- Para `sameReference`: qual operador de comparação, em JavaScript, compara
  objetos e arrays pela referência em memória, e não pelo conteúdo?
- Para `shallowCopyArray`/`shallowCopyObject`: existe uma sintaxe de
  espalhamento (`...`) que cria uma coleção nova a partir dos elementos ou
  propriedades de outra.
- Para `shallowCopyKeepsNestedReference`: depois de fazer uma cópia rasa
  com spread, o que acontece com uma propriedade cujo valor é, ele mesmo,
  outro objeto? O spread copia esse objeto aninhado, ou copia só o
  "endereço" dele?
- Para `deepCloneManual`: pense em uma função que se chama a si mesma. Se
  o valor recebido for um array, o que você faz com cada elemento? Se for
  um objeto, o que você faz com cada propriedade? E se for nem array nem
  objeto?
- Para `hasSideEffect`: para saber se algo mudou, você precisa guardar uma
  "foto" do estado de `arg` **antes** de chamar `fn`. Como você tira essa
  foto de um jeito que não seja afetado se `fn` mutar o `arg` original?
- Para `fixSharedDefaultArrayBug`: o valor padrão do parâmetro `tags` é
  uma referência a um array declarado **fora** da função, no escopo do
  módulo. Quantas vezes esse array é criado? Uma vez (quando o módulo
  carrega) ou uma vez por chamada?

## Nível 2 — pista mais direta

- `isPrimitiveValue`: `typeof value !== "object" && typeof value !== "function"` cobre quase tudo, mas `typeof null === "object"` — trate `null` à parte (ele também é primitivo).
- `sameReference`: `return a === b;`.
- `shallowCopyArray`: `return [...arr];`.
- `shallowCopyObject`: `return { ...obj };`.
- `mutateInPlacePush`: `arr.push(item); return arr;`.
- `appendImmutable`: `return [...arr, item];`.
- `updateNestedPropertyMutating`: `obj[key] = value; return obj;`.
- `updateNestedPropertyImmutable`: `return { ...obj, [key]: value };`.
- `shallowCopyKeepsNestedReference`: `const copy = { ...obj }; return { copy, sameNestedRef: copy.nested === obj.nested };`.
- `deepCloneJSON`: `return JSON.parse(JSON.stringify(obj));`.
- `hasSideEffect`: tire a "foto" com `JSON.stringify(arg)` antes de chamar
  `fn(arg)`, chame `fn(arg)`, tire outra foto depois, e compare as duas
  strings.
- `fixMutatingSortBug`: `.sort()` muta o array em que é chamado. Copie
  antes: `const sorted = [...items].sort((a, b) => a.price - b.price);`.
- `fixSharedDefaultArrayBug`: troque `tags = DEFAULT_TAGS` por `tags = []`
  no parâmetro (JavaScript cria um array novo a cada chamada quando o
  valor padrão é um literal `[]`), e evite `.push()` no array recebido —
  prefira `return { name, tags: [...tags, "sem-categoria"] };`.

## Nível 3 — quase o código, mas ainda não a solução

- `deepCloneManual`:
  ```js
  function deepCloneManual(value) {
    if (Array.isArray(value)) {
      return value.map((item) => deepCloneManual(item));
    }
    if (value !== null && typeof value === "object") {
      const result = {};
      for (const [key, val] of Object.entries(value)) {
        result[key] = deepCloneManual(val);
      }
      return result;
    }
    return value; // primitivo, retorna direto
  }
  ```
- `refactorDeepUpdateChain`:
  ```js
  return {
    ...state,
    user: {
      ...state.user,
      address: {
        ...state.user.address,
        city: newCity,
      },
    },
  };
  ```
- `applyPatchImmutable`: percorra as chaves de `patch` com
  `Object.entries`; para cada uma, se o valor em `state[key]` e em
  `patch[key]` forem ambos objetos simples (não array, não `null`, use
  algo como `typeof v === "object" && v !== null && !Array.isArray(v)`),
  faça `{ ...state[key], ...patch[key] }`; senão, use direto o valor de
  `patch[key]`. Comece a partir de `{ ...state }` e sobrescreva cada chave
  do `patch` seguindo essa regra.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
