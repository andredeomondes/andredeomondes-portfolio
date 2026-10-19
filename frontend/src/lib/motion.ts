// Shared motion vocabulary for Motion (motion/react) and GSAP.
export const motionTokens = {
  duration: { instant: 0.08, fast: 0.18, normal: 0.35, slow: 0.6, crawl: 1 },
  easing: {
    smooth: [0.22, 1, 0.36, 1] as const,
    sharp: [0.4, 0, 0.2, 1] as const,
  },
  gsapEase: { smooth: "expo.out", inOut: "power3.inOut" },
  distance: { xs: 4, sm: 8, md: 16, lg: 24, xl: 48 },
  scale: { press: 0.96, pop: 1.03 },
} as const;

export const springs = {
  snappy: { type: "spring", stiffness: 320, damping: 30 },
  gentle: { type: "spring", stiffness: 140, damping: 18 },
  magnetic: { type: "spring", stiffness: 220, damping: 16, mass: 0.6 },
  sheet: { type: "spring", stiffness: 380, damping: 38 },
} as const;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
