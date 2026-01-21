# Portfolio Redesign PRD

## Goal
Make the site immediately answer: who I am, what I do, what I’ve shipped, and how to contact me — with a distinctive “engineering craft” aesthetic (not generic landing-page blocks, not purple gradients).

## Design Rationale (site-copy ready)
This portfolio is designed like an engineering artifact: clear hierarchy, calm surfaces, and evidence-led storytelling. The visual system uses an ink/copper/teal palette to feel technical without “cyber” clichés, and the work is presented as short case studies (problem → tech → impact) so visitors can assess judgment, craftsmanship, and outcomes quickly.

## Information Architecture
- **Hero**: name + one-sentence value proposition + current focus + primary CTAs
- **About**: working style + strengths + education/credentials + toolbox
- **Selected Work**: filterable list with case-study fields (problem/tech/impact + links)
- **Contact**: direct channels + social + accessible form
- **(Optional)** Testimonials/endorsements

## Visual System
- **Palette**
  - Dark: ink background, slate surface, copper primary, teal secondary
  - Light: paper background, white surface, deep copper primary, deep teal secondary
- **Typography**
  - System variable sans for readability and weight range
  - Monospace for metadata (labels, tags, navigation)
- **Motion**
  - Subtle entrance fades and hover lift
  - Respect `prefers-reduced-motion`
- **Accessibility**
  - High-contrast tokens, visible focus ring, skip link to main content
  - Touch targets ≥ 44px for interactive controls

## Atomic Tasks

### Brand + Content
- [x] Write a one-sentence value proposition for backend + LLM tooling
- [x] Add “current focus” line to hero
- [ ] Add 2–3 concrete proof points (scale, latency, reliability, cost) to hero `proofPoints`
- [ ] Replace placeholder impact statements with verifiable metrics where possible
- [ ] Add endorsements/testimonials (or “references available”)

### Data Model
- [x] Extend `src/data/projects.json` to include `problem`, `impact`, `tech`, and `links`
- [ ] Add `featured: true` and a `sortOrder` field for explicit ordering
- [ ] Add `role` and `timeframe` fields to projects (optional but useful for senior narrative)
- [ ] Add `testimonials.json` and a minimal schema (name, role, quote, link)

### Hero + Navigation
- [x] Implement hero structure with kicker, headline, subhead, proof points, and CTAs
- [x] Add skip link to `#content` and ensure every route has `id="content"` on `<main>`
- [x] Simplify nav labels (Selected Work / Writing / Contact) and improve focus/hover states
- [ ] Add a small “availability”/“open to” pill that is data-driven (optional)

### Selected Work
- [x] Replace generic card grid with case-study layout (image + structured fields)
- [x] Add “Live demo” + “Source” links when available
- [ ] Add “Featured” grouping (top 2–3) above filters
- [ ] Add optional “deep dive” links for larger projects (case study pages)

### About + Toolbox
- [x] Replace tabbed About UI with narrative + strengths + credentials layout
- [x] Replace auto-scrolling tech carousel with accessible “core + full toolbox” disclosure
- [ ] Group toolbox by category (Backend / Data / Cloud / LLM / Frontend) for faster scanning

### Contact
- [x] Redesign contact section to “direct channels + form” with accessible error messaging
- [ ] Move EmailJS IDs to environment variables and reference from `src/data/contact.json`
- [ ] Add a “copy email” button with confirmation (optional)

### Polish + QA
- [ ] Run Lighthouse (mobile + desktop) and fix any contrast/focus regressions
- [ ] Check reduced-motion mode for all animations and remove non-essential motion
- [ ] Verify mobile nav and project layouts at 320px width
