import { NextResponse } from "next/server";
import { buildLlmProfileText, getProfileData, getSiteUrl } from "@/lib/profile";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  const baseUrl = getSiteUrl();
  const profile = getProfileData(baseUrl);
  const body = buildLlmProfileText(profile);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
    },
  });
}
