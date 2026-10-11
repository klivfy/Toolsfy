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

/**
 * Base URL for Stripe return links. Comes only from configuration, never
 * from request headers.
 */
export function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not set");
  }
  return siteUrl.replace(/\/+$/, "");
}

/** Prices the checkout accepts; anything else from the client is refused. */
export function getAllowedPriceIds(): Set<string> {
  return new Set(
    [
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL,
    ].filter((id): id is string => Boolean(id)),
  );
}
