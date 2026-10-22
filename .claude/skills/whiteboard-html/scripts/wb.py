"""Shared engine for the animated whiteboard docs (rough.js sketch style).

A board script supplies STEPS (heading, body, open-line) and STORY_JS, the
`S.push({...})` calls that draw each step, then calls build().
"""
import html
import json
from pathlib import Path

CSS = r"""
@font-face { font-family: "Excalifont"; font-display: swap;
  src: url("https://unpkg.com/@excalidraw/excalidraw@0.18.0/dist/prod/fonts/Excalifont/Excalifont-Regular-a88b72a24fb54c9f94e3b5fdaa7481c9.woff2") format("woff2"); }
:root {
  --paper: #fdfdfb; --ink: #1e1e1e; --muted: #9a9a9a; --grid: #e6e6e6;
  --new: #e8590c; --newtext: #c2410c; --newfill: #fff0e0; --oldfill: #f1f3f5;
  --bad: #e03131; --badfill: #fff0f0; --hl: rgba(255, 212, 59, .55);
  --panel: #ffffff; --line: #dee2e6; --soft: #495057;
  --hand: "Excalifont", "Comic Sans MS", cursive;
  --mono: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
}
:root[data-slashdocs-theme="dark"], :root[data-aidocs-theme="dark"] {
  --paper: #161616; --ink: #e4e4e4; --muted: #6f6f6f; --grid: #242424;
  --new: #ff922b; --newtext: #ffa94d; --newfill: #3a2412; --oldfill: #232323;
  --bad: #ff6b6b; --badfill: #3a1717; --hl: rgba(255, 212, 59, .22);
  --panel: #1c1c1c; --line: #2e2e2e; --soft: #adb5bd;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-slashdocs-theme]):not([data-aidocs-theme]) {
    --paper: #161616; --ink: #e4e4e4; --muted: #6f6f6f; --grid: #242424;
    --new: #ff922b; --newtext: #ffa94d; --newfill: #3a2412; --oldfill: #232323;
    --bad: #ff6b6b; --badfill: #3a1717; --hl: rgba(255, 212, 59, .22);
    --panel: #1c1c1c; --line: #2e2e2e; --soft: #adb5bd; color-scheme: dark;
  }
}
html { color-scheme: light; }
:root[data-slashdocs-theme="dark"], :root[data-aidocs-theme="dark"] { color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--paper); color: var(--ink);
  font: 16px/1.55 system-ui, -apple-system, "Segoe UI", sans-serif; }
main { max-width: 1180px; margin: 0 auto; padding: 20px 20px 48px; }
header h1 { font: 700 30px/1.2 var(--hand); margin: 0 0 4px; }
header p { margin: 0 0 14px; color: var(--soft); }
code { font: .88em var(--mono); background: var(--oldfill); padding: 1px 5px; border-radius: 4px; }

.board { position: relative; width: 100%; aspect-ratio: 16 / 9; border: 1px solid var(--line);
  border-radius: 12px; overflow: hidden; cursor: pointer; background-color: var(--paper);
  background-image: radial-gradient(var(--grid) 1.2px, transparent 1.3px); background-size: 22px 22px; }
#board { width: 100%; height: 100%; display: block; }
#board text { font-family: var(--hand); fill: var(--ink); }
#board .code { font-family: var(--mono); font-size: .8em; }
#board .s { fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
.k-old .s { stroke: var(--ink); }    .k-old .ff { fill: var(--oldfill); }
.k-new .s { stroke: var(--new); }    .k-new .ff { fill: var(--newfill); }
.k-bad .s { stroke: var(--bad); }    .k-bad .ff { fill: var(--badfill); }
.k-mute .s { stroke: var(--muted); } .k-mute .ff { fill: none; }
.k-mute text { fill: var(--muted) !important; }
.note.k-new text, .lbl.k-new text { fill: var(--newtext); }
.note.k-bad text, .lbl.k-bad text { fill: var(--bad); }
.lbl text { paint-order: stroke; stroke: var(--paper); stroke-width: 7px; stroke-linejoin: round; }
.hlr { fill: var(--hl); }
.guide { fill: none; stroke: none; }
.pk { fill: var(--new); stroke: var(--paper); stroke-width: 3; }

.controls { display: flex; align-items: center; gap: 10px; margin: 12px 0 0; flex-wrap: wrap; }
.controls button { font: 600 15px system-ui, sans-serif; padding: 8px 16px; border-radius: 8px; cursor: pointer;
  border: 1.5px solid var(--ink); background: var(--panel); color: var(--ink); }
.controls button.primary { background: var(--new); border-color: var(--new); color: #fff; }
.controls button:disabled { opacity: .35; cursor: default; }
.dots { display: flex; gap: 6px; flex-wrap: wrap; }
.dots button { width: 12px; height: 12px; padding: 0; border-radius: 50%; border: 1.5px solid var(--muted); background: none; }
.dots button.on { background: var(--new); border-color: var(--new); }
.dots button.seen { background: var(--muted); }
.hint { color: var(--soft); font-size: 13px; margin-left: auto; }

.say { margin-top: 14px; padding: 16px 20px; border: 1px solid var(--line); border-radius: 12px;
  background: var(--panel); min-height: 150px; }
.say h3, #script h3 { font: 700 23px/1.25 var(--hand); margin: 0 0 6px; }
.say p, #script p { margin: 6px 0; }
.say .refs, #script .refs { font-size: 13.5px; color: var(--soft); }
.say .n { color: var(--new); font: 700 15px var(--hand); }
details { margin-top: 18px; }
summary { cursor: pointer; color: var(--soft); }
#script li { margin: 14px 0; }
/* Phones held sideways (or a board in full screen): use the full width, because width is
   what makes the text readable. Tapping the board advances it; the controls are a short
   scroll below. Fitting the board to the height instead would shrink the text again. */
@media (orientation: landscape) and (max-height: 600px) {
  main { padding: 6px 8px 24px; }
  header, .hint { display: none; }
}
.rotate-hint { display: none; margin: 0 0 10px; color: var(--soft); font-size: 14px; }
@media (orientation: portrait) and (max-width: 600px) { .rotate-hint { display: block; } }
.wb-embed .rotate-hint { display: none; }
/* phones get a portrait board with its own layout (see useLayout) */
.board.narrow { aspect-ratio: 3 / 4; }
.has-narrow .rotate-hint { display: none !important; }
/* ?embed=1: the host page (e.g. a blog post) supplies the title and lede */
.wb-embed body { background: transparent; }
.wb-embed main { max-width: none; padding: 0 0 8px; }
.wb-embed header { display: none; }
@media (max-width: 640px) { .hint { display: none; } header h1 { font-size: 24px; } }
"""

