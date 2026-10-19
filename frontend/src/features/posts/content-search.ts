import type { Passage, SearchIndex } from "@/features/posts/search-index";
import { normalizeText } from "@/features/posts/normalize";

export type PreparedPassage = Passage & { norm: string };
export type PreparedIndex = Map<string, PreparedPassage[]>;

/** Where a query shows up inside a unit's full text. */
export type ContentMatch = {
  mentions: number;
  where: string;
  anchor: string;
  /** Snippet split so the matched term can be highlighted. */
  before: string;
  hit: string;
  after: string;
};

const SNIPPET_RADIUS = 70;

export function prepareIndex(index: SearchIndex): PreparedIndex {
  // NFC keeps one code unit per accented letter, so indexes in `norm` line up with `text`.
  return new Map(
    Object.entries(index).map(([slug, passages]) => [
      slug,
      passages.map((passage) => {
        const text = passage.text.normalize("NFC");
        return { ...passage, text, norm: normalizeText(text) };
      }),
    ]),
  );
}

const WORD_CHAR = /[a-z0-9]/;

/** Index of `needle` starting at a word boundary ("this" must not match inside "athis"). */
function findWord(haystack: string, needle: string, from = 0) {
  for (let at = haystack.indexOf(needle, from); at !== -1; at = haystack.indexOf(needle, at + 1)) {
    if (at === 0 || !WORD_CHAR.test(haystack[at - 1])) return at;
  }
  return -1;
}

function countOccurrences(haystack: string, needle: string) {
  let count = 0;
  for (let at = findWord(haystack, needle); at !== -1; at = findWord(haystack, needle, at + needle.length)) count += 1;
  return count;
}

/** First passage that cites the query, with a snippet around it and how often the unit mentions it. */
export function matchContent(passages: PreparedPassage[] | undefined, terms: string[]): ContentMatch | null {
  if (!passages || terms.length === 0) return null;
  const whole = passages.map((passage) => passage.norm).join(" ");
  // Several words are searched as a phrase in the body text ("event loop", not "event" + "loop").
  const phrase = terms.join(" ");
  if (findWord(whole, phrase) === -1) return null;

  // The card already shows the summary, so prefer a passage from the lesson body or exercises.
  const citing = passages.filter((passage) => findWord(passage.norm, phrase) !== -1);
  const best = citing.find((passage) => passage.where !== "Resumo") ?? citing[0];
  if (!best) return null;

  const needle = phrase;
  const at = findWord(best.norm, needle);
  // Cut the snippet on word boundaries so it never opens or closes mid-word.
  let start = Math.max(0, at - SNIPPET_RADIUS);
  if (start > 0) start = Math.min(at, best.text.indexOf(" ", start) + 1 || start);
  let end = Math.min(best.text.length, at + needle.length + SNIPPET_RADIUS);
  if (end < best.text.length) end = Math.max(at + needle.length, best.text.lastIndexOf(" ", end));
  return {
    mentions: countOccurrences(whole, phrase),
    where: best.where,
    anchor: best.anchor,
    before: `${start > 0 ? "…" : ""}${best.text.slice(start, at).trimStart()}`,
    hit: best.text.slice(at, at + needle.length),
    after: `${best.text.slice(at + needle.length, end).trimEnd()}${end < best.text.length ? "…" : ""}`,
  };
}
