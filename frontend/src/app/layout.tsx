import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/shared/components/layout/navbar";
import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "André Deomondes — Software Engineer",
  description:
    "Construindo produtos com foco em experiência, performance e arquitetura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background" style={{ fontFamily: "'Geist', sans-serif" }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <TooltipProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
