"use client";

import { motion } from "motion/react";
import { MorphingText } from "@/shared/components/ui/morphing-text";
import { NoiseTexture } from "@/shared/components/ui/noise-texture";
import { GradualBlur } from "@/shared/components/ui/gradual-blur";
import { InteractiveGridPattern } from "@/shared/components/ui/interactive-grid-pattern";

const loopPhrases = [
  "Software bom facilita o trabalho.",
  "Software bom vende melhor.",
  "Software bom cresce sem virar bagunca.",
];

export function FilosofiaSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#f0ebe2] px-6 py-24 text-[#0b1020] dark:bg-[#060917] dark:text-white sm:px-8 lg:px-12">
      <InteractiveGridPattern
        width={56}
        height={56}
        squares={[32, 20]}
        loop
        loopInterval={55}
        className="z-[1] opacity-60 dark:opacity-30 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black_40%,transparent_100%)]"
        squaresClassName="stroke-violet-500/20 dark:stroke-violet-400/15"
        activeClassName="fill-violet-400/18 dark:fill-violet-400/12"
      />
      <NoiseTexture
        noiseOpacity={0.12}
        frequency={0.66}
        octaves={3}
        slope={0.52}
        className="z-[2] opacity-35 mix-blend-soft-light"
      />
      <GradualBlur position="top" height="10rem" strength={2} divCount={7} curve="bezier" zIndex={3} />
      <GradualBlur position="bottom" height="12rem" strength={2.5} divCount={7} curve="bezier" zIndex={3} />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <MorphingText
            texts={loopPhrases}
            className="h-28 w-full max-w-none text-[clamp(2rem,5vw,4.6rem)] tracking-[-0.07em] text-[#0b1020] dark:text-white"
          />
        </motion.div>
      </div>
    </section>
  );
}
