import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/ContentCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { contents, formatDate, getContentBySlug, getRelatedContent } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return contents
    .filter((content) => content.format !== "Interview")
    .map((content) => ({ slug: content.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getContentBySlug(slug);

  if (!content) {
    return {
      title: "글을 찾을 수 없습니다 | DOULE SALON"
    };
  }

  return {
    title: `${content.title} | DOULE SALON`,
    description: content.summary
  };
}

export default async function EssayPage({ params }: PageProps) {
  const { slug } = await params;
  const content = getContentBySlug(slug);

  if (!content || content.format === "Interview") {
    notFound();
  }

  const related = getRelatedContent(content.relatedContent);

  return (
    <>
      <SiteHeader />
      <main>
        <article className="article-shell">
          <header className="article-hero">
            <div className="article-image">
              <Image src={content.heroImage} alt={content.imageAlt} fill preload loading="eager" sizes="100vw" />
            </div>
            <p className="image-caption">{content.caption}</p>
            <div className="article-kicker">
              <span>
                {content.format} / {content.category}
              </span>
              <span>{formatDate(content.publishedAt)}</span>
              {content.readTime ? <span>{content.readTime}</span> : null}
              <span>글: {content.author}</span>
            </div>
            <h1>{content.title}</h1>
            <p className="article-subtitle">{content.subtitle}</p>
            <p className="article-summary">{content.summary}</p>
          </header>

          <section className="article-body">
            {content.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          {content.recommendations ? (
            <section className="recommendation-section">
              <h2>함께 읽고 볼 자료</h2>
              <ul>
                {content.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {content.discussionQuestions ? (
            <section className="discussion-section">
              <h2>나눔 질문</h2>
              <ol>
                {content.discussionQuestions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ol>
            </section>
          ) : null}
        </article>

        {related.length > 0 ? (
          <section className="content-section page-shell">
            <div className="section-header">
              <div>
                <p className="eyebrow">Recommendations</p>
                <h2>이 글 다음에 읽을 콘텐츠</h2>
              </div>
            </div>
            <div className="briefing-grid">
              {related.map((item) => (
                <ContentCard key={item.slug} content={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
