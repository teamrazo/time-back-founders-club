import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, appendFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { validateSubmission } from "@/lib/validation";
import { upsertContactAndTag } from "@/lib/ghl";

const DATA_DIR =
  process.env.DATA_DIR ||
  (process.env.VERCEL === "1"
    ? path.join("/tmp", "rsn-onboarding")
    : path.join(process.cwd(), "data"));

const WEBHOOK_URL = process.env.WEBHOOK_URL || "";
const GHL_ENABLED = Boolean(process.env.GHL_PRIVATE_TOKEN && process.env.GHL_LOCATION_ID);

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

    // Sync to GHL via API (preferred) if enabled
    if (GHL_ENABLED) {
      try {
        // Tag Naming Convention: Category - Context - Detail
        // Categories: Status (mutually exclusive), Activity (permanent), Trigger (temporary)
        const stageTagMap: Record<string, string[]> = {
          stage1: [
            "Status - Onboarding Pipeline - TimeBACK Build Complete",
            "Activity - Onboarding - TimeBACK Build Submitted",
          ],
          stage2: [
            "Status - Onboarding Pipeline - Assessment Complete",
            "Activity - Onboarding - Marketing Assessment Submitted",
          ],
          stage3: [
            "Status - Onboarding Pipeline - Access Granted",
            "Activity - Onboarding - Onboarding Complete",
          ],
        };

        const tagsToAdd = stageTagMap[String(stage)] || [`Onboarding: ${String(stage)} Complete`];

        const stageNoteMap: Record<string, string> = {
          stage1: "📋 Completed TimeBACK Build — system profile, goals, FREEDOM scorecard & brand voice submitted.",
          stage2: "📊 Completed Marketing Assessment — current state, target market, goals & readiness evaluated.",
          stage3: "🔑 Completed Access Grant — platform credentials & admin access provided for campaign execution.",
        };

        // Only attempt if we have the required fields
        if (submission.contact.email && submission.contact.phone && submission.contact.name) {
          await upsertContactAndTag({
            fullName: submission.contact.name,
            email: submission.contact.email,
            phone: submission.contact.phone,
            companyName: submission.contact.company,
            tagsToAdd,
            note: stageNoteMap[String(stage)] || `Completed onboarding ${stage}`,
          });
        }
      } catch (ghlErr) {
        console.warn("GHL sync failed:", ghlErr);
      }
    }

    // Fire webhook if configured (secondary integration path)
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

    return NextResponse.json({ success: true, id, stage, ghlEnabled: GHL_ENABLED }, { status: 200 });
  } catch (err) {
    console.error("Stage submission error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
