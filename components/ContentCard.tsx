import Image from "next/image";
import Link from "next/link";
import { Content, formatDate, getContentHref } from "@/lib/content";

type ContentCardProps = {
  content: Content;
  variant?: "standard" | "compact" | "feature";
  priority?: boolean;
};

export function ContentCard({ content, variant = "standard", priority = false }: ContentCardProps) {
  const href = getContentHref(content);
  const meta = [content.videoLength, content.audioLength, content.readTime].filter(Boolean);

  return (
    <article className={`content-card content-card-${variant}`}>
      <Link className="image-link" href={href} aria-label={content.title}>
        <Image
          src={content.heroImage}
          alt={content.imageAlt}
          fill
          preload={priority}
          loading={priority ? "eager" : undefined}
          sizes={variant === "feature" ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, 100vw"}
        />
      </Link>
      <div className="card-body">
        <p className="card-meta">
          {content.format} / {content.category}
        </p>
        <h3>
          <Link href={href}>{content.title}</Link>
        </h3>
        {variant !== "compact" ? <p>{content.summary}</p> : null}
        <div className="card-details">
          <span>{formatDate(content.publishedAt)}</span>
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
