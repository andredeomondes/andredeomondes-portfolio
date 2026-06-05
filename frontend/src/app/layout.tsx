import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/app/providers";
import { Navbar } from "@/shared/components/layout/navbar";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "André Deomondes — Software Engineer",
  description:
    "Construindo produtos com foco em experiência, performance e arquitetura.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${geist.className} min-h-full flex flex-col bg-background`}>
        <AppProviders>
            <Navbar />
            <main className="flex-1">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
