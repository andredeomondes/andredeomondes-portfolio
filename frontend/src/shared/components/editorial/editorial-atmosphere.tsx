"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";

type EditorialAtmosphereProps = {
  src: string;
  className?: string;
  priority?: boolean;
  variant: "projects" | "publications";
};

export function EditorialAtmosphere({
  src,
  className,
  priority = false,
  variant,
}: EditorialAtmosphereProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const syncVisibility = (visible: boolean) => {
      node.toggleAttribute("data-active", visible && !document.hidden);
    };
    const observer = new IntersectionObserver(
      ([entry]) => syncVisibility(entry.isIntersecting),
      { rootMargin: "15% 0px" },
    );
    const onVisibilityChange = () => {
      const bounds = node.getBoundingClientRect();
      syncVisibility(bounds.bottom > 0 && bounds.top < window.innerHeight);
    };

    observer.observe(node);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn("editorial-atmosphere", className)}
      data-variant={variant}
      aria-hidden="true"
    >
      <Image
        src={src}
        alt=""
        fill
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : "lazy"}
        sizes="100vw"
      />
      <span className="editorial-atmosphere__veil" />
      <span className="editorial-atmosphere__signal" />
    </div>
  );
}
