# PRD: SEO + GEO Improvements (Portfolio Website)

**Doc owner:** Krishna Tejaswi (Product/Engineering)  
**Primary stakeholder:** Krishna Tejaswi (Personal brand / hiring pipeline)  
**Last updated:** 2026-01-21  
**Status:** Draft (updated with initial inputs)

## 1) Overview

This PRD defines a set of changes to improve:

- **SEO (Search Engine Optimization):** discoverability + ranking in Google/Bing for relevant “AI Engineer / Fullstack / Agentic AI” searches.
- **GEO (Generative Engine Optimization):** how well AI answer engines (ChatGPT, Perplexity, Gemini, AI Overviews, etc.) understand, summarize, and cite this portfolio with correct, verifiable facts.

The site is a Next.js portfolio with JSON-driven content, a single-page home layout, a `robots.txt`, a `sitemap.xml`, JSON‑LD, and LLM profile routes. This PRD builds on that foundation to improve crawlability, metadata quality, content structure, and “machine readability”.

## 1.1 Inputs & Decisions (confirmed)

- **Canonical domain:** `https://portfolio.shenthar.me` is the primary domain to index.
- **Secondary domain:** `https://krishnatejaswi-s.vercel.app` exists, but should not be canonical.
- **Primary positioning:** Founding-engineer style fullstack engineering with end-to-end ownership (discovery → development → deployment → iteration).
- **LLM endpoint:** Keep `/llms.txt` as the single recommended machine-readable endpoint.
- **Well-known alias:** Also serve `/.well-known/llms.txt` (alias to `/llms.txt`).
- **Structured data:** OK to add `worksFor/affiliation` and other entity fields.
- **WorksFor URL:** Use OnFinance AI (reference: `https://www.onfinance.ai/company`).
- **Location intent:** Based in Bangalore; open to remote and relocation for strong opportunities/comp.
- **Primary deep dive:** ComplianceOS at OnFinance AI delivered end-to-end (founding-engineer equivalent scope).
- **Tooling constraint:** Prefer free tooling/services (Google Search Console, Bing Webmaster Tools, Lighthouse, schema validators).

## 2) Problem Statement

Current baseline SEO/GEO is present but incomplete:

- Metadata is basic (title/description/OpenGraph without images, Twitter cards, canonical strategy, rich snippets beyond current JSON‑LD).
- Single-page architecture limits keyword coverage and the number of indexable, deep-linkable pages (projects, publications, experience).
- Generative engines benefit from stable, well-scoped fact sources; the site has LLM profile routes but needs standardization + “facts-first” content pages that are easy to cite.
- Measurement is not defined (no explicit KPIs, no audit baseline, no process for continuous SEO regression checks).

## 3) Goals & Success Metrics

### Goals (what “done” means)
1. **Indexability & correctness:** Search engines index the right URLs with canonical consistency and correct rich metadata.
2. **Stronger snippets & previews:** Improved SERP snippets (title/description), OG/Twitter previews, and eligibility for rich results where applicable.
3. **More rankable surface area:** Dedicated indexable pages for “About”, “Projects”, “Publications”, and optionally “Experience/Resume”.
4. **Better GEO outcomes:** AI tools can reliably extract: name, roles, location, contact, key achievements, major projects/publications, and links; and cite the portfolio as the source.
5. **Repeatable process:** Baseline audit, automated checks, and monitoring in Search Console + Bing Webmaster Tools.

### Success metrics (targets)
These should be measured vs a pre-change baseline.

- **Technical SEO**
  - Lighthouse SEO score: **≥ 95** on home + key pages.
  - Lighthouse Best Practices score: **≥ 95**.
  - Core Web Vitals (field, if enough traffic): **“Good”** for LCP/INP/CLS.
  - 0 indexation errors from Google Search Console (GSC) for canonical, robots, sitemap, or redirects.
- **Discoverability**
  - Increase **impressions** and **clicks** for target keywords within 4–8 weeks post-launch (exact % target TBD).
  - Improve average position for at least 3 target queries (TBD) within 8–12 weeks.
