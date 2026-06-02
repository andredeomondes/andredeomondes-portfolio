"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  MapPin,
  Globe,
  BookOpen,
  ExternalLink,
  Mail,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";

const sidebarLinks = [
  { label: "Introdução", href: "#introducao" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Formação", href: "#formacao" },
  { label: "Tecnologias", href: "#tecnologias" },
  { label: "Contato", href: "#contato" },
];

const experiences = [
  {
    company: "AMR Mobile",
    period: "2025 — Atualmente",
    description:
      "Desenvolvimento de sistemas internos, automações e aplicações mobile para operação e gestão.",
    tags: ["Sistemas Internos", "Automação", "Aplicações Mobile"],
  },
  {
    company: "Loyloucha Imports",
    period: "2025",
    description:
      "Desenvolvimento de soluções para gestão interna, automatização de processos e melhoria operacional.",
    tags: ["Gestão Interna", "Automação", "Processos"],
  },
  {
    company: "SENAI",
    period: "2025",
    description:
      "Desenvolvimento de projetos acadêmicos e aplicação de tecnologias em soluções práticas e inovadoras.",
    tags: ["Projetos Acadêmicos", "Pesquisa Aplicada", "Desenvolvimento"],
  },
];

const education = [
  { degree: "Engenharia da Computação", institution: "SENAI CIMATEC" },
  {
    degree: "Técnico em Desenvolvimento de Sistemas",
    institution: "SENAI Dendezeiros",
  },
];

const techCategories = [
  {
    title: "Backend",
    items: ["Java", "Spring Boot", "NestJS", "Fastify", "Node.js"],
  },
  {
    title: "Frontend",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Database & Cache",
    items: ["PostgreSQL", "Redis", "Prisma"],
  },
  {
    title: "DevOps & Tools",
    items: ["Docker", "AWS", "Git", "GitHub"],
  },
];

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-32 lg:flex-row">
      <aside className="lg:sticky lg:top-32 lg:h-fit lg:w-72 shrink-0">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6"
        >
          <Avatar className="h-24 w-24 rounded-xl border border-white/[0.08]">
            <AvatarImage src="/andre.jpg" alt="André Deomondes" className="rounded-xl" />
            <AvatarFallback className="rounded-xl bg-[#8B5CF6]/20 text-lg font-semibold text-[#8B5CF6]">
              AD
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-lg font-semibold text-[#F8FAFC]">
              André Deomondes
            </h1>
            <p className="text-sm text-[#94A3B8]">Software Engineer</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <MapPin className="h-3 w-3" />
            Salvador, BA
          </div>

          <div className="text-xs text-[#64748B]">
            <p>Português — Nativo</p>
            <p>English — Intermediate</p>
          </div>

          <nav className="hidden flex-col gap-2 lg:flex">
            {sidebarLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[#94A3B8] transition-all hover:text-[#8B5CF6] hover:translate-x-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/andredeomondes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
            >
              <FaGithub className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com/in/andredeomondes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
            >
              <FaLinkedin className="h-4 w-4" />
            </a>
            <a
              href="mailto:contato@andredeomondes.dev"
              className="text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </aside>

      <div className="flex-1 space-y-24">
        <section id="introducao">
          <FadeUp>
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-[#F8FAFC] sm:text-4xl">
              Construindo soluções
              <br />
              digitais que geram
              <br />
              impacto real.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-[#94A3B8]">
              <p>
                Sou engenheiro de software focado na construção de sistemas,
                automações e produtos digitais.
              </p>
              <p>
                Atualmente desenvolvo soluções para empresas e iniciativas
                próprias, transformando problemas complexos em software simples,
                escalável e útil.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-[#8B5CF6]">
                  Foco
                </h3>
                <ul className="space-y-2 text-sm text-[#94A3B8]">
                  <li>• Desenvolvimento de Software</li>
                  <li>• Automação de Processos</li>
                  <li>• Produtos Digitais</li>
                </ul>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-[#8B5CF6]">
                  Interesses
                </h3>
                <ul className="space-y-2 text-sm text-[#94A3B8]">
                  <li>• Arquitetura de Software</li>
                  <li>• Performance</li>
                  <li>• Experiência do Usuário</li>
                  <li>• Inteligência Artificial</li>
                </ul>
              </div>
            </div>
          </FadeUp>
        </section>

        <section id="experiencia">
          <FadeUp>
            <h2 className="mb-2 text-sm font-medium text-[#8B5CF6]">
              Experiência
            </h2>
          </FadeUp>

          <div className="relative mt-8 space-y-10">
            <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-px bg-white/[0.08]" />

            {experiences.map((exp, i) => (
              <FadeUp key={exp.company} delay={i * 0.1}>
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#8B5CF6] bg-[#050816]" />
                  <span className="text-xs font-medium text-[#64748B]">
                    {exp.period}
                  </span>
                  <h3 className="mt-1 text-lg font-medium text-[#F8FAFC]">
                    {exp.company}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
                    {exp.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="border-white/[0.06] bg-white/[0.03] text-xs text-[#94A3B8]"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        <section id="formacao">
          <FadeUp>
            <h2 className="mb-2 text-sm font-medium text-[#8B5CF6]">
              Formação
            </h2>
          </FadeUp>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {education.map((edu, i) => (
              <FadeUp key={edu.degree} delay={i * 0.08}>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all hover:border-white/[0.12]">
                  <BookOpen className="mb-3 h-4 w-4 text-[#8B5CF6]" />
                  <h3 className="text-base font-medium text-[#F8FAFC]">
                    {edu.degree}
                  </h3>
                  <p className="mt-1 text-sm text-[#64748B]">
                    {edu.institution}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        <section id="tecnologias">
          <FadeUp>
            <h2 className="mb-2 text-sm font-medium text-[#8B5CF6]">
              Tecnologias
            </h2>
          </FadeUp>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {techCategories.map((cat, i) => (
              <FadeUp key={cat.title} delay={i * 0.1}>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
                  <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-[#8B5CF6]">
                    {cat.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <Badge
                        key={item}
                        variant="secondary"
                        className="border-white/[0.06] bg-white/[0.03] text-xs text-[#94A3B8]"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        <section id="contato">
          <FadeUp>
            <h2 className="mb-2 text-sm font-medium text-[#8B5CF6]">Contato</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="mt-4 text-base text-[#94A3B8]">
              Estou disponível para conversar sobre oportunidades, colaborações
              e projetos interessantes.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="mailto:contato@andredeomondes.dev"
                className="group inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 text-sm font-medium text-[#F8FAFC] backdrop-blur-xl transition-all hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/30"
              >
                <Mail className="h-4 w-4" />
                Email
                <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="https://wa.me/5571999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 text-sm font-medium text-[#F8FAFC] backdrop-blur-xl transition-all hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/30"
              >
                <Globe className="h-4 w-4" />
                WhatsApp
                <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </FadeUp>
        </section>
      </div>
    </div>
  );
}
