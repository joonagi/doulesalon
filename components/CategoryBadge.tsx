import type { CSSProperties } from "react";
import type { PostCategory } from "@/lib/categories";
import { getCategoryMeta } from "@/lib/categories";

type CategoryBadgeProps = {
  category: PostCategory;
  className?: string;
};

export function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  const meta = getCategoryMeta(category);
  const Icon = meta.icon;

  return (
    <span
      className={`category-badge ${className}`}
      style={
        {
          "--category-color": meta.color,
          "--category-soft-color": meta.softColor
        } as CSSProperties
      }
    >
      <Icon aria-hidden="true" size={15} strokeWidth={2.4} />
      <span>{meta.label}</span>
    </span>
  );
}
