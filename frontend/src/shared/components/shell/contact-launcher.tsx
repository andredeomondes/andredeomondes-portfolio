"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { toast } from "sonner";
import { ArrowUpRight, Copy, Mail, MessageCircle, X } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { motionTokens, springs } from "@/lib/motion";
import { useSite } from "@/shared/components/shell/site-provider";
import { CONTACT_TOPICS, copyText, mailtoUrl, topicMessage, whatsappUrl, type ContactTopicId } from "@/shared/components/shell/contact-actions";
import { cn } from "@/shared/lib/utils";

function useSalvadorTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Bahia" }).format(new Date());
    const first = window.setTimeout(() => setTime(format()), 0);
    const id = window.setInterval(() => setTime(format()), 30_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  return time;
}

function useIsSmallScreen() {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const sync = () => setSmall(query.matches);
    const first = window.setTimeout(sync, 0);
    query.addEventListener("change", sync);
    return () => {
      window.clearTimeout(first);
      query.removeEventListener("change", sync);
    };
  }, []);
  return small;
}

/** The contact panel body. Rendered inside the floating launcher and inline in the footer. */
export function ContactPanel({ onClose, headingId = "contact-title" }: { onClose?: () => void; headingId?: string }) {
  const { index } = useSite();
  const time = useSalvadorTime();
  const [topic, setTopic] = useState<ContactTopicId>("freela");
  const message = topicMessage(topic);

  const copyEmail = async () => {
    const ok = await copyText(index.contact.email);
    toast(ok ? "E-mail copiado" : "Não foi possível copiar", { description: index.contact.email });
  };

  return (
    <div className="contact-panel">
      <div className="contact-panel__head">
        <div>
          <h2 id={headingId} className="contact-panel__title">Fale comigo</h2>
          <p className="contact-panel__status">
            <span className="contact-panel__dot" aria-hidden="true" />
            {index.contact.availability}
            {time ? <span className="contact-panel__time"> · {time} em Salvador</span> : null}
          </p>
        </div>
        {onClose ? (
          <button type="button" className="icon-button" onClick={onClose} aria-label="Fechar contato">
            <X aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <fieldset className="contact-panel__topics">
        <legend>Sobre o que vamos conversar?</legend>
        <div>
          {CONTACT_TOPICS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn("chip", topic === item.id && "is-active")}
              aria-pressed={topic === item.id}
              onClick={() => setTopic(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <p className="contact-panel__preview" aria-live="polite">“{message}”</p>

      <div className="contact-panel__actions">
        <a className="contact-action contact-action--primary" href={whatsappUrl(index.contact, message)} target="_blank" rel="noreferrer">
          <FaWhatsapp aria-hidden="true" />
          <span>
            <strong>Enviar no WhatsApp</strong>
            <small>Resposta mais rápida</small>
          </span>
          <ArrowUpRight className="contact-action__trail" aria-hidden="true" />
        </a>
        <div className="contact-action contact-action--split">
          <a href={mailtoUrl(index.contact, message)}>
            <Mail aria-hidden="true" />
            <span>
              <strong>Enviar e-mail</strong>
              <small>{index.contact.email}</small>
            </span>
          </a>
          <button type="button" onClick={() => void copyEmail()} aria-label="Copiar e-mail">
            <Copy aria-hidden="true" />
          </button>
        </div>
        <div className="contact-panel__socials">
          <a href={index.contact.linkedin} target="_blank" rel="noreferrer"><FaLinkedinIn aria-hidden="true" /> LinkedIn</a>
          <a href={index.contact.github} target="_blank" rel="noreferrer"><FaGithub aria-hidden="true" /> GitHub</a>
        </div>
      </div>
    </div>
  );
}

/** Floating "Falar comigo" button + anchored panel (desktop) or draggable bottom sheet (mobile). */
export function ContactLauncher() {
  const pathname = usePathname();
  const { contactOpen, setContactOpen } = useSite();
  const reduce = useReducedMotion();
  const small = useIsSmallScreen();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const [tucked, setTucked] = useState(false);

  // Hide the floating trigger while the footer's inline contact panel is on screen.
  useEffect(() => {
    const target = document.getElementById("contato");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setTucked(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (contactOpen) {
      wasOpen.current = true;
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") setContactOpen(false);
      };
      window.addEventListener("keydown", onKey);
      window.setTimeout(() => document.querySelector<HTMLElement>(".launcher-surface .chip")?.focus(), 60);
      return () => window.removeEventListener("keydown", onKey);
    }
    if (wasOpen.current) triggerRef.current?.focus();
  }, [contactOpen, setContactOpen]);

  if (pathname.startsWith("/admin")) return null;

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 600) setContactOpen(false);
  };

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        className={cn("launcher-trigger", tucked && !contactOpen && "is-tucked")}
        aria-hidden={tucked && !contactOpen ? true : undefined}
        tabIndex={tucked && !contactOpen ? -1 : 0}
        aria-expanded={contactOpen}
        aria-controls="contact-launcher"
        onClick={() => setContactOpen(!contactOpen)}
        whileTap={reduce ? undefined : { scale: motionTokens.scale.press }}
      >
        <span className="launcher-trigger__dot" aria-hidden="true" />
        <MessageCircle aria-hidden="true" />
        Falar comigo
      </motion.button>

      <AnimatePresence>
        {contactOpen ? (
          <>
            {small ? (
              <motion.div
                className="overlay overlay--sheet"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setContactOpen(false)}
              />
            ) : null}
            <motion.div
              id="contact-launcher"
              role="dialog"
              aria-modal={small}
              aria-labelledby="launcher-contact-title"
              className={cn("launcher-surface", small ? "launcher-surface--sheet" : "launcher-surface--panel")}
              initial={reduce ? { opacity: 0 } : small ? { y: "100%" } : { opacity: 0, y: 16, scale: 0.96, filter: "blur(6px)" }}
              animate={reduce ? { opacity: 1 } : small ? { y: 0 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0 } : small ? { y: "100%" } : { opacity: 0, y: 10, scale: 0.98, filter: "blur(4px)" }}
              transition={reduce ? { duration: motionTokens.duration.fast } : small ? springs.sheet : springs.snappy}
              drag={small && !reduce ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={onDragEnd}
            >
              {small ? <span className="launcher-surface__grip" aria-hidden="true" /> : null}
              <ContactPanel headingId="launcher-contact-title" onClose={() => setContactOpen(false)} />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
