"use client";
import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, Circle, ChevronRight, ChevronUp, Zap, Target, Key, X, Smartphone, Monitor } from "lucide-react";
import { storage } from "@/lib/storage";
import { OnboardingStatus, StageStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STAGES = [
  {
    id: "stage1" as const,
    number: 1,
    title: "TimeBACK Build",
    subtitle: "System profile, goals, FREEDOM scorecard & brand voice",
    time: "8–12 minutes",
    href: "/stage1",
    icon: Zap,
    priority: "Highest priority — feeds your AI Growth Engine immediately",
    color: "blue",
  },
  {
    id: "stage2" as const,
    number: 2,
    title: "Marketing Assessment",
    subtitle: "Current state, target market, goals & readiness",
    time: "5–8 minutes",
    href: "/stage2",
    icon: Target,
    priority: "Informs your strategy and campaign direction",
    color: "emerald",
  },
  {
    id: "stage3" as const,
    number: 3,
    title: "Access Grant",
    subtitle: "Platform credentials & admin access for campaign execution",
    time: "15–30 minutes",
    href: "/stage3",
    icon: Key,
    priority: "Enables project execution — complete when ready",
    color: "amber",
  },
];

function StatusBadge({ status }: { status: StageStatus }) {
  if (status === "complete") {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
        <CheckCircle2 size={14} />
        Complete
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-brand-primary">
        <Clock size={14} />
        In Progress
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-brand-muted">
      <Circle size={14} />
      Not Started
    </span>
  );
}

function getColorClasses(color: string, status: StageStatus) {
  const isComplete = status === "complete";
  const isActive = status === "in-progress";
  const map: Record<string, { border: string; bg: string; icon: string; btn: string }> = {
    blue: {
      border: isComplete ? "border-emerald-500/40" : isActive ? "border-brand-primary/40" : "border-brand-border hover:border-brand-primary/30",
      bg: isComplete ? "border-emerald-500/5 bg-brand-card" : isActive ? "bg-brand-primary/5" : "bg-brand-card hover:bg-brand-card-hover",
      icon: isComplete ? "text-emerald-400" : "text-brand-primary",
      btn: "bg-brand-gradient hover:opacity-90 text-white shadow-brand-glow",
    },
    emerald: {
      border: isComplete ? "border-emerald-500/40" : isActive ? "border-brand-accent/40" : "border-brand-border hover:border-brand-accent/30",
      bg: isComplete ? "border-emerald-500/5 bg-brand-card" : isActive ? "bg-brand-accent/5" : "bg-brand-card hover:bg-brand-card-hover",
      icon: isComplete ? "text-emerald-400" : "text-brand-accent",
      btn: "bg-accent-gradient hover:opacity-90 text-white shadow-accent-glow",
    },
    amber: {
      border: isComplete ? "border-emerald-500/40" : isActive ? "border-brand-secondary/40" : "border-brand-border hover:border-brand-secondary/30",
      bg: isComplete ? "border-emerald-500/5 bg-brand-card" : isActive ? "bg-brand-secondary/5" : "bg-brand-card hover:bg-brand-card-hover",
      icon: isComplete ? "text-emerald-400" : "text-brand-secondary",
      btn: "bg-brand-gradient hover:opacity-90 text-white shadow-brand-glow",
    },
  };
  return map[color] || map.blue;
}

function overallProgress(status: OnboardingStatus): number {
  const stages = [status.stage1, status.stage2, status.stage3];
  const complete = stages.filter(s => s === "complete").length;
  const partial = stages.filter(s => s === "in-progress").length;
  return Math.round(((complete + partial * 0.5) / 3) * 100);
}

const STAGE_CONFIRMATIONS: Record<string, string> = {
  stage1: "Stage 1 complete! Your FREEDOM profile has been submitted. CATO is building your system now.",
  stage2: "✅ Assessment received! Your strategy is being mapped.",
  stage3: "✅ Access confirmed! Your platforms are being connected.",
};

export default function HomePageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg" />}>
      <HomePage />
    </Suspense>
  );
}

