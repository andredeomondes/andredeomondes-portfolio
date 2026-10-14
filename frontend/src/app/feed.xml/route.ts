import { publishedPublications, series } from "@/content/posts";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const posts = publishedPublications.slice().reverse();
  const latestDate = posts[0]?.publishedAt ?? "2026-01-01";
  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/posts/${post.slug}`);
      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <description>${escapeXml(post.excerpt)}</description>
          <pubDate>${new Date(`${post.publishedAt}T12:00:00-03:00`).toUTCString()}</pubDate>
          <category>JavaScript</category>
          <category>Backend</category>
          <enclosure url="${absoluteUrl(post.images[0])}" type="image/webp" />
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${escapeXml(`${SITE_NAME} — ${series.title}`)}</title>
        <link>${SITE_URL}</link>
        <description>${escapeXml(SITE_DESCRIPTION)}</description>
        <language>pt-BR</language>
        <lastBuildDate>${new Date(`${latestDate}T12:00:00-03:00`).toUTCString()}</lastBuildDate>
        <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
