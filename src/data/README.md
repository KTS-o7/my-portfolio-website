# Portfolio data

The pages read their copy from the JSON files in this folder. Edit a file and the site updates on the next build (or immediately in `npm run dev`). Blog posts live in `content/blog/<hub>/<slug>.md`, not here.

## Files

### `hero.json` — home page

- `name`: shown in the header, footer and page titles
- `headline`: the home page H1
- `subhead`: the paragraph under the H1
- `metrics`: the three big numbers on the home page (`value`, `label`)
- `shortDescription`, `shortDescriptionLine2`, `roles`: used in metadata, `llms.txt` and JSON-LD

### `experience.json` — Work → Experience and `/experience/<slug>`

One entry per role, newest first. Each has `slug`, `company` (`name`, `url`), `role`, `type`, `location`, `timeframe`, `summary`, `highlights` and `skills`. The order sets the "newer / older" links on role pages.

### `projects.json` — Work → Projects & publications

- `projects`: each has `name`, `description`, `impact` (shown on the home page), `tech`, `links` (`demo`, `paper`, `source`) and `tag`
- A project whose `tag` includes `"Publication"` is filed under Publication; everything else is Software

### `work.json` — case studies (`/work/<slug>`)

Each case study has `title`, `subtitle`, `company`, `location`, `summary`, `highlights`, `stack`, `metrics`, `links`, `notes` and `relatedPosts`. `relatedPosts` lists posts as `"<hub>/<slug>"` for the "see also" block. A role in `experience.json` links to the case study whose `company.name` matches.

### `about.json` — About page

- `title`: the About H1
- `lead`: the italic opening line
- `description.primary`: the main paragraph
- `location` and `education[0]` (`degreeShort`, `institution`, `years`, `gpa`): the margin notes
- `skills`: also feeds the Toolbox rows, with `technologies.json`
- `certifications`: lines starting with "NPTEL" are listed; publications live in `projects.json`

### `technologies.json` and `about.json` `skills` — Toolbox

The Toolbox groups (Languages, Backend & Data, AI & LLM, Infra, Frontend) are defined in `src/lib/portfolio.ts`. A tool appears when its name is in either list.

### `contact.json` — Contact page, header menu and footer

`email`, `phone`, `whatsapp`, `bookingUrl`, `resumeUrl`, `availability` and `socialMedia` (GitHub, Twitter, LinkedIn).

### `hubs.json` — Writing hubs (`/blog/<hub>`)

One entry per hub: `intro` (shown under the hub title), `description` (the meta description) and `searchHint` (the search placeholder examples). The intros are drafts; rewrite them in your own words.

### `blog-redirects.json` — old blog URLs

Permanent redirects from old post URLs (underscored slugs, merged duplicates) to current ones. `next.config.js` loads it. When you rename or merge a post, add its old URL here so links and search results keep working.

## Blog frontmatter

Posts use TOML frontmatter (`+++`). Besides `title`, `date`, `description`, `tags` and `draft`:

- `lastmod`: the date of the last substantive edit; shows "Updated …" on the post and feeds `dateModified`
- `series` and `series_part`: posts that read in sequence (for example the consensus posts) list each other first under "see also"

A ```` ```whiteboard ```` fence embeds a board from `public/whiteboards/`. Its first line is the board name; an optional second line is the caption.
