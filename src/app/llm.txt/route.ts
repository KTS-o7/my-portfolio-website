import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const redirectUrl = new URL("/llms.txt", request.nextUrl);
  return NextResponse.redirect(redirectUrl, 301);
}
