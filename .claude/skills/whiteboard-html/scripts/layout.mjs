// Reads a board graph on stdin, lays it out with ELK once per variant, prints positions.
// Input:  { variants: [{ name, direction, aspect, pack, layerGap, nodeGap }],
//           components: [{ id, nodes: [{ id, w, h }], edges: [[from, to]] }] }
// Output: { <variant>: { pos: { id: [x, y, w, h] }, size: [w, h] } }
// Each component gets ELK's layered algorithm. Then the components are packed: "rect" lets
// ELK's rectpacking arrange them for the aspect ratio (wide boards); "column" stacks them in
// story order (phones, which read top to bottom).
// Bun defines `self` and has no `document`, so elkjs's worker file thinks it is inside a web
// worker and waits for messages forever. A placeholder `document` while elkjs sets up (the
// worker file loads inside `new ELK()`) makes it use its in-process worker; then it goes.
//
// ELK is the copy bundled with the skill (assets/elk.bundled.js, elkjs 0.12.0, checked against
// the npm registry tarball), not an npm install. It only loads if its hash still matches.
const ELK_PATH = `${import.meta.dir}/../assets/elk.bundled.js`;
const ELK_SHA256 = "1222e44f953ce7746af23801e723708f8e6f436b8b377a6a5fc7552f34a307b3";
const got = new Bun.CryptoHasher("sha256").update(await Bun.file(ELK_PATH).arrayBuffer()).digest("hex");
if (got !== ELK_SHA256) throw new Error(`${ELK_PATH} has sha256 ${got}, expected ${ELK_SHA256}; not loading it`);
// The board can also pin the hash from its own repo (Board(elk_sha256=...)); both must match.
const input = JSON.parse(await Bun.stdin.text());
if (input.elk_sha256 && input.elk_sha256 !== got) throw new Error(`${ELK_PATH} has sha256 ${got}, the board expects ${input.elk_sha256}; not loading it`);

globalThis.document = {};
const { default: ELK } = await import(ELK_PATH);
const elk = new ELK();
delete globalThis.document;
// GAP separates the parts of the board; phones get more, because their tall frames reach further.
const MARGIN = 60;
const out = {};

for (const v of input.variants) {
  const parts = [];
  for (const c of input.components) {
    const res = await elk.layout({
      id: c.id,
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": v.direction,
        "elk.spacing.nodeNode": String(v.nodeGap ?? 70),
        "elk.layered.spacing.nodeNodeBetweenLayers": String(v.layerGap ?? 240),
        "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
        "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
        "elk.padding": "[top=0,left=0,bottom=0,right=0]",
      },
      children: c.nodes.map((n) => ({ id: n.id, width: n.w, height: n.h })),
      edges: c.edges.map(([s, t], i) => ({ id: `${c.id}_e${i}`, sources: [s], targets: [t] })),
    });
    parts.push(res);
  }

  const GAP = v.pack === "column" ? 200 : 140;
  let at;
  if (v.pack === "column") {
    const W = Math.max(...parts.map((p) => p.width));
    let y = MARGIN;
    at = parts.map((p) => { const xy = [MARGIN + (W - p.width) / 2, y]; y += p.height + GAP; return xy; });
    out[v.name] = { size: [W + 2 * MARGIN, y - GAP + MARGIN] };
  } else {
    const packed = await elk.layout({
      id: "root",
      layoutOptions: {
        "elk.algorithm": "rectpacking",
        "elk.aspectRatio": String(v.aspect),
        "elk.spacing.nodeNode": String(GAP),
        "elk.padding": `[top=${MARGIN},left=${MARGIN},bottom=${MARGIN},right=${MARGIN}]`,
      },
      children: parts.map((p) => ({ id: p.id, width: p.width, height: p.height })),
    });
    at = packed.children.map((c) => [c.x, c.y]);
    out[v.name] = { size: [packed.width, packed.height] };
  }

  const pos = {};
  parts.forEach((p, i) => {
    for (const n of p.children) pos[n.id] = [at[i][0] + n.x, at[i][1] + n.y, n.width, n.height];
  });
  out[v.name].pos = pos;
}

console.log(JSON.stringify(out));