- **GEO / Answer engines**
  - When prompted with “Who is Krishna Tejaswi Shenthar?” or “Krishnatejaswi Shenthar portfolio”, at least 2 major answer engines produce a correct summary that includes role + location + 1–2 key achievements and cites the site URL (manual check).

## 4) Non-Goals (explicitly out of scope)

- Link-building campaigns, paid ads, and ongoing content marketing operations (can be added later).
- Building a full CMS/blog inside the portfolio (unless explicitly requested).
- Internationalization/localization beyond English (unless explicitly requested).
- Rebranding or full visual redesign (only changes necessary for SEO/GEO requirements).

## 5) Target Audiences / Personas

1. **Recruiters & hiring managers**
   - Wants a fast overview: role fit, achievements, tech stack, proof via projects, and how to contact.
2. **Technical peers / collaborators**
   - Wants projects, repositories, publications, stack, and specific contributions.
3. **Generative engines (LLMs)**
   - Needs stable, structured facts and citations; benefits from JSON‑LD + dedicated “facts” pages + predictable URLs.

## 6) Current State (baseline)

Known baseline capabilities in this repo (to be validated during audit):

- Next.js app-router with a single home page.
- `robots.txt` and `sitemap.xml` implemented via Next metadata routes.
- JSON‑LD (`Person`, `WebSite`, `WebPage`, and works) injected into the home page.
- Plain-text LLM profile routes (`/llm.txt` and `/llms.txt`) generated from `src/data/*`.
- Vercel Analytics and Speed Insights included.

## 7) Requirements

### 7.1 Technical SEO (P0)

**R1. Canonical domain strategy**
- **Description:** Ensure a single canonical domain is used everywhere (metadata base, sitemap URLs, JSON‑LD `url`, OG `url`).
- **Acceptance criteria:**
  - Production canonical is `https://portfolio.shenthar.me` (via `NEXT_PUBLIC_SITE_URL` or equivalent) and matches metadata/sitemap/JSON‑LD.
  - No mixed http/https, no trailing slash inconsistencies, no `vercel.app` canonical if a custom domain is primary.
  - Requests to the `*.vercel.app` domain redirect (301) to the canonical domain (or return canonical `<link rel="canonical">` + `og:url` and are not indexed as duplicates).

**R2. Robust metadata (global + per-page)**
- **Description:** Provide complete metadata for SEO + social cards using Next.js `Metadata`.
- **Includes:**
  - `title` template + per-page titles
  - `description` tuned per page
  - `alternates.canonical`
  - `openGraph` including `images` (1200×630), `siteName`, locale
  - `twitter` card (`summary_large_image`) + image
  - `robots` meta for index/follow (page-level overrides where needed)
  - `icons` (favicon + apple-touch-icon)
- **Acceptance criteria:**
  - Social sharing preview renders correct title/description/image on major platforms (manual check).
  - Each indexable route has a unique title + description.

**R3. Sitemap improvements**
- **Description:** Ensure sitemap contains all indexable pages (not just the homepage) and is updated as content grows.
- **Acceptance criteria:**
  - `sitemap.xml` includes URLs for: `/`, `/about`, `/projects`, `/publications`, `/contact` (if created), and any project detail pages (if created).
  - Last-modified dates are stable and meaningful (build time or content update time; not “always now”).

**R4. Robots & crawl controls**
- **Description:** Explicitly allow indexing for public pages and disallow non-content routes (if any exist later).
- **Acceptance criteria:**
  - `robots.txt` references sitemap and host correctly.
  - No accidental disallow of key pages.

**R5. Semantic HTML & accessibility fundamentals**
- **Description:** Improve heading hierarchy and semantic landmarks so crawlers and assistive tech can parse content reliably.
- **Acceptance criteria:**
  - Exactly one `h1` per page with the primary keyword phrase (e.g., “AI & Fullstack Engineer” + name).
  - Section headings use `h2/h3` appropriately.
  - All meaningful images have descriptive `alt` text.

### 7.2 Hybrid Routing & Page Specs (P0/P1)

