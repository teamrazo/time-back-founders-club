import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You | RazoRSharp Networks",
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center">
            <span className="text-white text-sm font-black">R</span>
          </div>
          <span className="text-base font-bold text-slate-200 tracking-wide">RazoRSharp Networks</span>
        </div>

        {/* Success card */}
        <div className="glass-card rounded-2xl p-8 text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-green-400">
              <path d="M5 14L11 20L23 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-100 mb-2">Intake Received.</h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Your client profile has been submitted to the RazoRSharp team.
            The work begins now.
          </p>

          <div className="inline-block px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/30">
            <p className="text-brand-accent text-xs font-semibold tracking-wider uppercase">
              One System. One Flow. One Outcome. FREEDOM
            </p>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">What Happens Next</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                step: "01",
                icon: "✅",
                title: "Client Profile Built",
                desc: "Your responses populate your Client Profile, Owner Goals, and Brand Voice document.",
                color: "#60A5FA",
              },
              {
                step: "02",
                icon: "🎯",
                title: "FREEDOM Plan Created",
                desc: "We build your 30/90/180/365-day roadmap based on your scores and priorities.",
                color: "#34D399",
              },
              {
                step: "03",
                icon: "🤖",
                title: "Master Prompt Generated",
                desc: "Your AI Growth Engine Master Prompt is created from this data — powering all AI systems.",
                color: "#A78BFA",
              },
              {
                step: "04",
                icon: "📊",
                title: "Daily Briefs Begin",
                desc: "Coaching briefs aligned to YOUR goals, not generic advice.",
                color: "#FCD34D",
              },
              {
                step: "05",
                icon: "🔄",
                title: "90-Day Cycle Starts",
                desc: "Every quarter: Audit → Optimize → Measure → Refill",
                color: "#F472B6",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                  style={{ backgroundColor: item.color + "15", border: `1px solid ${item.color}40` }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-200 text-sm">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="text-center mb-8">
          <p className="text-slate-500 text-sm italic leading-relaxed">
            &ldquo;Time is the primary asset. Clarity before scale. Direction over speed.&rdquo;
          </p>
          <p className="text-slate-600 text-xs mt-2">— RazoRSharp Networks</p>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors underline underline-offset-4"
          >
            Submit another intake form
          </Link>
        </div>
      </div>
    </div>
  );
}
