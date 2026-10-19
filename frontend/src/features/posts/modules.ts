// Grouping of the JavaScript Core units into course modules (editorial call, by topic).
export const COURSE_MODULES = [
  { id: "fundamentos", title: "Fundamentos", from: 1, to: 4 },
  { id: "funcoes-dados", title: "Funções e dados", from: 5, to: 11 },
  { id: "objetos-erros", title: "Objetos e erros", from: 12, to: 14 },
  { id: "linguagem", title: "Linguagem avançada", from: 15, to: 17 },
  { id: "assincrono", title: "Assíncrono", from: 18, to: 99 },
] as const;

export type CourseModuleId = (typeof COURSE_MODULES)[number]["id"];

export function moduleOf(unit: number) {
  return COURSE_MODULES.find((module) => unit >= module.from && unit <= module.to) ?? COURSE_MODULES[COURSE_MODULES.length - 1];
}
