"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BorderBeam } from "@/shared/components/ui/border-beam";
import {
  SiTypescript, SiSpringboot, SiNestjs, SiReact,
  SiDocker, SiPostgresql, SiTailwindcss, SiNextdotjs, SiGit,
} from "react-icons/si";
import { DiJava } from "react-icons/di";

const techIcons = [
  { icon: SiTypescript, color: "#3178C6", label: "TypeScript" },
  { icon: SiReact, color: "#61DAFB", label: "React" },
  { icon: SiNextdotjs, color: "#FFFFFF", label: "Next.js" },
  { icon: SiTailwindcss, color: "#06B6D4", label: "Tailwind" },
  { icon: DiJava, color: "#B07219", label: "Java" },
  { icon: SiSpringboot, color: "#6DB33F", label: "Spring Boot" },
  { icon: SiNestjs, color: "#E0234E", label: "NestJS" },
  { icon: SiDocker, color: "#2496ED", label: "Docker" },
  { icon: SiPostgresql, color: "#4169E1", label: "PostgreSQL" },
  { icon: SiGit, color: "#F05032", label: "Git" },
];

const heroName = "Andre Deomondes";

function useTypingLoop() {
  const [displayed, setDisplayed] = useState("");
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIdx < heroName.length) {
            setDisplayed(heroName.slice(0, charIdx + 1));
            setCharIdx((c) => c + 1);
          } else {
            setTimeout(() => setIsDeleting(true), 3000);
          }
        } else {
          if (charIdx > 0) {
            setDisplayed(heroName.slice(0, charIdx - 1));
            setCharIdx((c) => c - 1);
          } else {
            setIsDeleting(false);
          }
        }
      },
      isDeleting ? 50 : 150
    );
    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting]);

  return displayed;
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [80, 0, 0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const typed = useTypingLoop();

  const variants = (delay: number) =>
    ({
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
    }) as const;

  const orbitRadius = 125;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4wNCIgLz48L3N2Zz4=')] opacity-20" />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-16 lg:flex-row lg:gap-24"
      >
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <motion.p
            variants={variants(0.1)}
            initial="hidden"
            animate={isInView ? "visible" : "exit"}
            className="mb-4 text-sm font-medium text-[#8B5CF6]"
          >
            Software Engineer
          </motion.p>

          <motion.h1
            variants={variants(0.15)}
            initial="hidden"
            animate={isInView ? "visible" : "exit"}
            className="mb-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl"
          >
            <span className="text-[#F8FAFC]">
              {typed || heroName}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                className="text-[#8B5CF6] font-light"
              >
                |
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            variants={variants(0.3)}
            initial="hidden"
            animate={isInView ? "visible" : "exit"}
            className="mb-8 max-w-md text-lg leading-relaxed text-[#94A3B8]"
          >
            Construindo produtos com foco em{" "}
            <span className="aurora bg-gradient-to-r from-[#8B5CF6] via-[#60A5FA] via-[#38BDF8] via-[#818CF8] to-[#8B5CF6] bg-clip-text text-transparent bg-[length:200%_auto] font-bold">
              EXPERIENCIA
            </span>{" "}
            <span className="aurora bg-gradient-to-r from-[#8B5CF6] via-[#60A5FA] via-[#38BDF8] via-[#818CF8] to-[#8B5CF6] bg-clip-text text-transparent bg-[length:200%_auto] font-bold">
              PERFORMANCE
            </span>{" "}
            <span className="aurora bg-gradient-to-r from-[#8B5CF6] via-[#60A5FA] via-[#38BDF8] via-[#818CF8] to-[#8B5CF6] bg-clip-text text-transparent bg-[length:200%_auto] font-bold">
              ARQUITETURA
            </span>
            <style>{`@keyframes aurora{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}.aurora{animation:aurora 6s ease infinite}`}</style>
          </motion.p>

          <motion.div
            variants={variants(0.45)}
            initial="hidden"
            animate={isInView ? "visible" : "exit"}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/about"
              className="group relative inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#60A5FA] px-6 text-sm font-medium text-white shadow-lg shadow-[#8B5CF6]/20 transition-all hover:shadow-xl hover:shadow-[#8B5CF6]/30 hover:scale-[1.02]"
            >
              VER CURRÍCULO
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/projects"
              className="group relative inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-6 text-sm font-medium text-[#94A3B8] backdrop-blur-xl transition-all hover:border-[#8B5CF6]/40 hover:text-[#F8FAFC] hover:bg-[#8B5CF6]/10"
            >
              VER PROJETOS
            </Link>
          </motion.div>
        </div>

        <div className="relative flex h-[320px] w-[320px] shrink-0 items-center justify-center">
          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: "center center" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 320 320" className="h-full w-full">
              <defs>
                <radialGradient id="flowGradient" cx="160" cy="160" r="125" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
                  <stop offset="75%" stopColor="#8B5CF6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.9" />
                </radialGradient>
              </defs>

              <circle cx={160} cy={160} r={orbitRadius} fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="0.5" />

              {techIcons.map((_, i) => {
                const angle = (2 * Math.PI * i) / techIcons.length;
                const cosA = Math.cos(angle);
                const sinA = Math.sin(angle);
                return (
                  <line key={i} x1={160 + cosA * orbitRadius} y1={160 + sinA * orbitRadius} x2={160 + cosA * 24} y2={160 + sinA * 24} stroke="rgba(139,92,246,0.06)" strokeWidth="0.5" />
                );
              })}

              {techIcons.map((_, i) => {
                const angle = (2 * Math.PI * i) / techIcons.length;
                const cosA = Math.cos(angle);
                const sinA = Math.sin(angle);
                const outerX = 160 + cosA * orbitRadius;
                const outerY = 160 + sinA * orbitRadius;
                const innerX = 160 + cosA * 24;
                const innerY = 160 + sinA * 24;
                return (
                  <motion.line
                    key={`flow-${i}`}
                    x1={outerX}
                    y1={outerY}
                    x2={innerX}
                    y2={innerY}
                    stroke="url(#flowGradient)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="4 28"
                    animate={{ strokeDashoffset: [0, -96] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.12 }}
                  />
                );
              })}
            </svg>

            {techIcons.map((tech, i) => {
              const angle = (2 * Math.PI * i) / techIcons.length;
              const x = Math.cos(angle) * orbitRadius;
              const y = Math.sin(angle) * orbitRadius;
              return (
                <div
                  key={tech.label}
                  className="absolute"
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%, -50%)" }}
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03]"
                  >
                    <tech.icon className="h-5 w-5" style={{ color: tech.color }} />
                  </motion.div>
                </div>
              );
            })}
          </motion.div>

          <div
            ref={centerRef}
            className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl"
          >
            <BorderBeam size={64} duration={8} delay={0} colorFrom="#8B5CF6" colorTo="#60A5FA" borderWidth={1.5} />
            <Image
              src="/logo.svg"
              alt="André Deomondes"
              width={40}
              height={27}
              className="h-7 w-auto"
              priority
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#64748B]">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4 text-[#64748B]" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
