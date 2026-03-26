"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2, Save, CheckCircle2 } from "lucide-react";
import { storage } from "@/lib/storage";
import { Stage2Data, defaultStage2Data } from "@/lib/types";
import { cn } from "@/lib/utils";
import { validateEntry, validateStage2, ValidationError } from "@/lib/validation";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { RadioGroup } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ProgressBar } from "@/components/ProgressBar";
import { SectionHeader } from "@/components/SectionHeader";
import { FidaMessage } from "@/components/FidaMessage";

const TOTAL_STEPS = 4;

// 2A: Current State
function Step2A({ data, onChange }: { data: Stage2Data; onChange: (d: Partial<Stage2Data>) => void }) {
  const HOW_OPTIONS = ['Referrals', 'Website/SEO', 'Social Media', 'Paid Ads', 'Cold Outreach', 'Partnerships', 'Events', 'Other'];
  const FOLLOWUP_OPTIONS = [
    { value: 'under-5min', label: 'Under 5 minutes' },
    { value: 'under-1hr', label: 'Under 1 hour' },
    { value: 'same-day', label: 'Same day' },
    { value: '1-3-days', label: '1-3 days' },
    { value: 'no-system', label: 'No system — it varies' },
  ];
  const SPEND_OPTIONS = ['Not spending yet', 'Under $500', '$500-$2K', '$2K-$5K', '$5K-$10K', '$10K-$25K', '$25K+'];

  return (
    <div className="space-y-5">
      <SectionHeader
        tag="Stage 2A"
        title="Current State"
        subtitle="Where you are is the most honest starting point. Let's see what's working and what's not."
      />
      <FidaMessage
        feeling="Most marketing 'strategies' are really just guesses with better branding."
        action="Tell us what's real. We build from the truth — not the pitch deck."
      />
      <CheckboxGroup label="How do customers find you today?" options={HOW_OPTIONS} value={data.howCustomersFind} onChange={v => onChange({ howCustomersFind: v })} />
      <Select label="How fast do you follow up with new leads?" value={data.followUpSpeed} onChange={e => onChange({ followUpSpeed: e.target.value })} options={FOLLOWUP_OPTIONS} placeholder="Select..." />
      <Textarea label="What marketing have you tried that WORKED?" value={data.marketingWorked} onChange={e => onChange({ marketingWorked: e.target.value })} placeholder="Be specific — channels, campaigns, tactics..." rows={3} />
      <Textarea label="What marketing have you tried that DIDN'T work?" value={data.marketingDidntWork} onChange={e => onChange({ marketingDidntWork: e.target.value })} placeholder="Honest answers help us avoid the same mistakes..." rows={3} />
    </div>
  );
}

// 2B: Target Market
function Step2B({ data, onChange }: { data: Stage2Data; onChange: (d: Partial<Stage2Data>) => void }) {
  const AGE_OPTIONS = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+', 'All ages'];
  const GEO_OPTIONS = ['Local (city/metro)', 'Regional (state/region)', 'National', 'Global'];
  const DEAL_SIZE_OPTIONS = ['Under $500', '$500-$1K', '$1K-$3K', '$3K-$10K', '$10K-$25K', '$25K-$100K', '$100K+'];
  const LEAD_VOL_OPTIONS = ['Under 10', '10-25', '25-50', '50-100', '100-250', '250+'];
  const CLOSE_OPTIONS = ["Don't know", 'Under 10%', '10-25%', '25-50%', '50-75%', '75%+'];

  return (
    <div className="space-y-5">
      <SectionHeader
        tag="Stage 2B"
        title="Your Target Market"
        subtitle="Clarity on who you serve determines everything else in your marketing system."
      />
      <FidaMessage
        dream="When you're speaking to the right person, you don't need to shout."
        identity="You're not marketing to everyone. You're calling out to one person."
      />
      <Textarea
        label="Describe your ideal customer in one sentence"
        value={data.idealCustomer}
        onChange={e => onChange({ idealCustomer: e.target.value })}
        placeholder="e.g. Homeowners in Dallas who need HVAC repair or replacement within 30 days"
        rows={2}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Customer Age Range" value={data.customerAgeRange} onChange={e => onChange({ customerAgeRange: e.target.value })} options={AGE_OPTIONS} placeholder="Select..." />
        <Select label="Geographic Focus" value={data.geographicFocus} onChange={e => onChange({ geographicFocus: e.target.value })} options={GEO_OPTIONS} placeholder="Select..." />
        <Select label="Average Deal Size / Customer Value" value={data.averageDealSize} onChange={e => onChange({ averageDealSize: e.target.value })} options={DEAL_SIZE_OPTIONS} placeholder="Select..." />
        <Select label="Monthly Lead Volume" value={data.monthlyLeadVolume} onChange={e => onChange({ monthlyLeadVolume: e.target.value })} options={LEAD_VOL_OPTIONS} placeholder="Select..." />
        <Select label="Current Close Rate" value={data.currentCloseRate} onChange={e => onChange({ currentCloseRate: e.target.value })} options={CLOSE_OPTIONS} placeholder="Select..." />
      </div>
    </div>
  );
}

