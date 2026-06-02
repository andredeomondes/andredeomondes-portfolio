"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/shared/components/ui/sheet";

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const { theme, setTheme } = useTheme();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 80) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: -32 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="mx-auto mt-4 flex h-12 max-w-5xl items-center justify-between rounded-full border border-border bg-card px-6 backdrop-blur-2xl">
        <Sheet>
          <SheetTrigger>
            <button className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Menu className="h-4 w-4" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex w-full flex-col items-center justify-center gap-8 border-l border-border bg-background text-center"
          >
            <SheetClose>
              <button className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </SheetClose>
            <Link
              href="/projects"
              className="text-4xl font-medium text-foreground transition-colors hover:text-[#8B5CF6]"
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="text-4xl font-medium text-foreground transition-colors hover:text-[#8B5CF6]"
            >
              About
            </Link>
            <div className="mt-8 flex flex-col gap-4 text-sm text-muted-foreground">
              <a
                href="https://github.com/andredeomondes"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/andredeomondes"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                LinkedIn
              </a>
              <a
                href="mailto:contato@andredeomondes.dev"
                className="transition-colors hover:text-foreground"
              >
                Email
              </a>
              <a
                href="https://wa.me/5571999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                WhatsApp
              </a>
            </div>
          </SheetContent>
        </Sheet>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
      </nav>
    </motion.header>
  );
}
