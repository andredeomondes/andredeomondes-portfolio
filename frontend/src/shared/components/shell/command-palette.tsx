"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useToast } from "@/shared/components/shell/toast";
import { ArrowUpRight, BookOpen, Copy, FileDown, FolderGit2, Home, MessageCircle, Search, User } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { motionTokens, springs } from "@/lib/motion";
import { useSite } from "@/shared/components/shell/site-provider";
import { copyText, topicMessage, whatsappUrl } from "@/shared/components/shell/contact-actions";
import { cn } from "@/shared/lib/utils";

const PAGES = [
  { href: "/", label: "Início", icon: Home },
  { href: "/projects", label: "Projetos", icon: FolderGit2 },
  { href: "/series/javascript-core", label: "Série JavaScript Core", icon: BookOpen },
  { href: "/posts", label: "Publicações", icon: BookOpen },
  { href: "/about", label: "Sobre", icon: User },
  { href: "/resume", label: "Currículo", icon: FileDown },
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** Palette content, shared by the global dialog and the inline hero console. */
export function PaletteBody({ inline = false, onDone }: { inline?: boolean; onDone?: () => void }) {
  const router = useRouter();
  const { index, setContactOpen } = useSite();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!inline) inputRef.current?.focus();
  }, [inline]);

  const go = (href: string) => {
    onDone?.();
    router.push(href);
  };
  const open = (href: string) => {
    onDone?.();
    window.open(href, "_blank", "noopener,noreferrer");
  };
  const copyEmail = async () => {
    const ok = await copyText(index.contact.email);
    toast(ok ? "E-mail copiado" : "Não foi possível copiar", index.contact.email);
    onDone?.();
  };

  const visiblePosts = query ? index.posts : index.posts.slice(-4).reverse();

  return (
    <Command label="Buscar no site" className={cn("palette", inline && "palette--inline")} loop>
      <div className="palette__search">
        <Search className="palette__search-icon" aria-hidden="true" />
        <Command.Input ref={inputRef} value={query} onValueChange={setQuery} placeholder="Buscar projetos, unidades da série, ações…" />
        <kbd className="palette__kbd">{inline ? "⌘K" : "esc"}</kbd>
      </div>
      <Command.List className="palette__list" data-lenis-prevent>
        <Command.Empty className="palette__empty">Nada encontrado para “{query}”.</Command.Empty>

        <Command.Group heading="Projetos">
          {index.projects.map((project) => (
            <Command.Item key={project.slug} value={`projeto ${project.title} ${project.summary}`} onSelect={() => go(`/projects/${project.slug}`)}>
              <FolderGit2 aria-hidden="true" />
              <span className="palette__title">{project.title}</span>
              <span className="palette__hint">Estudo de caso</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="JavaScript Core">
          {visiblePosts.map((post) => (
            <Command.Item key={post.slug} value={`unidade ${post.unit} ${post.title} ${post.statement}`} onSelect={() => go(`/posts/${post.slug}`)}>
              <span className="palette__unit">{pad(post.unit)}</span>
              <span className="palette__title">{post.title}</span>
              <span className="palette__hint">Unidade</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Ações">
          <Command.Item value="whatsapp conversar mensagem contato" onSelect={() => open(whatsappUrl(index.contact, topicMessage("oi")))}>
            <FaWhatsapp aria-hidden="true" />
            <span className="palette__title">Chamar no WhatsApp</span>
            <ArrowUpRight className="palette__trail" aria-hidden="true" />
          </Command.Item>
          <Command.Item value="copiar email contato" onSelect={() => void copyEmail()}>
            <Copy aria-hidden="true" />
            <span className="palette__title">Copiar e-mail</span>
            <span className="palette__hint">{index.contact.email}</span>
          </Command.Item>
          <Command.Item value="falar comigo contato opções" onSelect={() => { onDone?.(); setContactOpen(true); }}>
            <MessageCircle aria-hidden="true" />
            <span className="palette__title">Ver todas as formas de contato</span>
          </Command.Item>
          <Command.Item value="linkedin perfil" onSelect={() => open(index.contact.linkedin)}>
            <FaLinkedinIn aria-hidden="true" />
            <span className="palette__title">LinkedIn</span>
            <ArrowUpRight className="palette__trail" aria-hidden="true" />
          </Command.Item>
          <Command.Item value="github código" onSelect={() => open(index.contact.github)}>
            <FaGithub aria-hidden="true" />
            <span className="palette__title">GitHub</span>
            <ArrowUpRight className="palette__trail" aria-hidden="true" />
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Páginas">
          {PAGES.map((page) => (
            <Command.Item key={page.href} value={`página ${page.label}`} onSelect={() => go(page.href)}>
              <page.icon aria-hidden="true" />
              <span className="palette__title">{page.label}</span>
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command>
  );
}

/** Global ⌘K dialog. */
export function CommandPalette() {
  const { paletteOpen, setPaletteOpen } = useSite();
  const reduce = useReducedMotion();
  const restoreFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!paletteOpen) return;
    restoreFocus.current = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      restoreFocus.current?.focus?.();
    };
  }, [paletteOpen, setPaletteOpen]);

  return (
    <AnimatePresence>
      {paletteOpen ? (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionTokens.duration.fast }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPaletteOpen(false);
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Buscar no site"
            className="palette-dialog"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -12, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -6, filter: "blur(4px)" }}
            transition={reduce ? { duration: motionTokens.duration.fast } : springs.snappy}
          >
            <PaletteBody onDone={() => setPaletteOpen(false)} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
