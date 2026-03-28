import { NextRequest, NextResponse } from "next/server";
import { findContactByEmail } from "@/lib/ghl";

const GHL_ENABLED = Boolean(process.env.GHL_PRIVATE_TOKEN && process.env.GHL_LOCATION_ID);

// Stage completion tags (case-insensitive)
const STAGE_TAGS = {
  stage1: "status - onboarding pipeline - timeback build complete",
  stage2: "status - onboarding pipeline - assessment complete",
  stage3: "status - onboarding pipeline - access granted",
};

// Rate limiter (IP-based, 10 req/15 min) — same pattern as /api/stage
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function hasTag(tags: string[], target: string): boolean {
  const lower = target.toLowerCase();
  return tags.some(t => t.toLowerCase() === lower);
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = (body?.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Default response (safe fallback)
    const defaultStatus = {
      stage1: "not-started" as const,
      stage2: "not-started" as const,
      stage3: "not-started" as const,
    };

    // If GHL is not configured, return all not-started silently
    if (!GHL_ENABLED) {
      return NextResponse.json(defaultStatus);
    }

    // Look up contact in GHL
    let contact;
    try {
      contact = await findContactByEmail(email);
    } catch {
      // GHL lookup failed — return safe default, don't surface error to client
      return NextResponse.json(defaultStatus);
    }

    // Contact not found
    if (!contact) {
      return NextResponse.json(defaultStatus);
    }

    const tags = contact.tags || [];

    return NextResponse.json({
      stage1: hasTag(tags, STAGE_TAGS.stage1) ? "complete" : "not-started",
      stage2: hasTag(tags, STAGE_TAGS.stage2) ? "complete" : "not-started",
      stage3: hasTag(tags, STAGE_TAGS.stage3) ? "complete" : "not-started",
    });
  } catch (err) {
    console.error("check-status error:", err);
    // Always return a safe response — never error out on the client
    return NextResponse.json({
      stage1: "not-started",
      stage2: "not-started",
      stage3: "not-started",
    });
  }
}
