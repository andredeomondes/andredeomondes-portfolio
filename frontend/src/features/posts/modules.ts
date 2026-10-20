// Grouping of the JavaScript Core units into course modules (editorial call, by topic).
export const COURSE_MODULES = [
  { id: "fundamentos", title: "Fundamentos", from: 1, to: 4, icon: "blocks" },
  { id: "funcoes-dados", title: "Funções e dados", from: 5, to: 11, icon: "function" },
  { id: "objetos-erros", title: "Objetos e erros", from: 12, to: 14, icon: "braces" },
  { id: "linguagem", title: "Linguagem avançada", from: 15, to: 17, icon: "sparkles" },
  { id: "assincrono", title: "Assíncrono", from: 18, to: 23, icon: "timer" },
  { id: "producao", title: "Código de produção", from: 24, to: 99, icon: "gauge" },
] as const;

export type CourseModuleId = (typeof COURSE_MODULES)[number]["id"];

export function moduleOf(unit: number) {
  return COURSE_MODULES.find((module) => unit >= module.from && unit <= module.to) ?? COURSE_MODULES[COURSE_MODULES.length - 1];
}
