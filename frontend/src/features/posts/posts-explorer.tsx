"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search } from "lucide-react";
import { springs } from "@/lib/motion";
import { Spotlight } from "@/shared/components/fx/spotlight";
import { COURSE_MODULES, moduleOf, type CourseModuleId } from "@/features/posts/modules";
import { cn } from "@/shared/lib/utils";

export type ExplorerPost = { slug: string; unit: number; title: string; excerpt: string; readTime: string; cover: string };

function normalize(value: string) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Instant search + module filter over the published units. */
export function PostsExplorer({ posts }: { posts: ExplorerPost[] }) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [module, setModule] = useState<CourseModuleId | "all">("all");

  const visible = useMemo(() => {
    const needle = normalize(query.trim());
    return posts.filter((post) => {
      const inModule = module === "all" || moduleOf(post.unit).id === module;
      const matches = !needle || normalize(`${post.title} ${post.excerpt} ${post.unit}`).includes(needle);
      return inModule && matches;
    });
  }, [module, posts, query]);

  return (
    <div className="explorer">
      <div className="explorer__controls">
        <label className="explorer__search">
          <Search aria-hidden="true" />
          <span className="sr-only">Buscar publicações</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por assunto, como closures ou promises" />
        </label>
        <div className="explorer__chips" role="group" aria-label="Filtrar por módulo">
          <button type="button" className={cn("chip", module === "all" && "is-active")} aria-pressed={module === "all"} onClick={() => setModule("all")}>Todos</button>
          {COURSE_MODULES.map((item) => (
            <button key={item.id} type="button" className={cn("chip", module === item.id && "is-active")} aria-pressed={module === item.id} onClick={() => setModule(item.id)}>
              {item.title}
            </button>
          ))}
        </div>
      </div>

      <p className="explorer__count mono tabular" aria-live="polite">{visible.length} {visible.length === 1 ? "publicação" : "publicações"}</p>

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
            >
              <Spotlight as={Link} href={`/posts/${post.slug}`} className="post-card">
                <span className="post-card__cover">
                  <Image src={post.cover} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" className="object-cover" />
                </span>
                <span className="post-card__body">
                  <span className="post-card__meta mono tabular">{String(post.unit).padStart(2, "0")} · {moduleOf(post.unit).title} · {post.readTime}</span>
                  <span className="post-card__title">{post.title}</span>
                  <span className="post-card__excerpt">{post.excerpt}</span>
                </span>
              </Spotlight>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {visible.length === 0 ? (
        <p className="explorer__empty">Nenhuma unidade sobre “{query}”. Tente outro termo ou abra o console com ⌘K.</p>
      ) : null}
    </div>
  );
}
