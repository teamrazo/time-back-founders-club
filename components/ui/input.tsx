"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, required, hint, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-brand-fg/80">
            {label}
            {required && <span className="text-brand-primary ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full rounded-lg border bg-brand-card px-4 py-3",
            "text-brand-fg placeholder:text-brand-muted text-sm",
            "transition-all duration-200",
            "focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/20",
            "hover:border-brand-border-hover",
            error ? "border-brand-red" : "border-brand-border",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-brand-red">{error}</p>}
        {!error && hint && <p className="text-xs text-brand-muted">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
