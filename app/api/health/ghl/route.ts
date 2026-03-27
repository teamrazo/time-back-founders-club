import { NextResponse } from "next/server";
import { ghlHealthcheck } from "@/lib/ghl";

export async function GET() {
  try {
    const enabled = Boolean(process.env.GHL_PRIVATE_TOKEN && process.env.GHL_LOCATION_ID);
    if (!enabled) {
      return NextResponse.json({ ok: false, enabled, error: "GHL env not configured" }, { status: 200 });
    }

    const data = await ghlHealthcheck();
    return NextResponse.json({ ok: true, enabled, location: data?.location || data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, enabled: true, error: e?.message || "unknown" }, { status: 200 });
  }
}
