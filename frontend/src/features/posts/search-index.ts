import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Publication } from "@/content/posts";

/** One searchable chunk of a unit, with where it lives on the post page. */
export type Passage = { where: string; anchor: string; text: string };
export type SearchIndex = Record<string, Passage[]>;

const SKIP_SECTIONS = /^(como trabalhar|critérios de aceitação)/i;

function cleanInline(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Splits a markdown file into paragraph/list-item passages labelled by their heading. */
function passagesFromMarkdown(markdown: string, fallback: string, anchor: string): Passage[] {
  const passages: Passage[] = [];
  let section = fallback;
  let buffer: string[] = [];
  let inFence = false;

  const flush = () => {
    const text = cleanInline(buffer.join(" "));
    buffer = [];
    if (text.length > 12 && !SKIP_SECTIONS.test(section)) passages.push({ where: section, anchor, text });
  };

  for (const raw of markdown.replace(/\r/g, "").split("\n")) {
    const line = raw.trimEnd();
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const heading = line.match(/^#{1,4}\s+(.+)$/);
    if (heading) {
      flush();
      // "## Exercícios fundamentais (8)" -> "Exercícios fundamentais"; the H1 is the unit title, keep fallback.
      if (!line.startsWith("# ")) section = cleanInline(heading[1].replace(/\(\d+\)\s*$/, ""));
      continue;
    }
    if (!line.trim()) {
      flush();
      continue;
    }
    if (/^\s*(\d+\.|[-*])\s+/.test(line) && buffer.length) flush();
    buffer.push(line.replace(/^\s*(\d+\.|[-*])\s+/, ""));
  }
  flush();
  return passages;
}

async function readOptional(file: string) {
  try {
    return await readFile(file, "utf8");
  } catch {
    return "";
  }
}

/** Full-text passages for each published unit: lesson text, code, takeaways, exercises and hints. */
export async function buildSearchIndex(posts: Publication[]): Promise<SearchIndex> {
  const entries = await Promise.all(
    posts.map(async (post) => {
      const directory = path.join(process.cwd(), "content", "exercises", post.exercisePath);
      const [readme, hints] = await Promise.all([readOptional(path.join(directory, "README.md")), readOptional(path.join(directory, "hints.md"))]);
      const passages: Passage[] = [
        { where: "Resumo", anchor: "leitura", text: `${post.statement} ${post.excerpt}` },
        { where: "Código", anchor: "codigo", text: post.code.replace(/\s+/g, " ") },
        ...post.takeaways.map((text) => ({ where: "O que fica", anchor: "o-que-fica", text })),
        ...passagesFromMarkdown(readme, "Apresentação", "exercicios"),
        ...passagesFromMarkdown(hints, "Dicas", "exercicios").map((passage) => ({ ...passage, where: `Dicas, ${passage.where.toLowerCase()}` })),
      ];
      return [post.slug, passages] as const;
    }),
  );
  return Object.fromEntries(entries);
}