ENGINE_JS = r"""
(() => {
  if (window.__wbInit) return;
  window.__wbInit = true;

  // Embedding: ?embed=1 hides the header; ?theme=dark|light sets the palette. A parent
  // page can send {type: "wb-theme", theme} and gets {type: "wb-height", height} back.
  const params = new URLSearchParams(location.search);
  const root = document.documentElement;
  if (params.has("embed")) root.classList.add("wb-embed");
  const setTheme = (t) => { if (t === "dark" || t === "light") root.setAttribute("data-slashdocs-theme", t); };
  setTheme(params.get("theme"));
  if (window.parent !== window) {
    window.addEventListener("message", (e) => {
      if (e.source === window.parent && e.data && e.data.type === "wb-theme") setTheme(e.data.theme);
    });
    let lastH = 0;
    const report = () => {
      // body, not documentElement: the root is never shorter than the iframe itself,
      // so its height would only ever grow (e.g. after collapsing the text list).
      const h = Math.ceil(document.body.getBoundingClientRect().height);
      if (h !== lastH) { lastH = h; window.parent.postMessage({ type: "wb-height", height: h }, "*"); }
    };
    new ResizeObserver(report).observe(document.body);
    window.addEventListener("load", report);
  }

  const NS = "http://www.w3.org/2000/svg";
  const $ = (s) => document.querySelector(s);
  const svg = $("#board"), world = $("#world"), under = $("#under"), fx = $("#fx"), defs = $("#defs");
  const mk = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const rc = window.rough ? window.rough.svg(svg) : null;
  const SK = "#010101", FL = "#020202";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seed = 11, uid = 0;

  // ---------- drawing primitives ----------
  const rrect = (x, y, w, h, r = 14) =>
    `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}` +
    `H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
  const poly = (pts) => "M" + pts.map((p) => p.join(" ")).join("L");

  function sketch(d, { fill = false, dash = false, roughness = 1.1 } = {}) {
    let g;
    if (rc) {
      const o = { stroke: SK, strokeWidth: 2, roughness, bowing: 1, seed: seed++ };
      if (fill) Object.assign(o, { fill: FL, fillStyle: "solid" });
      if (dash) o.strokeLineDash = [12, 9];
      g = rc.path(d, o);
    } else {
      g = mk("g");
      if (fill) mk("path", { d, fill: FL, stroke: "none" }, g);
      mk("path", { d, fill: "none", stroke: SK, "stroke-dasharray": dash ? "12 9" : "none" }, g);
    }
    g.querySelectorAll("path").forEach((p) => {
      if (p.getAttribute("stroke") === SK) p.classList.add("s");
      if (p.getAttribute("fill") === FL) p.classList.add("ff");
    });
    return g;
  }

  function textBlock(lines, { x = 0, y = 0, size = 26, anchor = "middle", box = null }) {
    const g = mk("g", { class: "txt" });
    const lh = size * 1.3;
    let y0 = y + size;
    if (box) { x = box.x + box.w / 2; y0 = box.y + box.h / 2 - (lines.length * lh) / 2 + size * 0.98; }
    lines.forEach((line, i) => {
      const t = mk("text", { x, y: y0 + i * lh, "text-anchor": anchor, "font-size": size }, g);
      line.split("`").forEach((seg, j) => {
        if (!seg) return;
        const s = mk("tspan", j % 2 ? { class: "code" } : {}, t);
        s.textContent = seg;
      });
    });
    return g;
  }

  // ---------- elements ----------
  const els = new Map();
  function place(id, kind, cls, layer, build) {
    const g = mk("g", { class: `el k-${kind} ${cls}` }, layer);
    g.dataset.id = id;
    build(g);
    els.set(id, g);
    return g;
  }
  const box = (id, x, y, w, h, lines, o = {}) => () =>
    place(id, o.k || "old", "box", world, (g) => {
      g.dataset.box = [x, y, w, h].join(",");
      g.appendChild(sketch(rrect(x, y, w, h), { fill: o.fill !== false }));
      if (lines.length) g.appendChild(textBlock(lines, { size: o.size || 26, box: { x, y, w, h } }));
    });
  const frame = (id, x, y, w, h, title, o = {}) => () =>
    place(id, o.k || "old", "frame", world, (g) => {
      g.appendChild(sketch(rrect(x, y, w, h, 22), { dash: true, roughness: 0.8 }));
      g.appendChild(textBlock([title], { x: x + 8, y: y - 44, size: 30, anchor: "start" }));
    });
  const note = (id, x, y, lines, o = {}) => () =>
    place(id, o.k || "new", "note", world, (g) =>
      g.appendChild(textBlock(lines, { x, y, size: o.size || 24, anchor: o.anchor || "start" })));
  const arrow = (id, pts, o = {}) => () =>
    place(id, o.k || "old", "arrow", world, (g) => {
      g.appendChild(sketch(poly(pts), { dash: o.dash, roughness: 0.9 }));
      if (o.head !== false) {
        const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]), L = 17;
        const wing = (s) => [b[0] - L * Math.cos(ang + s), b[1] - L * Math.sin(ang + s)];
        g.appendChild(sketch(poly([wing(0.45), b, wing(-0.45)]), { roughness: 0.6 }));
      }
      mk("path", { d: poly(pts), class: "guide" }, g);
      if (o.label) {
        const lg = mk("g", { class: `lbl k-${o.k || "old"}` }, g);
        lg.appendChild(textBlock([o.label], { x: o.at[0], y: o.at[1], size: o.size || 22, anchor: o.anchor || "middle" }));
      }
    });
  const strike = (id, x1, y1, x2, y2) => () =>
    place(id, "bad", "strike", world, (g) => g.appendChild(sketch(poly([[x1, y1], [x2, y2]]), { roughness: 1.4 })));
  const hl = (id, x, y, w, h) => () =>
    place(id, "new", "hl", under, (g) => {
      const t = mk("g", { class: "txt" }, g);
      mk("path", { d: rrect(x, y, w, h, 18), class: "hlr" }, t);
    });

  // ---------- timing ----------
  let tweens = [], packets = [], frameReq = 0;
  const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  function tween(delay, dur, fn, done) {
    tweens.push({ start: performance.now() + delay, dur, fn, done });
    fn(0);
    loop();
  }
  function finishAll() {
    const t = tweens; tweens = [];
    t.forEach((w) => { w.fn(1); w.done && w.done(); });
  }
  function loop() {
    if (frameReq) return;
    frameReq = requestAnimationFrame(tick);
  }
  function tick(now) {
    frameReq = 0;
    tweens = tweens.filter((w) => {
      const k = Math.min(1, Math.max(0, (now - w.start) / w.dur));
      w.fn(ease(k));
      if (k >= 1) { w.done && w.done(); return false; }
      return true;
    });
    packets.forEach((p) => {
      const phase = (now - p.t0) % p.period - p.delay;
      const k = phase / p.dur;
      if (now < p.t0 || k < 0 || k > 1) { p.dot.style.display = "none"; return; }
      const pt = p.path.getPointAtLength(p.len * ease(k));
      p.dot.style.display = "";
      p.dot.setAttribute("cx", pt.x); p.dot.setAttribute("cy", pt.y);
    });
    if (tweens.length || packets.length) loop();
  }

  function reveal(g, t0, dur) {
    g.querySelectorAll("path.s").forEach((p) => {
      const dashed = (p.getAttribute("stroke-dasharray") || "none") !== "none";
      if (dashed) { tween(t0, dur, (k) => (p.style.opacity = k), () => (p.style.opacity = "")); return; }
      const L = p.getTotalLength();
      p.style.strokeDasharray = `${L} ${L}`;
      tween(t0, dur, (k) => (p.style.strokeDashoffset = L * (1 - k)),
        () => { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; });
    });
    g.querySelectorAll("path.ff").forEach((p) =>
      tween(t0 + dur * 0.3, dur * 0.7, (k) => (p.style.opacity = k), () => (p.style.opacity = "")));
    g.querySelectorAll(".txt").forEach((t) => {
      const b = t.getBBox(), id = `wb-clip-${uid++}`;
      const cp = mk("clipPath", { id, clipPathUnits: "userSpaceOnUse" }, defs);
      const r = mk("rect", { x: b.x - 6, y: b.y - 8, width: 0, height: b.height + 16 }, cp);
      t.setAttribute("clip-path", `url(#${id})`);
      tween(t0 + dur * 0.3, dur, (k) => r.setAttribute("width", (b.width + 12) * k),
        () => { t.removeAttribute("clip-path"); cp.remove(); });
    });
  }

  let vb = [0, 0, 2600, 1462];
  const setVB = (v) => { vb = v; svg.setAttribute("viewBox", v.map((n) => n.toFixed(1)).join(" ")); };
  function camTo(v, instant) {
    if (instant) return setVB(v);
    const from = vb.slice();
    tween(0, 900, (k) => setVB(from.map((a, i) => a + (v[i] - a) * k)));
  }

  // ---------- automatic camera ----------
  // A step without `cam` is framed from what it draws: its new elements, the ids in its
  // `focus` list, and the arrows its packets travel on. Narrow displays (phones) get a
  // tighter frame with a smaller minimum width, which is what keeps text readable there.
  let BOARD_W = 2600, BOARD_H = 1462, ASPECT = 16 / 9;
  const NARROW = 520;
  // Boards built with layouts (ELK, at build time) carry a wide and a narrow layout; the
  // story sets LAYOUTS. Narrow displays get the narrow layout on a portrait board.
  let LAYOUTS = null, LAY = null;
  const boardEl = $(".board");
  const layoutFor = (width) => (!LAYOUTS ? null : width < NARROW ? LAYOUTS.narrow : LAYOUTS.wide);
  function useLayout(l) {
    if (!l || l === LAY) return false;
    LAY = l; [BOARD_W, BOARD_H] = l.size; ASPECT = l.aspect;
    boardEl.classList.toggle("narrow", !!l.narrow);
    root.classList.toggle("has-narrow", true);
    setVB([0, 0, BOARD_W, BOARD_H]);
    return true;
  }
  const displayWidth = () => svg.getBoundingClientRect().width || 1000;
  const bboxOf = (g) => { const b = g.getBBox(); return b.width || b.height ? b : null; };
  function fit(bounds, width) {
    const [x0, y0, x1, y1] = bounds;
    const narrow = width < NARROW, pad = narrow ? 28 : 40, minW = narrow ? (LAY && LAY.narrow ? 560 : 640) : 1100;
    const w = Math.min(BOARD_W, Math.max(x1 - x0 + 2 * pad, (y1 - y0 + 2 * pad) * ASPECT, minW));
    const h = w / ASPECT;
    const x = Math.min(Math.max((x0 + x1) / 2 - w / 2, 0), BOARD_W - w);
    const y = Math.min(Math.max((y0 + y1) / 2 - h / 2, 0), BOARD_H - h);
    return [x, y, w, h];
  }
  function frameFor(ids, width) {
    let bounds = null;
    const grow = (b) => {
      bounds = bounds
        ? [Math.min(bounds[0], b.x), Math.min(bounds[1], b.y), Math.max(bounds[2], b.x + b.width), Math.max(bounds[3], b.y + b.height)]
        : [b.x, b.y, b.x + b.width, b.y + b.height];
    };
    ids.forEach((id) => { const g = els.get(id), b = g && bboxOf(g); if (b) grow(b); });
    if (!bounds) return [0, 0, BOARD_W, BOARD_H];
    // Don't leave a box half in view: pull in boxes the frame cuts through, as long as the
    // frame stays under the width cap that keeps text readable. Arrows and notes may run
    // off the edge; pulling those in too makes frames balloon.
    const cap = width < NARROW ? 900 : 1600;
    let frame = fit(bounds, width);
    for (let pass = 0; pass < 6; pass++) {
      const [fx, fy, fw, fh] = frame, before = bounds.slice();
      els.forEach((g) => {
        const b = bboxOf(g);
        if (!b || !g.classList.contains("box")) return;
        const cuts = b.x < fx + fw && b.x + b.width > fx && b.y < fy + fh && b.y + b.height > fy &&
          (b.x < fx || b.y < fy || b.x + b.width > fx + fw || b.y + b.height > fy + fh);
        if (cuts) grow(b);
      });
      const next = fit(bounds, width);
      if (next[2] > Math.max(cap, frame[2])) { bounds = before; break; }
      if (next.every((v, i) => Math.abs(v - frame[i]) < 1)) break;
      frame = next;
    }
    // Still cutting a box (or a note): slide the frame, keeping the step's own elements in
    // view, so it ends up fully inside or fully outside, whichever is the smaller move.
    const keeps = (x, y, [, , w, h]) =>
      x >= 0 && y >= 0 && x + w <= BOARD_W && y + h <= BOARD_H &&
      bounds[0] >= x && bounds[1] >= y && bounds[2] <= x + w && bounds[3] <= y + h;
    for (let pass = 0; pass < 4; pass++) {
      const [fx, fy, fw, fh] = frame;
      let moved = false;
      els.forEach((g) => {
        if (moved || !(g.classList.contains("box") || g.classList.contains("note"))) return;
        const b = bboxOf(g);
        if (!b) return;
        const inView = b.x < fx + fw && b.x + b.width > fx && b.y < fy + fh && b.y + b.height > fy;
        const inside = b.x >= fx && b.y >= fy && b.x + b.width <= fx + fw && b.y + b.height <= fy + fh;
        if (!inView || inside) return;
        const inX = b.x < fx ? b.x - fx - 6 : b.x + b.width > fx + fw ? b.x + b.width - fx - fw + 6 : 0;
        const inY = b.y < fy ? b.y - fy - 6 : b.y + b.height > fy + fh ? b.y + b.height - fy - fh + 6 : 0;
        const shifts = [[inX, inY]];
        if (b.y < fy) shifts.push([0, b.y + b.height - fy + 6]);
        if (b.y + b.height > fy + fh) shifts.push([0, b.y - fy - fh - 6]);
        if (b.x < fx) shifts.push([b.x + b.width - fx + 6, 0]);
        if (b.x + b.width > fx + fw) shifts.push([b.x - fx - fw - 6, 0]);
        shifts.sort((p, q) => Math.hypot(...p) - Math.hypot(...q));
        for (const [dx, dy] of shifts) {
          if (keeps(fx + dx, fy + dy, frame)) { frame = [fx + dx, fy + dy, fw, fh]; moved = true; return; }
        }
      });
      if (!moved) break;
    }
    return frame;
  }

  function startPackets(list, t0) {
    stopPackets();
    if (reduced) return;
    // `overlap` is how far into this packet's trip the next one starts: 0 runs them together.
    let at = 0, end = 0;
    const made = list.map((p) => {
      const path = els.get(p.via)?.querySelector(".guide");
      if (!path) return null;
      const len = path.getTotalLength(), dur = Math.max(500, len / 0.9), delay = at;
      at += dur * (p.overlap ?? 0.85);
      end = Math.max(end, delay + dur);
      const dot = mk("circle", { r: 11, class: "pk", style: "display:none" }, fx);
      return { path, len, dur, delay, dot };
    }).filter(Boolean);
    const period = end + 1400;
    made.forEach((p) => packets.push(Object.assign(p, { t0: performance.now() + t0, period })));
    loop();
  }
  function stopPackets() { packets.forEach((p) => p.dot.remove()); packets = []; }

  // ---------- the story ----------
"""

