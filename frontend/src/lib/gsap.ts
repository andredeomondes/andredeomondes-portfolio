"use client";

type GsapModules = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let loading: Promise<GsapModules> | null = null;

// Loaded on demand so GSAP stays out of the initial JS bundle.
export function loadGsap(): Promise<GsapModules> {
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  });
  return loading;
}

/** Runs `start` with GSAP after the first scroll, keeping it off the critical path. */
export function onFirstScroll(start: (modules: GsapModules) => void): () => void {
  let cancelled = false;
  const run = () => {
    window.removeEventListener("scroll", run);
    void loadGsap().then((modules) => {
      if (!cancelled) start(modules);
    });
  };
  if (window.scrollY > 0) run();
  else window.addEventListener("scroll", run, { passive: true, once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("scroll", run);
  };
}
