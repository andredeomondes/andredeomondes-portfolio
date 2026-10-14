import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { publishedPublications, series } from "@/content/posts";
import { PublicationCard } from "@/shared/components/editorial/publication-card";
import { EditorialAtmosphere } from "@/shared/components/editorial/editorial-atmosphere";
import { JsonLd } from "@/shared/components/seo/json-ld";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tutoriais de JavaScript, backend e engenharia",
  description: "Tutoriais práticos de JavaScript e backend com exemplos, testes, exercícios e resoluções explicadas passo a passo.",
  alternates: { canonical: "/posts" },
  openGraph: {
    type: "website",
    url: "/posts",
    title: "Tutoriais de JavaScript, backend e engenharia",
    description: "Exemplos, testes e exercícios de JavaScript explicados passo a passo.",
    images: ["/brand/publications-atmosphere.webp"],
  },
};

export default function PostsPage() {
  return (
    <div className="min-h-screen pt-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": `${absoluteUrl("/posts")}#blog`,
          url: absoluteUrl("/posts"),
          name: "Publicações de Andre Deomondes",
          description: metadata.description,
          inLanguage: "pt-BR",
          author: { "@type": "Person", name: SITE_NAME, url: absoluteUrl("/") },
          blogPost: publishedPublications.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: absoluteUrl(`/posts/${post.slug}`),
            datePublished: post.publishedAt,
            image: absoluteUrl(post.images[0]),
          })),
        }}
      />
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
          {publishedPublications.slice().reverse().map((post) => (
            <PublicationCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
