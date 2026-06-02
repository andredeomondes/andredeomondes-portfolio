"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Dock, DockIcon } from "@/shared/components/ui/dock";
import { BorderBeam } from "@/shared/components/ui/border-beam";
import { TextAnimate } from "@/shared/components/ui/text-animate";

const socialLinks = [
  { icon: FaGithub, label: "GitHub", href: "https://github.com/andredeomondes" },
  { icon: FaLinkedin, label: "LinkedIn", href: "https://linkedin.com/in/andredeomondes" },
  { icon: MessageSquare, label: "Email", href: "mailto:contato@andredeomondes.dev" },
];

export function ContatoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [60, 0, 0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const fadeUpVariant = (delay: number) =>
    ({
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
    }) as const;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="flex flex-col items-center">
        <motion.h2
          variants={fadeUpVariant(0.1)}
          initial="hidden"
          animate={isInView ? "visible" : "exit"}
          className="text-center text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl"
        >
          Vamos construir{" "}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[#8B5CF6]"
          >
            algo incrível.
          </motion.span>
        </motion.h2>

        <div className="mt-6 max-w-md">
          <TextAnimate
            animation="fadeIn"
            by="line"
            duration={0.5}
            delay={0.45}
            className="text-center text-base text-[#94A3B8]"
          >
            Estou sempre aberto para conversar
            sobre produtos, tecnologia e novas ideias.
          </TextAnimate>
        </div>

        <motion.div
          variants={fadeUpVariant(0.6)}
          initial="hidden"
          animate={isInView ? "visible" : "exit"}
          className="mt-10"
        >
          <a
            href="https://wa.me/5571999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex h-12 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-8 text-sm font-medium text-[#F8FAFC] backdrop-blur-xl transition-all hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/30"
          >
            Conversar no WhatsApp
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <BorderBeam duration={3} size={80} />
          </a>
        </motion.div>

        <motion.div
          variants={fadeUpVariant(0.8)}
          initial="hidden"
          animate={isInView ? "visible" : "exit"}
          className="mt-16"
        >
          <Dock direction="middle" className="border-white/[0.06] bg-white/[0.02]">
            {socialLinks.map((link) => (
              <DockIcon key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" title={link.label}>
                  <link.icon className="h-5 w-5 text-[#94A3B8] transition-colors hover:text-[#F8FAFC]" />
                </a>
              </DockIcon>
            ))}
          </Dock>
        </motion.div>
      </motion.div>
    </section>
  );
}
