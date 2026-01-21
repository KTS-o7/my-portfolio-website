import { NextRequest, NextResponse } from "next/server";
import { buildLlmProfileText, getProfileData, getSiteUrl } from "@/lib/profile";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const baseUrl = getSiteUrl(request.nextUrl.origin);
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
