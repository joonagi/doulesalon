import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CategoryBadge } from "@/components/CategoryBadge";
import { PostBody } from "@/components/PostBody";
import { PostCard } from "@/components/PostCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { estimateReadTime, formatDate, getPublishedPostBySlug, getPublishedPosts } from "@/lib/posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: "글을 찾을 수 없습니다 | DOULE SALON"
    };
  }

  return {
    title: `${post.title} | DOULE SALON`,
    description: post.excerpt
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = (await getPublishedPosts())
    .filter((item) => item.slug !== post.slug && item.category === post.category)
    .slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main>
        <article className="article-shell">
          <header className="article-hero">
            <div className="article-image">
              <Image src={post.heroImageUrl} alt={post.imageAlt} fill preload loading="eager" sizes="100vw" />
            </div>
            <p className="image-caption">{post.caption}</p>
            <div className="article-kicker">
              <CategoryBadge category={post.category} />
              <span>{formatDate(post.publishedAt)}</span>
              <span>{estimateReadTime(post.bodyMarkdown)}</span>
              <span>글: {post.authorName}</span>
            </div>
            <h1>{post.title}</h1>
            {post.subtitle ? <p className="article-subtitle">{post.subtitle}</p> : null}
            <p className="article-summary">{post.excerpt}</p>
          </header>

          <PostBody bodyMarkdown={post.bodyMarkdown} />
        </article>

        {related.length > 0 ? (
          <section className="content-section page-shell">
            <div className="section-header">
              <div>
                <p className="eyebrow">Related</p>
                <h2>같은 카테고리의 글</h2>
              </div>
            </div>
            <div className="briefing-grid">
              {related.map((item) => (
                <PostCard key={item.slug} post={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
