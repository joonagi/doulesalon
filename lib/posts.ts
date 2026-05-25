import { contents, type ContentCategory } from "@/lib/content";
import { type PostCategory, isPostCategory } from "@/lib/categories";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export type PostStatus = "draft" | "published";

export type DbPost = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  body_markdown: string;
  category: PostCategory;
  status: PostStatus;
  hero_image_url: string | null;
  caption: string | null;
  author_name: string | null;
  published_at: string | null;
  featured: boolean;
  featured_rank: number | null;
  created_at: string;
  updated_at: string;
};

export type PublicPost = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  bodyMarkdown: string;
  category: PostCategory;
  status: PostStatus;
  heroImageUrl: string;
  imageAlt: string;
  caption: string;
  authorName: string;
  publishedAt: string;
  featured: boolean;
  featuredRank: number;
  createdAt: string;
  updatedAt: string;
};

export const FALLBACK_POST_IMAGE =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80";

function mapLegacyCategory(category: ContentCategory): PostCategory {
  if (category === "Music") {
    return "music";
  }

  if (category === "Art") {
    return "art";
  }

  if (category === "Books" || category === "Thought") {
    return "books";
  }

  return "film";
}

function normalizeCategory(category: string): PostCategory {
  return isPostCategory(category) ? category : "film";
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(date));
}

export function postHref(post: Pick<PublicPost, "slug">) {
  return `/posts/${post.slug}`;
}

export function estimateReadTime(bodyMarkdown: string) {
  const normalized = bodyMarkdown.replace(/\s+/g, "");
  const minutes = Math.max(4, Math.ceil(normalized.length / 650));
  return `${minutes}분 읽기`;
}

export function markdownToParagraphs(bodyMarkdown: string) {
  return bodyMarkdown
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function dbPostToPublicPost(post: DbPost): PublicPost {
  const date = post.published_at ?? post.created_at;

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle ?? "",
    excerpt: post.excerpt,
    bodyMarkdown: post.body_markdown,
    category: normalizeCategory(post.category),
    status: post.status,
    heroImageUrl: post.hero_image_url ?? FALLBACK_POST_IMAGE,
    imageAlt: post.title,
    caption: post.caption ?? "둘레살롱 편집실이 고른 이번 주의 장면.",
    authorName: post.author_name ?? "둘레살롱 편집부",
    publishedAt: date,
    featured: post.featured,
    featuredRank: post.featured_rank ?? 999,
    createdAt: post.created_at,
    updatedAt: post.updated_at
  };
}

export const seedPosts: PublicPost[] = contents.map((content, index) => {
  const bodyMarkdown = content.body.join("\n\n");

  return {
    id: `seed-${content.slug}`,
    slug: content.slug,
    title: content.title,
    subtitle: content.subtitle,
    excerpt: content.summary,
    bodyMarkdown,
    category: mapLegacyCategory(content.category),
    status: "published",
    heroImageUrl: content.heroImage,
    imageAlt: content.imageAlt,
    caption: content.caption,
    authorName: content.author,
    publishedAt: content.publishedAt,
    featured: index === 0,
    featuredRank: index + 1,
    createdAt: content.publishedAt,
    updatedAt: content.publishedAt
  };
});

export async function getPublishedPosts() {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return seedPosts;
  }

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, slug, title, subtitle, excerpt, body_markdown, category, status, hero_image_url, caption, author_name, published_at, featured, featured_rank, created_at, updated_at"
    )
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("featured_rank", { ascending: true, nullsFirst: false })
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return seedPosts;
  }

  return (data as DbPost[]).map(dbPostToPublicPost);
}

export async function getPublishedPostBySlug(slug: string) {
  const supabase = createSupabasePublicClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, slug, title, subtitle, excerpt, body_markdown, category, status, hero_image_url, caption, author_name, published_at, featured, featured_rank, created_at, updated_at"
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!error && data) {
      return dbPostToPublicPost(data as DbPost);
    }
  }

  return seedPosts.find((post) => post.slug === slug);
}
