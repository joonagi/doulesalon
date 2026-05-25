"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isPostCategory, type PostCategory } from "@/lib/categories";
import { getAdminContext } from "@/lib/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminActionState = {
  ok: boolean;
  message: string;
};

const defaultError: AdminActionState = {
  ok: false,
  message: "요청을 처리하지 못했습니다."
};

function value(formData: FormData, key: string) {
  const field = formData.get(key);
  return typeof field === "string" ? field.trim() : "";
}

function parseCategory(raw: string): PostCategory | null {
  return isPostCategory(raw) ? raw : null;
}

async function uploadHeroImage(formData: FormData, existingUrl: string) {
  const context = await getAdminContext();

  if (context.status !== "ok") {
    return existingUrl;
  }

  const file = formData.get("hero_image_file");

  if (!(file instanceof File) || file.size === 0) {
    return existingUrl;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("대표 이미지는 이미지 파일만 업로드할 수 있습니다.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `posts/${crypto.randomUUID()}.${extension}`;
  const { error } = await context.supabase.storage.from("post-assets").upload(path, file, {
    cacheControl: "31536000",
    upsert: false
  });

  if (error) {
    throw new Error(`이미지 업로드 실패: ${error.message}`);
  }

  const { data } = context.supabase.storage.from("post-assets").getPublicUrl(path);
  return data.publicUrl;
}

export async function loginAction(_prevState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const email = value(formData, "email");
  const password = value(formData, "password");

  if (!email || !password) {
    return { ok: false, message: "이메일과 비밀번호를 모두 입력하세요." };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase 환경변수가 설정되지 않았습니다."
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

export async function savePostAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const context = await getAdminContext();

  if (context.status !== "ok") {
    return { ok: false, message: "관리자 권한이 필요합니다." };
  }

  const id = value(formData, "id");
  const title = value(formData, "title");
  const slug = value(formData, "slug");
  const subtitle = value(formData, "subtitle");
  const excerpt = value(formData, "excerpt");
  const bodyMarkdown = value(formData, "body_markdown");
  const category = parseCategory(value(formData, "category"));
  const status = value(formData, "status") === "published" ? "published" : "draft";
  const caption = value(formData, "caption");
  const authorName = value(formData, "author_name") || context.profile.display_name || "둘레살롱 편집부";
  const publishedAt = value(formData, "published_at");
  const existingHeroImageUrl = value(formData, "existing_hero_image_url");
  const featured = value(formData, "featured") === "on";
  const featuredRank = Number(value(formData, "featured_rank") || "999");

  if (!title || !slug || !excerpt || !bodyMarkdown || !category) {
    return {
      ok: false,
      message: "제목, slug, 요약, 본문, 카테고리는 필수입니다."
    };
  }

  try {
    const heroImageUrl = await uploadHeroImage(formData, existingHeroImageUrl);
    const payload = {
      slug,
      title,
      subtitle: subtitle || null,
      excerpt,
      body_markdown: bodyMarkdown,
      category,
      status,
      hero_image_url: heroImageUrl || null,
      caption: caption || null,
      author_name: authorName,
      published_at: status === "published" ? publishedAt || new Date().toISOString() : publishedAt || null,
      featured,
      featured_rank: Number.isFinite(featuredRank) ? featuredRank : 999,
      author_id: context.user.id
    };

    const query = id
      ? context.supabase.from("posts").update(payload).eq("id", id)
      : context.supabase.from("posts").insert(payload);

    const { error } = await query;

    if (error) {
      return { ok: false, message: error.message };
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : defaultError.message
    };
  }

  revalidatePath("/");
  revalidatePath("/posts/[slug]", "page");
  redirect("/admin");
}

export async function deletePostAction(formData: FormData) {
  const context = await getAdminContext();

  if (context.status !== "ok") {
    redirect("/admin/login");
  }

  const id = value(formData, "id");

  if (id) {
    await context.supabase.from("posts").delete().eq("id", id);
  }

  revalidatePath("/");
  redirect("/admin");
}
