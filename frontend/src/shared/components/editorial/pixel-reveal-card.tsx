import Image from "next/image";
import Link from "next/link";

const COLUMNS = 16;
const ROWS = 10;

// Deterministic so server and client render the same cover; an avalanche hash
// avoids the column stripes a linear formula produces on a 16-wide grid.
const CELLS = Array.from({ length: COLUMNS * ROWS }, (_, cell) => cell);

function hash(cell: number, seed: number) {
  let h = Math.imul(cell + 1, 374761393) + Math.imul(seed + 1, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}

export function PixelRevealCard({
  href,
  image,
  title,
  summary,
  index,
  priority,
}: {
  href: string;
  image: string;
  title: string;
  summary: string;
  index: number;
  priority?: boolean;
}) {
  return (
    <Link href={href} className="pixel-card" data-testid="pixel-card">
      <Image src={image} alt="" fill priority={priority} sizes="(max-width: 860px) 100vw, 50vw" className="pixel-card__image" />
      <span className="pixel-card__shade" aria-hidden="true" />
      <span className="pixel-card__cover" aria-hidden="true">
        {CELLS.map((cell) => (
          <i
            key={cell}
            className={hash(cell, index) % 100 < 45 ? "is-on" : undefined}
            style={{ transitionDelay: `${hash(cell, index + 7) % 350}ms` }}
          />
        ))}
      </span>
      <span className="pixel-card__info">
        <span>
          <span className="pixel-card__title">{title}</span>
          <span className="pixel-card__summary">{summary}</span>
        </span>
        <span className="pixel-card__index font-pixel">{String(index).padStart(2, "0")}</span>
      </span>
    </Link>
  );
}
