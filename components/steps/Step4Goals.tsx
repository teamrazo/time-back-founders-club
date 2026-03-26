"use client";
import React from "react";
import { FormData } from "@/lib/types";
import { StepWrapper } from "@/components/StepWrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
}

function GoalInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center flex-shrink-0 mt-3">
        <span className="text-xs font-bold text-brand-accent">{label}</span>
      </div>
      <div className="flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-brand-slate bg-brand-charcoal px-4 py-3 text-slate-100 placeholder:text-slate-500 text-sm transition-all duration-200 focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 hover:border-slate-500"
        />
      </div>
    </div>
  );
}

export function Step4Goals({ data, onChange }: Props) {
  const update90 = (i: number, v: string) => {
    const arr = [...data.goals90day];
    arr[i] = v;
    onChange({ goals90day: arr });
  };

  const update12 = (i: number, v: string) => {
    const arr = [...data.goals12month];
    arr[i] = v;
    onChange({ goals12month: arr });
  };

  return (
    <StepWrapper
      badge="Section 4 of 10"
      title="Business Goals"
      subtitle="Clarity before scale. Direction over speed. Where are you building toward?"
    >
      <div className="p-5 rounded-xl border border-brand-slate bg-brand-charcoal/60 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-brand-accent font-bold">⚡</span>
          <h3 className="font-semibold text-slate-200">90-Day Goals</h3>
          <span className="text-xs text-slate-500">What needs to happen this quarter?</span>
        </div>
        {data.goals90day.map((g, i) => (
          <GoalInput
            key={i}
            label={String(i + 1)}
            value={g}
            onChange={(v) => update90(i, v)}
            placeholder={`Goal ${i + 1} — make it specific`}
          />
        ))}
      </div>

      <div className="p-5 rounded-xl border border-brand-slate bg-brand-charcoal/60 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-brand-gold font-bold">📈</span>
          <h3 className="font-semibold text-slate-200">12-Month Goals</h3>
          <span className="text-xs text-slate-500">Where should the business be in a year?</span>
        </div>
        {data.goals12month.map((g, i) => (
          <GoalInput
            key={i}
            label={String(i + 1)}
            value={g}
            onChange={(v) => update12(i, v)}
            placeholder={`Goal ${i + 1} — think bigger`}
          />
        ))}
      </div>

      <Textarea
        label="3-Year Vision"
        value={data.vision3year}
        onChange={(e) => onChange({ vision3year: e.target.value })}
        placeholder="Where does the business need to be in 3 years? What does 'done' look like? Be honest about what you're building toward."
        rows={4}
        hint="Paint the picture clearly. This anchors every decision we make together."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <Input
            label="12-Month Revenue Target"
            value={data.revenueTarget}
            onChange={(e) => onChange({ revenueTarget: e.target.value })}
            placeholder="$ e.g. 500,000"
          />
        </div>
        <div className="sm:col-span-1">
          <Input
            label="Net Margin Target"
            value={data.netMarginTarget}
            onChange={(e) => onChange({ netMarginTarget: e.target.value })}
            placeholder="e.g. 25%"
          />
        </div>
      </div>

      <Textarea
        label="Team Goal"
        value={data.teamGoal}
        onChange={(e) => onChange({ teamGoal: e.target.value })}
        placeholder="Hires you're planning, delegation shifts, org structure changes..."
        rows={2}
      />

      <Textarea
        label="Lifestyle Goal"
        value={data.lifestyleGoal}
        onChange={(e) => onChange({ lifestyleGoal: e.target.value })}
        placeholder="Travel, family time, reduced hours, hobbies — what does margin look like for you?"
        rows={2}
      />
    </StepWrapper>
  );
}
