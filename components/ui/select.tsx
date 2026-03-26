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
        <label className="text-sm font-medium text-brand-fg/80">
          {label}
          {required && <span className="text-brand-primary ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "w-full rounded-lg border border-brand-border bg-brand-card px-4 py-3 pr-10",
            "text-brand-fg text-sm appearance-none",
            "transition-all duration-200",
            "focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/20",
            "hover:border-brand-border-hover",
            !props.value && "text-brand-muted",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {normalized.map(o => (
            <option key={o.value} value={o.value} className="bg-brand-card text-brand-fg">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
      </div>
      {hint && <p className="text-xs text-brand-muted">{hint}</p>}
    </div>
  );
}
