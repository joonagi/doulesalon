import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { dbPostToPublicPost, type DbPost } from "@/lib/posts";

export type AdminProfile = {
  user_id: string;
  email: string;
  display_name: string | null;
  role: "admin" | "editor";
};

export type AdminContext =
  | { status: "not_configured" }
  | { status: "unauthenticated" }
  | { status: "forbidden"; user: User }
  | { status: "ok"; user: User; profile: AdminProfile; supabase: SupabaseClient };

export async function getAdminContext(): Promise<AdminContext> {
  if (!isSupabaseConfigured()) {
    return { status: "not_configured" };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { status: "not_configured" };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "unauthenticated" };
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("user_id, email, display_name, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return { status: "forbidden", user };
  }

  return {
    status: "ok",
    user,
    profile: profile as AdminProfile,
    supabase
  };
}

export async function requireAdmin() {
  const context = await getAdminContext();

  if (context.status === "unauthenticated") {
    redirect("/admin/login");
  }

  return context;
}

export async function getAdminPosts(status?: string) {
  const context = await requireAdmin();

  if (context.status !== "ok") {
    return { context, posts: [] };
  }

  let query = context.supabase
    .from("posts")
    .select(
      "id, slug, title, subtitle, excerpt, body_markdown, category, status, hero_image_url, caption, author_name, published_at, featured, featured_rank, created_at, updated_at"
    )
    .order("updated_at", { ascending: false });

  if (status === "draft" || status === "published") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error || !data) {
    return { context, posts: [] };
  }

  return {
    context,
    posts: (data as DbPost[]).map(dbPostToPublicPost)
  };
}

export async function getAdminPost(id: string) {
  const context = await requireAdmin();

  if (context.status !== "ok") {
    return { context, post: null };
  }

  const { data, error } = await context.supabase
    .from("posts")
    .select(
      "id, slug, title, subtitle, excerpt, body_markdown, category, status, hero_image_url, caption, author_name, published_at, featured, featured_rank, created_at, updated_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return { context, post: null };
  }

  return {
    context,
    post: dbPostToPublicPost(data as DbPost)
  };
}
