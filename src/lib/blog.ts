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
import hubsData from "@/data/hubs.json";

export type BlogPostMeta = {
  section: string;
  slug: string;
  title: string;
  date: string | null;
  /** Last substantive edit (frontmatter `lastmod`); null when never updated. */
  lastmod: string | null;
  tags: string[];
  description: string;
  /** Posts that read as a sequence share a `series` name and a `series_part` order. */
  series: string | null;
  seriesPart: number | null;
  words: number;
  readMin: number;
};

export type TocItem = { id: string; text: string };

export type BlogPost = BlogPostMeta & {
  html: string;
  toc: TocItem[];
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const SECTION_LABELS: Record<string, string> = {
  notes: "Notes",
  ml: "Machine Learning",
  systems: "Systems",
  infra: "Infra",
  security: "Security",
  math: "Math",
  research: "Research",
};

export const getSectionLabel = (section: string) =>
  SECTION_LABELS[section] ??
  section.charAt(0).toUpperCase() + section.slice(1);

type Hub = { section: string; intro: string; description: string; searchHint: string };

export const getHub = (section: string): Hub | undefined =>
  (hubsData.hubs as Hub[]).find((hub) => hub.section === section);

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
  lastmod?: unknown;
  tags?: unknown;
  keywords?: unknown;
  description?: unknown;
  draft?: unknown;
  series?: unknown;
  series_part?: unknown;
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

// Reading time at 230 words a minute, counting code and prose alike.
const WORDS_PER_MINUTE = 230;
const countWords = (body: string) => body.split(/\s+/).filter(Boolean).length;

const toMeta = (
  section: string,
  slug: string,
  data: RawFrontmatter,
  body: string,
): BlogPostMeta => {
  const date = toDateString(data.date);
  const lastmod = toDateString(data.lastmod);
  const words = countWords(body);
  const seriesPart = Number(data.series_part);
  return {
    section,
    slug,
    title: data.title ? String(data.title).trim() : slug,
    date,
    // An "updated" date equal to the publish date says nothing; drop it.
    lastmod: lastmod && lastmod !== date ? lastmod : null,
    tags: toStringArray(data.tags ?? data.keywords),
    description: data.description ? String(data.description) : "",
    series: data.series ? String(data.series) : null,
    seriesPart: Number.isFinite(seriesPart) ? seriesPart : null,
    words,
    readMin: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  };
};

// Convert LaTeX \( ... \) and \[ ... \] delimiters (used by the Hugo
// passthrough setup) into $...$ / $$...$$ so remark-math can parse them.
const normalizeMathDelimiters = (markdown: string): string =>
  markdown
    .replace(/\\\[([\s\S]*?)\\\]/g, (_m, inner) => `$$${inner}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_m, inner) => `$${inner}$`);

const WHITEBOARD_DIR = path.join(process.cwd(), "public", "whiteboards");

type MdNode = {
  type: string;
  lang?: string | null;
  value?: string;
  children?: MdNode[];
  data?: Record<string, unknown>;
};

const readBoardTitle = (file: string) =>
  fs.readFileSync(file, "utf8").match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ||
  "Whiteboard";

// A ```whiteboard fence names an animated board in public/whiteboards/<name>.html
// (built with the whiteboard-html skill, sources in /whiteboards). An optional second
// line is the figure caption. It renders as a sandboxed iframe in the notebook skin,
// with an "open full screen" link for phones; WhiteboardEnhancer syncs the theme,
// sizes the frame and upgrades the link to real full screen.
const remarkWhiteboards = () => (tree: MdNode) => {
  const walk = (node: MdNode) => {
    node.children?.forEach((child, i) => {
      if (child.type !== "code" || child.lang !== "whiteboard") {
        walk(child);
        return;
      }
      const [name = "", ...rest] = (child.value ?? "").trim().split("\n");
      const file = path.join(WHITEBOARD_DIR, `${name.trim()}.html`);
      if (!/^[a-z0-9-]+$/.test(name.trim()) || !fs.existsSync(file)) {
        throw new Error(`Whiteboard "${name}" not found in public/whiteboards`);
      }
      const board = name.trim();
      const caption = rest.join(" ").trim() || "Step through the walkthrough";
      node.children![i] = {
        type: "paragraph",
        children: [],
        data: {
          hName: "figure",
          hProperties: { className: ["whiteboard-embed"] },
          hChildren: [
            {
              type: "element",
              tagName: "iframe",
              properties: {
                src: `/whiteboards/${board}.html?embed=1&skin=notebook`,
                title: `${readBoardTitle(file)} — animated whiteboard walkthrough`,
                loading: "lazy",
                sandbox: "allow-scripts",
                className: ["whiteboard-frame"],
              },
              children: [],
            },
            {
              type: "element",
              tagName: "figcaption",
              properties: { className: ["whiteboard-caption"] },
              children: [
                { type: "element", tagName: "span", properties: {}, children: [{ type: "text", value: caption }] },
                {
                  // Works without JS (opens the board on its own page, e.g. on iPhone);
                  // WhiteboardEnhancer turns it into real full screen where supported.
                  type: "element",
                  tagName: "a",
                  properties: {
                    href: `/whiteboards/${board}.html?skin=notebook`,
                    target: "_blank",
                    rel: "noopener",
                    className: ["whiteboard-open"],
                  },
                  children: [{ type: "text", value: "open full screen" }],
                },
              ],
            },
          ],
        },
      };
    });
  };
  walk(tree);
};

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

// Wraps each table in a div that scrolls sideways, so a wide table scrolls inside the
// column instead of widening the whole page (which cuts off the text on phones).
const rehypeScrollTables = () => (tree: HastNode) => {
  const walk = (node: HastNode) => {
    node.children?.forEach((child, i) => {
      if (child.type === "element" && child.tagName === "table") {
        node.children![i] = {
          type: "element",
          tagName: "div",
          properties: { className: ["table-scroll"] },
          children: [child],
        };
      } else {
        walk(child);
      }
    });
  };
  walk(tree);
};

const textOf = (node: HastNode): string =>
  node.type === "text" ? node.value ?? "" : (node.children ?? []).map(textOf).join("");

// Collects the top-level H2s (after rehype-slug has given them ids) for the contents list.
const rehypeCollectToc = (toc: TocItem[]) => () => (tree: HastNode) => {
  for (const node of tree.children ?? []) {
    if (node.type === "element" && node.tagName === "h2" && node.properties?.id) {
      toc.push({ id: String(node.properties.id), text: textOf(node).trim() });
    }
  }
};

const markdownToHtml = async (
  markdown: string,
): Promise<{ html: string; toc: TocItem[] }> => {
  const toc: TocItem[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkWhiteboards)
    .use(remarkRehype)
    .use(rehypeScrollTables)
    .use(rehypePrettyCode, {
      theme: { dark: "gruvbox-dark-medium", light: "gruvbox-light-medium" },
      keepBackground: false,
    })
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeCollectToc(toc))
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["heading-anchor"] },
    })
    .use(rehypeStringify)
    .process(normalizeMathDelimiters(markdown));
  return { html: String(file), toc };
};

