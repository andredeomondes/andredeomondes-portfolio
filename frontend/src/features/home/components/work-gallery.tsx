"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";
import { Spotlight } from "@/shared/components/fx/spotlight";
import { TechChip } from "@/shared/components/brand/tech-icon";

export type WorkItem = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  role: string;
  stack: string[];
  image: string;
};

/** Horizontal, scroll-pinned case gallery on wide screens; a vertical stack on small ones. */
export function WorkGallery({ items }: { items: WorkItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  // Layout effect: GSAP must revert pins before React detaches the DOM on unmount.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || prefersReducedMotion() || window.innerWidth < 900) return;
    let cleanup = () => {};
    let cancelled = false;

    void import("@/lib/gsap").then(({ loadGsap }) =>
      loadGsap().then(({ gsap, ScrollTrigger }) => {
        if (cancelled) return;
        const context = gsap.context(() => {
          const distance = () => track.scrollWidth - window.innerWidth + 80;
          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 0.8,
              pin: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (counterRef.current) {
                  const current = Math.min(items.length, Math.floor(self.progress * items.length * 0.999) + 1);
                  counterRef.current.textContent = String(current).padStart(2, "0");
                }
              },
            },
          });
          gsap.utils.toArray<HTMLElement>(".work-card__media img").forEach((image) => {
            gsap.fromTo(image, { xPercent: -6 }, {
              xPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: image.closest(".work-card"), containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            });
          });
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
  }, [items.length]);

  return (
    <section ref={sectionRef} className="work rail-cell" aria-labelledby="work-title">
      <div className="work__head">
        <h2 id="work-title" className="section-title">
          Produtos reais.
          <span className="muted">Do problema ao deploy, com responsabilidade de ponta a ponta.</span>
        </h2>
        <p className="work__counter mono tabular" aria-hidden="true">
          <span ref={counterRef}>01</span>/{String(items.length).padStart(2, "0")}
        </p>
      </div>

      <div ref={trackRef} className="work__track">
        {items.map((item, index) => (
          <Spotlight as="article" key={item.slug} className="work-card" aria-labelledby={`work-${item.slug}`}>
            <div className="work-card__info">
              <p className="work-card__kicker">{item.kicker}</p>
              <h3 id={`work-${item.slug}`} className="work-card__title">{item.title}</h3>
              <p className="work-card__summary">{item.summary}</p>
              <p className="work-card__role">{item.role}</p>
              <ul className="work-card__stack" aria-label="Tecnologias">
                {item.stack.slice(0, 6).map((tech) => <TechChip key={tech} name={tech} />)}
              </ul>
              <Link href={`/projects/${item.slug}`} className="btn work-card__link">
                Ver o case <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <Link href={`/projects/${item.slug}`} className="work-card__media window" tabIndex={-1} aria-hidden="true">
              <div className="window__bar">
                <span className="window__dots"><i /><i /><i /></span>
                <span>{item.slug}</span>
              </div>
              <div className="work-card__frame">
                <Image src={item.image} alt="" fill sizes="(max-width: 900px) 100vw, 60vw" priority={index === 0} className="work-card__image" />
              </div>
            </Link>
          </Spotlight>
        ))}
      </div>
    </section>
  );
}
