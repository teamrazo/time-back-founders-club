"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  label?: string;
  options: CheckboxOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function CheckboxGroup({ label, options, selected, onChange, className }: CheckboxGroupProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <p className="text-sm font-medium text-slate-300">{label}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const checked = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg border text-sm text-left transition-all duration-150",
                checked
                  ? "border-brand-accent bg-brand-accent/10 text-slate-100"
                  : "border-brand-slate bg-brand-charcoal text-slate-400 hover:border-slate-500 hover:text-slate-300"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all duration-150",
                  checked
                    ? "bg-brand-accent border-brand-accent"
                    : "border-slate-600"
                )}
              >
                {checked && <Check size={12} strokeWidth={3} className="text-white" />}
              </div>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
