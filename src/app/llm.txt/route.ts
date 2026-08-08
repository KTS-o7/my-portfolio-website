import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/profile";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.redirect(`${getSiteUrl()}/llms.txt`, 301);
}
