import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryBadge } from "@/components/CategoryBadge";
import { estimateReadTime, formatDate, postHref, type PublicPost } from "@/lib/posts";
import { getCategoryMeta } from "@/lib/categories";

type PostCardProps = {
  post: PublicPost;
  variant?: "standard" | "compact" | "feature";
  priority?: boolean;
};

export function PostCard({ post, variant = "standard", priority = false }: PostCardProps) {
  const href = postHref(post);
  const meta = getCategoryMeta(post.category);

  return (
    <article
      className={`content-card post-card content-card-${variant}`}
      style={{ "--category-color": meta.color } as CSSProperties}
    >
      <Link className="image-link" href={href} aria-label={post.title}>
        <Image
          src={post.heroImageUrl}
          alt={post.imageAlt}
          fill
          preload={priority}
          loading={priority ? "eager" : undefined}
          sizes={variant === "feature" ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, 100vw"}
        />
      </Link>
      <div className="card-body">
        <CategoryBadge category={post.category} />
        <h3>
          <Link href={href}>{post.title}</Link>
        </h3>
        {variant !== "compact" ? <p>{post.excerpt}</p> : null}
        <div className="card-details">
          <span>{formatDate(post.publishedAt)}</span>
          <span>{estimateReadTime(post.bodyMarkdown)}</span>
        </div>
      </div>
    </article>
  );
}
