import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getContentBySlug, getContentHref, guides } from "@/lib/content";

export const metadata: Metadata = {
  title: "문화 가이드 | DOULE SALON",
  description: "교회 소그룹, 절기, 서울 문화 산책을 위한 기독교 문화 가이드"
};

export default function GuidesPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell directory-page">
        <header className="directory-hero">
          <p className="eyebrow">Guides</p>
          <h1>교회 공동체가 바로 쓰는 문화 가이드</h1>
          <p>
            영화 한 편, 전시 한 곳, 책 한 권이 공동체의 깊은 대화로 이어지도록
            대상, 시간, 질문, 참고 콘텐츠를 함께 제공합니다.
          </p>
        </header>

        <section className="guides-directory" aria-label="가이드 목록">
          {guides.map((guide) => (
            <article className="guide-card-large" key={guide.slug}>
              <div className="guide-image">
                <Image src={guide.image} alt={guide.imageAlt} fill sizes="(min-width: 900px) 38vw, 100vw" />
              </div>
              <div className="guide-copy">
                <p className="eyebrow">{guide.season}</p>
                <h2>{guide.title}</h2>
                <p>{guide.summary}</p>
                <dl className="guide-facts">
                  <div>
                    <dt>대상</dt>
                    <dd>{guide.audience}</dd>
                  </div>
                  <div>
                    <dt>사용 시간</dt>
                    <dd>{guide.estimatedTime}</dd>
                  </div>
                  <div>
                    <dt>자료</dt>
                    <dd>{guide.downloadableAsset}</dd>
                  </div>
                </dl>
                <div className="mini-list">
                  <h3>추천 콘텐츠</h3>
                  {guide.contentIds.map((id) => {
                    const content = getContentBySlug(id);
                    return content ? (
                      <Link key={id} className="text-link" href={getContentHref(content)}>
                        {content.title}
                      </Link>
                    ) : null;
                  })}
                </div>
                <div className="mini-list">
                  <h3>나눔 질문</h3>
                  <ol>
                    {guide.discussionQuestions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
