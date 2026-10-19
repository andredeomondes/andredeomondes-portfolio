"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSite } from "@/shared/components/shell/site-provider";
import { ContactPanel } from "@/shared/components/shell/contact-launcher";
import { Magnetic } from "@/shared/components/fx/magnetic";
import { LightSweep } from "@/shared/components/layout/light-sweep";

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

export function SiteFooter() {
  const pathname = usePathname();
  const { index, setPaletteOpen } = useSite();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="footer">
      <section className="footer__finale rail-cell" aria-labelledby="finale-title">
        <LightSweep />
        <h2 id="finale-title" className="footer__title">
          Vamos construir algo
          <br />
          <span className="footer__title-muted">que roda em produção.</span>
        </h2>
        <div className="footer__finale-grid">
          <p className="footer__lead">
            Projetos de backend, IA aplicada e produtos completos. Escolha o assunto e a mensagem já sai pronta, sem formulário.
          </p>
          <div id="contato" className="footer__contact">
            <ContactPanel headingId="footer-contact-title" />
          </div>
        </div>
      </section>

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
          <p>Atalho</p>
          <Magnetic>
            <button type="button" className="footer__kbd" onClick={() => setPaletteOpen(true)}>
              Abrir busca <kbd>⌘K</kbd>
            </button>
          </Magnetic>
        </div>
      </div>
      <div className="footer__legal rail-cell">
        <p>© 2026 Andre Deomondes</p>
        <a href="#top">Voltar ao topo</a>
      </div>
    </footer>
  );
}
