"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2, Save, CheckCircle2 } from "lucide-react";
import { storage } from "@/lib/storage";
import {
  Stage1Data, EntryData, defaultStage1Data, defaultEntryData,
  TECH_STACK_OPTIONS, TEAM_SIZE_OPTIONS, ANNUAL_REVENUE_OPTIONS,
  REVENUE_TARGET_OPTIONS,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { validateEntry, validateStage1, ValidationError } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { RadioGroup } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ProgressBar } from "@/components/ProgressBar";
import { SectionHeader } from "@/components/SectionHeader";
import { FidaMessage } from "@/components/FidaMessage";

const TOTAL_STEPS = 4;

// Entry questions embedded at top of stage1
function EntrySection({ data, onChange }: { data: EntryData; onChange: (d: Partial<EntryData>) => void }) {
  const INDUSTRY_OPTIONS = [
    'Automotive', 'Construction & Contracting', 'Dental & Orthodontics', 'E-Commerce',
    'Financial Services', 'Health & Wellness', 'Home Services', 'Hospitality & Events',
    'Insurance', 'Law & Legal Services', 'Medical & Healthcare', 'Real Estate',
    'Restaurant & Food Service', 'Retail', 'Technology & Software', 'Other',
  ];
  const YEARS = ['<1 year', '1-3 years', '3-5 years', '5-10 years', '10-20 years', '20+ years'];
  const BUDGETS = ['Not spending yet', 'Under $500', '$500-$2K', '$2K-$5K', '$5K-$10K', '$10K-$25K', '$25K+'];
  const REV_MODELS = ['Product', 'Service', 'E-commerce', 'Content', 'Donations'];

  return (
    <div className="space-y-5">
      <SectionHeader
        tag="Entry"
        title="Let's start with the basics."
        subtitle="This information feeds your entire system. Take your time — it matters."
      />

      <FidaMessage
        feeling="You've got a business to run and not enough time to run it."
        identity="You're about to become an Engineer instead of an Operator."
        action="Answer once. Your system works from here."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" required value={data.fullName} onChange={e => onChange({ fullName: e.target.value })} placeholder="Jesse Razo" />
        <Input label="Company Name" required value={data.companyName} onChange={e => onChange({ companyName: e.target.value })} placeholder="Acme Inc." />
        <Input label="Mobile Phone" required type="tel" value={data.mobilePhone} onChange={e => onChange({ mobilePhone: e.target.value })} placeholder="+1 (555) 000-0000" />
        <Input label="Best Email" required type="email" value={data.bestEmail} onChange={e => onChange({ bestEmail: e.target.value })} placeholder="you@company.com" />
        <Input label="City / State" required value={data.cityState} onChange={e => onChange({ cityState: e.target.value })} placeholder="Dallas, TX" />
        <Select label="Industry" required value={data.industry} onChange={e => onChange({ industry: e.target.value })} options={INDUSTRY_OPTIONS} placeholder="Select industry..." />
      </div>

      {data.industry === 'Other' && (
        <Input label="Your Industry" required value={data.industryOther} onChange={e => onChange({ industryOther: e.target.value })} placeholder="Describe your industry" />
      )}

      <Input label="Specialty / Niche" required value={data.specialtyNiche} onChange={e => onChange({ specialtyNiche: e.target.value })} placeholder="e.g. HVAC residential repair, personal injury law" />

      <CheckboxGroup label="Revenue Model (select all that apply)" options={REV_MODELS} value={data.revenueModel} onChange={v => onChange({ revenueModel: v })} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Years In Business" required value={data.yearsInBusiness} onChange={e => onChange({ yearsInBusiness: e.target.value })} options={YEARS} placeholder="Select..." />
        <Select label="Monthly Marketing Budget" required value={data.monthlyBudget} onChange={e => onChange({ monthlyBudget: e.target.value })} options={BUDGETS} placeholder="Select range..." />
      </div>

      <RadioGroup
        label="Are you an existing RazoRSharp client?"
        options={['Yes', 'No']}
        value={data.isExistingClient}
        onChange={v => onChange({ isExistingClient: v })}
        layout="horizontal"
      />

      <RadioGroup
        label="What best describes you?"
        options={['Solopreneur', 'Entrepreneur (small team)', 'Business Owner (established team)', 'Employer (10+ employees)']}
        value={data.businessType}
        onChange={v => onChange({ businessType: v })}
      />

      <RadioGroup
        label="Are you interested in building tools for your team?"
        options={['Yes', 'No']}
        value={data.teamToolsInterest}
        onChange={v => onChange({ teamToolsInterest: v })}
        layout="horizontal"
      />
    </div>
  );
}

