import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, appendFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { validateSubmission } from "@/lib/validation";

const DATA_DIR =
  process.env.DATA_DIR ||
  (process.env.VERCEL === "1"
    ? path.join("/tmp", "rsn-onboarding")
    : path.join(process.cwd(), "data"));

const WEBHOOK_URL = process.env.WEBHOOK_URL || "";

// Simple in-memory rate limiter (per IP, 10 submissions per 15 min)
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

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    }

    const body = await req.json();

    // Server-side validation
    const { valid, errors } = validateSubmission(body);
    if (!valid) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const { stage, stageLabel, entry, submittedAt } = body;

    // Ensure data directory exists
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }

    const id = `${stage}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const submission = {
      id,
      stage,
      stageLabel,
      submittedAt: submittedAt || new Date().toISOString(),
      ip,
      contact: {
        name: entry?.fullName || "",
        email: entry?.bestEmail || "",
        phone: entry?.mobilePhone || "",
        company: entry?.companyName || "",
        city: entry?.cityState || "",
        industry: entry?.industry || "",
      },
      ...body,
    };

    // Remove honeypot from stored data
    delete submission._hp;

    // Save individual stage file
    const filePath = path.join(DATA_DIR, `${id}.json`);
    await writeFile(filePath, JSON.stringify(submission, null, 2), "utf-8");

    // Append to aggregate log
    const logPath = path.join(DATA_DIR, "onboarding.jsonl");
    await appendFile(logPath, JSON.stringify(submission) + "\n", "utf-8");

    // Fire GHL webhook if configured
    if (WEBHOOK_URL) {
      try {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: `onboarding_${stage}_complete`,
            id,
            stage,
            stageLabel,
            timestamp: submission.submittedAt,
            contact: submission.contact,
            data: submission,
          }),
          signal: AbortSignal.timeout(10000),
        });
      } catch (webhookErr) {
        console.warn("Webhook delivery failed:", webhookErr);
      }
    }

    return NextResponse.json({ success: true, id, stage }, { status: 200 });
  } catch (err) {
    console.error("Stage submission error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
