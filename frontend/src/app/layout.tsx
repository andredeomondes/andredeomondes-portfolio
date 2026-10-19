import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/shared/components/layout/navbar";
import { SiteFooter } from "@/shared/components/layout/site-footer";
import { SmoothScroll } from "@/shared/components/shell/smooth-scroll";
import { SiteProvider } from "@/shared/components/shell/site-provider";
import { CommandPalette } from "@/shared/components/shell/command-palette";
import { ContactLauncher } from "@/shared/components/shell/contact-launcher";
import { ToastProvider } from "@/shared/components/shell/toast";
import { normalizeSiteContent } from "@/lib/site-content";
import { buildSiteIndex } from "@/lib/site-index";
import { getCachedPublicSettings } from "@/server/services/settings";
import { JsonLd } from "@/shared/components/seo/json-ld";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono-code",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Andre Deomondes — Backend & Applied AI Engineer",
    template: "%s — Andre Deomondes",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Andre Deomondes", url: SITE_URL }],
  creator: "Andre Deomondes",
  publisher: "Andre Deomondes",
  category: "Tecnologia e desenvolvimento de software",
  keywords: [
    "JavaScript",
    "Node.js",
    "backend",
    "engenharia de software",
    "inteligência artificial aplicada",
    "tutoriais de programação",
    "desenvolvimento web",
    "Andre Deomondes",
  ],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: SITE_NAME,
    title: "Andre Deomondes — Backend & Applied AI Engineer",
    description: SITE_DESCRIPTION,
    images: [{ url: "/brand/andre-editorial-v2.webp", width: 1200, height: 1500, alt: "Andre Deomondes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andre Deomondes — Backend & Applied AI Engineer",
    description: SITE_DESCRIPTION,
    images: ["/brand/andre-editorial-v2.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon.webp?v=2", type: "image/webp", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png?v=2",
    shortcut: "/favicon.svg?v=2",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#060708",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getCachedPublicSettings().catch(() => ({}));
  const index = buildSiteIndex(normalizeSiteContent(settings).profile);

  return (
    <html lang="pt-BR" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body id="top" className={`${geist.variable} ${jetbrainsMono.variable} min-h-full flex flex-col bg-background`}>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: SITE_URL,
                name: SITE_NAME,
                alternateName: "andredeomondes.dev",
                inLanguage: "pt-BR",
              },
              {
                "@type": "Person",
                "@id": `${SITE_URL}/#andre-deomondes`,
                name: "Andre Deomondes",
                url: SITE_URL,
                image: `${SITE_URL}/andre-deomondes-profile.webp`,
                jobTitle: "Backend & Applied AI Engineer",
                sameAs: [
                  "https://github.com/andredeomondes",
                  "https://linkedin.com/in/andredeomondes",
                  "https://instagram.com/andredeomondes.dev",
                ],
              },
            ],
          }}
        />
        <SiteProvider index={index}>
          <ToastProvider>
          <div className="rails" aria-hidden="true" />
          <Navbar />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CommandPalette />
          <ContactLauncher />
          <SmoothScroll />
          </ToastProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
