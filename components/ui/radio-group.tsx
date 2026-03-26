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
      {label && <label className="text-sm font-medium text-brand-fg/80">{label}</label>}
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
                ? "border-brand-primary bg-brand-primary/10 text-brand-primary-light"
                : "border-brand-border bg-brand-card text-brand-muted-light hover:border-brand-border-hover hover:text-brand-fg/80"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-all",
              value === opt.value ? "border-brand-primary" : "border-brand-border"
            )}>
              {value === opt.value && <div className="w-2 h-2 rounded-full bg-brand-primary" />}
            </div>
            {opt.label}
          </button>
        ))}
      </div>
      {hint && <p className="text-xs text-brand-muted">{hint}</p>}
    </div>
  );
}
