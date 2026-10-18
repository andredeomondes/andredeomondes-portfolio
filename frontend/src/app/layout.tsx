import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Silkscreen } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/shared/components/layout/navbar";
import { SiteFooter } from "@/shared/components/layout/site-footer";
import { SiteMotion } from "@/shared/components/motion/site-motion";
import { JsonLd } from "@/shared/components/seo/json-ld";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-jetbrains",
});

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
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
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.webp", type: "image/webp", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070707",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body id="top" className={`${jetbrainsMono.variable} ${silkscreen.variable} min-h-full flex flex-col bg-background`}>
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
        <Navbar />
        <SiteMotion />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
