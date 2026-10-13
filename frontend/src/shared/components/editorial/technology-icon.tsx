import type { ElementType } from "react";
import {
  Bot,
  Boxes,
  BrainCircuit,
  Cloud,
  Code2,
  Coffee,
  Database,
  GitBranch,
  Globe2,
  Mail,
  Search,
  ShoppingCart,
  TestTube2,
  Truck,
  Webhook,
} from "lucide-react";
import {
  SiAngular,
  SiAstro,
  SiDocker,
  SiExpo,
  SiFastapi,
  SiFastify,
  SiGit,
  SiGithubactions,
  SiGooglecalendar,
  SiGooglegemini,
  SiGooglesearchconsole,
  SiInstagram,
  SiLangchain,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPagseguro,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiSpringboot,
  SiStripe,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVitest,
  SiWhatsapp,
  SiWix,
} from "react-icons/si";
import { cn } from "@/shared/lib/utils";

type IconRule = {
  terms: string[];
  icon: ElementType;
};

const iconRules: IconRule[] = [
  { terms: ["next.js", "nextjs"], icon: SiNextdotjs },
  { terms: ["node.js", "nodejs"], icon: SiNodedotjs },
  { terms: ["typescript"], icon: SiTypescript },
  { terms: ["tailwind"], icon: SiTailwindcss },
  { terms: ["postgresql", "postgres"], icon: SiPostgresql },
  { terms: ["playwright"], icon: TestTube2 },
  { terms: ["google search console"], icon: SiGooglesearchconsole },
  { terms: ["google calendar", "agenda"], icon: SiGooglecalendar },
  { terms: ["wix"], icon: SiWix },
  { terms: ["langchain"], icon: SiLangchain },
  { terms: ["fastapi"], icon: SiFastapi },
  { terms: ["fastify"], icon: SiFastify },
  { terms: ["nestjs"], icon: SiNestjs },
  { terms: ["angular"], icon: SiAngular },
  { terms: ["astro"], icon: SiAstro },
  { terms: ["react native", "react"], icon: SiReact },
  { terms: ["python"], icon: SiPython },
  { terms: ["redis"], icon: SiRedis },
  { terms: ["vitest"], icon: SiVitest },
  { terms: ["vite"], icon: SiVite },
  { terms: ["gemini"], icon: SiGooglegemini },
  { terms: ["whisper", "openai"], icon: SiOpenai },
  { terms: ["mongodb"], icon: SiMongodb },
  { terms: ["spring boot", "spring"], icon: SiSpringboot },
  { terms: ["docker"], icon: SiDocker },
  { terms: ["github actions"], icon: SiGithubactions },
  { terms: ["git"], icon: SiGit },
  { terms: ["expo"], icon: SiExpo },
  { terms: ["whatsapp"], icon: SiWhatsapp },
  { terms: ["instagram"], icon: SiInstagram },
  { terms: ["stripe"], icon: SiStripe },
  { terms: ["pagbank", "pagseguro"], icon: SiPagseguro },
];

function getFallbackIcon(value: string): ElementType {
  if (value.includes("teste") || value.includes("qualidade")) return TestTube2;
  if (value.includes("banco") || value.includes("dados")) return Database;
  if (value.includes("ia") || value.includes("agente")) return BrainCircuit;
  if (value.includes("aws") || value.includes("cloud") || value.includes("hospedagem")) return Cloud;
  if (value.includes("deploy") || value.includes("ci/cd")) return GitBranch;
  if (value.includes("e-mail") || value.includes("email")) return Mail;
  if (value.includes("frete") || value.includes("envio")) return Truck;
  if (value.includes("estoque") || value.includes("b2b")) return Boxes;
  if (value.includes("e-commerce") || value.includes("carrinho")) return ShoppingCart;
  if (value.includes("integra") || value.includes("api")) return Webhook;
  if (value.includes("busca") || value.includes("seo")) return Search;
  if (value.includes("web") || value.includes("fonte externa")) return Globe2;
  if (value.includes("java")) return Coffee;
  if (value.includes("groq")) return Bot;
  return Code2;
}

export function TechnologyIcon({
  name,
  className,
  maxIcons = 1,
}: {
  name: string;
  className?: string;
  maxIcons?: number;
}) {
  const normalizedName = name.toLowerCase();
  const matches = iconRules
    .filter((rule) => rule.terms.some((term) => normalizedName.includes(term)))
    .map((rule) => rule.icon);
  const icons = matches.length > 0 ? [...new Set(matches)].slice(0, maxIcons) : [getFallbackIcon(normalizedName)];

  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1", className)} aria-hidden="true">
      {icons.map((Icon, index) => (
        <Icon key={`${name}-${index}`} className="size-[1em]" />
      ))}
    </span>
  );
}
