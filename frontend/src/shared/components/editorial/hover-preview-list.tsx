"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { springs } from "@/lib/motion";

export type PreviewRow = { href: string; index: string; title: string; meta: string; detail?: string; image: string };

/** Large editorial rows; the hovered row's image floats next to the cursor (mouse only). */
export function HoverPreviewList({ rows, label, size = "lg" }: { rows: PreviewRow[]; label: string; size?: "lg" | "md" }) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState<PreviewRow | null>(null);
  const x = useSpring(useMotionValue(0), springs.magnetic);
  const y = useSpring(useMotionValue(0), springs.magnetic);

  const onMove = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <ol ref={listRef} className={`preview-list preview-list--${size}`} aria-label={label} onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
      {rows.map((row) => (
        <li key={row.href}>
          <Link href={row.href} className="preview-list__row" onPointerEnter={() => setActive(row)} onFocus={() => setActive(row)} onBlur={() => setActive(null)}>
            <span className="preview-list__index mono tabular">{row.index}</span>
            <span className="preview-list__title">{row.title}</span>
            <span className="preview-list__meta">{row.meta}</span>
            {row.detail ? <span className="preview-list__detail">{row.detail}</span> : null}
            <span className="preview-list__thumb" aria-hidden="true">
              <Image src={row.image} alt="" fill sizes="(max-width: 860px) 100vw, 1px" className="object-cover object-top" />
            </span>
            <ArrowUpRight className="preview-list__arrow" aria-hidden="true" />
          </Link>
        </li>
      ))}
      <AnimatePresence>
        {active && !reduce ? (
          <motion.div
            key="preview"
            className="preview-list__float"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.8, rotate: -3, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
            transition={springs.snappy}
            aria-hidden="true"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active.image}
                className="preview-list__float-img"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image src={active.image} alt="" fill sizes="420px" className="object-cover object-top" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ol>
  );
}
