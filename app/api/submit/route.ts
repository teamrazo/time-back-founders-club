import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const WEBHOOK_URL = process.env.WEBHOOK_URL || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.email || !body.companyName) {
      return NextResponse.json(
        { error: "Missing required fields: email and companyName" },
        { status: 400 }
      );
    }

    // Ensure data directory exists
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const submission = {
      id,
      submittedAt: body.submittedAt || new Date().toISOString(),
      ...body,
    };

    // Save individual submission file
    const filePath = path.join(DATA_DIR, `${id}.json`);
    await writeFile(filePath, JSON.stringify(submission, null, 2), "utf-8");

    // Append to aggregate log
    const logPath = path.join(DATA_DIR, "submissions.jsonl");
    const line = JSON.stringify(submission) + "\n";
    const existingLog = existsSync(logPath) ? await readFile(logPath, "utf-8") : "";
    await writeFile(logPath, existingLog + line, "utf-8");

    // Fire webhook if configured
    if (WEBHOOK_URL) {
      try {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "intake_form_submitted",
            id,
            timestamp: submission.submittedAt,
            contact: {
              name: submission.fullName,
              email: submission.email,
              phone: submission.phone,
              company: submission.companyName,
            },
            data: submission,
          }),
          signal: AbortSignal.timeout(10000),
        });
      } catch (webhookErr) {
        // Log but don't fail — webhook is non-blocking
        console.warn("Webhook delivery failed:", webhookErr);
      }
    }

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
