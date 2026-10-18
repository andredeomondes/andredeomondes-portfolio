"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { publications, series } from "@/content/posts";
import type { ProfileSettings } from "@/lib/site-content";
import { HomeHero } from "@/features/home/components/home-hero";
import { Manifesto } from "@/features/home/components/manifesto";
import { PixelRevealCard } from "@/shared/components/editorial/pixel-reveal-card";
import type { Project } from "@/types/supabase";

const stack = ["Node.js", "TypeScript", "Python", "FastAPI", "LangChain", "PostgreSQL", "Redis", "AWS", "Astro", "React", "Playwright"];


function Marquee({ reverse = false }: { reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const sync = (visible: boolean) => node.toggleAttribute("data-active", visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => sync(entry.isIntersecting), { rootMargin: "10% 0px" });
    const onVisibility = () => sync(observer ? node.getBoundingClientRect().bottom > 0 && node.getBoundingClientRect().top < window.innerHeight : false);
    observer.observe(node);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);
  const repeated = [...stack, ...stack];
  return (
    <div ref={ref} className="home-marquee" role="region" aria-label={`Tecnologias: ${stack.join(", ")}`}>
      <div className={reverse ? "home-marquee__track home-marquee__track--reverse" : "home-marquee__track"} aria-hidden="true">
        {repeated.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
      </div>
    </div>
  );
}

const MANIFESTO =
  "Mostro o trabalho antes de explicar a competência. APIs, pagamentos, agentes de IA e deploy: cada projeto aqui está em produção, com o raciocínio documentado.";

function Work({ projects }: { projects: Project[] }) {
  const visible = projects.slice(0, 3);
  return (
    <section className="home-stage home-work" data-home-section>
      <div className="site-shell home-stage-content home-work__inner">
        <div className="section-head">
          <h2>Projetos em <span className="font-pixel">produção</span></h2>
          <Link href="/projects">0{visible.length} cases <ArrowRight className="size-4" /></Link>
        </div>
        <div className="work-bento">
          {visible.map((project, index) => (
            <PixelRevealCard
              key={project.id}
              href={`/projects/${project.slug}`}
              image={project.image_url ?? ""}
              title={project.title}
              summary={project.description}
              index={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Writing() {
  const latest = publications.slice(-3).reverse();
  return (
    <section className="home-stage home-writing" data-home-section>
      <div className="site-shell home-stage-content flex min-h-[100svh] flex-col justify-center py-24">
        <div className="home-writing__head">
          <h2>O que aprendo,<br /><span>eu documento.</span></h2>
          <div><strong>{String(series.publishedUnits).padStart(2, "0")}</strong><p>unidades publicadas</p></div>
        </div>
        <div className="home-writing__list">
          {latest.map((post, index) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} className="home-publication-row">
              <span>{String(series.publishedUnits - index).padStart(2, "0")}</span><h3>{post.title}</h3><ArrowUpRight className="size-5" />
            </Link>
          ))}
        </div>
        <div className="home-writing__action"><Link href={`/series/${series.slug}`}>Abrir a série completa <ArrowRight className="size-4" /></Link></div>
      </div>
      <Marquee reverse />
    </section>
  );
}

export function EditorialHome({ profile, projects }: { profile: ProfileSettings; projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let cleanup = () => {};
    let started = false;

    const removeStartListeners = () => {
      window.removeEventListener("pointerdown", startMotion);
      window.removeEventListener("scroll", startMotion);
      window.removeEventListener("keydown", startMotion);
    };

    const initializeMotion = () => Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
          return;
        }

        gsap.utils.toArray<HTMLElement>("[data-home-section]").slice(1).forEach((section) => {
          const content = section.querySelector<HTMLElement>(".home-stage-content");
          if (!content) return;
          gsap.from(content, { clipPath: "inset(9% 0 0 0)", scale: 0.975, transformOrigin: "center top", ease: "none", scrollTrigger: { trigger: section, start: "top 92%", end: "top 38%", scrub: 0.7 } });
        });

        gsap.utils.toArray<HTMLElement>(".home-publication-row").forEach((row, index) => {
          gsap.from(row, { xPercent: index % 2 === 0 ? -5 : 5, autoAlpha: 0.3, ease: "none", scrollTrigger: { trigger: row, start: "top 92%", end: "top 62%", scrub: 0.4 } });
        });
        ScrollTrigger.refresh();
      }, root);
      cleanup = () => context.revert();
    });

    function startMotion() {
      if (started) return;
      started = true;
      removeStartListeners();
      void initializeMotion();
    }

    window.addEventListener("pointerdown", startMotion, { once: true, passive: true });
    window.addEventListener("scroll", startMotion, { once: true, passive: true });
    window.addEventListener("keydown", startMotion, { once: true });
    return () => {
      disposed = true;
      removeStartListeners();
      cleanup();
    };
  }, []);

  return (
    <div ref={rootRef} data-home-motion className="home-experience">
      <HomeHero profile={profile} /><Marquee /><Manifesto text={MANIFESTO} highlights={["produção,", "documentado."]} /><Work projects={projects} /><Writing />
    </div>
  );
}
