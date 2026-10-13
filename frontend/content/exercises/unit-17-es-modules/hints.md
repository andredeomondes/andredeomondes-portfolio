# Dicas — Unidade 17

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `defineNamedExports`/`defineDefaultExport`/`mergeNamespaceImport`:
  olhe como `createModule` já resolvido faz isso — `Object.freeze` em
  cima de uma cópia (`{ ...obj }`), nunca do objeto original.
- Para `pickNamedImports`/`renameImport`: o que o motor JS faz de verdade
  quando você escreve `import { algoQueNaoExiste } from "./modulo.js"`?
  Isso te diz o tipo de erro certo para lançar.
- Para `createModuleRegistry`: pense num `Map` como uma "prateleira" de
  módulos ainda não avaliados — `define` só guarda a receita (`factory`),
  não executa nada ainda.
- Para `reExportAll`: um `export * from` nunca inclui o `default` do
  módulo de origem — isso não é opcional, é regra da linguagem. A chave
  `default` sempre fica de fora, independente de `excludeNames`.
- Para `detectCircularDependency`: pense em uma busca em profundidade
  (DFS) que mantém o "caminho atual" sendo visitado. Um ciclo existe
  quando você tenta visitar de novo algo que já está no caminho atual
  (não simplesmente "já visitado alguma vez").
- Para `flattenModuleGraph`: em que ordem um módulo real termina de
  avaliar — antes ou depois de suas próprias importações resolverem?
- Para `buildNamespaceObjectBuggy`: a variável `namespace` está apontando
  para o quê exatamente — uma cópia ou o objeto original?
- Para `requireCachedBuggy`: onde a função atual guarda (ou não guarda) o
  resultado de `entry.factory()` depois de calculá-lo pela primeira vez?

## Nível 2 — pista mais direta

- `defineNamedExports`: `return Object.freeze({ ...values });`
- `defineDefaultExport`: `return Object.freeze({ default: value });`
- `mergeNamespaceImport`: `return Object.freeze(Object.assign({}, ...moduleObjs));`
  (ou um `reduce` equivalente) — a ordem dos argumentos em
  `Object.assign` já garante que o último sobrescreve.
- `pickNamedImports`: para cada nome em `names`, cheque
  `Object.prototype.hasOwnProperty.call(moduleObj, name)` antes de copiar;
  se faltar, `throw new SyntaxError(...)`.
- `renameImport`: mesma checagem de `pickNamedImports`, mas o resultado
  tem uma única chave: `{ [alias]: moduleObj[name] }`.
- `createModuleRegistry`:
  ```js
  return {
    modules: new Map(),
    define(name, factory) {
      this.modules.set(name, { factory });
    },
  };
  ```
- `isDefaultOnly`: `Object.keys(moduleObj).length === 1 && "default" in moduleObj`.
- `reExportAll`: filtre `Object.keys(sourceModuleObj)` removendo `"default"`
  e qualquer nome de `excludeNames`, depois monte o objeto e congele.
- `reExportNamed`: percorra as entradas de `mapping`
  (`Object.entries(mapping)`), valide cada `nomeNaOrigem` contra
  `sourceModuleObj`, e monte `{ [nomeReexportado]: sourceModuleObj[nomeNaOrigem] }`.
- `detectCircularDependency`: DFS com dois conjuntos — `visiting` (o
  caminho atual, some quando você volta) e `visited` (tudo que já foi
  totalmente explorado, nunca precisa reexplorar).
- `buildNamespaceObjectBuggy`: troque `const namespace = moduleObj;` por
  `const namespace = Object.freeze({ ...moduleObj });`.
- `requireCachedBuggy`: depois de calcular `entry.factory()` pela
  primeira vez, guarde o resultado em `entry.cachedValue` (ou campo
  parecido) e marque `entry.evaluated = true`; nas próximas chamadas,
  se `entry.evaluated` for `true`, retorne o valor guardado sem chamar
  `entry.factory()` de novo.

## Nível 3 — quase o código, mas ainda não a solução

- `flattenModuleGraph`:
  ```js
  export function flattenModuleGraph(entryName, depGraph) {
    const visited = new Set();
    const order = [];
    function visit(name) {
      if (visited.has(name)) return;
      visited.add(name);
      for (const dep of depGraph[name] ?? []) visit(dep);
      order.push(name);
    }
    visit(entryName);
    return order;
  }
  ```
- `detectCircularDependency`:
  ```js
  export function detectCircularDependency(depGraph, start) {
    const visiting = new Set();
    const visited = new Set();
    function dfs(name) {
      if (visiting.has(name)) return true;
      if (visited.has(name)) return false;
      visiting.add(name);
      for (const dep of depGraph[name] ?? []) {
        if (dfs(dep)) return true;
      }
      visiting.delete(name);
      visited.add(name);
      return false;
    }
    return dfs(start);
  }
  ```
- `requireCachedBuggy`:
  ```js
  export function requireCachedBuggy(registry, name) {
    const entry = registry.modules.get(name);
    if (!entry) {
      throw new ReferenceError(`Módulo "${name}" não registrado`);
    }
    if (!entry.evaluated) {
      entry.cachedValue = entry.factory();
      entry.evaluated = true;
    }
    return entry.cachedValue;
  }
  ```
- `describeModuleShapeMessy` (refatoração): a versão final pode ser algo
  como montar a string a partir de duas condições booleanas
  (`hasDefault`, `hasNamed`) sem repetir a checagem de `namedKeys.length`
  quatro vezes — por exemplo, calcule `hasNamed` uma vez só e use uma
  combinação `if/else if` (ou uma tabela de casos) sobre `[hasNamed, hasDefault]`.
- `buildDependencyReport`: reaproveite `detectCircularDependency` que
  você já escreveu — chame-a para cada módulo do grafo e filtre os que
  retornam `true`:
  ```js
  export function buildDependencyReport(depGraph) {
    const moduleNames = Object.keys(depGraph).sort();
    const circularModules = moduleNames.filter((name) =>
      detectCircularDependency(depGraph, name),
    );
    const totalDependencyCount = moduleNames.reduce(
      (sum, name) => sum + (depGraph[name]?.length ?? 0),
      0,
    );
    return {
      moduleCount: moduleNames.length,
      totalDependencyCount,
      hasCircularDependency: circularModules.length > 0,
      circularModules,
    };
  }
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
