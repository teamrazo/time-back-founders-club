"use client";
import React from "react";
import { FormData } from "@/lib/types";
import { StepWrapper } from "@/components/StepWrapper";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
}

type PillarKey = keyof FormData["pillars"];

const PILLARS: { key: PillarKey; icon: string; title: string; subtitle: string; color: string }[] = [
  {
    key: "faith",
    icon: "✦",
    title: "Faith / Purpose",
    subtitle: "Alignment, stewardship, meaning",
    color: "#A78BFA",
  },
  {
    key: "family",
    icon: "♥",
    title: "Family / Relationships",
    subtitle: "Margin for the people who matter",
    color: "#F472B6",
  },
  {
    key: "health",
    icon: "⬡",
    title: "Health / Energy",
    subtitle: "Longevity, sustainable performance",
    color: "#34D399",
  },
  {
    key: "wealth",
    icon: "◈",
    title: "Wealth / Financial Freedom",
    subtitle: "Revenue, assets, stability",
    color: "#FCD34D",
  },
  {
    key: "businessFreedom",
    icon: "◉",
    title: "Business Freedom",
    subtitle: "Systems, leverage, less owner dependency",
    color: "#60A5FA",
  },
];

function ImportanceDot({ level, filled }: { level: number; filled: boolean }) {
  return (
    <div
      className={cn(
        "w-2.5 h-2.5 rounded-full transition-all duration-150",
        filled ? "bg-brand-accent" : "bg-brand-slate"
      )}
      aria-label={`Level ${level}`}
    />
  );
}

export function Step3Pillars({ data, onChange }: Props) {
  const updatePillar = (key: PillarKey, field: string, value: number | string) => {
    onChange({
      pillars: {
        ...data.pillars,
        [key]: {
          ...data.pillars[key],
          [field]: value,
        },
      },
    });
  };

  return (
    <StepWrapper
      badge="Section 3 of 10"
      title="Five Pillars Assessment"
      subtitle="RazoRSharp aligns everything to what matters most. Rate each pillar honestly."
    >
      <div className="p-3 rounded-lg bg-brand-accent/8 border border-brand-accent/20 flex items-start gap-3">
        <span className="text-brand-accent mt-0.5 text-lg">ℹ</span>
        <div>
          <p className="text-sm font-medium text-slate-300">How to rate</p>
          <p className="text-xs text-slate-500 mt-0.5">
            <strong className="text-slate-400">Importance</strong> — how essential is this pillar to you (1 = low, 5 = essential) &nbsp;·&nbsp;
            <strong className="text-slate-400">Satisfaction</strong> — how are you doing in this area (1 = struggling, 5 = thriving)
          </p>
        </div>
      </div>

      {PILLARS.map((pillar) => {
        const val = data.pillars[pillar.key];
        return (
          <div
            key={pillar.key}
            className="p-5 rounded-xl border border-brand-slate bg-brand-charcoal/60 flex flex-col gap-5"
            style={{ borderLeftColor: pillar.color, borderLeftWidth: 3 }}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl" style={{ color: pillar.color }}>{pillar.icon}</span>
              <div>
                <h3 className="font-semibold text-slate-100">{pillar.title}</h3>
                <p className="text-xs text-slate-500">{pillar.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">Importance</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => updatePillar(pillar.key, "importance", n)}
                        className={cn(
                          "w-8 h-8 rounded-lg text-sm font-bold transition-all duration-150 border",
                          val.importance >= n
                            ? "border-brand-accent bg-brand-accent text-white"
                            : "border-brand-slate bg-brand-charcoal text-slate-500 hover:border-slate-400"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Low</span>
                  <span className="text-xs text-slate-600">Essential</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">Satisfaction</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((n) => {
                      const colors = ["#EF4444","#F59E0B","#FBBF24","#60A5FA","#10B981"];
                      const active = val.satisfaction >= n;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => updatePillar(pillar.key, "satisfaction", n)}
                          className={cn(
                            "w-8 h-8 rounded-lg text-sm font-bold transition-all duration-150 border",
                            active ? "text-white" : "border-brand-slate bg-brand-charcoal text-slate-500 hover:border-slate-400"
                          )}
                          style={active ? { backgroundColor: colors[n-1], borderColor: colors[n-1] } : {}}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Struggling</span>
                  <span className="text-xs text-slate-600">Thriving</span>
                </div>
              </div>
            </div>

            <Textarea
              placeholder="Any notes on this pillar? (optional)"
              value={val.notes}
              onChange={(e) => updatePillar(pillar.key, "notes", e.target.value)}
              rows={2}
              className="bg-brand-slate/30"
            />
          </div>
        );
      })}
    </StepWrapper>
  );
}
