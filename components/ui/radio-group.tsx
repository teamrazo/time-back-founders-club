"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupProps {
  label?: string;
  options: { value: string; label: string }[] | string[];
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  layout?: 'vertical' | 'horizontal';
}

export function RadioGroup({ label, options, value, onChange, hint, layout = 'vertical' }: RadioGroupProps) {
  const normalized = options.map(o => typeof o === 'string' ? { value: o, label: o } : o);

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <div className={cn(
        "flex gap-2",
        layout === 'vertical' ? "flex-col" : "flex-wrap"
      )}>
        {normalized.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg border text-sm text-left transition-all duration-150",
              value === opt.value
                ? "border-brand-accent bg-brand-accent/10 text-brand-accent-light"
                : "border-brand-slate bg-brand-charcoal text-slate-400 hover:border-slate-500 hover:text-slate-300"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-all",
              value === opt.value ? "border-brand-accent" : "border-brand-slate"
            )}>
              {value === opt.value && <div className="w-2 h-2 rounded-full bg-brand-accent" />}
            </div>
            {opt.label}
          </button>
        ))}
      </div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
