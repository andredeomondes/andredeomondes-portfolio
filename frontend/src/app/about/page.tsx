import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { normalizeSiteContent } from "@/lib/site-content";
import { getCachedPublicSettings } from "@/server/services/settings";
import { SplitSection } from "@/shared/components/editorial/page-intro";
import { Timeline } from "@/features/about/timeline";
import { TechChip } from "@/shared/components/brand/tech-icon";

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
    <div className="page about">
      <header className="about-hero rail-cell">
        <div className="about-hero__copy">
          <h1 className="page-intro__title">
            {profile.name}.
            <span className="muted">{profile.role} em {profile.location.split(",")[0]}.</span>
          </h1>
          <p className="about-hero__bio">{profile.longBio}</p>
          <div className="about-hero__actions">
            <Link href="/resume" className="btn btn--primary">Ver currículo <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <a href={profile.social.github} target="_blank" rel="noreferrer" className="btn">GitHub</a>
            <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="btn">LinkedIn</a>
          </div>
        </div>
        <div className="about-hero__portrait">
          <div className="about-hero__light" aria-hidden="true" />
          <div className="window about-hero__window">
            <div className="window__bar">
              <span className="window__dots"><i /><i /><i /></span>
              <span>andre.webp</span>
            </div>
            <div className="about-hero__frame">
              <Image src="/andre-deomondes-profile.webp" alt={profile.name} fill sizes="(max-width: 960px) 100vw, 440px" className="object-cover object-top" priority />
            </div>
          </div>
        </div>
      </header>

      <SplitSection id="experiencia" title="Experiência." muted="Produtos reais, de ponta a ponta.">
        <Timeline items={about.experiences} />
      </SplitSection>

      <SplitSection id="stack" title="Stack." muted="Do código à produção.">
        <div className="case-stack">
          {about.techStack.map((section) => (
            <div key={section.label}>
              <h3>{section.label}</h3>
              <ul>{section.items.map((item) => <TechChip key={item} name={item} />)}</ul>
            </div>
          ))}
        </div>
      </SplitSection>

      <SplitSection id="formacao" title="Formação.">
        <ul className="line-list">
          {about.education.map((item) => (
            <li key={`${item.institution}-${item.degree}`}>
              <strong>{item.institution}</strong>
              <span className="about-edu">{item.degree} · {item.period}</span>
            </li>
          ))}
        </ul>
      </SplitSection>
    </div>
  );
}
