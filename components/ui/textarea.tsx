"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  hint?: string;
}

export function Textarea({ label, required, hint, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-brand-accent ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={4}
        className={cn(
          "w-full rounded-lg border border-brand-slate bg-brand-charcoal px-4 py-3",
          "text-slate-100 placeholder:text-slate-500 text-sm",
          "transition-all duration-200 resize-none",
          "focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20",
          "hover:border-slate-500",
          className
        )}
        {...props}
      />
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
