"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

const NEXT_STEPS = [
  { icon: "✅", text: "Your AI Growth Engine profile is being created" },
  { icon: "🎯", text: "Your FREEDOM Plan is being drafted" },
  { icon: "📊", text: "Daily coaching briefs start within 48 hours" },
  { icon: "🔧", text: "Your platforms are being connected" },
  { icon: "🚀", text: "Complete the Fast Start to hit the ground running" },
];

export default function CompletePage() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="RazoRSharp Networks"
            className="h-8 w-auto"
          />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-brand-fg mb-3 leading-tight">
          You did it.
        </h1>
        <p className="text-lg text-brand-fg/80 mb-2 font-medium">
          You&apos;re on the other side of Operator → Engineer.
        </p>
        <p className="text-sm text-brand-muted mb-8 leading-relaxed">
          Your TimeBACK system is being built right now. Everything you submitted is
          already in motion.
        </p>

        {/* What happens next */}
        <div className="text-left p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 mb-8">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wide mb-4">
            What happens next
          </h3>
          <div className="space-y-3">
            {NEXT_STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-base flex-shrink-0">{step.icon}</span>
                <p className="text-sm text-brand-fg/80 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fast Start CTA */}
        <div className="p-6 rounded-xl border border-brand-primary/15 bg-brand-primary/5 mb-8">
          <h3 className="text-sm font-bold gradient-text uppercase tracking-wide mb-2">
            ⚡ Fast Start — Don&apos;t Skip This
          </h3>
          <p className="text-sm text-brand-muted-light mb-4 leading-relaxed">
            Your system is being built. While we work, complete the Fast Start guide to accelerate your launch and get the most out of your AI Growth Engine from day one.
          </p>
          <a
            href="https://doc.razorsharpnetworks.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm transition-all shadow-brand-glow"
          >
            Start the Fast Start Guide
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Confirmation message */}
        <div className="p-4 rounded-lg bg-brand-card/50 border border-brand-border/50 mb-8">
          <p className="text-xs text-brand-muted-light leading-relaxed">
            📬 A confirmation has been sent to your email. If you don&apos;t see it, check your spam folder. You can always return here to update your information.
          </p>
        </div>

        {/* Brand line */}
        <p className="text-xs text-brand-muted mb-8 italic">
          One System. One Flow. One Outcome. FREEDOM
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-brand-border hover:bg-brand-card text-brand-fg/80 font-medium text-sm transition-all"
        >
          Back to Dashboard
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