**R2a. Hybrid route architecture (P0)**
- **Description:** Preserve the current single-page UX at `/` while adding indexable, shareable routes for SEO/GEO.
- **Implementation direction:**
  - `/` remains the “landing” page with sections and fast scanning.
  - Add dedicated routes that reuse the same data source (`src/data/*`) but render as standalone pages with unique metadata.
- **Acceptance criteria:**
  - `/about`, `/projects`, `/publications`, `/contact` return `200`, are linked in the navbar, and appear in the sitemap.
  - Each route has a unique `<title>` + `description` and uses correct canonical URLs.

**R2b. Proposed URL map (initial)**
- **P0 routes**
  - `/` — Landing + overview + CTAs (keeps current sections).
  - `/about` — Facts-first profile page (best citation target for LLMs).
  - `/projects` — Projects list with richer descriptions/outcomes.
  - `/publications` — Publications list (with citation links).
  - `/contact` — Contact info + social links.
  - `/llms.txt` — Machine-readable facts summary (plain text).
  - `/.well-known/llms.txt` — Alias to `/llms.txt`.
- **P1 routes**
  - `/work/complianceos` — Primary end-to-end work deep dive (founding-engineer style, OnFinance AI).
  - `/projects/[slug]` — Optional detail pages for top projects only (avoid thin pages).

**R2c. Page content minimums (P0/P1)**
- **Description:** Avoid “thin” pages; each indexable page should add unique value.
- **Acceptance criteria:**
  - Each indexable page includes at least one unique paragraph that is not identical across other pages.
  - Each page has a clear `h1`, then structured `h2/h3` sections.

### 7.3 Content SEO (P0/P1)

**R6. Keyword + positioning strategy (P0)**
- **Description:** Define 5–10 target keywords aligned to the roles and outcomes you want.
- **Initial draft (based on confirmed positioning; to finalize):**
  - “Fullstack engineer portfolio”
  - “Fullstack AI engineer”
  - “AI fullstack engineer”
  - “End to end product engineer”
  - “Discovery to deployment engineer”
  - “LangGraph engineer”
  - “LiteLLM developer”
  - “Agentic AI workflows”
  - “Compliance automation fintech”
  - Optional geo modifier: “Bangalore” / “India” / “Remote”
- **Acceptance criteria:**
  - Keywords are documented and mapped to specific pages/sections.
  - Each target page includes the keyword naturally in headings + body copy.

**R6a. Positioning copy (P0)**
- **Description:** Align visible copy and metadata to the “end-to-end fullstack” positioning without losing the AI focus.
- **Acceptance criteria:**
  - The hero `h1` and `/about` summary mention end-to-end ownership (“discovery to deployment”) and AI/fullstack context.
  - “Open to remote/relocation” appears in a human-readable place (About/Contact) and is consistent with schema.

**R7. Project and publication content upgrades (P1)**
- **Description:** Enrich project descriptions with outcomes, role, stack, and links to demos/papers.
- **Acceptance criteria:**
  - Each project includes (where applicable): problem → approach → impact → tech stack → link(s).
  - Publications include citation details (venue, year, DOI/IEEE link if available).

**R8. Internal linking improvements (P1)**
- **Description:** Add clear internal links between pages (About ↔ Projects ↔ Contact).
- **Acceptance criteria:**
  - Navigation links use proper `<a href="/about">` etc (not only `/#hash` anchors), if multi-page routes are created.

### 7.4 Structured Data (Schema.org) (P0/P1)

**R9. Validate + expand JSON‑LD (P0)**
- **Description:** Ensure JSON‑LD validates and includes strong “entity identity”.
- **Additions to consider:**
  - `Person.image` (profile photo URL)
  - `Person.workLocation` (Bangalore) + “open to remote/relocation” reflected in page copy (schema support varies; avoid over-encoding)
  - `Person.worksFor` (OnFinance AI) and/or `affiliation`
  - `Person.knowsLanguage`, `knowsAbout`
  - `WebSite.potentialAction` (SearchAction optional if site search exists; otherwise omit)
  - For projects: use `SoftwareSourceCode` with `codeRepository`, `programmingLanguage`, `keywords`
- **Acceptance criteria:**
  - Passes Google Rich Results Test (where applicable) and has no schema errors in validation tools.

