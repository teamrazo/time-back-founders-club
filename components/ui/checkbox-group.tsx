"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxGroupProps {
  label?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
}

export function CheckboxGroup({ label, options, value, onChange, hint }: CheckboxGroupProps) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter(v => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-brand-fg/80">{label}</label>}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm text-left transition-all duration-150",
              value.includes(opt)
                ? "border-brand-primary bg-brand-primary/10 text-brand-primary-light"
                : "border-brand-border bg-brand-card text-brand-muted-light hover:border-brand-border-hover hover:text-brand-fg/80"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-all",
              value.includes(opt) ? "bg-brand-primary border-brand-primary" : "border-brand-border"
            )}>
              {value.includes(opt) && <Check size={10} className="text-white" />}
            </div>
            {opt}
          </button>
        ))}
      </div>
      {hint && <p className="text-xs text-brand-muted">{hint}</p>}
    </div>
  );
}
