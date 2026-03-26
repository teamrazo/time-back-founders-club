"use client";
import React from "react";
import { FormData } from "@/lib/types";
import { StepWrapper } from "@/components/StepWrapper";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
}

type FreedomKey = keyof FormData["freedom"];

const DIMENSIONS: {
  key: FreedomKey;
  letter: string;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    key: "financial",
    letter: "F",
    label: "Financial Clarity",
    description: "Do you know your numbers? Cash flow, margins, payroll — no surprises.",
    color: "#FCD34D",
  },
  {
    key: "revenue",
    letter: "R",
    label: "Revenue Systems",
    description: "Is your pipeline predictable? Do leads flow, get nurtured, and convert consistently?",
    color: "#60A5FA",
  },
  {
    key: "execution",
    letter: "E",
    label: "Execution Engine",
    description: "Do tasks get done without you? Is your team executing without constant oversight?",
    color: "#34D399",
  },
  {
    key: "energy",
    letter: "E",
    label: "Energy Optimization",
    description: "Are you energized or drained? Is your calendar aligned with your best work?",
    color: "#F472B6",
  },
  {
    key: "delegation",
    letter: "D",
    label: "Delegation Path",
    description: "Can your team run without you? Are the right people in the right seats?",
    color: "#A78BFA",
  },
  {
    key: "ownership",
    letter: "O",
    label: "Ownership Mindset",
    description: "Are you designing or doing? Working on the business, not just in it?",
    color: "#FB923C",
  },
  {
    key: "margin",
    letter: "M",
    label: "Margin Creation",
    description: "Do you have breathing room? Time, money, and mental space to think clearly?",
    color: "#2DD4BF",
  },
];

export function Step9Freedom({ data, onChange }: Props) {
  const updateFreedom = (key: FreedomKey, field: "score" | "notes", value: number | string) => {
    onChange({
      freedom: {
        ...data.freedom,
        [key]: {
          ...data.freedom[key],
          [field]: value,
        },
      },
    });
  };

  const totalScore = Object.values(data.freedom).reduce((sum, v) => sum + v.score, 0);
  const avgScore = Math.round((totalScore / DIMENSIONS.length) * 10) / 10;

  function getAvgLabel(avg: number): { label: string; color: string } {
    if (avg <= 3) return { label: "Early Stage — significant gaps to close", color: "#EF4444" };
    if (avg <= 5) return { label: "Developing — real leverage available", color: "#F59E0B" };
    if (avg <= 7) return { label: "Strong — ready to optimize", color: "#60A5FA" };
    return { label: "Well-Dialed — time to scale strategically", color: "#10B981" };
  }

  const { label: avgLabel, color: avgColor } = getAvgLabel(avgScore);

  return (
    <StepWrapper
      badge="Section 9 of 10"
      title="FREEDOM Scorecard"
      subtitle="Score yourself honestly. 1 = not started, 10 = fully dialed. This is your baseline."
    >
      <div className="p-4 rounded-xl bg-brand-charcoal border border-brand-slate flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Average FREEDOM Score</p>
          <p className="text-3xl font-bold mt-1" style={{ color: avgColor }}>{avgScore}<span className="text-lg text-slate-500 font-normal">/10</span></p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium" style={{ color: avgColor }}>{avgLabel}</p>
          <p className="text-xs text-slate-500 mt-1">Total: {totalScore} / {DIMENSIONS.length * 10}</p>
        </div>
      </div>

      {DIMENSIONS.map((dim) => {
        const val = data.freedom[dim.key];
        return (
          <div
            key={dim.key}
            className="p-5 rounded-xl border border-brand-slate bg-brand-charcoal/60 flex flex-col gap-4"
            style={{ borderLeftColor: dim.color, borderLeftWidth: 3 }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: dim.color + "20" }}
              >
                <span className="text-sm font-black" style={{ color: dim.color }}>{dim.letter}</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 text-sm">{dim.label}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{dim.description}</p>
              </div>
            </div>

            <Slider
              value={val.score}
              onChange={(v) => updateFreedom(dim.key, "score", v)}
              min={1}
              max={10}
              colorScale={true}
            />

            <Textarea
              placeholder="Notes on this dimension? (optional)"
              value={val.notes}
              onChange={(e) => updateFreedom(dim.key, "notes", e.target.value)}
              rows={2}
              className="bg-brand-slate/30"
            />
          </div>
        );
      })}
    </StepWrapper>
  );
}
