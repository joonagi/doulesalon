import type { Metadata } from "next";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { AdminState } from "@/components/admin/AdminState";
import { CategoryBadge } from "@/components/CategoryBadge";
import { formatDate, postHref } from "@/lib/posts";
import { getAdminPosts } from "@/lib/admin";

export const metadata: Metadata = {
  title: "관리자 | DOULE SALON"
};

type AdminPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { status } = await searchParams;
  const { context, posts } = await getAdminPosts(status);

  if (context.status === "not_configured") {
    return (
      <AdminState
        title="Supabase 설정이 필요합니다."
        description=".env.local에 Supabase URL과 publishable key를 추가하고, supabase/migrations의 SQL을 적용하세요."
      />
    );
  }

  if (context.status === "forbidden") {
    return <AdminState title="관리자 권한이 없습니다." description="admin_profiles 테이블에 이 사용자를 관리자 계정으로 등록해야 합니다." />;
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>글 관리</h1>
        </div>
        <div className="admin-topbar-actions">
          <Link className="button" href="/">
            사이트 보기
          </Link>
          <Link className="button button-primary" href="/admin/posts/new">
            새 글 작성
          </Link>
          <form action={logoutAction}>
            <button className="button" type="submit">
              로그아웃
            </button>
          </form>
        </div>
      </header>

      <nav className="admin-filter" aria-label="글 상태 필터">
        <Link className={!status ? "is-active" : ""} href="/admin">
          전체
        </Link>
        <Link className={status === "published" ? "is-active" : ""} href="/admin?status=published">
          발행
        </Link>
        <Link className={status === "draft" ? "is-active" : ""} href="/admin?status=draft">
          임시저장
        </Link>
      </nav>

      <section className="admin-table" aria-label="글 목록">
        {posts.length === 0 ? (
          <div className="admin-empty-state">
            <h2>아직 글이 없습니다.</h2>
            <p>첫 글을 작성하면 홈 메인과 카테고리 카드에 바로 연결됩니다.</p>
          </div>
        ) : (
          posts.map((post) => (
            <article className="admin-row" key={post.id}>
              <div>
                <CategoryBadge category={post.category} />
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </div>
              <div className="admin-row-meta">
                <span>{post.status === "published" ? "발행" : "임시저장"}</span>
                <span>{formatDate(post.publishedAt)}</span>
                <Link className="text-link" href={`/admin/posts/${post.id}`}>
                  수정
                </Link>
                {post.status === "published" ? (
                  <Link className="text-link" href={postHref(post)}>
                    보기
                  </Link>
                ) : null}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
