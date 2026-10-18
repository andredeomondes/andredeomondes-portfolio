import Image from "next/image";
import Link from "next/link";

const COLUMNS = 16;
const ROWS = 10;

// Deterministic so server and client render the same cover.
const CELLS = Array.from({ length: COLUMNS * ROWS }, (_, cell) => cell);

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
            className={(cell * 37 + index * 11) % 100 < 45 ? "is-on" : undefined}
            style={{ transitionDelay: `${(cell * 53 + index * 17) % 350}ms` }}
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
