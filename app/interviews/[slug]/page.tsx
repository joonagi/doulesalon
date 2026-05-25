import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/ContentCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  contents,
  formatDate,
  getContentBySlug,
  getPersonById,
  getRelatedContent
} from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return contents
    .filter((content) => content.format === "Interview")
    .map((content) => ({ slug: content.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getContentBySlug(slug);

  if (!content) {
    return {
      title: "인터뷰를 찾을 수 없습니다 | DOULE SALON"
    };
  }

  return {
    title: `${content.title} | DOULE SALON`,
    description: content.summary
  };
}

export default async function InterviewPage({ params }: PageProps) {
  const { slug } = await params;
  const content = getContentBySlug(slug);

  if (!content || content.format !== "Interview") {
    notFound();
  }

  const guest = content.guestId ? getPersonById(content.guestId) : undefined;
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
              {content.videoLength ? <span>{content.videoLength}</span> : null}
              {content.readTime ? <span>{content.readTime}</span> : null}
            </div>
            <h1>{content.title}</h1>
            <p className="article-subtitle">{content.subtitle}</p>
            <p className="article-summary">{content.summary}</p>
            <div className="credit-row">
              <span>진행: {content.author}</span>
              <span>사진: 둘레살롱 사진팀</span>
              <span>영상: 둘레살롱 스튜디오</span>
            </div>
          </header>

          <section className="video-block" aria-label="인터뷰 영상">
            <div>
              <p className="eyebrow">Watch / Listen</p>
              <h2>이번 주 인터뷰 보기</h2>
              <p>
                {content.videoLength ?? "영상"} / {content.audioLength ?? "오디오"} / 전문 읽기
              </p>
            </div>
            <Link className="button button-primary" href="#transcript">
              전문으로 내려가기
            </Link>
          </section>

          {content.quotes ? (
            <section className="quote-section" aria-labelledby="quotes-title">
              <h2 id="quotes-title">핵심 문장 5개</h2>
              <ol>
                {content.quotes.map((quote) => (
                  <li key={quote}>{quote}</li>
                ))}
              </ol>
            </section>
          ) : null}

          <section className="article-body" id="transcript">
            <h2>인터뷰 전문</h2>
            {content.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          {guest ? (
            <section className="guest-profile">
              <div className="guest-portrait">
                <Image src={guest.portrait} alt={guest.portraitAlt} fill sizes="240px" />
              </div>
              <div>
                <p className="eyebrow">Guest</p>
                <h2>{guest.name}</h2>
                <p className="guest-role">{guest.role}</p>
                <p>{guest.bio}</p>
                <p className="signature-question">{guest.signatureQuestion}</p>
              </div>
            </section>
          ) : null}

          {content.recommendations ? (
            <section className="recommendation-section">
              <h2>게스트가 추천한 영화·책·음악</h2>
              <ul>
                {content.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {content.discussionQuestions ? (
            <section className="discussion-section">
              <h2>소그룹 나눔 질문</h2>
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
                <p className="eyebrow">Related</p>
                <h2>관련 콘텐츠</h2>
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
