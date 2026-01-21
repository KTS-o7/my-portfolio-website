# PRD: Machine-Readable Portfolio (LLM-Friendly)

## Status

- Status: Draft
- Product owner: Krishna Tejaswi Shenthar (KTS)
- Repo: `my-portfolio-website` (Next.js App Router + TypeScript + Tailwind)
- Last updated: 2026-01-21

## Problem & Intent

This project aims to make a personal portfolio explicitly understandable to large language models (LLMs), AI agents, and automated recruiters, without compromising human usability or visual design. While the site is already human-readable, much of its context (identity, skills, project intent, and ownership) is implicit and fragmented across UI elements. This creates ambiguity for AI systems that rely on structured, semantic, and text-first signals to accurately interpret content. The goal is to introduce a minimal, standards-aligned layer of machine-readable metadata—such as a `/llm.txt` profile, semantic HTML, and structured schema—so the portfolio can be reliably parsed, summarized, and reasoned about by LLMs, while remaining simple, fast, and maintainable.

## Background (Current State)

- Tech: Next.js (App Router), React, TypeScript, Tailwind.
- IA: single-page portfolio with anchored sections: Hero, About, Projects/Work, Contact.
- Content source of truth: JSON under `src/data/` (`hero.json`, `about.json`, `projects.json`, `contact.json`, `technologies.json`).
- Metadata today: basic `title`, `description`, and minimal OpenGraph in `src/app/layout.tsx`; no schema.org JSON-LD; no `robots.txt`/`sitemap`.
- UX: some information is “behind” interaction (tabs/filters), which can reduce extraction quality for text-only agents even if the UI works well for humans.

## Goals

### Product goals

1. Enable accurate, grounded extraction of identity, skills, experience, and projects by LLM-based systems using only public site content.
2. Reduce ambiguity about ownership and professional profile (name, roles, links, contact methods).
3. Improve discoverability and consistency for both AI systems and standard crawlers (SEO/accessibility alignment).
4. Keep changes minimal, maintainable, and compatible with the current design/system.

### Success criteria (measurable)

- **Extraction accuracy**: For a fixed evaluation prompt set, LLM answers match the portfolio’s facts (name, current role/company, location, top skills, projects) with ≥95% correctness and no hallucinated employers/projects.
- **No-JS requirement**: critical identity + portfolio summary can be retrieved without executing client-side JS (e.g., via `/llm.txt`).
- **Consistency**: `/llm.txt`, schema.org JSON-LD, and UI content remain consistent (single source of truth from `src/data/*`).
- **No UX regression**: Lighthouse (or equivalent) shows no meaningful regressions in performance, accessibility, or SEO.

## Non-goals / Out of Scope

- Visual redesign, layout changes, or adding new marketing content.
- Analytics/tracking changes (beyond what already exists).
- “Ranking optimization” for any specific AI platform.
- Paywalled or authenticated content for machines.
- Heavy client-side parsing frameworks or content management systems.

## Users & Use Cases

### Primary “users”

- LLMs and AI agents performing automated summarization, candidate screening, or portfolio understanding.
- Automated recruiter tools parsing public web content.
- Search/crawler systems (traditional SEO bots).

### Secondary users

- Humans (recruiters, hiring managers, collaborators) who benefit from clearer structure and metadata.

### Key use cases

- “Summarize this person’s professional profile and top projects with links.”
- “Extract skills + current role + contact channels.”
- “List publications vs software vs hardware projects.”
- “Verify ownership and identity signals (sameAs links).”

## Proposed Solution (High-Level)

Add a thin “machine-readable” layer that is:

1. **Text-first**: a stable, crawlable `/llm.txt` endpoint with structured sections.
2. **Standards-aligned**: schema.org JSON-LD describing the person, website, and key work.
3. **Discoverable**: linked from HTML head and supported by `robots.txt`/`sitemap`.
4. **Low maintenance**: generated from the existing JSON data files, not duplicated across multiple places.

## Requirements

### P0 (Must Have)

1. **`/llm.txt` profile**
   - Served at `/llm.txt` with `Content-Type: text/plain; charset=utf-8`.
   - Generated from `src/data/*` (no manual duplication).
   - Includes the following sections (headings and stable formatting):
     - Identity: full name, location, primary roles (and a short “one-liner”).
     - Links: website, GitHub, LinkedIn, blog, CV/resume link(s).
     - Skills/stack: concise list (limit duplicates; normalize naming).
     - Experience summary: current role/company + notable impact (from `about.json`/hero copy).
     - Projects: list with name, 1-line description, tags/category, and URL.
     - Publications: same format as projects; clearly labeled.
     - Contact: preferred contact methods (at minimum email; phone optional/controlled).
     - Provenance: “Source of truth: this portfolio”, last updated date, and a no-hallucination note (“If a fact is missing here, say so.”).
   - Does not require executing JS or loading images.

