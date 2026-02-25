import Stripe from "stripe";

/**
 * Server-side Stripe client.
 * Use STRIPE_SECRET_KEY (sk_test_... or sk_live_...) - never expose this to the browser.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});
