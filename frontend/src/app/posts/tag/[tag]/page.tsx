import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { publishedPublications } from "@/content/posts";
import { PageIntro } from "@/shared/components/editorial/page-intro";
import { PostsExplorer } from "@/features/posts/posts-explorer";
import { SERIES, getTag, tagCounts, tagsOf, toExplorerPost } from "@/features/posts/taxonomy";
import { JsonLd } from "@/shared/components/seo/json-ld";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

type PageProps = { params: Promise<{ tag: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return tagCounts(publishedPublications).map((tag) => ({ tag: tag.slug }));
}

function postsWith(slug: string) {
  return publishedPublications.filter((post) => tagsOf(post).some((tag) => tag.slug === slug));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tag = getTag((await params).tag);
  if (!tag) return {};
  const count = postsWith(tag.slug).length;
  const title = tag.slug === "javascript" ? "Tutoriais de JavaScript" : `${tag.label} em JavaScript: tutoriais e exercícios`;
  const description = `${tag.description} ${count} ${count === 1 ? "publicação" : "publicações"} com exemplos, código e exercícios com testes.`;
  return {
    title,
    description,
    keywords: [tag.label, ...(tag.synonyms ?? []), "JavaScript", "tutorial", "exercícios"],
    alternates: { canonical: `/posts/tag/${tag.slug}` },
    openGraph: { type: "website", url: `/posts/tag/${tag.slug}`, title, description, images: ["/brand/publications-atmosphere.webp"] },
  };
}

export default async function TagPage({ params }: PageProps) {
  const tag = getTag((await params).tag);
  if (!tag) notFound();
  const posts = postsWith(tag.slug);

  return (
    <div className="page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              url: absoluteUrl(`/posts/tag/${tag.slug}`),
              name: `#${tag.label}`,
              description: tag.description,
              inLanguage: "pt-BR",
              isPartOf: { "@type": "Blog", "@id": `${absoluteUrl("/posts")}#blog` },
              author: { "@type": "Person", name: SITE_NAME },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: posts.map((post, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(`/posts/${post.slug}`), name: post.title })),
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Publicações", item: absoluteUrl("/posts") },
                { "@type": "ListItem", position: 3, name: `#${tag.label}`, item: absoluteUrl(`/posts/tag/${tag.slug}`) },
              ],
            },
          ],
        }}
      />
      <PageIntro title={`#${tag.label}`} muted={`${posts.length} ${posts.length === 1 ? "publicação" : "publicações"} com essa tag.`} lead={tag.description}>
        <Link href="/posts" className="btn">
          <ArrowLeft size={16} aria-hidden="true" /> Todas as publicações
        </Link>
      </PageIntro>
      <section className="rail-cell page-section" aria-label={`Publicações com a tag ${tag.label}`}>
        <PostsExplorer posts={publishedPublications.map(toExplorerPost)} series={SERIES} tags={tagCounts(publishedPublications)} initialTag={tag.slug} />
      </section>
    </div>
  );
}
