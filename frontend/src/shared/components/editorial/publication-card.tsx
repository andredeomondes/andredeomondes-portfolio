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
    <article data-motion="item" className="group border-t border-line py-6 sm:py-8">
      <Link
        href={`/posts/${post.slug}`}
        className="grid gap-5 sm:grid-cols-[120px_1fr_auto] sm:items-center"
      >
        <div data-motion="image" className="relative aspect-square overflow-hidden border border-line bg-panel">
          <Image
            src={post.images[0]}
            alt={`Capa da unidade ${post.unit}: ${post.title}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, 120px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
        </div>

        <div>
          <p className="label">Unidade {String(post.unit).padStart(2, "0")} · {post.readTime}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-paper sm:text-3xl">
            {post.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-dim sm:text-base">
            {post.excerpt}
          </p>
        </div>

        <span className="hidden size-11 items-center justify-center border border-line text-paper transition-colors group-hover:border-signal group-hover:bg-signal group-hover:text-ink sm:flex">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </Link>
    </article>
  );
}
