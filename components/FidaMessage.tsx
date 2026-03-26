"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface FidaMessageProps {
  feeling?: string;
  identity?: string;
  dream?: string;
  action?: string;
  className?: string;
  variant?: 'default' | 'subtle';
}

export function FidaMessage({ feeling, identity, dream, action, className, variant = 'default' }: FidaMessageProps) {
  return (
    <div className={cn(
      "rounded-xl border p-4 space-y-2",
      variant === 'default'
        ? "border-brand-accent/20 bg-brand-accent/5"
        : "border-brand-slate bg-brand-charcoal",
      className
    )}>
      {feeling && (
        <p className="text-sm text-slate-300 leading-relaxed">
          <span className="text-xs font-semibold text-brand-accent uppercase tracking-wide mr-1">Feel:</span>
          {feeling}
        </p>
      )}
      {identity && (
        <p className="text-sm text-slate-300 leading-relaxed">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide mr-1">Identity:</span>
          {identity}
        </p>
      )}
      {dream && (
        <p className="text-sm text-slate-300 leading-relaxed">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mr-1">Dream:</span>
          {dream}
        </p>
      )}
      {action && (
        <p className="text-sm text-slate-300 leading-relaxed">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide mr-1">Action:</span>
          {action}
        </p>
      )}
    </div>
  );
}
