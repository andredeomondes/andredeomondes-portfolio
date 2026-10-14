import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { normalizeSiteContent } from "@/lib/site-content";
import { TechnologyIcon } from "@/shared/components/editorial/technology-icon";
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
    <div className="min-h-screen pt-16">
      <header className="border-b border-line">
        <div className="site-shell grid gap-12 py-20 sm:py-28 lg:grid-cols-[300px_1fr] lg:items-end">
          <div data-motion="image" className="relative aspect-[4/5] overflow-hidden border border-line bg-panel">
            <Image src="/andre-deomondes-profile.webp" alt={profile.name} fill sizes="300px" className="object-cover object-top grayscale" fetchPriority="high" loading="eager" />
            <span className="absolute bottom-4 left-4 bg-signal px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink">Salvador · BA</span>
          </div>
          <div>
            <p className="label">Sobre / perfil</p>
            <h1 className="mt-6 text-[clamp(4rem,10vw,9rem)] font-semibold leading-[0.8] tracking-[-0.085em] text-paper">ENTENDER.<br /><span className="text-outline">CONSTRUIR.</span></h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-dim">{profile.longBio}</p>
            <a href={`mailto:${profile.email}`} className="button-primary mt-8">Conversar <ArrowUpRight className="size-4" /></a>
          </div>
        </div>
      </header>

      <section className="site-shell grid gap-14 py-16 sm:py-24 lg:grid-cols-[240px_1fr]">
        <div><p className="label">Experiência</p><p className="mt-4 text-sm leading-7 text-dim">Produtos reais em que atuei de ponta a ponta: interface, backend, dados, IA, deploy e operação em cloud.</p></div>
        <div className="border-t border-line">
          {about.experiences.map((item) => (
            <article key={`${item.company}-${item.role}`} data-motion="card" className="group relative grid gap-5 overflow-hidden border-b border-line px-4 py-8 transition-colors hover:bg-panel sm:grid-cols-[1fr_auto]">
              <span className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-signal transition-transform duration-300 group-hover:scale-y-100" aria-hidden="true" />
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center border border-line text-dim transition-colors group-hover:border-signal group-hover:text-signal">
                  <TechnologyIcon name={item.company} className="text-base" />
                </span>
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.04em] text-paper transition-colors group-hover:text-signal">{item.company}</h2>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-signal">{item.role}</p>
                  <ul className="mt-5 space-y-2 text-sm leading-7 text-dim">{item.bullets.map((bullet) => <li key={bullet}>— {bullet}</li>)}</ul>
                </div>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-dim transition-colors group-hover:text-paper">{item.period}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="stack" className="scroll-mt-20 border-y border-line bg-paper text-ink">
        <div className="site-shell grid gap-14 py-16 sm:py-24 lg:grid-cols-[240px_1fr]">
          <div><p className="label text-ink/50">Stack</p><p className="mt-4 text-sm leading-7 text-ink/60">Frontend, backend, IA, dados, qualidade e infraestrutura para levar um produto do código à produção.</p></div>
          <div className="border-t border-ink/20">
            {about.techStack.map((section) => (
              <div key={section.label} data-motion="item" className="group -mx-4 grid gap-5 border-b border-ink/20 px-4 py-6 transition-colors hover:bg-ink sm:grid-cols-[140px_1fr]">
                <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-ink/50 transition-colors group-hover:text-signal">{section.label}</h2>
                <div className="flex flex-wrap gap-x-5 gap-y-3">
                  {section.items.map((item) => (
                    <span key={item} className="inline-flex items-center gap-2.5 text-base font-medium tracking-[-0.02em] transition-colors group-hover:text-paper">
                      <span className="grid size-7 place-items-center border border-ink/20 text-ink/70 transition-colors group-hover:border-signal/60 group-hover:text-signal">
                        <TechnologyIcon name={item} className="text-sm" />
                      </span>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell grid gap-14 py-16 sm:py-24 lg:grid-cols-[240px_1fr]">
        <div><p className="label">Formação</p></div>
        <div className="border-t border-line">{about.education.map((item) => <div key={`${item.institution}-${item.degree}`} data-motion="item" className="group -mx-4 grid gap-3 border-b border-line px-4 py-6 transition-colors hover:bg-panel sm:grid-cols-[1fr_auto]"><div><h2 className="text-xl font-semibold tracking-[-0.035em] text-paper transition-colors group-hover:text-signal">{item.institution}</h2><p className="mt-2 text-sm text-dim">{item.degree}</p></div><span className="font-mono text-xs uppercase tracking-[0.1em] text-dim transition-colors group-hover:text-paper">{item.period}</span></div>)}</div>
      </section>
    </div>
  );
}
