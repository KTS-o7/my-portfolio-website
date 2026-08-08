import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import * as toml from "toml";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

export type BlogPostMeta = {
  section: string;
  slug: string;
  title: string;
  date: string | null;
  tags: string[];
  description: string;
};

export type BlogPost = BlogPostMeta & {
  html: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const SECTION_LABELS: Record<string, string> = {
  notes: "Notes",
  ml: "Machine Learning",
  systems: "Systems",
  infra: "Infra",
  math: "Math",
  research: "Research",
};

export const getSectionLabel = (section: string) =>
  SECTION_LABELS[section] ??
  section.charAt(0).toUpperCase() + section.slice(1);

const toDateString = (value: unknown): string | null => {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const toStringArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return [String(value)];
};

type RawFrontmatter = Record<string, unknown> & {
  title?: unknown;
  date?: unknown;
  tags?: unknown;
  keywords?: unknown;
  description?: unknown;
  draft?: unknown;
};

const parseFrontmatter = (raw: string): { data: RawFrontmatter; body: string } => {
  // Posts migrated from Hugo use TOML frontmatter (+++ delimiters).
  if (raw.trimStart().startsWith("+++")) {
    const parsed = matter(raw, {
      delimiters: "+++",
      language: "toml",
      engines: { toml: { parse: (input: string) => toml.parse(input) as object } },
    });
    return { data: parsed.data as RawFrontmatter, body: parsed.content };
  }
  const parsed = matter(raw);
  return { data: parsed.data as RawFrontmatter, body: parsed.content };
};

// Convert LaTeX \( ... \) and \[ ... \] delimiters (used by the Hugo
// passthrough setup) into $...$ / $$...$$ so remark-math can parse them.
const normalizeMathDelimiters = (markdown: string): string =>
  markdown
    .replace(/\\\[([\s\S]*?)\\\]/g, (_m, inner) => `$$${inner}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_m, inner) => `$${inner}$`);

const markdownToHtml = async (markdown: string): Promise<string> => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: { dark: "gruvbox-dark-medium", light: "gruvbox-light-medium" },
      keepBackground: false,
    })
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["heading-anchor"] },
    })
    .use(rehypeStringify)
    .process(normalizeMathDelimiters(markdown));
  return String(file);
};

const readSectionDirs = (): string[] => {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
};

const readPostMeta = (section: string, fileName: string): BlogPostMeta | null => {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, section, fileName), "utf8");
  const { data } = parseFrontmatter(raw);

  const draft = data.draft === true || data.draft === "true";
  if (draft) return null;

  return {
    section,
    slug,
    title: data.title ? String(data.title) : slug,
    date: toDateString(data.date),
    tags: toStringArray(data.tags ?? data.keywords),
    description: data.description ? String(data.description) : "",
  };
};

const byDateDesc = (a: BlogPostMeta, b: BlogPostMeta) => {
  const aTime = a.date ? new Date(a.date).getTime() : 0;
  const bTime = b.date ? new Date(b.date).getTime() : 0;
  return bTime - aTime;
};

export const getSections = cache((): string[] => readSectionDirs());

export const getAllPosts = cache((): BlogPostMeta[] => {
  const posts: BlogPostMeta[] = [];
  for (const section of readSectionDirs()) {
    const dir = path.join(BLOG_DIR, section);
    for (const fileName of fs.readdirSync(dir)) {
      if (!fileName.endsWith(".md") || fileName === "_index.md") continue;
      const meta = readPostMeta(section, fileName);
      if (meta) posts.push(meta);
    }
  }
  return posts.sort(byDateDesc);
});

export const getPostsBySection = cache((section: string): BlogPostMeta[] =>
  getAllPosts().filter((post) => post.section === section),
);

export const getPost = cache(
  async (section: string, slug: string): Promise<BlogPost | null> => {
    const filePath = path.join(BLOG_DIR, section, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, "utf8");
    const { data, body } = parseFrontmatter(raw);
    const draft = data.draft === true || data.draft === "true";
    if (draft) return null;

    const html = await markdownToHtml(body);
    return {
      section,
      slug,
      title: data.title ? String(data.title) : slug,
      date: toDateString(data.date),
      tags: toStringArray(data.tags ?? data.keywords),
      description: data.description ? String(data.description) : "",
      html,
    };
  },
);

export const getAllTags = cache((): string[] => {
  const tags = new Set<string>();
  for (const post of getAllPosts()) post.tags.forEach((tag) => tags.add(tag));
  return Array.from(tags).sort();
});

export const formatPostDate = (date: string | null): string => {
  if (!date) return "undated";
  return new Date(date).toISOString().slice(0, 10);
};
