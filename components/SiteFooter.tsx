import Link from "next/link";

const topics = [
  { label: "Film", href: "/#film" },
  { label: "Art", href: "/#art" },
  { label: "Music", href: "/#music" },
  { label: "Books", href: "/#books" },
  { label: "Church & Culture", href: "/essays/how-to-watch-nonchristian-film" },
  { label: "People", href: "/people" }
];

const formats = [
  { label: "Interviews", href: "/interviews/waiting-face-film" },
  { label: "Essays", href: "/essays/how-to-watch-nonchristian-film" },
  { label: "Reviews", href: "/essays/gallery-five-this-week" },
  { label: "Guides", href: "/guides" },
  { label: "Playlists", href: "/newsletter" },
  { label: "Events", href: "/#briefing" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Podcast", href: "/interviews/songs-outside-worship" }
];

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer-search">
      <div className="footer-brand">
        <Link className="footer-logo" href="/">
          DOULE SALON
        </Link>
        <p>Read slowly. Gather warmly. 둘레살롱은 신앙으로 문화를 읽는 편집실입니다.</p>
      </div>

      <div className="footer-columns">
        <div>
          <h2>분야별 탐색</h2>
          <ul>
            {topics.map((topic) => (
              <li key={topic.label}>
                <Link href={topic.href}>{topic.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>포맷별 탐색</h2>
          <ul>
            {formats.map((format) => (
              <li key={format.label}>
                <Link href={format.href}>{format.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>소개</h2>
          <ul>
            <li>
              <Link href="/people">만난 사람들</Link>
            </li>
            <li>
              <Link href="/guides">문화 가이드</Link>
            </li>
            <li>
              <Link href="/newsletter">뉴스레터</Link>
            </li>
            <li>
              <Link href="/#support">후원</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>제보와 문의</h2>
          <p>
            인터뷰하고 싶은 창작자, 함께 읽고 싶은 작품, 교회에서 필요한
            문화 자료를 보내주세요.
          </p>
          <a className="text-link" href="mailto:editor@doulesalon.com">
            editor@doulesalon.com
          </a>
        </div>
      </div>
    </footer>
  );
}