// 2C: Where You're Going
function Step2C({ data, onChange }: { data: Stage2Data; onChange: (d: Partial<Stage2Data>) => void }) {
  const REV_TARGET_OPTIONS = ['Under $100K', '$100K-$250K', '$250K-$500K', '$500K-$1M', '$1M-$2.5M', '$2.5M-$5M', '$5M+'];
  const BOTTLENECK_OPTIONS = [
    { value: 'getting-leads', label: 'Getting enough leads' },
    { value: 'converting-appointments', label: 'Converting leads to appointments' },
    { value: 'show-rate', label: 'Show rate (people not showing up)' },
    { value: 'closing', label: 'Closing / converting to clients' },
    { value: 'delivery', label: 'Delivering the product/service' },
    { value: 'reviews-referrals', label: 'Getting reviews & referrals' },
    { value: 'retention', label: 'Retaining clients' },
    { value: 'upselling', label: 'Upselling / increasing LTV' },
  ];
  const SOCIAL_OPTIONS = ['Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok', 'None'];
  const REVIEW_OPTIONS = [
    { value: 'yes-automated', label: 'Yes — automated system' },
    { value: 'yes-manual', label: 'Yes — manual process' },
    { value: 'no', label: 'No review strategy yet' },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader
        tag="Stage 2C"
        title="Where You're Going"
        subtitle="Your 12-month vision shapes every campaign decision we make."
      />
      <FidaMessage
        dream="What does your business look like when marketing finally works the way it should?"
        action="Paint the picture. Specifics matter more than polish."
      />
      <Textarea
        label="If your marketing was working perfectly, what would your business look like in 12 months?"
        value={data.perfectMarketingVision}
        onChange={e => onChange({ perfectMarketingVision: e.target.value })}
        placeholder="Revenue, clients, team size, stress level, daily schedule..."
        rows={4}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Monthly Revenue Target (12 months)" value={data.monthlyRevenueTarget} onChange={e => onChange({ monthlyRevenueTarget: e.target.value })} options={REV_TARGET_OPTIONS} placeholder="Select..." />
      </div>
      <RadioGroup label="What's the #1 bottleneck in your customer journey?" options={BOTTLENECK_OPTIONS} value={data.customerJourneyBottleneck} onChange={v => onChange({ customerJourneyBottleneck: v })} />
      <RadioGroup label="Do you have an active review strategy?" options={REVIEW_OPTIONS} value={data.activeReviewStrategy} onChange={v => onChange({ activeReviewStrategy: v })} />
      <CheckboxGroup label="Social Media Presence (where you actively post)" options={SOCIAL_OPTIONS} value={data.socialMediaPresence} onChange={v => onChange({ socialMediaPresence: v })} />
    </div>
  );
}

