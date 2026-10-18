"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { ProjectIntakeForm } from "@/features/contact/components/project-intake-form";
import { RodaFinale } from "@/shared/components/layout/roda-finale";

const exploreLinks = [
  { href: "/projects", label: "Projetos" },
  { href: "/posts", label: "Publicações" },
  { href: "/about", label: "Sobre" },
  { href: "/resume", label: "Currículo" },
];

const socialLinks = [
  { href: "https://github.com/andredeomondes", label: "GitHub", icon: FaGithub, external: true },
  { href: "https://linkedin.com/in/andredeomondes", label: "LinkedIn", icon: FaLinkedinIn, external: true },
  { href: "https://instagram.com/andredeomondes.dev", label: "Instagram", icon: FaInstagram, external: true },
  { href: "/#contato", label: "Briefing", icon: MessageCircle, external: false },
];

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="site-footer">
      <RodaFinale />

      <section id="contato" className="site-footer__contact-form site-shell" aria-labelledby="contato-title">
        <div className="site-footer__contact-intro">
          <h2 id="contato-title">Conte o que você quer <span className="font-pixel">construir</span></h2>
          <p>Responda um briefing curto. Eu recebo o contexto completo no e-mail e retorno sem tirar você do site.</p>
        </div>
        <ProjectIntakeForm />
      </section>

      <div className="site-footer__socials site-shell">
        {socialLinks.map((link) => {
          const Icon = link.icon;
          const content = <><span><Icon aria-hidden="true" />{link.label}</span><ArrowRight aria-hidden="true" /></>;
          return link.external ? (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{content}</a>
          ) : (
            <Link key={link.href} href={link.href}>{content}</Link>
          );
        })}
      </div>

      <div className="site-footer__directory site-shell">
        <div className="site-footer__identity">
          <Link href="/" className="site-footer__brand">andredeomondes<span>.dev</span></Link>
          <p>Backend &amp; Applied AI Engineer</p>
          <p>Salvador · Bahia · Brasil</p>
        </div>

        <div className="site-footer__directory-group">
          <nav aria-label="Explorar o site">
            <p>Navegação</p>
            {exploreLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </nav>

          <nav aria-label="Projetos em destaque">
            <p>Projetos</p>
            <Link href="/projects/drop-aki-tcg">Drop Aki TCG</Link>
            <Link href="/projects/amr-mobile">AMR Mobile</Link>
            <Link href="/projects/caji-agent">CajiAgent</Link>
          </nav>

          <nav aria-label="Conteúdo técnico">
            <p>Conteúdo</p>
            <Link href="/series/javascript-core">JavaScript Core</Link>
            <Link href="/posts">Publicações</Link>
            <Link href="/posts/01-javascript-tipos-coercao#exercicios">Exercícios</Link>
          </nav>

          <div className="site-footer__contact-data">
            <p>Contato</p>
            <a href="mailto:andredeomondes.dev@gmail.com">andredeomondes.dev@gmail.com</a>
            <span>Atendimento remoto</span>
            <span>Brasil · projetos globais</span>
            <Link href="/#contato">Enviar briefing <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>
      </div>

      <div className="site-footer__legal site-shell">
        <p>© 2026 Andre Deomondes. Todos os direitos reservados.</p>
        <a href="#top" aria-label="Voltar ao topo">Voltar ao topo ↑</a>
      </div>
    </footer>
  );
}
