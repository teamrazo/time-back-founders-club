import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("[slack-notify] Received:", JSON.stringify(body).substring(0, 500));
  return NextResponse.json({ ok: true });
}
