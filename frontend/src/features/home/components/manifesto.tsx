"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { registerGsap } from "@/lib/gsap";
import { cn } from "@/shared/lib/utils";

export function Manifesto({ text, highlights }: { text: string; highlights: string[] }) {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    if (reduceMotion) {
      const id = window.setTimeout(() => setLit(words.length), 0);
      return () => window.clearTimeout(id);
    }
    const { ScrollTrigger } = registerGsap();
    const trigger = ScrollTrigger.create({
      trigger: node,
      start: "top 85%",
      end: "bottom 45%",
      scrub: true,
      onUpdate: (self) => setLit(Math.round(self.progress * words.length)),
    });
    return () => trigger.kill();
  }, [reduceMotion, words.length]);

  return (
    <section className="home-stage manifesto" data-home-section>
      <p ref={rootRef} className="site-shell manifesto__text" data-testid="manifesto">
        {words.map((word, index) => (
          <span key={index}>
            <span className={cn("manifesto__word", highlights.includes(word) && "font-pixel is-key", index < lit && "is-lit")}>
              {word}
            </span>
            {index < words.length - 1 ? " " : null}
          </span>
        ))}
      </p>
    </section>
  );
}
