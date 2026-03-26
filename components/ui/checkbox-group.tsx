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
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm text-left transition-all duration-150",
              value.includes(opt)
                ? "border-brand-accent bg-brand-accent/10 text-brand-accent-light"
                : "border-brand-slate bg-brand-charcoal text-slate-400 hover:border-slate-500 hover:text-slate-300"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-all",
              value.includes(opt) ? "bg-brand-accent border-brand-accent" : "border-brand-slate"
            )}>
              {value.includes(opt) && <Check size={10} className="text-white" />}
            </div>
            {opt}
          </button>
        ))}
      </div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
