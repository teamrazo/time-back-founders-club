"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  hint?: string;
  options: { value: string; label: string }[] | string[];
  placeholder?: string;
}

export function Select({ label, required, hint, options, placeholder, className, ...props }: SelectProps) {
  const normalized = options.map(o => typeof o === 'string' ? { value: o, label: o } : o);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-brand-accent ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "w-full rounded-lg border border-brand-slate bg-brand-charcoal px-4 py-3 pr-10",
            "text-slate-100 text-sm appearance-none",
            "transition-all duration-200",
            "focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20",
            "hover:border-slate-500",
            !props.value && "text-slate-500",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {normalized.map(o => (
            <option key={o.value} value={o.value} className="bg-brand-charcoal text-slate-100">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      </div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
