"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { BookOpen, Bookmark, Code2, Dumbbell, GalleryHorizontal, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

/** Thin sodium bar at the top that tracks reading progress through the article. */
export function ReadingProgress() {
  const barRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div className="reading-progress" aria-hidden="true">
      <span ref={barRef} />
    </div>
  );
}

const TOC_ICONS: Record<string, LucideIcon> = { slides: GalleryHorizontal, read: BookOpen, code: Code2, keep: Bookmark, practice: Dumbbell };

/** Sticky table of contents; the section in view is marked as current. */
export function DocToc({ items }: { items: Array<{ id: string; label: string; icon?: string }> }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
        // Back above the first section: nothing is in the band, so reset to the top entry.
        else if (sections[0] && window.scrollY < sections[0].offsetTop) setActive(items[0]?.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="doc-toc" aria-label="Nesta página">
      <p>Nesta página</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={cn(active === item.id && "is-active")} aria-current={active === item.id ? "location" : undefined}>
              {item.icon && TOC_ICONS[item.icon] ? createElement(TOC_ICONS[item.icon], { className: "doc-toc__icon", "aria-hidden": true }) : null}
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
