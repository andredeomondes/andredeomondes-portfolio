import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { publications, series } from "@/content/posts";

export const metadata: Metadata = {
  title: "Série JavaScript Core",
  description: series.description,
};

export default function JavaScriptCoreSeriesPage() {
  return (
    <div className="min-h-screen pt-16">
      <header className="border-b border-line">
        <div className="site-shell grid lg:grid-cols-[1fr_360px]">
          <div className="py-20 sm:py-28 lg:border-r lg:border-line lg:pr-14">
            <p className="label">Série 01 · Em andamento</p>
            <h1 className="mt-7 text-[clamp(4rem,10vw,9rem)] font-semibold leading-[0.82] tracking-[-0.08em] text-paper">
              JAVASCRIPT<br /><span className="text-outline">CORE.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-dim">{series.description}</p>
          </div>
          <aside className="flex flex-col justify-end py-14 lg:pl-10">
            <p className="font-mono text-7xl font-semibold tracking-[-0.08em] text-signal">{series.publishedUnits}<span className="text-2xl text-dim">/{series.totalUnits}</span></p>
            <p className="label mt-3">Unidades preparadas</p>
            <div className="mt-8 h-1 bg-line"><div className="h-full bg-signal" style={{ width: `${(series.publishedUnits / series.totalUnits) * 100}%` }} /></div>
          </aside>
        </div>
      </header>

      <section className="site-shell py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="label">Como navegar</p>
            <p className="mt-4 text-sm leading-7 text-dim">
              A ordem cria uma linha de raciocínio, mas cada texto funciona sozinho. Comece pelo assunto que resolve o problema de hoje.
            </p>
          </div>
          <ol className="border-t border-line">
            {publications.map((post) => (
              <li key={post.slug} data-motion="item">
                <Link href={`/posts/${post.slug}`} className="group grid gap-4 border-b border-line py-6 sm:grid-cols-[64px_1fr_auto] sm:items-center">
                  <span className="font-mono text-sm text-signal">{String(post.unit).padStart(2, "0")}</span>
                  <div>
                    <h2 className="text-xl font-semibold tracking-[-0.035em] text-paper sm:text-2xl">{post.title}</h2>
                    <p className="mt-1 text-sm text-dim">{post.statement}</p>
                  </div>
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-dim group-hover:text-signal">
                    <Check className="size-3" /> disponível <ArrowRight className="size-3" />
                  </span>
                </Link>
              </li>
            ))}
            {Array.from({ length: series.totalUnits - publications.length }, (_, index) => publications.length + index + 1).map((unit) => (
              <li key={unit} data-motion="item" className="grid gap-4 border-b border-line py-6 opacity-40 sm:grid-cols-[64px_1fr_auto] sm:items-center">
                <span className="font-mono text-sm text-dim">{String(unit).padStart(2, "0")}</span>
                <span className="text-xl font-semibold tracking-[-0.035em] text-paper">Próxima unidade</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-dim">em produção</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
