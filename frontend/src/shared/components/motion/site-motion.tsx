"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const PUBLIC_ROUTE_PREFIXES = ["/", "/about", "/projects", "/posts", "/series"];
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    finished: Promise<void>;
  };
};

function isPublicPortfolioRoute(pathname: string) {
  return PUBLIC_ROUTE_PREFIXES.some((prefix) =>
    prefix === "/" ? pathname === "/" : pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function createWipe(target: HTMLElement, className: string) {
  const wipe = document.createElement("span");
  wipe.className = className;
  wipe.setAttribute("aria-hidden", "true");
  target.classList.add("motion-wipe-host");
  target.appendChild(wipe);
  return wipe;
}

export function SiteMotion() {
  const pathname = usePathname();
  const router = useRouter();
  const scanlineRef = useRef<HTMLDivElement>(null);
  const pendingNavigationRef = useRef<(() => void) | null>(null);
  const navigationTimeoutRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    pendingNavigationRef.current?.();
    pendingNavigationRef.current = null;
    if (navigationTimeoutRef.current !== null) {
      window.clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    function handleInternalNavigation(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        !isPublicPortfolioRoute(window.location.pathname) ||
        !isPublicPortfolioRoute(destination.pathname) ||
        destination.href === window.location.href ||
        (destination.pathname === window.location.pathname && destination.hash)
      ) {
        return;
      }

      const transitionDocument = document as ViewTransitionDocument;
      if (!transitionDocument.startViewTransition || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

      event.preventDefault();
      const href = `${destination.pathname}${destination.search}${destination.hash}`;

      transitionDocument.startViewTransition(() =>
        new Promise<void>((resolve) => {
          pendingNavigationRef.current = resolve;
          navigationTimeoutRef.current = window.setTimeout(resolve, 1200);
          router.push(href);
        }),
      );
    }

    document.addEventListener("click", handleInternalNavigation, true);
    return () => {
      document.removeEventListener("click", handleInternalNavigation, true);
      if (navigationTimeoutRef.current !== null) {
        window.clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [router]);

  useEffect(() => {
    if (!isPublicPortfolioRoute(pathname) || pathname === "/") return;

    const root = document.querySelector<HTMLElement>("main");
    const scanline = scanlineRef.current;
    if (!root || !scanline) return;
    const motionRoot = root;
    const routeScanline = scanline;

    const technicalGrids = Array.from(motionRoot.querySelectorAll<HTMLElement>(".technical-grid"));
    const loopTargets = Array.from(
      motionRoot.querySelectorAll<HTMLElement>(
        ".technical-grid, .signal-square, .text-outline, .hero-signal-loop, [data-motion='lane']",
      ),
    );
    const motionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.toggleAttribute("data-motion-active", entry.isIntersecting);
        });
      },
      { rootMargin: "12% 0px" },
    );
    const updatePageVisibility = () => {
      loopTargets.forEach((target) => {
        target.toggleAttribute("data-page-visible", !document.hidden);
      });
    };
    loopTargets.forEach((target) => motionObserver.observe(target));
    updatePageVisibility();
    document.addEventListener("visibilitychange", updatePageVisibility);

    let disposed = false;
    let cleanupMotion: () => void = () => {};
    let started = false;

    const removeStartListeners = () => {
      window.removeEventListener("pointerdown", startMotion);
      window.removeEventListener("scroll", startMotionFromScroll);
      window.removeEventListener("keydown", startMotion);
    };

    async function initializeMotion() {
      const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger, SplitText);

      const media = gsap.matchMedia();
      media.add(
      {
        motionOK: "(prefers-reduced-motion: no-preference)",
        motionReduce: REDUCED_MOTION_QUERY,
      },
      (mediaContext) => {
        const motionOK = Boolean(mediaContext.conditions?.motionOK);
        const intro = motionRoot.querySelector<HTMLElement>("header .site-shell, section:first-child .site-shell");
        const introGrid = motionRoot.querySelector<HTMLElement>("header .technical-grid, section:first-child .technical-grid");
        const introHeadline = intro?.querySelector<HTMLElement>("h1") ?? null;
        const splitHeadlines: Array<{ revert: () => void }> = [];
        const generatedElements: HTMLElement[] = [];

        if (!motionOK) {
          const softTargets = intro
            ? Array.from(intro.querySelectorAll<HTMLElement>("h1, p, a, aside, [data-motion='image']"))
            : [];
          gsap.from(softTargets, {
            autoAlpha: 0,
            duration: 0.15,
            stagger: 0.01,
            ease: "power1.out",
            clearProps: "opacity,visibility",
          });

          ScrollTrigger.batch(
            gsap.utils.toArray<HTMLElement>("[data-motion='item'], [data-motion='card']", motionRoot),
            {
              start: "top 94%",
              once: true,
              onEnter: (batch) => {
                gsap.from(batch, {
                  autoAlpha: 0,
                  duration: 0.15,
                  stagger: 0.01,
                  clearProps: "opacity,visibility",
                });
              },
            },
          );

          return;
        }

        technicalGrids.forEach((grid) => {
          gsap.fromTo(
            grid,
            { yPercent: -2.5, scale: 1.055 },
            {
              yPercent: 2.5,
              scale: 1.055,
              ease: "none",
              scrollTrigger: {
                trigger: grid.parentElement ?? grid,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        });

        const routeTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        routeTimeline
          .set(routeScanline, { autoAlpha: 1, scaleX: 0, transformOrigin: "left center", willChange: "transform" })
          .to(routeScanline, { scaleX: 1, duration: 0.34, ease: "power2.inOut" })
          .set(routeScanline, { transformOrigin: "right center" })
          .to(routeScanline, { scaleX: 0, duration: 0.24, ease: "power2.in" })
          .set(routeScanline, { autoAlpha: 0, clearProps: "transform,willChange" });

        if (introGrid) {
          routeTimeline.from(introGrid, { autoAlpha: 0, duration: 0.48 }, 0.08);
        }

        if (introHeadline) {
          const split = SplitText.create(introHeadline, { type: "lines", mask: "lines" });
          splitHeadlines.push(split);
          routeTimeline.from(
            split.lines,
            {
              yPercent: 112,
              duration: 0.72,
              stagger: 0.075,
              ease: "power4.out",
              clearProps: "transform",
            },
            0.12,
          );
        }

        if (intro) {
          const introSupport = Array.from(
            intro.querySelectorAll<HTMLElement>(
              ".label, h1 ~ p, .button-primary, .button-secondary, aside, [data-motion='image']",
            ),
          ).filter((element) => !introHeadline?.contains(element));

          routeTimeline.from(
            introSupport,
            {
              autoAlpha: 0,
              x: -12,
              duration: 0.44,
              stagger: 0.045,
              clearProps: "opacity,visibility,transform",
            },
            0.24,
          );
        }

        const topLevelSections = Array.from(motionRoot.querySelectorAll<HTMLElement>("section")).filter(
          (section) => !section.parentElement?.closest("section"),
        );

        topLevelSections.forEach((section) => {
          if (intro?.closest("section") === section) return;

          const sectionScan = createWipe(section, "motion-section-scan");
          generatedElements.push(sectionScan);
          gsap.fromTo(
            sectionScan,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 94%",
                end: "top 42%",
                scrub: 0.45,
              },
            },
          );

          const heading = section.querySelector<HTMLElement>(".section-heading");
          const headingTitle = heading?.querySelector<HTMLElement>("h2") ?? null;

          if (heading && headingTitle) {
            const split = SplitText.create(headingTitle, { type: "lines", mask: "lines" });
            splitHeadlines.push(split);
            const rule = createWipe(heading, "motion-section-rule");
            generatedElements.push(rule);
            const supportingCopy = Array.from(heading.children).filter(
              (child): child is HTMLElement => child instanceof HTMLElement && !child.contains(headingTitle),
            );
            const timeline = gsap.timeline({
              scrollTrigger: { trigger: heading, start: "top 86%", once: true },
            });

            timeline
              .fromTo(rule, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.38, ease: "power2.inOut" })
              .from(split.lines, { yPercent: 110, duration: 0.58, stagger: 0.06, ease: "power4.out" }, "-=0.18")
              .from(supportingCopy, { autoAlpha: 0, x: 10, duration: 0.36, stagger: 0.04, ease: "power2.out" }, "-=0.3")
              .to(rule, { scaleX: 0, transformOrigin: "right center", duration: 0.28, ease: "power2.in" }, "-=0.08");
            return;
          }

          const fallbackTarget = section.querySelector<HTMLElement>(":scope > .site-shell");
          if (!fallbackTarget) return;
          gsap.from(fallbackTarget, {
            autoAlpha: 0,
            y: 16,
            duration: 0.48,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: { trigger: section, start: "top 88%", once: true },
          });
        });

        const revealItems = gsap.utils.toArray<HTMLElement>(
          "[data-motion='item'], [data-motion='card']",
          motionRoot,
        );

        gsap.utils.toArray<HTMLElement>("[data-motion='card']", motionRoot).forEach((card) => {
          const scan = createWipe(card, "motion-card-scan");
          generatedElements.push(scan);
          gsap.fromTo(
            scan,
            { xPercent: -125, autoAlpha: 0 },
            {
              xPercent: 125,
              autoAlpha: 1,
              duration: 0.72,
              ease: "power2.inOut",
              scrollTrigger: { trigger: card, start: "top 90%", once: true },
              onComplete: () => gsap.set(scan, { autoAlpha: 0 }),
            },
          );
        });

        ScrollTrigger.batch(revealItems, {
          start: "top 91%",
          once: true,
          onEnter: (batch) => {
            gsap.from(batch, {
              autoAlpha: 0,
              y: 14,
              duration: 0.46,
              stagger: 0.045,
              ease: "power3.out",
              clearProps: "opacity,visibility,transform",
            });
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-motion='image']", motionRoot).forEach((image) => {
          const wipe = createWipe(image, "motion-image-wipe");
          generatedElements.push(wipe);
          const mediaElement = image.querySelector<HTMLElement>("img, video");
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: image, start: "top 89%", once: true },
          });
          timeline
            .to(wipe, { scaleY: 0, transformOrigin: "bottom center", duration: 0.64, ease: "power3.inOut" })
            .from(mediaElement, { scale: 1.025, duration: 0.72, ease: "power3.out", clearProps: "transform" }, "<")
            .set(wipe, { autoAlpha: 0 });
        });

        gsap.utils.toArray<HTMLElement>("[data-motion='lane']", motionRoot).forEach((lane, laneIndex) => {
          const nodes = lane.querySelectorAll<HTMLElement>("[data-motion='node']");
          const links = lane.querySelectorAll<HTMLElement>("[data-motion='link']");
          const wipe = createWipe(lane, "motion-lane-wipe");
          generatedElements.push(wipe);
          const strokeShapes = Array.from(
            lane.querySelectorAll<SVGGeometryElement>("svg path, svg line, svg polyline, svg circle, svg rect"),
          ).filter((shape) => getComputedStyle(shape).stroke !== "none");

          strokeShapes.forEach((shape) => {
            const length = shape.getTotalLength();
            gsap.set(shape, { strokeDasharray: length, strokeDashoffset: length });
          });

          const timeline = gsap.timeline({
            scrollTrigger: { trigger: lane, start: "top 87%", once: true },
          });
          timeline
            .to(wipe, { scaleX: 0, transformOrigin: "right center", duration: 0.52, delay: laneIndex * 0.07, ease: "power3.inOut" })
            .from(nodes, { autoAlpha: 0, x: -10, duration: 0.34, stagger: 0.055, ease: "power2.out" }, "-=0.2")
            .from(links, { autoAlpha: 0, scale: 0.75, duration: 0.18, stagger: 0.045, ease: "power2.out" }, "-=0.18")
            .to(strokeShapes, { strokeDashoffset: 0, duration: 0.34, stagger: 0.018, ease: "power1.out" }, "-=0.26")
            .set([nodes, links, strokeShapes], { clearProps: "opacity,visibility,transform,strokeDasharray,strokeDashoffset" })
            .set(wipe, { autoAlpha: 0 });
        });

        const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => {
          cancelAnimationFrame(refreshFrame);
          splitHeadlines.forEach((split) => split.revert());
          generatedElements.forEach((element) => element.remove());
        };
      },
      motionRoot,
    );

      cleanupMotion = () => media.revert();
    }

    function startMotion() {
      if (started) return;
      started = true;
      removeStartListeners();
      void initializeMotion();
    }

    function startMotionFromScroll() {
      if (Math.abs(window.scrollY) < 24) return;
      startMotion();
    }

    window.addEventListener("pointerdown", startMotion, { once: true, passive: true });
    window.addEventListener("scroll", startMotionFromScroll, { passive: true });
    window.addEventListener("keydown", startMotion, { once: true });

    return () => {
      disposed = true;
      motionObserver.disconnect();
      document.removeEventListener("visibilitychange", updatePageVisibility);
      removeStartListeners();
      cleanupMotion();
    };
  }, [pathname]);

  return <div ref={scanlineRef} className="route-scanline" aria-hidden="true" />;
}
