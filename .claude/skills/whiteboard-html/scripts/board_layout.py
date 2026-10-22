"""Boards without coordinates: describe what is on the board, and the layout is computed.

A board script declares elements (boxes, notes, links) with their text, says how they are
arranged (groups) and what connects to what (components with edges), and lists the steps.
The build lays the board out twice, once for wide displays (16:9, left to right) and once
for phones (3:4 portrait, top to bottom), and the engine picks one by the board's width.

- A slot is a rectangle that one or more elements use over the story. A node that changes
  role, or a status note that changes text, keeps its slot; pass `slot=` to share one.
- Groups arrange slots and other groups, without ELK:
    stack  top to bottom          row    left to right
    flow   a row on wide boards, a stack on phones (a node and its log strip)
    rflow  a stack on wide boards, a row on phones
    rows   rows on one centre line, given as tuples: ("s5", "s2"), ("s1",), ("s4", "s3").
           A two-member row sits either side of the line, so the gap between them is
           always in the middle (an arrow down the middle passes through it). With
           axis="s1_g", that member's centre is the line, and the others in its row go
           to its left and right (the leader in the middle, the client beside it).
  `reverse_narrow=True` reverses a group's members on phones (a node's notes go above it,
  so the node stays next to what it connects to).
- Components are laid out with ELK's layered algorithm (edges say what follows what) and
  packed: rectpacking on wide boards, one column in story order on phones.

ELK runs at build time under Bun from the copy in assets/ (see layout.mjs); the published
board only contains the computed positions. layout.mjs refuses to load a copy whose SHA-256
differs from the one pinned there; pass Board(elk_sha256=...) with a hash kept in your own
git repo as well, so a change to the skill folder can't quietly swap both.
"""
import hashlib
import json
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
ELK_FILE = HERE.parent / "assets" / "elk.bundled.js"
CHAR_W = 0.56  # average Excalifont glyph width, in em
j = json.dumps

VARIANTS = [
    {"name": "wide", "direction": "RIGHT", "aspect": 16 / 9, "narrow": False, "pack": "rect", "layerGap": 180, "nodeGap": 90},
    {"name": "narrow", "direction": "DOWN", "aspect": 3 / 4, "narrow": True, "pack": "column", "layerGap": 190, "nodeGap": 70},
]

