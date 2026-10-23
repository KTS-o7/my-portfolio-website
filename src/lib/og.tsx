import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

// sRGB approximations of the light tokens in globals.css (Satori has no oklch).
const C = {
  paper: "#f9f7ef",
  grid: "rgba(176, 207, 234, 0.32)",
  ink: "#103065",
  tx2: "#4c5666",
  acc: "rgba(201, 48, 45, 0.75)",
  accText: "#c9302d",
  rule2: "rgba(16, 48, 101, 0.5)",
};

const FONT_DIR = path.join(process.cwd(), "src", "assets", "og");

const loadFonts = async () => {
  const [serif, mono] = await Promise.all([
    fs.readFile(path.join(FONT_DIR, "Newsreader-Medium.ttf")),
    fs.readFile(path.join(FONT_DIR, "IBMPlexMono-Regular.ttf")),
  ]);
  return [
    { name: "Newsreader", data: serif, weight: 500 as const, style: "normal" as const },
    { name: "IBM Plex Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
};

// Long titles step down in size so they always fit above the footer.
const titleSize = (title: string) =>
  title.length <= 34 ? 92 : title.length <= 56 ? 76 : title.length <= 80 ? 64 : 56;

// The share card: a margin note left of the red rule, a mono kicker, the title pushed
// to the bottom, and a footer row under a rule. Paper with a 30px grid.
export async function renderOgCard({
  margin,
  kicker,
  title,
  footerLeft,
  footerRight,
}: {
  margin: string[];
  kicker: string;
  title: string;
  footerLeft: string;
  footerRight: string;
}) {
  const size = titleSize(title);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: C.paper,
          backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          fontFamily: "Newsreader",
        }}
      >
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 200, width: 3, backgroundColor: C.acc }} />
        <div
          style={{
            width: 200,
            padding: "56px 28px 0 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            fontFamily: "IBM Plex Mono",
            fontSize: 20,
            lineHeight: 1.6,
            color: C.accText,
          }}
        >
          {margin.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <div style={{ flex: 1, padding: "56px 72px 56px 48px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 22, color: C.tx2 }}>{kicker}</div>
          <div
            style={{
              marginTop: "auto",
              fontSize: size,
              lineHeight: 1,
              letterSpacing: -0.025 * size,
              color: C.ink,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 36,
              paddingTop: 20,
              borderTop: `2px solid ${C.rule2}`,
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "IBM Plex Mono",
              fontSize: 22,
              color: C.tx2,
            }}
          >
            <span style={{ color: C.ink }}>{footerLeft}</span>
            <span>{footerRight}</span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}
