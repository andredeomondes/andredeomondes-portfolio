export const SITE_URL = "https://andredeomondes.dev";
export const SITE_NAME = "Andre Deomondes";
export const SITE_DESCRIPTION =
  "Tutoriais de JavaScript, backend, IA aplicada e estudos de engenharia de software por Andre Deomondes.";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
