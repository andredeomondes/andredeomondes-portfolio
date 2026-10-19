"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<>=";

/** Scrambles `text` from random glyphs to the final string over `durationMs`. */
export function useScramble(text: string, durationMs = 420) {
  const [output, setOutput] = useState(text);
  const frame = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    frame.current = null;
  }, []);

  const play = useCallback(() => {
    if (prefersReducedMotion()) return;
    stop();
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const settled = Math.floor(progress * text.length);
      setOutput(
        [...text]
          .map((char, index) => (char === " " || index < settled ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (progress < 1) frame.current = window.requestAnimationFrame(tick);
      else frame.current = null;
    };
    frame.current = window.requestAnimationFrame(tick);
  }, [durationMs, stop, text]);

  useEffect(() => stop, [stop]);
  return { output, play };
}

/** Link/label text that scrambles on hover and focus. Accessible name stays the real text. */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const { output, play } = useScramble(text);
  return (
    <span className={className} onPointerEnter={play} onFocus={play} aria-label={text}>
      <span aria-hidden="true">{output}</span>
    </span>
  );
}

/** One-shot decode on mount — the hero's orchestrated load moment. */
export function DecodeText({ text, className, delayMs = 150 }: { text: string; className?: string; delayMs?: number }) {
  const { output, play } = useScramble(text, Math.min(1400, 28 * text.length));
  useEffect(() => {
    const id = window.setTimeout(play, delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs, play]);
  // The final text reserves the layout; the scrambled copy is overlaid so glyph widths never shift it.
  return (
    <span className={`decode ${className ?? ""}`}>
      <span className="sr-only">{text}</span>
      <span className="decode__sizer" aria-hidden="true">{text}</span>
      <span className="decode__fx" aria-hidden="true">{output}</span>
    </span>
  );
}
