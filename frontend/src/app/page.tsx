import { EditorialHome } from "@/features/home/components/editorial-home";
import { getPublicSettings } from "@/lib/frontend-api";
import { normalizeSiteContent } from "@/lib/site-content";
import { fallbackProjects } from "@/content/projects";

export default async function Home() {
  const settings = await getPublicSettings().catch(() => ({}));
  const site = normalizeSiteContent(settings);

  return <EditorialHome profile={site.profile} projects={fallbackProjects} />;
}