**R10. Add page-type specific schemas (P1)**
- **Description:** Add `FAQPage` schema if a FAQ page exists; add `BreadcrumbList` for multi-page navigation; add `ProfilePage` (where supported).
- **Acceptance criteria:**
  - Each major page emits schema aligned with its purpose.

### 7.5 GEO (Generative Engine Optimization) (P0/P1)

**R11. Standardize LLM-friendly endpoints (P0)**
- **Description:** Provide a single, stable “source of truth” for LLMs.
- **Implementation direction:**
  - Keep `/llms.txt` as the single primary endpoint and link it from `<head>`.
  - Also support `/.well-known/llms.txt` as an alias (200 with identical content or 301 to `/llms.txt`).
  - Avoid duplicate competing endpoints: deprecate `/llm.txt` in favor of `/llms.txt` (301 redirect preferred).
- **Acceptance criteria:**
  - One recommended LLM endpoint is linked from `<head>` and listed in sitemap.
  - Content is stable (update date should reflect content changes, not request time).

**R12. “Facts-first” pages (P1)**
- **Description:** Create a plain, crawlable page that summarizes key facts (name, roles, location, achievements, stack, links, contact) in a citation-friendly format.
- **Acceptance criteria:**
  - `/about` (or `/facts`) contains a compact factual summary plus links to evidence (projects, publications, employer, etc.).

**R12a. ComplianceOS work deep dive (P1)**
- **Description:** Provide a high-signal, citeable write-up of the primary end-to-end delivery with founding-engineer scope (ComplianceOS at OnFinance AI).
- **Proposed outline:**
  - Problem context (BFSI compliance workload)
  - Your role and responsibilities (discovery → architecture → delivery)
  - System overview (high-level, non-sensitive)
  - Impact/metrics (e.g., “1250+ hours/year savings”) with scope/attribution
  - Stack and techniques (LangGraph, LiteLLM, etc.)
  - Links for evidence (company page: `https://www.onfinance.ai/company`)
- **Acceptance criteria:**
  - Work deep dive page exists at `/work/complianceos` and is linked from `/about` and `/projects`.
  - Claims are scoped and non-sensitive; add links where possible.

**R13. Evidence and citations strategy (P1)**
- **Description:** Where claims are made (e.g., “1250+ hours/year savings”), provide context and/or linkable proof when possible.
- **Acceptance criteria:**
  - High-impact claims have at least one supporting link or clear scoping language (“internal estimate”, “team project”, etc.).

**R18. GEO evaluation prompts (P0)**
- **Description:** Define a small repeatable prompt suite to manually verify LLM understanding and citations.
- **Acceptance criteria:**
  - After release, run the prompts below on at least 2 answer engines and record results (screenshots/notes):
    - “Who is Krishna Tejaswi Shenthar? Cite sources.”
    - “Summarize Krishna Tejaswi’s end-to-end fullstack work and include 2 concrete achievements. Cite sources.”
    - “List Krishna Tejaswi’s top 5 skills and 3 projects with links. Cite sources.”

### 7.6 Performance & CWV (P0/P1)

**R14. Performance baseline + targets (P0)**
- **Description:** Establish baseline via Lighthouse and Vercel Speed Insights; set targets and regressions checks.
- **Acceptance criteria:**
  - Baseline metrics recorded in PRD (or follow-up doc).
  - Targets set for LCP/INP/CLS and Lighthouse categories.

**R15. Image, font, and JS optimization (P1)**
- **Description:** Reduce render-blocking resources and improve LCP.
- **Acceptance criteria:**
  - Largest above-the-fold assets are optimized (proper `next/image` usage, responsive sizing).
  - Fonts are loaded efficiently (already uses `next/font`; ensure subsets/weights are minimal).

### 7.7 Measurement & Tooling (P0/P1)

**R16. Search Console + Bing verification (P0)**
- **Description:** Verify site ownership and submit sitemap.
- **Acceptance criteria:**
  - GSC property verified, sitemap submitted, no major coverage issues.
  - Bing Webmaster Tools configured similarly.
  - No paid SEO tooling is required to complete P0.

