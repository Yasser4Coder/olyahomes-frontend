import Link from "next/link";
import { useState } from "react";
import BookingPayActions from "@/components/BookingPayActions";
import GuestBookingCancelModal from "@/components/GuestBookingCancelModal";
import { formatAEDAmount } from "@/lib/currency";
import { getApiBase } from "@/lib/api";
import { listingDetailHref } from "@/lib/listingRoutes";
import { resolveMediaUrl } from "@/lib/listingMappers";

function formatStayRange(checkIn, checkOut) {
  const a = new Date(`${checkIn}T12:00:00`);
  const b = new Date(`${checkOut}T12:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) {
    return `${checkIn} → ${checkOut}`;
  }
  return `${a.toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })} – ${b.toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}`;
}

function statusStyles(status) {
  switch (status) {
    case "confirmed":
    case "completed":
      return "bg-emerald-500/12 text-emerald-900 ring-emerald-600/20";
    case "cancelled":
    case "rejected":
      return "bg-zinc-400/15 text-zinc-800 ring-zinc-500/20";
    case "pending_payment":
    case "pending_host":
      return "bg-amber-500/12 text-amber-950 ring-amber-600/25";
    default:
      return "bg-secondary/12 text-foreground ring-secondary/20";
  }
}

function statusLabel(status) {
  return String(status || "").replace(/_/g, " ");
}

/**
 * @param {{
 *   bookings: Array<Record<string, unknown>>;
 *   error?: string | null;
 *   className?: string;
 *   onBookingsRefresh?: () => void | Promise<void>;
 * }} props
 */
export default function GuestBookingsList({ bookings, error = null, className = "", onBookingsRefresh }) {
  const [cancelFor, setCancelFor] = useState(null);

  const sortedBookings = [...bookings].sort((a, b) => {
    const at = Date.parse(String(a?.createdAt || a?.created_at || a?.updatedAt || a?.updated_at || ""));
    const bt = Date.parse(String(b?.createdAt || b?.created_at || b?.updatedAt || b?.updated_at || ""));
    if (!Number.isNaN(at) && !Number.isNaN(bt)) return bt - at;
    if (!Number.isNaN(bt)) return 1;
    if (!Number.isNaN(at)) return -1;
    const ai = Number(a?.id);
    const bi = Number(b?.id);
    if (!Number.isNaN(ai) && !Number.isNaN(bi)) return bi - ai;
    return 0;
  });

  return (
    <div className={className}>
      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-900"
        >
          {error}
        </p>
      ) : null}

      <ul className={`space-y-4 ${error ? "mt-6" : ""}`}>
        {!error && bookings.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-secondary/25 bg-white/80 px-6 py-12 text-center">
            <p className="text-foreground/70">You have no bookings yet.</p>
            <Link
              href="/listings/"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary/90"
            >
              Explore homes
            </Link>
          </li>
        ) : null}

        {sortedBookings.map((b) => {
          const href = b.property?.slug ? listingDetailHref(b.property.slug) : "/listings/";
          const showPay = b.status === "pending_payment";
          const showReceipt = b.status === "confirmed" || b.status === "completed";
          const showCancel =
            b.status === "pending_payment" || b.status === "pending_host" || b.status === "confirmed";
          const receiptUrl = `${getApiBase()}/api/v1/payments/receipt/${encodeURIComponent(String(b.id))}`;
          const refundStatus = b.refundStatus;
          return (
            <li key={String(b.id)}>
              <div className="overflow-hidden rounded-2xl border border-secondary/12 bg-white shadow-sm transition hover:border-primary/25 hover:shadow-[0_14px_40px_-28px_rgba(44,36,25,0.18)]">
                <Link href={href} className="group flex gap-4 p-4 sm:gap-5 sm:p-5">
                  <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-dark sm:h-28 sm:w-36">
                    {b.property?.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- listing covers may be any CDN URL
                      <img
                        src={resolveMediaUrl(b.property.coverImageUrl)}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-foreground/40">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold leading-snug text-foreground group-hover:text-primary">
                          {b.property?.title || "Property"}
                        </p>
                        {b.property?.location ? (
                          <p className="mt-0.5 text-sm text-foreground/55">{b.property.location}</p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide ring-1 ${statusStyles(b.status)}`}
                        >
                          {statusLabel(b.status)}
                        </span>
                        {refundStatus === "processed" && Number(b.refundedAmount) > 0 ? (
                          <span className="rounded-full bg-primary/12 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-primary ring-1 ring-primary/20">
                            Refund {formatAEDAmount(b.refundedAmount)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-foreground/65">{formatStayRange(b.checkIn, b.checkOut)}</p>
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
                      <span className="text-foreground/55">
                        {b.guestCount} guest{b.guestCount === 1 ? "" : "s"}
                        {Number(b.childrenCount) > 0 ? (
                          <span className="text-foreground/45">
                            {" "}
                            · {Number(b.childrenCount)} child{Number(b.childrenCount) === 1 ? "" : "ren"}
                          </span>
                        ) : null}
                        {b.petsAllowed ? <span className="text-foreground/45"> · Pets</span> : null}
                      </span>
                      <span className="font-semibold text-foreground">{formatAEDAmount(b.totalAmount)}</span>
                    </div>
                  </div>
                </Link>
                {showPay ? <BookingPayActions bookingId={String(b.id)} totalAmount={b.totalAmount} /> : null}
                {showCancel ? (
                  <div className="border-t border-secondary/10 bg-white px-4 py-3 sm:px-5">
                    <button
                      type="button"
                      onClick={() => setCancelFor(b)}
                      className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-red-200 bg-red-50/80 px-6 py-2.5 text-sm font-semibold text-red-900 transition hover:bg-red-100 sm:w-auto"
                    >
                      Cancel booking
                    </button>
                  </div>
                ) : null}
                {showReceipt ? (
                  <div className="border-t border-secondary/10 bg-white px-4 py-4 sm:px-5">
                    <a
                      href={receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-secondary/25 bg-white px-6 py-2.5 text-sm font-semibold text-foreground transition hover:bg-neutral/40"
                    >
                      Download receipt (PDF)
                    </a>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      {cancelFor ? (
        <GuestBookingCancelModal
          bookingId={String(cancelFor.id)}
          propertyTitle={cancelFor.property?.title}
          open
          onClose={() => setCancelFor(null)}
          onSuccess={async () => {
            await onBookingsRefresh?.();
          }}
        />
      ) : null}
    </div>
  );
}
