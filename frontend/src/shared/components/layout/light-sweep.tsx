"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** A single beam of sodium light that sweeps across its section the first time it enters view. */
export function LightSweep() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.dataset.play = "";
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(node.parentElement ?? node);
    return () => observer.disconnect();
  }, []);
  return <span ref={ref} className="light-sweep" aria-hidden="true" />;
}
