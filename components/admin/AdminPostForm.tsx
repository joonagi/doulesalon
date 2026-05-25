"use client";

import type { CSSProperties } from "react";
import { useActionState, useMemo, useState } from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { savePostAction, type AdminActionState } from "@/app/admin/actions";
import { CATEGORY_META, POST_CATEGORIES, type PostCategory } from "@/lib/categories";
import type { PublicPost } from "@/lib/posts";

type AdminPostFormProps = {
  post?: PublicPost;
};

const initialState: AdminActionState = {
  ok: false,
  message: ""
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function datetimeLocalValue(date?: string) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().slice(0, 16);
}

export function AdminPostForm({ post }: AdminPostFormProps) {
  const [state, formAction, pending] = useActionState(savePostAction, initialState);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [category, setCategory] = useState<PostCategory>(post?.category ?? "film");
  const defaultPublishedAt = useMemo(() => datetimeLocalValue(post?.publishedAt), [post?.publishedAt]);

  return (
    <form className="admin-form post-editor-form" action={formAction}>
      <input name="id" type="hidden" value={post?.id ?? ""} />
      <input name="existing_hero_image_url" type="hidden" value={post?.heroImageUrl ?? ""} />

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <p className="eyebrow">카테고리</p>
          <h2>메인 카드 색상과 아이콘</h2>
        </div>
        <div className="category-segmented" role="radiogroup" aria-label="글 카테고리">
          {POST_CATEGORIES.map((item) => {
            const meta = CATEGORY_META[item];

            return (
              <label
                className={category === item ? "category-option is-selected" : "category-option"}
                key={item}
                style={{ "--category-color": meta.color, "--category-soft-color": meta.softColor } as CSSProperties}
              >
                <input
                  checked={category === item}
                  name="category"
                  onChange={() => setCategory(item)}
                  type="radio"
                  value={item}
                />
                <CategoryBadge category={item} />
              </label>
            );
          })}
        </div>
      </section>

      <section className="admin-panel">
        <div className="form-grid">
          <label>
            제목
            <input
              name="title"
              onChange={(event) => {
                const nextTitle = event.target.value;
                setTitle(nextTitle);

                if (!post && (!slug || slug === slugify(title))) {
                  setSlug(slugify(nextTitle));
                }
              }}
              required
              value={title}
            />
          </label>
          <label>
            Slug
            <input
              name="slug"
              onChange={(event) => setSlug(slugify(event.target.value))}
              required
              value={slug}
            />
          </label>
          <label>
            부제
            <input name="subtitle" defaultValue={post?.subtitle ?? ""} />
          </label>
          <label>
            작성자명
            <input name="author_name" defaultValue={post?.authorName ?? "둘레살롱 편집부"} />
          </label>
        </div>

        <label>
          요약
          <textarea name="excerpt" required rows={3} defaultValue={post?.excerpt ?? ""} />
        </label>

        <label>
          본문 Markdown
          <textarea name="body_markdown" required rows={14} defaultValue={post?.bodyMarkdown ?? ""} />
        </label>
      </section>

      <section className="admin-panel">
        <div className="form-grid">
          <label>
            대표 이미지
            <input name="hero_image_file" type="file" accept="image/*" />
          </label>
          <label>
            이미지 캡션
            <input name="caption" defaultValue={post?.caption ?? ""} />
          </label>
          <label>
            발행일
            <input name="published_at" type="datetime-local" defaultValue={defaultPublishedAt} />
          </label>
          <label>
            메인 노출 순서
            <input name="featured_rank" type="number" min="1" defaultValue={post?.featuredRank ?? 999} />
          </label>
        </div>
        <label className="checkbox-row">
          <input name="featured" type="checkbox" defaultChecked={post?.featured ?? false} />
          홈 메인에 노출
        </label>
      </section>

      {state.message ? <p className="form-message">{state.message}</p> : null}

      <div className="editor-actions">
        <button className="button" name="status" value="draft" type="submit" disabled={pending}>
          임시저장
        </button>
        <button className="button button-primary" name="status" value="published" type="submit" disabled={pending}>
          발행
        </button>
      </div>
    </form>
  );
}