HELPERS_JS = r"""
  // ---------- layout helpers: elements placed from LAYOUTS (board_layout.py) ----------
  const P = (id) => { const p = LAY.pos[id]; if (!p) throw new Error("no layout for " + id); return p; };
  const lbox = (id, slot, lines, o) => () => { const [x, y, w, h] = P(slot); return box(id, x, y, w, h, lines, o)(); };
  const lnote = (id, slot, lines, o) => () => { const [x, y] = P(slot); return note(id, x + 5, y + 5, lines, o)(); };
  const lframe = (id, group, title, o) => () => { const [x, y, w, h] = P(group); return frame(id, x, y + 70, w, h - 70, title, o)(); };
  const cross = (id, slot) => () => {
    const [x, y, w, h] = P(slot);
    return place(id, "bad", "strike", world, (g) => {
      g.appendChild(sketch(poly([[x + 8, y + 8], [x + w - 8, y + h - 8]]), { roughness: 1.4 }));
      g.appendChild(sketch(poly([[x + w - 8, y + 8], [x + 8, y + h - 8]]), { roughness: 1.4 }));
    });
  };
  // A short red slash across the middle of an arrow that is already on the board.
  const cut = (id, linkId) => () => {
    const p = els.get(linkId).querySelector(".guide"), L = p.getTotalLength();
    const a = p.getPointAtLength(L * 0.5 - 10), b = p.getPointAtLength(L * 0.5 + 10);
    const dx = b.x - a.x, dy = b.y - a.y, n = Math.hypot(dx, dy), ux = -dy / n, uy = dx / n;
    const m = [(a.x + b.x) / 2, (a.y + b.y) / 2];
    return place(id, "bad", "strike", world, (g) =>
      g.appendChild(sketch(poly([[m[0] - ux * 36 - dx, m[1] - uy * 36 - dy], [m[0] + ux * 36 + dx, m[1] + uy * 36 + dy]]), { roughness: 1.4 })));
  };
  // An arrow from slot a to slot b, centre to centre, cut at both borders. `offset` moves it
  // sideways (so a request and its reply don't overlap); the label goes beside it.
  const link = (id, a, b, o = {}) => () => {
    const A = P(a), B = P(b), size = o.size || 26;
    let c1 = [A[0] + A[2] / 2, A[1] + A[3] / 2], c2 = [B[0] + B[2] / 2, B[1] + B[3] / 2];
    const dx = c2[0] - c1[0], dy = c2[1] - c1[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    const off = (o.offset || 0) * 26;
    c1 = [c1[0] + nx * off, c1[1] + ny * off]; c2 = [c2[0] + nx * off, c2[1] + ny * off];
    const exit = (c, to, [x, y, w, h], m) => {
      const ex = to[0] - c[0], ey = to[1] - c[1];
      let t = Infinity;
      if (ex) t = Math.min(t, ((ex > 0 ? x + w + m : x - m) - c[0]) / ex);
      if (ey) t = Math.min(t, ((ey > 0 ? y + h + m : y - m) - c[1]) / ey);
      return [c[0] + ex * t, c[1] + ey * t];
    };
    const p1 = exit(c1, c2, A, 6), p2 = exit(c2, c1, B, 10), opts = Object.assign({ size }, o);
    if (o.label) {
      // Try spots along the arrow, on both sides, and take the first whose label box
      // overlaps no text or box already on the board.
      const lw = o.label.length * size * 0.56, lh = size * 1.3;
      const d = Math.abs(nx) * (lw / 2 + 16) + Math.abs(ny) * (lh / 2 + 10);
      const taken = [];
      els.forEach((g) => {
        if (g.classList.contains("frame")) return;
        g.querySelectorAll(".txt").forEach((t) => taken.push(t.getBBox()));
        if (g.dataset.box) { const [x, y, w, h] = g.dataset.box.split(",").map(Number); taken.push({ x, y, width: w, height: h }); }
      });
      const free = (cx, cy) => taken.every((q) =>
        cx + lw / 2 + 6 < q.x || cx - lw / 2 - 6 > q.x + q.width || cy + lh / 2 + 6 < q.y || cy - lh / 2 - 6 > q.y + q.height);
      const sides = o.side ? [o.side, -o.side] : [1, -1];
      let best = null;
      search: for (const t of [0.5, 0.4, 0.6, 0.3, 0.7]) for (const side of sides) {
        const cx = p1[0] + (p2[0] - p1[0]) * t + nx * side * d, cy = p1[1] + (p2[1] - p1[1]) * t + ny * side * d;
        if (!best) best = [cx, cy];
        if (free(cx, cy)) { best = [cx, cy]; break search; }
      }
      opts.at = [best[0], best[1] - size * 0.72];
    }
    return arrow(id, [p1, p2], opts)();
  };
"""


def text_size(lines, size):
    return max(len(line) for line in lines) * size * CHAR_W, len(lines) * size * 1.3


