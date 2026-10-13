"use client";

import { useEffect, useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { publications, series } from "@/content/posts";
import { ProjectIntakeForm } from "@/features/contact/components/project-intake-form";
import type { ProfileSettings } from "@/lib/site-content";
import { TechnologyIcon } from "@/shared/components/editorial/technology-icon";
import type { Project } from "@/types/supabase";

const stack = ["Node.js", "Fastify", "Python", "FastAPI", "PostgreSQL", "Redis", "AWS", "React", "TypeScript", "Playwright"];

const disciplines = [
  { name: "Backend", detail: "APIs, regras de negócio e integrações" },
  { name: "IA aplicada", detail: "Agentes, contexto e automação real" },
  { name: "Produto", detail: "Da interface à operação" },
  { name: "Cloud", detail: "Deploy, dados e observabilidade" },
];

function Hero({ profile }: { profile: ProfileSettings }) {
  const heroRef = useRef<HTMLElement>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const pointerPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const syncActivity = (visible: boolean) => {
      hero.toggleAttribute("data-grid-active", visible && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => syncActivity(entry.isIntersecting), {
      rootMargin: "8% 0px",
    });
    const onVisibilityChange = () => {
      const rect = hero.getBoundingClientRect();
      syncActivity(rect.bottom > 0 && rect.top < window.innerHeight);
    };

    observer.observe(hero);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (pointerFrameRef.current !== null) window.cancelAnimationFrame(pointerFrameRef.current);
    };
  }, []);

  const updateGridCell = (event: ReactPointerEvent<HTMLElement>) => {
    const hero = heroRef.current;
    if (!hero || event.pointerType === "touch") return;

    pointerPositionRef.current = { x: event.clientX, y: event.clientY };
    if (pointerFrameRef.current !== null) return;

    pointerFrameRef.current = window.requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const gridSize = 72;
      const backgroundX = Number.parseFloat(getComputedStyle(hero, "::before").backgroundPositionX) || 0;
      const offsetX = ((backgroundX % gridSize) + gridSize) % gridSize;
      const cellX = Math.floor((pointerPositionRef.current.x - rect.left - offsetX) / gridSize) * gridSize + offsetX;
      const cellY = Math.floor((pointerPositionRef.current.y - rect.top) / gridSize) * gridSize;

      hero.style.setProperty("--home-grid-hover-x", `${cellX}px`);
      hero.style.setProperty("--home-grid-hover-y", `${cellY}px`);
      hero.setAttribute("data-grid-hover", "");
      pointerFrameRef.current = null;
    });
  };

  const clearGridCell = () => {
    if (pointerFrameRef.current !== null) {
      window.cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = null;
    }
    heroRef.current?.removeAttribute("data-grid-hover");
  };

  return (
    <section
      ref={heroRef}
      className="home-stage home-hero"
      data-home-section
      data-grid-active=""
      onPointerMove={updateGridCell}
      onPointerLeave={clearGridCell}
    >
      <span className="home-hero__grid-cell" aria-hidden="true" />
      <div className="home-hero__field" aria-hidden="true"><span>BUILD</span><span>SHIP</span><span>LEARN</span></div>
      <div className="site-shell home-stage-content home-hero__content">
        <div className="home-hero__portrait" data-home-photo>
          <Image src="/brand/andre-editorial-v2.webp" alt="Retrato de Andre Deomondes" fill priority sizes="(max-width: 767px) 88vw, 42vw" className="object-cover object-top" />
          <span className="home-hero__portrait-shade" />
        </div>
        <div className="home-hero__title" aria-label={profile.name}>
          <h1>
            <span className="home-hero-title-mask"><span className="home-hero-title-line">ANDRE</span></span>
            <span className="home-hero-title-mask">
              <span className="home-hero-title-line home-hero-title-line--outline">
                <span className="home-hero-title-loop">DEOMONDES</span>
              </span>
            </span>
          </h1>
        </div>
        <div className="home-hero__bottom home-hero-support">
          <p>Backend &amp; Applied AI Engineer</p>
          <p>{profile.location}</p>
          <a href="#atuacao" aria-label="Avançar para atuação">Explorar <ArrowDown className="size-4" /></a>
        </div>
      </div>
    </section>
  );
}

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
    <div ref={ref} className="home-marquee" aria-label={`Tecnologias: ${stack.join(", ")}`}>
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

function Contact({ profile }: { profile: ProfileSettings }) {
  return (
    <section id="contato" className="home-stage home-contact" data-home-section>
      <div className="site-shell home-stage-content home-contact__layout">
        <div className="home-contact__intro">
          <p className="home-contact__availability"><span /> {profile.availability}</p>
          <div>
            <h2 className="home-display">O PROJETO<br /><span className="home-display--outline">COMEÇA AQUI.</span></h2>
            <p className="home-contact__lead">Responda um briefing curto. Eu recebo o contexto completo no e-mail e retorno sem tirar você do site.</p>
          </div>
          <div className="home-contact__links">
            <a href={profile.social.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={profile.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <span>{profile.location}</span>
          </div>
        </div>
        <ProjectIntakeForm />
      </div>
    </section>
  );
}

export function EditorialHome({ profile, projects }: { profile: ProfileSettings; projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let cleanup = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
          return;
        }

        const entrance = gsap.timeline({
          defaults: { ease: "power4.inOut" },
          delay: 0.16,
        });
        entrance
          .from(".home-hero-title-line", { yPercent: 112, duration: 0.68, stagger: 0.07, ease: "power4.out" })
          .from(".home-hero__portrait", { clipPath: "inset(100% 0 0 0)", duration: 0.64, ease: "power3.inOut" }, "-=0.58")
          .from(".home-hero-support > *", { autoAlpha: 0, y: 12, duration: 0.34, stagger: 0.04, ease: "power3.out" }, "-=0.3");

        gsap.utils.toArray<HTMLElement>("[data-home-section]").slice(1).forEach((section) => {
          const content = section.querySelector<HTMLElement>(".home-stage-content");
          if (!content) return;
          gsap.from(content, { clipPath: "inset(9% 0 0 0)", scale: 0.975, transformOrigin: "center top", ease: "none", scrollTrigger: { trigger: section, start: "top 92%", end: "top 38%", scrub: 0.7 } });
        });

        gsap.utils.toArray<HTMLElement>(".home-scroll-word").forEach((word) => {
          const direction = word.dataset.direction === "right" ? 1 : -1;
          gsap.fromTo(word, { xPercent: direction * 7 }, { xPercent: direction * -7, ease: "none", scrollTrigger: { trigger: word.closest("section"), start: "top bottom", end: "bottom top", scrub: 0.55 } });
        });

        const portrait = root.querySelector<HTMLElement>("[data-home-photo] img");
        if (portrait) gsap.fromTo(portrait, { scale: 1.08, yPercent: -3 }, { scale: 1.01, yPercent: 4, ease: "none", scrollTrigger: { trigger: ".home-hero", start: "top top", end: "bottom top", scrub: 0.6 } });

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

    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div ref={rootRef} data-home-motion className="home-experience">
      <Hero profile={profile} /><Practice /><Work projects={projects} /><Writing /><Contact profile={profile} />
    </div>
  );
}
