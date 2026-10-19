"use client";

import { useEffect, useRef } from "react";

/** Toggles `data-active` while the element is near the viewport, so CSS loops only run on screen. */
export function useLoopActive<T extends Element>() {
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
