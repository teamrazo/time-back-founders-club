"use client";
import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  tag?: string;
}

export function SectionHeader({ title, subtitle, tag }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      {tag && (
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand-primary mb-2">
          {tag}
        </span>
      )}
      <h2 className="text-xl font-bold text-brand-fg leading-snug">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-brand-muted-light leading-relaxed">{subtitle}</p>}
    </div>
  );
}