function HomePage() {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [entryComplete, setEntryComplete] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [checkingServer, setCheckingServer] = useState(false);
  const [slackOpen, setSlackOpen] = useState(false);
  const [slackDone, setSlackDone] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const s = storage.getStatus();
    setStatus(s);
    setEntryComplete(s.entryComplete);
    setSlackDone(s.slackSetupComplete ?? false);

    // Check for stage completion redirect
    for (const key of ["stage1", "stage2", "stage3"]) {
      if (searchParams.get(key) === "complete" && STAGE_CONFIRMATIONS[key]) {
        setToast(STAGE_CONFIRMATIONS[key]);
        // Clear URL params without reload
        window.history.replaceState({}, "", "/intake");
        // Auto-dismiss after 8 seconds
        setTimeout(() => setToast(null), 8000);
        break;
      }
    }

    // Server-side status restoration: if any stage is not-started, check GHL
    const hasIncomplete =
      s.stage1 !== "complete" || s.stage2 !== "complete" || s.stage3 !== "complete";
    if (hasIncomplete) {
      const entry = storage.getEntry();
      const email = entry?.bestEmail?.trim();
      if (email) {
        setCheckingServer(true);
        fetch("/api/check-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
          .then(r => r.ok ? r.json() : null)
          .then(serverStatus => {
            if (!serverStatus) return;
            setStatus(prev => {
              if (!prev) return prev;
              const updated = { ...prev };
              let changed = false;
              for (const key of ["stage1", "stage2", "stage3"] as const) {
                if (serverStatus[key] === "complete" && prev[key] !== "complete") {
                  updated[key] = "complete";
                  changed = true;
                }
              }
              if (changed) {
                updated.lastUpdated = new Date().toISOString();
                storage.setStatus(updated);
              }
              return updated;
            });
          })
          .catch(() => {/* silent */})
          .finally(() => setCheckingServer(false));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const allComplete = status?.stage1 === "complete" && status?.stage2 === "complete" && status?.stage3 === "complete";
  const progress = status ? overallProgress(status) : 0;

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Confirmation Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-fade-in">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-4 flex items-start gap-3 shadow-2xl shadow-emerald-500/10 backdrop-blur-sm">
            <p className="text-sm text-emerald-300 font-medium flex-1 leading-relaxed">{toast}</p>
            <button onClick={() => setToast(null)} className="text-emerald-400/60 hover:text-emerald-300 flex-shrink-0 mt-0.5">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="border-b border-brand-border/60">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="RazoRSharp Networks"
              className="h-8 w-auto flex-shrink-0"
            />
            <div className="hidden sm:block h-6 w-px bg-brand-border/60" />
            <div className="hidden sm:block">
              <div className="text-xs text-brand-muted font-medium">One System. One Flow. One Outcome. <span className="gradient-text font-semibold">FREEDOM</span></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 pb-20">
        {/* Welcome hero */}
        <div className="text-center mb-12 animate-fade-in">
          {allComplete ? (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold mb-4">
                <CheckCircle2 size={16} />
                Onboarding Complete
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-brand-fg mb-4 leading-tight">
                You&apos;re on the other side of Operator → Engineer.
              </h1>
              <p className="text-brand-muted-light max-w-xl mx-auto leading-relaxed">
                Your TimeBACK system is being built. Daily coaching briefs start within 48 hours.
                Welcome to the system.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/15 text-brand-primary text-sm font-semibold mb-4">
                Client Onboarding
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-brand-fg mb-4 leading-tight">
                Build a system that works<br className="hidden sm:block" /> while you don&apos;t.
              </h1>
              <p className="text-brand-muted-light max-w-xl mx-auto leading-relaxed">
                This isn&apos;t a form. It&apos;s the first step from <strong className="text-brand-fg">Operator to Engineer.</strong><br />
                Complete it once. We handle the rest.
              </p>
            </>
          )}
        </div>

        {/* Overall progress */}
        {progress > 0 && !allComplete && (
          <div className="mb-8 p-4 rounded-xl border border-brand-border bg-brand-card animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-brand-fg/80">Overall Progress</span>
              <span className="text-sm font-bold text-brand-primary">{progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-brand-slate overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-primary transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-brand-muted mt-2">
              {progress < 50
                ? "You're getting started. The hardest part is beginning."
                : progress < 100
                ? "You're past the halfway point. Finish this and your system activates."
                : ""}
            </p>
          </div>
        )}

        {/* Slack Setup Guide */}
        <div className="mb-6 animate-slide-up">
          <div className={cn(
            "rounded-xl border transition-all duration-200",
            slackDone
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-brand-border bg-brand-card"
          )}>
            {/* Header row — always visible */}
            <div className="flex items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl flex-shrink-0">📬</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-brand-fg leading-tight">
                      Set Up Your Slack Channel
                    </h2>
                    {slackDone && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 size={13} />
                        Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-muted mt-0.5 leading-relaxed">
                    {slackDone
                      ? "You're all set — CATO will be waiting in your channel."
                      : "You received a Slack invite. Here's exactly what to do with it."}
                  </p>
                </div>
              </div>
              {!slackDone && (
                <button
                  onClick={() => setSlackOpen(v => !v)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/20 transition-all duration-150"
                >
                  {slackOpen ? (
                    <>Hide <ChevronUp size={15} /></>
                  ) : (
                    <>Set up Slack <ChevronRight size={15} /></>
                  )}
                </button>
              )}
            </div>

            {/* Expandable body */}
            {slackOpen && !slackDone && (
              <div className="px-5 pb-6 border-t border-brand-border/60">
                {/* Video placeholder */}
                <div className="mt-5 rounded-lg border border-dashed border-brand-border flex items-center justify-center py-5 px-4">
                  <p className="text-sm text-brand-muted text-center">
                    📹 <span className="font-medium">Video walkthrough coming soon</span>
                  </p>
                </div>

                {/* Why Slack matters */}
                <div className="mt-5 p-4 rounded-lg bg-brand-primary/5 border border-brand-primary/15">
                  <p className="text-sm font-semibold text-brand-fg mb-1">Why Slack matters for your business</p>
                  <p className="text-sm text-brand-muted-light leading-relaxed">
                    Slack is your private command center. This is where <strong className="text-brand-fg">CATO</strong> (your AI Growth Engineer) delivers daily coaching briefs, where you ask questions, request changes, and track progress. It&apos;s not optional — it&apos;s the core of how TimeBACK delivers value.
                  </p>
                </div>

                {/* Steps */}
                <div className="mt-5 space-y-4">
                  {/* Step 1 */}
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/15 text-brand-primary text-xs font-bold flex items-center justify-center mt-0.5">1</span>
                    <div>
                      <p className="text-sm font-semibold text-brand-fg">Check your email</p>
                      <p className="text-sm text-brand-muted-light mt-0.5 leading-relaxed">
                        Look for an email invite from <strong className="text-brand-fg">&ldquo;Slack&rdquo;</strong> or <strong className="text-brand-fg">&ldquo;RSAI Growth Engine&rdquo;</strong>. Check your spam and promotions folders if you don&apos;t see it.
                      </p>
                      {/* Tip */}
                      <div className="mt-2 px-3 py-2 rounded-lg bg-brand-primary/5 border border-brand-primary/20 text-xs text-brand-muted-light leading-relaxed">
                        💡 Not seeing your invite? Check spam, or email <span className="text-brand-primary font-medium">support@razorsharpnetworks.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/15 text-brand-primary text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                    <div>
                      <p className="text-sm font-semibold text-brand-fg">Click &ldquo;Join Now&rdquo;</p>
                      <p className="text-sm text-brand-muted-light mt-0.5 leading-relaxed">
                        Open the invite email and click the Join Now button. This opens Slack in your browser — no download required yet.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/15 text-brand-primary text-xs font-bold flex items-center justify-center mt-0.5">3</span>
                    <div>
                      <p className="text-sm font-semibold text-brand-fg">Create your Slack account <span className="text-brand-muted font-normal">(if new to Slack)</span></p>
                      <p className="text-sm text-brand-muted-light mt-0.5 leading-relaxed">
                        Use your business email and create a password. You can also sign in with Google for faster setup.
                      </p>
                      <div className="mt-2 px-3 py-2 rounded-lg bg-brand-primary/5 border border-brand-primary/20 text-xs text-brand-muted-light leading-relaxed">
                        💡 Slack is free to use. You do not need a paid plan.
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/15 text-brand-primary text-xs font-bold flex items-center justify-center mt-0.5">4</span>
                    <div>
                      <p className="text-sm font-semibold text-brand-fg">Download the app <span className="text-brand-muted font-normal">(recommended)</span></p>
                      <p className="text-sm text-brand-muted-light mt-0.5 leading-relaxed">
                        Get Slack on your devices so you never miss a coaching brief.
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <a href="https://slack.com/intl/en-us/downloads/mac" target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border bg-brand-card-hover hover:border-brand-primary/30 text-xs text-brand-muted-light transition-colors">
                          <Monitor size={13} /> Mac
                        </a>
                        <a href="https://slack.com/intl/en-us/downloads/windows" target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border bg-brand-card-hover hover:border-brand-primary/30 text-xs text-brand-muted-light transition-colors">
                          <Monitor size={13} /> Windows
                        </a>
                        <a href="https://apps.apple.com/app/slack/id618783545" target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border bg-brand-card-hover hover:border-brand-primary/30 text-xs text-brand-muted-light transition-colors">
                          <Smartphone size={13} /> iOS
                        </a>
                        <a href="https://play.google.com/store/apps/details?id=com.Slack" target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border bg-brand-card-hover hover:border-brand-primary/30 text-xs text-brand-muted-light transition-colors">
                          <Smartphone size={13} /> Android
                        </a>
                      </div>
                      <div className="mt-2 px-3 py-2 rounded-lg bg-brand-primary/5 border border-brand-primary/20 text-xs text-brand-muted-light leading-relaxed">
                        💡 You can use Slack on desktop, phone, or tablet. We recommend the mobile app so you never miss a coaching brief.
                      </div>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/15 text-brand-primary text-xs font-bold flex items-center justify-center mt-0.5">5</span>
                    <div>
                      <p className="text-sm font-semibold text-brand-fg">Find your private channel</p>
                      <p className="text-sm text-brand-muted-light mt-0.5 leading-relaxed">
                        In the left sidebar, look under <strong className="text-brand-fg">Channels</strong>. Your channel is named after your business (e.g. <strong className="text-brand-fg">#your-company-name</strong>).
                      </p>
                      <div className="mt-2 px-3 py-2 rounded-lg bg-brand-primary/5 border border-brand-primary/20 text-xs text-brand-muted-light leading-relaxed">
                        💡 Your channel is private — only you, your team lead (Jesse), and CATO can see it.
                      </div>
                    </div>
                  </div>

                  {/* Step 6 */}
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/15 text-brand-primary text-xs font-bold flex items-center justify-center mt-0.5">6</span>
                    <div>
                      <p className="text-sm font-semibold text-brand-fg">Say hello! 👋</p>
                      <p className="text-sm text-brand-muted-light mt-0.5 leading-relaxed">
                        Type a message in your channel. CATO will respond within 24 hours of your FREEDOM profile being complete.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mark as done */}
                <div className="mt-6 pt-5 border-t border-brand-border/60 flex justify-end">
                  <button
                    onClick={() => {
                      const updated = { ...storage.getStatus(), slackSetupComplete: true };
                      storage.setStatus(updated);
                      setSlackDone(true);
                      setSlackOpen(false);
                      setStatus(updated);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 transition-all duration-150"
                  >
                    <CheckCircle2 size={16} />
                    Mark as Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stage cards */}
        <div className="space-y-4 animate-slide-up">
          {STAGES.map((stage) => {
            const stageStatus = status?.[stage.id] ?? "not-started";
            const colors = getColorClasses(stage.color, stageStatus);
            const Icon = stage.icon;
            const isComplete = stageStatus === "complete";
            const linkLabel = isComplete ? "Review" : stageStatus === "in-progress" ? "Continue" : "Start";

            return (
              <div
                key={stage.id}
                className={cn(
                  "rounded-xl border transition-all duration-200 p-5",
                  colors.border,
                  colors.bg
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn("mt-0.5 flex-shrink-0", colors.icon)}>
                    {isComplete
                      ? <CheckCircle2 size={24} />
                      : <Icon size={24} />
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-brand-muted font-medium">Stage {stage.number}</span>
                          <StatusBadge status={stageStatus} />
                        </div>
                        <h3 className="text-lg font-bold text-brand-fg mt-0.5">{stage.title}</h3>
                        <p className="text-sm text-brand-muted-light mt-1">{stage.subtitle}</p>
                        <p className="text-xs text-brand-muted mt-1.5">{stage.time} · {stage.priority}</p>
                      </div>

                      {/* CTA */}
                      <Link
                        href={stage.href}
                        className={cn(
                          "flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 shadow-sm",
                          colors.btn
                        )}
                      >
                        {linkLabel}
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion message */}
        {allComplete && (
          <div className="mt-10 p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 animate-slide-up">
            <h3 className="text-lg font-bold text-emerald-400 mb-3">Here&apos;s what happens next:</h3>
            <div className="space-y-2">
              {[
                "✅ Your AI Growth Engine profile is being created",
                "🎯 Your FREEDOM Plan is being drafted",
                "📊 Daily coaching briefs start within 48 hours",
                "🔧 Your platforms are being connected",
              ].map((item, i) => (
                <p key={i} className="text-sm text-brand-fg/80">{item}</p>
              ))}
            </div>
          </div>
        )}

        {/* Bottom brand message */}
        {!allComplete && (
          <div className="mt-10 text-center">
            {checkingServer ? (
              <p className="text-xs text-brand-muted/60 leading-relaxed animate-pulse">
                Checking your progress…
              </p>
            ) : (
              <p className="text-xs text-brand-muted leading-relaxed">
                Each stage is independent — complete them in any order.<br />
                Your progress saves automatically. Pick up where you left off anytime.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
