import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryBadge } from "@/components/CategoryBadge";
import { PostCard } from "@/components/PostCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CATEGORY_META, POST_CATEGORIES } from "@/lib/categories";
import {
  guides,
  newsletter,
  people,
  support
} from "@/lib/content";
import { estimateReadTime, formatDate, getPublishedPosts, postHref } from "@/lib/posts";

export const revalidate = 60;

export default async function Home() {
  const posts = await getPublishedPosts();
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const sideCards = posts.filter((post) => post.slug !== featured.slug).slice(0, 4);
  const briefings = posts.slice(0, 6);
  const essays = posts.slice(1, 4);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="editorial-status page-shell" aria-label="편집실 상태">
          <p>현재 서울에서 편집 중</p>
          <strong>{newsletter.editorialQuestion}</strong>
          <span>오늘의 문화 편지 준비 중</span>
        </section>

        <section className="hero-grid page-shell" aria-labelledby="featured-title">
          <article className="hero-feature">
            <div className="hero-image">
              <Image
                src={featured.heroImageUrl}
                alt={featured.imageAlt}
                fill
                preload
                loading="eager"
                sizes="(min-width: 1000px) 58vw, 100vw"
              />
            </div>
            <div className="hero-copy">
              <p className="eyebrow">이번 주 인터뷰</p>
              <CategoryBadge category={featured.category} />
              <div className="hero-meta">
                <span>{CATEGORY_META[featured.category].label}</span>
                <span>{formatDate(featured.publishedAt)}</span>
                <span>{estimateReadTime(featured.bodyMarkdown)}</span>
              </div>
              <h1 id="featured-title">{featured.title}</h1>
              <p>{featured.excerpt}</p>
              <p className="guest-line">글: {featured.authorName}</p>
              <div className="button-row">
                <Link className="button button-primary" href={postHref(featured)}>
                  전문 읽기
                </Link>
                <Link className="button" href="/admin/posts/new">
                  관리자 글쓰기
                </Link>
                <a className="button" href="#listen">
                  팟캐스트 듣기
                </a>
              </div>
            </div>
          </article>

          <aside className="hero-side" aria-label="이번 주 추천 콘텐츠">
            {sideCards.map((post, index) => (
              <PostCard key={post.slug} post={post} variant="compact" priority={index < 2} />
            ))}
          </aside>
        </section>

        <section className="listen-band page-shell" id="listen" aria-labelledby="listen-title">
          <div>
            <p className="eyebrow">지금 듣는 인터뷰</p>
            <h2 id="listen-title">창작자는 실패를 어떻게 견디는가</h2>
            <p>음악가 이다니엘과의 대화. 예배음악 밖에서 신앙의 리듬을 찾는 법.</p>
          </div>
          <div className="listen-actions" aria-label="듣는 인터뷰 이동">
            <Link href="/interviews/songs-outside-worship">YouTube에서 보기</Link>
            <Link href="/interviews/songs-outside-worship">Podcast로 듣기</Link>
            <Link href="/interviews/songs-outside-worship">인터뷰 전문 읽기</Link>
          </div>
        </section>

        <section className="content-section page-shell" id="briefing">
          <SectionHeader
            eyebrow="문화 브리핑"
            title="이번 주 문화 브리핑"
            description="영화, 전시, 음악, 책, 행사, 생각거리를 편집부가 고른 순서로 읽습니다."
            href="/newsletter"
            linkLabel="편지로 받기"
          />
          <div className="briefing-grid">
            {briefings.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <section className="content-section page-shell" aria-label="분야별 카드">
          <SectionHeader
            eyebrow="분야별 탐색"
            title="Film / Art / Music / Books"
            description="초기 콘텐츠가 적어도 각 분야의 대표 글과 짧은 큐레이션이 함께 보이도록 구성했습니다."
          />
          <div className="field-grid">
            {POST_CATEGORIES.map((category) => {
              const meta = CATEGORY_META[category];
              const items = posts.filter((post) => post.category === category);
              const lead = items[0] ?? posts[0];

              return (
                <article
                  className="field-card"
                  id={category}
                  key={category}
                  style={{ "--category-color": meta.color } as CSSProperties}
                >
                  <CategoryBadge category={category} />
                  <h3>
                    <Link href={postHref(lead)}>{lead.title}</Link>
                  </h3>
                  <p>{lead.excerpt}</p>
                  <ul>
                    {(items.length > 1 ? items.slice(1, 4) : posts.slice(1, 4)).map((item) => (
                      <li key={`${category}-${item.slug}`}>
                        <Link href={postHref(item)}>{item.subtitle || item.title}</Link>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="content-section page-shell" id="people">
          <SectionHeader
            eyebrow="창작자 아카이브"
            title="만난 사람들"
            description="작품만 소개하지 않고, 믿음을 가지고 만들고 버티고 질문하는 사람을 축적합니다."
            href="/people"
            linkLabel="모두 보기"
          />
          <div className="people-strip">
            {people.slice(0, 5).map((person) => (
              <article className="person-card" key={person.id}>
                <div className="person-image">
                  <Image src={person.portrait} alt={person.portraitAlt} fill sizes="(min-width: 900px) 20vw, 50vw" />
                </div>
                <p className="eyebrow">{person.field}</p>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section page-shell">
          <SectionHeader
            eyebrow="깊이 읽기"
            title="신앙과 문화 에세이"
            description="교회와 예술, 창작자의 소명, 문화신학을 긴 호흡으로 읽습니다."
            href="/essays/how-to-watch-nonchristian-film"
            linkLabel="대표 글 읽기"
          />
          <div className="essay-list">
            {essays.map((essay) => (
              <PostCard key={essay.slug} post={essay} variant="feature" />
            ))}
          </div>
        </section>

        <section className="content-section page-shell">
          <SectionHeader
            eyebrow="문화 가이드"
            title="교회 공동체가 바로 쓰는 자료"
            description="소그룹, 절기, 도시 산책, 창작자 디렉토리를 실제 모임에서 사용할 수 있게 정리합니다."
            href="/guides"
            linkLabel="가이드 보기"
          />
          <div className="guide-teasers">
            {guides.map((guide) => (
              <article className="guide-teaser" key={guide.slug}>
                <div>
                  <p className="eyebrow">{guide.season}</p>
                  <h3>{guide.title}</h3>
                  <p>{guide.summary}</p>
                </div>
                <span>{guide.estimatedTime}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="support-newsletter page-shell" id="support">
          <div className="support-panel">
            <p className="eyebrow">후원자 영역</p>
            <h2>문화 자료가 공동체 안에서 오래 쓰이도록 후원합니다.</h2>
            <p>
              {support.readingKit}, {support.salon}, {support.behindNotes}를 후원자에게 먼저
              전합니다.
            </p>
            <ul>
              {support.supporterBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
          <div className="newsletter-panel" id="newsletter">
            <p className="eyebrow">Newsletter</p>
            <h2>{newsletter.issueTitle}</h2>
            <p>{newsletter.deliveryNote}</p>
            <form className="newsletter-form">
              <label htmlFor="home-email">이메일</label>
              <div>
                <input id="home-email" name="email" type="email" placeholder="you@example.com" />
                <button type="submit">{newsletter.subscribeCta}</button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
