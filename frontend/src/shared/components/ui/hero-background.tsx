"use client";

import { useRef, useEffect } from "react";

function Noise({
  patternRefreshInterval = 2,
  patternAlpha = 16,
}: {
  patternRefreshInterval?: number;
  patternAlpha?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;
    let f = 0, id = 0, S = 1024;
    const resize = () => { c.width = S; c.height = S; c.style.width = "100vw"; c.style.height = "100vh"; };
    const draw = () => {
      const img = ctx.createImageData(S, S);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = patternAlpha;
      }
      ctx.putImageData(img, 0, 0);
    };
    const loop = () => { if (f % patternRefreshInterval === 0) draw(); f++; id = requestAnimationFrame(loop); };
    addEventListener("resize", resize);
    resize();
    loop();
    return () => { removeEventListener("resize", resize); cancelAnimationFrame(id); };
  }, [patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

export function HeroBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_180px,rgba(168,85,247,0.33),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#64748b29_1px,transparent_1px),linear-gradient(to_bottom,#64748b29_1px,transparent_1px)] bg-[size:22px_24px]" />
      <Noise patternAlpha={16} />
    </div>
  );
}
