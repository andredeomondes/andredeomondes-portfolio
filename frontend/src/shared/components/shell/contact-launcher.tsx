"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { ArrowUpRight, Copy, Mail, X } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { motionTokens, springs } from "@/lib/motion";
import { useSite } from "@/shared/components/shell/site-provider";
import { useToast } from "@/shared/components/shell/toast";
import { CONTACT_TOPICS, copyText, mailtoUrl, topicMessage, whatsappUrl, type ContactTopicId } from "@/shared/components/shell/contact-actions";
import { cn } from "@/shared/lib/utils";

export function useSalvadorTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const format = () => new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Bahia" }).format(new Date());
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

/** Raycast-style contact sheet: topic tabs on top, a keyboard-navigable action list below. */
function ContactSheet({ onClose }: { onClose: () => void }) {
  const { index } = useSite();
  const toast = useToast();
  const time = useSalvadorTime();
  const [topic, setTopic] = useState<ContactTopicId>("freela");
  const listRef = useRef<HTMLUListElement>(null);
  const message = topicMessage(topic);

  const copyEmail = async () => {
    const ok = await copyText(index.contact.email);
    toast(ok ? "E-mail copiado" : "Não foi possível copiar", index.contact.email);
  };

  // Arrow keys move between actions like a command list.
  const onListKey = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const items = [...(listRef.current?.querySelectorAll<HTMLElement>("[data-action]") ?? [])];
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next = event.key === "ArrowDown" ? (current + 1) % items.length : (current - 1 + items.length) % items.length;
    items[next]?.focus();
    event.preventDefault();
  };

  return (
    <div className="contact-sheet">
      <div className="contact-sheet__head">
        <div>
          <h2 id="contact-title" className="contact-sheet__title">Falar com o Andre</h2>
          <p className="contact-sheet__status">
            <span className="contact-sheet__dot" aria-hidden="true" />
            {index.contact.availability}
            {time ? <span className="tabular"> · {time} em Salvador</span> : null}
          </p>
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Fechar contato">
          <X aria-hidden="true" />
        </button>
      </div>

      <div className="contact-sheet__tabs" role="group" aria-label="Assunto da mensagem">
        {CONTACT_TOPICS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn("contact-sheet__tab", topic === item.id && "is-active")}
            aria-pressed={topic === item.id}
            onClick={() => setTopic(item.id)}
          >
            {topic === item.id ? <motion.span layoutId="contact-tab" className="contact-sheet__tab-bg" transition={springs.snappy} /> : null}
            <span className="contact-sheet__tab-label">{item.label}</span>
          </button>
        ))}
      </div>

      <ul ref={listRef} className="contact-sheet__list" onKeyDown={onListKey}>
        <li>
          <a data-action className="contact-row contact-row--primary" href={whatsappUrl(index.contact, message)} target="_blank" rel="noreferrer">
            <span className="contact-row__icon contact-row__icon--ok"><FaWhatsapp aria-hidden="true" /></span>
            <span className="contact-row__text">
              <strong>Enviar no WhatsApp</strong>
              <small>“{message}”</small>
            </span>
            <ArrowUpRight className="contact-row__trail" aria-hidden="true" />
          </a>
        </li>
        <li>
          <a data-action className="contact-row" href={mailtoUrl(index.contact, message)}>
            <span className="contact-row__icon"><Mail aria-hidden="true" /></span>
            <span className="contact-row__text">
              <strong>Enviar e-mail</strong>
              <small>{index.contact.email}</small>
            </span>
          </a>
        </li>
        <li>
          <button data-action type="button" className="contact-row" onClick={() => void copyEmail()}>
            <span className="contact-row__icon"><Copy aria-hidden="true" /></span>
            <span className="contact-row__text">
              <strong>Copiar e-mail</strong>
              <small>Para colar onde preferir</small>
            </span>
          </button>
        </li>
        <li>
          <a data-action className="contact-row" href={index.contact.linkedin} target="_blank" rel="noreferrer">
            <span className="contact-row__icon"><FaLinkedinIn aria-hidden="true" /></span>
            <span className="contact-row__text"><strong>LinkedIn</strong></span>
            <ArrowUpRight className="contact-row__trail" aria-hidden="true" />
          </a>
        </li>
        <li>
          <a data-action className="contact-row" href={index.contact.github} target="_blank" rel="noreferrer">
            <span className="contact-row__icon"><FaGithub aria-hidden="true" /></span>
            <span className="contact-row__text"><strong>GitHub</strong></span>
            <ArrowUpRight className="contact-row__trail" aria-hidden="true" />
          </a>
        </li>
      </ul>

      <p className="contact-sheet__foot"><kbd>↑</kbd><kbd>↓</kbd> navegar · <kbd>esc</kbd> fechar</p>
    </div>
  );
}

/** Contact dialog opened from the navbar, ⌘K or the home finale: centered on desktop, bottom sheet on mobile. */
export function ContactLauncher() {
  const { contactOpen, setContactOpen } = useSite();
  const reduce = useReducedMotion();
  const small = useIsSmallScreen();
  const restoreFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!contactOpen) return;
    restoreFocus.current = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setContactOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => document.querySelector<HTMLElement>(".contact-sheet [data-action]")?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      restoreFocus.current?.focus?.();
    };
  }, [contactOpen, setContactOpen]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 600) setContactOpen(false);
  };

  return (
    <AnimatePresence>
      {contactOpen ? (
        <motion.div
          className={cn("overlay", small && "overlay--sheet")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionTokens.duration.fast }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setContactOpen(false);
          }}
        >
          <motion.div
            id="contact-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            className={cn("contact-surface", small && "contact-surface--sheet")}
            data-lenis-prevent
            initial={reduce ? { opacity: 0 } : small ? { y: "100%" } : { opacity: 0, scale: 0.96, y: -12, filter: "blur(6px)" }}
            animate={reduce ? { opacity: 1 } : small ? { y: 0 } : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : small ? { y: "100%" } : { opacity: 0, scale: 0.98, y: -6, filter: "blur(4px)" }}
            transition={reduce ? { duration: motionTokens.duration.fast } : small ? springs.sheet : springs.snappy}
            drag={small && !reduce ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={onDragEnd}
          >
            {small ? <span className="contact-surface__grip" aria-hidden="true" /> : null}
            <ContactSheet onClose={() => setContactOpen(false)} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
