"use client";
import React from "react";
import { FormData } from "@/lib/types";
import { StepWrapper } from "@/components/StepWrapper";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CheckboxGroup } from "@/components/ui/checkbox-group";

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
}

const TIME_LEAK_OPTIONS = [
  { value: "answering-questions", label: "Answering the same questions repeatedly" },
  { value: "manual-followup", label: "Following up manually (leads, clients, team)" },
  { value: "content-marketing", label: "Creating content / marketing" },
  { value: "managing-team", label: "Managing the team" },
  { value: "customer-service", label: "Handling customer service" },
  { value: "admin-bookkeeping", label: "Administrative / bookkeeping" },
  { value: "reactive-fires", label: "Putting out fires / reactive work" },
];

export function Step5PainPoints({ data, onChange }: Props) {
  const updateStuck = (i: number, v: string) => {
    const arr = [...data.topStuck];
    arr[i] = v;
    onChange({ topStuck: arr });
  };

  return (
    <StepWrapper
      badge="Section 5 of 10"
      title="Pain Points & Friction"
      subtitle="We don't automate chaos. We find the friction first. Be honest — this is where the work begins."
    >
      <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-red-400">⚡</span>
          <h3 className="font-semibold text-slate-200">What are the top 3 things keeping you stuck?</h3>
        </div>
        {data.topStuck.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0 mt-3">
              <span className="text-xs font-bold text-red-400">{i + 1}</span>
            </div>
            <input
              type="text"
              value={item}
              onChange={(e) => updateStuck(i, e.target.value)}
              placeholder={`Stuck point ${i + 1} — be specific`}
              className="flex-1 rounded-lg border border-brand-slate bg-brand-charcoal px-4 py-3 text-slate-100 placeholder:text-slate-500 text-sm transition-all duration-200 focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 hover:border-slate-500"
            />
          </div>
        ))}
      </div>

      <CheckboxGroup
        label="Where does your time leak most? (select all that apply)"
        options={TIME_LEAK_OPTIONS}
        selected={data.timeLeaks}
        onChange={(v) => onChange({ timeLeaks: v })}
      />

      <Input
        label="Other time leak not listed"
        value={data.timeLeakOther}
        onChange={(e) => onChange({ timeLeakOther: e.target.value })}
        placeholder="Describe any other area..."
      />

      <div className="p-5 rounded-xl border border-brand-slate bg-brand-charcoal/60">
        <p className="text-sm font-semibold text-slate-300 mb-4">
          Time Split — Reactive vs. Proactive
        </p>
        <p className="text-xs text-slate-500 mb-4">
          What percentage of your week is unplanned (reactive) vs. intentional (proactive)?
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Reactive % (unplanned)"
            type="number"
            min="0"
            max="100"
            value={data.reactivePercent}
            onChange={(e) => {
              const v = e.target.value;
              onChange({ reactivePercent: v, proactivePercent: v ? String(100 - parseInt(v)) : "" });
            }}
            placeholder="e.g. 70"
          />
          <Input
            label="Proactive % (planned)"
            type="number"
            min="0"
            max="100"
            value={data.proactivePercent}
            onChange={(e) => onChange({ proactivePercent: e.target.value })}
            placeholder="e.g. 30"
          />
        </div>
      </div>

      <Textarea
        label="If you could eliminate ONE task from your week, what would it be?"
        value={data.eliminateTask}
        onChange={(e) => onChange({ eliminateTask: e.target.value })}
        placeholder="Be specific — what's the most draining thing on your plate?"
        rows={3}
        hint="This often becomes our first system to build."
      />
    </StepWrapper>
  );
}
