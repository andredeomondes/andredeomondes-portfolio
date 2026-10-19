"use client";

import { useEffect, useRef } from "react";
import { TechIcon } from "@/shared/components/brand/tech-icon";
import { cn } from "@/shared/lib/utils";

/** Toggles data-active while the element is on screen so CSS loops pause offscreen. */
function useLoopActive<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => node.toggleAttribute("data-active", entry.isIntersecting), { rootMargin: "15% 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/** Two counter-scrolling rows of technology logos. */
export function TechMarquee({ items }: { items: string[] }) {
  const ref = useLoopActive<HTMLDivElement>();
  const half = Math.ceil(items.length / 2);
  const rows = [items, [...items.slice(half), ...items.slice(0, half)]];
  return (
    <div ref={ref} className="tech-marquee" role="region" aria-label={`Tecnologias: ${items.join(", ")}`}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={cn("tech-marquee__row", rowIndex === 1 && "tech-marquee__row--reverse")} aria-hidden="true">
          {[...row, ...row].map((name, index) => (
            <span key={`${name}-${index}`} className="tech-marquee__item">
              <TechIcon name={name} className="tech-marquee__icon" />
              {name}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Light streaks that flow from the edges into the hero console, plus drifting dust in the beam. */
export function HeroSignals() {
  const ref = useLoopActive<HTMLDivElement>();
  return (
    <div ref={ref} className="hero-signals" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="signal-stroke" x1="0" x2="1">
            <stop offset="0" stopColor="#ffd43b" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffd43b" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ff9f1c" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[
          "M-40 640 C 260 620, 420 760, 720 690",
          "M-40 420 C 300 460, 460 640, 720 690",
          "M1480 640 C 1180 620, 1020 760, 720 690",
          "M1480 420 C 1140 460, 980 640, 720 690",
          "M-40 820 C 320 800, 520 720, 720 690",
          "M1480 820 C 1120 800, 920 720, 720 690",
        ].map((d, index) => (
          <g key={d}>
            <path d={d} className="hero-signals__track" />
            <path d={d} className="hero-signals__pulse" pathLength={1} style={{ animationDelay: `${index * 0.65}s` }} />
          </g>
        ))}
      </svg>
      <div className="hero-dust">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} style={{ left: `${(index * 53) % 100}%`, animationDelay: `${(index * 0.7) % 9}s`, animationDuration: `${9 + (index % 5) * 2}s` }} />
        ))}
      </div>
    </div>
  );
}

/** Orbit rings with technology icons circling a center (home finale). */
export function TechOrbit({ inner, outer }: { inner: string[]; outer: string[] }) {
  const ref = useLoopActive<HTMLDivElement>();
  const ring = (names: string[], className: string) => (
    <div className={cn("orbit__ring", className)}>
      {names.map((name, index) => (
        <span key={name} className="orbit__node" style={{ ["--a" as string]: `${(360 / names.length) * index}deg` }}>
          <span className="orbit__chip">
            <TechIcon name={name} />
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div ref={ref} className="orbit" aria-hidden="true">
      {ring(outer, "orbit__ring--outer")}
      {ring(inner, "orbit__ring--inner")}
    </div>
  );
}