class Board:
    def __init__(self, *, elk_sha256=None):
        self.elk_sha256 = elk_sha256
        self.sizes = {}   # slot -> [w, h]
        self.groups = {}  # group id -> (kind, members, opts)
        self.components = []

    # ---------- elements (each returns the JS op for a step's `ops`) ----------
    def _slot(self, slot, w, h):
        cw, ch = self.sizes.get(slot, (0, 0))
        self.sizes[slot] = [max(cw, round(w)), max(ch, round(h))]

    def box(self, id, lines, *, k="old", size=26, w=None, h=None, slot=None):
        tw, th = text_size(lines, size) if lines else (0, 0)
        slot = slot or id
        self._slot(slot, w or tw + 70, h or th + 56)
        return f"lbox({j(id)}, {j(slot)}, {j(lines)}, {j({'k': k, 'size': size})})"

    def note(self, id, lines, *, k="new", size=24, slot=None):
        tw, th = text_size(lines, size)
        slot = slot or id
        self._slot(slot, tw + 10, th + 10)
        return f"lnote({j(id)}, {j(slot)}, {j(lines)}, {j({'k': k, 'size': size})})"

    def link(self, id, a, b, *, k="old", label=None, dash=False, offset=0, side=0, size=26):
        """An arrow between two slots. `side` (1 or -1) is the preferred label side."""
        o = {"k": k, "dash": dash, "offset": offset, "size": size}
        if side:
            o["side"] = side
        if label:
            o["label"] = label
        return f"link({j(id)}, {j(a)}, {j(b)}, {j(o)})"

    def cross(self, id, slot):
        return f"cross({j(id)}, {j(slot)})"

    def cut(self, id, link_id):
        return f"cut({j(id)}, {j(link_id)})"

    def frame(self, id, group, title, *, k="old"):
        """A dashed frame around a group; give the group pad_top=100 to leave room for the title."""
        return f"lframe({j(id)}, {j(group)}, {j(title)}, {j({'k': k})})"

    # ---------- arrangement ----------
    def group(self, id, kind, *members, gap=24, row_gap=None, pad=0, pad_top=None, align="start", reverse_narrow=False,
              axis=None):
        self.groups[id] = (kind, list(members), {
            "gap": gap, "row_gap": gap if row_gap is None else row_gap, "pad": pad, "axis": axis,
            "pad_top": pad if pad_top is None else pad_top, "align": align, "reverse_narrow": reverse_narrow})
        return id

    def component(self, id, nodes, edges=()):
        """Top-level nodes (slots or groups) that ELK lays out together; edges are [from, to]."""
        self.components.append({"id": id, "nodes": list(nodes), "edges": list(edges)})

    def _kind(self, kind, v):
        if kind == "flow":
            return "stack" if v["narrow"] else "row"
        if kind == "rflow":
            return "row" if v["narrow"] else "stack"
        return kind

    def _members(self, node, v):
        kind, members, o = self.groups[node]
        return members[::-1] if v["narrow"] and o["reverse_narrow"] else members

    def _row_xs(self, row, o, v):
        """x of each member relative to the centre line, the row's extent left and right of
        the line, and its height (one row of a rows group)."""
        sizes = [self._measure(m, v) for m in row]
        gap = o["gap"]
        if o["axis"] in row:
            k = row.index(o["axis"])
            xs = [0.0] * len(row)
            xs[k] = -sizes[k][0] / 2
            for i in range(k - 1, -1, -1):
                xs[i] = xs[i + 1] - gap - sizes[i][0]
            for i in range(k + 1, len(row)):
                xs[i] = xs[i - 1] + sizes[i - 1][0] + gap
        elif len(row) == 2:
            xs = [-gap / 2 - sizes[0][0], gap / 2]
        else:
            xs, x = [], -(sum(s[0] for s in sizes) + gap * (len(row) - 1)) / 2
            for w, _ in sizes:
                xs.append(x)
                x += w + gap
        left = -min(xs)
        right = max(x + s[0] for x, s in zip(xs, sizes))
        return xs, left, right, max(s[1] for s in sizes)

    def _measure(self, node, v):
        if node not in self.groups:
            if node not in self.sizes:
                raise KeyError(f"{node!r} is in a group or component but no element uses it")
            return self.sizes[node]
        kind, _, o = self.groups[node]
        members, kind = self._members(node, v), self._kind(kind, v)
        if kind == "rows":
            rows = [self._row_xs(r, o, v) for r in members]
            w = max(r[1] for r in rows) + max(r[2] for r in rows)
            h = sum(r[3] for r in rows) + o["row_gap"] * (len(rows) - 1)
        else:
            sizes = [self._measure(m, v) for m in members]
            gaps = o["gap"] * (len(members) - 1)
            if kind == "stack":
                w, h = max(s[0] for s in sizes), sum(s[1] for s in sizes) + gaps
            else:
                w, h = sum(s[0] for s in sizes) + gaps, max(s[1] for s in sizes)
        return [w + 2 * o["pad"], h + o["pad"] + o["pad_top"]]

    def _place(self, node, x, y, v, pos):
        w, h = self._measure(node, v)
        pos[node] = [round(x), round(y), w, h]
        if node not in self.groups:
            return
        kind, _, o = self.groups[node]
        members, kind = self._members(node, v), self._kind(kind, v)
        cx, cy = x + o["pad"], y + o["pad_top"]
        inner_w, inner_h = w - 2 * o["pad"], h - o["pad"] - o["pad_top"]
        if kind == "rows":
            mid = cx + max(self._row_xs(r, o, v)[1] for r in members)
            for row in members:
                xs, _, _, rh = self._row_xs(row, o, v)
                for m, mx in zip(row, xs):
                    mh = self._measure(m, v)[1]
                    self._place(m, mid + mx, cy + (rh - mh) / 2, v, pos)
                cy += rh + o["row_gap"]
            return
        for m in members:
            mw, mh = self._measure(m, v)
            if kind == "stack":
                self._place(m, cx + ((inner_w - mw) / 2 if o["align"] == "center" else 0), cy, v, pos)
                cy += mh + o["gap"]
            else:
                self._place(m, cx, cy + ((inner_h - mh) / 2 if o["align"] == "center" else 0), v, pos)
                cx += mw + o["gap"]

    def layouts(self):
        if self.elk_sha256:
            got = hashlib.sha256(ELK_FILE.read_bytes()).hexdigest()
            if got != self.elk_sha256:
                raise RuntimeError(f"{ELK_FILE} has sha256 {got}, but this board expects {self.elk_sha256}; not running it")
        out = {}
        for v in VARIANTS:
            comps = [{"id": c["id"],
                      "nodes": [{"id": n, "w": self._measure(n, v)[0], "h": self._measure(n, v)[1]} for n in c["nodes"]],
                      "edges": c["edges"]} for c in self.components]
            res = subprocess.run(["bun", str(HERE / "layout.mjs")], input=j({"variants": [v], "components": comps, "elk_sha256": self.elk_sha256}),
                                 capture_output=True, text=True, cwd=HERE)
            if res.returncode:
                raise RuntimeError(f"layout.mjs failed:\n{res.stderr}")
            lay = json.loads(res.stdout)[v["name"]]
            pos = {}
            for c in self.components:
                for n in c["nodes"]:
                    x, y, _, _ = lay["pos"][n]
                    self._place(n, x, y, v, pos)
            # Pad the world to the board's aspect ratio, content centred.
            W, H = lay["size"]
            W2, H2 = (H * v["aspect"], H) if W / H < v["aspect"] else (W, W / v["aspect"])
            dx, dy = (W2 - W) / 2, (H2 - H) / 2
            pos = {k: [round(p[0] + dx), round(p[1] + dy), p[2], p[3]] for k, p in pos.items()}
            out[v["name"]] = {"pos": pos, "size": [round(W2), round(H2)], "aspect": v["aspect"], "narrow": v["narrow"]}
        return out


def story_js(board, steps):
    """The STORY_JS for wb.build(): helpers, both layouts, and one S.push per step.
    A step is a dict: ops (from Board methods), and optionally erase, mute, focus, packets,
    and cam ("full" for the whole board)."""
    lines = [HELPERS_JS, f"  LAYOUTS = {j(board.layouts())};", "  const S = [];"]
    for st in steps:
        st = dict(st)
        ops = st.pop("ops")
        head = "".join(f"{k}: {j(v)}, " for k, v in st.items())
        lines.append("  S.push({ " + head + "ops: [\n    " + ",\n    ".join(ops) + ",\n  ] });")
    return "\n".join(lines) + "\n"
