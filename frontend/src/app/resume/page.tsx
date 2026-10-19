import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { PageIntro, SplitSection } from "@/shared/components/editorial/page-intro";
import { Spotlight } from "@/shared/components/fx/spotlight";

export const metadata: Metadata = {
  title: "Currículo",
  description: "Currículo de Andre Deomondes em português e inglês, pronto para ATS.",
  alternates: { canonical: "/resume" },
};

const resumes = [
  {
    language: "Português",
    title: "Currículo em português",
    description: "Versão para processos seletivos no Brasil, com experiência, stack, formação e produção técnica atualizadas.",
    href: "/resume/andre-deomondes-curriculo-pt-br.pdf",
    fileName: "andre-deomondes-curriculo-pt-br.pdf",
  },
  {
    language: "English",
    title: "Resume in English",
    description: "English version for international Backend Software Engineering and Applied AI opportunities.",
    href: "/resume/andre-deomondes-resume-en.pdf",
    fileName: "andre-deomondes-resume-en.pdf",
  },
] as const;

const atsPrinciples = [
  "Uma coluna e ordem de leitura linear",
  "Texto selecionável e fontes incorporadas",
  "Títulos de seção reconhecidos por ATS",
  "Palavras-chave dentro de contexto real",
  "Sem foto, gráficos ou barras de habilidade",
];

export default function ResumePage() {
  return (
    <div className="page">
      <PageIntro
        title="Currículo."
        muted="Atualizado em outubro de 2026."
        lead="Experiência profissional, projetos em produção, arquitetura, dados, cloud, qualidade e IA aplicada, numa apresentação direta e verificável."
      />

      <section className="resume-grid rail-cell" aria-label="Downloads">
        {resumes.map((resume) => (
          <Spotlight as="article" key={resume.href} className="resume-card">
            <div className="resume-card__doc" aria-hidden="true">
              <FileText />
              <span className="mono">{resume.fileName}</span>
            </div>
            <p className="resume-card__lang">{resume.language}</p>
            <h2 className="resume-card__title">{resume.title}</h2>
            <p className="resume-card__desc">{resume.description}</p>
            <a href={resume.href} download={resume.fileName} className="btn btn--primary resume-card__cta">
              <Download size={16} aria-hidden="true" /> Baixar PDF
            </a>
          </Spotlight>
        ))}
      </section>

      <SplitSection id="ats" title="Compatível com ATS." muted="Sem perder a clareza para quem lê.">
        <ul className="line-list">
          {atsPrinciples.map((principle) => <li key={principle}>{principle}</li>)}
        </ul>
      </SplitSection>
    </div>
  );
}
