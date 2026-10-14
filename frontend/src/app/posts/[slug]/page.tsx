import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { getPublication, getPublicationNeighbors, publishedPublications, series } from "@/content/posts";
import { getExerciseContent } from "@/lib/exercise-content";
import { CarouselViewer } from "@/shared/components/editorial/carousel-viewer";
import { ExerciseWorkbench } from "@/shared/components/editorial/exercise-workbench";
import { JsonLd } from "@/shared/components/seo/json-ld";
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
    <article className="min-h-screen pt-16">
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
      <header className="border-b border-line">
        <div className="site-shell py-16 sm:py-24">
          <Link href={`/series/${series.slug}`} className="label inline-flex items-center gap-2 hover:text-signal">
            <ArrowLeft className="size-3" /> {series.title}
          </Link>
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_330px] lg:items-end">
            <div>
              <p className="label text-signal">Unidade {String(post.unit).padStart(2, "0")} / {series.totalUnits}</p>
              <h1 className="mt-5 max-w-5xl text-[clamp(3.5rem,8vw,7.5rem)] font-semibold leading-[0.86] tracking-[-0.075em] text-paper">{post.title}</h1>
            </div>
            <div className="border-l border-line pl-6">
              <p className="text-lg leading-8 text-paper">{post.statement}</p>
              <p className="label mt-6">{post.readTime} de leitura · 7 cards</p>
            </div>
          </div>
        </div>
      </header>

      <div className="site-shell grid gap-14 py-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-20">
        <div className="min-w-0">
          <section>
            <p className="label">Resumo visual</p>
            <div className="mt-5"><CarouselViewer images={post.images} title={post.title} /></div>
          </section>

          <section className="mt-20 max-w-3xl">
            <p className="label">Leitura</p>
            <p className="mt-5 text-xl leading-9 text-paper sm:text-2xl">{post.excerpt}</p>
            <div className="mt-10 space-y-6 text-base leading-8 text-dim">
              <p>
                No backend, esse fundamento aparece quando o código transforma entrada em decisão. O detalhe de linguagem deixa de ser acadêmico no momento em que altera um payload, uma regra de negócio ou a forma como uma falha chega à camada seguinte.
              </p>
              <p>
                A forma mais útil de estudar é ligar a sintaxe a um contrato observável: o que entra, o que pode mudar, qual resultado sai e qual erro deve continuar o fluxo. É esse raciocínio que os exemplos e exercícios desta unidade procuram treinar.
              </p>
            </div>

            <pre className="mt-10 overflow-x-auto border border-line bg-panel p-6 font-mono text-sm leading-7 text-paper"><code>{post.code}</code></pre>

            <div className="mt-12 border-t border-line pt-8">
              <p className="label">O que fica</p>
              <ul className="mt-5 space-y-4">
                {post.takeaways.map((takeaway, index) => (
                  <li key={takeaway} data-motion="item" className="grid grid-cols-[32px_1fr] gap-3 text-base leading-7 text-paper">
                    <span className="font-mono text-xs text-signal">0{index + 1}</span>{takeaway}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <aside className="h-fit border border-line bg-panel p-6 lg:sticky lg:top-24">
          <p className="label">Prática</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-paper">Leia. Rode. Quebre. Explique.</h2>
          <p className="mt-4 text-sm leading-7 text-dim">A unidade reúne {exerciseContent.exercises.length} exercícios individuais. Cada um tem enunciado, exemplos de entrada e saída, teste executável, dicas e resolução.</p>
          <a href="#exercicios" className="button-primary mt-7 w-full">Abrir exercícios <ArrowDown className="size-4" /></a>
          <div className="mt-8 border-t border-line pt-6 font-mono text-[10px] uppercase leading-6 tracking-[0.12em] text-dim">
            01 / entenda o contrato<br />02 / escreva sua tentativa<br />03 / preveja entrada e saída<br />04 / execute o teste<br />05 / compare a resolução
          </div>
        </aside>
      </div>

      <div id="exercicios" className="site-shell scroll-mt-24 pb-20">
        <ExerciseWorkbench content={exerciseContent} unit={post.unit} />
      </div>

      <nav className="border-t border-line" aria-label="Navegação entre publicações">
        <div className="site-shell grid md:grid-cols-2">
          {neighbors.previous ? (
            <Link href={`/posts/${neighbors.previous.slug}`} className="group border-b border-line py-8 md:border-b-0 md:border-r md:pr-8">
              <p className="label flex items-center gap-2"><ArrowLeft className="size-3" /> Anterior</p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.035em] text-paper group-hover:text-signal">{neighbors.previous.title}</p>
            </Link>
          ) : <div />}
          {neighbors.next ? (
            <Link href={`/posts/${neighbors.next.slug}`} className="group py-8 md:pl-8 md:text-right">
              <p className="label flex items-center justify-end gap-2">Próxima <ArrowRight className="size-3" /></p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.035em] text-paper group-hover:text-signal">{neighbors.next.title}</p>
            </Link>
          ) : <div />}
        </div>
      </nav>
    </article>
  );
}
