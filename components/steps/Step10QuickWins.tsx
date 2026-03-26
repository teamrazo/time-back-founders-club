"use client";
import React from "react";
import { FormData } from "@/lib/types";
import { StepWrapper } from "@/components/StepWrapper";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
}

export function Step10QuickWins({ data, onChange }: Props) {
  return (
    <StepWrapper
      badge="Section 10 of 10"
      title="Quick Wins & Priorities"
      subtitle="Where should we start? What would create the most leverage the fastest?"
    >
      <div className="p-4 rounded-xl bg-brand-accent/8 border border-brand-accent/20">
        <p className="text-sm text-slate-400 leading-relaxed">
          You&apos;ve built the full picture. Now let&apos;s narrow the focus.
          The best system is the one that solves your biggest problem first.
          Think about what would change the most if it were just... handled.
        </p>
      </div>

      <div className="p-5 rounded-xl border border-brand-gold/20 bg-brand-gold/5">
        <Textarea
          label="What's the #1 thing you wish was just... handled?"
          value={data.wishHandled}
          onChange={(e) => onChange({ wishHandled: e.target.value })}
          placeholder="The thing that keeps coming up. The task that drains you. The gap that costs you the most time or money."
          rows={3}
          hint="Often this becomes System #1."
        />
      </div>

      <Textarea
        label="If we could build you ONE system in the next 30 days, what would make the biggest difference?"
        value={data.oneSystem}
        onChange={(e) => onChange({ oneSystem: e.target.value })}
        placeholder="Think about what would create the most leverage. Could be a follow-up sequence, a reporting dashboard, a booking system, an AI assistant..."
        rows={4}
      />

      <Textarea
        label="Are there any existing services or tools you're paying for but NOT using well?"
        value={data.unusedTools}
        onChange={(e) => onChange({ unusedTools: e.target.value })}
        placeholder="Software you're paying for but barely using, subscriptions that should be working harder for you..."
        rows={3}
        hint="This often reveals quick savings and untapped leverage."
      />

      <Textarea
        label="Anything else we should know?"
        value={data.anythingElse}
        onChange={(e) => onChange({ anythingElse: e.target.value })}
        placeholder="Context, concerns, opportunities, constraints, goals we haven't asked about yet — anything that would help us do better work for you."
        rows={4}
      />

      <div className="p-5 rounded-xl border border-green-500/20 bg-green-500/5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-green-400 text-lg">✓</span>
          <p className="font-semibold text-slate-200">You&apos;re almost done.</p>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          On the next step, you&apos;ll see a summary of everything you&apos;ve filled in.
          Review it, make any changes, then submit.
          Your AI Freedom Plan starts from here.
        </p>
      </div>
    </StepWrapper>
  );
}
