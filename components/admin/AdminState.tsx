import Link from "next/link";

type AdminStateProps = {
  title: string;
  description: string;
};

export function AdminState({ title, description }: AdminStateProps) {
  return (
    <main className="admin-shell">
      <section className="admin-empty-state">
        <p className="eyebrow">Admin</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="button-row">
          <Link className="button" href="/">
            홈으로
          </Link>
          <Link className="button button-primary" href="/admin/login">
            로그인으로
          </Link>
        </div>
      </section>
    </main>
  );
}
