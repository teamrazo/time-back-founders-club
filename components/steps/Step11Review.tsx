"use client";
import React from "react";
import { FormData } from "@/lib/types";
import { StepWrapper } from "@/components/StepWrapper";

interface Props {
  data: FormData;
}

function ReviewSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-xl border border-brand-slate bg-brand-charcoal/60">
      <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string | string[] | number }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.filter(Boolean).join(", ") : String(value);
  if (!display.trim()) return null;
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-slate-500 shrink-0 w-36">{label}</span>
      <span className="text-slate-300 flex-1">{display}</span>
    </div>
  );
}

const PILLAR_LABELS: Record<string, string> = {
  faith: "Faith / Purpose",
  family: "Family / Relationships",
  health: "Health / Energy",
  wealth: "Wealth / Financial Freedom",
  businessFreedom: "Business Freedom",
};

const FREEDOM_LABELS: Record<string, string> = {
  financial: "Financial Clarity",
  revenue: "Revenue Systems",
  execution: "Execution Engine",
  energy: "Energy Optimization",
  delegation: "Delegation Path",
  ownership: "Ownership Mindset",
  margin: "Margin Creation",
};

export function Step11Review({ data }: Props) {
  return (
    <StepWrapper
      badge="Final Review"
      title="Review Your Submission"
      subtitle="Everything looks good? Submit below or go back to make changes."
    >
      <ReviewSection title="Company Snapshot" icon="🏢">
        <ReviewRow label="Company" value={data.companyName} />
        <ReviewRow label="Industry" value={data.industry} />
        <ReviewRow label="Website" value={data.websiteUrl} />
        <ReviewRow label="Location" value={data.locations} />
        <ReviewRow label="Founded" value={data.yearFounded} />
        <ReviewRow label="Team Size" value={data.teamSize} />
        <ReviewRow label="Revenue" value={data.annualRevenue} />
        <ReviewRow label="Tech Stack" value={[...data.techStack, data.techStackOther].filter(Boolean)} />
      </ReviewSection>

      <ReviewSection title="Owner Profile" icon="👤">
        <ReviewRow label="Name" value={data.fullName} />
        <ReviewRow label="Role" value={data.roleTitle} />
        <ReviewRow label="Email" value={data.email} />
        <ReviewRow label="Phone" value={data.phone} />
        <ReviewRow label="Contact Pref" value={data.preferredContact} />
        <ReviewRow label="Timezone" value={data.timezone} />
        <ReviewRow label="Current hrs/wk" value={data.hoursCurrently} />
        <ReviewRow label="Target hrs/wk" value={data.hoursWanted} />
        <ReviewRow label="Ideal Day" value={data.idealWorkday} />
      </ReviewSection>

      <ReviewSection title="Five Pillars Assessment" icon="🎯">
        {Object.entries(data.pillars).map(([key, val]) => (
          <div key={key} className="flex gap-3 text-sm">
            <span className="text-slate-500 shrink-0 w-36">{PILLAR_LABELS[key]}</span>
            <span className="text-slate-300">
              Importance: <strong>{val.importance}/5</strong> &nbsp;·&nbsp; Satisfaction: <strong>{val.satisfaction}/5</strong>
              {val.notes && <span className="text-slate-500"> — {val.notes}</span>}
            </span>
          </div>
        ))}
      </ReviewSection>

      <ReviewSection title="Business Goals" icon="📈">
        <ReviewRow label="90-Day Goals" value={data.goals90day.filter(Boolean)} />
        <ReviewRow label="12-Month Goals" value={data.goals12month.filter(Boolean)} />
        <ReviewRow label="3-Year Vision" value={data.vision3year} />
        <ReviewRow label="Revenue Target" value={data.revenueTarget} />
        <ReviewRow label="Net Margin" value={data.netMarginTarget} />
        <ReviewRow label="Team Goal" value={data.teamGoal} />
        <ReviewRow label="Lifestyle Goal" value={data.lifestyleGoal} />
      </ReviewSection>

      <ReviewSection title="Pain Points & Friction" icon="⚡">
        <ReviewRow label="Top Stuck" value={data.topStuck.filter(Boolean)} />
        <ReviewRow label="Time Leaks" value={[...data.timeLeaks, data.timeLeakOther].filter(Boolean)} />
        <ReviewRow label="Reactive %" value={data.reactivePercent && `${data.reactivePercent}% reactive`} />
        <ReviewRow label="Eliminate" value={data.eliminateTask} />
      </ReviewSection>

      <ReviewSection title="Customer Lifecycle" icon="🔄">
        <ReviewRow label="Lead Sources" value={[...data.leadSources, data.leadSourceOther].filter(Boolean)} />
        <ReviewRow label="Bottleneck" value={data.biggestBottleneck} />
        <ReviewRow label="Follow-Up Speed" value={data.followUpSpeed} />
        <ReviewRow label="Review Strategy" value={data.reviewStrategy} />
      </ReviewSection>

      <ReviewSection title="Operator → Engineer Score" icon="📊">
        <ReviewRow label="Current Level" value={data.operatorLevel} />
        <ReviewRow label="Next Step" value={data.operatorNextStep} />
      </ReviewSection>

      <ReviewSection title="Brand & Communication" icon="💡">
        <ReviewRow label="Brand Words" value={data.brandWords.filter(Boolean)} />
        <ReviewRow label="Customer Says" value={data.customerDescription} />
        <ReviewRow label="Tone" value={[...data.commTone, data.commToneOther].filter(Boolean)} />
        <ReviewRow label="Never Sound Like" value={data.neverSoundLike} />
        <ReviewRow label="Content Prefs" value={data.contentPrefs} />
        <ReviewRow label="Update Freq" value={data.updateFrequency} />
      </ReviewSection>

      <ReviewSection title="FREEDOM Scorecard" icon="🏆">
        {Object.entries(data.freedom).map(([key, val]) => (
          <div key={key} className="flex gap-3 text-sm">
            <span className="text-slate-500 shrink-0 w-36">{FREEDOM_LABELS[key]}</span>
            <span className="text-slate-300">
              <strong>{val.score}/10</strong>
              {val.notes && <span className="text-slate-500"> — {val.notes}</span>}
            </span>
          </div>
        ))}
      </ReviewSection>

      <ReviewSection title="Quick Wins & Priorities" icon="🚀">
        <ReviewRow label="Wish Handled" value={data.wishHandled} />
        <ReviewRow label="One System" value={data.oneSystem} />
        <ReviewRow label="Unused Tools" value={data.unusedTools} />
        <ReviewRow label="Notes" value={data.anythingElse} />
      </ReviewSection>

      <div className="p-4 rounded-xl bg-brand-accent/8 border border-brand-accent/20 text-center">
        <p className="text-sm font-semibold text-slate-300 mb-1">Ready to submit?</p>
        <p className="text-xs text-slate-500">
          Click &quot;Submit&quot; below to send your intake form to the RazoRSharp team.
          Your FREEDOM Plan build begins from here.
        </p>
      </div>
    </StepWrapper>
  );
}
