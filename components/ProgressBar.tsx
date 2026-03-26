"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  icon: string;
}

const STEPS: Step[] = [
  { number: 1, title: "Company", icon: "🏢" },
  { number: 2, title: "Owner", icon: "👤" },
  { number: 3, title: "5 Pillars", icon: "🎯" },
  { number: 4, title: "Goals", icon: "📈" },
  { number: 5, title: "Pain Points", icon: "⚡" },
  { number: 6, title: "Lifecycle", icon: "🔄" },
  { number: 7, title: "Score", icon: "📊" },
  { number: 8, title: "Brand", icon: "💡" },
  { number: 9, title: "FREEDOM", icon: "🏆" },
  { number: 10, title: "Priorities", icon: "🚀" },
  { number: 11, title: "Review", icon: "✅" },
];

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const pct = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="section-label">Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-300">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="pill bg-brand-accent/15 text-brand-accent">{pct}%</span>
        </div>
      </div>

      {/* Progress track */}
      <div className="h-1.5 bg-brand-slate rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-accent to-blue-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Step dots — mobile hidden, tablet+ visible */}
      <div className="hidden md:flex items-center justify-between mt-4">
        {STEPS.slice(0, totalSteps).map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          return (
            <div key={step.number} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  isCompleted
                    ? "bg-brand-accent text-white"
                    : isCurrent
                    ? "bg-brand-accent/20 border-2 border-brand-accent text-brand-accent"
                    : "bg-brand-slate text-slate-600"
                )}
              >
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6L4.5 9.5L11 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap transition-colors",
                  isCurrent ? "text-brand-accent" : isCompleted ? "text-slate-400" : "text-slate-600"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile: current step name */}
      <div className="md:hidden mt-2">
        <p className="text-sm font-medium text-brand-accent">
          {STEPS[currentStep - 1]?.icon} {STEPS[currentStep - 1]?.title}
        </p>
      </div>
    </div>
  );
}
