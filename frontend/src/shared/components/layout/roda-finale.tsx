"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { useActiveLoop } from "@/shared/hooks/use-active-loop";

const WORD = "roda";
const GLYPHS = "#$%&*+<>/\\=?01█▓▒░";
const STATUSES = ["compilando…", "rodando testes…", "deploy em produção…", "● rodando"];
const FINAL_STATUS = STATUSES.length - 1;
const SCRAMBLE_FRAMES = 13;
const SCRAMBLE_FRAME_MS = 55;
const BAND = "RODA ▶ ".repeat(24);

type Glitch = { char: string; x: number; y: number };

function scrambleFrame(frame: number): Glitch[] {
  return [...WORD].map((char, index) => ({
    char: frame > 4 + index * 2 ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
    x: Math.round((Math.random() * 6 - 3) * 10) / 10,
    y: Math.round((Math.random() * 4 - 2) * 10) / 10,
  }));
}

export function RodaFinale() {
  const rootRef = useRef<HTMLElement>(null);
  // Start on the final state so SSR, reduced motion and no-JS all show "● rodando".
  const [statusIndex, setStatusIndex] = useState(FINAL_STATUS);
  const [glitch, setGlitch] = useState<Glitch[] | null>(null);
  const frameTimer = useRef<number | null>(null);

  const nextStatus = useCallback(() => setStatusIndex((index) => (index + 1) % STATUSES.length), []);

  const scramble = useCallback(() => {
    let frame = 0;
    if (frameTimer.current !== null) window.clearInterval(frameTimer.current);
    frameTimer.current = window.setInterval(() => {
      frame += 1;
      if (frame > SCRAMBLE_FRAMES) {
        if (frameTimer.current !== null) window.clearInterval(frameTimer.current);
        frameTimer.current = null;
        setGlitch(null);
        return;
      }
      setGlitch(scrambleFrame(frame));
    }, SCRAMBLE_FRAME_MS);
  }, []);

  const active = useActiveLoop(rootRef, nextStatus, 800);
  useActiveLoop(rootRef, scramble, 3200);

  useEffect(() => () => {
    if (frameTimer.current !== null) window.clearInterval(frameTimer.current);
  }, []);

  const shownStatus = statusIndex;
  const letters: Glitch[] = glitch && active ? glitch : [...WORD].map((char) => ({ char, x: 0, y: 0 }));

  return (
    <section ref={rootRef} className="roda" aria-labelledby="roda-title" data-active={active ? "" : undefined}>
      <div className="roda__bands" aria-hidden="true">
        <div className="roda__band">{BAND}</div>
        <div className="roda__band roda__band--reverse">{BAND}</div>
        <div className="roda__band">{BAND}</div>
      </div>

      <div className="site-shell roda__content">
        <p className={cn("roda__status", shownStatus === FINAL_STATUS && "is-ok")}>
          <span className="roda__spinner" aria-hidden="true" />
          <span data-testid="roda-status">{STATUSES[shownStatus]}</span>
        </p>

        <h2 id="roda-title" className="roda__title">
          Vamos construir{" "}
          <br />
          algo que{" "}
          <span className={cn("roda__word", glitch && active && "is-glitch")} data-testid="roda-word" aria-hidden="true">
            {letters.map((letter, index) => (
              <span
                key={index}
                className="roda__char"
                style={{
                  animationDelay: `${index * 110}ms`,
                  transform: glitch && active ? `translate(${letter.x}px, ${letter.y}px)` : undefined,
                }}
              >
                {letter.char}
              </span>
            ))}
          </span>
          <span className="sr-only">roda.</span>
          <span className="roda__dot" aria-hidden="true">.</span>
        </h2>

        <div className="roda__progress" aria-hidden="true">
          <i />
        </div>
      </div>
    </section>
  );
}
