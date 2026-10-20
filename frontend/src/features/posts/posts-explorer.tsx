"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDownUp, Blocks, ChevronLeft, ChevronRight, Clock3, Hash, Library, Search, TextSearch, X } from "lucide-react";
import { springs } from "@/lib/motion";
import { Spotlight } from "@/shared/components/fx/spotlight";
import { COURSE_MODULES, moduleOf, type CourseModuleId } from "@/features/posts/modules";
import { normalizeText } from "@/features/posts/normalize";
import { matchContent, prepareIndex, type ContentMatch, type PreparedIndex } from "@/features/posts/content-search";
import type { SearchIndex } from "@/features/posts/search-index";
import { cn } from "@/shared/lib/utils";

export type ExplorerPost = {
  slug: string;
  unit: number;
  title: string;
  excerpt: string;
  readTime: string;
  cover: string;
  series: { slug: string; title: string };
  tags: Array<{ slug: string; label: string }>;
  /** Normalized text of the whole unit (title, body, code, tags, synonyms). */
  search: string;
};

type Sort = "recentes" | "curso";

function prefersSmooth() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const SUGGESTIONS = ["closures", "promises", "event loop", "this", "reduce", "json"];
const VISIBLE_TAGS = 12;
const PAGE_SIZE = 9;

type Result = { post: ExplorerPost; score: number; match: ContentMatch | null; contentOnly: boolean };

function scoreOf(post: ExplorerPost, terms: string[]) {
  const title = normalizeText(post.title);
  let score = 0;
  for (const term of terms) {
    if (!post.search.includes(term)) return -1;
    if (title.includes(term)) score += 3;
    if (post.tags.some((tag) => normalizeText(tag.label) === term || tag.slug === term)) score += 2;
    score += 1;
  }
  return score;
}

