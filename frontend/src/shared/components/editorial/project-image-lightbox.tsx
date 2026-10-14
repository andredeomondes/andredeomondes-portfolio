"use client";

import Image from "next/image";
import { Maximize2, X, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ProjectScreenshot } from "@/content/projects";

export function ProjectImageLightbox({
  screenshot,
  priority = false,
}: {
  screenshot: ProjectScreenshot;
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <figure data-motion="image" className="group border border-line bg-panel">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
          aria-label={`Ampliar imagem: ${screenshot.alt}`}
        >
          <span
            className="relative block overflow-hidden border-b border-line bg-ink"
            style={{ aspectRatio: `${screenshot.width} / ${screenshot.height}` }}
          >
            <Image
              src={screenshot.src}
              alt={screenshot.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain grayscale transition duration-500 group-hover:scale-[1.018] group-hover:contrast-110 group-focus-within:scale-[1.018] group-focus-within:contrast-110"
              priority={priority}
            />
            <span className="absolute inset-0 border-0 border-signal/0 transition-all duration-300 group-hover:border-[3px] group-hover:border-signal/80 group-focus-within:border-[3px] group-focus-within:border-signal/80" />
            <span className="absolute right-3 top-3 inline-flex items-center gap-2 bg-ink px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-paper opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
              Ampliar <Maximize2 className="size-3" aria-hidden="true" />
            </span>
          </span>
        </button>
        <figcaption className="flex items-start justify-between gap-4 p-4 text-xs leading-6 text-dim">
          <span>{screenshot.caption}</span>
          <ZoomIn className="mt-1 size-3.5 shrink-0 text-signal" aria-hidden="true" />
        </figcaption>
      </figure>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Visualização ampliada: ${screenshot.alt}`}
              className="project-lightbox fixed inset-0 z-[100] grid bg-ink/95 p-3 backdrop-blur-sm sm:p-6"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setOpen(false);
              }}
            >
              <div className="m-auto flex h-full max-h-[calc(100dvh-1.5rem)] w-full max-w-[96rem] flex-col border border-line bg-panel sm:max-h-[calc(100dvh-3rem)]">
                <div className="flex min-h-14 items-center justify-between gap-4 border-b border-line px-4 sm:px-5">
                  <p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                    Visualização ampliada
                  </p>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 items-center gap-2 border-l border-line pl-4 font-mono text-[10px] uppercase tracking-[0.14em] text-paper transition-colors hover:text-signal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                    aria-label="Fechar imagem ampliada"
                  >
                    Fechar <X className="size-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    fill
                    sizes="100vw"
                    className="object-contain p-2 grayscale sm:p-5"
                    priority
                  />
                </div>

                <p className="border-t border-line px-4 py-3 text-xs leading-6 text-dim sm:px-5">
                  {screenshot.caption}
                </p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