NAV_JS = r"""  // ---------- navigation ----------
  const CAP = JSON.parse(document.getElementById("captions").textContent);
  const dotsEl = $("#dots"), prev = $("#prev"), next = $("#next"), say = $("#say");
  const seen = new Set();
  let cur = -1;

  CAP.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", `Step ${i + 1}: ${c.h}`);
    btn.addEventListener("click", (e) => { e.stopPropagation(); go(i); });
    dotsEl.appendChild(btn);
  });

  function clearBoard() {
    stopPackets();
    tweens = [];
    [under, world, fx, defs].forEach((g) => g.replaceChildren());
    els.clear();
  }

  function applyStep(i, animate) {
    const st = S[i];
    (st.erase || []).forEach((id) => { const e = els.get(id); if (e) { e.remove(); els.delete(id); } });
    (st.mute || []).forEach((id) => {
      const e = els.get(id);
      if (!e) return;
      [...e.classList].filter((c) => c.startsWith("k-")).forEach((c) => e.classList.remove(c));
      e.classList.add("k-mute");
    });
    const made = st.ops.map((f) => f());
    if (animate) made.forEach((g, j) => reveal(g, 250 + j * 170, 650));
    return made;
  }

  const focusIds = (st, made) => [
    ...made.map((g) => g.dataset.id),
    ...(st.focus || []),
    ...(st.packets || []).map((p) => p.via),
  ];
  let lastFocus = [], lastNarrow = null;
  const camFor = (st, width) => (st.cam === "full" ? [0, 0, BOARD_W, BOARD_H] : st.cam) || frameFor(lastFocus, width);

  function go(n) {
    n = Math.max(0, Math.min(S.length - 1, n));
    const relaid = useLayout(layoutFor(displayWidth()));
    const forward = n === cur + 1 && cur >= 0 && !relaid;
    if (forward) { finishAll(); stopPackets(); }
    else { clearBoard(); for (let i = 0; i < n; i++) applyStep(i, false); }
    const animate = !reduced;
    const made = applyStep(n, animate), count = made.length;
    lastFocus = focusIds(S[n], made);
    lastNarrow = displayWidth() < NARROW;
    camTo(camFor(S[n], displayWidth()), !animate || cur < 0);
    startPackets(S[n].packets || [], animate ? 250 + count * 170 + 650 : 0);
    cur = n;
    seen.add(n);
    render();
  }

  function render() {
    const c = CAP[cur];
    say.innerHTML = "";
    const n = document.createElement("div"); n.className = "n"; n.textContent = `Step ${cur + 1} of ${CAP.length}`;
    const h = document.createElement("h3"); h.textContent = c.h;
    const p = document.createElement("p"); p.textContent = c.b;
    const r = document.createElement("p"); r.className = "refs"; r.innerHTML = "Open: " + c.o;
    say.append(n, h, p, r);
    prev.disabled = cur === 0;
    next.disabled = cur === CAP.length - 1;
    [...dotsEl.children].forEach((d, i) => {
      d.classList.toggle("on", i === cur);
      d.classList.toggle("seen", i !== cur && seen.has(i));
    });
  }

  new ResizeObserver(() => {
    const narrow = displayWidth() < NARROW;
    if (cur >= 0 && useLayout(layoutFor(displayWidth()))) {
      clearBoard();
      let made = [];
      for (let i = 0; i <= cur; i++) made = applyStep(i, false);
      lastFocus = focusIds(S[cur], made); lastNarrow = narrow;
      camTo(camFor(S[cur], displayWidth()), true);
      return;
    }
    if (cur < 0 || narrow === lastNarrow || S[cur].cam) return;
    lastNarrow = narrow;
    camTo(frameFor(lastFocus, displayWidth()), true);
  }).observe(svg);

  prev.addEventListener("click", (e) => { e.stopPropagation(); go(cur - 1); });
  next.addEventListener("click", (e) => { e.stopPropagation(); go(cur + 1); });
  $(".board").addEventListener("click", () => { if (cur < S.length - 1) go(cur + 1); });
  document.addEventListener("keydown", (e) => {
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "summary") return;
    if (e.key === "ArrowRight" || (e.key === " " && tag !== "button")) { e.preventDefault(); go(cur + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); }
  });

  // Layout check for authors: window.__wbCheck() rebuilds every step and lists elements
  // drawn outside that step's camera, text overflowing its box, duplicate ids, packets on
  // missing arrows, and steps whose smallest text renders under `minPx` at `width`.
  // Try __wbCheck({ width: 360 }) for phones; the default width is the current display.
  window.__wbCheck = (opts = {}) => {
    const width = opts.width || displayWidth(), minPx = opts.minPx || 11;
    const issues = [], ids = new Set();
    useLayout(layoutFor(width));
    S.forEach((st, i) => {
      clearBoard();
      for (let j = 0; j < i; j++) applyStep(j, false);
      const before = new Set(els.keys());
      const made = applyStep(i, false);
      lastFocus = focusIds(st, made);
      const [cx, cy, cw, ch] = camFor(st, width);
      let smallest = Infinity;
      made.forEach((g) => g.querySelectorAll("text").forEach((t) => {
        smallest = Math.min(smallest, (Number(t.getAttribute("font-size")) * width) / cw);
      }));
      const cut = [];
      els.forEach((g, id) => {
        const b = bboxOf(g);
        if (!b || g.classList.contains("frame") || g.classList.contains("hl")) return;
        const inView = b.x < cx + cw && b.x + b.width > cx && b.y < cy + ch && b.y + b.height > cy;
        const inside = b.x >= cx - 4 && b.y >= cy - 4 && b.x + b.width <= cx + cw + 4 && b.y + b.height <= cy + ch + 4;
        if (inView && !inside && g.classList.contains("box")) cut.push(id);
      });
      if (cut.length) issues.push(`step ${i + 1}: boxes cut by the frame edge: ${cut.join(", ")}`);
      // Text that overlaps another element's text or box (arrows crossing text aren't checked).
      const rectsOf = (g) => {
        const out = [...g.querySelectorAll(".txt")].map((t) => t.getBBox());
        if (g.dataset.box) { const [x, y, w, h] = g.dataset.box.split(",").map(Number); out.push({ x, y, width: w, height: h }); }
        return out;
      };
      const overlaps = (r, q) => Math.min(r.x + r.width, q.x + q.width) - Math.max(r.x, q.x) > 4 &&
        Math.min(r.y + r.height, q.y + q.height) - Math.max(r.y, q.y) > 4;
      made.forEach((g) => {
        const own = [...g.querySelectorAll(":scope > .txt, :scope > .lbl .txt, :scope > .txt")].map((t) => t.getBBox());
        if (!own.length) return;
        els.forEach((o, oid) => {
          if (o === g || o.classList.contains("frame") || o.classList.contains("hl")) return;
          if (rectsOf(o).some((q) => own.some((r) => overlaps(r, q))))
            issues.push(`step ${i + 1}: text in ${g.dataset.id} overlaps ${oid}`);
        });
      });
      // Arrows that run through a box they don't start or end at (new arrows or new boxes only).
      const boxes = [...els.values()].filter((g) => g.dataset.box);
      els.forEach((g, id) => {
        const guide = g.classList.contains("arrow") && g.querySelector(".guide");
        if (!guide) return;
        const pts = guide.getAttribute("d").slice(1).split("L").map((q) => q.trim().split(/\s+/).map(Number));
        boxes.forEach((bx) => {
          if (before.has(id) && before.has(bx.dataset.id)) return;
          const [x, y, w, h] = bx.dataset.box.split(",").map(Number);
          const inside = ([px, py]) => px > x - 4 && px < x + w + 4 && py > y - 4 && py < y + h + 4;
          if (inside(pts[0]) || inside(pts[pts.length - 1])) return;
          for (let k = 0; k + 1 < pts.length; k++) {
            const [ax, ay] = pts[k], [bx2, by2] = pts[k + 1];
            const hit = Array.from({ length: 21 }, (_, t) => [ax + ((bx2 - ax) * t) / 20, ay + ((by2 - ay) * t) / 20])
              .some(([px, py]) => px > x + 4 && px < x + w - 4 && py > y + 4 && py < y + h - 4);
            if (hit) { issues.push(`step ${i + 1}: arrow ${id} runs through ${bx.dataset.id}`); break; }
          }
        });
      });
      if (smallest < minPx && i < S.length - 1)
        issues.push(`step ${i + 1}: smallest text is ${smallest.toFixed(1)} px at ${Math.round(width)} px wide (camera ${Math.round(cw)} wide)`);
      if (Math.abs(cw / ch - ASPECT) > 0.05) issues.push(`step ${i + 1}: camera ${cw}x${ch} is not 16:9`);
      els.forEach((g, id) => {
        if (before.has(id)) return;
        if (ids.has(id)) issues.push(`step ${i + 1}: duplicate id ${id}`);
        ids.add(id);
        const b = g.getBBox(), pad = 4;
        if (b.x < cx - pad || b.y < cy - pad || b.x + b.width > cx + cw + pad || b.y + b.height > cy + ch + pad)
          issues.push(`step ${i + 1}: ${id} (${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.width)}x${Math.round(b.height)}) is outside the camera`);
        const t = g.querySelector(":scope > .txt");
        if (g.dataset.box && t) {
          const [bx, by, bw, bh] = g.dataset.box.split(",").map(Number), tb = t.getBBox();
          if (tb.x < bx + 6 || tb.x + tb.width > bx + bw - 6 || tb.y < by + 2 || tb.y + tb.height > by + bh - 2)
            issues.push(`step ${i + 1}: text in ${id} overflows its box (text ${Math.round(tb.width)}x${Math.round(tb.height)}, box ${bw}x${bh})`);
        }
      });
      (st.packets || []).forEach((p) => { if (!els.get(p.via)) issues.push(`step ${i + 1}: packet via missing arrow ${p.via}`); });
    });
    cur = -1; seen.clear(); go(0);
    return issues.length ? issues : ["ok: no layout issues"];
  };

  const start = () => go(0);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start, start); else start();
})();
"""


