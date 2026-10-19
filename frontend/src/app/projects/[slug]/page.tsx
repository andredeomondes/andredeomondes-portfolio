import { createElement } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, AlertTriangle, ArrowUpRight, BriefcaseBusiness, Clock3, Cloud, Handshake, Layers3, Lightbulb, Rocket, Users, type LucideIcon } from "lucide-react";
import { TechChip } from "@/shared/components/brand/tech-icon";

const FACT_ICONS: Record<string, LucideIcon> = { Papel: BriefcaseBusiness, Modelo: Handshake, Equipe: Users, "Duração": Clock3, Status: Activity, Produto: Layers3, Infraestrutura: Cloud };
import { fallbackProjects, getFallbackProject } from "@/content/projects";
import { ProjectImageLightbox } from "@/shared/components/editorial/project-image-lightbox";
import { SplitSection } from "@/shared/components/editorial/page-intro";
import { ArchitectureMap } from "@/features/projects/architecture-map";
import { JsonLd } from "@/shared/components/seo/json-ld";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return fallbackProjects.filter((project) => project.published).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getFallbackProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Estudo de caso`,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/projects/${project.slug}`,
      title: `${project.title} — Estudo de caso`,
      description: project.description,
      images: project.image_url ? [project.image_url] : undefined,
    },
  };
}

function List({ items, muted = false }: { items: string[]; muted?: boolean }) {
  return (
    <ul className={muted ? "line-list line-list--muted" : "line-list"}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export default async function ProjectCasePage({ params }: PageProps) {
  const { slug } = await params;
  const project = getFallbackProject(slug);
  if (!project || !project.published) notFound();

  const published = fallbackProjects.filter((item) => item.published);
  const position = published.findIndex((item) => item.slug === project.slug);
  const next = published[(position + 1) % published.length];
  const caseStudy = project.case_study;
  const [lead, ...gallery] = caseStudy.screenshots;

  return (
    <article className="page case">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CreativeWork",
              "@id": `${absoluteUrl(`/projects/${project.slug}`)}#case-study`,
              name: project.title,
              headline: `${project.title} — estudo de caso`,
              description: project.description,
              url: absoluteUrl(`/projects/${project.slug}`),
              image: project.image_url ? absoluteUrl(project.image_url) : undefined,
              author: { "@type": "Person", name: SITE_NAME, url: absoluteUrl("/") },
              keywords: project.tech_stack,
              inLanguage: "pt-BR",
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Projetos", item: absoluteUrl("/projects") },
                { "@type": "ListItem", position: 3, name: project.title, item: absoluteUrl(`/projects/${project.slug}`) },
              ],
            },
          ],
        }}
      />

      <header className="case-hero rail-cell">
        <nav className="case-hero__crumb" aria-label="Trilha">
          <Link href="/projects">Projetos</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{project.title}</span>
        </nav>
        <p className="case-hero__kicker">{caseStudy.kicker}</p>
        <h1 className="case-hero__title">{project.title}</h1>
        <p className="case-hero__lead">{project.description}</p>
        <p className="case-hero__role">{caseStudy.role_summary}</p>
        <div className="case-hero__actions">
          {project.live_url ? (
            <a href={project.live_url} target="_blank" rel="noreferrer" className="btn btn--primary">
              Abrir o produto <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ) : null}
          <a href="#arquitetura" className="btn">Ver a arquitetura</a>
        </div>
      </header>

      <dl className="case-facts rail-cell" data-testid="project-facts">
        {caseStudy.facts.map((fact) => (
          <div key={fact.label}>
            <dt>{createElement(FACT_ICONS[fact.label] ?? Layers3, { className: "icon-inline", "aria-hidden": true })}{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      {lead ? (
        <div className="case-cover rail-cell">
          <div className="case-cover__light" aria-hidden="true" />
          <div className="window case-cover__window">
            <div className="window__bar">
              <span className="window__dots"><i /><i /><i /></span>
              <span>{project.live_url?.replace(/^https?:\/\//, "") ?? project.slug}</span>
            </div>
            <div className="case-cover__frame" style={{ aspectRatio: `${lead.width} / ${lead.height}` }}>
              <Image src={lead.src} alt={lead.alt} fill priority sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover object-top" />
            </div>
          </div>
        </div>
      ) : null}

      <SplitSection id="contexto" title="Do problema" muted="à entrega.">
        <dl className="case-story">
          <div><dt><AlertTriangle className="icon-inline" aria-hidden="true" />Problema</dt><dd>{project.overview_problema}</dd></div>
          <div><dt><Lightbulb className="icon-inline" aria-hidden="true" />Solução</dt><dd>{project.overview_solucao}</dd></div>
          <div><dt><Rocket className="icon-inline" aria-hidden="true" />Entrega</dt><dd>{project.overview_resultado}</dd></div>
        </dl>
      </SplitSection>

      <SplitSection id="minha-contribuicao" title="O que eu fiz." muted={caseStudy.contribution_intro}>
        <List items={caseStudy.contributions} />
        <h3 className="case-subtitle">Escopo do produto</h3>
        <List items={caseStudy.product_scope} muted />
      </SplitSection>

      <section className="case-arch-section rail-cell" aria-labelledby="arquitetura">
        <h2 id="arquitetura" className="section-title">
          Arquitetura.
          <span className="muted">Uma visão em alto nível das partes confirmadas do sistema.</span>
        </h2>
        <ArchitectureMap lanes={caseStudy.architecture_lanes} slug={project.slug} />
      </section>

      {gallery.length > 0 || lead ? (
        <section className="case-gallery rail-cell" aria-labelledby="telas">
          <h2 id="telas" className="section-title">
            Telas reais.
            <span className="muted">Clique para ampliar.</span>
          </h2>
          <div className="case-gallery__grid">
            {caseStudy.screenshots.map((screenshot) => <ProjectImageLightbox key={screenshot.src} screenshot={screenshot} />)}
          </div>
        </section>
      ) : null}

      <SplitSection id="tecnologias" title="Stack" muted="e integrações.">
        <div className="case-stack">
          {caseStudy.technology_groups.map((group) => (
            <div key={group.label}>
              <h3>{group.label}</h3>
              <ul>{group.items.map((item) => <TechChip key={item} name={item} />)}</ul>
            </div>
          ))}
          <div>
            <h3>Integrações</h3>
            <ul>{caseStudy.integrations.map((item) => <TechChip key={item} name={item} />)}</ul>
          </div>
        </div>
      </SplitSection>

      <SplitSection id="qualidade" title="Qualidade" muted="e operação.">
        <List items={caseStudy.quality} />
        <h3 className="case-subtitle">Em produção</h3>
        <List items={caseStudy.operations} muted />
      </SplitSection>

      {project.aprendizados.length > 0 ? (
        <SplitSection id="aprendizados" title="O que este projeto" muted="evidencia.">
          <List items={project.aprendizados} />
        </SplitSection>
      ) : null}

      {next && next.slug !== project.slug ? (
        <Link href={`/projects/${next.slug}`} className="case-next rail-cell" aria-label={`Próximo case: ${next.title}`}>
          <span className="case-next__label">Próximo case</span>
          <span className="case-next__title">{next.title}</span>
          <span className="case-next__image" aria-hidden="true">
            <Image src={next.image_url || "/clubeprogramacao.webp"} alt="" fill sizes="(max-width: 860px) 100vw, 50vw" className="object-cover object-top" />
          </span>
          <ArrowUpRight className="case-next__arrow" aria-hidden="true" />
        </Link>
      ) : null}
    </article>
  );
}
