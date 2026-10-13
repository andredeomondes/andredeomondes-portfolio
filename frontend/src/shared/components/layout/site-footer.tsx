"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-line bg-ink">
      <div className="site-shell grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="label">Andre Deomondes · 2026</p>
          <p className="mt-3 max-w-xl text-xl tracking-[-0.03em] text-paper">
            Engenharia backend, IA aplicada e notas de quem prefere entender o sistema antes de abstraí-lo.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-[0.14em] text-dim">
          <a className="hover:text-signal" href="https://github.com/andredeomondes" target="_blank" rel="noreferrer">GitHub</a>
          <a className="hover:text-signal" href="https://linkedin.com/in/andredeomondes" target="_blank" rel="noreferrer">LinkedIn</a>
          <Link className="hover:text-signal" href="mailto:contato@andredeomondes.dev">E-mail</Link>
        </div>
      </div>
    </footer>
  );
}
