import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, appendFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const DATA_DIR =
  process.env.DATA_DIR ||
  (process.env.VERCEL === "1"
    ? path.join("/tmp", "rsn-onboarding")
    : path.join(process.cwd(), "data"));

const WEBHOOK_URL = process.env.WEBHOOK_URL || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { stage, stageLabel, entry, submittedAt } = body;

    if (!stage) {
      return NextResponse.json({ error: "Missing stage identifier" }, { status: 400 });
    }

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
      contact: entry
        ? {
            name: entry.fullName || "",
            email: entry.bestEmail || "",
            phone: entry.mobilePhone || "",
            company: entry.companyName || "",
          }
        : {},
      ...body,
    };

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

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (err) {
    console.error("Stage submission error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
