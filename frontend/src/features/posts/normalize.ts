/** Lowercase and strip accents so "Coerção" matches "coercao". */
export function normalizeText(value: string) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
