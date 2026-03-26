"use client";
import React from "react";
import { FormData } from "@/lib/types";
import { StepWrapper } from "@/components/StepWrapper";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { CheckboxGroup } from "@/components/ui/checkbox-group";

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
}

const TEAM_SIZES = [
  { value: "solo", label: "Solo — just me" },
  { value: "2-5", label: "2–5 people" },
  { value: "6-15", label: "6–15 people" },
  { value: "16-50", label: "16–50 people" },
  { value: "50+", label: "50+ people" },
];

const REVENUE_OPTIONS = [
  { value: "under-250k", label: "Under $250K" },
  { value: "250k-500k", label: "$250K – $500K" },
  { value: "500k-1m", label: "$500K – $1M" },
  { value: "1m-3m", label: "$1M – $3M" },
  { value: "3m-10m", label: "$3M – $10M" },
  { value: "10m+", label: "$10M+" },
];

const TECH_OPTIONS = [
  { value: "ghl", label: "GoHighLevel / CRM" },
  { value: "monday", label: "Monday.com" },
  { value: "airtable", label: "Airtable" },
  { value: "zapier-make", label: "Zapier / Make" },
  { value: "slack", label: "Slack" },
  { value: "google-workspace", label: "Google Workspace" },
  { value: "microsoft-365", label: "Microsoft 365" },
  { value: "quickbooks", label: "QuickBooks / Accounting" },
];

export function Step1Company({ data, onChange }: Props) {
  return (
    <StepWrapper
      badge="Section 1 of 10"
      title="Company Snapshot"
      subtitle="Let's get the basics. Quick and clean."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company Name"
          required
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
          placeholder="Acme Corp"
        />
        <Input
          label="Industry / Business Type"
          required
          value={data.industry}
          onChange={(e) => onChange({ industry: e.target.value })}
          placeholder="e.g. HVAC, Dental, Consulting"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Website URL"
          type="url"
          value={data.websiteUrl}
          onChange={(e) => onChange({ websiteUrl: e.target.value })}
          placeholder="https://yoursite.com"
        />
        <Input
          label="Location(s)"
          value={data.locations}
          onChange={(e) => onChange({ locations: e.target.value })}
          placeholder="Dallas, TX (or multiple)"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Year Founded"
          type="text"
          value={data.yearFounded}
          onChange={(e) => onChange({ yearFounded: e.target.value })}
          placeholder="e.g. 2018"
        />
      </div>

      <RadioGroup
        label="Team Size"
        options={TEAM_SIZES}
        value={data.teamSize}
        onChange={(v) => onChange({ teamSize: v })}
      />

      <RadioGroup
        label="Approximate Annual Revenue"
        options={REVENUE_OPTIONS}
        value={data.annualRevenue}
        onChange={(v) => onChange({ annualRevenue: v })}
      />

      <div className="flex flex-col gap-4">
        <CheckboxGroup
          label="Current Tech Stack (select all that apply)"
          options={TECH_OPTIONS}
          selected={data.techStack}
          onChange={(v) => onChange({ techStack: v })}
        />
        <Input
          label="Other tools not listed"
          value={data.techStackOther}
          onChange={(e) => onChange({ techStackOther: e.target.value })}
          placeholder="e.g. HubSpot, Notion, Calendly..."
        />
      </div>
    </StepWrapper>
  );
}
