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
        <label className="text-sm font-medium text-brand-fg/80">
          {label}
          {required && <span className="text-brand-primary ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={4}
        className={cn(
          "w-full rounded-lg border border-brand-border bg-brand-card px-4 py-3",
          "text-brand-fg placeholder:text-brand-muted text-sm",
          "transition-all duration-200 resize-none",
          "focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/20",
          "hover:border-brand-border-hover",
          className
        )}
        {...props}
      />
      {hint && <p className="text-xs text-brand-muted">{hint}</p>}
    </div>
  );
}
