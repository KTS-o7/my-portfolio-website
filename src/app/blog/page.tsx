import type { Metadata } from "next";
import WritingIndex from "@/app/components/blog/WritingIndex";
import {
  getAllPosts,
  getPostsBySection,
  getSectionLabel,
  getSections,
  toSummary,
} from "@/lib/blog";
import { buildPageMetadata } from "@/lib/metadata";

const INTRO =
  "Notes and longer pieces on ML systems, distributed systems, and infrastructure.";

export const metadata: Metadata = buildPageMetadata({
  title: "Writing",
  description:
    "Writing on machine learning, distributed systems, infrastructure, security, and engineering notes.",
  path: "/blog",
});

const RECENT_COUNT = 5;
const PER_HUB = 4;

export default function BlogIndexPage() {
  // Hubs come newest-post first (getSections); posts inside a hub are newest first.
  const hubs = getSections().map((section) => {
    const posts = getPostsBySection(section);
    return {
      section,
      label: getSectionLabel(section),
      total: posts.length,
      top: posts.slice(0, PER_HUB).map(toSummary),
    };
  });
  const allPosts = getAllPosts().map(toSummary);

  return (
    <div className="pb-24 m:pb-12">
      <WritingIndex
        intro={INTRO}
        recent={allPosts.slice(0, RECENT_COUNT)}
        hubs={hubs}
        allPosts={allPosts}
      />
    </div>
  );
}
