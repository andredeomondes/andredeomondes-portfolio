"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { NoiseTexture } from "@/shared/components/ui/noise-texture";
import { GradualBlur } from "@/shared/components/ui/gradual-blur";
import { ShimmerLink } from "@/shared/components/ui/shimmer-button";

const projects = [
  {
    title: "SaaS de Agendamento para Clínicas Médicas",
    description:
      "Sistema completo de agendamentos, com dashboard administrativo e gestão de pacientes.",
    href: "/projects",
    image: "/clubeprogramacao.png",
    tags: ["TypeScript", "Next.js", "React.js", "Node.js", "+2"],
  },
  {
    title: "SaaS Completo de para Barbearias",
    description:
      "Plataforma de agendamento online para barbearias com sistema de reservas e gestão de serviços.",
    href: "/projects",
    image: "/clubeprogramacao.png",
    tags: ["TypeScript", "Next.js", "React.js", "Node.js", "+2"],
  },
  {
    title: "Self Checkout para Lanchonetes",
    description:
      "Sistema com foco em diminuir filas em lanchonetes, automatizando pedidos e pagamentos.",
    href: "/projects",
    image: "/clubeprogramacao.png",
    tags: ["TypeScript", "Next.js", "React.js", "Node.js", "+2"],
  },
];

export function ConstruindoSection() {
  return (
    <section className="relative overflow-hidden bg-[#ece7df] px-6 py-24 text-[#0b1020] dark:bg-[#050816] dark:text-white sm:px-8 lg:px-12">
      <NoiseTexture
        noiseOpacity={0.1}
        frequency={0.6}
        octaves={3}
        slope={0.82}
        className="opacity-35 mix-blend-soft-light"
      />
      <GradualBlur
        position="top"
        height="8rem"
        strength={2}
        divCount={7}
        curve="bezier"
      />
      <GradualBlur
        position="bottom"
        height="10rem"
        strength={2.5}
        divCount={7}
        curve="bezier"
      />

      <div className="relative mx-auto max-w-7xl min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex items-center gap-4"
        >
          <h2 className="text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
            Meus Projetos
          </h2>
          <span className="h-1 w-12 rounded-full bg-violet-500" />
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.65,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-[1.75rem] border border-black/8 bg-white/72 text-[#0b1020] backdrop-blur-xl transition-all duration-300 hover:border-violet-500/22 hover:shadow-[0_20px_60px_rgba(139,92,246,0.14),0_0_0_1px_rgba(139,92,246,0.07)] dark:border-white/8 dark:bg-white/[0.06] dark:text-white dark:hover:border-violet-400/28 dark:hover:shadow-[0_20px_60px_rgba(139,92,246,0.22)]"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.06),transparent_60%)]" />
              <div className="overflow-hidden border-b border-black/8 dark:border-white/8">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={1200}
                  height={900}
                  className="h-56 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>

              <div className="p-6">
                <h3 className="text-balance text-[1.95rem] font-semibold tracking-[-0.05em]">
                  {project.title}
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-black/8 bg-black/[0.04] px-3 py-1.5 text-xs text-[#0b1020]/58 dark:border-white/8 dark:bg-white/[0.04] dark:text-white/58"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <Image
                    src="/andre.jpg"
                    alt="Andre Deomondes"
                    width={40}
                    height={40}
                    className="size-10 rounded-full border border-black/10 object-cover dark:border-white/10"
                  />
                  <p className="text-sm leading-7 text-[#0b1020]/54 dark:text-white/54">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-4 text-sm">
                  <ShimmerLink
                    href={project.href}
                    shimmerColor="#a78bfa"
                    background="rgba(109,40,217,0.82)"
                    className="h-9 gap-1.5 px-4 text-xs font-medium shadow-[0_0_18px_rgba(139,92,246,0.35)]"
                  >
                    Ver projeto
                    <ArrowUpRight className="size-3.5" />
                  </ShimmerLink>
                  <a
                    href="https://github.com/andredeomondes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0b1020]/42 transition-colors hover:text-[#0b1020]/72 dark:text-white/46 dark:hover:text-white/72"
                    aria-label="GitHub"
                  >
                    <FaGithub className="size-4" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
