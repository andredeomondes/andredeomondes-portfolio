// Unidade 17 — Módulos ES
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.
//
// Nota importante sobre esta unidade: por convenção do curso, cada
// unidade tem um único par exercises.js/exercises.test.js — não vamos
// criar arquivos de módulo de verdade para importar uns dos outros.
// Em vez disso, os exercícios *simulam* os conceitos de módulos ES
// (export nomeado, export default, `import * as ns`, `export * from`,
// avaliação única/cache de módulo, dependências circulares) através de
// objetos simples que representam "o que um módulo exportaria". Isso não
// substitui a prática real de `export`/`import` entre arquivos — você já
// faz isso o tempo todo neste repositório (`export function` no topo de
// cada `exercises.js`, `import { ... } from "./exercises.js"` no topo de
// cada `exercises.test.js`) — mas permite testar seu entendimento das
// regras sem depender de múltiplos arquivos.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="createModule" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function createModule(exportsObj) {
  return Object.freeze({ ...exportsObj });
}

// test: node --test --test-name-pattern="defineNamedExports" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function defineNamedExports(values) {
  throw new Error("not implemented: defineNamedExports");
}

// test: node --test --test-name-pattern="defineDefaultExport" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function defineDefaultExport(value) {
  throw new Error("not implemented: defineDefaultExport");
}

// test: node --test --test-name-pattern="mergeNamespaceImport" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function mergeNamespaceImport(...moduleObjs) {
  throw new Error("not implemented: mergeNamespaceImport");
}

// test: node --test --test-name-pattern="pickNamedImports" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function pickNamedImports(moduleObj, names) {
  throw new Error("not implemented: pickNamedImports");
}

// test: node --test --test-name-pattern="renameImport" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function renameImport(moduleObj, name, alias) {
  throw new Error("not implemented: renameImport");
}

// test: node --test --test-name-pattern="createModuleRegistry" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function createModuleRegistry() {
  throw new Error("not implemented: createModuleRegistry");
}

// test: node --test --test-name-pattern="isDefaultOnly" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function isDefaultOnly(moduleObj) {
  throw new Error("not implemented: isDefaultOnly");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="reExportAll" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function reExportAll(sourceModuleObj, excludeNames = []) {
  throw new Error("not implemented: reExportAll");
}

// test: node --test --test-name-pattern="reExportNamed" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function reExportNamed(sourceModuleObj, mapping) {
  throw new Error("not implemented: reExportNamed");
}

// test: node --test --test-name-pattern="detectCircularDependency" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function detectCircularDependency(depGraph, start) {
  throw new Error("not implemented: detectCircularDependency");
}

// test: node --test --test-name-pattern="flattenModuleGraph" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function flattenModuleGraph(entryName, depGraph) {
  throw new Error("not implemented: flattenModuleGraph");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="buildNamespaceObjectBuggy" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function buildNamespaceObjectBuggy(moduleObj) {
  // Sintoma relatado: o objeto de namespace retornado (equivalente a
  // `import * as ns`) pode ser mutado por quem importou, o que não
  // deveria ser possível — namespaces de módulos ES reais são
  // somente-leitura do lado de quem importa.
  const namespace = moduleObj;
  return namespace;
}

// test: node --test --test-name-pattern="requireCachedBuggy" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function requireCachedBuggy(registry, name) {
  // Sintoma relatado: chamar `require` duas vezes para o mesmo módulo
  // executa a factory duas vezes (efeitos colaterais duplicados), quando
  // um módulo ES real é avaliado uma única vez e depois reusa o cache.
  const entry = registry.modules.get(name);
  if (!entry) {
    throw new ReferenceError(`Módulo "${name}" não registrado`);
  }
  return entry.factory();
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// a repetição de ifs sequenciais, mantendo o mesmo comportamento
// observável (as mesmas strings de saída para as mesmas entradas).

// test: node --test --test-name-pattern="describeModuleShapeMessy" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function describeModuleShapeMessy(moduleObj) {
  const keys = Object.keys(moduleObj);
  const hasDefault = Object.prototype.hasOwnProperty.call(moduleObj, "default");
  const namedKeys = keys.filter((key) => key !== "default");

  if (keys.length === 0) {
    return "empty";
  }
  if (hasDefault && namedKeys.length > 0) {
    return "named+default";
  }
  if (hasDefault && namedKeys.length === 0) {
    return "default only";
  }
  if (!hasDefault && namedKeys.length > 0) {
    return "named only";
  }
  return "empty";
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="buildDependencyReport" exercises/01-javascript-core/unit-17-es-modules/exercises.test.js
export function buildDependencyReport(depGraph) {
  throw new Error("not implemented: buildDependencyReport");
}
