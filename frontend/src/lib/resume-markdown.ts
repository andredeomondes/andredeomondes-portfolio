export type ResumeMarkdownBlock =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

function cleanInlineMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .trim();
}

function parseLegacyText(source: string): ResumeMarkdownBlock[] {
  const lines = source.split("\n");
  const blocks: ResumeMarkdownBlock[] = [];
  let currentBullets: string[] = [];

  function flushBullets() {
    if (currentBullets.length > 0) {
      blocks.push({ type: "ul", items: currentBullets });
      currentBullets = [];
    }
  }

  lines.forEach((line, index) => {
    const trimmed = cleanInlineMarkdown(line);

    if (!trimmed) {
      flushBullets();
      return;
    }

    if (index === 0) {
      flushBullets();
      blocks.push({ type: "h1", text: trimmed });
      return;
    }

    if (index === 1) {
      flushBullets();
      blocks.push({ type: "p", text: trimmed });
      return;
    }

    if (/:$/.test(trimmed)) {
      flushBullets();
      blocks.push({ type: "h2", text: trimmed.replace(/:$/, "") });
      return;
    }

    if (/^[-*>•]\s+/.test(trimmed)) {
      currentBullets.push(trimmed.replace(/^[-*>•]\s+/, ""));
      return;
    }

    flushBullets();
    blocks.push({ type: "p", text: trimmed });
  });

  flushBullets();
  return blocks;
}

export function parseResumeMarkdown(source: string): ResumeMarkdownBlock[] {
  if (!source.trim()) return [];

  const hasMarkdownSyntax = /^(#|##|###|- |\* )/m.test(source);
  if (!hasMarkdownSyntax) {
    return parseLegacyText(source);
  }

  const lines = source.split("\n");
  const blocks: ResumeMarkdownBlock[] = [];
  let paragraph: string[] = [];
  let bullets: string[] = [];

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({ type: "p", text: cleanInlineMarkdown(paragraph.join(" ")) });
      paragraph = [];
    }
  }

  function flushBullets() {
    if (bullets.length > 0) {
      blocks.push({ type: "ul", items: bullets.map(cleanInlineMarkdown).filter(Boolean) });
      bullets = [];
    }
  }

  for (const line of lines) {
    const raw = line.trim();

    if (!raw) {
      flushParagraph();
      flushBullets();
      continue;
    }

    if (raw.startsWith("# ")) {
      flushParagraph();
      flushBullets();
      blocks.push({ type: "h1", text: cleanInlineMarkdown(raw.slice(2)) });
      continue;
    }

    if (raw.startsWith("## ")) {
      flushParagraph();
      flushBullets();
      blocks.push({ type: "h2", text: cleanInlineMarkdown(raw.slice(3)) });
      continue;
    }

    if (raw.startsWith("### ")) {
      flushParagraph();
      flushBullets();
      blocks.push({ type: "h3", text: cleanInlineMarkdown(raw.slice(4)) });
      continue;
    }

    if (/^[-*]\s+/.test(raw)) {
      flushParagraph();
      bullets.push(raw.replace(/^[-*]\s+/, ""));
      continue;
    }

    flushBullets();
    paragraph.push(raw);
  }

  flushParagraph();
  flushBullets();
  return blocks;
}

export function blocksToPlainText(blocks: ResumeMarkdownBlock[]) {
  return blocks
    .flatMap((block) => {
      if (block.type === "ul") {
        return block.items.map((item) => `- ${item}`).concat("");
      }

      return [block.text, ""];
    })
    .join("\n")
    .trim();
}
