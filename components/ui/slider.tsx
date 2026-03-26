"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  colorScale?: boolean;
  className?: string;
}

function getScoreColor(value: number, max: number): string {
  const pct = value / max;
  if (pct <= 0.3) return "#EF4444";
  if (pct <= 0.5) return "#F59E0B";
  if (pct <= 0.7) return "#60A5FA";
  return "#10B981";
}

function getScoreLabel(value: number): string {
  if (value <= 2) return "Not Started";
  if (value <= 4) return "Early Stage";
  if (value <= 6) return "Developing";
  if (value <= 8) return "Strong";
  return "Fully Dialed";
}

export function Slider({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
  showValue = true,
  colorScale = false,
  className,
}: SliderProps) {
  const color = colorScale ? getScoreColor(value, max) : "#3B82F6";
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm font-medium text-brand-fg/80">{label}</span>}
          {showValue && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tabular-nums" style={{ color }}>
                {value}
              </span>
              <span className="text-xs text-brand-muted">/{max}</span>
              {colorScale && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: color + "20", color }}>
                  {getScoreLabel(value)}
                </span>
              )}
            </div>
          )}
        </div>
      )}
      <div className="relative">
        <div
          className="absolute top-1/2 left-0 h-1.5 rounded-l-full -translate-y-1/2 transition-all duration-150 pointer-events-none"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-xs text-brand-muted">
        <span>{min}</span>
        <span>{Math.round((min + max) / 2)}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
