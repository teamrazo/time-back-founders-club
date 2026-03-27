import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { upsertContactAndTag } from "@/lib/ghl";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion });

const METERED_PRICE_ID = process.env.STRIPE_METERED_PRICE_ID || "price_1TFaZw2nD6x4dHG0450vf8JS";
const WALLET_AMOUNT_CENTS = 2000; // $20 wallet
const PILOT_AMOUNT_CENTS = 900; // $9 entry

export async function POST(req: NextRequest) {
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

      // Sync to GHL
      const GHL_ENABLED = Boolean(process.env.GHL_PRIVATE_TOKEN && process.env.GHL_LOCATION_ID);
      if (GHL_ENABLED && email && fullName && phone) {
        try {
          await upsertContactAndTag({
            fullName,
            email,
            phone,
            companyName,
            tagsToAdd: [
              "Status - Onboarding Pipeline - Pilot Activated",
              "Activity - Founders Club - Pilot Payment Complete",
              "Activity - Onboarding - Wallet Loaded",
            ],
          });
        } catch (e) {
          console.warn("GHL sync failed:", e);
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