// 2D: Experience & Readiness
function Step2D({ data, onChange }: { data: Stage2Data; onChange: (d: Partial<Stage2Data>) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader
        tag="Stage 2D"
        title="Experience & Readiness"
        subtitle="Understanding your history helps us build the right system for where you actually are."
      />
      <FidaMessage
        feeling="Maybe you've been burned before. Maybe this is your first time. Either way — we need to know."
        identity="There's no judgment here. Just clarity."
      />
      <RadioGroup
        label="Have you worked with a marketing agency before?"
        options={['Yes', 'No']}
        value={data.workedWithAgency}
        onChange={v => onChange({ workedWithAgency: v })}
        layout="horizontal"
      />
      {data.workedWithAgency === 'Yes' && (
        <Textarea
          label="What was your experience like?"
          value={data.agencyExperience}
          onChange={e => onChange({ agencyExperience: e.target.value })}
          placeholder="What worked, what didn't, what you wish they had done differently..."
          rows={3}
        />
      )}
      <div className="p-4 rounded-lg border border-brand-border bg-brand-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-brand-fg">Readiness to Invest in Growth</div>
            <div className="text-xs text-brand-muted mt-0.5">1 = Not ready yet · 10 = Let&apos;s go right now</div>
          </div>
          <span className="text-3xl font-bold text-brand-primary">{data.readinessScore}</span>
        </div>
        <Slider min={1} max={10} value={data.readinessScore} onChange={v => onChange({ readinessScore: v })} colorScale />
      </div>
      <Textarea
        label="What's your biggest concern about working with us?"
        value={data.biggestConcern}
        onChange={e => onChange({ biggestConcern: e.target.value })}
        placeholder="Price? Time commitment? Past experiences? Be direct — we can handle it."
        rows={3}
      />
    </div>
  );
}

export default function Stage2Page() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [stageData, setStageData] = useState<Stage2Data>(defaultStage2Data);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    setStageData(storage.getStage2());
    const status = storage.getStatus();
    if (status.stage2 === 'in-progress') {
      // resume at step 1 (they can navigate through)
    }
    // Mark in progress
    if (status.stage2 === 'not-started') {
      storage.setStatus({ ...status, stage2: 'in-progress', lastUpdated: new Date().toISOString() });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      storage.setStage2(stageData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
    return () => clearTimeout(timer);
  }, [stageData]);

  const updateStage = useCallback((updates: Partial<Stage2Data>) => {
    setStageData(prev => ({ ...prev, ...updates }));
  }, []);

  const goNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const entry = storage.getEntry();
      const payload = {
        stage: 'stage2',
        stageLabel: 'Marketing Assessment',
        entry,
        stage2: stageData,
        _hp: honeypot,
        submittedAt: new Date().toISOString(),
      };
      const res = await fetch('/api/stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submission failed');
      const status = storage.getStatus();
      storage.setStatus({ ...status, stage2: 'complete', lastUpdated: new Date().toISOString() });
      router.push('/?stage2=complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step2A data={stageData} onChange={updateStage} />;
      case 2: return <Step2B data={stageData} onChange={updateStage} />;
      case 3: return <Step2C data={stageData} onChange={updateStage} />;
      case 4: return <Step2D data={stageData} onChange={updateStage} />;
      default: return null;
    }
  };

  const stepLabels = ['Current State', 'Target Market', 'Where You\'re Going', 'Experience & Readiness'];

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Honeypot (anti-bot) */}
      <div className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="hp">Leave this field empty</label>
        <input
          id="hp"
          type="text"
          name="_hp"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      <header className="sticky top-0 z-50 border-b border-brand-border/60 bg-brand-bg/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/')} className="text-brand-muted hover:text-brand-fg/80 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div>
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Stage 2</div>
                <div className="text-sm font-bold text-brand-fg">Marketing Assessment</div>
              </div>
            </div>
            {saved && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Save size={12} />
                Saved
              </div>
            )}
          </div>
          <ProgressBar current={step} total={TOTAL_STEPS} label={stepLabels[step - 1] || ''} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-32 animate-slide-up">
        {renderStep()}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-border/60 bg-brand-bg/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {error && (
            <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">{error}</div>
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-brand-border text-brand-muted-light hover:text-brand-fg hover:border-brand-border-hover transition-all text-sm font-medium"
            >
              <ChevronLeft size={16} />
              {step === 1 ? 'Home' : 'Back'}
            </button>
            <div className="flex-1" />
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/25"
              >
                Continue
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/25"
              >
                {submitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Saving...</>
                ) : (
                  <><CheckCircle2 size={16} /> Complete Stage 2</>
                )}
              </button>
            )}
          </div>
          <div className="flex justify-center mt-2 gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={cn(
                "rounded-full transition-all duration-300",
                i + 1 === step ? "w-4 h-1.5 bg-emerald-500" : i + 1 < step ? "w-1.5 h-1.5 bg-emerald-500/40" : "w-1.5 h-1.5 bg-brand-slate"
              )} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