// Step 1A: Business Identity
function Step1A({ data, onChange }: { data: Stage1Data; onChange: (d: Partial<Stage1Data>) => void }) {
  const CONTACT_OPTIONS = ['Phone', 'Text', 'Email'];
  const TECH_OPTIONS = TECH_STACK_OPTIONS;

  return (
    <div className="space-y-5">
      <SectionHeader tag="Stage 1A" title="Business Identity" subtitle="This builds your PROFILE — the foundation of your AI Growth Engine." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Business Hours" value={data.businessHours} onChange={e => onChange({ businessHours: e.target.value })} placeholder="Mon-Fri 8am-5pm" />
        <Select label="Team Size" value={data.teamSize} onChange={e => onChange({ teamSize: e.target.value })} options={TEAM_SIZE_OPTIONS} placeholder="Select..." />
        <Select label="Annual Revenue Range" value={data.annualRevenue} onChange={e => onChange({ annualRevenue: e.target.value })} options={ANNUAL_REVENUE_OPTIONS} placeholder="Select..." />
        <Input label="Website URL" type="url" value={data.websiteUrl} onChange={e => onChange({ websiteUrl: e.target.value })} placeholder="https://yoursite.com" />
      </div>
      <CheckboxGroup label="Preferred Contact Method" options={CONTACT_OPTIONS} value={data.preferredContact} onChange={v => onChange({ preferredContact: v })} />
      <RadioGroup
        label="Preferred Marketing Hours"
        options={['Business Hours Only', '24/7/365']}
        value={data.preferredMarketingHours}
        onChange={v => onChange({ preferredMarketingHours: v })}
        layout="horizontal"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Marketing Notification Email(s)" type="email" value={data.notificationEmails} onChange={e => onChange({ notificationEmails: e.target.value })} placeholder="alerts@company.com" />
        <Input label="Report Email(s)" type="email" value={data.reportEmails} onChange={e => onChange({ reportEmails: e.target.value })} placeholder="reports@company.com" />
      </div>
      <CheckboxGroup label="Current Tech Stack" options={TECH_OPTIONS} value={data.techStack} onChange={v => onChange({ techStack: v })} />
      {data.techStack.includes('Other') && (
        <Input label="Other Tech Tools" value={data.techStackOther} onChange={e => onChange({ techStackOther: e.target.value })} placeholder="List other tools you use" />
      )}
    </div>
  );
}

