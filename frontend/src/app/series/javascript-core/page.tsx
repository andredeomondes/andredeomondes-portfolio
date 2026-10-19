import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { publishedPublications, series } from "@/content/posts";

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
  const upcoming = Array.from(
    { length: Math.max(0, series.totalUnits - publishedPublications.length) },
    (_, index) => publishedPublications.length + index + 1,
  );

  return (
    <div className="page-shell">
      <header className="site-shell page-intro series-intro">
        <p className="page-intro__eyebrow"><b aria-hidden="true">●</b> SÉRIE 01 · EM ANDAMENTO</p>
        <h1>JavaScript <span className="font-pixel">Core</span></h1>
        <p>{series.description}</p>
        <div className="series-progress" aria-label={`${series.publishedUnits} de ${series.totalUnits} unidades publicadas`}>
          <span className="font-pixel">{pad(series.publishedUnits)}<small>/{series.totalUnits}</small></span>
          <div className="roda__progress series-progress__bar" aria-hidden="true">
            <i style={{ width: `${(series.publishedUnits / series.totalUnits) * 100}%` }} />
          </div>
        </div>
      </header>

      <section className="site-shell series-list-wrap" aria-label="Unidades da série">
        <ol className="series-list">
          {publishedPublications.map((post) => (
            <li key={post.slug} data-testid="unit-item">
              <Link href={`/posts/${post.slug}`} className="series-row">
                <span className="series-row__num font-pixel">{pad(post.unit)}</span>
                <span className="series-row__text">
                  <strong>{post.title}</strong>
                  <span>{post.statement}</span>
                </span>
                <span className="series-row__status is-live" data-testid="unit-status">Publicada</span>
                <ArrowRight className="series-row__arrow" aria-hidden="true" />
              </Link>
            </li>
          ))}
          {upcoming.map((unit) => (
            <li key={unit} data-testid="unit-item">
              <div className="series-row is-upcoming">
                <span className="series-row__num font-pixel">{pad(unit)}</span>
                <span className="series-row__text"><strong>Próxima unidade</strong></span>
                <span className="series-row__status" data-testid="unit-status">Em breve</span>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
