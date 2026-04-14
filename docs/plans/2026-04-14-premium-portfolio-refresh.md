# Premium Portfolio Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the portfolio into a premium, hiring-focused, SEO-strong, agent-discoverable multi-page site with clean routing, stronger conversion paths, and a temporary palette preview system.

**Architecture:** Convert the current mixed homepage-plus-duplicate-pages structure into a canonical multi-page information architecture. Centralize metadata, sitemap generation, redirects, theme tokens, and `llms.txt` generation so the visual refresh, SEO improvements, and agent-readable profile all derive from the same source-of-truth data and route model.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Framer Motion, JSON content files, ESLint

---

### Task 1: Baseline Verification And Route Inventory

**Files:**
- Modify: none
- Test: existing route/build/lint commands

**Step 1: Record current route/build state**

Run: `npm run build`
Expected: build succeeds and prints the current route table.

**Step 2: Record current lint state**

Run: `npm run lint`
Expected: fail on the known `ThemeContext` rule so the cleanup work has a clear baseline.

**Step 3: Record current branch state**

Run: `git status --short --branch`
Expected: only the plan file is untracked or modified before implementation begins.

**Step 4: Commit the planning doc**

```bash
git add docs/plans/2026-04-14-premium-portfolio-refresh.md
git commit -m "docs: add premium portfolio refresh plan"
```

### Task 2: Establish The New Route Model

**Files:**
- Modify: `next.config.js`
- Modify: `src/app/page.tsx`
- Modify: `src/app/work/page.tsx`
- Modify: `src/app/work/[company]/page.tsx`
- Modify: `src/app/work/complianceos/page.tsx`
- Create: `src/app/experience/page.tsx`
- Create: `src/app/experience/[company]/page.tsx`
- Create: `src/app/case-studies/[slug]/page.tsx`
- Test: `npm run build`

**Step 1: Write the failing route expectations**

Create a lightweight route verification checklist in the plan execution notes or test notes before changing code:
- `/experience` should replace `/work`
- `/experience/[company]` should replace `/work/[company]`
- `/case-studies/complianceos` should replace `/work/complianceos`
- old URLs should redirect permanently

**Step 2: Run build to confirm current route table does not match the target**

Run: `npm run build`
Expected: existing route table still shows `/work` and `/work/complianceos`, confirming the target behavior does not exist yet.

**Step 3: Add route redirects in `next.config.js`**

Implement permanent redirects:

```js
{
  source: "/work",
  destination: "/experience",
  permanent: true,
}
{
  source: "/work/:company",
  destination: "/experience/:company",
  permanent: true,
}
{
  source: "/work/complianceos",
  destination: "/case-studies/complianceos",
  permanent: true,
}
```

Order the redirects so the specific case-study redirect wins before the generic company redirect.

**Step 4: Create the new canonical pages**

Implement:
- `src/app/experience/page.tsx` by adapting the current work index page
- `src/app/experience/[company]/page.tsx` by adapting the current company page
- `src/app/case-studies/[slug]/page.tsx` by generalizing the current ComplianceOS deep dive

Start minimal: support only `complianceos` from `work.json` in the new case-study route.

**Step 5: Reduce the old route pages to redirect-only surfaces or remove them if safe**

Prefer simple server redirects from the old app routes so both Next.js routing and `next.config.js` agree on canonical destinations.

**Step 6: Verify the new route table**

Run: `npm run build`
Expected: build succeeds and shows `/experience`, `/experience/[company]`, and `/case-studies/[slug]` as canonical app routes.

**Step 7: Commit**

```bash
git add next.config.js src/app/page.tsx src/app/work/page.tsx src/app/work/[company]/page.tsx src/app/work/complianceos/page.tsx src/app/experience/page.tsx src/app/experience/[company]/page.tsx src/app/case-studies/[slug]/page.tsx
git commit -m "feat: normalize portfolio route structure"
```

