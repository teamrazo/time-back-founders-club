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
    const { fullName, email, phone, companyName, step } = body;

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
        amount: PILOT_AMOUNT_CENTS,
        currency: "usd",
        customer: customer.id,
        description: "TimeBACK Founders Club — Pilot Activation",
        metadata: {
          type: "founders_club_pilot",
          companyName: companyName || "",
          fullName,
        },
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

      // Verify payment succeeded
      if (paymentIntentId) {
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (pi.status !== "succeeded") {
          return NextResponse.json({ error: "Payment not confirmed" }, { status: 400 });
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
          const orderNote = [
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
              "Activity - Founders Club - Pilot Payment Complete",
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
      console.log(`[notify] Founders Club payment: ${fullName} | ${email}`);
      if (SLACK_WEBHOOK) {
        try {
          await fetch(SLACK_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: `🔥 *New CATO AI Activation Payment*\n• *Name:* ${fullName}\n• *Email:* ${email}\n• *Amount:* $9.00 (pilot) + $20.00 wallet\n• *Company:* ${companyName || "N/A"}\n• *Time:* ${paymentTime}`,
            }),
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
