# Board story API

This is the hand-placed API (coordinates on a 2600 x 1462 board). New boards should be
layout boards (`layout-api.md`), which build on the same engine and step objects.

A board script defines `STEPS` (captions) and `STORY_JS` (drawing), then calls `wb.build()`.
`STORY_JS` runs inside the engine, so every helper below is in scope. Copy an example from
`examples/` and edit it rather than starting from nothing.

## Contents
- World and camera
- Element helpers
- Step objects
- Colour kinds
- Layout rules that prevent the usual bugs
- `wb.build()` arguments

## World and camera

The board is 2600 x 1462 world units (16:9). `FULL = [0, 0, 2600, 1462]`.

**Leave `cam` out.** The engine frames each step automatically from what it draws: its new
elements, the ids in its `focus` list, and the arrows its packets travel on. It adds
padding, keeps 16:9, pulls in boxes the frame would cut in half (up to a width cap of 1600,
900 on phones), and otherwise slides the frame so no box is left half in view. On displays
under 520 px it frames tighter. Add `focus: ["id", ...]` when a step draws something small
that needs context next to it (a note about a node). Set `cam` only for the recap (`FULL`)
or a deliberate shot.

An explicit `cam` is `[x, y, width, height]` in world units. Keep it 16:9 (`height = width * 9 / 16`):

| width | height | use |
|---|---|---|
| 1000 | 563 | tight close-up on 2-3 elements |
| 1200 | 675 | a region with notes |
| 1300 | 731 | a wide region |
| 1600 | 900 | two regions |
| 2000 | 1125 | most of the board |
| 2600 | 1462 | `FULL`, recap only |

Text size is in world units, so it gets smaller as the camera widens. Rendered size is
text size x (display width / camera width), and it should stay at or above 12 px.

Portfolio blog embeds are the width of the text column, 672 px. Design for that:
- keep every step's camera at or under about 1450 units wide (the recap can be `FULL`);
- use 26-30 unit text for boxes and notes, 24 at the smallest;
- put related things next to each other instead of in separate panels. A Raft board with
  the node ring and a separate log panel needed a 2050-wide camera (8 px text); moving
  each node's log into a strip beside the node brought it to 1440 (13 px).
slashdocs shows boards about 1180 px wide, so a board built for the blog also reads well there.

## Element helpers

Each helper returns a function; put the calls in a step's `ops` array. Every element needs a
unique `id`, because later steps `erase`, `mute` and route packets by id.

```js
box(id, x, y, w, h, ["line 1", "line `code`"], { k: "new", size: 24, fill: true })
frame(id, x, y, w, h, "title above the frame", { k: "new" })        // dashed container
note(id, x, y, ["free text", "second line"], { k: "old", size: 22, anchor: "start" })
arrow(id, [[x1, y1], [x2, y2], ...], { k: "new", dash: false, head: true,
          label: "text", at: [x, y], size: 22, anchor: "middle" })
strike(id, x1, y1, x2, y2)       // red line through a rejected idea
hl(id, x, y, w, h)               // yellow highlighter wash, drawn under everything
```

- Backticks inside a line render that part in monospace: `"POST /v2/runs"` written as "`POST /v2/runs`".
- `note` text starts at `y` (top of the first line), not at the baseline.
- Box text is centred in the box automatically. Line height is 1.3 x size.
- Text width is roughly 0.5 x size per character in Excalifont. A 24-unit line of 30
  characters is about 360 units wide. Use this to size boxes and check overlaps.
- Arrow labels get a paper-coloured halo, so they can sit over lines. Put them beside the
  line, not on it, when the line runs through the text.
- `head: false` draws a plain connector.

## Step objects

```js
S.push({
  focus: ["id"],                  // optional: earlier elements to keep in frame
  cam: [x, y, w, h],               // optional: fixed frame (recap); omit for automatic
  erase: ["id1"],                  // remove elements from earlier steps
  mute: ["id2"],                   // turn earlier elements grey ("replaced")
  ops: [box(...), arrow(...)],     // new elements, drawn in order with stroke reveal
  packets: [{ via: "arrowId", overlap: 0.85 }],  // dots travelling along arrows, looped
});
```

`overlap` is how far into one packet's trip the next starts: `0` sends them together (fan-out),
`1` sends them one after another, the default `0.85` gives a relay.

## Colour kinds (`k`)

| kind | meaning | stroke |
|---|---|---|
| `old` | already there, context | ink |
| `new` | what this story introduces | orange |
| `bad` | errors, failures, rejected ideas | red |
| `mute` | out of scope, replaced | grey |

Pick one meaning per colour and keep it for the whole board. The recap legend explains it.

## Layout rules that prevent the usual bugs

These all came from real fixes:

- Plan regions first: write a comment block naming each region and its x/y range before any
  coordinates. Most overlap bugs come from adding a region where an earlier step already drew.
- Leave about 40 units between a box's bottom edge and any label or note below it. Labels
  placed at `box.y + box.h - 6` collide with the box edge.
- Route long arrows around boxes, not through them. A vertical leg at an x inside another
  box's span will cross it; move the leg to a clear column.
- Put labels on long horizontal arrows above the line (`at` y about 45 units above).
- Keep each step's new elements close together. The automatic frame covers all of them,
  so one note placed far away (a rule written under the whole diagram) forces a wide frame
  and small text. `__wbCheck` reports it as small text.
- `window.__wbCheck({ width: 672 })` checks every step at that display width: elements
  outside the frame, boxes cut by the frame edge, text overflowing its box, text overlapping
  another element's text or box, smallest text under 11 px, duplicate ids, bad packets.
  Run it at 672 (blog column) and 1000 (desktop). At 360 (phone) hand-placed boards fail
  the text size, because they have one 16:9 layout; phones use the full-screen link.
  Layout boards get a phone layout of their own. It also reports arrows that run through
  a box they don't start or end at.
- Strike-throughs go through the line being rejected (about 7 units above that line's
  baseline), not the line under it.
- When a heading or note sits right under a row of boxes, push the whole lower region down
  rather than shrinking the gap.

## `wb.build()` arguments

```python
wb.build(
    out=Path("raft-consensus.html"),
    title="Raft on a whiteboard",          # <title>
    heading="Raft on a whiteboard",         # visible h1 (hidden in ?embed=1)
    lede_html="One line. Press <strong>Next</strong> to step through it.",
    steps=STEPS,                           # [(heading, 2-3 sentences, open-line), ...]
    story_js=STORY_JS,
)
```

`STEPS[i]` must line up with the i-th `S.push`. The open-line supports backticks for code.
The engine also renders every step as a plain-text list under the board, so the content
works without the animation.
