import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Currículo",
  description: "Currículos ATS em português e inglês de Andre Deomondes: Backend Software Engineer, IA aplicada, cloud, dados e qualidade de software.",
  alternates: { canonical: "/resume" },
  openGraph: {
    url: "/resume",
    title: "Currículo — Andre Deomondes",
    description: "Baixe as versões PT-BR e EN do currículo ATS de Andre Deomondes.",
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
