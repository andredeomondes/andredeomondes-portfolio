"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ImagePlus, Mail, MessageCircle, X } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { Dock, DockIcon } from "@/shared/components/ui/dock";
import { NoiseTexture } from "@/shared/components/ui/noise-texture";
import { RetroGrid } from "@/shared/components/ui/retro-grid";
import {
  ShimmerAnchor,
  ShimmerLink,
} from "@/shared/components/ui/shimmer-button";

const socialLinks = [
  {
    href: "https://github.com/andredeomondes",
    label: "GitHub",
    icon: FaGithub,
  },
  {
    href: "https://linkedin.com/in/andredeomondes",
    label: "LinkedIn",
    icon: FaLinkedin,
  },
  {
    href: "https://instagram.com/andredeomondes.dev",
    label: "Instagram",
    icon: FaInstagram,
  },
  {
    href: "mailto:contato@andredeomondes.dev",
    label: "Email",
    icon: Mail,
  },
];

const whatsappNumber = "5571988384932";

export function ContatoSection() {
  const [message, setMessage] = useState("");
  const [imageName, setImageName] = useState("");

  const whatsappHref = useMemo(() => {
    const baseMessage = message.trim()
      ? `Olá André, quero criar este software:%0A%0A${encodeURIComponent(
          message.trim(),
        )}`
      : "Olá André, quero criar um software e conversar sobre o projeto.";

    const imageNote = imageName
      ? `%0A%0AImagem de referência selecionada: ${encodeURIComponent(
          imageName,
        )}%0A(Vou anexar a imagem no WhatsApp.)`
      : "";

    return `https://wa.me/${whatsappNumber}?text=${baseMessage}${imageNote}`;
  }, [imageName, message]);

  return (
    <section
      id="contato"
      className="relative isolate min-h-screen overflow-hidden bg-[#eef2f6] px-6 py-28 text-[#0b1020] dark:bg-[#030611] dark:text-white sm:px-8 lg:px-12"
    >
      {/* Light mode bg */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_20%,rgba(139,92,246,0.14),transparent_40%),linear-gradient(145deg,#eef2f6_0%,#e7e8ef_52%,#e2ddf3_100%)] dark:bg-[radial-gradient(circle_at_50%_20%,rgba(120,80,220,0.28),transparent_28%),linear-gradient(180deg,#030611_0%,#070914_45%,#090313_100%)]" />

      <NoiseTexture
        noiseOpacity={0.08}
        frequency={0.55}
        octaves={3}
        slope={0.7}
        className="z-[1] opacity-30 mix-blend-soft-light"
      />

      <RetroGrid
        className="z-[2]"
        angle={62}
        cellSize={55}
        opacity={1}
        lightLineColor="rgba(109,40,217,0.55)"
        darkLineColor="rgba(167,139,250,0.85)"
      />
      {/* Violet horizon glow */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[28%] z-[3] h-px bg-gradient-to-r from-transparent via-violet-500/70 to-transparent dark:via-violet-500/90"
        style={{ boxShadow: "0 0 30px 6px rgba(139,92,246,0.45), 0 0 90px 18px rgba(139,92,246,0.2)" }}
      />
      <div className="pointer-events-none absolute bottom-[26%] left-1/2 z-[3] h-32 w-[80%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.22),transparent_70%)] blur-3xl dark:bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.35),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-6xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2.2rem] border border-violet-400/35 bg-[#080b18]/58 p-6 text-center shadow-[0_0_80px_rgba(120,80,220,0.28)] backdrop-blur-xl sm:p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(166,120,255,0.13),transparent_55%)]" />

          <div className="relative z-10">
            <h2 className="text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-5xl">
              Descreva o software
              <br />
              que você quer criar.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/58">
              Envie a ideia no WhatsApp e, se quiser, leve uma imagem de
              referência junto.
            </p>

            <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-[#090d1f]/76 p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <label
                htmlFor="service-chat"
                className="text-[11px] font-medium uppercase tracking-[0.26em] text-white/44"
              >
                Mensagem inicial
              </label>

              <textarea
                id="service-chat"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ex.: quero um sistema interno com dashboard, automações e uma área de atendimento."
                className="mt-3 min-h-44 w-full resize-none rounded-[1.4rem] border border-white/10 bg-[#050817]/90 px-4 py-4 text-sm leading-7 text-white outline-none transition-all duration-300 placeholder:text-white/28 hover:border-white/16 focus:border-violet-400 focus:shadow-[0_0_0_4px_rgba(127,103,255,0.14)]"
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.09]">
                  <ImagePlus className="size-4 transition-transform duration-300 group-hover:scale-110" />
                  Adicionar imagem
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      setImageName(file?.name ?? "");
                    }}
                  />
                </label>

                {imageName ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white/72">
                    <span className="max-w-44 truncate">{imageName}</span>
                    <button
                      type="button"
                      onClick={() => setImageName("")}
                      className="inline-flex size-5 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                      aria-label="Remover imagem"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-white/40">
                    A imagem será anexada manualmente ao abrir o WhatsApp.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <ShimmerAnchor
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                shimmerColor="#4ade80"
                background="rgba(22,163,74,0.88)"
                className="h-12 gap-2 px-6 text-sm font-medium shadow-[0_0_28px_rgba(34,197,94,0.4)]"
              >
                Enviar no WhatsApp
                <FaWhatsapp className="size-4" />
              </ShimmerAnchor>

              <ShimmerLink
                href="/projects"
                shimmerColor="#a78bfa"
                background="rgba(30,27,75,0.72)"
                className="h-12 border-violet-500/30 px-6 text-sm font-medium shadow-[0_0_18px_rgba(139,92,246,0.22)]"
              >
                Ver projetos
              </ShimmerLink>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 text-xs text-white/42">
              <MessageCircle className="size-3.5" />
              WhatsApp: +55 71 98838-4932
            </div>

            <Dock className="mt-10 border-white/10 bg-white/[0.05]">
              {socialLinks.map((item) => (
                <DockIcon
                  key={item.label}
                  className="text-white transition-colors duration-300 hover:text-violet-200"
                >
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    title={item.label}
                    className="flex items-center justify-center"
                  >
                    <item.icon className="size-4" />
                  </a>
                </DockIcon>
              ))}
            </Dock>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
