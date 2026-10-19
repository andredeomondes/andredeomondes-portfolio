import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Bookmark, Code2 } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublication, getPublicationNeighbors, publishedPublications, series } from "@/content/posts";
import { getExerciseContent } from "@/lib/exercise-content";
import { CarouselViewer } from "@/shared/components/editorial/carousel-viewer";
import { ExerciseWorkbench } from "@/shared/components/editorial/exercise-workbench";
import { JsonLd } from "@/shared/components/seo/json-ld";
import { DocToc, ReadingProgress } from "@/features/posts/doc-chrome";
import { moduleOf } from "@/features/posts/modules";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publishedPublications.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublication(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    keywords: ["JavaScript", "backend", "tutorial", post.title, "exercícios de programação"],
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/posts/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [SITE_NAME],
      tags: ["JavaScript", "Backend", "Engenharia de software"],
      images: [{ url: post.images[0], alt: `Capa: ${post.title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.images[0]],
    },
  };
}

export default async function PublicationPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPublication(slug);
  if (!post) notFound();
  const neighbors = getPublicationNeighbors(post.unit);
  const exerciseContent = await getExerciseContent(post.exercisePath);

  return (
    <article className="page post">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${absoluteUrl(`/posts/${post.slug}`)}#article`,
              mainEntityOfPage: absoluteUrl(`/posts/${post.slug}`),
              headline: post.title,
              description: post.excerpt,
              datePublished: post.publishedAt,
              dateModified: post.publishedAt,
              inLanguage: "pt-BR",
              image: post.images.map(absoluteUrl),
              author: { "@type": "Person", "@id": `${absoluteUrl("/")}#andre-deomondes`, name: SITE_NAME },
              publisher: { "@type": "Person", "@id": `${absoluteUrl("/")}#andre-deomondes`, name: SITE_NAME },
              isPartOf: { "@type": "Blog", "@id": `${absoluteUrl("/posts")}#blog` },
              articleSection: "JavaScript",
              keywords: ["JavaScript", "Backend", "Engenharia de software", post.title],
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Publicações", item: absoluteUrl("/posts") },
                { "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl(`/posts/${post.slug}`) },
              ],
            },
          ],
        }}
      />
      <ReadingProgress />
      <header className="doc-hero rail-cell">
        <nav className="case-hero__crumb" aria-label="Trilha">
          <Link href={`/series/${series.slug}`}>{series.title}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Unidade {String(post.unit).padStart(2, "0")}</span>
        </nav>
        <p className="doc-hero__module">{moduleOf(post.unit).title} · unidade {post.unit} de {series.totalUnits}</p>
        <h1 className="doc-hero__title">{post.title}</h1>
        <p className="doc-hero__statement">{post.statement}</p>
        <p className="doc-hero__meta mono">{post.readTime} de leitura · {post.images.length} cards · {exerciseContent.exercises.length} exercícios</p>
      </header>

      <div className="doc rail-cell">
        <aside className="doc__aside">
          <DocToc
            items={[
              { id: "resumo", label: "Resumo visual", icon: "slides" },
              { id: "leitura", label: "Leitura", icon: "read" },
              { id: "codigo", label: "Código", icon: "code" },
              { id: "o-que-fica", label: "O que fica", icon: "keep" },
              { id: "exercicios", label: "Exercícios", icon: "practice" },
            ]}
          />
        </aside>

        <div className="doc__main">
          <section id="resumo" className="doc__section" aria-label="Resumo visual">
            <CarouselViewer images={post.images} title={post.title} />
          </section>

          <section id="leitura" className="doc__section doc__prose">
            <h2 className="doc__h2"><span className="doc__h2-icon" aria-hidden="true"><BookOpen /></span>Leitura</h2>
            <p className="doc__lede">{post.excerpt}</p>
            <p>
              No backend, esse fundamento aparece quando o código transforma entrada em decisão. O detalhe de linguagem deixa de ser acadêmico no momento em que altera um payload, uma regra de negócio ou a forma como uma falha chega à camada seguinte.
            </p>
            <p>
              A forma mais útil de estudar é ligar a sintaxe a um contrato observável: o que entra, o que pode mudar, qual resultado sai e qual erro deve continuar o fluxo. É esse raciocínio que os exemplos e exercícios desta unidade procuram treinar.
            </p>
          </section>

          <section id="codigo" className="doc__section">
            <h2 className="doc__h2"><span className="doc__h2-icon" aria-hidden="true"><Code2 /></span>Código</h2>
            <div className="window doc__code">
              <div className="window__bar">
                <span className="window__dots"><i /><i /><i /></span>
                <span>exemplo.js</span>
              </div>
              <pre><code>{post.code}</code></pre>
            </div>
          </section>

          <section id="o-que-fica" className="doc__section">
            <h2 className="doc__h2"><span className="doc__h2-icon" aria-hidden="true"><Bookmark /></span>O que fica</h2>
            <ul className="line-list">
              {post.takeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}
            </ul>
          </section>
        </div>
      </div>

      <div id="exercicios" className="doc-exercises rail-cell">
        <h2 className="section-title">
          Prática guiada.
          <span className="muted">Leia, rode, quebre e explique cada exercício.</span>
        </h2>
        <ExerciseWorkbench content={exerciseContent} unit={post.unit} />
      </div>

      <nav className="doc-pager rail-cell" aria-label="Navegação entre publicações">
        {neighbors.previous ? (
          <Link href={`/posts/${neighbors.previous.slug}`} className="doc-pager__link">
            <span>Anterior</span>
            <strong>{neighbors.previous.title}</strong>
          </Link>
        ) : <span />}
        {neighbors.next ? (
          <Link href={`/posts/${neighbors.next.slug}`} className="doc-pager__link doc-pager__link--next">
            <span>Próxima</span>
            <strong>{neighbors.next.title}</strong>
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
