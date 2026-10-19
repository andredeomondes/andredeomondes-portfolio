import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { publishedPublications, series } from "@/content/posts";
import { PageIntro } from "@/shared/components/editorial/page-intro";
import { PostsExplorer } from "@/features/posts/posts-explorer";
import { SERIES, tagCounts, tagsOf, toExplorerPost } from "@/features/posts/taxonomy";
import { DeckArt } from "@/shared/components/fx/intro-art";
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
  const explorerPosts = publishedPublications.map(toExplorerPost);
  return (
    <div className="page">
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
            keywords: tagsOf(post).map((tag) => tag.label).join(", "),
          })),
        }}
      />
      <PageIntro title="Publicações." muted="Notas de engenharia com carrossel, leitura e exercícios." lead="Cada unidade da série JavaScript Core vira uma publicação com resumo visual, código comentado e prática com testes."
        art={<DeckArt items={[...publishedPublications].sort((a, b) => b.unit - a.unit).map((post) => ({ unit: post.unit, title: post.title }))} />}
      >
        <Link href={`/series/${series.slug}`} className="btn">
          Ver como curso <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </PageIntro>
      <section className="rail-cell page-section" aria-label="Publicações">
        <PostsExplorer posts={explorerPosts} series={SERIES} tags={tagCounts(publishedPublications)} />
      </section>
    </div>
  );
}
