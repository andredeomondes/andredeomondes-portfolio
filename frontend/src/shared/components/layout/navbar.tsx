"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { PixelMark } from "@/shared/components/brand/pixel-mark";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/projects", label: "Projetos" },
  { href: "/series/javascript-core", label: "JS Core" },
  { href: "/about", label: "Sobre" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const syncNavigationState = () => setCompact(window.scrollY > 24);

    syncNavigationState();
    window.addEventListener("scroll", syncNavigationState, { passive: true });
    return () => window.removeEventListener("scroll", syncNavigationState);
  }, []);

  useEffect(() => {
    const desktopBreakpoint = window.matchMedia("(min-width: 1024px)");
    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    desktopBreakpoint.addEventListener("change", closeMenuOnDesktop);
    return () => desktopBreakpoint.removeEventListener("change", closeMenuOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    const firstLink = document.querySelector<HTMLAnchorElement>("#mobile-navigation a");
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    firstLink?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      menuButton?.focus();
    };
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "site-navigation fixed inset-x-0 top-0 z-[70]",
        compact && "site-navigation--compact",
        open && "site-navigation--menu-open",
      )}
    >
      <nav className="site-shell visuvate-nav relative z-[2] grid h-[4.5rem] grid-cols-[1fr_auto] items-center lg:grid-cols-[1fr_auto_1fr]" aria-label="Navegação principal">
        <Link
          href="/"
          className="site-wordmark justify-self-start"
          onClick={() => setOpen(false)}
        >
          <PixelMark />
          <span className="site-wordmark__name">andredeomondes<span className="site-wordmark__tld">.dev</span></span>
        </Link>

        <div className="hidden items-center justify-self-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className="nav-link">
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="navbar-actions hidden justify-self-end lg:flex">
          <Link href="/#contato" className="navbar-contact"><i aria-hidden="true" /><span className="navbar-contact__long">Disponível ·&nbsp;</span>Contato</Link>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="mobile-menu-trigger grid size-10 place-items-center justify-self-end rounded-[10px] border border-line text-paper transition-colors hover:border-signal hover:text-signal lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open ? (
        <div id="mobile-navigation" className="visuvate-mobile-menu lg:hidden">
          <div className="site-shell mobile-menu__inner">
            <div className="mobile-menu__links">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="mobile-menu__link"
                >
                  {link.label}<span className="font-pixel text-xs text-dim">0{index + 1}</span>
                </Link>
              ))}
            </div>

            <div className="mobile-menu__footer">
              <span className="mobile-menu__status"><i /> Disponível para novos projetos</span>
              <Link href="/#contato" onClick={() => setOpen(false)} className="mobile-menu__contact">Contato ↗</Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
