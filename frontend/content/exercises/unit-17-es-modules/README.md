# Unidade 17 — Módulos ES

Fase 1, Unidade 17. Cobre: `export` nomeado, `export default`, `import { a }`,
`import * as ns`, `import { a as b }`, `export * from`, `export { a as b } from`,
avaliação única de módulo (cache), e dependências circulares entre módulos.

## Nota sobre o formato desta unidade

Por convenção do curso, cada unidade tem um único par
`exercises.js`/`exercises.test.js` — não vamos criar arquivos de módulo de
verdade para importar uns dos outros dentro do exercício. Em vez disso, os
exercícios *simulam* os conceitos de módulos ES (export nomeado, export
default, namespace de importação, re-export, dependências circulares)
através de objetos simples que representam "o que um módulo exportaria".

Isso não substitui a prática real de `export`/`import` entre arquivos —
você já faz isso o tempo todo neste repositório (`export function` no topo
de cada `exercises.js`, `import { ... } from "./exercises.js"` no topo de
cada `exercises.test.js`) — mas permite testar seu entendimento das regras
sem depender de múltiplos arquivos.

## Antes de começar

Responda por escrito (pode ser neste README, numa cópia local, ou em
`notes/concepts/` se quiser guardar):

1. Qual a diferença entre `export default` e `export { algo }`? Quantos
   `export default` um módulo pode ter? E quantos exports nomeados?
2. `import * as ns from "./modulo.js"` cria o quê exatamente? Esse objeto
   pode ser modificado por quem importou?
