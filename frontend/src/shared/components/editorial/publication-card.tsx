import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Publication } from "@/content/posts";

export function PublicationCard({
  post,
  priority = false,
}: {
  post: Publication;
  priority?: boolean;
}) {
  return (
    <article data-motion="item" className="publication-card group border-t border-line py-6 sm:py-8">
      <Link
        href={`/posts/${post.slug}`}
        className="grid gap-5 sm:grid-cols-[120px_1fr_auto] sm:items-center"
      >
        <div data-motion="image" className="relative aspect-square overflow-hidden rounded-[14px] border border-line bg-panel">
          <Image
            src={post.images[0]}
            alt={`Capa da unidade ${post.unit}: ${post.title}`}
            fill
            fetchPriority={priority ? "high" : undefined}
            sizes="(max-width: 640px) 100vw, 120px"
            className="object-cover grayscale transition duration-500 group-hover:scale-[1.025] group-hover:grayscale-0"
          />
        </div>

        <div>
          <p className="label"><span className="font-pixel text-signal">{String(post.unit).padStart(2, "0")}</span> · Unidade · {post.readTime}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-paper sm:text-3xl">
            {post.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-dim sm:text-base">
            {post.excerpt}
          </p>
        </div>

        <span className="hidden size-11 items-center justify-center rounded-[10px] border border-line text-paper transition-colors group-hover:border-signal group-hover:text-signal sm:flex">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </Link>
    </article>
  );
}
