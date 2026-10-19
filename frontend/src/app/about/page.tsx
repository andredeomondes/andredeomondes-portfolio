import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { normalizeSiteContent } from "@/lib/site-content";
import { AttributeBars } from "@/shared/components/editorial/attribute-bars";
import { getCachedPublicSettings } from "@/server/services/settings";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Sobre",
  description: "Experiência de Andre Deomondes em backend, frontend, IA aplicada, dados, cloud, testes e produtos digitais.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: "Sobre Andre Deomondes", images: ["/andre-deomondes-profile.webp"] },
};

export default async function AboutPage() {
  const settings = await getCachedPublicSettings().catch(() => ({}));
  const { profile, about } = normalizeSiteContent(settings);

  return (
    <div className="page-shell about">
      <header className="site-shell about-hero">
        <div className="about-hero__portrait">
          <Image src="/andre-deomondes-profile.webp" alt={profile.name} fill sizes="(max-width: 860px) 100vw, 360px" className="object-cover object-top" fetchPriority="high" loading="eager" />
          <span className="about-hero__tag">{profile.location}</span>
        </div>
        <div>
          <p className="page-intro__eyebrow"><b aria-hidden="true">●</b> SOBRE · PERFIL</p>
          <h1>Entender.<br /><span className="font-pixel">Construir</span>.</h1>
          <p className="about-hero__bio">{profile.longBio}</p>
          <AttributeBars items={profile.attributes} />
          <a href={`mailto:${profile.email}`} className="hero__button hero__button--primary about-hero__cta">Conversar <ArrowUpRight className="size-4" /></a>
        </div>
      </header>

      <section className="site-shell case-section" aria-labelledby="experiencia">
        <div className="section-head case-head">
          <h2 id="experiencia"><span className="font-pixel">Experiência</span></h2>
          <small className="font-pixel">{String(about.experiences.length).padStart(2, "0")} FASES</small>
        </div>
        <ol className="timeline">
          {about.experiences.map((item) => (
            <li key={`${item.company}-${item.role}`} className="timeline__item">
              <div className="timeline__head">
                <h3>{item.company}</h3>
                <span className="timeline__period">{item.period}</span>
              </div>
              <p className="timeline__role">{item.role}</p>
              <ul className="square-list square-list--muted">{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            </li>
          ))}
        </ol>
      </section>

      <section id="stack" className="site-shell case-section" aria-labelledby="stack-title">
        <div className="section-head case-head">
          <h2 id="stack-title"><span className="font-pixel">Stack</span></h2>
          <small className="font-pixel">DO CÓDIGO À PRODUÇÃO</small>
        </div>
        <div className="case-groups">
          {about.techStack.map((section) => (
            <div key={section.label} className="case-group">
              <h3 className="font-pixel">{section.label.toUpperCase()}</h3>
              <div>{section.items.map((item) => <span key={item}>{item}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="site-shell case-section" aria-labelledby="formacao">
        <div className="section-head case-head">
          <h2 id="formacao"><span className="font-pixel">Formação</span></h2>
        </div>
        <ul className="square-list">
          {about.education.map((item) => (
            <li key={`${item.institution}-${item.degree}`}>
              <span className="education-row">
                <strong>{item.institution}</strong>
                <span>{item.degree} · {item.period}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
