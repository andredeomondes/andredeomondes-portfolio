import { cache } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";

export type ExerciseHint = {
  level: string;
  content: string;
};

export type ExerciseItem = {
  number: number;
  category: string;
  title: string;
  identifier: string;
  statement: string;
  starter: string;
  solution: string;
  checks: string[];
  examples: ExerciseExample[];
  testCode: string;
  testCommand: string;
  hints: ExerciseHint[];
};

export type ExerciseExample = {
  input: string;
  output: string;
  kind: "return" | "error";
};

export type ExerciseContent = {
  title: string;
  introduction: string;
  exercises: ExerciseItem[];
};

const UNIT_PATH = /^unit-\d{2}-[a-z0-9-]+$/;
const EXERCISE_SECTIONS = [
  { heading: "Exercícios fundamentais", label: "Fundamental" },
  { heading: "Exercícios intermediários", label: "Intermediário" },
  { heading: "Debugging", label: "Debugging" },
  { heading: "Refatoração", label: "Refatoração" },
  { heading: "Desafio integrador", label: "Desafio" },
] as const;

type ExportBlock = { name: string; code: string };
type TestBlock = { title: string; code: string };

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanMarkdownBlock(value: string) {
  const lines = value.replace(/\r/g, "").trim().split("\n");
  const nonEmpty = lines.filter((line) => line.trim());
  const indentation = nonEmpty.length
    ? Math.min(...nonEmpty.map((line) => line.match(/^\s*/)?.[0].length ?? 0))
    : 0;

  return lines.map((line) => line.slice(indentation)).join("\n").trim();
}

function extractSection(markdown: string, heading: string) {
  const headingMatch = new RegExp(`^## ${escapeRegExp(heading)}[^\\n]*$`, "m").exec(markdown);
  if (!headingMatch || headingMatch.index === undefined) return "";

  const start = headingMatch.index + headingMatch[0].length;
  const nextHeading = markdown.slice(start).search(/^## /m);
  const end = nextHeading === -1 ? markdown.length : start + nextHeading;
  return markdown.slice(start, end).trim();
}

function parseExportBlocks(source: string): ExportBlock[] {
  const matches = Array.from(
    source.matchAll(/^export\s+(?:async\s+)?(?:function\s*\*?|class|const|let|var)\s+([A-Za-z_$][\w$]*)/gm),
  );

  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = matches[index + 1]?.index ?? source.length;
    const raw = source.slice(start, end);
    const code = raw
      .replace(/\n\/\/ ---[^\n]*[-]+\s*$/, "")
      .replace(/\n\/\/ test:[^\n]*\s*$/, "")
      .replace(/\n\/\*[\s\S]*$/, "")
      .trim();
    return { name: match[1], code };
  });
}

function createStarter(code: string, identifier: string) {
  const name = escapeRegExp(identifier);
  const declaration = code.match(
    new RegExp(`^export\\s+(?:async\\s+)?(?:function\\s*\\*?|class)\\s+${name}[^\\{]*\\{`),
  );

  if (declaration) {
    return `${declaration[0].replace(/^export\s+/, "")}\n  // Escreva sua solução aqui.\n}`;
  }

  const arrow = code.match(
    new RegExp(`^export\\s+const\\s+${name}[^=]*=\\s*[^\\{]*=>\\s*\\{`),
  );

  if (arrow) {
    return `${arrow[0].replace(/^export\s+/, "")}\n  // Escreva sua solução aqui.\n};`;
  }

  return `function ${identifier}() {\n  // Escreva sua solução aqui.\n}`;
}

