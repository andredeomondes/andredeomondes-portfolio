import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { fallbackProjects, getFallbackProject } from "@/content/projects";
import { ProjectImageLightbox } from "@/shared/components/editorial/project-image-lightbox";
import { JsonLd } from "@/shared/components/seo/json-ld";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return fallbackProjects
    .filter((project) => project.published)
    .map((project) => ({ slug: project.slug }));
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

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function SquareList({ items, muted = false }: { items: string[]; muted?: boolean }) {
  return (
    <ul className={muted ? "square-list square-list--muted" : "square-list"}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function SectionHead({ title, accent, note, id }: { title?: string; accent: string; note: string; id?: string }) {
  return (
    <div className="section-head case-head">
      <h2 id={id}>{title ? <>{title} </> : null}<span className="font-pixel">{accent}</span></h2>
      <small className="font-pixel">{note}</small>
    </div>
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
  const words = project.title.split(" ");
  const accentWord = words.length > 1 ? words.pop() : null;
  const overview = [
    { label: "Problema", text: project.overview_problema },
    { label: "Solução", text: project.overview_solucao },
    { label: "Entrega", text: project.overview_resultado },
  ];

  return (
    <article className="page-shell case">
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
      <header className="site-shell case-hero">
        <p className="case-hero__crumb"><Link href="/projects">Projetos</Link> / <b>{pad(position + 1)}</b></p>
        <span className="case-hero__kicker"><i aria-hidden="true" />{caseStudy.kicker}</span>
        <h1>
          <span className="case-hero__num font-pixel" aria-hidden="true">{pad(position + 1)}</span>
          {words.join(" ")}
          {accentWord ? <> <span className="font-pixel case-hero__accent">{accentWord}</span></> : null}
        </h1>
        <p className="case-hero__lead">{project.description} {caseStudy.role_summary}</p>
        <dl className="case-facts" data-testid="project-facts">
          {caseStudy.facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-pixel">{fact.label.toUpperCase()}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className="case-hero__actions">
          {project.live_url ? (
            <a href={project.live_url} target="_blank" rel="noreferrer" className="hero__button hero__button--primary">Ver site no ar ↗</a>
          ) : null}
          <a href="#arquitetura" className="hero__button">Arquitetura ↓</a>
        </div>
      </header>

      <section className="site-shell case-section" aria-labelledby="contexto">
        <SectionHead id="contexto" title="Do problema à" accent="entrega" note="CONTEXTO" />
        <div className="case-triple">
          {overview.map((item, index) => (
            <div key={item.label} className="case-card">
              <h3><span className="font-pixel">{pad(index + 1)}</span>{item.label}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-shell case-section" aria-labelledby="telas">
        <SectionHead id="telas" title="As" accent="telas" note={`${pad(caseStudy.screenshots.length)} CAPTURAS · CLIQUE PARA AMPLIAR`} />
        <div className="case-screens">
          {caseStudy.screenshots.map((screenshot, index) => (
            <ProjectImageLightbox key={screenshot.src} screenshot={screenshot} priority={index === 0} />
          ))}
        </div>
      </section>

      <section className="site-shell case-section" aria-labelledby="minha-contribuicao">
        <SectionHead id="minha-contribuicao" title="O que eu" accent="fiz" note="CONTRIBUIÇÃO PESSOAL" />
        <div className="case-split">
          <div className="case-split__intro">
            <strong>{caseStudy.contribution_intro}</strong>
            <p>Abaixo, a minha contribuição separada do escopo total do produto.</p>
            <h3 className="font-pixel">ESCOPO DO PRODUTO</h3>
            <SquareList items={caseStudy.product_scope} muted />
          </div>
          <SquareList items={caseStudy.contributions} />
        </div>
      </section>

      <section className="site-shell case-section" aria-labelledby="arquitetura">
        <SectionHead id="arquitetura" accent="Arquitetura" note={`${pad(caseStudy.architecture_lanes.length)} CAMADAS`} />
        <div className="case-arch" data-testid="architecture-panel">
          <div className="live-ide__bar">
            <span className="live-ide__dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="live-ide__tab is-active">architecture.map</span>
            <span>{project.slug}</span>
            <span className="live-ide__meta"><span className="live-ide__live">● em produção</span></span>
          </div>
          <div className="case-arch__lanes" style={{ gridTemplateColumns: `repeat(${caseStudy.architecture_lanes.length}, minmax(0, 1fr))` }}>
            {caseStudy.architecture_lanes.map((lane, laneIndex) => (
              <div key={lane.label} className="case-arch__lane">
                <h3 className="font-pixel">{lane.label.toUpperCase()} <b>{pad(laneIndex + 1)}</b></h3>
                {lane.nodes.map((node) => (
                  <div key={node.title} className="case-arch__node">
                    <strong>{node.title}</strong>
                    <span>{node.detail}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell case-section" aria-labelledby="tecnologias">
        <SectionHead id="tecnologias" accent="Stack" note={`${pad(caseStudy.technology_groups.length)} GRUPOS`} />
        <div className="case-groups">
          {caseStudy.technology_groups.map((group) => (
            <div key={group.label} className="case-group">
              <h3 className="font-pixel">{group.label.toUpperCase()}</h3>
              <div>{group.items.map((item) => <span key={item}>{item}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="site-shell case-section" aria-label="Integrações, qualidade e operação">
        <div className="case-triple">
          <div className="case-card"><h3><span className="font-pixel">01</span>Integrações</h3><SquareList items={caseStudy.integrations} muted /></div>
          <div className="case-card"><h3><span className="font-pixel">02</span>Qualidade</h3><SquareList items={caseStudy.quality} muted /></div>
          <div className="case-card"><h3><span className="font-pixel">03</span>Operação</h3><SquareList items={caseStudy.operations} muted /></div>
        </div>
      </section>

      {project.aprendizados.length > 0 ? (
        <section className="site-shell case-section" aria-labelledby="aprendizados">
          <SectionHead id="aprendizados" title="O que este projeto" accent="evidencia" note="APRENDIZADOS" />
          <SquareList items={project.aprendizados} />
        </section>
      ) : null}

      {next && next.slug !== project.slug ? (
        <div className="site-shell">
          <Link href={`/projects/${next.slug}`} className="case-next">
            <span>
              <small className="font-pixel">Próximo case · {pad(published.indexOf(next) + 1)}</small>
              <strong>{next.title}</strong>
            </span>
            <ArrowUpRight className="case-next__arrow" aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </article>
  );
}
