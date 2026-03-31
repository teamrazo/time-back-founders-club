export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { upsertContactAndTag } from "@/lib/ghl";

let _stripe: Stripe | null = null;
function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion });
  }
  return _stripe;
}

const METERED_PRICE_ID = process.env.STRIPE_METERED_PRICE_ID || "price_1TFaZw2nD6x4dHG0450vf8JS";
const WALLET_AMOUNT_CENTS = 2000; // $20 wallet
const PILOT_AMOUNT_CENTS = 900; // $9 entry

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  try {
    const body = await req.json();
    const { fullName, email, phone, companyName, step, promoCode } = body;
    const VALID_PROMO = "GETYOURTIMEBACKIN2026!";
    const isPromo = typeof promoCode === "string" && promoCode.trim().toUpperCase() === VALID_PROMO.toUpperCase();

    // Step 1: Create Payment Intent for $9
    if (step === "create-intent") {
      if (!email || !fullName) {
        return NextResponse.json({ error: "Name and email required" }, { status: 400 });
      }

      // Check if customer already exists
      const existing = await stripe.customers.list({ email, limit: 1 });
      let customer: Stripe.Customer;

      if (existing.data.length > 0) {
        customer = existing.data[0];
      } else {
        customer = await stripe.customers.create({
          email,
          name: fullName,
          phone: phone || undefined,
          metadata: {
            companyName: companyName || "",
            source: "founders-club",
            walletAmountCents: String(WALLET_AMOUNT_CENTS),
          },
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: isPromo ? 100 : PILOT_AMOUNT_CENTS,
        currency: "usd",
        customer: customer.id,
        setup_future_usage: "off_session",
        description: isPromo
          ? "TimeBACK Founders Club — Promo Activation (auth only)"
          : "TimeBACK Founders Club — Pilot Activation",
        metadata: isPromo
          ? {
              type: "founders_club_promo",
              promoCode: VALID_PROMO,
              originalAmount: String(PILOT_AMOUNT_CENTS),
              companyName: companyName || "",
              fullName,
            }
          : {
              type: "founders_club_pilot",
              companyName: companyName || "",
              fullName,
            },
        ...(isPromo ? { capture_method: "manual" as const } : {}),
        automatic_payment_methods: { enabled: true },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        customerId: customer.id,
      });
    }

    // Step 2: After payment success — set up metered subscription + GHL tags
    if (step === "activate") {
      const { customerId, paymentIntentId } = body;

      if (!customerId) {
        return NextResponse.json({ error: "Customer ID required" }, { status: 400 });
      }

      // Verify payment succeeded (or authorized for promo)
      let isPromoActivation = false;
      if (paymentIntentId) {
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (pi.status === "requires_capture" && pi.metadata.type === "founders_club_promo") {
          // Promo flow: cancel the $1 auth hold (release it)
          await stripe.paymentIntents.cancel(paymentIntentId);
          isPromoActivation = true;
        } else if (pi.status !== "succeeded") {
          return NextResponse.json({ error: "Payment not confirmed" }, { status: 400 });
        }
      }

      // Attach the payment method from the $9 charge as default for future billing
      if (paymentIntentId && !isPromoActivation) {
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (pi.payment_method && typeof pi.payment_method === "string") {
          await stripe.customers.update(customerId, {
            invoice_settings: { default_payment_method: pi.payment_method },
          });
        }
      }

      // Create metered subscription for ongoing AI usage
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: METERED_PRICE_ID }],
        metadata: {
          type: "ai_growth_engine",
          source: "founders_club",
          walletThresholdCents: String(WALLET_AMOUNT_CENTS),
        },
      });

      const subscriptionItemId = subscription.items.data[0]?.id || "";

      // Sync to GHL — full order details on contact record
      const GHL_ENABLED = Boolean(process.env.GHL_PRIVATE_TOKEN && process.env.GHL_LOCATION_ID);
      if (GHL_ENABLED && email && fullName && phone) {
        try {
          const orderDate = new Date().toISOString();
          const orderNote = isPromoActivation
            ? [
                `🎁 ORDER: TimeBACK Founders Club — PROMO ACTIVATION`,
                `Date: ${new Date().toLocaleDateString("en-US", { timeZone: "America/Los_Angeles" })}`,
                `PROMO: GETYOURTIMEBACKIN2026!`,
                `Amount: $0.00 (promotional)`,
                `Wallet: $20.00 loaded`,
                `Stripe Customer: ${customerId}`,
                `Stripe Subscription: ${subscription.id}`,
                `Stripe Payment: ${paymentIntentId || "N/A"} ($1 auth released)`,
                `Company: ${companyName || "N/A"}`,
                `Product: AI Growth Engine — Metered Usage`,
                `Billing Model: Wallet threshold ($20 default)`,
              ].join("\n")
            : [
                `🛒 ORDER: TimeBACK Founders Club Pilot`,
                `Date: ${new Date().toLocaleDateString("en-US", { timeZone: "America/Los_Angeles" })}`,
                `Amount: $9.00`,
                `Wallet: $20.00 loaded`,
                `Stripe Customer: ${customerId}`,
                `Stripe Subscription: ${subscription.id}`,
                `Stripe Payment: ${paymentIntentId || "N/A"}`,
                `Company: ${companyName || "N/A"}`,
                `Product: AI Growth Engine — Metered Usage`,
                `Billing Model: Wallet threshold ($20 default)`,
              ].join("\n");

          await upsertContactAndTag({
            fullName,
            email,
            phone,
            companyName,
            source: "TimeBACK Founders Club",
            tagsToAdd: [
              "Status - Onboarding Pipeline - Pilot Activated",
              isPromoActivation
                ? "Activity - Founders Club - Promo Activated"
                : "Activity - Founders Club - Pilot Payment Complete",
              "Activity - Onboarding - Wallet Loaded",
              "Profile - Source - Founders Club Landing Page",
              "Profile - Product - AI Growth Engine",
            ],
            note: orderNote,
          });
        } catch (e) {
          console.warn("GHL sync failed:", e);
        }
      }

      // Slack notification for payment
      const SLACK_WEBHOOK = process.env.SLACK_NOTIFICATION_WEBHOOK;
      const paymentTime = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
      console.log(`[notify] Founders Club ${isPromoActivation ? "promo" : "payment"}: ${fullName} | ${email}`);
      if (SLACK_WEBHOOK) {
        try {
          const slackText = isPromoActivation
            ? `🎁 *New CATO AI Promo Activation*\n• *Name:* ${fullName}\n• *Email:* ${email}\n• *Promo Code:* GETYOURTIMEBACKIN2026!\n• *Amount:* $0.00 (promotional) + $20.00 wallet\n• *Company:* ${companyName || "N/A"}\n• *Time:* ${paymentTime}`
            : `🔥 *New CATO AI Activation Payment*\n• *Name:* ${fullName}\n• *Email:* ${email}\n• *Amount:* $9.00 (pilot) + $20.00 wallet\n• *Company:* ${companyName || "N/A"}\n• *Time:* ${paymentTime}`;
          await fetch(SLACK_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: slackText }),
            signal: AbortSignal.timeout(5000),
          });
        } catch (notifyErr) {
          console.warn("Slack notification failed:", notifyErr);
        }
      }

      return NextResponse.json({
        success: true,
        subscriptionId: subscription.id,
        subscriptionItemId,
        walletAmount: "$20.00",
      });
    }

    return NextResponse.json({ error: "Invalid step" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Founders Club error:", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
