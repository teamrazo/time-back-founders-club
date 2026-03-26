"use client";
import React, { useState, useCallback, useEffect } from "react";
import { FormData, defaultFormData } from "@/lib/types";
import { ProgressBar } from "@/components/ProgressBar";
import { Step1Company } from "@/components/steps/Step1Company";
import { Step2Owner } from "@/components/steps/Step2Owner";
import { Step3Pillars } from "@/components/steps/Step3Pillars";
import { Step4Goals } from "@/components/steps/Step4Goals";
import { Step5PainPoints } from "@/components/steps/Step5PainPoints";
import { Step6Lifecycle } from "@/components/steps/Step6Lifecycle";
import { Step7OperatorScore } from "@/components/steps/Step7OperatorScore";
import { Step8Brand } from "@/components/steps/Step8Brand";
import { Step9Freedom } from "@/components/steps/Step9Freedom";
import { Step10QuickWins } from "@/components/steps/Step10QuickWins";
import { Step11Review } from "@/components/steps/Step11Review";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Send, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

const TOTAL_STEPS = 11;
const STORAGE_KEY = "rsn-intake-form-draft";

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animKey, setAnimKey] = useState(0);

  // Load saved draft on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFormData({ ...defaultFormData, ...parsed.data });
        if (parsed.step) setStep(parsed.step);
      }
    } catch {}
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: formData, step }));
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(t);
    } catch {}
  }, [formData, step]);

  const updateForm = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const goNext = () => {
    if (step < TOTAL_STEPS) {
      setDirection("forward");
      setAnimKey((k) => k + 1);
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (step > 1) {
      setDirection("back");
      setAnimKey((k) => k + 1);
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Submission failed");
      }
      localStorage.removeItem(STORAGE_KEY);
      router.push("/thank-you");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    const props = { data: formData, onChange: updateForm };
    switch (step) {
      case 1: return <Step1Company {...props} />;
      case 2: return <Step2Owner {...props} />;
      case 3: return <Step3Pillars {...props} />;
      case 4: return <Step4Goals {...props} />;
      case 5: return <Step5PainPoints {...props} />;
      case 6: return <Step6Lifecycle {...props} />;
      case 7: return <Step7OperatorScore {...props} />;
      case 8: return <Step8Brand {...props} />;
      case 9: return <Step9Freedom {...props} />;
      case 10: return <Step10QuickWins {...props} />;
      case 11: return <Step11Review data={formData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-brand-slate/60 bg-brand-navy/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-brand-accent flex items-center justify-center">
                  <span className="text-white text-xs font-black">R</span>
                </div>
                <span className="text-sm font-bold text-slate-200 tracking-wide">RazoRSharp Networks</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 ml-8">TimeBACK System · Client Intake</p>
            </div>
            <div className="flex items-center gap-2">
              {saved && (
                <div className="flex items-center gap-1.5 text-xs text-green-400 animate-fade-in">
                  <Save size={12} />
                  <span>Saved</span>
                </div>
              )}
            </div>
          </div>
          <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8 pb-32">
        <div
          key={animKey}
          className={cn(
            direction === "forward" ? "animate-slide-up" : "animate-fade-in"
          )}
        >
          {renderStep()}
        </div>
      </main>

      {/* Sticky bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-slate/60 bg-brand-navy/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {error && (
            <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              {error}
            </div>
          )}
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-brand-slate text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all duration-150 text-sm font-medium"
              >
                <ChevronLeft size={16} />
                Back
              </button>
            )}

            <div className="flex-1" />

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-accent hover:bg-brand-accent-dark text-white font-semibold text-sm transition-all duration-150 shadow-lg shadow-brand-accent/25 hover:shadow-brand-accent/40"
              >
                Continue
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-150 shadow-lg shadow-green-500/25"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Intake Form
                  </>
                )}
              </button>
            )}
          </div>

          {/* Step indicator */}
          <div className="flex justify-center mt-2 gap-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i + 1 === step
                    ? "w-4 h-1.5 bg-brand-accent"
                    : i + 1 < step
                    ? "w-1.5 h-1.5 bg-brand-accent/40"
                    : "w-1.5 h-1.5 bg-brand-slate"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
