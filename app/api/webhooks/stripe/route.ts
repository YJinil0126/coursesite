/**
 * Stripe Webhook Handler
 *
 * POST /api/webhooks/stripe
 *
 * Stripe sends events here (e.g. checkout.session.completed).
 * We verify the signature, then insert into purchases when payment succeeds.
 *
 * IMPORTANT: Use the raw body for signature verification - Next.js passes it differently.
 */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing webhook secret or signature");
    return NextResponse.json({ error: "Webhook config error" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const courseId = session.metadata?.courseId;
    const userId = session.metadata?.userId;

    if (!courseId || !userId) {
      console.error("Missing metadata in session:", session.id);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    // Use service role to bypass RLS (webhook runs server-side, no user session)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from("purchases").insert({
      user_id: userId,
      course_id: courseId,
      stripe_session_id: session.id,
    });

    if (error) {
      console.error("Failed to insert purchase:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
