import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { publications, series } from "@/content/posts";
import { PublicationCard } from "@/shared/components/editorial/publication-card";
import { EditorialAtmosphere } from "@/shared/components/editorial/editorial-atmosphere";

export const metadata: Metadata = {
  title: "Publicações",
  description: "Notas visuais sobre backend, JavaScript e engenharia de software.",
};

export default function PostsPage() {
  return (
    <div className="min-h-screen pt-16">
      <header className="index-hero">
        <EditorialAtmosphere src="/brand/publications-atmosphere.webp" variant="publications" priority />
        <div className="site-shell index-hero__content">
          <p className="label">Publicações / índice</p>
          <div className="mt-7 grid gap-10 lg:grid-cols-[1fr_310px] lg:items-end">
            <div>
              <h1 className="editorial-title">Notas de <span>engenharia.</span></h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-paper/70 sm:text-lg">
                O carrossel é o mapa visual. Cada publicação aprofunda a ideia, registra o contexto e aponta para exercícios executáveis.
              </p>
            </div>
            <Link href={`/series/${series.slug}`} className="border border-line bg-panel p-5 transition-colors hover:border-signal">
              <p className="label">Série atual</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-paper">{series.title}</p>
              <p className="mt-5 flex items-center justify-between font-mono text-xs uppercase tracking-[0.12em] text-dim">
                {series.publishedUnits}/{series.totalUnits} unidades <ArrowRight className="size-4 text-signal" />
              </p>
            </Link>
          </div>
        </div>
      </header>

      <section className="index-grid-field index-grid-field--posts">
        <EditorialAtmosphere src="/brand/publications-atmosphere.webp" variant="publications" />
        <div className="site-shell relative py-10 sm:py-16">
          {publications.slice().reverse().map((post, index) => (
            <PublicationCard key={post.slug} post={post} priority={index === 0} />
          ))}
        </div>
      </section>
    </div>
  );
}
