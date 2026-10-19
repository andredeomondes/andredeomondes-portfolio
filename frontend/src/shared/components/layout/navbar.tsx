"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { motionTokens, springs } from "@/lib/motion";
import { cn } from "@/shared/lib/utils";
import { ScrambleText } from "@/shared/components/fx/scramble";
import { useSite } from "@/shared/components/shell/site-provider";

const navLinks = [
  { href: "/projects", label: "Projetos" },
  { href: "/series/javascript-core", label: "JS Core" },
  { href: "/posts", label: "Publicações" },
  { href: "/about", label: "Sobre" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { setPaletteOpen, setContactOpen } = useSite();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sync = () => setCompact(window.scrollY > 40);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const close = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const button = menuButtonRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.setTimeout(() => document.querySelector<HTMLAnchorElement>("#mobile-navigation a")?.focus(), 40);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className={cn("nav", compact && "nav--compact", open && "nav--open")}>
      <nav className="nav__bar" aria-label="Navegação principal">
        <Link href="/" className="nav__brand" onClick={() => setOpen(false)} aria-label="Andre Deomondes, início">
          <span className="nav__mark" aria-hidden="true" />
          <span className="nav__name">Andre Deomondes</span>
        </Link>

        <ul className="nav__links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} aria-current={isActive(pathname, link.href) ? "page" : undefined} className="nav__link">
                <ScrambleText text={link.label} />
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav__actions">
          <button type="button" className="nav__search" onClick={() => setPaletteOpen(true)} aria-label="Buscar no site">
            <Search aria-hidden="true" />
            <span className="nav__search-label">Buscar</span>
            <kbd>⌘K</kbd>
          </button>
          <button type="button" className="nav__cta" onClick={() => setContactOpen(true)}>
            Falar comigo
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            className="nav__menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-navigation"
            className="nav__sheet"
            initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
          >
            <ul>
              {[{ href: "/", label: "Início" }, ...navLinks, { href: "/resume", label: "Currículo" }].map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.gentle, delay: reduce ? 0 : 0.05 + index * 0.04 }}
                >
                  <Link
                    href={link.href}
                    aria-current={link.href === "/" ? (pathname === "/" ? "page" : undefined) : isActive(pathname, link.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <button type="button" className="nav__sheet-cta" onClick={() => { setOpen(false); setContactOpen(true); }}>
              Falar comigo
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
