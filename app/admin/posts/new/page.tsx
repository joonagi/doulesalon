import type { Metadata } from "next";
import Link from "next/link";
import { AdminPostForm } from "@/components/admin/AdminPostForm";
import { AdminState } from "@/components/admin/AdminState";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "새 글 작성 | DOULE SALON"
};

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const context = await requireAdmin();

  if (context.status === "not_configured") {
    return (
      <AdminState
        title="Supabase 설정이 필요합니다."
        description="관리자 글쓰기를 사용하려면 Supabase 환경변수와 DB migration을 먼저 적용하세요."
      />
    );
  }

  if (context.status === "forbidden") {
    return <AdminState title="관리자 권한이 없습니다." description="admin_profiles에 현재 사용자를 등록하세요." />;
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div>
          <p className="eyebrow">Editor</p>
          <h1>새 글 작성</h1>
        </div>
        <Link className="button" href="/admin">
          목록으로
        </Link>
      </header>
      <AdminPostForm />
    </main>
  );
}
