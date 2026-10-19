import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { publishedPublications, series } from "@/content/posts";
import { PublicationCard } from "@/shared/components/editorial/publication-card";
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
    <div className="page-shell">
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
      <header className="site-shell page-intro">
        <p className="page-intro__eyebrow"><b aria-hidden="true">●</b> PUBLICAÇÕES · ÍNDICE</p>
        <h1>Notas de <span className="font-pixel">engenharia</span></h1>
        <p>O carrossel é o mapa visual. Cada publicação aprofunda a ideia, registra o contexto e aponta para exercícios executáveis.</p>
        <Link href={`/series/${series.slug}`} className="posts-series-link">
          <span className="font-pixel">SÉRIE ATUAL</span>
          <strong>{series.title}</strong>
          <span>{series.publishedUnits}/{series.totalUnits} unidades <ArrowRight className="size-4" aria-hidden="true" /></span>
        </Link>
      </header>

      <section className="site-shell posts-list" aria-label="Publicações">
        {publishedPublications.slice().reverse().map((post) => (
          <PublicationCard key={post.slug} post={post} />
        ))}
      </section>
    </div>
  );
}
