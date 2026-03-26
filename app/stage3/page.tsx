"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Save, CheckCircle2, AlertCircle, ExternalLink, Video } from "lucide-react";
import { storage } from "@/lib/storage";
import { Stage3Data, PlatformEntry, defaultStage3Data, getBudgetTier, BudgetTier } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { ProgressBar } from "@/components/ProgressBar";
import { SectionHeader } from "@/components/SectionHeader";

// Platform config
const PLATFORMS = {
  tier1: [
    {
      key: 'domainHosting' as keyof Stage3Data,
      name: 'Domain Hosting',
      why: 'We need access to update DNS records and connect your domain to campaigns, landing pages, and tools.',
      email: 'support@razorsharpnetworks.com',
      loomUrl: '',
    },
    {
      key: 'websiteAdmin' as keyof Stage3Data,
      name: 'Website Admin',
      why: 'We need backend access to update pages, install tracking pixels, and make campaign changes.',
      email: 'support@razorsharpnetworks.com',
      loomUrl: '',
    },
    {
      key: 'googleMyBusiness' as keyof Stage3Data,
      name: 'Google Business Profile',
      why: 'Your GBP controls how you appear in local search. We manage reviews, posts, and profile optimization.',
      email: 'lifecycleautomationai@gmail.com',
      loomUrl: '',
    },
    {
      key: 'facebookPage' as keyof Stage3Data,
      name: 'Facebook Business Page',
      why: 'We need page admin access to run ads, post content, and manage your Facebook presence.',
      email: 'jrazo@razorsharpnetworks.com',
      loomUrl: '',
    },
    {
      key: 'instagramPage' as keyof Stage3Data,
      name: 'Instagram Page',
      why: 'Connected through your Facebook Business Manager — required for ad delivery and content management.',
      email: 'jrazo@razorsharpnetworks.com',
      loomUrl: '',
    },
  ],
  tier2: [
    {
      key: 'googleAds' as keyof Stage3Data,
      name: 'Google Ads Account',
      why: 'Access lets us build, manage, and optimize your paid search campaigns for maximum ROI.',
      email: 'lifecycleautomationai@gmail.com',
      loomUrl: '',
    },
    {
      key: 'facebookAds' as keyof Stage3Data,
      name: 'Facebook Ads Account',
      why: 'We manage Meta ad campaigns through your Business Manager — ads cannot run without this access.',
      email: 'jrazo@razorsharpnetworks.com',
      loomUrl: '',
    },
    {
      key: 'googleAnalytics' as keyof Stage3Data,
      name: 'Google Analytics (GA4)',
      why: 'This is how we track conversions, understand user behavior, and prove campaign performance.',
      email: 'lifecycleautomationai@gmail.com',
      loomUrl: '',
    },
    {
      key: 'googleSearchConsole' as keyof Stage3Data,
      name: 'Google Search Console',
      why: 'We use this to monitor SEO performance, indexing issues, and keyword rankings.',
      email: 'lifecycleautomationai@gmail.com',
      loomUrl: '',
    },
    {
      key: 'googleTagManager' as keyof Stage3Data,
      name: 'Google Tag Manager',
      why: 'GTM allows us to install tracking codes and conversion events without editing your website code.',
      email: 'lifecycleautomationai@gmail.com',
      loomUrl: '',
    },
  ],
  tier3: [
    {
      key: 'youtubeChannel' as keyof Stage3Data,
      name: 'YouTube Channel',
      why: 'Required for video ad campaigns and content publishing — connected through your Google account.',
      email: 'lifecycleautomationai@gmail.com',
      loomUrl: '',
    },
    {
      key: 'linkedinAds' as keyof Stage3Data,
      name: 'LinkedIn Ads Account',
      why: 'For B2B campaigns and professional audience targeting — requires LinkedIn Campaign Manager access.',
      email: 'jrazo@razorsharpnetworks.com',
      loomUrl: '',
    },
    {
      key: 'crmTools' as keyof Stage3Data,
      name: 'CRM / Email / SMS Tools',
      why: 'Access to your existing CRM, email platform, or SMS tool lets us audit, integrate, and improve your follow-up systems.',
      email: 'support@razorsharpnetworks.com',
      loomUrl: '',
    },
  ],
};

type StatusOption = 'granted' | 'need-help' | 'na';

