import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Clock3,
  Cloud,
  Handshake,
  Layers3,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getFallbackProject } from "@/content/projects";
import { ProjectImageLightbox } from "@/shared/components/editorial/project-image-lightbox";
import { TechnologyIcon } from "@/shared/components/editorial/technology-icon";

type PageProps = { params: Promise<{ slug: string }> };

const factIcons: Record<string, LucideIcon> = {
  Papel: BriefcaseBusiness,
  Modelo: Handshake,
  Equipe: Users,
  Duração: Clock3,
  Status: Activity,
  Produto: Layers3,
  Infraestrutura: Cloud,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getFallbackProject(slug);

  if (!project) return {};

  return {
    title: `${project.title} — Estudo de caso`,
    description: project.description,
    openGraph: project.image_url ? { images: [project.image_url] } : undefined,
  };
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ul className="border-t border-line">
      {items.map((item, index) => (
        <li key={item} data-motion="item" className="grid grid-cols-[34px_1fr] gap-3 border-b border-line py-4 text-sm leading-7 text-paper">
          <span className="font-mono text-[10px] text-signal">{String(index + 1).padStart(2, "0")}</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectCasePage({ params }: PageProps) {
  const { slug } = await params;
  const project = getFallbackProject(slug);
  if (!project || !project.published) notFound();

  const caseStudy = project.case_study;
  const overview = [
    { label: "Problema", text: project.overview_problema },
    { label: "Solução", text: project.overview_solucao },
    { label: "Entrega", text: project.overview_resultado },
  ];

  return (
    <article className="min-h-screen pt-16">
      <header className="relative overflow-hidden border-b border-line">
        <div className="technical-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="site-shell relative py-14 sm:py-20">
          <Link href="/projects" className="label inline-flex items-center gap-2 transition-colors hover:text-signal">
            <ArrowLeft className="size-3" /> Projetos
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <p className="label text-signal">{caseStudy.kicker} / Estudo de caso</p>
              <h1 className="mt-5 max-w-5xl text-[clamp(3.4rem,8vw,7.5rem)] font-semibold leading-[0.86] tracking-[-0.075em] text-paper">
                {project.title}
              </h1>
            </div>
            <div className="border-l border-line pl-6">
              <p className="text-lg leading-8 text-paper">{project.description}</p>
              <p className="mt-5 text-sm leading-7 text-dim">{caseStudy.role_summary}</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {project.live_url ? (
              <a href={project.live_url} target="_blank" rel="noreferrer" className="button-primary">
                Visitar produto <ArrowUpRight className="size-4" />
              </a>
            ) : null}
            <a href="#minha-contribuicao" className="button-secondary">Ver minha contribuição</a>
          </div>
        </div>
      </header>

      <section className="border-b border-line" aria-label="Informações principais do projeto">
        <div className="site-shell grid border-x border-line sm:grid-cols-2 lg:grid-cols-4">
          {caseStudy.facts.map((fact) => {
            const FactIcon = factIcons[fact.label] ?? Layers3;

            return (
              <div key={fact.label} data-motion="card" className="border-b border-line p-5 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="label">{fact.label}</p>
                  <FactIcon className="size-4 text-signal" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm font-medium text-paper">{fact.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      <nav className="border-b border-line bg-ink" aria-label="Seções do estudo de caso">
        <div className="site-shell flex gap-6 overflow-x-auto py-4">
          {[
            ["visao-geral", "Visão geral"],
            ["telas", "Telas"],
            ["minha-contribuicao", "Contribuição"],
            ["arquitetura", "Arquitetura"],
            ["tecnologias", "Tecnologias"],
            ["operacao", "Deploy"],
            ["qualidade", "Qualidade"],
          ].map(([href, label]) => (
            <a key={href} href={`#${href}`} className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:text-signal">
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="visao-geral" className="site-shell scroll-mt-24 py-16 sm:py-24">
        <div className="section-heading">
          <div>
            <p className="label text-signal">01 / Contexto</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-paper sm:text-5xl">Do problema à entrega.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-dim">O case descreve entregas verificáveis. Nenhuma métrica foi estimada ou criada para preencher a narrativa.</p>
        </div>

        <div className="mt-10 grid gap-px border border-line bg-line lg:grid-cols-3">
          {overview.map((item, index) => (
            <section key={item.label} data-motion="card" className="bg-ink p-6 sm:p-8">
              <p className="label text-signal">{String(index + 1).padStart(2, "0")} / {item.label}</p>
              <p className="mt-6 text-base leading-8 text-dim">{item.text}</p>
            </section>
          ))}
        </div>
      </section>

      <section id="telas" className="scroll-mt-24 border-y border-line bg-paper text-ink">
        <div className="site-shell py-16 sm:py-24">
          <div className="section-heading">
            <div>
              <p className="label text-ink/60">02 / Produto real</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Telas e fluxos.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-ink/65">Capturas reais do produto, preservadas sem mockups gerados ou números tratados como resultado.</p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {caseStudy.screenshots.map((screenshot, index) => (
              <div key={screenshot.src} className={index === 0 ? "lg:col-span-2" : undefined}>
                <ProjectImageLightbox screenshot={screenshot} priority={index === 0} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="minha-contribuicao" className="site-shell scroll-mt-24 py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          <div>
            <p className="label text-signal">03 / Responsabilidade</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-paper sm:text-5xl">Minha contribuição.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-dim">{caseStudy.contribution_intro}</p>
            <div className="mt-8">
              <NumberedList items={caseStudy.contributions} />
            </div>
          </div>

          <aside className="border border-line bg-panel p-6 sm:p-8">
            <p className="label">Escopo do produto</p>
            <ul className="mt-7 space-y-5">
              {caseStudy.product_scope.map((item) => (
                <li key={item} data-motion="item" className="flex gap-3 text-sm leading-7 text-dim">
                  <Check className="mt-1.5 size-3.5 shrink-0 text-signal" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section id="arquitetura" className="relative scroll-mt-24 overflow-hidden border-y border-line bg-panel">
        <div className="technical-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="site-shell relative py-16 sm:py-24">
          <div className="section-heading">
            <div>
              <p className="label text-signal">04 / Sistema</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-paper sm:text-5xl">Arquitetura em alto nível.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-dim">Uma visão intencionalmente simples das partes confirmadas do sistema, sem expor detalhes sensíveis ou presumir serviços não informados.</p>
          </div>

          <div className="mt-12 space-y-5">
            {caseStudy.architecture_lanes.map((lane, laneIndex) => (
              <div key={lane.label} data-motion="lane" className="border border-line bg-ink/90 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-signal">L{String(laneIndex + 1).padStart(2, "0")}</span>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-paper">{lane.label}</h3>
                </div>
                <div className="mt-5 flex flex-col md:flex-row md:items-stretch">
                  {lane.nodes.map((node, nodeIndex) => (
                    <div key={`${lane.label}-${node.title}`} className="contents">
                      <div data-motion="node" className="min-w-0 flex-1 border border-line bg-panel p-4">
                        <div className="flex items-start gap-3">
                          <span className="grid size-8 shrink-0 place-items-center border border-line text-signal">
                            <TechnologyIcon name={`${node.title} ${node.detail}`} className="text-sm" maxIcons={2} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-paper">{node.title}</p>
                            <p className="mt-1.5 text-xs leading-5 text-dim">{node.detail}</p>
                          </div>
                        </div>
                      </div>
                      {nodeIndex < lane.nodes.length - 1 ? (
                        <span data-motion="link" className="grid h-8 shrink-0 place-items-center font-mono text-sm text-signal md:h-auto md:w-10" aria-hidden="true">
                          <span className="md:hidden">↓</span><span className="hidden md:inline">→</span>
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tecnologias" className="site-shell scroll-mt-24 py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-20">
          <div>
            <p className="label text-signal">05 / Implementação</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-paper sm:text-5xl">Tecnologias utilizadas.</h2>
            <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2">
              {caseStudy.technology_groups.map((group, index) => (
                <section
                  key={group.label}
                  data-motion="card"
                  className={`bg-ink p-6 ${caseStudy.technology_groups.length % 2 === 1 && index === caseStudy.technology_groups.length - 1 ? "sm:col-span-2" : ""}`}
                >
                  <h3 className="label text-paper">{group.label}</h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.11em] text-dim">
                        <TechnologyIcon name={item} className="text-xs text-paper" />
                        {item}
                      </span>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside className="border-l border-line pl-6 sm:pl-8">
            <p className="label">Integrações confirmadas</p>
            <ul className="mt-6">
              {caseStudy.integrations.map((integration) => (
                <li key={integration} data-motion="item" className="flex items-center gap-3 border-b border-line py-4 text-sm text-paper">
                  <span className="grid size-7 place-items-center border border-line text-signal">
                    <TechnologyIcon name={integration} className="text-xs" />
                  </span>
                  {integration}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section id="operacao" className="scroll-mt-24 border-t border-line bg-panel">
        <div className="site-shell grid gap-12 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="label text-signal">06 / Produção</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-paper sm:text-5xl">Hospedagem, deploy e operação.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-dim">Como as partes confirmadas do produto chegam e permanecem em produção.</p>
          </div>
          <ul className="border-t border-line">
            {caseStudy.operations.map((item, index) => (
              <li key={item} data-motion="item" className="grid grid-cols-[34px_1fr] gap-4 border-b border-line py-5 text-sm leading-7 text-paper">
                <span className="font-mono text-[10px] text-signal">{String(index + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="qualidade" className="scroll-mt-24 border-y border-line bg-paper text-ink">
        <div className="site-shell grid gap-12 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="label text-ink/60">07 / Engenharia</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Qualidade faz parte da entrega.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-ink/65">Práticas aplicadas no projeto, descritas sem atribuir notas ou resultados que não foram informados.</p>
          </div>
          <ul className="border-t border-ink/15">
            {caseStudy.quality.map((item, index) => (
              <li key={item} data-motion="item" className="grid grid-cols-[34px_1fr] gap-4 border-b border-ink/15 py-5 text-sm leading-7">
                <span className="font-mono text-[10px] font-semibold">{String(index + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="site-shell py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <p className="label text-signal">08 / Aprendizados</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-paper sm:text-5xl">O que este projeto evidencia.</h2>
          </div>
          <NumberedList items={project.aprendizados} />
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-8 border-t border-line pt-10 sm:flex-row sm:items-end">
          <div>
            <p className="label">Próximo passo</p>
            <p className="mt-3 max-w-xl text-2xl font-semibold tracking-[-0.04em] text-paper">Veja o produto em funcionamento ou continue pelos outros estudos de caso.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="button-secondary">Outros projetos</Link>
            {project.live_url ? (
              <a href={project.live_url} target="_blank" rel="noreferrer" className="button-primary">
                Abrir produto <ArrowUpRight className="size-4" />
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </article>
  );
}
