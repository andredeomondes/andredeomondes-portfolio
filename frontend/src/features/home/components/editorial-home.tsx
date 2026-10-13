import Link from "next/link";
import { ArrowRight, ArrowUpRight, Braces, Database, Sparkles } from "lucide-react";
import { publications, series } from "@/content/posts";
import { PublicationCard } from "@/shared/components/editorial/publication-card";
import type { ProfileSettings } from "@/lib/site-content";
import type { Project } from "@/types/supabase";
import { TechnologyIcon } from "@/shared/components/editorial/technology-icon";

const principles = [
  {
    icon: Braces,
    index: "01",
    title: "Contratos antes de abstrações",
    text: "Interfaces, erros e limites explícitos antes da camada de conveniência.",
  },
  {
    icon: Database,
    index: "02",
    title: "Dados contam a arquitetura",
    text: "Modelagem, consistência e observabilidade como parte do produto.",
  },
  {
    icon: Sparkles,
    index: "03",
    title: "IA aplicada, sem teatro",
    text: "Automação mensurável em fluxos reais, com contexto, avaliação e controle.",
  },
];

function Hero({ profile }: { profile: ProfileSettings }) {
  return (
    <section className="relative overflow-hidden border-b border-line pt-24 sm:pt-28">
      <div className="technical-grid absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="site-shell relative min-h-[740px]">
        <div className="flex min-h-[740px] flex-col justify-between py-16 sm:py-24">
          <div className="flex items-center gap-3">
            <span className="signal-square" />
            <p className="label text-paper">Backend &amp; Applied AI Engineer</p>
          </div>

          <div className="relative py-16">
            <div className="hero-signal-loop pointer-events-none absolute right-0 top-1/2 hidden w-[44%] -translate-y-1/2 lg:block" aria-hidden="true">
              <svg viewBox="0 0 620 220" fill="none" className="w-full" preserveAspectRatio="xMidYMid meet">
                <path className="hero-signal-loop__base" d="M16 174H132L206 100H361L438 24H604" />
                <path className="hero-signal-loop__pulse" d="M16 174H132L206 100H361L438 24H604" />
                <circle cx="16" cy="174" r="4" className="hero-signal-loop__node" />
                <circle cx="206" cy="100" r="4" className="hero-signal-loop__node hero-signal-loop__node--delay" />
                <circle cx="438" cy="24" r="4" className="hero-signal-loop__node hero-signal-loop__node--late" />
                <path className="hero-signal-loop__tick" d="M132 158V190M361 84V116M604 8V40" />
              </svg>
            </div>

            <h1 className="relative z-10 max-w-[11ch] text-[clamp(3rem,12vw,4rem)] font-semibold leading-[0.78] tracking-[-0.085em] text-paper sm:text-[clamp(4rem,12vw,10.5rem)]">
              ANDRE
              <span className="block text-outline">DEOMONDES.</span>
            </h1>
            <p className="relative z-10 mt-10 max-w-2xl text-lg leading-8 text-dim sm:text-xl">
              Projeto backends, produtos digitais e sistemas com IA aplicada — e documento o raciocínio que existe entre o problema e o código.
            </p>
          </div>

          <div className="flex flex-col gap-8 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <Link href="/projects" className="button-primary">
                Ver projetos <ArrowRight className="size-4" />
              </Link>
              <Link href="/posts" className="button-secondary">
                Ler publicações
              </Link>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
              {profile.location} · sistemas em produção
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Principles() {
  return (
    <section className="border-b border-line">
      <div className="site-shell py-20 sm:py-28">
        <div className="section-heading">
          <div>
            <p className="label">Modo de construir</p>
            <h2 className="editorial-title mt-4">Engenharia que deixa evidência.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-dim">
            Cada decisão técnica precisa conseguir explicar o problema que resolve, o custo que assume e como será observada em produção.
          </p>
        </div>

        <div className="mt-14 grid border-l border-t border-line md:grid-cols-3">
          {principles.map((principle) => (
            <article key={principle.index} data-motion="card" className="min-h-72 border-b border-r border-line p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <principle.icon className="size-6 text-signal" strokeWidth={1.5} />
                <span className="font-mono text-xs text-dim">[{principle.index}]</span>
              </div>
              <h3 className="mt-16 text-2xl font-semibold tracking-[-0.04em] text-paper">{principle.title}</h3>
              <p className="mt-4 text-sm leading-7 text-dim">{principle.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SeriesPreview() {
  const latest = publications.slice(-3).reverse();

  return (
    <section className="border-b border-line">
      <div className="site-shell py-20 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div>
            <p className="label">Série em andamento · {series.publishedUnits}/{series.totalUnits}</p>
            <h2 className="editorial-title mt-4">{series.title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-dim">{series.description}</p>
          </div>
          <Link href={`/series/${series.slug}`} className="button-secondary lg:justify-self-end">
            Explorar a série <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-14">
          {latest.map((post, index) => <PublicationCard key={post.slug} post={post} priority={index === 0} />)}
        </div>
      </div>
    </section>
  );
}

function Projects({ projects }: { projects: Project[] }) {
  const visible = projects.slice(0, 3);

  return (
    <section className="border-b border-line bg-paper text-ink">
      <div className="site-shell py-20 sm:py-28">
        <div className="section-heading border-ink/20">
          <div>
            <p className="label text-ink/55">Trabalho selecionado</p>
            <h2 className="editorial-title mt-4 text-ink">Sistemas em produção.</h2>
          </div>
          <Link href="/projects" className="button-ink">Todos os projetos <ArrowRight className="size-4" /></Link>
        </div>

        <div className="mt-14 border-t border-ink/20">
          {visible.length > 0 ? visible.map((project, index) => (
            <Link key={project.id} href={`/projects/${project.slug}`} data-motion="item" className="group grid gap-6 border-b border-ink/20 py-8 md:grid-cols-[72px_1fr_auto] md:items-center">
              <span className="font-mono text-sm text-ink/50">0{index + 1}</span>
              <div>
                <div className="flex items-center gap-4">
                  <span className="grid size-10 shrink-0 place-items-center border border-ink/20 text-ink/70">
                    <TechnologyIcon name={`${project.title} ${project.tags.join(" ")}`} className="text-lg" />
                  </span>
                  <h3 className="text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">{project.title}</h3>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/60">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map((tag) => <span key={tag} className="border border-ink/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">{tag}</span>)}
                </div>
              </div>
              <ArrowUpRight className="size-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          )) : (
            <div className="border-b border-ink/20 py-14 text-ink/60">Projetos serão carregados da sua base assim que ela estiver disponível.</div>
          )}
        </div>
      </div>
    </section>
  );
}

function Contact({ profile }: { profile: ProfileSettings }) {
  return (
    <section className="relative overflow-hidden">
      <div className="technical-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="site-shell relative py-24 sm:py-32">
        <p className="label">Canal aberto</p>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="max-w-5xl text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.86] tracking-[-0.075em] text-paper">
            VAMOS CONSTRUIR ALGO QUE FUNCIONE.
          </h2>
          <a className="button-primary whitespace-nowrap" href={`mailto:${profile.email}`}>Iniciar conversa <ArrowUpRight className="size-4" /></a>
        </div>
      </div>
    </section>
  );
}

export function EditorialHome({ profile, projects }: { profile: ProfileSettings; projects: Project[] }) {
  return (
    <>
      <Hero profile={profile} />
      <Principles />
      <SeriesPreview />
      <Projects projects={projects} />
      <Contact profile={profile} />
    </>
  );
}