// Step 1B: Owner Goals
function Step1B({ data, onChange }: { data: Stage1Data; onChange: (d: Partial<Stage1Data>) => void }) {
  const PILLARS = [
    { key: 'faith', label: 'Faith / Purpose' },
    { key: 'family', label: 'Family / Relationships' },
    { key: 'health', label: 'Health / Energy' },
    { key: 'wealth', label: 'Wealth / Financial Freedom' },
    { key: 'businessFreedom', label: 'Business Freedom' },
  ] as const;

  const setPillar = (key: typeof PILLARS[number]['key'], field: 'importance' | 'satisfaction', val: number) => {
    onChange({ pillars: { ...data.pillars, [key]: { ...data.pillars[key], [field]: val } } });
  };

  return (
    <div className="space-y-6">
      <SectionHeader tag="Stage 1B" title="Owner Goals" subtitle="Your goals shape your FREEDOM Plan. Be honest — this is for you." />

      <FidaMessage
        feeling="You got into business for freedom. Right now it might feel like the business owns you."
        identity="You're not here to just grow revenue. You're here to build a life."
        dream="What does your life look like when the system runs itself?"
      />

      <Textarea
        label="What's the ONE thing that frustrates you most about running your business right now?"
        required
        value={data.biggestFrustration}
        onChange={e => onChange({ biggestFrustration: e.target.value })}
        placeholder="Be specific. This is where your system starts."
        rows={3}
      />

      <Textarea
        label="If we could fix that in 90 days, what would your life look like?"
        required
        value={data.visionFixed}
        onChange={e => onChange({ visionFixed: e.target.value })}
        placeholder="Paint the picture. Time, energy, peace of mind..."
        rows={3}
      />

      {/* Five Pillars */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-brand-fg mb-1">Five Pillars Assessment</h3>
          <p className="text-xs text-brand-muted">Rate each pillar: 1 = Low, 5 = High</p>
        </div>
        {PILLARS.map(({ key, label }) => (
          <div key={key} className="p-4 rounded-lg border border-brand-border bg-brand-card space-y-3">
            <div className="text-sm font-semibold text-brand-fg">{label}</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-brand-muted mb-2">Importance to you</div>
                <Slider min={1} max={5} value={data.pillars[key].importance} onChange={v => setPillar(key, 'importance', v)} colorScale />
              </div>
              <div>
                <div className="text-xs text-brand-muted mb-2">Current satisfaction</div>
                <Slider min={1} max={5} value={data.pillars[key].satisfaction} onChange={v => setPillar(key, 'satisfaction', v)} colorScale />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Goals */}
      <div className="grid grid-cols-1 gap-4">
        <Textarea label="90-Day Goal" value={data.goal90day} onChange={e => onChange({ goal90day: e.target.value })} placeholder="What's the ONE win that would make 90 days a success?" rows={2} />
        <Textarea label="12-Month Goal" value={data.goal12month} onChange={e => onChange({ goal12month: e.target.value })} placeholder="Where does your business need to be in 12 months?" rows={2} />
        <Select label="Revenue Target (12 months)" value={data.revenueTarget} onChange={e => onChange({ revenueTarget: e.target.value })} options={REVENUE_TARGET_OPTIONS} placeholder="Select target..." />
      </div>

      <div className="p-4 rounded-lg border border-brand-border bg-brand-card space-y-4">
        <h3 className="text-sm font-semibold text-brand-fg">Time Targets</h3>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-brand-muted-light">Hours/week currently working</span>
            <span className="text-lg font-bold text-brand-fg">{data.hoursCurrently}h</span>
          </div>
          <Slider min={10} max={80} value={data.hoursCurrently} onChange={v => onChange({ hoursCurrently: v })} />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-brand-muted-light">Hours/week you WANT to work</span>
            <span className="text-lg font-bold text-brand-primary">{data.hoursWanted}h</span>
          </div>
          <Slider min={5} max={60} value={data.hoursWanted} onChange={v => onChange({ hoursWanted: v })} />
        </div>
        {data.hoursCurrently > data.hoursWanted && (
          <p className="text-xs text-emerald-400">
            🎯 TimeBACK goal: Reclaim {data.hoursCurrently - data.hoursWanted} hours per week.
          </p>
        )}
      </div>
    </div>
  );
}

// Step 1C: Operator → Engineer
function Step1C({ data, onChange }: { data: Stage1Data; onChange: (d: Partial<Stage1Data>) => void }) {
  const OPERATOR_OPTIONS = [
    { value: 'full-operator', label: 'Full Operator — I do everything. Nothing moves without me.' },
    { value: 'heavy-operator', label: 'Heavy Operator — I delegate some, but I\'m still in most things.' },
    { value: 'hybrid', label: 'Hybrid — Some systems exist, but I\'m still too involved.' },
    { value: 'light-engineer', label: 'Light Engineer — Most things run, I manage exceptions.' },
    { value: 'engineer', label: 'Engineer — The system runs. I design and direct.' },
  ];

  const FREEDOM_DIMENSIONS = [
    { key: 'financialClarity', label: 'Financial Clarity', desc: 'You know your numbers, margins, and cashflow at all times.' },
    { key: 'revenueSystems', label: 'Revenue Systems', desc: 'Lead gen, follow-up, and sales run with minimal owner involvement.' },
    { key: 'executionEngine', label: 'Execution Engine', desc: 'Work gets done on time, to standard, without constant oversight.' },
    { key: 'energyOptimization', label: 'Energy Optimization', desc: 'You protect your energy — not just your calendar.' },
    { key: 'delegationPath', label: 'Delegation Path', desc: 'You have someone to hand things off to (or a plan to get there).' },
    { key: 'ownershipMindset', label: 'Ownership Mindset', desc: 'You think like an owner, not an employee of your own business.' },
    { key: 'marginCreation', label: 'Margin Creation', desc: 'You have breathing room — financial, time, and mental.' },
  ] as const;

  const setFreedom = (key: keyof typeof data.freedomScores, val: number) => {
    onChange({ freedomScores: { ...data.freedomScores, [key]: val } });
  };

  const avgScore = Math.round(Object.values(data.freedomScores).reduce((a, b) => a + b, 0) / 7);

  return (
    <div className="space-y-6">
      <SectionHeader tag="Stage 1C" title="Operator → Engineer" subtitle="Where you are now determines the fastest path to where you want to be." />

      <FidaMessage
        identity="The Operator handles everything. The Engineer builds systems that handle everything."
        dream="One level closer to Engineer is one level closer to time back."
        action="Be honest here. There's no wrong answer — only clarity."
      />

      <RadioGroup
        label="Where are you on the Operator → Engineer spectrum?"
        options={OPERATOR_OPTIONS}
        value={data.operatorAssessment}
        onChange={v => onChange({ operatorAssessment: v })}
      />

      <Textarea
        label="What would need to change for you to move one level closer to Engineer?"
        value={data.operatorChangeNeeded}
        onChange={e => onChange({ operatorChangeNeeded: e.target.value })}
        placeholder="Think about what's keeping you stuck in operator mode..."
        rows={3}
      />

      {/* FREEDOM Scorecard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-brand-fg">FREEDOM Scorecard</h3>
            <p className="text-xs text-brand-muted mt-0.5">Rate 1-10. This builds your baseline FREEDOM Plan.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: avgScore >= 7 ? '#10B981' : avgScore >= 5 ? '#60A5FA' : '#F59E0B' }}>
              {avgScore}
            </div>
            <div className="text-xs text-brand-muted">/ 10 avg</div>
          </div>
        </div>

        {FREEDOM_DIMENSIONS.map(({ key, label, desc }) => (
          <div key={key} className="p-4 rounded-lg border border-brand-border bg-brand-card">
            <div className="mb-1">
              <span className="text-sm font-semibold text-brand-fg">{label}</span>
            </div>
            <p className="text-xs text-brand-muted mb-3">{desc}</p>
            <Slider
              min={1}
              max={10}
              value={data.freedomScores[key]}
              onChange={v => setFreedom(key, v)}
              colorScale
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 1D: Brand & Voice
function Step1D({ data, onChange }: { data: Stage1Data; onChange: (d: Partial<Stage1Data>) => void }) {
  const TONE_OPTIONS = ['Professional', 'Warm', 'Bold', 'Educational', 'Casual', 'Technical'];
  const CONTENT_OPTIONS = [
    { value: 'short-bullets', label: 'Short bullets' },
    { value: 'detailed-writeups', label: 'Detailed write-ups' },
    { value: 'visual', label: 'Visual content' },
    { value: 'audio', label: 'Audio / podcast' },
  ];
  const FREQ_OPTIONS = [
    { value: 'daily', label: 'Daily' },
    { value: '2-3x-week', label: '2-3x per week' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'only-when-matters', label: 'Only when it matters' },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader tag="Stage 1D" title="Brand & Voice" subtitle="Your voice guides every message, brief, and campaign we build for you." />

      <div className="p-4 rounded-xl border border-brand-primary/15 bg-brand-primary/5">
        <p className="text-sm text-brand-fg/80 leading-relaxed">
          <strong className="text-brand-fg">Clarity before creativity.</strong> Before we write a single word for your brand,
          we need to understand how you sound — and how you don&apos;t.
        </p>
      </div>

      <Input
        label="3 words that describe your brand personality"
        value={data.brandWords}
        onChange={e => onChange({ brandWords: e.target.value })}
        placeholder="e.g. Trustworthy, Direct, Local"
        hint="Separate with commas"
      />

      <CheckboxGroup label="Preferred Communication Tone" options={TONE_OPTIONS} value={data.communicationTone} onChange={v => onChange({ communicationTone: v })} />

      <Textarea
        label="What should we NEVER sound like?"
        value={data.neverSoundLike}
        onChange={e => onChange({ neverSoundLike: e.target.value })}
        placeholder="e.g. Salesy, corporate jargon, hype-driven, pushy..."
        rows={2}
      />

      <RadioGroup label="Content Preference" options={CONTENT_OPTIONS} value={data.contentPreference} onChange={v => onChange({ contentPreference: v })} />

      <RadioGroup label="Brief / Report Frequency" options={FREQ_OPTIONS} value={data.briefFrequency} onChange={v => onChange({ briefFrequency: v })} />

      <Textarea
        label="Notes / Anything we should know"
        value={data.additionalNotes}
        onChange={e => onChange({ additionalNotes: e.target.value })}
        placeholder="Context, history, sensitivities, preferences — anything relevant..."
        rows={4}
      />
    </div>
  );
}

export default function Stage1Page() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = entry, 1-4 = stage steps
  const [entryData, setEntryData] = useState<EntryData>(defaultEntryData);
  const [stageData, setStageData] = useState<Stage1Data>(defaultStage1Data);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [alreadyComplete, setAlreadyComplete] = useState(false);

  // Load from localStorage, then check server for completion status
  useEffect(() => {
    const entry = storage.getEntry();
    setEntryData(entry);
    setStageData(storage.getStage1());
    const status = storage.getStatus();
    if (status.entryComplete) setStep(1);

    // If already marked complete locally, set banner
    if (status.stage1 === "complete") {
      setAlreadyComplete(true);
      return;
    }

    // Check server if we have an email
    const email = entry?.bestEmail?.trim();
    if (email) {
      fetch("/api/check-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then(r => r.ok ? r.json() : null)
        .then(serverStatus => {
          if (serverStatus?.stage1 === "complete") {
            setAlreadyComplete(true);
            const current = storage.getStatus();
            if (current.stage1 !== "complete") {
              storage.setStatus({ ...current, stage1: "complete", lastUpdated: new Date().toISOString() });
            }
          }
        })
        .catch(() => {/* silent */});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      storage.setEntry(entryData);
      storage.setStage1(stageData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
    return () => clearTimeout(timer);
  }, [entryData, stageData]);

  const updateEntry = useCallback((updates: Partial<EntryData>) => {
    setEntryData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateStage = useCallback((updates: Partial<Stage1Data>) => {
    setStageData(prev => ({ ...prev, ...updates }));
  }, []);

  const totalSteps = TOTAL_STEPS + 1; // entry + 4 steps
  const currentDisplayStep = step + 1;

  const goNext = () => {
    setFieldErrors({});
    setError(null);

    // Validate current step
    if (step === 0) {
      const errors = validateEntry(entryData as unknown as Record<string, unknown>);
      if (errors.length > 0) {
        const errorMap: Record<string, string> = {};
        errors.forEach(e => { errorMap[e.field] = e.message; });
        setFieldErrors(errorMap);
        setError(`Please fill in all required fields (${errors.length} missing)`);
        return;
      }
      const status = storage.getStatus();
      storage.setStatus({ ...status, entryComplete: true, lastUpdated: new Date().toISOString() });
    }

    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async () => {
    // Validate stage1 data
    const errors = validateStage1(stageData as unknown as Record<string, unknown>);
    if (errors.length > 0) {
      const errorMap: Record<string, string> = {};
      errors.forEach(e => { errorMap[e.field] = e.message; });
      setFieldErrors(errorMap);
      setError(`Please complete the required fields`);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        stage: 'stage1',
        stageLabel: 'TimeBACK Build',
        entry: entryData,
        stage1: stageData,
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
      storage.setStatus({ ...status, stage1: 'complete', lastUpdated: new Date().toISOString() });
      router.push('/intake?stage1=complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <EntrySection data={entryData} onChange={updateEntry} />;
      case 1: return <Step1A data={stageData} onChange={updateStage} />;
      case 2: return <Step1B data={stageData} onChange={updateStage} />;
      case 3: return <Step1C data={stageData} onChange={updateStage} />;
      case 4: return <Step1D data={stageData} onChange={updateStage} />;
      default: return null;
    }
  };

  const stepLabels = ['Your Info', 'Business Identity', 'Owner Goals', 'Operator → Engineer', 'Brand & Voice'];

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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-brand-border/60 bg-brand-bg/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/')} className="text-brand-muted hover:text-brand-fg/80 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div>
                <div className="text-xs font-semibold text-brand-primary uppercase tracking-wide">Stage 1</div>
                <div className="text-sm font-bold text-brand-fg">TimeBACK Build</div>
              </div>
            </div>
            {saved && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Save size={12} />
                Saved
              </div>
            )}
          </div>
          <ProgressBar current={currentDisplayStep} total={totalSteps} label={stepLabels[step] || ''} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-32 animate-slide-up">
        {alreadyComplete && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-start gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-400">You&apos;ve already completed this stage.</p>
              <p className="text-xs text-brand-muted mt-0.5">You can review your answers below or re-submit to update them.</p>
            </div>
          </div>
        )}
        {renderStep()}
      </main>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-border/60 bg-brand-bg/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {error && (
            <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              {error}
            </div>
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-brand-border text-brand-muted-light hover:text-brand-fg hover:border-brand-border-hover transition-all text-sm font-medium"
            >
              <ChevronLeft size={16} />
              {step === 0 ? 'Home' : 'Back'}
            </button>
            <div className="flex-1" />
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm transition-all shadow-brand-glow"
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
                  <><CheckCircle2 size={16} /> Complete Stage 1</>
                )}
              </button>
            )}
          </div>
          {/* Step dots */}
          <div className="flex justify-center mt-2 gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={cn(
                "rounded-full transition-all duration-300",
                i === step ? "w-4 h-1.5 bg-brand-primary" : i < step ? "w-1.5 h-1.5 bg-brand-primary/40" : "w-1.5 h-1.5 bg-brand-slate"
              )} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
