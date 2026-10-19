"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { onFirstScroll } from "@/lib/gsap";
import { useActiveLoop } from "@/shared/hooks/use-active-loop";
import { ideScript } from "@/features/home/content/ide-script";
import { cn } from "@/shared/lib/utils";

const METER_BARS = 22;
const MAX_REQUESTS = 4;
const INITIAL_METER = Array.from({ length: METER_BARS }, (_, index) => 20 + ((index * 37) % 70));

type TypingState = "pending" | "typing" | "done";

export function LiveIde() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [typed, setTyped] = useState(ideScript.lines.length);
  const [typing, setTyping] = useState<TypingState>("pending");
  const [requestCursor, setRequestCursor] = useState(0);
  const [meter, setMeter] = useState(INITIAL_METER);

  // Typewriter: SSR ships the full code; with JS and motion allowed it is retyped line by line.
  useEffect(() => {
    if (reduceMotion !== false) {
      if (reduceMotion) {
        const id = window.setTimeout(() => setTyping("done"), 0);
        return () => window.clearTimeout(id);
      }
      return;
    }
    let line = 0;
    let timer = window.setTimeout(function step() {
      setTyping("typing");
      setTyped(line);
      line += 1;
      if (line <= ideScript.lines.length) {
        timer = window.setTimeout(step, 180 + Math.random() * 160);
      } else {
        setTyping("done");
      }
    }, 600);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  // Tilt that straightens over the first 420px of scroll.
  useEffect(() => {
    const node = rootRef.current;
    if (!node || reduceMotion !== false) return;
    let cleanup = () => {};
    const stop = onFirstScroll(({ gsap }) => {
      const tween = gsap.fromTo(
        node,
        { rotateX: 18, scale: 0.94 },
        {
          rotateX: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: 420, scrub: 0.4 },
        },
      );
      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(node, { clearProps: "transform" });
      };
    });
    return () => {
      stop();
      cleanup();
    };
  }, [reduceMotion]);

  const nextRequest = useCallback(() => setRequestCursor((cursor) => cursor + 1), []);
  const nextMeter = useCallback(() => setMeter((bars) => bars.map(() => 15 + Math.random() * 80)), []);
  useActiveLoop(rootRef, nextRequest, 1300);
  useActiveLoop(rootRef, nextMeter, 900);

  const visibleRequests = Array.from({ length: Math.min(MAX_REQUESTS, requestCursor + 1) }, (_, offset) => {
    const index = (requestCursor - offset) % ideScript.requests.length;
    return { key: requestCursor - offset, ...ideScript.requests[index] };
  });

  return (
    <div className="ide-stage">
      <div ref={rootRef} className="live-ide" data-testid="live-ide">
        <div className="live-ide__bar">
          <span className="live-ide__dots" aria-hidden="true"><i /><i /><i /></span>
          {ideScript.tabs.map((tab, index) => (
            <span key={tab} className={cn("live-ide__tab", index === 0 && "is-active")}>{tab}</span>
          ))}
          <span className="live-ide__meta"><span>main ⎇</span><span className="live-ide__live">● deploy ok</span></span>
        </div>

        <div className="live-ide__body">
          <div className="live-ide__tree" aria-hidden="true">
            {ideScript.tree.map((item) => (
              <div key={item} className={cn(item.trim() === ideScript.file && "is-active")}>{item}</div>
            ))}
          </div>

          <pre className="live-ide__code" data-testid="ide-code" data-state={typing}>
            {ideScript.lines.map((tokens, index) => (
              <span key={index} className={cn("live-ide__line", typing !== "pending" && index >= typed && "is-hidden")}>
                <span className="live-ide__ln" aria-hidden="true">{index + 1}</span>
                {tokens.map((token, tokenIndex) => (
                  <span key={tokenIndex} className={`tok-${token.tone}`}>{token.text}</span>
                ))}
                {index === Math.min(typed, ideScript.lines.length) - 1 && typing !== "pending" ? <span className="live-ide__caret" aria-hidden="true" /> : null}
                {"\n"}
              </span>
            ))}
          </pre>

          <div className="live-ide__side" aria-hidden="true">
            <h4>REQUESTS</h4>
            <div className="live-ide__requests">
              {visibleRequests.map((request) => (
                <div key={request.key} className="live-ide__request">
                  <span><span className="live-ide__method">{request.method}</span> {request.path}</span>
                  <span className="live-ide__ok">{request.status}</span>
                </div>
              ))}
            </div>
            <h4>LATÊNCIA P95</h4>
            <div className="live-ide__meter">
              {meter.map((height, index) => (
                <i key={index} style={{ height: `${height}%` }} className={cn(index === METER_BARS - 1 && "is-high")} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
