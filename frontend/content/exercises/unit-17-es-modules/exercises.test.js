import { test } from "node:test";
import assert from "node:assert/strict";

import {
  createModule,
  defineNamedExports,
  defineDefaultExport,
  mergeNamespaceImport,
  pickNamedImports,
  renameImport,
  createModuleRegistry,
  isDefaultOnly,
  reExportAll,
  reExportNamed,
  detectCircularDependency,
  flattenModuleGraph,
  buildNamespaceObjectBuggy,
  requireCachedBuggy,
  describeModuleShapeMessy,
  buildDependencyReport,
} from "./exercises.js";

// --- createModule --------------------------------------------------------------

test("createModule: cria um objeto de módulo congelado (já implementado, exemplo)", () => {
  const mod = createModule({ a: 1, b: 2 });
  assert.deepEqual(mod, { a: 1, b: 2 });
  assert.throws(() => {
    mod.a = 99;
  }, TypeError);
});

// --- defineNamedExports --------------------------------------------------------

test("defineNamedExports: retorna um objeto de módulo só com exports nomeados", () => {
  const mod = defineNamedExports({ sum: 1, PI: 3.14 });
  assert.deepEqual(mod, { sum: 1, PI: 3.14 });
});

test("defineNamedExports: o objeto retornado é somente-leitura", () => {
  const mod = defineNamedExports({ a: 1 });
  assert.throws(() => {
    mod.a = 2;
  }, TypeError);
});

// --- defineDefaultExport ---------------------------------------------------------

test("defineDefaultExport: retorna um objeto de módulo com a chave 'default'", () => {
  const mod = defineDefaultExport(42);
  assert.deepEqual(mod, { default: 42 });
});

test("defineDefaultExport: o objeto retornado é somente-leitura", () => {
  const mod = defineDefaultExport("valor");
  assert.throws(() => {
    mod.default = "outro";
  }, TypeError);
});

// --- mergeNamespaceImport --------------------------------------------------------

test("mergeNamespaceImport: combina exports de vários módulos num único namespace", () => {
  const merged = mergeNamespaceImport({ a: 1, b: 2 }, { b: 3, c: 4 });
  assert.deepEqual(merged, { a: 1, b: 3, c: 4 });
});

test("mergeNamespaceImport: módulos depois na lista sobrescrevem os anteriores em conflito", () => {
  const merged = mergeNamespaceImport(
    { x: "primeiro" },
    { x: "segundo" },
    { x: "terceiro" },
  );
  assert.equal(merged.x, "terceiro");
});

test("mergeNamespaceImport: o namespace combinado é somente-leitura", () => {
  const merged = mergeNamespaceImport({ a: 1 });
  assert.throws(() => {
    merged.a = 2;
  }, TypeError);
});

// --- pickNamedImports --------------------------------------------------------------

test("pickNamedImports: seleciona apenas os nomes pedidos", () => {
  const mod = { a: 1, b: 2, c: 3 };
  assert.deepEqual(pickNamedImports(mod, ["a", "c"]), { a: 1, c: 3 });
});

test("pickNamedImports: lança erro ao pedir um nome que o módulo não exporta", () => {
  const mod = { a: 1 };
  assert.throws(() => pickNamedImports(mod, ["a", "naoExiste"]), SyntaxError);
});

// --- renameImport ------------------------------------------------------------------

test("renameImport: importa um export nomeado sob um apelido", () => {
  const mod = { sum: 1 };
  assert.deepEqual(renameImport(mod, "sum", "total"), { total: 1 });
});

test("renameImport: lança erro se o nome original não existir no módulo", () => {
  const mod = { sum: 1 };
  assert.throws(() => renameImport(mod, "naoExiste", "alias"), SyntaxError);
});

// --- createModuleRegistry -----------------------------------------------------------

test("createModuleRegistry: define registra uma factory recuperável por nome", () => {
  const registry = createModuleRegistry();
  let calls = 0;
  registry.define("a", () => {
    calls += 1;
    return { value: 42 };
  });
  const entry = registry.modules.get("a");
  assert.equal(typeof entry.factory, "function");
  assert.deepEqual(entry.factory(), { value: 42 });
  assert.equal(calls, 1);
});

test("createModuleRegistry: cada instância de registry tem seu próprio conjunto de módulos", () => {
  const registryA = createModuleRegistry();
  const registryB = createModuleRegistry();
  registryA.define("a", () => "valor-a");
  assert.equal(registryB.modules.has("a"), false);
});

// --- isDefaultOnly -------------------------------------------------------------------

test("isDefaultOnly: true quando o módulo só tem export default", () => {
  assert.equal(isDefaultOnly({ default: 1 }), true);
});

test("isDefaultOnly: false quando há exports nomeados junto (ou nenhum default)", () => {
  assert.equal(isDefaultOnly({ default: 1, extra: 2 }), false);
  assert.equal(isDefaultOnly({ a: 1 }), false);
  assert.equal(isDefaultOnly({}), false);
});

