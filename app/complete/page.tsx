"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

const NEXT_STEPS = [
  { icon: "✅", text: "Your AI Growth Engine profile is being created" },
  { icon: "🎯", text: "Your FREEDOM Plan is being drafted" },
  { icon: "📊", text: "Daily coaching briefs start within 48 hours" },
  { icon: "🔧", text: "Your platforms are being connected" },
];

export default function CompletePage() {
  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center">
            <span className="text-white text-sm font-black">R</span>
          </div>
          <div className="text-sm font-bold text-slate-200">RazoRSharp Networks</div>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-100 mb-3 leading-tight">
          You did it.
        </h1>
        <p className="text-lg text-slate-300 mb-2 font-medium">
          You&apos;re on the other side of Operator → Engineer.
        </p>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
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
                <p className="text-sm text-slate-300 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Brand line */}
        <p className="text-xs text-slate-600 mb-8 italic">
          One System. One Flow. One Outcome. FREEDOM
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-accent hover:bg-brand-accent-dark text-white font-semibold text-sm transition-all shadow-lg shadow-brand-accent/25"
        >
          Back to Dashboard
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
