/**
 * Create Stripe Checkout Session
 *
 * POST /api/create-checkout
 * Body: { courseId: string }
 *
 * Creates a Stripe Checkout Session and returns the URL to redirect the user.
 * User must be signed in (we get user from Supabase in the request).
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Missing courseId" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch course
    const { data: course, error } = await supabase
      .from("courses")
      .select("id, title, description, image_url, price_id")
      .eq("id", courseId)
      .single();

    if (error || !course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if already purchased
    const { data: existing } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Already purchased", url: `/courses/${courseId}` },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description || undefined,
              images: course.image_url ? [course.image_url] : undefined,
            },
            unit_amount: 2999, // $29.99 in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/courses/${courseId}?success=true`,
      cancel_url: `${origin}/courses/${courseId}?canceled=true`,
      metadata: {
        courseId,
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
