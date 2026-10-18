"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

type Position = "top" | "bottom" | "left" | "right";
type Curve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
type Target = "parent" | "page";

export interface GradualBlurProps {
  position?: Position;
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  curve?: Curve;
  opacity?: number;
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  hoverIntensity?: number;
  target?: Target;
  zIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  onAnimationComplete?: () => void;
}

const CURVE_FUNCTIONS: Record<Curve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const getDirection = (pos: Position) =>
  ({ top: "to top", bottom: "to bottom", left: "to left", right: "to right" })[pos];

export function GradualBlur({
  position = "bottom",
  strength = 2,
  height = "8rem",
  width,
  divCount = 8,
  exponential = false,
  curve = "bezier",
  opacity = 1,
  animated = false,
  duration = "0.3s",
  easing = "ease-out",
  hoverIntensity,
  target = "parent",
  zIndex = 10,
  className = "",
  style = {},
  onAnimationComplete,
}: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(animated !== "scroll");

  useEffect(() => {
    if (animated !== "scroll" || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animated]);

  useEffect(() => {
    if (isVisible && animated === "scroll" && onAnimationComplete) {
      const ms = parseFloat(duration) * 1000;
      const t = setTimeout(onAnimationComplete, ms);
      return () => clearTimeout(t);
    }
  }, [isVisible, animated, onAnimationComplete, duration]);

  const blurDivs = useMemo(() => {
    const inc = 100 / divCount;
    const curveF = CURVE_FUNCTIONS[curve] ?? CURVE_FUNCTIONS.linear;
    const currentStrength =
      isHovered && hoverIntensity ? strength * hoverIntensity : strength;
    const dir = getDirection(position);

    return Array.from({ length: divCount }, (_, i) => {
      const idx = i + 1;
      const progress = curveF(idx / divCount);
      const blurValue = exponential
        ? Math.pow(2, progress * 4) * 0.0625 * currentStrength
        : 0.0625 * (progress * divCount + 1) * currentStrength;

      const p1 = Math.round((inc * idx - inc) * 10) / 10;
      const p2 = Math.round(inc * idx * 10) / 10;
      const p3 = Math.round((inc * idx + inc) * 10) / 10;
      const p4 = Math.round((inc * idx + inc * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      return (
        <div
          key={idx}
          style={{
            position: "absolute",
            inset: 0,
            maskImage: `linear-gradient(${dir}, ${gradient})`,
            WebkitMaskImage: `linear-gradient(${dir}, ${gradient})`,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            opacity,
            transition: animated && animated !== "scroll"
              ? `backdrop-filter ${duration} ${easing}`
              : undefined,
          }}
        />
      );
    });
  }, [divCount, curve, isHovered, hoverIntensity, strength, exponential, opacity, position, animated, duration, easing]);

  const isVertical = position === "top" || position === "bottom";
  const isPageTarget = target === "page";

  const containerStyle: React.CSSProperties = {
    position: isPageTarget ? "fixed" : "absolute",
    pointerEvents: hoverIntensity ? "auto" : "none",
    opacity: isVisible ? 1 : 0,
    transition: animated ? `opacity ${duration} ${easing}` : undefined,
    zIndex: isPageTarget ? zIndex + 100 : zIndex,
    ...(isVertical
      ? { height, width: width ?? "100%", [position]: 0, left: 0, right: 0 }
      : { width: width ?? height, height: "100%", [position]: 0, top: 0, bottom: 0 }),
    ...style,
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
      onMouseEnter={hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {blurDivs}
      </div>
    </div>
  );
}
