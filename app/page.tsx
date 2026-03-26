"use client";
import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, Circle, ChevronRight, Zap, Target, Key, X } from "lucide-react";
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
      <span className="flex items-center gap-1 text-xs font-semibold text-brand-accent">
        <Clock size={14} />
        In Progress
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-slate-500">
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
      border: isComplete ? "border-emerald-500/40" : isActive ? "border-brand-accent/60" : "border-brand-slate hover:border-brand-accent/40",
      bg: isComplete ? "bg-emerald-500/5" : isActive ? "bg-brand-accent/5" : "bg-brand-charcoal hover:bg-brand-charcoal/80",
      icon: isComplete ? "text-emerald-400" : "text-brand-accent",
      btn: "bg-brand-accent hover:bg-brand-accent-dark text-white",
    },
    emerald: {
      border: isComplete ? "border-emerald-500/40" : isActive ? "border-emerald-400/60" : "border-brand-slate hover:border-emerald-400/40",
      bg: isComplete ? "bg-emerald-500/5" : isActive ? "bg-emerald-500/5" : "bg-brand-charcoal hover:bg-brand-charcoal/80",
      icon: isComplete ? "text-emerald-400" : "text-emerald-400",
      btn: "bg-emerald-500 hover:bg-emerald-600 text-white",
    },
    amber: {
      border: isComplete ? "border-emerald-500/40" : isActive ? "border-amber-400/60" : "border-brand-slate hover:border-amber-400/40",
      bg: isComplete ? "bg-emerald-500/5" : isActive ? "bg-amber-500/5" : "bg-brand-charcoal hover:bg-brand-charcoal/80",
      icon: isComplete ? "text-emerald-400" : "text-amber-400",
      btn: "bg-amber-500 hover:bg-amber-600 text-white",
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
  stage1: "✅ TimeBACK Build received! Your AI Growth Engine profile is being created.",
  stage2: "✅ Assessment received! Your strategy is being mapped.",
  stage3: "✅ Access confirmed! Your platforms are being connected.",
};

export default function HomePageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-navy" />}>
      <HomePage />
    </Suspense>
  );
}

function HomePage() {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [entryComplete, setEntryComplete] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const s = storage.getStatus();
    setStatus(s);
    setEntryComplete(s.entryComplete);

    // Check for stage completion redirect
    for (const key of ["stage1", "stage2", "stage3"]) {
      if (searchParams.get(key) === "complete" && STAGE_CONFIRMATIONS[key]) {
        setToast(STAGE_CONFIRMATIONS[key]);
        // Clear URL params without reload
        window.history.replaceState({}, "", "/");
        // Auto-dismiss after 8 seconds
        setTimeout(() => setToast(null), 8000);
        break;
      }
    }
  }, [searchParams]);

  const allComplete = status?.stage1 === "complete" && status?.stage2 === "complete" && status?.stage3 === "complete";
  const progress = status ? overallProgress(status) : 0;

  return (
    <div className="min-h-screen bg-brand-navy">
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
      <header className="border-b border-brand-slate/60">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-black">R</span>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 tracking-wide">RazoRSharp Networks</div>
              <div className="text-xs text-slate-500">One System. One Flow. One Outcome. FREEDOM</div>
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
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4 leading-tight">
                You&apos;re on the other side of Operator → Engineer.
              </h1>
              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                Your TimeBACK system is being built. Daily coaching briefs start within 48 hours.
                Welcome to the system.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-sm font-semibold mb-4">
                Client Onboarding
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4 leading-tight">
                Build a system that works<br className="hidden sm:block" /> while you don&apos;t.
              </h1>
              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                This isn&apos;t a form. It&apos;s the first step from <strong className="text-slate-200">Operator to Engineer.</strong><br />
                Complete it once. We handle the rest.
              </p>
            </>
          )}
        </div>

        {/* Overall progress */}
        {progress > 0 && !allComplete && (
          <div className="mb-8 p-4 rounded-xl border border-brand-slate bg-brand-charcoal animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Overall Progress</span>
              <span className="text-sm font-bold text-brand-accent">{progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-brand-slate overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-accent transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {progress < 50
                ? "You're getting started. The hardest part is beginning."
                : progress < 100
                ? "You're past the halfway point. Finish this and your system activates."
                : ""}
            </p>
          </div>
        )}

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
                          <span className="text-xs text-slate-500 font-medium">Stage {stage.number}</span>
                          <StatusBadge status={stageStatus} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 mt-0.5">{stage.title}</h3>
                        <p className="text-sm text-slate-400 mt-1">{stage.subtitle}</p>
                        <p className="text-xs text-slate-600 mt-1.5">{stage.time} · {stage.priority}</p>
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
                <p key={i} className="text-sm text-slate-300">{item}</p>
              ))}
            </div>
          </div>
        )}

        {/* Bottom brand message */}
        {!allComplete && (
          <div className="mt-10 text-center">
            <p className="text-xs text-slate-600 leading-relaxed">
              Each stage is independent — complete them in any order.<br />
              Your progress saves automatically. Pick up where you left off anytime.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
