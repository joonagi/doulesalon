import type { LucideIcon } from "lucide-react";
import { BookOpen, Clapperboard, Music, Palette } from "lucide-react";

export const POST_CATEGORIES = ["film", "music", "art", "books"] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

export type CategoryMeta = {
  label: string;
  shortLabel: string;
  color: string;
  softColor: string;
  icon: LucideIcon;
};

export const CATEGORY_META: Record<PostCategory, CategoryMeta> = {
  film: {
    label: "영화",
    shortLabel: "Film",
    color: "#6B2A2A",
    softColor: "#F0D9D4",
    icon: Clapperboard
  },
  music: {
    label: "음악",
    shortLabel: "Music",
    color: "#1F3A2E",
    softColor: "#DBE5D6",
    icon: Music
  },
  art: {
    label: "미술/아트",
    shortLabel: "Art",
    color: "#C79A2B",
    softColor: "#F0E3B8",
    icon: Palette
  },
  books: {
    label: "도서",
    shortLabel: "Books",
    color: "#3D4A7A",
    softColor: "#DDE2F1",
    icon: BookOpen
  }
};

export function isPostCategory(value: string): value is PostCategory {
  return POST_CATEGORIES.includes(value as PostCategory);
}

export function getCategoryMeta(category: PostCategory) {
  return CATEGORY_META[category];
}
