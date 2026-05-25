import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found page-shell">
      <p className="eyebrow">404</p>
      <h1>아직 편집실에 도착하지 않은 페이지입니다.</h1>
      <p>
        찾으시는 콘텐츠가 이동되었거나 준비 중입니다. 홈에서 이번 주의
        인터뷰와 문화 브리핑을 다시 살펴보세요.
      </p>
      <Link className="button button-primary" href="/">
        홈으로 돌아가기
      </Link>
    </main>
  );
}