### Task 3: Centralize SEO Metadata And Canonicals

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/contact/page.tsx`
- Modify: `src/app/projects/page.tsx`
- Modify: `src/app/publications/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/experience/page.tsx`
- Modify: `src/app/experience/[company]/page.tsx`
- Modify: `src/app/case-studies/[slug]/page.tsx`
- Modify: `src/lib/profile.ts`
- Create: `src/lib/metadata.ts`
- Test: `npm run build`

**Step 1: Write the failing metadata expectation list**

Target every canonical page to have:
- title
- description
- canonical URL
- Open Graph
- Twitter card
- page-specific structured data where appropriate

**Step 2: Confirm the current helper does not exist**

Run: `npm run build`
Expected: no centralized metadata helper is in use yet; page metadata remains repetitive.

**Step 3: Create `src/lib/metadata.ts`**

Add a minimal shared helper layer such as:

```ts
import type { Metadata } from "next";

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "profile" | "article";
}): Metadata {
  // derive canonical, openGraph, twitter from one source
}
```

**Step 4: Apply the helper across page files**

Replace repetitive inline metadata blocks with helper calls. Keep page-specific details only where necessary.

**Step 5: Strengthen layout metadata**

Add site-level defaults in `layout.tsx`:
- metadata title template
- default Open Graph image if one exists later
- Twitter summary card defaults
- alternates where useful

**Step 6: Extend structured data intentionally**

Use `src/lib/profile.ts` for:
- homepage `Person` + `WebSite`
- experience/company pages as profile or article-like pages only if accurate
- case studies as `Article` or `CreativeWork`
- publications as `ScholarlyArticle` list items

**Step 7: Verify metadata build safety**

Run: `npm run build`
Expected: build succeeds with no metadata type errors.

**Step 8: Commit**

```bash
git add src/app/layout.tsx src/app/about/page.tsx src/app/contact/page.tsx src/app/projects/page.tsx src/app/publications/page.tsx src/app/page.tsx src/app/experience/page.tsx src/app/experience/[company]/page.tsx src/app/case-studies/[slug]/page.tsx src/lib/profile.ts src/lib/metadata.ts
git commit -m "feat: centralize metadata and canonical seo"
```

### Task 4: Rebuild Sitemap, Robots, And `llms.txt`

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`
- Modify: `src/app/llms.txt/route.ts`
- Modify: `src/app/llm.txt/route.ts`
- Modify: `src/lib/profile.ts`
- Modify: `src/data/contact.json`
- Modify: `src/data/hero.json`
- Test: `npm run build`

**Step 1: Write the failing content expectation**

The final `llms.txt` should include:
- identity
- positioning
- availability
- booking link
- resume link
- canonical page URLs
- featured case studies
- projects
- publications
- provenance instructions

**Step 2: Verify current output is incomplete**

Run: `npm run build`
Expected: current `llms.txt` output is generated, but it does not yet reflect the new route taxonomy or richer dossier fields.

**Step 3: Update `hero.json` and `contact.json` source data**

Add source-of-truth fields needed for the dossier and conversion surfaces, such as:
- `bookingUrl`
- `resumeUrl`
- refined positioning text
- availability copy

**Step 4: Update `buildLlmProfileText` in `src/lib/profile.ts`**

Add sections for:
- preferred roles
- availability
- booking link
- canonical URL map
- featured experience pages
- featured case studies

Keep the style factual and compact.

**Step 5: Rebuild sitemap from canonical pages only**

Update `src/app/sitemap.ts` to emit:
- `/`
- `/about`
- `/contact`
- `/projects`
- `/publications`
- `/experience`
- `/experience/[company]`
- `/case-studies/[slug]`
- `/llms.txt`

Do not include replaced `/work` pages.

**Step 6: Keep `robots.ts` aligned**

Ensure the host and sitemap point to the canonical site URL and sitemap path.

**Step 7: Verify route generation**

Run: `npm run build`
Expected: build succeeds and the route table includes the `llms.txt` surfaces without SEO inconsistencies.