3. Um módulo ES é avaliado quantas vezes, mesmo que seja importado em
   vários arquivos diferentes? O que isso implica para efeitos colaterais
   dentro de um módulo (ex.: um `console.log` no topo do arquivo)?

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.js`. O primeiro exercício (`createModule`) já vem
   resolvido como exemplo de estilo — leia com atenção antes de seguir.
2. Os demais exercícios têm `throw new Error("not implemented: <nome>")`.
3. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging, e o primeiro exercício, que já
   está implementado). Isso é esperado.
5. Não use bibliotecas externas. Objetos que representam "o módulo
   exportado" devem ser somente-leitura (`Object.freeze`) sempre que o
   enunciado falar em "objeto de módulo" — é assim que um namespace de
   import real se comporta.

## Exercícios fundamentais (8)

1. **`createModule(exportsObj)`** — recebe um objeto com os exports e
   retorna uma cópia congelada dele, simulando o objeto de módulo que o
   `import` recebe. **Já implementado como exemplo.**
2. **`defineNamedExports(values)`** — recebe um objeto `{ nome: valor }` e
   retorna um objeto de módulo congelado só com exports nomeados
   (equivalente a várias linhas `export const nome = valor;`).
3. **`defineDefaultExport(value)`** — retorna um objeto de módulo
   congelado com uma única chave `default`, equivalente a
   `export default value;`.
4. **`mergeNamespaceImport(...moduleObjs)`** — recebe vários objetos de
   módulo e retorna um único objeto de módulo congelado combinando todos
   os exports. Em caso de chave repetida entre módulos, o módulo que vem
   **depois** na lista de argumentos vence.
5. **`pickNamedImports(moduleObj, names)`** — simula
   `import { a, b } from "./modulo.js"`: retorna um objeto só com as
   chaves de `names` presentes em `moduleObj`. Se algum nome de `names`
   não existir em `moduleObj`, lança `SyntaxError` (é exatamente o erro
   que o motor JS lança para um import de nome inexistente).
6. **`renameImport(moduleObj, name, alias)`** — simula
   `import { name as alias } from "./modulo.js"`: retorna
   `{ [alias]: moduleObj[name] }`. Lança `SyntaxError` se `name` não
   existir em `moduleObj`.
7. **`createModuleRegistry()`** — retorna um objeto `{ modules, define }`
   onde `modules` é um `Map` e `define(name, factory)` registra uma
   função `factory` (que produziria os exports do módulo quando chamada)
   associada a `name` dentro de `modules`. Este registry é a base usada
   por `requireCachedBuggy` (exercício de debugging) para simular um
   sistema de módulos com cache.
8. **`isDefaultOnly(moduleObj)`** — retorna `true` se o objeto de módulo
   tiver **apenas** a chave `default` (nenhum export nomeado), `false`
   caso contrário (inclusive quando não há `default` nenhum).

## Exercícios intermediários (4)

9. **`reExportAll(sourceModuleObj, excludeNames = [])`** — simula
   `export * from "./origem.js"`: retorna um objeto de módulo congelado
   com todos os exports **nomeados** de `sourceModuleObj` (um
   `export * from` real **nunca** repassa o `default`, então essa chave
   deve ser sempre excluída), menos os nomes listados em `excludeNames`.
10. **`reExportNamed(sourceModuleObj, mapping)`** — simula
    `export { a as x, b } from "./origem.js"`. `mapping` é um objeto
    `{ nomeNaOrigem: nomeReexportado }`. Retorna um objeto de módulo
    congelado com as chaves reexportadas. Lança `SyntaxError` se algum
    `nomeNaOrigem` de `mapping` não existir em `sourceModuleObj`.
11. **`detectCircularDependency(depGraph, start)`** — `depGraph` é um
    objeto `{ nomeDoModulo: [nomes dos módulos que ele importa] }`.
    Retorna `true` se, partindo de `start` e seguindo as dependências,
    for possível voltar a visitar um módulo já visitado no caminho atual
    (ciclo), `false` caso contrário.
12. **`flattenModuleGraph(entryName, depGraph)`** — retorna um array com
    a ordem de avaliação dos módulos a partir de `entryName`: cada
    dependência aparece **antes** de quem depende dela (como um módulo
    real só termina de ser avaliado depois de suas próprias importações
    resolverem), sem repetir nenhum módulo mesmo que ele seja dependência
    de mais de um outro.

## Debugging (2)

13. **`buildNamespaceObjectBuggy(moduleObj)`** — deveria retornar um
    namespace somente-leitura (como `import * as ns` faz de verdade), mas
    hoje retorna a referência original, que pode ser mutada por quem
    "importou". Corrija sem mudar a assinatura.
14. **`requireCachedBuggy(registry, name)`** — deveria avaliar a factory
    do módulo **uma única vez** e reusar o resultado em chamadas
    seguintes (como um módulo ES real, que só é avaliado uma vez mesmo
    importado várias vezes). Hoje, chamar a função duas vezes para o
    mesmo módulo executa a factory duas vezes. Corrija guardando o
    resultado calculado na própria entrada do registry.

## Refatoração (1)

15. **`describeModuleShapeMessy(moduleObj)`** — já funciona: classifica o
    formato de um objeto de módulo em `"empty"`, `"default only"`,
    `"named only"` ou `"named+default"`. A implementação atual é uma
    sequência de `if`s que repete duas vezes a checagem de `hasDefault` e
    `namedKeys.length`. Refatore para eliminar a repetição, mantendo
    exatamente o mesmo comportamento observável.

## Desafio integrador (1)

16. **`buildDependencyReport(depGraph)`** — recebe um grafo de
    dependências no mesmo formato de `detectCircularDependency` e
    retorna:

    ```js
    {
      moduleCount: number,           // quantidade de módulos no grafo
      totalDependencyCount: number,  // soma do número de dependências de cada módulo
      hasCircularDependency: boolean,
      circularModules: string[],     // nomes (ordem alfabética) dos módulos
                                      // que participam de algum ciclo
    }
    ```

    Este exercício combina a detecção de ciclos (Unidade 17) com
    agregação sobre um objeto/array (Unidades 9–10).

## Critérios de aceitação

- `node --test exercises/01-javascript-core/unit-17-es-modules/exercises.test.js`
  sem falhas.
- Todo objeto que o enunciado chama de "objeto de módulo" é retornado
  congelado (`Object.freeze`) — tentar mutá-lo por fora deve lançar
  `TypeError`.
- Você consegue explicar, sem consultar o código, por que `export * from`
  nunca repassa o `default`, e por que um módulo real só roda seu código
  de topo uma única vez mesmo importado em vários lugares.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
