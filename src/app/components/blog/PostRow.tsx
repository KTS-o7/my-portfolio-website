import Link from "next/link";
import type { BlogPostSummary } from "./BlogIndex";

export default function PostRow({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={`/blog/${post.section}/${post.slug}`}
      className="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-1 border-t border-border py-5 last:border-b"
    >
      <span className="font-mono text-xs text-text-tertiary">
        {post.dateLabel}
      </span>
      <span className="min-w-0">
        <span className="block text-base sm:text-lg font-semibold tracking-tight text-text-primary transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary">
          {post.title}
        </span>
        {post.description && (
          <span className="mt-1 block text-sm text-text-secondary truncate">
            {post.description}
          </span>
        )}
      </span>
      <span className="hidden sm:block font-mono text-xs text-text-tertiary transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
