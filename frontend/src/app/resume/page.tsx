import { ArrowUpRight, Download, FileText } from "lucide-react";
import Link from "next/link";

const resumes = [
  {
    language: "Português",
    locale: "PT-BR",
    title: "Currículo em português",
    description:
      "Versão para processos seletivos no Brasil, com experiência, stack, formação e produção técnica atualizadas.",
    href: "/resume/andre-deomondes-curriculo-pt-br.pdf",
    fileName: "andre-deomondes-curriculo-pt-br.pdf",
  },
  {
    language: "English",
    locale: "EN",
    title: "Resume in English",
    description:
      "English version for international Backend Software Engineering and Applied AI opportunities.",
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
    <main className="min-h-screen bg-ink text-paper">
      <section className="border-b border-line">
        <div className="site-shell grid gap-12 py-24 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Currículo
            </h1>
            <p className="mt-7 font-mono text-xs uppercase tracking-[0.14em] text-signal">
              Backend & Applied AI Engineer | Atualizado em outubro de 2026
            </p>
            <p className="mt-8 max-w-2xl text-base leading-8 text-dim sm:text-lg">
              Experiência profissional, projetos em produção, arquitetura, dados, cloud, qualidade e IA aplicada em uma apresentação direta e verificável.
            </p>
          </div>

          <div className="border border-line bg-panel p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_64px_rgba(0,0,0,0.28)] sm:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-paper">
              Perfil atual
            </h2>
            <p className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-paper">
              Andre Deomondes
            </p>
            <p className="mt-2 text-sm leading-7 text-dim">
              Backend Software Engineer na AEX, desenvolvedor full stack em projetos de consultoria e autor da série JavaScript Core.
            </p>
            <Link
              href="/projects"
              className="mt-7 inline-flex items-center gap-2 border-b border-paper/30 pb-1 font-mono text-xs uppercase tracking-[0.13em] text-paper transition-colors hover:border-signal hover:text-signal"
            >
              Ver evidências dos projetos
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line py-16 sm:py-24">
        <div className="site-shell">
          <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Escolha o idioma
          </h2>

          <div className="mt-10 grid border-l border-t border-line lg:grid-cols-2">
            {resumes.map((resume) => (
              <article key={resume.locale} className="border-b border-r border-line p-6 sm:p-9">
                <div className="flex items-start justify-between gap-6">
                  <FileText className="size-7 text-paper" strokeWidth={1.35} aria-hidden="true" />
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-dim">
                    {resume.locale} · PDF · A4
                  </span>
                </div>
                <p className="mt-12 font-mono text-xs uppercase tracking-[0.14em] text-dim">
                  {resume.language}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                  {resume.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-dim">
                  {resume.description}
                </p>
                <a
                  href={resume.href}
                  download={resume.fileName}
                  className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-[10px] bg-paper px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-signal hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Baixar PDF
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line py-16 sm:py-24">
        <div className="site-shell grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Compatível sem parecer genérico.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-dim">
              O documento preserva a identidade visual do portfólio apenas na hierarquia, tipografia e linha de sinal. A estrutura continua simples para leitura por recrutadores e sistemas automatizados.
            </p>
          </div>

          <div className="border-t border-line">
            {atsPrinciples.map((principle) => (
              <div
                key={principle}
                className="flex items-center justify-between gap-8 border-b border-line py-5"
              >
                <span className="text-sm font-medium sm:text-base">{principle}</span>
                <span className="size-2 shrink-0 bg-signal" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
