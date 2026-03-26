"use client";
import React from "react";

interface StepWrapperProps {
  title: string;
  subtitle: string;
  badge?: string;
  children: React.ReactNode;
}

export function StepWrapper({ title, subtitle, badge, children }: StepWrapperProps) {
  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        {badge && (
          <p className="section-label mb-2">{badge}</p>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">{title}</h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}
