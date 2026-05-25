import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "관리자 로그인 | DOULE SALON"
};

export default function AdminLoginPage() {
  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <p className="eyebrow">DOULE SALON Admin</p>
        <h1>관리자 로그인</h1>
        <p>Supabase에서 생성한 관리자 계정으로 로그인합니다. 공개 회원가입은 제공하지 않습니다.</p>
        {!isSupabaseConfigured() ? (
          <p className="setup-warning">
            `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`를 설정해야 로그인할 수 있습니다.
          </p>
        ) : null}
        <LoginForm />
        <Link className="text-link" href="/">
          사이트로 돌아가기
        </Link>
      </section>
    </main>
  );
}