def inline_code(text):
    parts = html.escape(text).split("`")
    return "".join(f"<code>{p}</code>" if i % 2 else p for i, p in enumerate(parts))


ROUGH_DEFAULT = Path(__file__).resolve().parent.parent / "assets" / "rough.js"


def build(*, out, title, heading, lede_html, steps, story_js, rough_path=None):
    """Write one self-contained whiteboard HTML file to `out`."""
    ROUGH = Path(rough_path or ROUGH_DEFAULT).read_text()
    STEPS = steps
    script_items = "\n".join(
        f'<li><h3>{html.escape(h)}</h3><p>{html.escape(b)}</p>'
        f'<p class="refs">Open: {inline_code(o)}</p></li>'
        for h, b, o in STEPS
    )
    captions = json.dumps([{"h": h, "b": b, "o": inline_code(o)} for h, b, o in STEPS])
    STORY = ENGINE_JS + story_js + NAV_JS
    DOC = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<style>{CSS}</style>
</head>
<body>
<main>
<header>
<h1>{html.escape(heading)}</h1>
<p>{lede_html}</p>
</header>
<p class="rotate-hint">Turn your phone sideways for a bigger board.</p>
<div class="board" role="img" aria-label="Animated whiteboard. The same content is in the text walkthrough below.">
<svg id="board" viewBox="0 0 2600 1462" preserveAspectRatio="xMidYMid meet">
<defs id="defs"></defs><g id="under"></g><g id="world"></g><g id="fx"></g>
</svg>
</div>
<div class="controls">
<button type="button" id="prev">◀ Back</button>
<button type="button" id="next" class="primary">Next ▶</button>
<div class="dots" id="dots"></div>
<span class="hint">→ or Space: next · ←: back</span>
</div>
<div class="say" id="say" aria-live="polite"><h3>{html.escape(STEPS[0][0])}</h3><p>{html.escape(STEPS[0][1])}</p></div>
<details>
<summary>Read the whole walkthrough as text</summary>
<ol id="script">
{script_items}
</ol>
</details>
</main>
<script type="application/json" id="captions">{captions}</script>
<script>
/* rough.js 4.6.6, (c) Preet Shihn, MIT License, https://github.com/rough-stuff/rough */
{ROUGH}
</script>
<script>{STORY}</script>
</body>
</html>
"""
    Path(out).write_text(DOC)
    print(f"wrote {out} ({len(DOC):,} bytes, {len(STEPS)} steps)")
