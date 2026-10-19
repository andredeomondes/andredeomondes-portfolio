import { createElement } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Blocks, Braces, Hourglass, Sparkles, SquareFunction, type LucideIcon } from "lucide-react";
import { publishedPublications, series } from "@/content/posts";
import { PageIntro } from "@/shared/components/editorial/page-intro";
import { HoverPreviewList } from "@/shared/components/editorial/hover-preview-list";
import { COURSE_MODULES } from "@/features/posts/modules";
import { UnitsArt } from "@/shared/components/fx/intro-art";

const MODULE_ICONS: Record<string, LucideIcon> = { blocks: Blocks, function: SquareFunction, braces: Braces, sparkles: Sparkles, timer: Hourglass };

export const metadata: Metadata = {
  title: "Série JavaScript Core",
  description: series.description,
  alternates: { canonical: "/series/javascript-core" },
  openGraph: { url: "/series/javascript-core", title: "JavaScript Core — do fundamento ao backend", description: series.description },
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function JavaScriptCoreSeriesPage() {
  const first = publishedPublications[0];
  const upcoming = Array.from({ length: Math.max(0, series.totalUnits - publishedPublications.length) }, (_, index) => publishedPublications.length + index + 1);

  return (
    <div className="page">
      <PageIntro
        title="JavaScript Core."
        muted="Do fundamento ao backend, uma unidade por vez."
        lead={series.description}
        art={<UnitsArt total={series.totalUnits} published={series.publishedUnits} />}
      >
        <div className="series-progress">
          <p className="mono tabular"><strong>{series.publishedUnits}</strong> de {series.totalUnits} unidades publicadas</p>
          <div className="course__bar" role="progressbar" aria-valuemin={0} aria-valuemax={series.totalUnits} aria-valuenow={series.publishedUnits} aria-label="Progresso da série">
            <span style={{ transform: `scaleX(${series.publishedUnits / series.totalUnits})` }} />
          </div>
          {first ? (
            <Link href={`/posts/${first.slug}`} className="btn btn--primary">
              Começar pela unidade 01 <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </PageIntro>

      {COURSE_MODULES.map((module, moduleIndex) => {
        const units = publishedPublications.filter((post) => post.unit >= module.from && post.unit <= module.to);
        if (units.length === 0) return null;
        return (
          <section key={module.id} className="series-module rail-cell" aria-labelledby={`module-${module.id}`}>
            <div className="series-module__head">
              <span className="bento__icon" aria-hidden="true">{createElement(MODULE_ICONS[module.icon] ?? Blocks)}</span>
              <p className="series-module__index mono">Módulo {pad(moduleIndex + 1)}</p>
              <h2 id={`module-${module.id}`} className="series-module__title">{module.title}</h2>
              <p className="series-module__count mono tabular">{units.length} unidades</p>
            </div>
            <HoverPreviewList
              size="md"
              label={`Unidades de ${module.title}`}
              rows={units.map((post) => ({
                href: `/posts/${post.slug}`,
                index: pad(post.unit),
                title: post.title,
                meta: post.statement,
                image: post.images[0],
              }))}
            />
          </section>
        );
      })}

      {upcoming.length > 0 ? (
        <section className="series-module rail-cell" aria-labelledby="module-next">
          <div className="series-module__head">
            <p className="series-module__index mono">Em produção</p>
            <h2 id="module-next" className="series-module__title">Próximas unidades</h2>
          </div>
          <ol className="series-upcoming">
            {upcoming.map((unit) => (
              <li key={unit} data-testid="unit-upcoming">
                <span className="mono tabular">{pad(unit)}</span> Em breve
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
