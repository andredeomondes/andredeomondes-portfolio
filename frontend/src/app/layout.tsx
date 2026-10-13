import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/app/providers";
import { Navbar } from "@/shared/components/layout/navbar";
import { SiteFooter } from "@/shared/components/layout/site-footer";
import { SiteMotion } from "@/shared/components/motion/site-motion";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://andredeomondes.dev"),
  title: {
    default: "Andre Deomondes — Backend & Applied AI Engineer",
    template: "%s — Andre Deomondes",
  },
  description:
    "Backend, IA aplicada e notas de engenharia por Andre Deomondes.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.webp", type: "image/webp", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} min-h-full flex flex-col bg-background`}>
        <AppProviders>
          <Navbar />
          <SiteMotion />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
