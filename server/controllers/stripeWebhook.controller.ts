import { Request, Response } from "express";
import Stripe from "stripe";
import { fulfillCoursePurchase } from "../services/orderFulfillment.service";
import ErrorHandler from "../utils/ErrorHandler";
import { stripeClient } from "../utils/stripeClient";

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const rawBody = req.body;

  if (!sig || !Buffer.isBuffer(rawBody)) {
    return res.status(400).send("Missing signature or raw body");
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return res.status(500).send("Webhook secret not configured");
  }

  let event: Stripe.Event;
  try {
    event = stripeClient.webhooks.constructEvent(rawBody, sig, secret);
  } catch {
    return res.status(400).send("Webhook signature verification failed");
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const userId = pi.metadata?.userId;
    const courseId = pi.metadata?.courseId;
    if (!userId || !courseId) {
      return res.status(200).json({ received: true, ignored: "missing_metadata" });
    }

    try {
      await fulfillCoursePurchase({
        userId,
        courseId,
        payment_info: pi as unknown as Record<string, unknown>,
      });
    } catch (err: unknown) {
      if (
        err instanceof ErrorHandler &&
        String(err.message).includes("already enrolled")
      ) {
        return res.status(200).json({ received: true });
      }
      console.error("Stripe webhook fulfillment error:", err);
      return res.status(500).json({ error: "fulfillment_failed" });
    }
  }

  return res.status(200).json({ received: true });
};
