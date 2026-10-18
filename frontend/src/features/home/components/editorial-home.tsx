"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { publications, series } from "@/content/posts";
import type { ProfileSettings } from "@/lib/site-content";
import { HomeHero } from "@/features/home/components/home-hero";
import { TechnologyIcon } from "@/shared/components/editorial/technology-icon";
import type { Project } from "@/types/supabase";

const stack = ["Node.js", "Fastify", "Python", "FastAPI", "PostgreSQL", "Redis", "AWS", "React", "TypeScript", "Playwright"];

const disciplines = [
  { name: "Backend", detail: "APIs, regras de negócio e integrações" },
  { name: "IA aplicada", detail: "Agentes, contexto e automação real" },
  { name: "Produto", detail: "Da interface à operação" },
  { name: "Cloud", detail: "Deploy, dados e observabilidade" },
];

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
        {repeated.map((item, index) => <span key={`${item}-${index}`}><TechnologyIcon name={item} className="home-marquee__icon" />{item}</span>)}
      </div>
    </div>
  );
}

function Practice() {
  return (
    <section id="atuacao" className="home-stage home-practice" data-home-section>
      <div className="home-stage-content flex min-h-[100svh] flex-col justify-between">
        <div className="site-shell home-practice__head">
          <h2 className="home-display">
            <span className="home-scroll-word" data-direction="left">DO CÓDIGO</span>
            <span className="home-scroll-word home-display--outline" data-direction="right">À PRODUÇÃO.</span>
          </h2>
        </div>
        <div className="home-practice__disciplines">
          <div className="site-shell grid md:grid-cols-4">
            {disciplines.map((item, index) => (
              <div key={item.name} className="home-practice__discipline">
                <span>0{index + 1}</span><h3>{item.name}</h3><p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <Marquee />
      </div>
    </section>
  );
}

function Work({ projects }: { projects: Project[] }) {
  const visible = projects.slice(0, 3);
  return (
    <section className="home-stage home-work" data-home-section>
      <div className="site-shell home-stage-content flex min-h-[100svh] flex-col py-20 pt-28">
        <div className="home-work__heading">
          <h2>Produtos reais.<br /><span>Responsabilidade real.</span></h2>
          <Link href="/projects">Ver todos <ArrowRight className="size-4" /></Link>
        </div>
        <div className="home-work__grid">
          {visible.map((project, index) => (
            <Link key={project.id} href={`/projects/${project.slug}`} className="home-project">
              <div className="home-project__image" data-home-project-image>
                {project.image_url ? <Image src={project.image_url} alt="" fill sizes="(max-width: 767px) 78vw, 33vw" className="object-cover" /> : null}
              </div>
              <div className="home-project__meta">
                <span>0{index + 1}</span>
                <div><h3>{project.title}</h3><p>{project.tags.slice(0, 3).join(" · ")}</p></div>
                <ArrowUpRight className="size-5" />
              </div>
            </Link>
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

        gsap.utils.toArray<HTMLElement>(".home-scroll-word").forEach((word) => {
          const direction = word.dataset.direction === "right" ? 1 : -1;
          gsap.fromTo(word, { xPercent: direction * 7 }, { xPercent: direction * -7, ease: "none", scrollTrigger: { trigger: word.closest("section"), start: "top bottom", end: "bottom top", scrub: 0.55 } });
        });

        gsap.utils.toArray<HTMLElement>("[data-home-project-image] img").forEach((image, index) => {
          gsap.fromTo(image, { yPercent: -5 - index }, { yPercent: 5 + index, ease: "none", scrollTrigger: { trigger: image.closest(".home-project"), start: "top bottom", end: "bottom top", scrub: 0.5 } });
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
      <HomeHero profile={profile} /><Practice /><Work projects={projects} /><Writing />
    </div>
  );
}
