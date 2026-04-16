"use client";

import { useCallback, useState } from "react";
import { ApiError, createStripeCheckoutSession } from "@/lib/api";
import { formatAEDAmount } from "@/lib/currency";

/**
 * @param {{
 *   bookingId: string;
 *   totalAmount: string | number | null | undefined;
 * }} props
 */
export default function BookingPayActions({ bookingId, totalAmount }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const onPay = useCallback(async () => {
    setErr(null);
    setBusy(true);
    try {
      const res = await createStripeCheckoutSession({ bookingId });
      const url = typeof res?.url === "string" ? res.url : null;
      if (!url) {
        setErr("Could not start checkout. Please try again.");
        setBusy(false);
        return;
      }
      window.location.assign(url);
    } catch (e) {
      if (e instanceof ApiError && e.code === "STRIPE_NOT_CONFIGURED") {
        setErr("Online payment is not available right now.");
      } else if (e instanceof ApiError) {
        setErr(e.message);
      } else {
        setErr("Something went wrong.");
      }
      setBusy(false);
    }
  }, [bookingId]);

  return (
    <div className="border-t border-secondary/10 bg-[#fdfbf7]/80 px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1.5 text-sm">
          <p className="font-semibold text-foreground">Complete payment</p>
          <p className="text-foreground/60">
            Total due:{" "}
            <span className="font-bold text-foreground">{formatAEDAmount(totalAmount)}</span> — charged only on
            Stripe&apos;s secure page.
          </p>
          <p className="text-xs text-foreground/50">
            Full refund if canceled 48h before check-in · 50% at 24h · No refund after that.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900/90">
            <span aria-hidden>🔒</span>
            Secure payment powered by Stripe
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          {err ? (
            <p className="max-w-xs text-right text-xs font-medium text-red-800" role="alert">
              {err}
            </p>
          ) : null}
          <button
            type="button"
            disabled={busy}
            onClick={onPay}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 ring-1 ring-primary/20 transition hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? (
              <span className="flex items-center gap-2">
                <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Redirecting to secure payment…
              </span>
            ) : (
              "Confirm & pay"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
