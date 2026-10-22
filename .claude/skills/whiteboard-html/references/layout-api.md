# Layout boards (no coordinates)

Use this for new boards. You say what is on the board and how things are arranged;
`scripts/board_layout.py` lays the board out twice at build time, wide (16:9, left to right,
for the blog column and desktops) and narrow (3:4 portrait, top to bottom, for phones held
upright), and the engine switches by the board's width. Cameras are automatic as usual.

Example: `examples/two_phase_commit_layout.py` (the portfolio's 2PC board). The portfolio's
`whiteboards/raft_consensus.py` shows the `rows` group with an `axis`.

## Contents
- Script shape
- Elements and slots
- Groups
- Components
- Steps
- Layout rules that came from real fixes
- Checking
- ELK and safety

## Script shape

```python
import wb
from board_layout import Board, story_js

b = Board()  # or Board(elk_sha256=...) outside git, see "ELK and safety"
coord = b.box("coord", ["coordinator"], size=30, w=300, h=130)   # elements first
...
b.group("coordG", "stack", "coord", "coord_n1", gap=28)           # then arrangement
b.component("protocol", ["coordG", "a", "b"], [["coordG", "a"], ["coordG", "b"]])
STORY = [{"ops": [coord, ...]}, ...]                              # then the steps
wb.build(..., steps=STEPS, story_js=story_js(b, STORY))
```

## Elements and slots

Each method registers the element's size (from its text) and returns the JS op for a step.

```python
b.box(id, ["line 1", "line 2"], k="new", size=26, w=None, h=None, slot=None)
b.note(id, ["free text"], k="new", size=24, slot=None)
b.link(id, "from_slot", "to_slot", k="new", label="PREPARE", dash=False, offset=0, side=0, size=26)
b.cross(id, "slot")              # red X over a box (a crashed node)
b.cut(id, "link_id")             # red slash across an arrow already on the board
b.frame(id, "group", "title")    # dashed frame around a group; give it pad_top=100
```

- A **slot** is a rectangle on the board. By default an element has its own (slot = id).
  Pass `slot=` when elements take turns in one place: a node that becomes candidate then
  leader, a status note that changes text. The slot is sized for its largest element.
- Links run between slots, centre to centre, cut at both borders. `offset=-1` shifts an
  arrow sideways; give a request and its reply the same offset and they land on opposite
  sides. Labels place themselves: the first spot along the arrow that overlaps nothing.
- Box text is centred. Text width is estimated at 0.56 x size per character.

## Groups

```python
b.group(id, kind, *members, gap=24, row_gap=None, pad=0, pad_top=None, align="start",
        reverse_narrow=False, axis=None)
```

| kind | wide | narrow (phones) |
|---|---|---|
| `stack` | top to bottom | same |
| `row` | left to right | same |
| `flow` | row | stack (a node and its log strip, a row of phases) |
| `rflow` | stack | row |
| `rows` | rows on one centre line: `("s5", "s2"), ("client", "s1", "s1_log"), ("s4", "s3")` | same |

- Members are slots or other groups. `align="center"` centres them across the group.
- `reverse_narrow=True` reverses the members on phones. Use it to keep a node next to what
  it connects to: the coordinator's notes go above it on phones, so the coordinator sits
  right above A and B; top-row followers get their log above them, away from the leader.
- In `rows`, a two-member row sits either side of the centre line, so the gap between
  them is always in the middle. `axis="s1"` makes that member's centre the line; the
  others in its row go to its left and right.

## Components

`b.component(id, [top-level slots or groups], [[from, to], ...])`. ELK's layered algorithm
places each component (edges say what follows what, left to right on wide boards, top to
bottom on phones). Then the components are packed: rectpacking on wide boards, one column
in story order on phones. Separate parts of the story (the 3PC aside, the alternatives,
the legend) are separate components.

## Steps

Dicts, in the same order as `STEPS`: `ops` (from the methods above), and optionally
`erase`, `mute`, `focus`, `packets` (as in story-api.md) and `cam: "full"` for the recap.

## Layout rules that came from real fixes

- **Phones read top to bottom, so vertical distance is cheap and width is expensive.** A
  frame 800 units wide gives 26-unit text 11.7 px at 360 px. Keep a step's elements within
  about 750 units across on the narrow layout.
- **Wide boards are the other way round:** height costs width (16:9), so put notes beside
  nodes (`flow`) rather than under them.
- **Keep fan-out arrows clear.** Arrows leaving a hub (a leader, a coordinator) cross
  anything between the hub and its targets: put the hub's notes outside the fan (beside the
  hub in its own row, or by the client), and a follower's log on the side away from the hub.
- **Notes that take turns share a slot.** A slot reserves its space for the whole story, so
  four note slots under a node push everything below it away. One slot whose notes replace
  each other keeps the node next to its neighbours.
- **A note about one element goes in that element's group** (the voting rule under S2, the
  peer it is about), not in a panel of its own.

## Checking

Run `window.__wbCheck({ width })` at 1000, 672, 390 and 360. The check switches to the
narrow layout for widths under 520. Besides the usual items it reports arrows that run
through a box they don't start or end at. Then click through both layouts and look: the
check can't see an arrow crossing a note's text.

Current results: 2PC passes at all four widths; Raft passes at 1000, 672 and 390, and at
360 three steps are 10-11 px.

## ELK and safety

ELK (elkjs 0.12.0, EPL-2.0) is `assets/elk.bundled.js`, copied unmodified from the npm
release and checked against the registry tarball. It runs at build time under Bun
(`scripts/layout.mjs`); the published board contains only the computed positions.

- `layout.mjs` refuses to load the file if its SHA-256 differs from the one pinned there.
- In the portfolio repo the skill (ELK, its pinned hash and the engine) is tracked in git,
  so a change to any of them shows in `git diff` and the history. A copy of the skill
  outside git only catches accidents that way, not someone swapping the file and the hash
  together; there, also pass `Board(elk_sha256=...)` with a hash kept in a git repo.
- Bun has `self` but no `document`, so elkjs thinks it is in a web worker and hangs.
  `layout.mjs` sets a placeholder `document` until `new ELK()` has run.
- To upgrade: download the new release tarball, check its sha512 against the registry's
  `dist.integrity`, copy `lib/elk.bundled.js` and the licence, and update both hashes.
