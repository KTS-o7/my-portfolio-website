const sharp = require("sharp");

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect x="48" y="48" width="1104" height="534" fill="none" stroke="#facc15" stroke-width="2"/>
  <text x="96" y="240" font-family="Menlo, 'JetBrains Mono', monospace" font-size="64" font-weight="bold" fill="#fafafa">Krishnatejaswi Shenthar</text>
  <text x="96" y="330" font-family="Menlo, 'JetBrains Mono', monospace" font-size="40" fill="#facc15">AI Engineer — Production LLM Systems</text>
  <text x="96" y="420" font-family="Menlo, 'JetBrains Mono', monospace" font-size="28" fill="#a1a1aa">RAG · LangGraph · Agentic Workflows · 1B+ tokens/month</text>
  <text x="96" y="530" font-family="Menlo, 'JetBrains Mono', monospace" font-size="22" fill="#52525b">krishnatejaswi.com</text>
</svg>`;

sharp(Buffer.from(svg))
  .png()
  .toFile("src/app/opengraph-image.png")
  .then((info) => console.log(info));
