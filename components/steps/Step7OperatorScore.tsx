"use client";
import React from "react";
import { FormData } from "@/lib/types";
import { StepWrapper } from "@/components/StepWrapper";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
}

const LEVELS = [
  {
    value: "full-operator",
    label: "Full Operator",
    description: "I touch everything. The business stops if I stop.",
    icon: "🔴",
    color: "#EF4444",
    bgColor: "rgba(239,68,68,0.08)",
    borderColor: "rgba(239,68,68,0.3)",
  },
  {
    value: "heavy-operator",
    label: "Heavy Operator",
    description: "I've delegated some things, but I'm still the bottleneck.",
    icon: "🟠",
    color: "#F97316",
    bgColor: "rgba(249,115,22,0.08)",
    borderColor: "rgba(249,115,22,0.3)",
  },
  {
    value: "hybrid",
    label: "Hybrid",
    description: "I have some systems, but I still do too much hands-on.",
    icon: "🟡",
    color: "#EAB308",
    bgColor: "rgba(234,179,8,0.08)",
    borderColor: "rgba(234,179,8,0.3)",
  },
  {
    value: "light-engineer",
    label: "Light Engineer",
    description: "Most things run without me, but I still step in regularly.",
    icon: "🔵",
    color: "#3B82F6",
    bgColor: "rgba(59,130,246,0.08)",
    borderColor: "rgba(59,130,246,0.3)",
  },
  {
    value: "engineer",
    label: "Engineer",
    description: "I design systems. The business runs. I choose where to focus.",
    icon: "🟢",
    color: "#10B981",
    bgColor: "rgba(16,185,129,0.08)",
    borderColor: "rgba(16,185,129,0.3)",
  },
];

export function Step7OperatorScore({ data, onChange }: Props) {
  return (
    <StepWrapper
      badge="Section 7 of 10"
      title="Operator → Engineer Score"
      subtitle="Where are you on the journey from doing everything to designing everything?"
    >
      <div className="p-4 rounded-xl bg-brand-slate/30 border border-brand-slate">
        <p className="text-sm text-slate-400 leading-relaxed">
          The Operator → Engineer shift is the core transformation we&apos;re building toward.
          Operators do the work. Engineers design the systems that do the work.
          There&apos;s no shame in being an Operator right now — that&apos;s where most of our clients start.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-300 mb-3">Right now, I would describe myself as:</p>
        <div className="flex flex-col gap-2">
          {LEVELS.map((level) => {
            const selected = data.operatorLevel === level.value;
            return (
              <button
                key={level.value}
                type="button"
                onClick={() => onChange({ operatorLevel: level.value })}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-150",
                  selected ? "scale-[1.01]" : "hover:scale-[1.005]"
                )}
                style={{
                  borderColor: selected ? level.color : "rgba(42,53,71,1)",
                  backgroundColor: selected ? level.bgColor : "rgba(26,35,50,0.6)",
                }}
              >
                <span className="text-2xl">{level.icon}</span>
                <div className="flex-1">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: selected ? level.color : "#CBD5E1" }}
                  >
                    {level.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{level.description}</p>
                </div>
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    selected ? "" : "border-slate-600"
                  )}
                  style={selected ? { borderColor: level.color } : {}}
                >
                  {selected && (
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: level.color }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Textarea
        label="What would need to change for you to move one level toward Engineer?"
        value={data.operatorNextStep}
        onChange={(e) => onChange({ operatorNextStep: e.target.value })}
        placeholder="Think about what's keeping you in an Operator role. What's the first thing that needs to be delegated, automated, or eliminated?"
        rows={4}
        hint="This becomes a key input for your AI Freedom Plan."
      />
    </StepWrapper>
  );
}
