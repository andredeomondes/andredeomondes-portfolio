"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Download } from "lucide-react";
import {
  SiDocker,
  SiNestjs,
  SiNextdotjs,
  SiOpenjdk,
  SiPostgresql,
  SiReact,
  SiSpringboot,
  SiTypescript,
} from "react-icons/si";
import { AnimatedSpan } from "@/shared/components/ui/terminal";
import { NoiseTexture } from "@/shared/components/ui/noise-texture";
import { GradualBlur } from "@/shared/components/ui/gradual-blur";
import { TextAnimate } from "@/shared/components/ui/text-animate";
import { ShimmerLink } from "@/shared/components/ui/shimmer-button";
import LiquidEther from "@/shared/components/ui/liquid-ether";
import type { Project } from "@/types/supabase";
import type { ProfileSettings } from "@/lib/site-content";

const stackIcons = [
  { label: "TypeScript", icon: SiTypescript, className: "text-[#3178C6]" },
  { label: "React", icon: SiReact, className: "text-[#61DAFB]" },
  {
    label: "Next.js",
    icon: SiNextdotjs,
    className: "text-[#0b1020] dark:text-white",
  },
  { label: "NestJS", icon: SiNestjs, className: "text-[#E0234E]" },
  { label: "Java", icon: SiOpenjdk, className: "text-[#EA8220]" },
  { label: "Spring", icon: SiSpringboot, className: "text-[#6DB33F]" },
  { label: "PostgreSQL", icon: SiPostgresql, className: "text-[#4169E1]" },
  { label: "Docker", icon: SiDocker, className: "text-[#2496ED]" },
];

// IDE token colors — project palette: violet keywords, cyan ids, sky keys, orange strings, green values
const KW = "text-[#7c3aed] dark:text-[#c084fc]"; // keyword
const ID = "text-[#0891b2] dark:text-[#67e8f9]"; // identifier
const KEY = "text-[#2563eb] dark:text-[#7dd3fc]"; // object key
const STR = "text-[#c2410c] dark:text-[#fb923c]"; // string value
const VAL = "text-[#16a34a] dark:text-[#86efac]"; // array string value
const PUN = "text-[#475569] dark:text-[#94a3b8]"; // punctuation / brackets

type Token = { t: string; c: string };
const codeLines: Token[][] = [
  [
    { t: "export ", c: KW },
    { t: "const ", c: KW },
    { t: "developer", c: ID },
    { t: " = {", c: PUN },
  ],
  [
    { t: "  name", c: KEY },
    { t: ": ", c: PUN },
    { t: '"André Deomondes"', c: STR },
    { t: ",", c: PUN },
  ],
  [
    { t: "  role", c: KEY },
    { t: ": ", c: PUN },
    { t: '"Full-Stack & Mobile Developer"', c: STR },
    { t: ",", c: PUN },
  ],
  [
    { t: "  company", c: KEY },
    { t: ": ", c: PUN },
    { t: '"Caji Solutions"', c: STR },
    { t: ",", c: PUN },
  ],
  [
    { t: "  location", c: KEY },
    { t: ": ", c: PUN },
    { t: '"Salvador, BA"', c: STR },
    { t: ",", c: PUN },
  ],
  [
    { t: "  stack", c: KEY },
    { t: ": {", c: PUN },
  ],
  [
    { t: "    frontend", c: KEY },
    { t: ": [", c: PUN },
    { t: '"React"', c: VAL },
    { t: ",", c: PUN },
    { t: '"Next.js"', c: VAL },
    { t: ",", c: PUN },
    { t: '"Tailwind CSS"', c: VAL },
    { t: "],", c: PUN },
  ],
  [
    { t: "    mobile", c: KEY },
    { t: ": [", c: PUN },
    { t: '"React Native"', c: VAL },
    { t: ",", c: PUN },
    { t: '"Expo"', c: VAL },
    { t: "],", c: PUN },
  ],
  [
    { t: "    backend", c: KEY },
    { t: ": [", c: PUN },
    { t: '"Java"', c: VAL },
    { t: ",", c: PUN },
    { t: '"Spring Boot"', c: VAL },
    { t: ",", c: PUN },
    { t: '"Node.js"', c: VAL },
    { t: "],", c: PUN },
  ],
  [
    { t: "    database", c: KEY },
    { t: ": [", c: PUN },
    { t: '"PostgreSQL"', c: VAL },
    { t: ",", c: PUN },
    { t: '"MongoDB"', c: VAL },
    { t: "],", c: PUN },
  ],
  [
    { t: "    tools", c: KEY },
    { t: ": [", c: PUN },
    { t: '"Docker"', c: VAL },
    { t: ",", c: PUN },
    { t: '"AWS"', c: VAL },
    { t: ",", c: PUN },
    { t: '"Git"', c: VAL },
    { t: "]", c: PUN },
  ],
  [{ t: "  }", c: PUN }],
  [
    { t: "}", c: PUN },
    { t: ";", c: KW },
  ],
];

