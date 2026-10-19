"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "@/lib/motion";

// Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger stays in sync.
// Loaded on idle; skipped entirely for reduced motion and on /admin.
export function SmoothScroll() {
  const pathname = usePathname();
  const disabled = pathname.startsWith("/admin");

  useEffect(() => {
    if (disabled || prefersReducedMotion()) return;
    let destroyed = false;
    let cleanup = () => {};

    const start = async () => {
      const [{ default: Lenis }, { loadGsap }] = await Promise.all([import("lenis"), import("@/lib/gsap")]);
      const { gsap, ScrollTrigger } = await loadGsap();
      if (destroyed) return;
      // allowNestedScroll: a wheel over an inner scroll area (exercise list, code, palette) scrolls that area.
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.4, allowNestedScroll: true });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      (window as Window & { __lenis?: unknown }).__lenis = lenis;
      cleanup = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        delete (window as Window & { __lenis?: unknown }).__lenis;
      };
    };

    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 200));
    idle(() => void start());
    return () => {
      destroyed = true;
      cleanup();
    };
  }, [disabled]);

  return null;
}