**R17. SEO regression checks (P1)**
- **Description:** Add lightweight checks to avoid accidental regressions.
- **Implementation direction:** One of:
  - CI script that runs Lighthouse in CI (optional), or
  - Playwright-based smoke checks for presence of key meta tags on key pages, or
  - A simple Node script that asserts metadata output via static rendering (if feasible).
- **Acceptance criteria:**
  - Checks run on PRs and fail on missing canonical/OG/Twitter basics.

**R19. Free validation checklist (P0)**
- **Description:** Validate SEO/GEO changes using free tools before and after deployment.
- **Acceptance criteria:**
  - Lighthouse (Chrome DevTools) run on `/`, `/about`, `/projects`.
  - Schema validation run on `/` and `/about` (Schema Markup Validator; Rich Results Test).
  - GSC + Bing: sitemap submitted and coverage checked.
  - Social previews checked via manual page source inspection for OG/Twitter tags and at least one free preview validator where possible.

## 8) User Stories (examples)

- As a recruiter, I can quickly understand your role fit, achievements, and stack within 30 seconds.
- As a hiring manager, I can open a dedicated Projects page and scan outcomes and repositories.
- As an LLM, I can extract your name, roles, location, achievements, and links from a single stable endpoint and cite it.

## 9) Milestones / Phasing

**Phase 0 — Audit & Baseline (0.5–1 day)**
- Run Lighthouse (local + deployed), validate sitemap/robots, validate JSON‑LD, capture baseline metrics.

**Phase 1 — P0 Technical SEO + Metadata (1–2 days)**
- Canonical strategy, metadata completion (OG/Twitter/canonical/icons), sitemap improvements, heading hierarchy fixes.

**Phase 2 — Page expansion + content upgrades (2–4 days)**
- Add indexable routes for About/Projects/Publications/Contact (or equivalent), enrich copy, internal linking.

**Phase 3 — GEO hardening (1–2 days)**
- Standardize `/llms.txt`, add facts-first page, improve evidence links, confirm crawlers can access.

**Phase 4 — Measurement & Monitoring (0.5–1 day + ongoing)**
- GSC/Bing verification and sitemap submission; add regression checks.

## 10) Risks & Mitigations

- **Risk:** Canonical mismatch between `vercel.app` and custom domain → duplicate indexing.
  - **Mitigation:** Explicit canonical URL via env + metadata; verify in GSC.
- **Risk:** “Always now” `lastModified` in sitemap makes crawlers re-crawl unnecessarily.
  - **Mitigation:** Use build-time or content-hash based timestamps.
- **Risk:** Too many low-value URLs (thin pages) reduce site quality.
  - **Mitigation:** Only create pages with unique, substantial content.
- **Risk:** Claims without evidence reduce trust (humans + LLMs).
  - **Mitigation:** Add citations/links or scope claims carefully.

## 11) Dependencies

- Access to the production domain DNS/Vercel project settings (for canonical URL and verification tokens).
- A social preview image asset (`og:image`) at a stable path.
- Optional: authoritative links for publications (IEEE/DOI), employer page, press/references.

## 12) Open Questions (need answers)

Resolved from inputs:

1. **Canonical domain:** `https://portfolio.shenthar.me`  
2. **Primary focus:** Fullstack engineering with end-to-end ownership  
3. **LLM endpoint:** `/llms.txt`  
4. **Structured data:** OK to add WorksFor/Affiliation  
5. **Analytics constraint:** Keep it free; no additional paid tooling required  
6. **Site structure:** Hybrid routes (keep `/` UX + add indexable routes)  
7. **LLM alias:** Add `/.well-known/llms.txt` alias  
8. **WorksFor reference:** `https://www.onfinance.ai/company`  
9. **Location intent:** Bangalore + open to remote/relocation  
10. **Primary deep dive:** ComplianceOS at OnFinance AI end-to-end

Optional follow-ups (not blockers for Phase 1):

11. Dedicated `/work/complianceos` page: **Yes** (implemented).  
12. Should “open to relocation/remote” be shown in the main hero copy, About page, or only in structured data?  
13. Do you want to add an Open Graph image that includes your photo (local asset) for better previews?
