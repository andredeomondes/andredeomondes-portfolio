import Link from "next/link";
import type { ProfileSettings } from "@/lib/site-content";
import { LiveIde } from "@/features/home/components/live-ide";

function Word({ children, delay, className }: { children: string; delay: number; className?: string }) {
  return (
    <span className="hero-word">
      <span className={className} style={{ animationDelay: `${delay}ms` }}>{children}</span>
    </span>
  );
}

export function HomeHero({ profile }: { profile: ProfileSettings }) {
  return (
    <section className="home-stage hero" data-home-section>
      <div className="site-shell hero__content">
        <p className="hero__eyebrow">
          <b aria-hidden="true">●</b> BACKEND &amp; APPLIED AI ENGINEER · {profile.location.toUpperCase()}
        </p>
        <h1 className="hero__title">
          <Word delay={0}>Sistemas</Word> <Word delay={80}>que</Word>{" "}
          <br />
          <Word delay={160} className="font-pixel hero__accent">rodam</Word> <Word delay={240}>em</Word>{" "}
          <Word delay={320} className="font-pixel">produção</Word>
        </h1>
        <p className="hero__lead">
          Construo produtos reais, da API à interface, e documento o raciocínio de engenharia por trás de cada decisão.
        </p>
        <div className="hero__actions">
          <Link href="/projects" className="hero__button hero__button--primary">Ver projetos →</Link>
          <Link href="/series/javascript-core" className="hero__button">Série JS Core</Link>
        </div>
      </div>
      <LiveIde />
    </section>
  );
}
