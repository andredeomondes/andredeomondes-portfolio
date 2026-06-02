"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { TextAnimate } from "@/shared/components/ui/text-animate";
import { OrbitingCircles } from "@/shared/components/ui/orbiting-circles";
import { SiTypescript, SiSpringboot, SiReact, SiDocker, SiPostgresql, SiRedis } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { DiJava } from "react-icons/di";

const techIcons = [
  { icon: SiTypescript, label: "TypeScript", color: "#3178C6" },
  { icon: DiJava, label: "Java", color: "#007396" },
  { icon: SiSpringboot, label: "Spring Boot", color: "#6DB33F" },
  { icon: SiReact, label: "React", color: "#61DAFB" },
  { icon: FaAws, label: "AWS", color: "#FF9900" },
  { icon: SiDocker, label: "Docker", color: "#2496ED" },
  { icon: SiPostgresql, label: "PostgreSQL", color: "#4169E1" },
  { icon: SiRedis, label: "Redis", color: "#DC382D" },
];

export function EcossistemaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [80, 0, 0, -80]);
  const orbitScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.85, 1, 1, 0.85]);

  const fadeUpVariant = (delay: number) =>
    ({
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
    }) as const;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <motion.div
        style={{ y: textY }}
        className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-24"
      >
        <div className="order-2 flex-1 lg:order-1">
          <div className="relative flex h-72 w-72 items-center justify-center sm:h-96 sm:w-96 mx-auto lg:mx-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <motion.span
                  className="text-xs font-medium uppercase tracking-[0.2em] text-[#8B5CF6]"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Building
                </motion.span>
                <motion.span
                  className="text-lg font-semibold text-[#F8FAFC]"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  Digital
                </motion.span>
                <motion.span
                  className="text-lg font-semibold text-[#F8FAFC]"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  Products
                </motion.span>
              </div>
            </div>

            {[0, 1, 2].map((ring) => (
              <svg key={ring} className="absolute h-full w-full" viewBox="0 0 400 400">
                <motion.circle
                  cx="200"
                  cy="200"
                  r={50 + ring * 40}
                  fill="none"
                  stroke="#8B5CF6"
                  strokeOpacity={0.08 + ring * 0.03}
                  strokeWidth={0.5 + ring * 0.2}
                  strokeDasharray={`${30 + ring * 20} ${10 + ring * 10}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 1.5, delay: 0.8 + ring * 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
            ))}

            {techIcons.map((tech, i) => (
              <motion.div
                key={tech.label}
                variants={fadeUpVariant(0.5 + i * 0.06)}
                initial="hidden"
                animate={isInView ? "visible" : "exit"}
              >
                <OrbitingCircles
                  radius={80 + (i % 4) * 25}
                  duration={14 + i * 3}
                  speed={1.5 - (i % 4) * 0.15}
                  reverse={i % 2 === 0}
                  path={false}
                  iconSize={32}
                >
                  <motion.div
                    className="flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] p-1.5 backdrop-blur-xl"
                    whileHover={{ scale: 1.3 }}
                    animate={{ y: [0, 3, 0] }}
                    transition={{ y: { duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut" } }}
                  >
                    <tech.icon className="h-4 w-4" style={{ color: tech.color }} />
                  </motion.div>
                </OrbitingCircles>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="order-1 flex-1 lg:order-2">
          <motion.p
            variants={fadeUpVariant(0.1)}
            initial="hidden"
            animate={isInView ? "visible" : "exit"}
            className="mb-3 text-sm font-medium text-[#8B5CF6]"
          >
            Ecossistema Técnico
          </motion.p>

          <motion.h2
            variants={fadeUpVariant(0.2)}
            initial="hidden"
            animate={isInView ? "visible" : "exit"}
            className="text-4xl font-semibold leading-[1.1] tracking-tight text-[#F8FAFC] sm:text-5xl"
          >
            Meu Ecossistema
            <br />
            Técnico
          </motion.h2>

          <TextAnimate
            animation="blurIn"
            by="line"
            duration={0.5}
            delay={0.35}
            className="mt-6 max-w-md text-lg leading-relaxed text-[#94A3B8]"
          >
            Tecnologias são ferramentas.
            O que importa é como elas se conectam
            para resolver problemas reais.
          </TextAnimate>
        </div>
      </motion.div>
    </section>
  );
}
