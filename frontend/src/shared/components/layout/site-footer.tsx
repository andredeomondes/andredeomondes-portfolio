"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSite } from "@/shared/components/shell/site-provider";

const columns = [
  {
    title: "Site",
    links: [
      { href: "/projects", label: "Projetos" },
      { href: "/series/javascript-core", label: "Série JavaScript Core" },
      { href: "/posts", label: "Publicações" },
      { href: "/about", label: "Sobre" },
      { href: "/resume", label: "Currículo" },
    ],
  },
  {
    title: "Projetos",
    links: [
      { href: "/projects/drop-aki-tcg", label: "Drop Aki TCG" },
      { href: "/projects/amr-mobile", label: "AMR Mobile" },
      { href: "/projects/caji-agent", label: "CajiAgent" },
    ],
  },
];

/** Quiet global footer. The big contact moment lives only on the home finale. */
export function SiteFooter() {
  const pathname = usePathname();
  const { index, setPaletteOpen } = useSite();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="footer">
      <div className="footer__base rail-cell">
        <div className="footer__brand">
          <span className="nav__mark" aria-hidden="true" />
          <div>
            <strong>{index.contact.name}</strong>
            <p>Backend &amp; Applied AI Engineer · {index.contact.location}</p>
          </div>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="footer__column">
            <p>{column.title}</p>
            {column.links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </nav>
        ))}
        <div className="footer__column">
          <p>Em qualquer página</p>
          <button type="button" className="footer__kbd" onClick={() => setPaletteOpen(true)}>
            Abrir o console <kbd>⌘K</kbd>
          </button>
          <a href={index.contact.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={index.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>
      <div className="footer__legal rail-cell">
        <p>© 2026 Andre Deomondes</p>
        <a href="#top">Voltar ao topo</a>
      </div>
    </footer>
  );
}
