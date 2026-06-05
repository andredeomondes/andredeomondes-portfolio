"use client";

import { FaAws } from "react-icons/fa";
import { DiJava } from "react-icons/di";
import {
  SiDocker,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiPostgresql,
  SiReact,
  SiRedis,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/shared/components/ui/scroll-based-velocity";
import { GradualBlur } from "@/shared/components/ui/gradual-blur";

const rowOne = [
  { label: "Next.js", icon: SiNextdotjs, color: "#111111" },
  { label: "React", icon: SiReact, color: "#61DAFB" },
  { label: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { label: "Spring", icon: SiSpringboot, color: "#6DB33F" },
  { label: "NestJS", icon: SiNestjs, color: "#E0234E" },
];

const rowTwo = [
  { label: "Java", icon: DiJava, color: "#d97706" },
  { label: "Postgres", icon: SiPostgresql, color: "#4169E1" },
  { label: "Docker", icon: SiDocker, color: "#2496ED" },
  { label: "AWS", icon: FaAws, color: "#FF9900" },
  { label: "Redis", icon: SiRedis, color: "#DC382D" },
  { label: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { label: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
];

function VelocityPill({
  label,
  icon: Icon,
  color,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}) {
  return (
    <span className="mx-2 inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/56 px-4 py-2 text-sm font-medium tracking-[0.18em] text-[#0b1020]/72 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05] dark:text-white/68">
      <Icon className="size-4" style={{ color }} />
      {label}
    </span>
  );
}

export function StackSection() {
  return (
    <section className="relative overflow-hidden border-y border-black/6 bg-[#f5f0e8] py-10 dark:border-white/6 dark:bg-[#040713]">
      <GradualBlur position="left" height="10rem" strength={3} divCount={8} curve="bezier" />
      <GradualBlur position="right" height="10rem" strength={3} divCount={8} curve="bezier" />
      <ScrollVelocityContainer>
        <ScrollVelocityRow baseVelocity={6} className="py-2">
          <div className="flex items-center">
            {rowOne.map((item) => (
              <VelocityPill key={item.label} {...item} />
            ))}
          </div>
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={-7} className="py-2">
          <div className="flex items-center">
            {rowTwo.map((item) => (
              <VelocityPill key={item.label} {...item} />
            ))}
          </div>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </section>
  );
}
