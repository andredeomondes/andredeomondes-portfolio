import { createElement } from "react";
import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa";
import {
  SiAngular,
  SiAstro,
  SiDocker,
  SiExpo,
  SiFastapi,
  SiFastify,
  SiGit,
  SiGithubactions,
  SiGooglegemini,
  SiGooglesearchconsole,
  SiJavascript,
  SiLangchain,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiOpenjdk,
  SiPagseguro,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiSpring,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVitest,
  SiWix,
} from "react-icons/si";
import { AudioLines, Boxes, Cpu, FlaskConical, Server, Truck, type LucideIcon } from "lucide-react";

// Ordered matchers: first hit wins, so specific names come before generic ones.
const MATCHERS: Array<[RegExp, IconType | LucideIcon]> = [
  [/next/i, SiNextdotjs],
  [/node|express/i, SiNodedotjs],
  [/typescript|\bts\b/i, SiTypescript],
  [/javascript|\bjs\b/i, SiJavascript],
  [/fastapi/i, SiFastapi],
  [/fastify/i, SiFastify],
  [/python/i, SiPython],
  [/postgres/i, SiPostgresql],
  [/redis/i, SiRedis],
  [/docker/i, SiDocker],
  [/langchain/i, SiLangchain],
  [/react/i, SiReact],
  [/astro/i, SiAstro],
  [/angular/i, SiAngular],
  [/nest/i, SiNestjs],
  [/vitest/i, SiVitest],
  [/vite/i, SiVite],
  [/tailwind/i, SiTailwindcss],
  [/wix/i, SiWix],
  [/mongo/i, SiMongodb],
  [/spring/i, SiSpring],
  [/\bjava\b/i, SiOpenjdk],
  [/ci\/cd|github actions/i, SiGithubactions],
  [/\bgit\b/i, SiGit],
  [/search console/i, SiGooglesearchconsole],
  [/whisper/i, AudioLines],
  [/groq/i, Cpu],
  [/\bvps\b|server|servidor/i, Server],
  [/expo/i, SiExpo],
  [/supabase/i, SiSupabase],
  [/gemini/i, SiGooglegemini],
  [/openai|gpt/i, SiOpenai],
  [/pagbank|pagseguro/i, SiPagseguro],
  [/aws|amazon/i, FaAws],
  [/playwright|e2e|test/i, FlaskConical],
  [/envio|frete/i, Truck],
];

export function techIconFor(name: string): IconType | LucideIcon {
  return MATCHERS.find(([pattern]) => pattern.test(name))?.[1] ?? Boxes;
}

export function TechIcon({ name, className }: { name: string; className?: string }) {
  return createElement(techIconFor(name), { className, "aria-hidden": true });
}

/** Chip with the technology's brand icon. */
export function TechChip({ name }: { name: string }) {
  return (
    <li className="tech-chip">
      <TechIcon name={name} className="tech-chip__icon" />
      {name}
    </li>
  );
}
