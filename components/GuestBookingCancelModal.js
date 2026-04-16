"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, fetchGuestCancelPreview, guestCancelBooking } from "@/lib/api";
import { formatAEDAmount } from "@/lib/currency";

const REASONS = [
  { value: "change_of_plan", label: "Change of plans" },
  { value: "emergency", label: "Emergency" },
  { value: "found_alternative", label: "Found another place" },
  { value: "dates_wrong", label: "Wrong dates" },
  { value: "other", label: "Other" },
];

/**
 * @param {{
 *   bookingId: string;
 *   propertyTitle?: string;
 *   open: boolean;
 *   onClose: () => void;
 *   onSuccess: () => void;
 * }} props
 */
export default function GuestBookingCancelModal({ bookingId, propertyTitle, open, onClose, onSuccess }) {
  const [preview, setPreview] = useState(null);
  const [previewErr, setPreviewErr] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [reason, setReason] = useState("change_of_plan");
  const [busy, setBusy] = useState(false);
  const [submitErr, setSubmitErr] = useState(null);
  const [doneMsg, setDoneMsg] = useState(null);

  const loadPreview = useCallback(async () => {
    if (!bookingId) return;
    setLoadingPreview(true);
    setPreviewErr(null);
    setDoneMsg(null);
    try {
      const body = await fetchGuestCancelPreview(bookingId);
      setPreview(body);
    } catch (e) {
      setPreview(null);
      setPreviewErr(e instanceof ApiError ? e.message : "Could not load cancellation details.");
    } finally {
      setLoadingPreview(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (open && bookingId) {
      loadPreview();
    }
  }, [open, bookingId, loadPreview]);

  const submit = async () => {
    setBusy(true);
    setSubmitErr(null);
    try {
      const res = await guestCancelBooking({ bookingId, reason });
      setDoneMsg(res?.message || "Booking cancelled.");
      await Promise.resolve(onSuccess?.());
    } catch (e) {
      setSubmitErr(e instanceof ApiError ? e.message : "Cancellation failed.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  const canCancel = preview?.canCancel !== false;
  const refundAed = Number(preview?.refundAmountAed) || 0;
  const hasPaid = Boolean(preview?.hasPaid);

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-booking-title"
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-secondary/15 bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-secondary/15 bg-white px-2.5 py-1 text-xs font-semibold text-foreground/70 transition hover:bg-neutral/40"
        >
          Close
        </button>
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">Cancel booking</p>
        <h2 id="cancel-booking-title" className="mt-2 pr-10 text-xl font-semibold text-foreground">
          {propertyTitle || "Your stay"}
        </h2>

        {loadingPreview ? (
          <p className="mt-4 text-sm text-foreground/55">Loading policy…</p>
        ) : previewErr ? (
          <p className="mt-4 text-sm text-red-800" role="alert">
            {previewErr}
          </p>
        ) : preview ? (
          <div className="mt-4 space-y-3 text-sm text-foreground/75">
            {!canCancel ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2 text-amber-950">
                This booking can’t be cancelled online.
              </p>
            ) : (
              <>
                {hasPaid && refundAed > 0 ? (
                  <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-3 py-2 text-emerald-950">
                    <p className="font-semibold">You will receive {formatAEDAmount(String(refundAed))}</p>
                    <p className="mt-1 text-xs text-emerald-900/90">
                      Free cancellation before your policy window (see confirmation email). Refund will be sent to your{" "}
                      <strong>original payment method</strong>.
                    </p>
                  </div>
                ) : null}
                {hasPaid && refundAed <= 0 ? (
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900">
                    <p className="font-medium">No refund under the current policy</p>
                    <p className="mt-1 text-xs text-zinc-700">
                      You can still cancel; the stay will be released and you won’t receive money back.
                    </p>
                  </div>
                ) : null}
                {!hasPaid ? (
                  <p className="text-foreground/70">No payment was completed — we’ll release the dates only.</p>
                ) : null}
                {preview.message ? <p className="text-xs text-foreground/55">{preview.message}</p> : null}
              </>
            )}
          </div>
        ) : null}

        {doneMsg ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900">
            {doneMsg}
            {String(doneMsg).toLowerCase().includes("refund") ? (
              <span className="mt-1 block text-xs font-normal text-emerald-900/85">
                Refunds can take 5–10 business days to appear on your card or bank statement.
              </span>
            ) : null}
          </p>
        ) : null}

        {submitErr ? (
          <p className="mt-3 text-sm text-red-800" role="alert">
            {submitErr}
          </p>
        ) : null}

        {!doneMsg && canCancel ? (
          <>
            <label className="mt-5 block text-sm">
              <span className="mb-1 block font-medium text-foreground/70">Reason</span>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={busy}
                className="w-full rounded-xl border border-secondary/20 bg-white px-3 py-2.5 text-sm text-foreground shadow-sm"
              >
                {REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={busy || loadingPreview}
                onClick={submit}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary/90 disabled:opacity-60"
              >
                {busy ? (
                  <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  "Confirm cancellation"
                )}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onClose}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-secondary/25 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-neutral/40"
              >
                Keep booking
              </button>
            </div>
          </>
        ) : doneMsg ? (
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-full border border-secondary/20 py-3 text-sm font-semibold text-foreground transition hover:bg-neutral/40"
          >
            Done
          </button>
        ) : null}
      </div>
    </div>
  );
}
