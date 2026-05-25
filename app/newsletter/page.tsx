import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { contents, getContentHref, newsletter } from "@/lib/content";

export const metadata: Metadata = {
  title: "금요 문화 편지 | DOULE SALON",
  description: "매주 금요일 오전 받아보는 기독교 문화 뉴스레터"
};

export default function NewsletterPage() {
  const highlights = contents.slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main className="page-shell newsletter-page">
        <section className="newsletter-hero">
          <div>
            <p className="eyebrow">Newsletter</p>
            <h1>{newsletter.issueTitle}</h1>
            <p>{newsletter.deliveryNote}</p>
            <p className="editorial-question">{newsletter.editorialQuestion}</p>
          </div>
          <form className="newsletter-form newsletter-form-large">
            <label htmlFor="newsletter-email">이메일</label>
            <div>
              <input id="newsletter-email" name="email" type="email" placeholder="you@example.com" />
              <button type="submit">{newsletter.subscribeCta}</button>
            </div>
          </form>
        </section>

        <section className="newsletter-issue" aria-labelledby="issue-title">
          <div className="section-header">
            <div>
              <p className="eyebrow">This Friday</p>
              <h2 id="issue-title">이번 호에 담기는 것</h2>
            </div>
          </div>
          <div className="newsletter-columns">
            <div>
              <h3>편지 구성</h3>
              <ul>
                {newsletter.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>이번 주 하이라이트</h3>
              <ul>
                {highlights.map((content) => (
                  <li key={content.slug}>
                    <Link href={getContentHref(content)}>{content.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>편집 원칙</h3>
              <p>
                빠르게 사라지는 소식보다 공동체가 오래 붙들 질문을 고릅니다.
                콘텐츠는 인터뷰, 작품 해석, 소그룹 질문, 창작자 아카이브로
                다시 연결됩니다.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
