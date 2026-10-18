"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Runs `tick` every `intervalMs` only while the element is on screen, the tab
 * is visible and the visitor has not asked for reduced motion.
 */
export function useActiveLoop(
  ref: RefObject<Element | null>,
  tick: () => void,
  intervalMs: number,
): boolean {
  const reduceMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const tickRef = useRef(tick);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "10% 0px",
    });
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    observer.observe(node);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ref]);

  const active = inView && visible && !reduceMotion;

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => tickRef.current(), intervalMs);
    return () => window.clearInterval(id);
  }, [active, intervalMs]);

  return active;
}
