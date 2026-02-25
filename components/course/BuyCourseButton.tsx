"use client";

import { useState } from "react";

type BuyCourseButtonProps = {
  courseId: string;
  disabled?: boolean;
};

/**
 * BuyCourseButton: Triggers Stripe Checkout.
 * Calls /api/create-checkout, then redirects to Stripe's hosted checkout page.
 */
export function BuyCourseButton({ courseId, disabled }: BuyCourseButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Already purchased") {
          window.location.href = data.url || `/courses/${courseId}`;
          return;
        }
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={disabled || loading}
      className="mt-4 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
    >
      {loading ? "Redirecting..." : "Buy course — $29.99"}
    </button>
  );
}
