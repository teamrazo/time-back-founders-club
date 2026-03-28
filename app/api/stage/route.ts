import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, appendFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { validateSubmission } from "@/lib/validation";
import { upsertContactAndTag } from "@/lib/ghl";
import { put, list, get } from "@vercel/blob";

const DATA_DIR =
  process.env.DATA_DIR ||
  (process.env.VERCEL === "1"
    ? path.join("/tmp", "rsn-onboarding")
    : path.join(process.cwd(), "data"));

const WEBHOOK_URL = process.env.WEBHOOK_URL || "";
const GHL_ENABLED = Boolean(process.env.GHL_PRIVATE_TOKEN && process.env.GHL_LOCATION_ID);
const BLOB_ENABLED = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function safePathSegment(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function streamToString(stream: ReadableStream<Uint8Array>) {
  const res = new Response(stream);
  return await res.text();
}

async function blobPutJson(pathname: string, data: unknown) {
  return await put(pathname, JSON.stringify(data, null, 2), {
    access: "private",
    contentType: "application/json",
  });
}

async function blobGetJson(pathname: string) {
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  const text = await streamToString(result.stream);
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function maybeCreateMergedIntake(prefix: string) {
  // Looks for the newest stage1/stage2/stage3 JSON blobs under the same client folder,
  // then writes a merged "full" intake blob.
  const { blobs } = await list({ prefix, limit: 1000 });

  const newest: Record<string, { pathname: string; uploadedAt: Date }> = {};
  for (const b of blobs) {
    const m = b.pathname.match(/\/(stage1|stage2|stage3)-/);
    if (!m) continue;
    const stageKey = m[1];
    const existing = newest[stageKey];
    if (!existing || b.uploadedAt > existing.uploadedAt) {
      newest[stageKey] = { pathname: b.pathname, uploadedAt: b.uploadedAt };
    }
  }

  if (!newest.stage1 || !newest.stage2 || !newest.stage3) return null;

  const [s1, s2, s3] = await Promise.all([
    blobGetJson(newest.stage1.pathname),
    blobGetJson(newest.stage2.pathname),
    blobGetJson(newest.stage3.pathname),
  ]);

  if (!s1 || !s2 || !s3) return null;

  const merged = {
    mergedAt: new Date().toISOString(),
    stage1: s1,
    stage2: s2,
    stage3: s3,
    sources: {
      stage1Blob: newest.stage1.pathname,
      stage2Blob: newest.stage2.pathname,
      stage3Blob: newest.stage3.pathname,
    },
  };

  const fullId = `full-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const fullPath = `${prefix}${fullId}.json`;
  const fullBlob = await blobPutJson(fullPath, merged);

  return { fullPathname: fullBlob.pathname, fullUrl: fullBlob.url };
}

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

    // Durable storage: write each stage intake to Vercel Blob (private)
    let blobPathname: string | null = null;
    let fullIntakePathname: string | null = null;

    if (BLOB_ENABLED && submission.contact.email) {
      try {
        const emailSafe = safePathSegment(submission.contact.email);
        const prefix = `intakes/${emailSafe}/`;
        const stageBlobPath = `${prefix}${id}.json`;

        const blob = await blobPutJson(stageBlobPath, submission);
        blobPathname = blob.pathname;
        (submission as any).blob = { url: blob.url, pathname: blob.pathname, downloadUrl: blob.downloadUrl };

        // If we have all three stages, create a merged full intake blob
        const merged = await maybeCreateMergedIntake(prefix);
        if (merged?.fullPathname) {
          fullIntakePathname = merged.fullPathname;
          (submission as any).fullIntake = merged;
        }
      } catch (blobErr) {
        console.warn("Blob write failed:", blobErr);
      }
    }

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
            note: [
              stageNoteMap[String(stage)] || `Completed onboarding ${stage}`,
              blobPathname ? `Intake Blob (stage): ${blobPathname}` : null,
              fullIntakePathname ? `Intake Blob (full): ${fullIntakePathname}` : null,
              `Submission ID: ${id}`,
            ].filter(Boolean).join("\n"),
          });
        }
      } catch (ghlErr) {
        console.warn("GHL sync failed:", ghlErr);
      }
    }

    // Slack notification after GHL sync
    const SLACK_WEBHOOK = process.env.SLACK_NOTIFICATION_WEBHOOK;
    const stageLabels: Record<string, string> = {
      stage1: "Stage 1 — TimeBACK Build",
      stage2: "Stage 2 — Marketing Assessment",
      stage3: "Stage 3 — Access Grant",
    };
    console.log(`[notify] Stage complete: ${stage} | ${submission.contact.name} | ${submission.contact.email}`);
    if (SLACK_WEBHOOK) {
      try {
        await fetch(SLACK_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🎯 *Client Intake Completed*\n• *Stage:* ${stageLabels[String(stage)] || stage}\n• *Name:* ${submission.contact.name}\n• *Email:* ${submission.contact.email}\n• *Company:* ${submission.contact.company || "N/A"}\n• *Time:* ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`,
          }),
          signal: AbortSignal.timeout(5000),
        });
      } catch (notifyErr) {
        console.warn("Slack notification failed:", notifyErr);
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

    return NextResponse.json(
      {
        success: true,
        id,
        stage,
        ghlEnabled: GHL_ENABLED,
        blobEnabled: BLOB_ENABLED,
        blobPathname,
        fullIntakePathname,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Stage submission error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