**Step 8: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/llms.txt/route.ts src/app/llm.txt/route.ts src/lib/profile.ts src/data/contact.json src/data/hero.json
git commit -m "feat: improve sitemap and llms profile output"
```

### Task 5: Fix Theme State Architecture Before UI Refresh

**Files:**
- Modify: `src/app/context/ThemeContext.tsx`
- Modify: `src/app/layout.tsx`
- Test: `npm run lint`

**Step 1: Write the failing verification**

Run: `npm run lint`
Expected: fail on `react-hooks/set-state-in-effect` in `ThemeContext.tsx`.

**Step 2: Replace effect-driven initialization with lazy state**

Refactor `ThemeContext` toward:

```ts
const [theme, setTheme] = useState<"light" | "dark">(() => {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem("theme") === "light" ? "light" : "dark";
});
```

Then use effects only for:
- syncing DOM classes
- persisting to localStorage

**Step 3: Prevent hydration flicker intentionally**

Add a tiny inline theme script in `layout.tsx` if necessary so the initial theme class is applied before hydration.

**Step 4: Verify the lint fix**

Run: `npm run lint`
Expected: no `ThemeContext` lint error remains.

**Step 5: Commit**

```bash
git add src/app/context/ThemeContext.tsx src/app/layout.tsx
git commit -m "fix: stabilize theme initialization"
```

### Task 6: Build A Semantic Theme Token System And Palette Preview Mode

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/context/ThemeContext.tsx`
- Modify: `src/app/components/ui/ThemeToggle.tsx`
- Create: `src/app/components/ui/ThemePreviewPanel.tsx`
- Create: `src/lib/themes.ts`
- Test: `npm run lint`

**Step 1: Write the failing theme preview expectation**

The site should support:
- dark mode and light mode
- multiple palette families during preview
- one semantic token layer feeding all UI colors

**Step 2: Confirm current CSS tokens are single-palette only**

Read `globals.css` and verify the current root tokens only represent one brand family.

**Step 3: Create `src/lib/themes.ts`**

Define preview theme families using semantic token maps. Include all candidate palette families from the user shortlist as named presets.

Suggested shape:

```ts
export const themeFamilies = {
  blueGoldClassic: { ... },
  blueGoldModern: { ... },
  metallicGold: { ... },
  champagne: { ... },
};
```

Each family should expose both light and dark values.

**Step 4: Apply the tokens in CSS**

Move hardcoded palette values in `globals.css` to semantic CSS variables for:
- background
- surface
- surface-muted
- text-primary
- text-secondary
- border
- accent-primary
- accent-secondary
- glow
- ring

**Step 5: Add temporary preview controls**

Implement `ThemePreviewPanel.tsx` so you can switch palette families locally on the real site. Keep it obviously temporary and easy to remove later.

**Step 6: Integrate preview state with the existing theme context**

Persist:
- dark/light mode
- selected preview palette

**Step 7: Verify styles and lint**

Run: `npm run lint`
Expected: theme preview code and token refactor pass lint.

**Step 8: Commit**

```bash
git add src/app/globals.css src/app/context/ThemeContext.tsx src/app/components/ui/ThemeToggle.tsx src/app/components/ui/ThemePreviewPanel.tsx src/lib/themes.ts
git commit -m "feat: add premium theme tokens and palette preview"
```

### Task 7: Redesign The Navigation For Conversion And Page Flow

**Files:**
- Modify: `src/app/components/Navbar.tsx`
- Modify: `src/data/hero.json`
- Modify: `src/data/contact.json`
- Test: `npm run lint`

**Step 1: Write the failing nav expectation**

The final nav should contain:
- `Home`
- `Experience`
- `Projects`
- `About`
- `Contact`
- visible utility actions for `Resume` and `Book a call`

**Step 2: Confirm current nav still uses old route assumptions**

Read `Navbar.tsx` and verify it still points to `/work`, homepage anchors, and the external `Links` item.

**Step 3: Replace the nav model**

Update nav links to the new canonical routes and remove the generic `Links` item.

**Step 4: Add utility actions**

Use `resumeUrl` and `bookingUrl` from source data to render:
- secondary resume link
- primary booking CTA

**Step 5: Preserve mobile usability**

Ensure both actions remain visible and easy to tap in the mobile menu.

**Step 6: Verify lint**

Run: `npm run lint`
Expected: the updated nav passes lint.

**Step 7: Commit**

```bash
git add src/app/components/Navbar.tsx src/data/hero.json src/data/contact.json
git commit -m "feat: redesign navigation for conversion"
```

