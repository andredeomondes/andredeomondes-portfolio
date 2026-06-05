import { HeroSection } from "@/features/home/components/hero";
import { FilosofiaSection } from "@/features/home/components/filosofia";
import { ConstruindoSection } from "@/features/home/components/construindo";
import { ContatoSection } from "@/features/home/components/contato";
import { StackSection } from "@/features/home/components/stack";
import { getPublicFeaturedProjects, getPublicSettings } from "@/lib/frontend-api";
import { normalizeSiteContent } from "@/lib/site-content";

export default async function Home() {
  const [settings, featuredProjects] = await Promise.all([
    getPublicSettings().catch(() => ({})),
    getPublicFeaturedProjects().catch(() => []),
  ]);
  const site = normalizeSiteContent(settings);

  return (
    <>
      <HeroSection profile={site.profile} featuredProjects={featuredProjects} />
      <FilosofiaSection />
      <ConstruindoSection />
      <StackSection />
      <ContatoSection profile={site.profile} branding={site.branding} />
    </>
  );
}
