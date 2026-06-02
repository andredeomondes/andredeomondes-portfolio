"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function FilosofiaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const labelOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 0.5]);
  const labelBlur = useTransform(scrollYProgress, [0, 0.08], [8, 0]);
  const labelFilter = useTransform(labelBlur, (b) => `blur(${b}px)`);

  const l1Blur = useTransform(scrollYProgress, [0, 0.18], [12, 0]);
  const l1Filter = useTransform(l1Blur, (b) => `blur(${b}px)`);
  const l1Opacity = useTransform(scrollYProgress, [0, 0.18], [0, 1]);
  const l1Y = useTransform(scrollYProgress, [0, 0.18], [40, 0]);

  const l2Blur = useTransform(scrollYProgress, [0.18, 0.36], [12, 0]);
  const l2Filter = useTransform(l2Blur, (b) => `blur(${b}px)`);
  const l2Opacity = useTransform(scrollYProgress, [0.18, 0.36], [0, 1]);
  const l2Y = useTransform(scrollYProgress, [0.18, 0.36], [40, 0]);

  const l3Blur = useTransform(scrollYProgress, [0.36, 0.54], [12, 0]);
  const l3Filter = useTransform(l3Blur, (b) => `blur(${b}px)`);
  const l3Opacity = useTransform(scrollYProgress, [0.36, 0.54], [0, 1]);
  const l3Y = useTransform(scrollYProgress, [0.36, 0.54], [30, 0]);

  const l4Blur = useTransform(scrollYProgress, [0.54, 0.72], [12, 0]);
  const l4Filter = useTransform(l4Blur, (b) => `blur(${b}px)`);
  const l4Opacity = useTransform(scrollYProgress, [0.54, 0.72], [0, 1]);
  const l4Y = useTransform(scrollYProgress, [0.54, 0.72], [30, 0]);

  const l5Blur = useTransform(scrollYProgress, [0.72, 0.9], [12, 0]);
  const l5Filter = useTransform(l5Blur, (b) => `blur(${b}px)`);
  const l5Opacity = useTransform(scrollYProgress, [0.72, 0.9], [0, 1]);
  const l5Y = useTransform(scrollYProgress, [0.72, 0.9], [30, 0]);

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <div className="mx-auto max-w-3xl">
          <motion.p
            style={{ opacity: labelOpacity, filter: labelFilter }}
            className="mb-12 text-center text-xs font-medium uppercase tracking-[0.25em] text-[#8B5CF6]"
          >
            Filosofia
          </motion.p>

          <div className="space-y-4 text-center">
            <motion.p
              style={{ opacity: l1Opacity, filter: l1Filter, y: l1Y }}
              className="text-4xl font-medium leading-[1.15] tracking-tight text-[#F8FAFC] sm:text-5xl lg:text-6xl"
            >
              Software é sobre{" "}
              <span className="text-[#8B5CF6]">pessoas</span>,
            </motion.p>

            <motion.p
              style={{ opacity: l2Opacity, filter: l2Filter, y: l2Y }}
              className="text-4xl font-medium leading-[1.15] tracking-tight text-[#94A3B8] sm:text-5xl lg:text-6xl"
            >
              não apenas tecnologia.
            </motion.p>

            <div className="h-8" />

            <motion.p
              style={{ opacity: l3Opacity, filter: l3Filter, y: l3Y }}
              className="mx-auto max-w-lg text-base leading-relaxed text-[#64748B]"
            >
              Construir software não é apenas escrever código.
            </motion.p>

            <motion.p
              style={{ opacity: l4Opacity, filter: l4Filter, y: l4Y }}
              className="mx-auto max-w-lg text-base leading-relaxed text-[#64748B]"
            >
              É entender problemas, projetar soluções
            </motion.p>

            <motion.p
              style={{ opacity: l5Opacity, filter: l5Filter, y: l5Y }}
              className="mx-auto max-w-lg text-base leading-relaxed text-[#94A3B8]"
            >
              e criar experiências que geram impacto.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
