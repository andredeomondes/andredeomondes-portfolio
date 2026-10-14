import { EditorialHome } from "@/features/home/components/editorial-home";
import { normalizeSiteContent } from "@/lib/site-content";
import { fallbackProjects } from "@/content/projects";
import { getCachedPublicSettings } from "@/server/services/settings";

export const revalidate = 300;

export default async function Home() {
  const settings = await getCachedPublicSettings().catch(() => ({}));
  const site = normalizeSiteContent(settings);

  return <EditorialHome profile={site.profile} projects={fallbackProjects} />;
}
