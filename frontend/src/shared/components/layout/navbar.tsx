"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const navLinks = [
  { href: "/projects", label: "Projetos" },
  { href: "/posts", label: "Publicações" },
  { href: "/about", label: "Sobre" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncNavigationState = () => setCompact(window.scrollY > 24);

    syncNavigationState();
    window.addEventListener("scroll", syncNavigationState, { passive: true });
    return () => window.removeEventListener("scroll", syncNavigationState);
  }, []);

  useEffect(() => {
    const desktopBreakpoint = window.matchMedia("(min-width: 768px)");
    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    desktopBreakpoint.addEventListener("change", closeMenuOnDesktop);
    return () => desktopBreakpoint.removeEventListener("change", closeMenuOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !mobileMenuRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let cleanup: () => void = () => {};

    void import("gsap").then(({ gsap }) => {
      if (disposed || !mobileMenuRef.current) return;
      const context = gsap.context(() => {
        const rows = mobileMenuRef.current?.querySelectorAll(".mobile-menu__link");
        const footer = mobileMenuRef.current?.querySelector(".mobile-menu__footer");
        const timeline = gsap.timeline();

        timeline
          .from(mobileMenuRef.current, {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.4,
            ease: "power4.inOut",
          })
          .from(
            rows ?? [],
            {
              autoAlpha: 0,
              y: 24,
              duration: 0.32,
              stagger: 0.05,
              ease: "power3.out",
            },
            "-=0.18",
          )
          .from(
            footer ?? [],
            {
              autoAlpha: 0,
              y: 12,
              duration: 0.24,
              ease: "power2.out",
            },
            "-=0.16",
          );
      }, mobileMenuRef);
      cleanup = () => context.revert();
    });

    return () => {
      disposed = true;
      cleanup();
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
      <nav className="site-shell visuvate-nav relative z-[2] grid h-[4.5rem] grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]" aria-label="Navegação principal">
        <Link
          href="/"
          className="site-wordmark justify-self-start"
          onClick={() => setOpen(false)}
        >
          ANDREDEOMONDES<span>.DEV</span>
        </Link>

        <div className="hidden items-center justify-self-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={cn("nav-link", active && "text-signal")}>
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="navbar-actions hidden justify-self-end md:flex">
          <span className="navbar-status"><i /> disponível</span>
          <Link href="/#contato" className="navbar-contact">Vamos conversar ↗</Link>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center justify-self-end rounded-full border border-line text-paper transition-colors hover:border-signal hover:text-signal md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      {open ? (
        <div ref={mobileMenuRef} id="mobile-navigation" className="visuvate-mobile-menu md:hidden">
          <div className="site-shell mobile-menu__inner">
            <div className="mobile-menu__links">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="mobile-menu__link"
                >
                  {link.label}<span className="font-mono text-xs text-dim">0{index + 1}</span>
                </Link>
              ))}
            </div>

            <div className="mobile-menu__footer">
              <span className="mobile-menu__status"><i /> Disponível para novos projetos</span>
              <Link href="/#contato" onClick={() => setOpen(false)} className="mobile-menu__contact">Vamos conversar ↗</Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
