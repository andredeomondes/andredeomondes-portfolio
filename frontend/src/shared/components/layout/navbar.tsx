"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Mail, Menu, Moon, Sun, X } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Dock, DockIcon } from "@/shared/components/ui/dock";
import { cn } from "@/shared/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/projects", label: "Projetos" },
  { href: "/about", label: "Sobre" },
];

const socialLinks = [
  { href: "https://github.com/andredeomondes", label: "GitHub", icon: FaGithub },
  { href: "https://linkedin.com/in/andredeomondes", label: "LinkedIn", icon: FaLinkedin },
  { href: "https://instagram.com/andredeomondes.dev", label: "Instagram", icon: FaInstagram },
  { href: "mailto:contato@andredeomondes.dev", label: "Email", icon: Mail },
];

export function Navbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const { resolvedTheme, setTheme } = useTheme();
  const isAdminRoute = pathname.startsWith("/admin");

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 96);
  });

  const isDark = resolvedTheme !== "light";

  if (isAdminRoute) {
    return null;
  }

  return (
    <motion.header
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: -28 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.28, ease: "easeInOut" }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-12"
    >
      <nav
        className={cn(
          "mx-auto flex h-14 w-full max-w-7xl items-center justify-between rounded-full border px-3 backdrop-blur-xl transition-colors sm:px-4",
          isDark
            ? "border-white/10 bg-[#090d1f]/72 text-white"
            : "border-black/8 bg-white/72 text-[#0b1020]"
        )}
      >
        <Link href="/" className="flex items-center gap-3 pl-1">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-full border",
              isDark ? "border-white/10 bg-white/6" : "border-black/8 bg-black/[0.03]"
            )}
          >
            <Image
              src="/logo.svg"
              alt="Andre Deomondes"
              width={22}
              height={22}
              className={cn("h-5 w-auto", !isDark && "invert")}
            />
          </div>
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.28em] sm:block">
            Andre Deomondes
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
              isDark
                ? "border-white/10 bg-white/6 text-white/74 hover:bg-white/10 hover:text-white"
                : "border-black/8 bg-black/[0.03] text-black/70 hover:bg-black/[0.06] hover:text-black"
            )}
          >
            <Sun
              className={cn(
                "absolute size-4 transition-all",
                isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
              )}
            />
            <Moon
              className={cn(
                "absolute size-4 transition-all",
                isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
              )}
            />
          </button>

          <Sheet>
            <SheetTrigger
              aria-label="Abrir menu"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
                isDark
                  ? "border-white/10 bg-white/6 text-white/74 hover:bg-white/10 hover:text-white"
                  : "border-black/8 bg-black/[0.03] text-black/70 hover:bg-black/[0.06] hover:text-black"
              )}
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent
              side="right"
              showCloseButton={false}
              className={cn(
                "data-[side=right]:w-full data-[side=right]:sm:max-w-none flex min-h-screen flex-col border-0 px-8 py-8 backdrop-blur-2xl",
                isDark
                  ? "bg-[#050816]/80 text-white"
                  : "bg-[#f6f2ea]/80 text-[#0b1020]"
              )}
            >
              <SheetHeader className="p-0">
                <SheetTitle className="sr-only">Menu principal</SheetTitle>
              </SheetHeader>

              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/logo.svg"
                    alt="Andre Deomondes"
                    width={28}
                    height={28}
                    className={cn("h-7 w-auto", !isDark && "invert")}
                  />
                </Link>
                <SheetClose
                  aria-label="Fechar menu"
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full border",
                    isDark
                      ? "border-white/10 bg-white/6 text-white/74"
                      : "border-black/8 bg-white/56 text-[#0b1020]/72"
                  )}
                >
                  <X className="size-4" />
                </SheetClose>
              </div>

              <div className="mt-auto mb-auto flex flex-col items-center gap-4 text-center">
                {navLinks.map((link) => (
                  <SheetClose key={link.href} nativeButton={false} render={<Link href={link.href} />}>
                    <span className="text-5xl font-semibold leading-none tracking-[-0.08em] sm:text-7xl">
                      {link.label}
                    </span>
                  </SheetClose>
                ))}
              </div>

              <div className="flex justify-center">
                <Dock className={cn("mx-auto mt-0 border px-2", isDark ? "border-white/10 bg-white/[0.04]" : "border-black/8 bg-white/58")}>
                  {socialLinks.map((item) => (
                    <DockIcon key={item.label} className={cn(isDark ? "text-white" : "text-[#0b1020]")}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={item.label}
                        className="flex items-center justify-center"
                      >
                        <item.icon className="size-4" />
                      </a>
                    </DockIcon>
                  ))}
                </Dock>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
