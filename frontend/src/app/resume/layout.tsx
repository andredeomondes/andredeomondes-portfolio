import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Currículo",
  description: "Currículo de Andre Deomondes: experiência em backend, IA aplicada, frontend, cloud, dados e qualidade de software.",
  alternates: { canonical: "/resume" },
  openGraph: {
    url: "/resume",
    title: "Currículo — Andre Deomondes",
    description: "Experiência em backend, IA aplicada, frontend, cloud, dados e qualidade de software.",
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