// Last line delay = 12 * 90ms = 1080ms + ~300ms anim = ~1400ms → loop at 5s
const TERMINAL_LOOP_MS = 5000;

function getFeaturedLine(projects: Project[]) {
  if (projects.length === 0) return "Produtos digitais, apps e plataformas sob medida.";
  if (projects.length === 1) return `Ultimo destaque: ${projects[0].title}.`;
  return `Destaques recentes: ${projects.slice(0, 2).map((project) => project.title).join(" e ")}.`;
}

export function HeroSection({
  profile,
  featuredProjects,
}: {
  profile: ProfileSettings;
  featuredProjects: Project[];
}) {
  const [titleCycle, setTitleCycle] = useState(0);
  const [terminalCycle, setTerminalCycle] = useState(0);

  useEffect(() => {
    const i1 = window.setInterval(() => setTitleCycle((c) => c + 1), 6200);
    const i2 = window.setInterval(
      () => setTerminalCycle((c) => c + 1),
      TERMINAL_LOOP_MS,
    );
    return () => {
      window.clearInterval(i1);
      window.clearInterval(i2);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[#f6f2ea] text-[#0b1020] dark:bg-[#050714] dark:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.94),transparent_28%),radial-gradient(circle_at_24%_62%,rgba(180,143,255,0.14),transparent_22%),linear-gradient(145deg,#f6f2ea_0%,#ede7dd_44%,#e3dcf1_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(120,142,255,0.12),transparent_24%),radial-gradient(circle_at_24%_62%,rgba(180,143,255,0.16),transparent_22%),linear-gradient(145deg,#050714_0%,#0a0d1f_42%,#11091f_100%)]" />
      <NoiseTexture
        noiseOpacity={0.14}
        frequency={0.72}
        octaves={4}
        slope={0.42}
        className="opacity-40 mix-blend-soft-light"
      />
      <LiquidEther
        colors={["#8b5cf6", "#7c3aed", "#6d28d9", "#0891b2", "#a78bfa"]}
        mouseForce={18}
        cursorSize={120}
        resolution={0.45}
        autoDemo
        autoSpeed={0.4}
        autoIntensity={2}
        autoResumeDelay={2000}
        className="opacity-60 dark:opacity-75 mix-blend-screen"
      />
      <GradualBlur
        position="top"
        height="12rem"
        strength={2.5}
        divCount={8}
        curve="bezier"
      />
      <GradualBlur
        position="bottom"
        height="14rem"
        strength={3}
        divCount={8}
        curve="bezier"
      />
      <div className="absolute left-[16%] top-[42%] h-[18rem] w-[38rem] rounded-full bg-white/18 blur-[90px] dark:bg-[#a26dff]/10" />
      <div className="absolute left-1/2 top-1/2 h-[42rem] w-[22rem] -translate-x-[-5%] -translate-y-1/2 rotate-[18deg] rounded-full bg-[linear-gradient(180deg,rgba(142,96,255,0.02),rgba(167,129,255,0.28)_26%,rgba(94,217,255,0.18)_74%,rgba(255,255,255,0.02))] blur-[48px] dark:bg-[linear-gradient(180deg,rgba(142,96,255,0.06),rgba(167,129,255,0.44)_26%,rgba(94,217,255,0.24)_74%,rgba(255,255,255,0.03))]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-28 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <TextAnimate
              key={titleCycle}
              as="h1"
              by="character"
              animation="blurIn"
              duration={0.5}
              className="text-[1.75rem] font-semibold leading-[0.92] tracking-[-0.08em] sm:text-[2.6rem] lg:text-[3.2rem]"
            >
              {profile.heroTitle}
            </TextAnimate>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.78,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 text-lg leading-8 text-[#0b1020]/66 dark:text-white/62"
            >
              {profile.heroIntro.replace(profile.company, "").trim()}
              {" "}
              <span className="rounded-md bg-white/70 px-2 py-1 font-medium text-[#0b1020] dark:bg-white/[0.08] dark:text-white">
                {profile.company}
              </span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.78,
                delay: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 max-w-lg text-sm leading-7 text-[#0b1020]/56 dark:text-white/54"
            >
              {profile.heroDescription}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 max-w-lg text-xs uppercase tracking-[0.24em] text-violet-700/72 dark:text-violet-300/72"
            >
              {getFeaturedLine(featuredProjects)}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.34,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 flex flex-wrap items-center justify-center gap-6 lg:justify-start"
            >
              <ShimmerLink
                href="/projects"
                shimmerColor="#a78bfa"
                background="rgba(109,40,217,0.85)"
                className="h-12 gap-2 px-5 text-sm font-medium shadow-[0_0_28px_rgba(139,92,246,0.45)] dark:shadow-[0_0_32px_rgba(139,92,246,0.55)]"
              >
                <ArrowUpRight className="size-4" />
                Ver Projetos
              </ShimmerLink>
              <a
                href="/api/resume/download?format=pdf"
                className="inline-flex h-12 items-center gap-2 text-sm font-medium text-[#0b1020]/82 transition-colors hover:text-[#0b1020] dark:text-white/82 dark:hover:text-white"
              >
                <Download className="size-4" />
                Baixar CV
              </a>
              <Link
                href="/about"
                className="inline-flex h-12 items-center gap-3 text-sm font-medium text-[#0b1020]/82 transition-colors hover:text-[#0b1020] dark:text-white/82 dark:hover:text-white"
              >
                <Image
                  src="/andre.jpg"
                  alt="Andre Deomondes"
                  width={32}
                  height={32}
                  className="size-8 rounded-full border border-black/10 object-cover dark:border-white/10"
                />
                Sobre mim
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-10 flex flex-wrap justify-center gap-2.5 lg:justify-start"
            >
              {stackIcons.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-full border border-black/10 bg-white/58 px-3.5 py-2 backdrop-blur-sm transition-colors hover:bg-white/80 dark:border-white/12 dark:bg-white/[0.07] dark:hover:bg-white/[0.12]"
                  title={item.label}
                >
                  <item.icon className={`size-4 shrink-0 ${item.className}`} />
                  <span className="text-xs font-medium text-[#0b1020]/72 dark:text-white/72">
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto w-full max-w-[39rem]"
          >
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-violet-400/15 via-cyan-300/8 to-purple-500/15 blur-2xl dark:from-violet-500/20 dark:via-cyan-400/10 dark:to-purple-600/20" />
            <div className="relative max-w-none overflow-hidden rounded-[1.8rem] border border-black/10 bg-white/60 text-[#0b1020] shadow-[0_8px_32px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:shadow-[0_8px_32px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.1)]">
              <div className="flex items-center justify-between border-b border-black/10 bg-black/[0.03] px-5 py-4 text-xs text-[#0b1020]/55 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-white/50">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
                  <span className="size-2.5 rounded-full bg-[#28c840]/80" />
                </div>
                <span className="font-mono text-white/60">developer.ts</span>
                <span className="text-white/40">TypeScript</span>
              </div>
              <div className="overflow-x-auto">
                <div className="grid gap-[3px] px-5 py-5 font-mono text-[13px]">
                  {codeLines.map((tokens, index) => (
                    <div
                      key={`${terminalCycle}-${index}`}
                      className="grid grid-cols-[1.75rem_1fr] items-start gap-3"
                    >
                      <span className="select-none pt-[1px] text-right text-[#0b1020]/30 dark:text-white/20">
                        {index + 1}
                      </span>
                      <AnimatedSpan
                        key={`${terminalCycle}-${index}`}
                        delay={index * 90}
                        startOnView
                        className="flex flex-row flex-wrap items-baseline font-mono text-[13px] leading-[1.6]"
                      >
                        {tokens.map((tok, i) => (
                          <span key={i} className={`whitespace-pre ${tok.c}`}>
                            {tok.t}
                          </span>
                        ))}
                      </AnimatedSpan>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 bg-black/[0.03] px-5 py-3 text-xs text-[#0b1020]/44 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-white/36">
                <span>TypeScript</span>
                <span>UTF-8</span>
                <span>Ln 13, Col 2</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