const readSectionDirs = (): string[] => {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
};

const isDraft = (data: RawFrontmatter) => data.draft === true || data.draft === "true";

const readPostMeta = (section: string, fileName: string): BlogPostMeta | null => {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, section, fileName), "utf8");
  const { data, body } = parseFrontmatter(raw);
  return isDraft(data) ? null : toMeta(section, slug, data, body);
};

const timeOf = (post: BlogPostMeta) => (post.date ? new Date(post.date).getTime() : 0);

const byDateDesc = (a: BlogPostMeta, b: BlogPostMeta) => timeOf(b) - timeOf(a);

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

// Sections that have posts, the one with the newest post first.
export const getSections = cache((): string[] =>
  readSectionDirs()
    .filter((section) => getPostsBySection(section).length > 0)
    .sort(
      (a, b) =>
        timeOf(getPostsBySection(b)[0]) - timeOf(getPostsBySection(a)[0]),
    ),
);

export const getPost = cache(
  async (section: string, slug: string): Promise<BlogPost | null> => {
    const filePath = path.join(BLOG_DIR, section, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, "utf8");
    const { data, body } = parseFrontmatter(raw);
    if (isDraft(data)) return null;

    const { html, toc } = await markdownToHtml(body);
    return { ...toMeta(section, slug, data, body), html, toc };
  },
);

// "See also": the rest of the post's series in reading order, then posts from the
// same hub ranked by shared tags, then by how close their dates are.
export const getRelatedPosts = (post: BlogPostMeta, limit = 4): BlogPostMeta[] => {
  const others = getAllPosts().filter(
    (p) => !(p.section === post.section && p.slug === post.slug),
  );
  const series = post.series
    ? others
        .filter((p) => p.series === post.series)
        .sort((a, b) => (a.seriesPart ?? 0) - (b.seriesPart ?? 0))
    : [];
  const shared = (p: BlogPostMeta) => p.tags.filter((t) => post.tags.includes(t)).length;
  const distance = (p: BlogPostMeta) => Math.abs(timeOf(p) - timeOf(post));
  const sameHub = others
    .filter((p) => p.section === post.section && !series.includes(p))
    .sort((a, b) => shared(b) - shared(a) || distance(a) - distance(b));
  return [...series, ...sameHub].slice(0, limit);
};

// Dates are shown in the author's timezone, so a post dated 00:00 IST
// doesn't show up as the previous day.
const TIME_ZONE = "Asia/Kolkata";
const isoDay = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE });
const humanDay = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  month: "short",
  day: "numeric",
  year: "numeric",
});
const monthDay = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  month: "short",
  day: "numeric",
});
const yearOnly = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric" });

/** 2026-05-02 */
export const formatPostDate = (date: string | null): string =>
  date ? isoDay.format(new Date(date)) : "undated";

/** May 2, 2026 */
export const formatHumanDate = (date: string | null): string =>
  date ? humanDay.format(new Date(date)) : "undated";

/** May 2 */
export const formatMonthDay = (date: string | null): string =>
  date ? monthDay.format(new Date(date)) : "undated";

/** 2026 */
export const formatYear = (date: string | null): string =>
  date ? yearOnly.format(new Date(date)) : "Undated";

/** The serializable slice of a post that list pages hand to client components. */
export type PostSummary = {
  section: string;
  sectionLabel: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  monthDay: string;
  year: string;
};

export const toSummary = (post: BlogPostMeta): PostSummary => ({
  section: post.section,
  sectionLabel: getSectionLabel(post.section),
  slug: post.slug,
  title: post.title,
  description: post.description,
  tags: post.tags,
  date: formatPostDate(post.date),
  monthDay: formatMonthDay(post.date),
  year: formatYear(post.date),
});
