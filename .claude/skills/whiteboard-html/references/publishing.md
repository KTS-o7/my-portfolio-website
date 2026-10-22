# Publishing a board

## Contents
- Portfolio blog (my-portfolio-website)
- slashdocs
- Standalone file

## Portfolio blog (my-portfolio-website)

Repo: `~/Documents/side-projects/my-portfolio-website` (Next.js, posts in `content/blog/<section>/*.md`).

1. Build the board to `public/whiteboards/<slug>.html`. The slug is lowercase letters,
   digits and hyphens, usually the post's file name with `_` turned into `-`.
2. In the post's markdown, add a fenced block where the board should appear:

   ````md
   ```whiteboard
   raft-consensus
   ```
   ````

   `src/lib/blog.ts` turns it into a sandboxed iframe of `/whiteboards/<slug>.html?embed=1`
   and fails the build if the file is missing. `WhiteboardEnhancer` keeps the board's theme
   in sync with the site toggle and sizes the iframe from the board's height messages.
3. Put a sentence before the block that says what the board shows, written in the post's
   own voice (use the human-voice skill for any prose). The board repeats the post's
   argument visually; it should not introduce claims the post doesn't make.
4. Verify on the dev server (`npm run dev`), at 1366x768 with 125% zoom and at mobile width,
   in both themes. Then `npm run lint` and `npm run build` must pass before a PR.

Embedding rules:
- The iframe is `sandbox="allow-scripts"` without `allow-same-origin`, so board scripts can't
  touch the site. Don't add `allow-same-origin`.
- `?embed=1` hides the board's own title and lede, because the post provides them.
- The embed is exactly the text column's width (672 px). Design cameras and text sizes
  for that (see `story-api.md`), and check the busiest step on the dev server.
- Phones: a layout board (`layout-api.md`) switches to its portrait phone layout when the
  board is under 520 px wide, so it reads in the post without full screen; the iframe grows
  taller from the height the board reports. A hand-placed board keeps one 16:9 layout, and
  at ~360 px its text is too small to read. Either way every embed gets an "Open full
  screen" link under it. `WhiteboardEnhancer` turns it into element full screen plus a
  landscape lock where the browser allows (Android, desktop); on iPhone it opens the
  standalone board page (a hand-placed board asks the reader to turn the phone sideways).
  In landscape the engine drops the header and uses the full width (the wide layout).

## slashdocs

Use the slashdocs CLI (`~/.local/bin/slashdocs`, skill `slashdocs`). Run `slashdocs guidelines`
once per session first.

```bash
slashdocs docs create board.html --title "Raft on a whiteboard"
slashdocs docs push <doc_id> board.html --summary "Fix step 4 labels"
```

New docs are private by default. The hosted demo (`tryslashdocs.razorpay.com`) has no terms or
retention policy, so publish only public-safe content there. The board follows the reader's
slashdocs theme automatically through `data-slashdocs-theme`.

## Standalone file

The built HTML works opened directly in a browser. It loads Excalifont from unpkg; without
network it falls back to a cursive system font. It follows the system light/dark setting, or
`?theme=dark` / `?theme=light`.
