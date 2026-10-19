"use client";

import { useLayoutEffect, useRef } from "react";
import { DecodeText } from "@/shared/components/fx/scramble";
import { PaletteBody } from "@/shared/components/shell/command-palette";
import { prefersReducedMotion } from "@/lib/motion";
import { HeroSignals } from "@/shared/components/fx/decor";

/** Hero: the real command palette floating in sodium light. Pins and opens up on scroll. */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Layout effect: GSAP must revert pins before React detaches the DOM on unmount.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const consoleNode = consoleRef.current;
    if (!section || !consoleNode || prefersReducedMotion()) return;
    let cleanup = () => {};
    let cancelled = false;

    void import("@/lib/gsap").then(({ loadGsap }) =>
      loadGsap().then(({ gsap, ScrollTrigger }) => {
        if (cancelled) return;
        const context = gsap.context(() => {
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: section, start: "top top", end: "+=70%", scrub: 0.6, pin: window.innerWidth >= 900 },
          });
          timeline
            .fromTo(consoleNode, { scale: 0.94, y: 0 }, { scale: 1.04, y: -24, ease: "none" }, 0)
            .to(".hero__light", { scale: 1.35, opacity: 1, ease: "none" }, 0)
            .to(".hero__copy", { opacity: 0.25, y: -40, ease: "none" }, 0);
        }, section);
        // Other pinned sections may have been created first; recompute every start/end.
        ScrollTrigger.refresh();
        cleanup = () => context.revert();
      }),
    );
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <div className="hero__light" aria-hidden="true">
        <span className="hero__beam hero__beam--left" />
        <span className="hero__beam hero__beam--right" />
        <span className="hero__core" />
      </div>
      <HeroSignals />

      <div className="hero__copy">
        <p className="hero__status">
          <span className="hero__status-dot" aria-hidden="true" />
          Backend &amp; Applied AI Engineer em Salvador
        </p>
        <h1 id="hero-title" className="hero__title">
          <DecodeText text="Engenharia de backend e IA aplicada" />
          <span className="hero__title-muted">que roda em produção.</span>
        </h1>
        <p className="hero__lead">
          Construo produtos de ponta a ponta, da API ao deploy, e documento o raciocínio por trás de cada decisão. Use o console abaixo para explorar o site.
        </p>
      </div>

      <div ref={consoleRef} className="hero__console">
        <div className="hero__console-glow" aria-hidden="true" />
        <PaletteBody inline />
      </div>
    </section>
  );
}
