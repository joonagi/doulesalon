import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { contents, getContentHref, people } from "@/lib/content";

export const metadata: Metadata = {
  title: "만난 사람들 | DOULE SALON",
  description: "기독 창작자, 편집자, 큐레이터, 음악가를 축적하는 사람 중심 아카이브"
};

const fields = ["Film", "Art", "Music", "Books", "People"];
const toFieldId = (field: string) => `field-${field.toLowerCase().replaceAll(" ", "-")}`;

export default function PeoplePage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell directory-page">
        <header className="directory-hero">
          <p className="eyebrow">창작자 아카이브</p>
          <h1>만난 사람들</h1>
          <p>
            작품만 소개하지 않고, 믿음을 가지고 만들고 버티고 질문하는 사람들을
            분야와 직업, 대표 질문으로 탐색합니다.
          </p>
          <div className="filter-row" aria-label="분야별 필터">
            {fields.map((field) => (
              <a key={field} href={`#${toFieldId(field)}`}>
                {field}
              </a>
            ))}
          </div>
        </header>

        <div className="people-field-list" aria-label="창작자 목록">
          {fields.map((field) => {
            const fieldPeople = people.filter((person) => person.field === field);

            if (fieldPeople.length === 0) {
              return null;
            }

            return (
              <section className="people-field-group" id={toFieldId(field)} key={field}>
                <h2>{field}</h2>
                <div className="people-directory">
                  {fieldPeople.map((person) => {
                    const interviews = contents.filter((content) => person.interviewIds.includes(content.slug));

                    return (
                      <article className="person-directory-card" key={person.id}>
                        <div className="person-directory-image">
                          <Image
                            src={person.portrait}
                            alt={person.portraitAlt}
                            fill
                            sizes="(min-width: 900px) 260px, 100vw"
                          />
                        </div>
                        <div>
                          <p className="eyebrow">{person.field}</p>
                          <h3>{person.name}</h3>
                          <p className="guest-role">{person.role}</p>
                          <p>{person.bio}</p>
                          <blockquote>{person.signatureQuestion}</blockquote>
                          <div className="mini-list">
                            <h4>추천 작품</h4>
                            <ul>
                              {person.recommendedWorks.map((work) => (
                                <li key={work}>{work}</li>
                              ))}
                            </ul>
                          </div>
                          {interviews.length > 0 ? (
                            <div className="mini-list">
                              <h4>관련 인터뷰</h4>
                              {interviews.map((interview) => (
                                <Link key={interview.slug} className="text-link" href={getContentHref(interview)}>
                                  {interview.title}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <p className="archive-note">인터뷰 준비 중</p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
