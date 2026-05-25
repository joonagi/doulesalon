"use client";

import type { CSSProperties } from "react";
import { useActionState, useMemo, useRef, useState } from "react";
import { Bold, Heading2, Italic, LinkIcon, List, Palette, Quote, Type, Video } from "lucide-react";
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

type FontChoice = "sans" | "serif" | "mono";

const fontOptions: Array<{ label: string; value: FontChoice }> = [
  { label: "본문", value: "sans" },
  { label: "명조", value: "serif" },
  { label: "고정폭", value: "mono" }
];

export function AdminPostForm({ post }: AdminPostFormProps) {
  const [state, formAction, pending] = useActionState(savePostAction, initialState);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [category, setCategory] = useState<PostCategory>(post?.category ?? "film");
  const [bodyMarkdown, setBodyMarkdown] = useState(post?.bodyMarkdown ?? "");
  const [color, setColor] = useState("#6B2A2A");
  const [font, setFont] = useState<FontChoice>("serif");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const defaultPublishedAt = useMemo(() => datetimeLocalValue(post?.publishedAt), [post?.publishedAt]);

  function updateBody(nextValue: string, selectionStart?: number, selectionEnd?: number) {
    setBodyMarkdown(nextValue);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();

      if (typeof selectionStart === "number" && typeof selectionEnd === "number") {
        textareaRef.current?.setSelectionRange(selectionStart, selectionEnd);
      }
    });
  }

  function selectedRange() {
    const textarea = textareaRef.current;

    return {
      start: textarea?.selectionStart ?? bodyMarkdown.length,
      end: textarea?.selectionEnd ?? bodyMarkdown.length
    };
  }

  function wrapSelection(before: string, after: string, placeholder: string) {
    const { start, end } = selectedRange();
    const selectedText = bodyMarkdown.slice(start, end) || placeholder;
    const nextValue = `${bodyMarkdown.slice(0, start)}${before}${selectedText}${after}${bodyMarkdown.slice(end)}`;
    const cursorStart = start + before.length;
    const cursorEnd = cursorStart + selectedText.length;

    updateBody(nextValue, cursorStart, cursorEnd);
  }

  function prefixSelection(prefix: string, placeholder: string) {
    const { start, end } = selectedRange();
    const selectedText = bodyMarkdown.slice(start, end) || placeholder;
    const prefixed = selectedText
      .split("\n")
      .map((line) => `${prefix}${line}`)
      .join("\n");
    const nextValue = `${bodyMarkdown.slice(0, start)}${prefixed}${bodyMarkdown.slice(end)}`;

    updateBody(nextValue, start, start + prefixed.length);
  }

  function insertBlock(block: string) {
    const trimmed = bodyMarkdown.trimEnd();
    const separator = trimmed ? "\n\n" : "";
    const nextValue = `${trimmed}${separator}${block}\n\n`;

    updateBody(nextValue, nextValue.length, nextValue.length);
  }

  function insertLink() {
    const href = window.prompt("링크 주소를 입력하세요.", "https://");

    if (!href) {
      return;
    }

    wrapSelection("[", `](${href})`, "링크 텍스트");
  }

  function insertYoutube() {
    const url = youtubeUrl.trim() || window.prompt("유튜브 URL을 입력하세요.", "https://www.youtube.com/watch?v=");

    if (!url) {
      return;
    }

    insertBlock(`::youtube[${url}]`);
    setYoutubeUrl("");
  }

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

        <div className="editor-field">
          <span className="editor-label" id="body-markdown-label">
            본문 Markdown
          </span>
          <div className="markdown-editor">
            <div className="markdown-toolbar" aria-label="본문 서식 도구">
              <button type="button" onClick={() => wrapSelection("**", "**", "굵게 표시할 문장")} title="굵게">
                <Bold size={17} />
                <span>Bold</span>
              </button>
              <button type="button" onClick={() => wrapSelection("*", "*", "기울임 문장")} title="이탤릭">
                <Italic size={17} />
                <span>Italic</span>
              </button>
              <button type="button" onClick={() => prefixSelection("## ", "소제목")} title="소제목">
                <Heading2 size={17} />
                <span>제목</span>
              </button>
              <button type="button" onClick={() => prefixSelection("> ", "인용문")} title="인용">
                <Quote size={17} />
                <span>인용</span>
              </button>
              <button type="button" onClick={() => prefixSelection("- ", "목록 항목")} title="목록">
                <List size={17} />
                <span>목록</span>
              </button>
              <button type="button" onClick={insertLink} title="링크">
                <LinkIcon size={17} />
                <span>링크</span>
              </button>
              <select
                aria-label="폰트 선택"
                className="editor-select"
                onChange={(event) => setFont(event.target.value as FontChoice)}
                value={font}
              >
                {fontOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => wrapSelection(`{{font:${font}|`, "}}", "폰트를 적용할 문장")}
                title="폰트 적용"
              >
                <Type size={17} />
                <span>폰트</span>
              </button>
              <input
                aria-label="글자 색상 선택"
                className="editor-color"
                onChange={(event) => setColor(event.target.value)}
                type="color"
                value={color}
              />
              <button
                type="button"
                onClick={() => wrapSelection(`{{color:${color}|`, "}}", "색상을 적용할 문장")}
                title="색상 적용"
              >
                <Palette size={17} />
                <span>색상</span>
              </button>
            </div>
            <div className="youtube-insert-row">
              <Video size={20} />
              <input
                aria-label="유튜브 URL"
                onChange={(event) => setYoutubeUrl(event.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                type="url"
                value={youtubeUrl}
              />
              <button className="button" type="button" onClick={insertYoutube}>
                유튜브 넣기
              </button>
            </div>
            <textarea
              aria-labelledby="body-markdown-label"
              name="body_markdown"
              onChange={(event) => setBodyMarkdown(event.target.value)}
              ref={textareaRef}
              required
              rows={16}
              value={bodyMarkdown}
            />
          </div>
        </div>
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
