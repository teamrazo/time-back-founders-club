"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RadioGroup({ label, options, value, onChange, className }: RadioGroupProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <p className="text-sm font-medium text-slate-300">{label}</p>}
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex items-start gap-3 px-4 py-3 rounded-lg border text-sm text-left transition-all duration-150",
                selected
                  ? "border-brand-accent bg-brand-accent/10"
                  : "border-brand-slate bg-brand-charcoal hover:border-slate-500"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all duration-150",
                  selected ? "border-brand-accent" : "border-slate-600"
                )}
              >
                {selected && <div className="w-2.5 h-2.5 rounded-full bg-brand-accent" />}
              </div>
              <div>
                <p className={cn("font-medium", selected ? "text-slate-100" : "text-slate-300")}>
                  {opt.label}
                </p>
                {opt.description && (
                  <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
