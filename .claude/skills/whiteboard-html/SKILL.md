---
name: whiteboard-html
description: Build animated, hand-drawn whiteboard walkthroughs as one self-contained HTML file (Excalidraw look via rough.js, camera moves step to step, stroke-reveal drawing, data-flow dots, captions, a text fallback). Use this whenever the user wants to explain a system, protocol, algorithm, pipeline, PR, incident or architecture visually, asks for a "whiteboard", "walkthrough", "animated diagram" or "step-through explainer", wants a diagram for a blog post on their portfolio site (my-portfolio-website), or wants a visual doc for slashdocs, even if they don't say "whiteboard".
---

# Whiteboard HTML

This skill lives in the portfolio repo (`my-portfolio-website/.claude/skills/whiteboard-html`),
so any checkout has it and can build boards; that copy is the one to edit. A copy in
`~/.claude/skills` is only for other projects on this Mac and is synced from the repo.

Turns an explanation into a step-by-step animated board. The reader presses Next; the camera
pans to one region, new elements draw themselves in, small dots show where data flows, and a
caption says what changed. Every step is also listed as plain text under the board.

The engine (`scripts/wb.py`) handles drawing, animation, navigation, theming and embedding.
Your job is the story: which steps, what is on the board at each one, and where the camera
looks. That is where boards succeed or fail.

## Workflow

1. **Collect the facts.** Use only what the source says: the blog post, PR diff, notes, or
   the user's own words. A board that invents a number or a component is worse than no board.
   If the source is a blog post, the board must not make claims the post doesn't make.
2. **Write the step list first, in prose.** 8-14 steps. For each: a heading, 2-3 plain
   sentences, and an "Open:" line (the files, tables or docs to read for that step).
   Good arcs:
   - *System explainer:* the problem → each component as it's introduced → the main flow →
     a failure or edge case → recap.
   - *Protocol:* actors → happy path message by message → the failure case (in red) → the fix
     or the alternative → recap.
   - *Pipeline:* source → each stage with its numbers → the branch that needs extra work →
     what was rejected → the output → recap.
   One idea per step. If a caption needs "and also", split the step.
3. **Plan regions.** Sketch on paper (a comment block in the script) where each group lives
   on the 2600 x 1462 board, so later steps have room. Left-to-right or top-to-bottom flow
   reads best.
4. **Write the board script.** For a new board, write a layout board: no coordinates. You
   declare the elements, how they are grouped and what connects, and the build lays the
   board out for wide screens and, separately, for phones held upright (readable without
   full screen). Start from `examples/two_phase_commit_layout.py` and read
   `references/layout-api.md`.
   Older boards place everything by hand (`references/story-api.md`); copy these only to
   edit an existing hand-placed board:
   - `examples/sqlite_agent_memory.py`: a system that grows, with a rejected-ideas row and an
     old component that gets muted.
   - `examples/bookmarks_pipeline.py`: a multi-row pipeline with a branch, counts, and
     crossed-out claims.
5. **Build:** `python3 -I <board_script>.py <out.html>`. The script finds `scripts/wb.py`
   and the bundled rough.js by itself.
   Building a layout board runs `bun` (ELK lays the board out at build time); never `node`.
6. **Verify in a browser** (personal Brave via Claude in Chrome, served from
   `python3 -m http.server` on 127.0.0.1):
   - Run `window.__wbCheck({ width })` in the page at 1000 and 672, and for layout boards
     also at 390 and 360 (phones). Fix every reported item (cut or overflowing boxes,
     overlapping text, arrows through boxes, text under 11 px, ...). Cameras are automatic,
     so most fixes are arrangement: moving an element into the group of the thing it is
     about, sharing a slot, or adding `focus`.
   - Click through every step and look at each one. The check can't see text overlapping
     other text or a line running through a label; your eyes can.
   - Check dark mode: set `document.documentElement.dataset.slashdocsTheme = "dark"`.
   - Check the console for errors.
7. **Publish** where the user wants it (`references/publishing.md`): the portfolio blog
   (iframe embed via a ```` ```whiteboard ```` block), slashdocs, or a standalone file.

## Colour meaning

Black = already there, orange = new in this story, red = errors and rejected ideas,
grey = out of scope or replaced. A yellow highlighter can mark an area; a red strike-through
crosses out a rejected idea. The last step zooms out to the whole board with a legend.

## Writing the captions

Plain sentences, one idea each, past or present tense consistently. Name the concrete thing
("the leader appends x=5 to its log") rather than the abstraction ("state is updated"). If
the board goes into the user's blog, write the captions in the post's voice; the human-voice
skill applies to them.

## What not to do

- Don't hand-place coordinates in a new board; use a layout board. In an old hand-placed
  board, don't add coordinates without a region plan; that's where every overlap bug came from.
- Don't load rough.js from a CDN or install elkjs from npm; use the checked copies in `assets/`.
- Don't give the iframe `allow-same-origin` when embedding.
- Don't put private or company data on the hosted slashdocs demo.
