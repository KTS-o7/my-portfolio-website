import { OG_SIZE, renderOgCard } from "@/lib/og";
import { SITE } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${SITE.name} — AI Engineer`;

export default function Image() {
  return renderOgCard({
    margin: ["AI", "engineer"],
    kicker: "portfolio.shenthar.me",
    title: SITE.name,
    footerLeft: "Production LLM systems",
    footerRight: "Bangalore, India",
  });
}
