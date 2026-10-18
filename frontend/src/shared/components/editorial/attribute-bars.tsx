"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { AttributeItem } from "@/lib/site-content";
import { cn } from "@/shared/lib/utils";

const BLOCKS = 20;
const BLOCK_STAGGER_MS = 40;

export function AttributeBars({ items }: { items: AttributeItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // SSR and no-JS show full bars; with JS they empty and refill when scrolled into view.
  const [filled, setFilled] = useState(BLOCKS);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || reduceMotion !== false) return;
    const timers: number[] = [];
    const arm = window.setTimeout(() => {
      setArmed(true);
      setFilled(0);
    }, 0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        for (let block = 1; block <= BLOCKS; block += 1) {
          timers.push(window.setTimeout(() => setFilled(block), block * BLOCK_STAGGER_MS));
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      window.clearTimeout(arm);
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
    };
  }, [reduceMotion]);

  return (
    <div ref={rootRef} className="attribute-bars">
      {items.map((item) => {
        const target = Math.round(item.value / 5);
        return (
          <div key={item.label} className="attribute-bar" data-testid="attribute-bar">
            <span className="attribute-bar__label">{item.label.toUpperCase()}</span>
            <span className="attribute-bar__blocks" aria-hidden="true">
              {Array.from({ length: BLOCKS }, (_, block) => (
                <i key={block} className={cn(block < target && block < (armed ? filled : BLOCKS) && "on")} />
              ))}
            </span>
            <span className="attribute-bar__value font-pixel">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}
