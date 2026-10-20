import type { Publication } from "@/content/posts";
import { series } from "@/content/posts";
import { moduleOf } from "@/features/posts/modules";
import { normalizeText } from "@/features/posts/normalize";

export { normalizeText };

/*
 * Editorial taxonomy for the publications: series, tags and search synonyms.
 * Kept apart from content/posts.ts so the content file only holds the units.
 */

export type Tag = { slug: string; label: string; description: string; synonyms?: string[] };

export const TAGS: Tag[] = [
  { slug: "javascript", label: "JavaScript", description: "Fundamentos de JavaScript explicados com exemplos de backend, testes e exercícios.", synonyms: ["js", "ecmascript", "node"] },
  { slug: "backend", label: "Backend", description: "Como cada recurso da linguagem aparece em APIs, payloads, regras de negócio e serviços.", synonyms: ["api", "servidor", "server"] },
  { slug: "node-js", label: "Node.js", description: "Comportamentos de JavaScript que importam no runtime do Node.js.", synonyms: ["node", "nodejs", "runtime"] },
  { slug: "fundamentos", label: "Fundamentos", description: "A base da linguagem: tipos, fluxo, funções e escopo.", synonyms: ["basico", "iniciante", "introducao"] },
  { slug: "tipos-e-coercao", label: "Tipos e coerção", description: "Tipos primitivos, coerção implícita e comparação segura.", synonyms: ["tipos", "coercao", "igualdade", "typeof", "==="] },
  { slug: "controle-de-fluxo", label: "Controle de fluxo", description: "Condicionais, laços, switch e guard clauses.", synonyms: ["if", "switch", "loop", "for", "while", "guard clause"] },
  { slug: "funcoes", label: "Funções", description: "Funções como contratos, valores e blocos de composição.", synonyms: ["function", "arrow function", "parametros", "return"] },
  { slug: "escopo", label: "Escopo", description: "Escopo léxico, var, let, const e TDZ.", synonyms: ["var", "let", "const", "tdz", "hoisting", "shadowing"] },
  { slug: "closures", label: "Closures", description: "Funções que carregam contexto: estado privado, memoization e rate limit.", synonyms: ["closure", "clausura", "memoization", "memoize"] },
  { slug: "arrays-e-objetos", label: "Arrays e objetos", description: "As estruturas que todo backend recebe, transforma e devolve.", synonyms: ["array", "objeto", "object", "estrutura de dados", "json"] },
  { slug: "imutabilidade", label: "Imutabilidade", description: "Referências, cópias rasas e profundas, e estado compartilhado.", synonyms: ["mutabilidade", "referencia", "copia", "structuredClone", "deep copy"] },
  { slug: "programacao-funcional", label: "Programação funcional", description: "Funções de alta ordem, composição, map, filter e reduce.", synonyms: ["funcional", "fp", "map", "filter", "reduce", "alta ordem", "composicao"] },
  { slug: "es6-plus", label: "ES6+", description: "Sintaxe moderna: destructuring, spread, rest e módulos.", synonyms: ["es6", "es2015", "moderno", "sintaxe"] },
  { slug: "erros", label: "Tratamento de erros", description: "Erros de domínio, cause, finally, retry e falhas assíncronas.", synonyms: ["error", "erro", "exception", "try", "catch", "throw", "finally"] },
  { slug: "poo", label: "Orientação a objetos", description: "Classes, protótipos, herança e o comportamento de this.", synonyms: ["oop", "orientacao a objetos", "classe", "class", "heranca", "prototype"] },
  { slug: "this", label: "this", description: "Como o contexto de uma chamada define o valor de this.", synonyms: ["contexto", "bind", "call", "apply"] },
  { slug: "iteradores", label: "Iteradores e generators", description: "Protocolo de iteração, yield e pipelines lazy.", synonyms: ["iterator", "generator", "yield", "iterable", "lazy"] },
  { slug: "regex", label: "Regex", description: "Expressões regulares legíveis para validar e extrair dados.", synonyms: ["regular expression", "expressao regular", "regexp", "validacao"] },
  { slug: "modulos", label: "Módulos", description: "Import, export, reexports e fronteiras entre partes do sistema.", synonyms: ["import", "export", "esm", "module", "commonjs"] },
  { slug: "assincrono", label: "Assíncrono", description: "Callbacks, Promises, async/await e o event loop.", synonyms: ["async", "assincronismo", "concorrencia", "paralelo"] },
  { slug: "promises", label: "Promises", description: "Resultados futuros com contrato previsível, combinadores e falhas.", synonyms: ["promise", "then", "promise.all", "allSettled", "race", "any"] },
  { slug: "async-await", label: "Async/await", description: "Sintaxe async/await sobre Promises, com tratamento de erros.", synonyms: ["async", "await"] },
  { slug: "event-loop", label: "Event loop", description: "Call stack, microtasks, timers e a ordem real de execução.", synonyms: ["microtask", "macrotask", "settimeout", "nexttick", "call stack"] },
  { slug: "performance", label: "Performance", description: "Cache, lazy evaluation e decisões que afetam tempo e memória.", synonyms: ["desempenho", "otimizacao", "cache"] },
  { slug: "json", label: "JSON", description: "Serializar, validar e transportar dados com JSON sem surpresas.", synonyms: ["stringify", "parse", "ndjson", "serializacao", "payload"] },
  { slug: "big-o", label: "Big O", description: "Complexidade de tempo e espaço aplicada a buscas, loops e índices.", synonyms: ["complexidade", "o(n)", "algoritmo", "notacao assintotica"] },
  { slug: "clean-code", label: "Código limpo", description: "Contratos claros, responsabilidades pequenas e leitura previsível.", synonyms: ["boas praticas", "legibilidade", "refatoracao"] },
];

