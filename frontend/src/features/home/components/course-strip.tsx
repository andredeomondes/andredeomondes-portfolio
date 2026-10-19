"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { springs } from "@/lib/motion";

export type CourseUnit = { slug: string; unit: number; title: string; statement: string; cover: string };

/** JS Core strip: progress + latest units; the hovered unit's carousel cover follows the cursor. */
export function CourseStrip({ units, published, total }: { units: CourseUnit[]; published: number; total: number }) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<CourseUnit | null>(null);
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
    <section className="course rail-cell" aria-labelledby="course-title">
      <div className="course__head">
        <h2 id="course-title" className="section-title">
          JavaScript Core.
          <span className="muted">Uma série aberta, do fundamento ao backend, com exercícios e testes.</span>
        </h2>
        <div className="course__progress">
          <p className="mono tabular"><strong>{published}</strong> de {total} unidades publicadas</p>
          <div className="course__bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={published} aria-label="Progresso da série">
            <span style={{ transform: `scaleX(${published / total})` }} />
          </div>
        </div>
      </div>

      <ol ref={listRef} className="course__list" onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
        {units.map((unit) => (
          <li key={unit.slug}>
            <Link href={`/posts/${unit.slug}`} className="course__row" onPointerEnter={() => setHovered(unit)} onFocus={() => setHovered(unit)} onBlur={() => setHovered(null)}>
              <span className="course__num mono tabular">{String(unit.unit).padStart(2, "0")}</span>
              <span className="course__title">{unit.title}</span>
              <span className="course__statement">{unit.statement}</span>
              <ArrowUpRight className="course__arrow" aria-hidden="true" />
            </Link>
          </li>
        ))}
        <AnimatePresence>
          {hovered && !reduce ? (
            <motion.div
              key="preview"
              className="course__preview"
              style={{ x, y }}
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={springs.snappy}
              aria-hidden="true"
            >
              <Image key={hovered.cover} src={hovered.cover} alt="" fill sizes="240px" className="object-cover" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </ol>

      <Link href="/series/javascript-core" className="btn course__cta">
        Ver a série completa <ArrowUpRight aria-hidden="true" size={16} />
      </Link>
    </section>
  );
}
