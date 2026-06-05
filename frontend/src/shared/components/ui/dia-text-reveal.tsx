"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
import { cn } from "@/shared/lib/utils";

const DEFAULT_COLORS = ["#f5edff", "#d8a6ff", "#8b5cf6", "#f472b6"];
const BAND_HALF = 17;
const SWEEP_START = -BAND_HALF;
const SWEEP_END = 100 + BAND_HALF;

const sweepEase = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

function buildGradient(pos: number, colors: string[], textColor: string) {
  const bandStart = pos - BAND_HALF;
  const bandEnd = pos + BAND_HALF;

  if (bandStart >= 100) {
    return `linear-gradient(90deg, ${textColor}, ${textColor})`;
  }

  const parts: string[] = [];

  if (bandStart > 0) {
    parts.push(`${textColor} 0%`, `${textColor} ${bandStart.toFixed(2)}%`);
  }

  colors.forEach((color, index) => {
    const pct =
      colors.length === 1
        ? pos
        : bandStart + (index / (colors.length - 1)) * BAND_HALF * 2;
    parts.push(`${color} ${pct.toFixed(2)}%`);
  });

  if (bandEnd < 100) {
    parts.push(`transparent ${bandEnd.toFixed(2)}%`, "transparent 100%");
  }

  return `linear-gradient(90deg, ${parts.join(", ")})`;
}

function measureWidths(el: HTMLElement, texts: string[]) {
  const ghost = el.cloneNode() as HTMLElement;
  Object.assign(ghost.style, {
    position: "absolute",
    visibility: "hidden",
    pointerEvents: "none",
    width: "auto",
    whiteSpace: "nowrap",
  });

  el.parentElement?.appendChild(ghost);
  const widths = texts.map((text) => {
    ghost.textContent = text;
    return ghost.getBoundingClientRect().width;
  });
  ghost.remove();

  return widths;
}

export interface DiaTextRevealProps
  extends Omit<
    HTMLMotionProps<"span">,
    "ref" | "children" | "style" | "animate" | "transition" | "color"
  > {
  text: string | string[];
  colors?: string[];
  textColor?: string;
  duration?: number;
  delay?: number;
  repeat?: boolean;
  repeatDelay?: number;
  startOnView?: boolean;
  once?: boolean;
  className?: string;
  fixedWidth?: boolean;
}

export function DiaTextReveal({
  text,
  colors = DEFAULT_COLORS,
  textColor = "var(--foreground)",
  duration = 1.5,
  delay = 0,
  repeat = false,
  repeatDelay = 0.5,
  startOnView = true,
  once = true,
  className,
  fixedWidth = false,
  ...props
}: DiaTextRevealProps) {
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const textSignature = texts.join("\0");
  const isMulti = texts.length > 1;
  const prefersReducedMotion = useReducedMotion();

  const spanRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(spanRef, { once, amount: 0.1 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [measuredWidths, setMeasuredWidths] = useState<number[]>([]);
  const sweepPos = useMotionValue(SWEEP_START);

  const backgroundImage = useTransform(sweepPos, (pos) =>
    buildGradient(pos, colors, textColor)
  );

  useEffect(() => {
    const el = spanRef.current;
    if (!el || !isMulti) {
      setMeasuredWidths([]);
      return;
    }

    setMeasuredWidths(measureWidths(el, texts));
  }, [isMulti, texts, textSignature]);

  useEffect(() => {
    if (prefersReducedMotion) {
      sweepPos.set(SWEEP_END);
      return;
    }

    if (startOnView && !isInView) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let controls: { stop: () => void } | undefined;
    let cancelled = false;

    const runSweep = (index: number) => {
      if (cancelled) {
        return;
      }

      setActiveIndex(index);
      sweepPos.set(SWEEP_START);

      controls = animate(sweepPos, SWEEP_END, {
        duration,
        delay,
        ease: sweepEase,
        onComplete() {
          if (!repeat || cancelled) {
            return;
          }

          timeoutId = setTimeout(() => {
            runSweep((index + 1) % texts.length);
          }, repeatDelay * 1000);
        },
      });
    };

    runSweep(0);

    return () => {
      cancelled = true;
      controls?.stop();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    delay,
    duration,
    isInView,
    prefersReducedMotion,
    repeat,
    repeatDelay,
    startOnView,
    sweepPos,
    textSignature,
    texts.length,
  ]);

  const fixedW =
    isMulti && fixedWidth && measuredWidths.length > 0
      ? Math.max(...measuredWidths)
      : undefined;

  const animatedW =
    isMulti && !fixedWidth && measuredWidths[activeIndex] != null
      ? measuredWidths[activeIndex]
      : undefined;

  return (
    <motion.span
      ref={spanRef}
      className={cn("align-bottom leading-[100%] text-inherit", className)}
      style={{
        transform: "translateY(-2px)",
        color: "transparent",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        backgroundSize: "100% 100%",
        backgroundImage,
        ...(isMulti && {
          display: "inline-block",
          overflow: "hidden",
          whiteSpace: "nowrap",
          verticalAlign: "text-bottom",
          ...(fixedW != null && { width: fixedW }),
        }),
      }}
      animate={animatedW != null ? { width: animatedW } : undefined}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {texts[activeIndex]}
    </motion.span>
  );
}
