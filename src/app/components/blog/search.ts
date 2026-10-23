import type { PostSummary } from "@/lib/blog";

// Every whitespace-separated term must appear somewhere in the title, description,
// date, hub or tags. "kv cache" finds posts with both words; "2025" finds that year.
export const matchPosts = (posts: PostSummary[], query: string): PostSummary[] => {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return posts;
  return posts.filter((post) => {
    const haystack = [post.title, post.description, post.date, post.sectionLabel, ...post.tags]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
};

export const postHref = (post: Pick<PostSummary, "section" | "slug">) =>
  `/blog/${post.section}/${post.slug}`;

export const resultsLabel = (count: number) => `${count} result${count === 1 ? "" : "s"}`;
