"use client";

import { useEffect, useRef } from "react";
import type { ExperienceItem } from "@/lib/site-content";

/** Career timeline whose rail fills with sodium light as you scroll through it. */
export function Timeline({ items }: { items: ExperienceItem[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (fill) fill.style.transform = "scaleY(1)";
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - rect.top) / rect.height));
      fill.style.transform = `scaleY(${progress})`;
      list.querySelectorAll<HTMLElement>(".timeline__item").forEach((item) => {
        item.classList.toggle("is-reached", item.getBoundingClientRect().top < window.innerHeight * 0.6);
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <ol ref={listRef} className="timeline">
      <span className="timeline__rail" aria-hidden="true">
        <span ref={fillRef} className="timeline__fill" />
      </span>
      {items.map((item) => (
        <li key={`${item.company}-${item.role}`} className="timeline__item">
          <div className="timeline__head">
            <h3>{item.company}</h3>
            <span className="timeline__period mono">{item.period}</span>
          </div>
          <p className="timeline__role">{item.role}</p>
          <ul className="line-list line-list--muted">
            {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>
        </li>
      ))}
    </ol>
  );
}
