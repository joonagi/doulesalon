import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePostAction } from "@/app/admin/actions";
import { AdminPostForm } from "@/components/admin/AdminPostForm";
import { AdminState } from "@/components/admin/AdminState";
import { getAdminPost } from "@/lib/admin";

export const metadata: Metadata = {
  title: "글 수정 | DOULE SALON"
};

export const dynamic = "force-dynamic";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const { context, post } = await getAdminPost(id);

  if (context.status === "not_configured") {
    return <AdminState title="Supabase 설정이 필요합니다." description="관리자 글수정은 Supabase 연결 후 사용할 수 있습니다." />;
  }

  if (context.status === "forbidden") {
    return <AdminState title="관리자 권한이 없습니다." description="admin_profiles에 현재 사용자를 등록하세요." />;
  }

  if (!post) {
    notFound();
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div>
          <p className="eyebrow">Editor</p>
          <h1>글 수정</h1>
        </div>
        <div className="admin-topbar-actions">
          <Link className="button" href="/admin">
            목록으로
          </Link>
          <form action={deletePostAction}>
            <input name="id" type="hidden" value={post.id} />
            <button className="button danger-button" type="submit">
              삭제
            </button>
          </form>
        </div>
      </header>
      <AdminPostForm post={post} />
    </main>
  );
}
