import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Andre Deomondes — Engenharia e JavaScript",
    short_name: "Andre.dev",
    description: "Tutoriais de JavaScript, backend, IA aplicada e estudos de engenharia de software.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    lang: "pt-BR",
    icons: [
      { src: "/favicon.webp", sizes: "512x512", type: "image/webp", purpose: "any" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