### Task 8: Rebuild The Homepage As A Short Premium Landing Page

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/components/Hero.tsx`
- Modify: `src/app/components/Experience.tsx`
- Modify: `src/app/components/Projects.tsx`
- Modify: `src/app/components/About.tsx`
- Modify: `src/app/components/Contact.tsx`
- Create: `src/app/components/home/FeaturedExperience.tsx`
- Create: `src/app/components/home/FeaturedProjects.tsx`
- Create: `src/app/components/home/ValueSection.tsx`
- Create: `src/app/components/home/CtaSection.tsx`
- Test: `npm run build`

**Step 1: Write the failing homepage expectation**

The homepage should become a short landing page with:
- calm luxurious hero
- featured experience cards
- featured projects or case studies
- short value section
- CTA section

It should no longer duplicate the full About, Experience, Projects, and Contact pages.

**Step 2: Confirm current homepage is still long-form**

Run: `npm run build`
Expected: homepage still renders all major sections from the old one-page model.

**Step 3: Rewrite `Hero.tsx`**

Change hero behavior to:
- editorial serif-led headline
- current image treated as a premium portrait stand-in
- `Book a call` primary CTA
- `View selected work` secondary CTA
- quieter resume link

**Step 4: Create homepage-only section components**

Implement small focused components for the landing page instead of reusing full-page sections with `showTopBorder={false}` hacks.

**Step 5: Keep visitors moving naturally**

Each homepage block should have a next-step CTA:
- featured experience -> `View all experience`
- featured projects -> `See all projects`
- CTA band -> `Book a call`, `Contact`, `Resume`

**Step 6: Verify the new homepage compiles cleanly**

Run: `npm run build`
Expected: build succeeds and homepage remains static.

**Step 7: Commit**

```bash
git add src/app/page.tsx src/app/components/Hero.tsx src/app/components/Experience.tsx src/app/components/Projects.tsx src/app/components/About.tsx src/app/components/Contact.tsx src/app/components/home/FeaturedExperience.tsx src/app/components/home/FeaturedProjects.tsx src/app/components/home/ValueSection.tsx src/app/components/home/CtaSection.tsx
git commit -m "feat: rebuild homepage as premium landing page"
```

### Task 9: Refresh Core Page Designs With The Premium System

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/contact/page.tsx`
- Modify: `src/app/projects/page.tsx`
- Modify: `src/app/publications/page.tsx`
- Modify: `src/app/experience/page.tsx`
- Modify: `src/app/experience/[company]/page.tsx`
- Modify: `src/app/case-studies/[slug]/page.tsx`
- Modify: `src/app/components/Footer.tsx`
- Test: `npm run build`

**Step 1: Write the failing page-design expectation**

Each page should feel premium, calmer, and more editorial while still fitting one shared system.

**Step 2: Update page-level layouts**

Apply:
- stronger headings
- better spacing rhythm
- reduced card repetition
- clearer CTA endings
- better section hierarchy

**Step 3: Make Contact a higher-conversion page**

Ensure the contact page leads with:
- availability statement
- booking CTA
- email/direct links
- resume link
- contact form below

**Step 4: Improve projects and experience scanning**

Give cards stronger outcome framing and more obvious next actions.

**Step 5: Keep publications secondary**

Retain quality but reduce navigation prominence and visual dominance.

**Step 6: Verify the full site build**

Run: `npm run build`
Expected: all redesigned pages compile successfully.

**Step 7: Commit**

```bash
git add src/app/about/page.tsx src/app/contact/page.tsx src/app/projects/page.tsx src/app/publications/page.tsx src/app/experience/page.tsx src/app/experience/[company]/page.tsx src/app/case-studies/[slug]/page.tsx src/app/components/Footer.tsx
git commit -m "feat: refresh portfolio pages with premium layouts"
```

### Task 10: Final Verification And Cleanup

**Files:**
- Modify: any files required by verification failures
- Test: full verification commands

**Step 1: Run lint**

Run: `npm run lint`
Expected: PASS.

**Step 2: Run production build**

Run: `npm run build`
Expected: PASS with the final route table.

**Step 3: Manually verify key URLs in dev**

Run: `npm run dev`

Check in browser:
- `/`
- `/experience`
- `/experience/onfinance-ai`
- `/projects`
- `/case-studies/complianceos`
- `/about`
- `/contact`
- `/publications`
- `/llms.txt`
- legacy `/work` URL redirect

**Step 4: Validate the final user flows**

Confirm:
- nav CTA visibility
- booking link works
- resume link works
- homepage naturally points deeper into the site
- palette preview works for comparison

**Step 5: Commit final fixes**

```bash
git add .
git commit -m "feat: complete premium portfolio refresh"
```

**Step 6: Prepare for review**

Before opening a PR, summarize:
- route changes
- SEO changes
- `llms.txt` changes
- theming changes
- conversion changes
