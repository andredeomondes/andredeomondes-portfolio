"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDownUp, Blocks, Clock3, Hash, Library, Search, X } from "lucide-react";
import { springs } from "@/lib/motion";
import { Spotlight } from "@/shared/components/fx/spotlight";
import { COURSE_MODULES, moduleOf, type CourseModuleId } from "@/features/posts/modules";
import { normalizeText } from "@/features/posts/normalize";
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

const SUGGESTIONS = ["closures", "promises", "event loop", "this", "reduce", "regex"];
const VISIBLE_TAGS = 12;

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
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (seriesSlug) params.set("serie", seriesSlug);
    if (module) params.set("modulo", module);
    if (tag && tag !== initialTag) params.set("tag", tag);
    if (sort === "curso") params.set("ordem", "curso");
    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ""}`;
    if (next !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", next);
  }, [initialTag, module, query, seriesSlug, sort, tag]);

  const visible = useMemo(() => {
    const terms = normalizeText(query).split(/\s+/).filter(Boolean);
    return posts
      .map((post) => ({ post, score: terms.length ? scoreOf(post, terms) : 0 }))
      .filter(({ post, score }) =>
        score >= 0 &&
        (!seriesSlug || post.series.slug === seriesSlug) &&
        (!module || moduleOf(post.unit).id === module) &&
        (!tag || post.tags.some((item) => item.slug === tag)),
      )
      .sort((a, b) => (terms.length && b.score !== a.score ? b.score - a.score : sort === "curso" ? a.post.unit - b.post.unit : b.post.unit - a.post.unit))
      .map(({ post }) => post);
  }, [module, posts, query, seriesSlug, sort, tag]);

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
              <button key={term} type="button" onClick={() => setQuery(term)}>{term}</button>
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

      <div className="explorer__bar">
        <p className="explorer__count mono tabular" aria-live="polite">
          {visible.length} {visible.length === 1 ? "publicação" : "publicações"}
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
          {visible.map((post) => (
            <motion.li
              key={post.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={springs.gentle}
              className="explorer__item"
            >
              <Spotlight as={Link} href={`/posts/${post.slug}`} className="post-card">
                <span className="post-card__cover">
                  <Image src={post.cover} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" className="object-cover" style={{ objectPosition: "center 32%" }} />
                </span>
                <span className="post-card__body">
                  <span className="post-card__meta mono tabular">{String(post.unit).padStart(2, "0")} · {moduleOf(post.unit).title}<span className="post-card__time"><Clock3 className="icon-inline" aria-hidden="true" />{post.readTime}</span></span>
                  <span className="post-card__title">{post.title}</span>
                  <span className="post-card__excerpt">{post.excerpt}</span>
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

      {visible.length === 0 ? (
        <div className="explorer__empty">
          <p>Nenhuma publicação com esses filtros{query.trim() ? <> para “{query.trim()}”</> : null}.</p>
          <button type="button" className="btn" onClick={clear}>Limpar filtros</button>
        </div>
      ) : null}
    </div>
  );
}
