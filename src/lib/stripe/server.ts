import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2026-07-29.dahlia",
      typescript: true,
      // Fail fast instead of holding the function until the platform kills
      // it; the SDK retries with backoff and reuses idempotency keys.
      timeout: 10_000,
      maxNetworkRetries: 2,
    });
  }
  return stripeClient;
}
