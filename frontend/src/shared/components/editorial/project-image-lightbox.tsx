"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
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
      <figure data-motion="image" className="case-shot group">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full cursor-zoom-in text-left"
          aria-label={`Ampliar imagem: ${screenshot.alt}`}
        >
          <span
            className="case-shot__frame relative block overflow-hidden bg-ink"
            style={{ aspectRatio: `${screenshot.width} / ${screenshot.height}` }}
          >
            <Image
              src={screenshot.src}
              alt={screenshot.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="case-shot__image object-cover object-top"
              fetchPriority={priority ? "high" : undefined}
            />
            <span className="case-shot__zoom">
              ⤢ ampliar <Maximize2 className="size-3" aria-hidden="true" />
            </span>
          </span>
        </button>
        <figcaption className="case-shot__caption">{screenshot.caption}</figcaption>
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
              <div className="m-auto flex h-full max-h-[calc(100dvh-1.5rem)] w-full max-w-[96rem] flex-col overflow-hidden rounded-[14px] border border-line bg-panel sm:max-h-[calc(100dvh-3rem)]">
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
                    className="object-contain p-2 sm:p-5"
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