function parseTestBlocks(source: string): TestBlock[] {
  const matches = Array.from(source.matchAll(/^test\((['"`])([^\n]*?)\1,\s*(?:async\s*)?\(.*$/gm));

  return matches.map((match, index) => ({
    title: match[2],
    code: source.slice(match.index ?? 0, matches[index + 1]?.index ?? source.length).trim(),
  }));
}

function readBalanced(value: string, openingIndex: number) {
  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = openingIndex; index < value.length; index += 1) {
    const character = value[index];

    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }

    if (character === "(" || character === "[" || character === "{") depth += 1;
    if (character === ")" || character === "]" || character === "}") depth -= 1;
    if (depth === 0) return { content: value.slice(openingIndex + 1, index), end: index };
  }

  return null;
}

function splitTopLevel(value: string) {
  const parts: string[] = [];
  let start = 0;
  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }

    if (character === "(" || character === "[" || character === "{") depth += 1;
    if (character === ")" || character === "]" || character === "}") depth -= 1;
    if (character === "," && depth === 0) {
      parts.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }

  parts.push(value.slice(start).trim());
  return parts;
}

function compactCode(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function extractExamples(testCode: string, identifier: string, fallbackOutput: string): ExerciseExample[] {
  const examples: ExerciseExample[] = [];
  const assertionPattern = /assert\.(equal|strictEqual|deepEqual|throws|rejects)\s*\(/g;
  const identifierPattern = new RegExp(`(?:await\\s+)?${escapeRegExp(identifier)}\\s*\\(`);
  const promisifiedPattern = new RegExp(`(?:await\\s+)?promisify\\(${escapeRegExp(identifier)}\\)\\s*\\(`);
  let assertion: RegExpExecArray | null;

  function findInvocation(value: string) {
    const direct = identifierPattern.exec(value);
    const promisified = promisifiedPattern.exec(value);
    const match = !direct
      ? promisified
      : !promisified || direct.index < promisified.index
        ? direct
        : promisified;
    if (!match) return null;

    const openingIndex = match.index + match[0].lastIndexOf("(");
    const call = readBalanced(value, openingIndex);
    if (!call) return null;

    return {
      start: match.index,
      end: call.end,
      text: compactCode(value.slice(match.index, call.end + 1)).replace(/^await\s+/, ""),
    };
  }

  while ((assertion = assertionPattern.exec(testCode)) && examples.length < 4) {
    const openingIndex = assertion.index + assertion[0].length - 1;
    const balanced = readBalanced(testCode, openingIndex);
    if (!balanced) continue;

    const parts = splitTopLevel(balanced.content);
    const actual = parts[0] ?? "";
    const invocation = findInvocation(actual);
    if (!invocation) {
      assertionPattern.lastIndex = balanced.end + 1;
      continue;
    }
    const isError = assertion[1] === "throws" || assertion[1] === "rejects";
    const expected = compactCode(parts[1] ?? "erro esperado");

    examples.push({
      input: invocation.text,
      output: isError ? `lança ${expected}` : expected,
      kind: isError ? "error" : "return",
    });
    assertionPattern.lastIndex = balanced.end + 1;
  }

  if (examples.length === 0) {
    const invocation = findInvocation(testCode);
    if (invocation) {
      examples.push({
        input: invocation.text,
        output: fallbackOutput || "comportamento descrito no teste",
        kind: "return",
      });
    }
  }

  return examples;
}

function parseHints(source: string, identifier: string): ExerciseHint[] {
  const headings = Array.from(source.matchAll(/^## (Nível \d+[^\n]*)\n/gm));

  return headings.flatMap((heading, index) => {
    const section = source.slice(
      (heading.index ?? 0) + heading[0].length,
      headings[index + 1]?.index ?? source.length,
    );
    const bullets = Array.from(section.matchAll(/^- ([\s\S]*?)(?=^- |^## |(?![\s\S]))/gm));
    const matching = bullets
      .map((bullet) => cleanMarkdownBlock(bullet[1]))
      .filter((bullet) => bullet.toLowerCase().includes(identifier.toLowerCase()));

    return matching.map((content) => ({ level: heading[1], content }));
  });
}

function parseExercises(readme: string, implementation: string, tests: string, hints: string) {
  const exports = parseExportBlocks(implementation);
  const testBlocks = parseTestBlocks(tests);

  return EXERCISE_SECTIONS.flatMap(({ heading, label }) => {
    const section = extractSection(readme, heading);
    const entries = Array.from(
      section.matchAll(/^(\d+)\.\s+\*\*`([^`]+)`\*\*\s*[—-]\s*([\s\S]*?)(?=^\d+\.\s+\*\*`|(?![\s\S]))/gm),
    );

    return entries.map((entry) => {
      const title = entry[2].trim();
      const identifier = title.split("(")[0].trim();
      const exportBlock = exports.find((block) => block.name === identifier);
      const relatedTests = testBlocks.filter((block) =>
        block.title.toLowerCase().includes(identifier.toLowerCase()),
      );
      const solution = exportBlock?.code.replace(/^export\s+/, "") ?? "";
      const testCode = relatedTests
        .map((block) => block.code.replace(/\n\/\/ ---[^\n]*[-]+\s*$/, "").trim())
        .join("\n\n");
      const checks = relatedTests.map((block) =>
        block.title.replace(new RegExp(`^${escapeRegExp(identifier)}:?\\s*`, "i"), ""),
      );

      return {
        number: Number(entry[1]),
        category: label,
        title,
        identifier,
        statement: cleanMarkdownBlock(entry[3]),
        starter: createStarter(exportBlock?.code ?? "", identifier),
        solution,
        checks,
        examples: extractExamples(testCode, identifier, checks[0] ?? ""),
        testCode,
        testCommand: `node --test --test-name-pattern="${identifier}" exercises.test.js`,
        hints: parseHints(hints, identifier),
      } satisfies ExerciseItem;
    });
  });
}

export const getExerciseContent = cache(async (unitPath: string): Promise<ExerciseContent> => {
  if (!UNIT_PATH.test(unitPath)) {
    throw new Error(`Invalid exercise unit: ${unitPath}`);
  }

  const unitDirectory = path.join(process.cwd(), "content", "exercises", unitPath);
  const [readme, implementation, tests, hints] = await Promise.all([
    readFile(path.join(unitDirectory, "README.md"), "utf8"),
    readFile(path.join(unitDirectory, "exercises.js"), "utf8"),
    readFile(path.join(unitDirectory, "exercises.test.js"), "utf8"),
    readFile(path.join(unitDirectory, "hints.md"), "utf8"),
  ]);

  const title = readme.match(/^#\s+(.+)$/m)?.[1] ?? "Prática da unidade";
  const introduction = readme
    .slice(readme.indexOf("\n") + 1, readme.search(/^## /m))
    .replace(/\r/g, "")
    .trim();

  return {
    title,
    introduction,
    exercises: parseExercises(readme, implementation, tests, hints),
  };
});
