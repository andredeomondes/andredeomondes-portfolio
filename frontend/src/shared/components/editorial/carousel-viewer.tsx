"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";

export function CarouselViewer({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const imageStageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const image = imageStageRef.current?.querySelector("img");
    if (!image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        image,
        { autoAlpha: 0, xPercent: 2, scale: 1.012 },
        {
          autoAlpha: 1,
          xPercent: 0,
          scale: 1,
          duration: 0.38,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
        },
      );
    }, imageStageRef);

    return () => context.revert();
  }, [activeIndex]);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  }, [images.length]);

  return (
    <div
      className="border border-line bg-panel"
      tabIndex={0}
      role="region"
      aria-roledescription="carrossel"
      aria-label={`Carrossel: ${title}`}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") showPrevious();
        if (event.key === "ArrowRight") showNext();
      }}
      onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
      onTouchEnd={(event) => {
        if (touchStart === null) return;
        const distance = touchStart - (event.changedTouches[0]?.clientX ?? touchStart);
        if (Math.abs(distance) > 45) {
          if (distance > 0) showNext();
          else showPrevious();
        }
        setTouchStart(null);
      }}
    >
      <div ref={imageStageRef} className="relative mx-auto aspect-[4/5] w-full max-w-[760px] overflow-hidden border-x border-line bg-ink">
        <Image
          key={images[activeIndex]}
          src={images[activeIndex]}
          alt={`Card ${activeIndex + 1} de ${images.length}: ${title}`}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 760px"
          className="object-contain"
        />

        <button type="button" onClick={showPrevious} className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center border border-paper/30 bg-ink/88 text-paper backdrop-blur transition-colors hover:border-signal hover:text-signal" aria-label="Ver card anterior">
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={showNext} className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center border border-paper/30 bg-ink/88 text-paper backdrop-blur transition-colors hover:border-signal hover:text-signal" aria-label="Ver próximo card">
          <ChevronRight className="size-5" />
        </button>

        <span className="absolute right-3 top-3 border border-paper/20 bg-ink/88 px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-paper backdrop-blur" aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-4 sm:px-6">
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-dim sm:block">Use as setas ou deslize</p>
        <div className="flex flex-1 justify-center gap-2 sm:justify-end">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ir para o card ${index + 1}`}
              aria-current={activeIndex === index ? "true" : undefined}
              className={`h-8 min-w-8 border px-2 font-mono text-[10px] transition-colors ${activeIndex === index ? "border-signal bg-signal text-ink" : "border-line text-dim hover:border-paper/40 hover:text-paper"}`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
