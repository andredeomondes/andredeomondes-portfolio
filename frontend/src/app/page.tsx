import { HeroSection } from "@/features/home/components/hero";
import { FilosofiaSection } from "@/features/home/components/filosofia";
import { ConstruindoSection } from "@/features/home/components/construindo";
import { ContatoSection } from "@/features/home/components/contato";
import { StackSection } from "@/features/home/components/stack";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FilosofiaSection />
      <ConstruindoSection />
      <StackSection />
      <ContatoSection />
    </>
  );
}
