"use client";
import React from "react";
import { FormData } from "@/lib/types";
import { StepWrapper } from "@/components/StepWrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckboxGroup } from "@/components/ui/checkbox-group";

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
}

const CONTACT_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "slack", label: "Slack" },
  { value: "phone", label: "Phone call" },
];

export function Step2Owner({ data, onChange }: Props) {
  return (
    <StepWrapper
      badge="Section 2 of 10"
      title="Owner Profile"
      subtitle="We build systems around people. This section is about you."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          required
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="Jane Smith"
        />
        <Input
          label="Role / Title"
          value={data.roleTitle}
          onChange={(e) => onChange({ roleTitle: e.target.value })}
          placeholder="Owner, CEO, Founder..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email"
          required
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="jane@company.com"
        />
        <Input
          label="Phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="(555) 000-0000"
        />
      </div>

      <CheckboxGroup
        label="Preferred Contact Method"
        options={CONTACT_OPTIONS}
        selected={data.preferredContact}
        onChange={(v) => onChange({ preferredContact: v })}
      />

      <Input
        label="Timezone"
        value={data.timezone}
        onChange={(e) => onChange({ timezone: e.target.value })}
        placeholder="e.g. Central (CST), Eastern (EST)..."
      />

      <div className="p-4 rounded-xl bg-brand-slate/40 border border-brand-slate">
        <p className="text-sm font-semibold text-slate-300 mb-4">Hours Worked</p>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Currently working (hrs/week)"
            type="number"
            value={data.hoursCurrently}
            onChange={(e) => onChange({ hoursCurrently: e.target.value })}
            placeholder="e.g. 60"
          />
          <Input
            label="Want to work (hrs/week)"
            type="number"
            value={data.hoursWanted}
            onChange={(e) => onChange({ hoursWanted: e.target.value })}
            placeholder="e.g. 30"
          />
        </div>
      </div>

      <Textarea
        label="What does a great workday look like for you?"
        required
        value={data.idealWorkday}
        onChange={(e) => onChange({ idealWorkday: e.target.value })}
        placeholder="Describe your ideal day. Be specific — what time do you start, what tasks feel meaningful, what does the end of day feel like?"
        rows={4}
        hint="This helps us design systems that protect the work you actually want to do."
      />
    </StepWrapper>
  );
}