/** Blog-style finder: full-text search, series, module and tag filters, all reflected in the URL. */
export function PostsExplorer({
  posts,
  series,
  tags,
  initialTag = null,
}: {
  posts: ExplorerPost[];
  series: Array<{ slug: string; title: string }>;
  tags: Array<{ slug: string; label: string; count: number }>;
  initialTag?: string | null;
}) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [seriesSlug, setSeriesSlug] = useState<string | null>(null);
  const [module, setModule] = useState<CourseModuleId | null>(null);
  const [tag, setTag] = useState<string | null>(initialTag);
  const [sort, setSort] = useState<Sort>("recentes");
  const [allTags, setAllTags] = useState(false);
  const [contentIndex, setContentIndex] = useState<PreparedIndex | null>(null);
  const [pageState, setPageState] = useState({ key: "", page: 1 });
  const indexRequested = useRef(false);
  const barRef = useRef<HTMLDivElement>(null);

  // The full-text index (lesson, exercises, hints) is only fetched once someone searches.
  const loadIndex = () => {
    if (indexRequested.current) return;
    indexRequested.current = true;
    fetch("/posts/search-index.json")
      .then((response) => (response.ok ? (response.json() as Promise<SearchIndex>) : Promise.reject(new Error(String(response.status)))))
      .then((index) => setContentIndex(prepareIndex(index)))
      .catch(() => {
        indexRequested.current = false;
      });
  };

  // Restore filters from a shared link (?q=&serie=&modulo=&tag=&ordem=).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const restore = window.setTimeout(() => {
      if (params.get("q")) setQuery(params.get("q") ?? "");
      if (params.get("serie")) setSeriesSlug(params.get("serie"));
      const moduleParam = params.get("modulo");
      if (moduleParam && COURSE_MODULES.some((item) => item.id === moduleParam)) setModule(moduleParam as CourseModuleId);
      if (params.get("tag")) setTag(params.get("tag"));
      if (params.get("ordem") === "curso") setSort("curso");
      const pageParam = Number(params.get("pagina"));
      if (pageParam > 1) setPageState({ key: "restore", page: pageParam });
      if (params.get("q")) loadIndex();
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);


  const terms = useMemo(() => normalizeText(query).split(/\s+/).filter(Boolean), [query]);

  const results = useMemo<Result[]>(() => {
    return posts
      .map((post) => {
        if (!terms.length) return { post, score: 0, match: null, contentOnly: false };
        const meta = scoreOf(post, terms);
        const match = matchContent(contentIndex?.get(post.slug), terms);
        // Metadata hits rank first; content-only hits still count, weighted by mentions.
        const score = meta >= 0 ? 100 + meta * 10 + (match?.mentions ?? 0) : match ? Math.min(match.mentions, 50) : -1;
        return { post, score, match, contentOnly: meta < 0 };
      })
      .filter(({ post, score }) =>
        score >= 0 &&
        (!seriesSlug || post.series.slug === seriesSlug) &&
        (!module || moduleOf(post.unit).id === module) &&
        (!tag || post.tags.some((item) => item.slug === tag)),
      )
      .sort((a, b) => (terms.length && b.score !== a.score ? b.score - a.score : sort === "curso" ? a.post.unit - b.post.unit : b.post.unit - a.post.unit));
  }, [contentIndex, module, posts, seriesSlug, sort, tag, terms]);

  // Any filter change sends you back to page 1; a page from a shared link survives the first render.
  const filterKey = JSON.stringify([terms, seriesSlug, module, tag, sort]);
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(pageCount, pageState.key === filterKey || pageState.key === "restore" ? pageState.page : 1);
  const pageResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goTo = (next: number) => {
    setPageState({ key: filterKey, page: next });
    barRef.current?.scrollIntoView({ behavior: prefersSmooth() ? "smooth" : "auto", block: "start" });
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (seriesSlug) params.set("serie", seriesSlug);
    if (module) params.set("modulo", module);
    if (tag && tag !== initialTag) params.set("tag", tag);
    if (sort === "curso") params.set("ordem", "curso");
    if (page > 1) params.set("pagina", String(page));
    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ""}`;
    if (next !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", next);
  }, [initialTag, module, page, query, seriesSlug, sort, tag]);

  const activeTag = tags.find((item) => item.slug === tag);
  const hasFilters = Boolean(query.trim() || seriesSlug || module || (tag && tag !== initialTag));
  // Keep the active tag visible even when it sits past the collapsed list.
  const shownTags = allTags
    ? tags
    : [...tags.slice(0, VISIBLE_TAGS), ...tags.slice(VISIBLE_TAGS).filter((item) => item.slug === tag)];

  const clear = () => {
    setQuery("");
    setSeriesSlug(null);
    setModule(null);
    setTag(initialTag);
  };

  return (
    <div className="explorer">
      <div className="explorer__controls">
        <label className="explorer__search">
          <Search aria-hidden="true" />
          <span className="sr-only">Buscar publicações</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={loadIndex}
            placeholder="Buscar por tema, código ou tag"
          />
          {query ? (
            <button type="button" className="explorer__clear-input" onClick={() => setQuery("")} aria-label="Limpar busca">
              <X aria-hidden="true" />
            </button>
          ) : null}
        </label>
        {!query ? (
          <p className="explorer__suggest">
            Experimente:
            {SUGGESTIONS.map((term) => (
              <button key={term} type="button" onClick={() => { loadIndex(); setQuery(term); }}>{term}</button>
            ))}
          </p>
        ) : null}

        <div className="explorer__filters">
          <div className="explorer__group">
            <p className="explorer__label"><Library aria-hidden="true" />Série</p>
            <div className="explorer__chips" role="group" aria-label="Filtrar por série">
              <button type="button" className={cn("chip", !seriesSlug && "is-active")} aria-pressed={!seriesSlug} onClick={() => setSeriesSlug(null)}>Todas</button>
              {series.map((item) => (
                <button key={item.slug} type="button" className={cn("chip", seriesSlug === item.slug && "is-active")} aria-pressed={seriesSlug === item.slug} onClick={() => setSeriesSlug(seriesSlug === item.slug ? null : item.slug)}>
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          <div className="explorer__group">
            <p className="explorer__label"><Blocks aria-hidden="true" />Módulo</p>
            <div className="explorer__chips" role="group" aria-label="Filtrar por módulo">
              <button type="button" className={cn("chip", !module && "is-active")} aria-pressed={!module} onClick={() => setModule(null)}>Todos</button>
              {COURSE_MODULES.map((item) => (
                <button key={item.id} type="button" className={cn("chip", module === item.id && "is-active")} aria-pressed={module === item.id} onClick={() => setModule(module === item.id ? null : item.id)}>
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          <div className="explorer__group">
            <p className="explorer__label"><Hash aria-hidden="true" />Tags</p>
            <div className="explorer__chips" role="group" aria-label="Filtrar por tag">
              {shownTags.map((item) => (
                <button key={item.slug} type="button" className={cn("chip chip--tag", tag === item.slug && "is-active")} aria-pressed={tag === item.slug} onClick={() => setTag(tag === item.slug ? null : item.slug)}>
                  #{item.label}<span className="chip__count tabular">{item.count}</span>
                </button>
              ))}
              {tags.length > VISIBLE_TAGS ? (
                <button type="button" className="chip chip--more" onClick={() => setAllTags((open) => !open)} aria-expanded={allTags}>
                  {allTags ? "Menos tags" : `+${tags.length - VISIBLE_TAGS} tags`}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div ref={barRef} className="explorer__bar">
        <p className="explorer__count mono tabular" aria-live="polite">
          {results.length} {results.length === 1 ? "publicação" : "publicações"}
          {activeTag ? <> em <Link href={`/posts/tag/${activeTag.slug}`}>#{activeTag.label}</Link></> : null}
          {query.trim() ? <> para “{query.trim()}”</> : null}
        </p>
        <div className="explorer__bar-actions">
          {hasFilters ? (
            <button type="button" className="explorer__reset" onClick={clear}><X aria-hidden="true" />Limpar filtros</button>
          ) : null}
          <button type="button" className="explorer__sort" onClick={() => setSort(sort === "recentes" ? "curso" : "recentes")}>
            <ArrowDownUp aria-hidden="true" />{sort === "recentes" ? "Mais recentes" : "Ordem do curso"}
          </button>
        </div>
      </div>

      <motion.ul className="explorer__grid" layout={!reduce}>
        <AnimatePresence mode="popLayout">
          {pageResults.map(({ post, match, contentOnly }) => (
            <motion.li
              key={post.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={springs.gentle}
              className="explorer__item"
            >
              <Spotlight as={Link} href={`/posts/${post.slug}${match && contentOnly ? `#${match.anchor}` : ""}`} className="post-card">
                <span className="post-card__cover">
                  <Image src={post.cover} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" className="object-cover" style={{ objectPosition: "center 32%" }} />
                </span>
                <span className="post-card__body">
                  <span className="post-card__meta mono tabular">{String(post.unit).padStart(2, "0")} · {moduleOf(post.unit).title}<span className="post-card__time"><Clock3 className="icon-inline" aria-hidden="true" />{post.readTime}</span></span>
                  <span className="post-card__title">{post.title}</span>
                  <span className="post-card__excerpt">{post.excerpt}</span>
                  {match ? (
                    <span className="post-card__match">
                      <span className="post-card__match-where mono"><TextSearch aria-hidden="true" />{match.where}{match.mentions > 1 ? ` · ${match.mentions} menções` : ""}</span>
                      <span className="post-card__match-text">{match.before}<mark>{match.hit}</mark>{match.after}</span>
                    </span>
                  ) : null}
                </span>
              </Spotlight>
              <ul className="post-card__tags" aria-label={`Tags de ${post.title}`}>
                {post.tags.filter((item) => item.slug !== "javascript" && item.slug !== "backend").slice(0, 3).map((item) => (
                  <li key={item.slug}>
                    <button type="button" className={cn(tag === item.slug && "is-active")} onClick={() => setTag(item.slug)}>#{item.label}</button>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {pageCount > 1 ? (
        <nav className="pager" aria-label="Paginação das publicações">
          <button type="button" className="pager__step" onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Página anterior">
            <ChevronLeft aria-hidden="true" />Anterior
          </button>
          <ol className="pager__pages">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <li key={number}>
                <button type="button" className={cn("pager__page tabular", number === page && "is-active")} aria-current={number === page ? "page" : undefined} onClick={() => goTo(number)}>
                  {number}
                </button>
              </li>
            ))}
          </ol>
          <button type="button" className="pager__step" onClick={() => goTo(page + 1)} disabled={page === pageCount} aria-label="Próxima página">
            Próxima<ChevronRight aria-hidden="true" />
          </button>
          <p className="pager__status mono tabular">Página {page} de {pageCount}</p>
        </nav>
      ) : null}

      {results.length === 0 ? (
        <div className="explorer__empty">
          <p>Nenhuma publicação com esses filtros{query.trim() ? <> para “{query.trim()}”</> : null}.</p>
          <button type="button" className="btn" onClick={clear}>Limpar filtros</button>
        </div>
      ) : null}
    </div>
  );
}