2. **Schema.org JSON-LD**
   - Embedded on the main page in a standards-compliant way (`<script type="application/ld+json">…</script>`).
   - Minimum entities:
     - `Person` (name, jobTitle/hasOccupation, alumniOf, knowsAbout, sameAs, homeLocation).
     - `WebSite` + `WebPage` (name, description, url, inLanguage).
   - “Work” entities derived from `projects.json` as `CreativeWork` and/or `SoftwareSourceCode` (choose types per tag where possible).
   - Should not conflict with existing `Metadata` in `src/app/layout.tsx`.

3. **Discoverability**
   - Add discoverable links:
     - `<link rel="alternate" type="text/plain" href="/llm.txt" title="LLM profile" />` (or equivalent).
   - Ensure `/llm.txt` is not blocked by robots policies.

4. **Single Source of Truth**
   - `/llm.txt` and JSON-LD are programmatically derived from `src/data/*`.
   - Changes to portfolio content require editing JSON only; metadata regenerates automatically.

### P1 (Should Have)

1. **Robots + Sitemap**
   - Provide `robots.txt` and `sitemap.xml` (or Next.js `robots.ts` + `sitemap.ts`) for standard crawler compatibility.
   - Include `/llm.txt` (and optionally a dedicated `/llm.json`) in the sitemap.

2. **Semantic HTML improvements**
   - Ensure headings reflect meaning (e.g., `h1` includes the person’s name and primary role in a readable way).
   - Ensure sections have clear labels (`aria-label` where needed) without duplicating conflicting IDs.

3. **Optional “LLM index”**
   - Consider supporting `/llms.txt` as an alias to `/llm.txt` for compatibility with emerging conventions, while keeping `/llm.txt` the primary endpoint.

### P2 (Nice to Have)

- A compact `/llm.json` schema (explicit fields) for deterministic parsing (useful for recruiters/agents).
- A `/resume.txt` or “text resume” endpoint generated from the same data (opt-in).
- Per-project detail pages or a printable projects page (only if needed to reduce ambiguity).

## Content & Formatting Spec (for `/llm.txt`)

### Format

- Plain text with simple Markdown-like headings (`#`, `##`) for readability.
- Stable ordering; avoid decorative ASCII art.
- Keep lines short enough for copy/paste (target ≤120 chars/line).

### Example section outline (not final copy)

- `# Krishna Tejaswi Shenthar (KTS)`
- `## One-line summary`
- `## Roles`
- `## Location`
- `## Links`
- `## Skills`
- `## Experience`
- `## Projects`
- `## Publications`
- `## Contact`
- `## Provenance`

## Non-Functional Requirements

- **Performance**: no meaningful impact on TTFB/LCP; no extra client bundles required for metadata.
- **Accessibility**: changes must not reduce keyboard/screen-reader usability; semantic HTML improvements should help.
- **Security & privacy**: avoid exposing secrets; treat phone number as configurable/optional in `/llm.txt`.
- **Maintainability**: no new heavy dependencies; prefer Next.js built-ins and small utility functions.
- **Compatibility**: works on Vercel and local dev; content is valid UTF-8 plain text.

## Evaluation Plan

### Prompt-based checks (manual or scripted)

Create a fixed set of questions and expected answers, sourced only from `/llm.txt` and the public page HTML:

- “What is the person’s full name and current role/company?”
- “List top skills/technologies.”
- “List projects with links; separate publications.”
- “How can I contact them?”

Track:

- Hallucination count (facts not in source).
- Omission count (missing key facts present in source).
- Link correctness.

### Structural checks (automatable)

- `/llm.txt` returns HTTP 200 and correct content type.
- JSON-LD validates (schema.org validator) and contains required entities/fields.
- `/llm.txt` content matches current `src/data/*` (basic snapshot/contract tests).

## Milestones / Phasing

1. **Phase 1 (P0)**: Implement `/llm.txt` generated from `src/data/*` + add head link.
2. **Phase 2 (P0/P1)**: Add schema.org JSON-LD generation from the same data.
3. **Phase 3 (P1)**: Add robots + sitemap; ensure crawlability/discoverability.
4. **Phase 4**: Run evaluation checklist; iterate copy/structure for clarity.

## Risks & Mitigations

- **Stale metadata**: mitigate by generating from `src/data/*` only and adding lightweight validation.
- **Spam risk from contact info**: make phone optional; default to email + social links; consider obfuscation only if it doesn’t harm clarity.
- **Interactive UI hides facts**: ensure `/llm.txt` includes “complete” content and not only what’s visible by default.
- **Over-structuring**: keep format minimal; avoid overfitting to any single AI platform.

## Open Questions

1. Should `/llm.txt` include the phone number by default, or be opt-in?
2. Should we publish `/llms.txt` as an alias for better ecosystem compatibility?
3. Do we want a dedicated canonical domain (e.g., `shenthar.com`) reflected consistently in metadata?
4. Should projects be typed as `SoftwareSourceCode` vs `CreativeWork` purely based on tags, or via an explicit field in `projects.json`?
