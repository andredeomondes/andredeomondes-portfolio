import { publishedPublications } from "@/content/posts";
import { buildSearchIndex } from "@/features/posts/search-index";

// Built once at deploy time; the explorer fetches it the first time someone searches.
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  return Response.json(await buildSearchIndex(publishedPublications), {
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}
