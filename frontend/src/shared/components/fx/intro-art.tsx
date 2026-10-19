"use client";

import { createElement, type CSSProperties } from "react";
import { Bot, Globe, ServerCog, Sparkles, type LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { SiPostgresql, SiRedis } from "react-icons/si";
import { useLoopActive } from "@/shared/hooks/use-loop-active";
import { cn } from "@/shared/lib/utils";

/* Decorative loops for the inner-page intros. All aria-hidden; CSS pauses them offscreen. */

const SYSTEM_NODES: ReadonlyArray<{ id: string; x: number; y: number; label: string; icon: LucideIcon | IconType }> = [
  { id: "web", x: 10, y: 70, label: "web", icon: Globe },
  { id: "api", x: 170, y: 70, label: "api", icon: ServerCog },
  { id: "db", x: 320, y: 20, label: "postgres", icon: SiPostgresql },
  { id: "cache", x: 320, y: 120, label: "redis", icon: SiRedis },
  { id: "agent", x: 170, y: 210, label: "agente", icon: Bot },
  { id: "llm", x: 320, y: 230, label: "llm", icon: Sparkles },
];

const SYSTEM_LINKS = [
  "M106 90 H170",
  "M266 90 C293 90 293 40 320 40",
  "M266 90 C293 90 293 140 320 140",
  "M218 110 V210",
  "M266 230 C293 230 293 250 320 250",
];

/** Projects: a small system map with requests travelling between services. */
export function SystemArt() {
  const ref = useLoopActive<HTMLDivElement>();
  return (
    <div ref={ref} className="intro-art intro-art--system" aria-hidden="true">
      <svg viewBox="0 0 420 280">
        {SYSTEM_LINKS.map((d) => <path key={d} d={d} className="system__link" />)}
        {SYSTEM_LINKS.map((d, index) => (
          <path key={`p-${d}`} d={d} pathLength={1} className="system__pulse" style={{ animationDelay: `${index * 0.55}s` }} />
        ))}
        {SYSTEM_NODES.map((node) => (
          <g key={node.id} transform={`translate(${node.x} ${node.y})`} className={cn("system__node", `system__node--${node.id}`)}>
            <rect width="96" height="40" rx="10" />
            <foreignObject width="96" height="40">
              <div className="system__label">
                {createElement(node.icon, { className: "system__icon", "aria-hidden": true })}
                <span>{node.label}</span>
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Publications: a deck of unit cards that keeps cycling. */
export function DeckArt({ items }: { items: Array<{ unit: number; title: string }> }) {
  const ref = useLoopActive<HTMLDivElement>();
  return (
    <div ref={ref} className="intro-art intro-art--deck" aria-hidden="true">
      {items.slice(0, 3).map((item, index) => (
        <div key={item.unit} className="deck__card" style={{ animationDelay: `${index * -3}s` }}>
          <span className="deck__bar"><i /><i /><i /></span>
          <span className="deck__unit mono">unidade {String(item.unit).padStart(2, "0")}</span>
          <span className="deck__title">{item.title}</span>
          <span className="deck__lines"><i /><i /><i /></span>
        </div>
      ))}
    </div>
  );
}

/** Series: one cell per unit; published ones lit, a wave runs through them, the next one pulses. */
export function UnitsArt({ total, published }: { total: number; published: number }) {
  const ref = useLoopActive<HTMLDivElement>();
  return (
    <div ref={ref} className="intro-art intro-art--units" aria-hidden="true">
      <ol className="units">
        {Array.from({ length: total }, (_, index) => (
          <li
            key={index}
            className={cn(index < published ? "is-published" : "is-upcoming", index === published && "is-next")}
            style={{ "--i": index } as CSSProperties}
          >
            <span className="mono">{String(index + 1).padStart(2, "0")}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Resume: a single-column sheet writing itself while a reader line scans it. */
export function SheetArt() {
  const ref = useLoopActive<HTMLDivElement>();
  const widths = [62, 88, 74, 0, 48, 92, 80, 66, 0, 52, 86, 70];
  return (
    <div ref={ref} className="intro-art intro-art--sheet" aria-hidden="true">
      <div className="sheet">
        <span className="sheet__head" />
        {widths.map((width, index) =>
          width === 0 ? (
            <span key={index} className="sheet__gap" />
          ) : (
            <span key={index} className="sheet__line" style={{ width: `${width}%`, animationDelay: `${index * 0.18}s` }} />
          ),
        )}
        <span className="sheet__scan" />
      </div>
    </div>
  );
}
