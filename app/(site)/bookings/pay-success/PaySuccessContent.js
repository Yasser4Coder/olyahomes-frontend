"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, fetchCheckoutSessionStatus } from "@/lib/api";
import { formatAEDAmount } from "@/lib/currency";

function formatStayRange(checkIn, checkOut) {
  const a = new Date(`${checkIn}T12:00:00`);
  const b = new Date(`${checkOut}T12:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) {
    return `${checkIn} → ${checkOut}`;
  }
  return `${a.toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })} – ${b.toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}`;
}

const POLL_MS = 2000;
const MAX_ATTEMPTS = 46;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function PaySuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [phase, setPhase] = useState(/** @type {"loading"|"success"|"processing"|"stuck"|"error"|"noid"} */ ("loading"));
  const [message, setMessage] = useState("");
  const [detail, setDetail] = useState(/** @type {Record<string, unknown>|null} */ (null));

  useEffect(() => {
    if (!sessionId) {
      setPhase("noid");
      setMessage("Missing payment session. Open this page from your booking after paying, or go to My bookings.");
      return;
    }

    let cancelled = false;

    (async () => {
      for (let attempt = 0; attempt < MAX_ATTEMPTS && !cancelled; attempt++) {
        try {
          const data = await fetchCheckoutSessionStatus(sessionId);
          if (cancelled) return;

          const bookingStatus = typeof data?.bookingStatus === "string" ? data.bookingStatus : "";
          const stripePaymentStatus = typeof data?.stripePaymentStatus === "string" ? data.stripePaymentStatus : "";
          const booking = data?.booking && typeof data.booking === "object" ? data.booking : null;

          if (bookingStatus === "confirmed") {
            setDetail(booking);
            setPhase("success");
            return;
          }

          if (stripePaymentStatus === "paid" && bookingStatus === "pending_payment") {
            setPhase("processing");
            setMessage("Payment received. Finalizing your booking…");
          } else if (stripePaymentStatus === "unpaid" || stripePaymentStatus === "no_payment_required") {
            setPhase("error");
            setMessage("This session was not completed. You have not been charged.");
            return;
          } else {
            setPhase("processing");
            setMessage("Checking payment status…");
          }
        } catch (e) {
          if (cancelled) return;
          if (e instanceof ApiError) {
            setPhase("error");
            setMessage(e.message);
          } else {
            setPhase("error");
            setMessage("Could not verify payment.");
          }
          return;
        }

        if (attempt < MAX_ATTEMPTS - 1) {
          await sleep(POLL_MS);
        }
      }

      if (!cancelled) {
        setPhase("stuck");
        setMessage(
          "We could not confirm your booking yet. If you were charged, check My bookings in a few minutes or contact support.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (phase === "noid" || phase === "error") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-red-200/80 bg-white p-8 text-center shadow-sm">
          <p className="text-3xl" aria-hidden>
            ❌
          </p>
          <h1 className="font-hero-serif mt-4 text-xl font-semibold text-foreground">Payment verification</h1>
          <p className="mt-3 text-sm text-foreground/70">{message}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/bookings/"
              className="inline-flex justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
            >
              My bookings
            </Link>
            <Link
              href="/listings/"
              className="inline-flex justify-center rounded-full border border-secondary/25 px-6 py-3 text-sm font-semibold text-foreground"
            >
              Browse listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "loading" || phase === "processing" || phase === "stuck") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-secondary/15 bg-white p-10 text-center shadow-sm">
          <div
            className="mx-auto size-10 animate-spin rounded-full border-2 border-primary/25 border-t-primary"
            aria-hidden
          />
          <h1 className="font-hero-serif mt-6 text-xl font-semibold text-foreground">
            {phase === "stuck" ? "Still confirming…" : "Processing payment…"}
          </h1>
          <p className="mt-3 text-sm text-foreground/65">{phase === "stuck" ? message : message || "Verifying with our servers…"}</p>
          {phase !== "stuck" ? (
            <p className="mt-4 text-xs font-medium text-foreground/45">
              🔒 Your booking is only marked paid after Stripe notifies us — not from this page alone.
            </p>
          ) : null}
          <Link href="/bookings/" className="mt-8 inline-block text-sm font-semibold text-primary underline-offset-2 hover:underline">
            Open My bookings
          </Link>
        </div>
      </div>
    );
  }

  const b = detail;
  const title = typeof b?.propertyTitle === "string" ? b.propertyTitle : "Your stay";
  const refId = typeof b?.id === "string" ? b.id : "—";
  const checkIn = typeof b?.checkIn === "string" ? b.checkIn : "";
  const checkOut = typeof b?.checkOut === "string" ? b.checkOut : "";
  const total = b?.totalAmount;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-emerald-200/80 bg-white p-8 text-center shadow-sm">
        <p className="text-3xl" aria-hidden>
          ✅
        </p>
        <h1 className="font-hero-serif mt-4 text-2xl font-semibold text-foreground">Payment successful</h1>
        <p className="mt-2 text-sm text-foreground/65">Your booking is confirmed. A confirmation email is on its way.</p>

        <div className="mt-8 rounded-2xl border border-secondary/12 bg-[#fdfbf7] px-5 py-5 text-left text-sm">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-primary">Booking</p>
          <p className="mt-2 font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-foreground/60">
            Ref <span className="font-mono text-foreground">{refId}</span>
          </p>
          <p className="mt-3 text-foreground/70">{formatStayRange(checkIn, checkOut)}</p>
          <p className="mt-3 text-base font-bold text-foreground">{formatAEDAmount(total)}</p>
        </div>

        <p className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900/90">
          <span aria-hidden>🔒</span>
          Paid securely with Stripe
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/bookings/"
            className="inline-flex justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            View all bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