// Tags every unit of a series receives, plus the unit-specific ones.
const SERIES_TAGS: Record<string, string[]> = { "javascript-core": ["javascript", "backend"] };

const UNIT_TAGS: Record<number, string[]> = {
  1: ["fundamentos", "tipos-e-coercao"],
  2: ["fundamentos", "controle-de-fluxo", "clean-code"],
  3: ["fundamentos", "funcoes", "clean-code"],
  4: ["fundamentos", "escopo"],
  5: ["closures", "funcoes", "escopo", "performance"],
  6: ["arrays-e-objetos"],
  7: ["arrays-e-objetos", "imutabilidade"],
  8: ["funcoes", "programacao-funcional"],
  9: ["programacao-funcional", "arrays-e-objetos"],
  10: ["es6-plus", "arrays-e-objetos"],
  11: ["es6-plus", "arrays-e-objetos", "imutabilidade"],
  12: ["erros", "clean-code"],
  13: ["poo"],
  14: ["this", "poo", "funcoes"],
  15: ["iteradores", "performance"],
  16: ["regex"],
  17: ["modulos", "es6-plus"],
  18: ["assincrono", "node-js"],
  19: ["assincrono", "promises"],
  20: ["assincrono", "async-await", "promises"],
  21: ["assincrono", "promises", "performance"],
  22: ["assincrono", "erros", "async-await"],
  23: ["assincrono", "event-loop", "node-js", "performance"],
  24: ["json", "arrays-e-objetos"],
  25: ["imutabilidade", "arrays-e-objetos"],
  26: ["clean-code", "funcoes"],
  27: ["big-o", "performance"],
};

export const SERIES = [{ slug: series.slug, title: series.title }];

const tagBySlug = new Map(TAGS.map((tag) => [tag.slug, tag]));

export function getTag(slug: string) {
  return tagBySlug.get(slug);
}

// Unit -> series. Every published unit is JavaScript Core today; new series add their ranges here.
const SERIES_RANGES = [{ slug: series.slug, from: 1, to: series.totalUnits }];

export function seriesOf(post: Pick<Publication, "unit">) {
  const range = SERIES_RANGES.find((item) => post.unit >= item.from && post.unit <= item.to) ?? SERIES_RANGES[0];
  return SERIES.find((item) => item.slug === range.slug) ?? SERIES[0];
}

export function tagsOf(post: Pick<Publication, "unit">): Tag[] {
  const slugs = [...(SERIES_TAGS[seriesOf(post).slug] ?? []), ...(UNIT_TAGS[post.unit] ?? [])];
  return [...new Set(slugs)].map((slug) => tagBySlug.get(slug)).filter((tag): tag is Tag => Boolean(tag));
}

/** Plain text the search runs over: everything the unit says about itself. */
export function searchTextOf(post: Publication) {
  const tags = tagsOf(post);
  return normalizeText(
    [
      post.title,
      post.statement,
      post.excerpt,
      post.takeaways.join(" "),
      post.code,
      `unidade ${post.unit}`,
      seriesOf(post).title,
      moduleOf(post.unit).title,
      ...tags.map((tag) => `${tag.label} ${(tag.synonyms ?? []).join(" ")}`),
    ].join(" "),
  );
}

/** Tags actually used by the given posts, most used first. */
export function tagCounts(posts: Array<Pick<Publication, "unit">>) {
  const counts = new Map<string, number>();
  for (const post of posts) for (const tag of tagsOf(post)) counts.set(tag.slug, (counts.get(tag.slug) ?? 0) + 1);
  return TAGS.filter((tag) => counts.has(tag.slug))
    .map((tag) => ({ ...tag, count: counts.get(tag.slug) ?? 0 }))
    .sort((a, b) => b.count - a.count);
}

/** Serializable card data for the explorer (server side). */
export function toExplorerPost(post: Publication) {
  return {
    slug: post.slug,
    unit: post.unit,
    title: post.title,
    excerpt: post.excerpt,
    readTime: post.readTime,
    cover: post.images[0],
    series: seriesOf(post),
    tags: tagsOf(post).map(({ slug, label }) => ({ slug, label })),
    search: searchTextOf(post),
  };
}
