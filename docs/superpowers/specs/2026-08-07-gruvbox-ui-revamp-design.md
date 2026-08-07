# Gruvbox UI Revamp — Design Spec

Date: 2026-08-07
Branch: `feat/gruvbox-ui-revamp`
Status: Approved (user sign-off), implemented in this PR

## Concept

"Notion/Linear-clean" document aesthetic with a **gruvbox** palette, light +
dark with a toggle. No card layouts anywhere — hairline dividers and generous
whitespace instead. Restrained motion only. All existing content, routes,
SEO/JSON-LD/metadata/llms.txt/sitemap/OG image stay functionally intact.

## Theme & tokens

- Collapse the previous 7 palettes to ONE palette (gruvbox), still applied via
  the `data-palette` attribute (`data-palette="gruvbox"`). Palette-switcher UI
  removed; the light/dark toggle stays (default: `prefers-color-scheme`,
  fallback light).
- Dark: bg `#282828`, surface `#32302f`, text-primary `#ebdbb2`,
  text-secondary `#d5c4a1`, text-tertiary `#a89984`, primary (accent)
  `#fabd2f`, secondary `#8ec07c`, accent `#ebdbb2`.
- Light: bg `#fbf1c7`, surface `#f9f5d7`, text-primary `#3c3836`,
  text-secondary `#504945`, text-tertiary `#7c6f64`, primary `#b57614`,
  secondary `#076678`, accent `#3c3836`.
- New `--color-border` token: ~12% opacity of text color per theme, mapped in
  `tailwind.config.js` as the `border` color. Hairline `border-border`
  dividers replace card surfaces/shadows everywhere.

## Typography

- Geist Sans via the `geist` package's next/font integration as the
  body/display font (`--font-geist-sans`, tailwind `font-sans`).
- JetBrains Mono via next/font/google for meta labels, dates, tags, code
  (`--font-jetbrains-mono`, tailwind `font-mono`).
- Hero headline large (clamp ~2.5–4rem, tight tracking); section titles
  medium; small mono uppercase meta labels with wide tracking. Type contrast
  replaces card chrome.

## Layout system

- Prose-ish pages (about, contact, publications, case studies, detail pages):
  ~720px content column.
- Index pages (projects, experience, homepage sections): up to ~1100px.
- Projects & experience lists are **index rows**: full-width, hairline top
  border per row, mono index number (01, 02…), title, description, mono
  date/meta; hover translates the title a few px / accent color, optional
  arrow. No boxes, no shadows, no rounded cards.
- Metrics (1B+ tokens/month, 1,500+ hours/year, $800K+ ARR) rendered as
  oversized display numbers inline in the hero.
- Skills: inline comma-separated groups under small mono category labels —
  no badge/pill grids.
- Navbar: minimal — wordmark left, section links + theme toggle + one primary
  CTA right, hairline bottom border, sticky with bg blur.
- Footer: hairline top border, mono meta, quiet text links.
- Buttons/links: text links with arrow or underline styles; one filled
  primary CTA ("Book a call").

## Motion

- framer-motion: page fade/small translate on mount; staggered row reveals
  via whileInView (once: true); row hover micro-transitions.
- One CSS marquee on the homepage (toolbox strip) — slow, subtle, paused on
  reduced motion.
- Only transform/opacity animations. `prefers-reduced-motion` respected.
- Removed particles/float/spotlight/shimmer/border-beam animations and their
  tailwind keyframes; deleted the legacy effect components
  (FloatingParticles, ParticlesBackground, Spotlight, Cursor, AnimatedGrid,
  Card3D, TextReveal, SmoothScroll, SystemScrollBar, ThemePreviewPanel) and
  `src/lib/themes.ts`.

## Constraints honored

- Unchanged: route structure, `src/data/*.json` content,
  `src/lib/metadata.ts`, `src/lib/profile.ts` (JSON-LD), llms.txt/llm.txt
  routes, `sitemap.ts`, `robots.ts`, `opengraph-image.png`, CNAME/public
  assets.
- All text content identical — visual revamp only (exception: removed
  palette-switcher UI and its labels).
