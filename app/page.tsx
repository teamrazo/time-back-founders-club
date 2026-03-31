"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Zap, Shield, TrendingUp, Clock, ChevronRight,
  CheckCircle2, Sparkles, MessageSquare, BarChart3,
  Users, ArrowRight, ChevronDown
} from "lucide-react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

// Founders Club deadline: Saturday April 5th 2026 at midnight PT
const FOUNDERS_DEADLINE = new Date("2026-04-05T07:00:00.000Z"); // midnight PT = 7am UTC
const isFoundersExpired = () => new Date() >= FOUNDERS_DEADLINE;

function FoundersCountdown() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);
  const [expired, setExpired] = useState(isFoundersExpired());

  useEffect(() => {
    function update() {
      const diff = FOUNDERS_DEADLINE.getTime() - Date.now();
      if (diff <= 0) { setExpired(true); return; }
      setDays(Math.floor(diff / 86400000));
      setHours(Math.floor((diff % 86400000) / 3600000));
      setMins(Math.floor((diff % 3600000) / 60000));
      setSecs(Math.floor((diff % 60000) / 1000));
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (expired) return null;

  return (
    <div className="text-center mb-6">
      <p className="text-xs uppercase tracking-widest text-brand-muted mb-3">Founders Club ends April 5th</p>
      <div className="inline-flex items-center gap-3">
        {[
          { value: days, label: "Days" },
          { value: hours, label: "Hrs" },
          { value: mins, label: "Min" },
          { value: secs, label: "Sec" },
        ].map((unit, i) => (
          <React.Fragment key={unit.label}>
            {i > 0 && <span className="text-brand-muted/40 text-lg font-light">:</span>}
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-brand-fg tabular-nums w-10 text-center">{String(unit.value).padStart(2, "0")}</span>
              <span className="text-[10px] uppercase tracking-wider text-brand-muted">{unit.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Step 1: Info Capture ───────────────────────────────────────────────────
function StepInfo({ onNext }: { onNext: (data: {
  fullName: string; email: string; phone: string; companyName: string;
}) => void }) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", companyName: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 7) e.phone = "Valid phone required";
    if (!form.companyName.trim()) e.companyName = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-brand-fg mb-1">Join the Founders Club</h3>
        <p className="text-brand-muted text-sm">Tell us about you and your business.</p>
      </div>

      {(["fullName", "email", "phone", "companyName"] as const).map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-brand-fg mb-1.5">
            {{ fullName: "Full Name", email: "Email", phone: "Phone", companyName: "Company Name" }[field]}
          </label>
          <input
            type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full bg-brand-card border border-brand-border rounded-lg px-4 py-3 text-brand-fg placeholder:text-brand-muted/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 outline-none transition-all"
            placeholder={{ fullName: "Jesse Razo", email: "you@company.com", phone: "(555) 123-4567", companyName: "Acme Inc" }[field]}
          />
          {errors[field] && <p className="text-brand-red text-xs mt-1">{errors[field]}</p>}
        </div>
      ))}

      {/* Honeypot */}
      <input type="text" name="_hp" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

      <button
        onClick={() => { if (honeypot) return; if (validate()) onNext(form); }}
        className="w-full py-3.5 rounded-lg bg-brand-gradient text-white font-semibold text-base shadow-brand-glow hover:opacity-90 transition-all flex items-center justify-center gap-2"
      >
        Continue to Payment <ArrowRight size={18} />
      </button>
    </div>
  );
}

// ─── Step 2: Payment ────────────────────────────────────────────────────────
function CheckoutForm({ onSuccess, customerData, isPromo }: {
  onSuccess: (paymentIntentId: string) => void;
  customerData: { fullName: string; email: string; phone: string; companyName: string; customerId: string };
  isPromo?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message || "Payment failed. Please try again.");
      setLoading(false);
    } else if (result.paymentIntent?.status === "succeeded" || result.paymentIntent?.status === "requires_capture") {
      onSuccess(result.paymentIntent.id);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-brand-fg mb-1">Activate Your Pilot</h3>
        <p className="text-brand-muted text-sm">
          {isPromo ? "$1 authorization hold (released after verification). Your $20 AI wallet loads immediately." : "$9 today. Your $20 AI wallet loads immediately."}
        </p>
      </div>

      <div className="glass-card rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-brand-fg font-medium">TimeBACK Founders Club</span>
          <span className="text-brand-primary font-bold text-lg">{isPromo ? "$1" : "$9"}</span>
        </div>
        {isPromo && (
          <div className="flex items-center gap-2 text-xs text-brand-green">
            <Sparkles size={12} />
            <span>Promo applied — $1 auth hold released after verification</span>
          </div>
        )}
        <div className="border-t border-brand-border pt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <CheckCircle2 size={14} className="text-brand-green shrink-0" />
            <span>$20 AI wallet — loaded instantly</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <CheckCircle2 size={14} className="text-brand-green shrink-0" />
            <span>Private Slack channel with CATO AI</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <CheckCircle2 size={14} className="text-brand-green shrink-0" />
            <span>Custom FREEDOM Diagnostic</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <CheckCircle2 size={14} className="text-brand-green shrink-0" />
            <span>Daily coaching briefs</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-brand-border p-4 bg-brand-card">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {error && (
        <div className="bg-brand-red/10 border border-brand-red/20 rounded-lg p-3 text-brand-red text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3.5 rounded-lg bg-brand-gradient text-white font-semibold text-base shadow-brand-glow hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? "Processing..." : isPromo ? "Authorize $1 & Activate" : "Pay $9 & Activate"} {!loading && <Zap size={18} />}
      </button>

      <p className="text-center text-xs text-brand-muted">
        Usage-based after your $20 wallet. If CATO doesn&apos;t deliver value, you won&apos;t be billed again.
      </p>
    </form>
  );
}

// ─── Step 3: Confirmation ───────────────────────────────────────────────────
function StepConfirm({ walletAmount }: { walletAmount: string }) {
  return (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-green/10 mb-2">
        <CheckCircle2 size={36} className="text-brand-green" />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-brand-fg mb-2">Welcome to the Founders Club</h3>
        <p className="text-brand-muted">Your {walletAmount} AI wallet is loaded and ready.</p>
      </div>

      <div className="glass-card rounded-xl p-5 text-left space-y-3">
        <h4 className="font-semibold text-brand-fg">What happens next:</h4>
        <div className="space-y-2.5">
          {[
            "Your private Slack channel is being created",
            "CATO AI will introduce itself within 24 hours",
            "Complete your FREEDOM profile to accelerate setup",
            "Daily coaching briefs start as soon as your profile is complete",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm text-brand-muted">
              <span className="text-brand-primary font-bold mt-0.5">{i + 1}.</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/stage1"
        className="inline-flex items-center gap-2 py-3.5 px-8 rounded-lg bg-brand-gradient text-white font-semibold shadow-brand-glow hover:opacity-90 transition-all"
      >
        Complete Your Profile <ChevronRight size={18} />
      </Link>

      <p className="text-xs text-brand-muted">
        Takes 8-12 minutes. The faster you complete it, the faster CATO starts delivering value.
      </p>
    </div>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    {
      q: "What happens after I pay $9?",
      a: "Your $20 AI wallet activates immediately. We create a private Slack channel and deploy CATO — your AI Growth Engineer. CATO starts working within 24 hours of profile completion.",
    },
    {
      q: "What if I don't use it?",
      a: "You won't be billed again. Your wallet only depletes when CATO actively works on your behalf. No activity, no charges. If it doesn't deliver massive value, it costs you nothing beyond the $9.",
    },
    {
      q: "How does billing work after the $20?",
      a: "Usage-based. CATO tracks what it does for your business. When your wallet reaches your set threshold, it auto-refills. You control the amount. Cancel anytime through Slack.",
    },
    {
      q: "What does CATO actually do?",
      a: "Daily coaching briefs, system audits, CRM automation, growth strategy execution, follow-up management, workflow optimization — 24/7. Think of it as a growth engineer that never sleeps.",
    },
    {
      q: "Is this a subscription?",
      a: "No fixed monthly fee. It's metered — you only pay for the work CATO does. Most clients find the ROI within the first week.",
    },
  ];

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="glass-card rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <span className="text-sm font-medium text-brand-fg">{item.q}</span>
            <ChevronDown size={16} className={`text-brand-muted transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-sm text-brand-muted leading-relaxed">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function FoundersClubPage() {
  const [step, setStep] = useState<"info" | "payment" | "confirm">("info");
  const [customerData, setCustomerData] = useState({ fullName: "", email: "", phone: "", companyName: "", customerId: "" });
  const [clientSecret, setClientSecret] = useState("");
  const [walletAmount, setWalletAmount] = useState("$20.00");
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [showPromo, setShowPromo] = useState(false);

  const VALID_PROMO = "GETYOURTIMEBACKIN2026!";
  const isValidPromo = promoCode.trim().toUpperCase() === VALID_PROMO.toUpperCase();

  async function handleInfoComplete(data: { fullName: string; email: string; phone: string; companyName: string }) {
    setLoading(true);
    try {
      const res = await fetch("/api/founders-club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, step: "create-intent", ...(isValidPromo ? { promoCode: promoCode.trim() } : {}) }),
      });
      const result = await res.json();
      if (result.clientSecret) {
        setClientSecret(result.clientSecret);
        setCustomerData({ ...data, customerId: result.customerId });
        setStep("payment");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handlePaymentSuccess(paymentIntentId: string) {
    try {
      const res = await fetch("/api/founders-club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "activate",
          customerId: customerData.customerId,
          paymentIntentId,
          ...(isValidPromo ? { promoCode: promoCode.trim() } : {}),
          fullName: customerData.fullName,
          email: customerData.email,
          phone: customerData.phone,
          companyName: customerData.companyName,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setWalletAmount(result.walletAmount || "$20.00");
        setStep("confirm");
      }
    } catch (err) {
      console.error(err);
    }
  }

  const elementsOptions: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "night",
      variables: {
        colorPrimary: "#A83AC4",
        colorBackground: "#101018",
        colorText: "#F2F2F2",
        colorDanger: "#EF4444",
        borderRadius: "8px",
        fontFamily: "Inter, system-ui, sans-serif",
      },
    },
  };

  return (
    <div className="min-h-screen bg-brand-bg tech-grid">
      {/* Header */}
      <header className="border-b border-brand-border/50 bg-brand-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/rs-icon.png" alt="RazoRSharp" className="h-8 w-8" />
            <span className="text-brand-fg font-semibold text-sm hidden sm:block">RazoRSharp Networks</span>
          </div>
          <span className="text-xs text-brand-muted">One System. One Flow. One Outcome. FREEDOM</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        {/* Hero */}
        <section className="text-center mb-16 md:mb-20">
          <FoundersCountdown />

          <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={14} className="text-brand-primary" />
            <span className="text-xs font-medium text-brand-primary">TimeBACK Founders Club — Limited Pilot</span>
          </div>

          <div className="mb-6">
            <img src="/cato-mascot.png" alt="CATO — Your AI Growth Engineer" className="h-36 md:h-44 mx-auto drop-shadow-[0_0_30px_rgba(168,58,196,0.35)]" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-fg leading-tight mb-5">
            Your Business Should<br />
            <span className="gradient-text">Run Without You</span>
          </h1>

          <p className="text-lg md:text-xl text-brand-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Meet <strong className="text-brand-fg">CATO</strong> — your AI Growth Engineer.
            For <strong className="text-brand-fg">$9</strong>, get a <strong className="text-brand-fg">$20 AI wallet</strong> and
            experience what 24/7 growth engineering feels like.
            If it doesn&apos;t deliver massive value, you won&apos;t be billed again.
          </p>

          <a href="#join" className="inline-flex items-center gap-2 py-3.5 px-8 rounded-lg bg-brand-gradient text-white font-semibold text-lg shadow-brand-glow hover:opacity-90 transition-all">
            Join for $9 <ArrowRight size={20} />
          </a>
        </section>

        {/* The Problem */}
        <section className="mb-16 md:mb-20">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Clock, title: "You're the bottleneck", desc: "Every decision, follow-up, and reminder runs through you. Your calendar owns you." },
              { icon: TrendingUp, title: "Effort ≠ Revenue", desc: "You're working 60+ hours but growth is flat. Busy isn't productive." },
              { icon: Users, title: "Your team asks you", desc: "Instead of systems answering, people wait for you. That doesn't scale." },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-xl p-5 space-y-3">
                <item.icon size={24} className="text-brand-primary" />
                <h3 className="font-semibold text-brand-fg">{item.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What You Get */}
        <section className="mb-16 md:mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-brand-fg mb-3">$9 Gets You Into the Club</h2>
            <p className="text-brand-muted max-w-lg mx-auto">Everything you need to experience the TimeBACK system — with zero risk.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: "$20 AI Wallet", desc: "Loaded instantly. CATO runs on this — real AI work, real results for your business." },
              { icon: MessageSquare, title: "Private Slack Channel", desc: "Direct line to your AI Growth Engineer. Ask anything, anytime." },
              { icon: Shield, title: "FREEDOM Diagnostic", desc: "We audit your time, systems, and revenue leaks. See exactly where you're stuck." },
              { icon: BarChart3, title: "Daily Coaching Briefs", desc: "One key insight + one action item, every day. Delivered to your Slack." },
              { icon: TrendingUp, title: "Growth Execution 24/7", desc: "CRM automation, follow-ups, workflow optimization — CATO never sleeps." },
              { icon: Sparkles, title: "Usage-Based. No Lock-In.", desc: "If CATO doesn't provide massive value, you won't be billed again. Period." },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-xl p-5 space-y-3 hover:border-brand-primary/30 transition-all">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-primary/10">
                  <item.icon size={20} className="text-brand-primary" />
                </div>
                <h3 className="font-semibold text-brand-fg text-sm">{item.title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16 md:mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-brand-fg mb-3">Three Steps to Freedom</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Pay $9", desc: "Your $20 wallet loads instantly. Payment info secured for metered billing." },
              { step: "2", title: "Complete Your Profile", desc: "5-minute intake. We build your custom system and FREEDOM plan." },
              { step: "3", title: "CATO Goes to Work", desc: "Daily briefs, automated systems, growth execution. You get your time back." },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-gradient text-white font-bold text-lg shadow-brand-glow">
                  {item.step}
                </div>
                <h3 className="font-semibold text-brand-fg">{item.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The TimeBACK Promise */}
        <section className="mb-16 md:mb-20">
          <div className="glass-card rounded-2xl p-8 md:p-10 text-center">
            <img src="/cato-mascot.png" alt="CATO" className="h-24 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(168,58,196,0.3)]" />
            <h2 className="text-2xl md:text-3xl font-bold text-brand-fg mb-4">
              From Operator to Engineer
            </h2>
            <p className="text-brand-muted max-w-2xl mx-auto leading-relaxed mb-6">
              CATO is built to protect your time, create margin in your schedule, and build lifestyle business assets
              — all while driving growth and revenue for your organization, 24/7. The TimeBACK system is how you
              shift from doing everything to engineering the business that runs without you.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {["Audit", "Optimize", "Measure", "Refill"].map((phase) => (
                <div key={phase} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-primary" />
                  <span className="text-brand-fg font-medium">{phase}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Form */}
        <section id="join" className="mb-16 md:mb-20 scroll-mt-24">
          <div className="max-w-md mx-auto">
            {isFoundersExpired() ? (
              <div className="glass-card rounded-2xl p-6 md:p-8 opacity-75 relative">
                <div className="absolute inset-0 bg-brand-bg/60 rounded-2xl flex flex-col items-center justify-center z-10">
                  <div className="bg-brand-card border border-brand-border rounded-xl p-6 text-center max-w-sm">
                    <Clock size={32} className="text-brand-muted mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-brand-fg mb-2">Founders Club Special Has Ended</h3>
                    <p className="text-sm text-brand-muted mb-4">This exclusive offer closed on April 5th, 2026. Stay tuned for future opportunities.</p>
                    <p className="text-xs text-brand-muted">Interested? Reach out at <a href="mailto:hello@razorsharpnetworks.com" className="text-brand-primary hover:underline">hello@razorsharpnetworks.com</a></p>
                  </div>
                </div>
                {/* Greyed-out form behind the overlay */}
                <div className="pointer-events-none select-none">
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-xl font-bold text-brand-fg mb-1">Join the Founders Club</h3>
                      <p className="text-brand-muted text-sm">Tell us about you and your business.</p>
                    </div>
                    {["Full Name", "Email", "Phone", "Company Name"].map((label) => (
                      <div key={label}>
                        <label className="block text-sm font-medium text-brand-fg mb-1.5">{label}</label>
                        <div className="w-full bg-brand-card border border-brand-border rounded-lg px-4 py-3 text-brand-muted/30 text-sm">—</div>
                      </div>
                    ))}
                    <div className="w-full py-3.5 rounded-lg bg-brand-muted/20 text-brand-muted font-semibold text-base text-center">
                      Offer Expired
                    </div>
                  </div>
                </div>
              </div>
            ) : (
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <FoundersCountdown />
              {step === "info" && (
                <>
                  <StepInfo onNext={handleInfoComplete} />
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => setShowPromo(!showPromo)}
                      className="text-sm text-brand-primary hover:underline"
                    >
                      {showPromo ? "Hide promo code" : "Have a promo code?"}
                    </button>
                    {showPromo && (
                      <div className="mt-3">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter promo code"
                          className="w-full bg-brand-card border border-brand-border rounded-lg px-4 py-3 text-brand-fg placeholder:text-brand-muted/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 outline-none transition-all text-sm"
                        />
                        {promoCode.trim() && (
                          <p className={`text-xs mt-1.5 ${isValidPromo ? "text-brand-green" : "text-brand-muted"}`}>
                            {isValidPromo ? "✓ Promo code applied! $1 authorization instead of $9" : "Code not recognized — standard pricing applies"}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              {step === "payment" && clientSecret && (
                <Elements stripe={stripePromise} options={elementsOptions}>
                  <CheckoutForm onSuccess={handlePaymentSuccess} customerData={customerData} isPromo={isValidPromo} />
                </Elements>
              )}
              {step === "confirm" && <StepConfirm walletAmount={walletAmount} />}
              {loading && step === "info" && (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16 md:mb-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-fg text-center mb-8">Questions?</h2>
          <FAQ />
        </section>

        {/* Final CTA */}
        <section className="text-center pb-12">
          {isFoundersExpired() ? (
            <>
              <p className="text-brand-muted mb-4">The Founders Club special has ended.</p>
              <a href="mailto:hello@razorsharpnetworks.com" className="inline-flex items-center gap-2 py-3 px-6 rounded-lg bg-brand-card border border-brand-border text-brand-muted font-semibold hover:border-brand-primary/30 transition-all">
                Contact Us for Future Opportunities <ArrowRight size={18} />
              </a>
            </>
          ) : (
            <>
              <p className="text-brand-muted mb-4">Ready to get your time back?</p>
              <a href="#join" className="inline-flex items-center gap-2 py-3 px-6 rounded-lg bg-brand-gradient text-white font-semibold shadow-brand-glow hover:opacity-90 transition-all">
                Join the Founders Club — $9 <ArrowRight size={18} />
              </a>
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-border/50 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <span>© 2026 RazoRSharp Networks. All rights reserved.</span>
          <span>One System. One Flow. One Outcome. FREEDOM</span>
        </div>
      </footer>
    </div>
  );
}