function PlatformCard({
  platform,
  entry,
  onUpdate,
}: {
  platform: typeof PLATFORMS.tier1[0];
  entry: PlatformEntry;
  onUpdate: (update: PlatformEntry) => void;
}) {
  const STATUS_OPTIONS: { value: StatusOption; label: string; color: string }[] = [
    { value: 'granted', label: '✅ Access Granted', color: 'emerald' },
    { value: 'need-help', label: '🙋 Need Help', color: 'amber' },
    { value: 'na', label: '— Not Applicable', color: 'slate' },
  ];

  return (
    <div className={cn(
      "rounded-xl border p-5 transition-all duration-200",
      entry.status === 'granted' ? "border-emerald-500/40 bg-emerald-500/5" :
      entry.status === 'need-help' ? "border-amber-400/40 bg-amber-400/5" :
      entry.status === 'na' ? "border-brand-slate/50 bg-brand-charcoal/50 opacity-60" :
      "border-brand-slate bg-brand-charcoal"
    )}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-100">{platform.name}</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{platform.why}</p>
        </div>
        {entry.status === 'granted' && <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />}
        {entry.status === 'need-help' && <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />}
      </div>

      {/* Access email */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-brand-navy/60 border border-brand-slate mb-4">
        <ExternalLink size={12} className="text-slate-500 flex-shrink-0" />
        <span className="text-xs text-slate-500">Grant access to:</span>
        <span className="text-xs font-mono text-brand-accent-light">{platform.email}</span>
      </div>

      {/* Loom placeholder */}
      {platform.loomUrl ? (
        <a
          href={platform.loomUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-brand-accent hover:text-brand-accent-light transition-colors mb-4"
        >
          <Video size={14} />
          Watch walkthrough video (2-3 min)
        </a>
      ) : (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-brand-slate/30 border border-brand-slate/50 mb-4">
          <Video size={12} className="text-slate-600" />
          <span className="text-xs text-slate-600">Walkthrough video coming soon</span>
        </div>
      )}

      {/* Status toggle */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onUpdate({ ...entry, status: opt.value === entry.status ? '' : opt.value })}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150",
              entry.status === opt.value
                ? opt.color === 'emerald' ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                  : opt.color === 'amber' ? "bg-amber-400/20 border-amber-400/50 text-amber-300"
                  : "bg-brand-slate border-slate-500 text-slate-300"
                : "bg-transparent border-brand-slate text-slate-500 hover:border-slate-500 hover:text-slate-400"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {entry.status === 'need-help' && (
        <div className="mt-3">
          <Textarea
            value={entry.notes}
            onChange={e => onUpdate({ ...entry, notes: e.target.value })}
            placeholder="What do you need help with? (e.g. Can't find the admin panel, account locked...)"
            rows={2}
          />
        </div>
      )}
    </div>
  );
}

function TierSection({
  title,
  subtitle,
  platforms,
  stageData,
  onUpdate,
}: {
  title: string;
  subtitle: string;
  platforms: typeof PLATFORMS.tier1;
  stageData: Stage3Data;
  onUpdate: (key: keyof Stage3Data, entry: PlatformEntry) => void;
}) {
  const granted = platforms.filter(p => (stageData[p.key] as PlatformEntry).status === 'granted').length;
  const total = platforms.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-slate text-slate-300">
          {granted}/{total} granted
        </span>
      </div>
      {platforms.map(platform => (
        <PlatformCard
          key={platform.key}
          platform={platform}
          entry={stageData[platform.key] as PlatformEntry}
          onUpdate={entry => onUpdate(platform.key, entry)}
        />
      ))}
    </div>
  );
}

export default function Stage3Page() {
  const router = useRouter();
  const [stageData, setStageData] = useState<Stage3Data>(defaultStage3Data);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('tier1');
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStageData(storage.getStage3());
    const entry = storage.getEntry();
    setBudgetTier(getBudgetTier(entry.monthlyBudget));
    // Mark in progress
    const status = storage.getStatus();
    if (status.stage3 === 'not-started') {
      storage.setStatus({ ...status, stage3: 'in-progress', lastUpdated: new Date().toISOString() });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      storage.setStage3(stageData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
    return () => clearTimeout(timer);
  }, [stageData]);

  const updatePlatform = useCallback((key: keyof Stage3Data, entry: PlatformEntry) => {
    setStageData(prev => ({ ...prev, [key]: entry }));
  }, []);

  const allTier1Platforms = PLATFORMS.tier1;
  const showTier2 = budgetTier === 'tier1-2' || budgetTier === 'tier1-2-3';
  const showTier3 = budgetTier === 'tier1-2-3';

  // Progress calculation
  const allVisiblePlatforms = [
    ...PLATFORMS.tier1,
    ...(showTier2 ? PLATFORMS.tier2 : []),
    ...(showTier3 ? PLATFORMS.tier3 : []),
  ];
  const totalPlatforms = allVisiblePlatforms.length;
  const completedPlatforms = allVisiblePlatforms.filter(p => (stageData[p.key] as PlatformEntry).status !== '').length;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const entry = storage.getEntry();
      const payload = {
        stage: 'stage3',
        stageLabel: 'Access Grant',
        entry,
        stage3: stageData,
        budgetTier,
        submittedAt: new Date().toISOString(),
      };
      const res = await fetch('/api/stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submission failed');
      const status = storage.getStatus();
      storage.setStatus({ ...status, stage3: 'complete', lastUpdated: new Date().toISOString() });

      // Check if all complete
      const updated = storage.getStatus();
      if (updated.stage1 === 'complete' && updated.stage2 === 'complete' && updated.stage3 === 'complete') {
        router.push('/complete');
      } else {
        router.push('/?stage3=complete');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <header className="sticky top-0 z-50 border-b border-brand-slate/60 bg-brand-navy/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/')} className="text-slate-500 hover:text-slate-300 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div>
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Stage 3</div>
                <div className="text-sm font-bold text-slate-100">Access Grant</div>
              </div>
            </div>
            {saved && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Save size={12} />
                Saved
              </div>
            )}
          </div>
          <ProgressBar current={completedPlatforms} total={totalPlatforms} label={`${completedPlatforms} of ${totalPlatforms} platforms addressed`} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-36 space-y-8 animate-slide-up">
        <SectionHeader
          tag="Stage 3"
          title="Platform Access"
          subtitle="For each platform below, grant us access to the listed email address. Use the toggle to mark your status."
        />

        <div className="p-4 rounded-xl border border-amber-400/20 bg-amber-400/5">
          <p className="text-sm text-amber-200/80 leading-relaxed">
            <strong className="text-amber-300">Why we need this:</strong> Without platform access, we cannot execute your campaigns,
            track performance, or connect your systems. This step directly unlocks project execution.
          </p>
        </div>

        {/* Tier 1 */}
        <TierSection
          title="Tier 1 — Core Platforms"
          subtitle="Required for all clients"
          platforms={allTier1Platforms}
          stageData={stageData}
          onUpdate={updatePlatform}
        />

        {/* Tier 2 */}
        {showTier2 && (
          <TierSection
            title="Tier 2 — Advertising Platforms"
            subtitle="Required for your service tier"
            platforms={PLATFORMS.tier2}
            stageData={stageData}
            onUpdate={updatePlatform}
          />
        )}

        {/* Tier 3 */}
        {showTier3 && (
          <TierSection
            title="Tier 3 — Advanced Platforms"
            subtitle="For content, video & advanced campaigns"
            platforms={PLATFORMS.tier3}
            stageData={stageData}
            onUpdate={updatePlatform}
          />
        )}

        {/* Budget note if only tier 1 showing */}
        {!showTier2 && (
          <div className="p-4 rounded-xl border border-brand-slate bg-brand-charcoal">
            <p className="text-sm text-slate-500">
              <strong className="text-slate-400">Advertising & Advanced platforms</strong> become available when your
              budget reaches $500/mo or includes paid ad services. We&apos;ll revisit these as your investment grows.
            </p>
          </div>
        )}
      </main>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-slate/60 bg-brand-navy/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {error && (
            <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">{error}</div>
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-brand-slate text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all text-sm font-medium"
            >
              <ChevronLeft size={16} />
              Home
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || completedPlatforms === 0}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-lg shadow-amber-500/25"
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Saving...</>
              ) : (
                <><CheckCircle2 size={16} /> Complete Stage 3</>
              )}
            </button>
          </div>
          <p className="text-center text-xs text-slate-600 mt-2">
            You can submit with partial access and update later. We&apos;ll follow up on &quot;Need Help&quot; items.
          </p>
        </div>
      </div>
    </div>
  );
}