// --- reExportAll ---------------------------------------------------------------------

test("reExportAll: repassa todos os exports nomeados, nunca o default", () => {
  const source = { a: 1, b: 2, default: 99 };
  assert.deepEqual(reExportAll(source), { a: 1, b: 2 });
});

test("reExportAll: permite excluir nomes específicos", () => {
  const source = { a: 1, b: 2, c: 3 };
  assert.deepEqual(reExportAll(source, ["b"]), { a: 1, c: 3 });
});

// --- reExportNamed -------------------------------------------------------------------

test("reExportNamed: reexporta nomes escolhidos, podendo renomear", () => {
  const source = { a: 1, b: 2, c: 3 };
  const result = reExportNamed(source, { a: "x", b: "b" });
  assert.deepEqual(result, { x: 1, b: 2 });
});

test("reExportNamed: lança erro se o nome de origem não existir no módulo fonte", () => {
  const source = { a: 1 };
  assert.throws(() => reExportNamed(source, { naoExiste: "x" }), SyntaxError);
});

// --- detectCircularDependency ---------------------------------------------------------

test("detectCircularDependency: detecta um ciclo entre módulos", () => {
  const depGraph = { a: ["b"], b: ["c"], c: ["a"] };
  assert.equal(detectCircularDependency(depGraph, "a"), true);
});

test("detectCircularDependency: false para um grafo de dependências acíclico", () => {
  const depGraph = { a: ["b"], b: ["c"], c: [] };
  assert.equal(detectCircularDependency(depGraph, "a"), false);
});

test("detectCircularDependency: false quando o módulo não depende de nada", () => {
  const depGraph = { a: [] };
  assert.equal(detectCircularDependency(depGraph, "a"), false);
});

// --- flattenModuleGraph ---------------------------------------------------------------

test("flattenModuleGraph: retorna as dependências antes do módulo que depende delas, sem duplicar", () => {
  const depGraph = { a: ["b", "c"], b: ["d"], c: ["d"], d: [] };
  assert.deepEqual(flattenModuleGraph("a", depGraph), ["d", "b", "c", "a"]);
});

test("flattenModuleGraph: módulo sem dependências retorna só ele mesmo", () => {
  const depGraph = { a: [] };
  assert.deepEqual(flattenModuleGraph("a", depGraph), ["a"]);
});

// --- buildNamespaceObjectBuggy ---------------------------------------------------------

test("buildNamespaceObjectBuggy: o namespace retornado não pode ser mutado por quem importou", () => {
  const original = { a: 1, b: 2 };
  const namespace = buildNamespaceObjectBuggy(original);
  assert.deepEqual(namespace, { a: 1, b: 2 });
  assert.throws(() => {
    namespace.a = 99;
  }, TypeError);
});

// --- requireCachedBuggy ------------------------------------------------------------------

test("requireCachedBuggy: executa a factory apenas uma vez e reusa o resultado em cache", () => {
  let calls = 0;
  const registry = { modules: new Map() };
  registry.modules.set("a", {
    factory: () => {
      calls += 1;
      return { value: calls };
    },
  });
  const first = requireCachedBuggy(registry, "a");
  const second = requireCachedBuggy(registry, "a");
  assert.equal(calls, 1);
  assert.deepEqual(first, { value: 1 });
  assert.equal(first, second);
});

test("requireCachedBuggy: lança ReferenceError para módulo não registrado", () => {
  const registry = { modules: new Map() };
  assert.throws(() => requireCachedBuggy(registry, "naoExiste"), ReferenceError);
});

// --- describeModuleShapeMessy -----------------------------------------------------------

test("describeModuleShapeMessy: classifica o formato do módulo (já funciona, tarefa é refatorar)", () => {
  assert.equal(describeModuleShapeMessy({}), "empty");
  assert.equal(describeModuleShapeMessy({ default: 1 }), "default only");
  assert.equal(describeModuleShapeMessy({ a: 1, b: 2 }), "named only");
  assert.equal(describeModuleShapeMessy({ default: 1, a: 2 }), "named+default");
});

// --- buildDependencyReport --------------------------------------------------------------

test("buildDependencyReport: resume o grafo de dependências, incluindo ciclos", () => {
  const depGraph = {
    a: ["b", "c"],
    b: ["c"],
    c: [],
    x: ["y"],
    y: ["x"],
  };
  const report = buildDependencyReport(depGraph);
  assert.equal(report.moduleCount, 5);
  assert.equal(report.totalDependencyCount, 5);
  assert.equal(report.hasCircularDependency, true);
  assert.deepEqual(report.circularModules, ["x", "y"]);
});

test("buildDependencyReport: hasCircularDependency false quando não há ciclos", () => {
  const depGraph = { a: ["b"], b: ["c"], c: [] };
  const report = buildDependencyReport(depGraph);
  assert.equal(report.moduleCount, 3);
  assert.equal(report.hasCircularDependency, false);
  assert.deepEqual(report.circularModules, []);
});
