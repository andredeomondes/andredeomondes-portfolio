"use client";

import { useRef, type ComponentPropsWithoutRef, type ElementType } from "react";
import { cn } from "@/shared/lib/utils";

type SpotlightProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

/** Cursor-following light. Writes --mx/--my; `.spotlight` CSS paints the glow. */
export function Spotlight<T extends ElementType = "div">({ as, className, ...props }: SpotlightProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const frame = useRef<number | null>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const node = ref.current;
    if (!node || frame.current !== null) return;
    const { clientX, clientY } = event;
    frame.current = window.requestAnimationFrame(() => {
      frame.current = null;
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--mx", `${clientX - rect.left}px`);
      node.style.setProperty("--my", `${clientY - rect.top}px`);
    });
  };

  return <Component ref={ref} className={cn("spotlight", className)} onPointerMove={onPointerMove} {...props} />;
}
