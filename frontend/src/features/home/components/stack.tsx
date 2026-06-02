"use client";

import { Marquee } from "@/shared/components/ui/marquee";
import {
  SiTypescript, SiSpringboot, SiNestjs, SiReact,
  SiDocker, SiPostgresql, SiGit, SiTailwindcss, SiNextdotjs,
} from "react-icons/si";
import { DiJava } from "react-icons/di";

const stackItems = [
  { icon: SiTypescript, label: "TypeScript", color: "#3178C6" },
  { icon: DiJava, label: "Java", color: "#B07219" },
  { icon: SiNestjs, label: "NestJS", color: "#E0234E" },
  { icon: SiSpringboot, label: "Spring Boot", color: "#6DB33F" },
  { icon: SiReact, label: "React", color: "#61DAFB" },
  { icon: SiNextdotjs, label: "Next.js", color: "#FFFFFF" },
  { icon: SiDocker, label: "Docker", color: "#2496ED" },
  { icon: SiPostgresql, label: "PostgreSQL", color: "#4169E1" },
  { icon: SiGit, label: "Git", color: "#F05032" },
  { icon: SiTailwindcss, label: "Tailwind CSS", color: "#06B6D4" },
];

export function StackSection() {
  return (
    <div className="relative border-t border-white/[0.04] py-14">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.25em] text-[#64748B]">
        Tecnologias que utilizo
      </p>
      <Marquee pauseOnHover repeat={3} className="[--duration:50s]">
        {stackItems.map((item) => (
          <div
            key={item.label}
            className="mx-3 flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5"
          >
            <item.icon className="h-5 w-5" style={{ color: item.color }} />
            <span className="text-xs font-medium text-[#94A3B8]">{item.label}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
