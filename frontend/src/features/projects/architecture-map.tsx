"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";

type Lane = { label: string; nodes: Array<{ title: string; detail: string }> };

/** Lanes of connected nodes; links draw in and a signal travels down once the map is on screen. */
export function ArchitectureMap({ lanes, slug }: { lanes: Lane[]; slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLive(true);
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("arch window", live && "is-live")} data-testid="architecture-panel">
      <div className="window__bar">
        <span className="window__dots"><i /><i /><i /></span>
        <span>architecture.map</span>
        <span className="arch__status">● {slug} em produção</span>
      </div>
      <div className="arch__lanes" style={{ ["--lanes" as string]: lanes.length }}>
        {lanes.map((lane, laneIndex) => (
          <div key={lane.label} className="arch__lane">
            <h3 className="arch__lane-title">{lane.label}</h3>
            <ol className="arch__nodes">
              {lane.nodes.map((node, nodeIndex) => (
                <li
                  key={node.title}
                  className="arch__node"
                  style={{ transitionDelay: `${laneIndex * 120 + nodeIndex * 140}ms` }}
                >
                  <strong>{node.title}</strong>
                  <span>{node.detail}</span>
                  {nodeIndex < lane.nodes.length - 1 ? (
                    <i className="arch__link" style={{ transitionDelay: `${laneIndex * 120 + nodeIndex * 140 + 160}ms`, animationDelay: `${laneIndex * 0.4 + nodeIndex * 0.25}s` }} aria-hidden="true" />
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
