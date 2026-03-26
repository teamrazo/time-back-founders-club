"use client";
import React from "react";
import { FormData } from "@/lib/types";
import { StepWrapper } from "@/components/StepWrapper";
import { Input } from "@/components/ui/input";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { RadioGroup } from "@/components/ui/radio-group";

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
}

const LEAD_SOURCES = [
  { value: "referrals", label: "Referrals / Word of mouth" },
  { value: "website-seo", label: "Website / SEO" },
  { value: "social-media", label: "Social media" },
  { value: "paid-ads", label: "Paid ads (Google, Facebook, etc.)" },
  { value: "cold-outreach", label: "Cold outreach" },
  { value: "partnerships", label: "Partnerships" },
  { value: "events-networking", label: "Events / networking" },
];

const BOTTLENECKS = [
  { value: "getting-leads", label: "Getting leads" },
  { value: "converting-appointments", label: "Converting leads to appointments" },
  { value: "no-show-rate", label: "Showing up (no-show rate)" },
  { value: "closing-sale", label: "Closing the sale" },
  { value: "delivering-service", label: "Delivering the service" },
  { value: "getting-reviews", label: "Getting reviews / referrals" },
  { value: "retaining-customers", label: "Retaining customers" },
  { value: "upselling", label: "Upselling / cross-selling" },
];

const FOLLOWUP_OPTIONS = [
  { value: "under-5min", label: "Under 5 minutes" },
  { value: "under-1hr", label: "Under 1 hour" },
  { value: "same-day", label: "Same day" },
  { value: "1-3-days", label: "1–3 days" },
  { value: "inconsistent", label: "Inconsistent / no system" },
];

const REVIEW_OPTIONS = [
  { value: "yes-automated", label: "Yes — automated" },
  { value: "yes-manual", label: "Yes — manual" },
  { value: "no", label: "No review strategy yet" },
];

export function Step6Lifecycle({ data, onChange }: Props) {
  return (
    <StepWrapper
      badge="Section 6 of 10"
      title="Customer Lifecycle"
      subtitle="How do customers move through your business? This is where leverage lives."
    >
      <div className="flex flex-col gap-3">
        <CheckboxGroup
          label="How do you currently get leads? (select all that apply)"
          options={LEAD_SOURCES}
          selected={data.leadSources}
          onChange={(v) => onChange({ leadSources: v })}
        />
        <Input
          label="Other lead sources"
          value={data.leadSourceOther}
          onChange={(e) => onChange({ leadSourceOther: e.target.value })}
          placeholder="Any other ways leads find you..."
        />
      </div>

      <div className="flex flex-col gap-3">
        <RadioGroup
          label="What's your biggest bottleneck in the customer journey?"
          options={BOTTLENECKS}
          value={data.biggestBottleneck}
          onChange={(v) => onChange({ biggestBottleneck: v })}
        />
        {data.biggestBottleneck === "other" && (
          <Input
            label="Describe your bottleneck"
            value={data.biggestBottleneckOther}
            onChange={(e) => onChange({ biggestBottleneckOther: e.target.value })}
            placeholder="What's slowing customer movement?"
          />
        )}
      </div>

      <RadioGroup
        label="How fast do you follow up with a new lead?"
        options={FOLLOWUP_OPTIONS}
        value={data.followUpSpeed}
        onChange={(v) => onChange({ followUpSpeed: v })}
      />

      <div className="p-4 rounded-xl bg-brand-slate/30 border border-brand-slate">
        <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Context</p>
        <p className="text-sm text-slate-400">
          Speed-to-lead is one of the highest-leverage actions in any business.
          Response within 5 minutes increases close rates significantly.
          If your answer was &quot;inconsistent&quot; — that&apos;s where we start.
        </p>
      </div>

      <RadioGroup
        label="Do you have an active review strategy?"
        options={REVIEW_OPTIONS}
        value={data.reviewStrategy}
        onChange={(v) => onChange({ reviewStrategy: v })}
      />
    </StepWrapper>
  );
}
