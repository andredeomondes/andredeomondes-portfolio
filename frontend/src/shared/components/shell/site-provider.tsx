"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { SiteIndex } from "@/lib/site-index";

type SiteContextValue = {
  index: SiteIndex;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  contactOpen: boolean;
  setContactOpen: (open: boolean) => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ index, children }: { index: SiteIndex; children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpenState] = useState(false);
  const [contactOpen, setContactOpenState] = useState(false);

  // Only one overlay at a time.
  const setPaletteOpen = useCallback((open: boolean) => {
    setPaletteOpenState(open);
    if (open) setContactOpenState(false);
  }, []);
  const setContactOpen = useCallback((open: boolean) => {
    setContactOpenState(open);
    if (open) setPaletteOpenState(false);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpenState((open) => !open);
        setContactOpenState(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({ index, paletteOpen, setPaletteOpen, contactOpen, setContactOpen }),
    [index, paletteOpen, setPaletteOpen, contactOpen, setContactOpen],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSite must be used inside SiteProvider");
  return context;
}
