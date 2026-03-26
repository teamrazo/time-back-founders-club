"use client";
import React from "react";
import { FormData } from "@/lib/types";
import { StepWrapper } from "@/components/StepWrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { RadioGroup } from "@/components/ui/radio-group";

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
}

const TONE_OPTIONS = [
  { value: "professional-polished", label: "Professional & polished" },
  { value: "warm-approachable", label: "Warm & approachable" },
  { value: "bold-direct", label: "Bold & direct" },
  { value: "educational-helpful", label: "Educational & helpful" },
  { value: "casual-friendly", label: "Casual & friendly" },
  { value: "technical-precise", label: "Technical & precise" },
];

const CONTENT_PREFS = [
  { value: "short-bullets", label: "Short text / bullets (get to the point)" },
  { value: "detailed-writeups", label: "Detailed write-ups (I like context)" },
  { value: "visual", label: "Visual (charts, images, videos)" },
  { value: "audio-voice", label: "Audio / voice notes" },
];

const UPDATE_FREQ = [
  { value: "daily", label: "Daily briefs" },
  { value: "2-3x-week", label: "2–3x per week" },
  { value: "weekly", label: "Weekly summary" },
  { value: "when-matters", label: "Only when something matters" },
];

export function Step8Brand({ data, onChange }: Props) {
  const updateWord = (i: number, v: string) => {
    const arr = [...data.brandWords];
    arr[i] = v;
    onChange({ brandWords: arr });
  };

  return (
    <StepWrapper
      badge="Section 8 of 10"
      title="Brand & Communication"
      subtitle="How you show up matters. We'll use this to power all your AI-driven messaging."
    >
      <div className="p-5 rounded-xl border border-brand-slate bg-brand-charcoal/60">
        <p className="text-sm font-medium text-slate-300 mb-4">
          In 3 words, describe your brand personality
        </p>
        <div className="grid grid-cols-3 gap-3">
          {data.brandWords.map((word, i) => (
            <div key={i} className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center">
                <span className="text-xs font-bold text-brand-accent">{i + 1}</span>
              </div>
              <input
                type="text"
                value={word}
                onChange={(e) => updateWord(i, e.target.value)}
                placeholder={["Bold", "Clear", "Trusted"][i]}
                className="w-full rounded-lg border border-brand-slate bg-brand-slate/50 pl-10 pr-4 py-3 text-slate-100 placeholder:text-slate-600 text-sm transition-all duration-200 focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
              />
            </div>
          ))}
        </div>
      </div>

      <Textarea
        label="How does your ideal customer describe your business to a friend?"
        value={data.customerDescription}
        onChange={(e) => onChange({ customerDescription: e.target.value })}
        placeholder="They say things like '...' when they refer you. What's the story they tell?"
        rows={3}
        hint="This becomes the core of your AI messaging voice."
      />

      <div className="flex flex-col gap-3">
        <CheckboxGroup
          label="What tone should your communications have? (select all that apply)"
          options={TONE_OPTIONS}
          selected={data.commTone}
          onChange={(v) => onChange({ commTone: v })}
        />
        <Input
          label="Other tone not listed"
          value={data.commToneOther}
          onChange={(e) => onChange({ commToneOther: e.target.value })}
          placeholder="Describe your ideal tone..."
        />
      </div>

      <Textarea
        label="What should we NEVER sound like?"
        value={data.neverSoundLike}
        onChange={(e) => onChange({ neverSoundLike: e.target.value })}
        placeholder="e.g. Salesy, corporate, preachy, overly casual, hype-driven..."
        rows={2}
      />

      <CheckboxGroup
        label="Content & communication preferences"
        options={CONTENT_PREFS}
        selected={data.contentPrefs}
        onChange={(v) => onChange({ contentPrefs: v })}
      />

      <RadioGroup
        label="How often do you want to hear from us?"
        options={UPDATE_FREQ}
        value={data.updateFrequency}
        onChange={(v) => onChange({ updateFrequency: v })}
      />
    </StepWrapper>
  );
}
