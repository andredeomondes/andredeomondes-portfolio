"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !mobileMenuRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let cleanup: () => void = () => {};

    void import("gsap").then(({ gsap }) => {
      if (disposed || !mobileMenuRef.current) return;
      const context = gsap.context(() => {
        const rows = mobileMenuRef.current?.querySelectorAll("a");
        gsap.from(mobileMenuRef.current, { autoAlpha: 0, y: -8, duration: 0.22, ease: "power3.out" });
        gsap.from(rows ?? [], { autoAlpha: 0, x: -12, duration: 0.3, stagger: 0.045, ease: "power2.out" });
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
    <header className="site-navigation fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/92 backdrop-blur-md">
      <nav className="site-shell flex h-16 items-center justify-between" aria-label="Navegação principal">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:text-signal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
          onClick={() => setOpen(false)}
        >
          Andre Deomondes
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href} className={cn("nav-link", active && "text-signal")}>
                {link.label}
              </Link>
            );
          })}
          <a href="mailto:contato@andredeomondes.dev" className="border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper transition-colors hover:border-signal hover:text-signal">
            Contato ↗
          </a>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center border border-line text-paper md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      {open ? (
        <div ref={mobileMenuRef} id="mobile-navigation" className="overflow-hidden border-t border-line bg-ink px-5 py-6 md:hidden">
          <div className="site-shell flex flex-col">
            {navLinks.map((link, index) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-line py-5 text-2xl font-semibold tracking-[-0.04em] text-paper">
                {link.label}<span className="font-mono text-xs text-dim">0{index + 1}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
