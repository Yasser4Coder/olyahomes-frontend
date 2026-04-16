"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import ListingGalleryClient from "@/app/(site)/listings/ListingGalleryClient";
import FavoriteHeartButton from "@/components/FavoriteHeartButton";
import { formatAED } from "@/lib/currency";
import { ApiError, createBooking, createStripeCheckoutSession, fetchPropertyAvailability, fetchPropertyBySlug } from "@/lib/api";
import { formatAEDAmount } from "@/lib/currency";
import { mapPropertyFromApi, normalizeAmenities } from "@/lib/listingMappers";
import { refundPolicyListingBullets } from "@/lib/refundPolicy";

const PAYMENT_DEADLINE_MINUTES =
  Number.parseInt(String(process.env.NEXT_PUBLIC_BOOKING_PAYMENT_TIMEOUT_MINUTES || "30"), 10) || 30;

function IconPin({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconUsers({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBed({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 10v9M3 14h18M5 14V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M9 21v-4M15 21v-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBath({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 12h16M6 20h12M9 16v4M15 16v4M6 20V10a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconHome({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 10.5 12 3l9 7.5V21a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 21v-10.5z" />
      <path d="M9 22v-7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7" />
    </svg>
  );
}

function IconShield({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function IconCheck({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function localYmd(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDaysYmd(ymd, days) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return localYmd(dt);
}

/** Normalize API DATEONLY to YYYY-MM-DD */
function toYmd(v) {
  if (!v) return "";
  if (typeof v === "string") return v.length >= 10 ? v.slice(0, 10) : v;
  try {
    return localYmd(new Date(v));
  } catch {
    return "";
  }
}

/**
 * A calendar day is unavailable if:
 * - it’s an occupied night [checkIn, checkOut), or
 * - it’s another guest’s checkout date (departure morning) — no same-day check-in after a stay.
 */
function isNightBooked(ymd, ranges) {
  return calendarDayBlockReason(ymd, ranges) != null;
}

/** @returns {'booked' | 'turnover' | null} */
function calendarDayBlockReason(ymd, ranges) {
  for (const r of ranges) {
    const ci = toYmd(r?.checkIn);
    const co = toYmd(r?.checkOut);
    if (!ci || !co) continue;
    if (ymd >= ci && ymd < co) return "booked";
    if (ymd === co) return "turnover";
  }
  return null;
}

/** New stay [stayIn, stayOut) conflicts with existing ranges (overlap or check-in on their checkout day). */
function stayConflictsBlockedRanges(stayIn, stayOut, ranges) {
  if (!stayIn || !stayOut || stayIn >= stayOut) return false;
  for (const r of ranges) {
    const bi = toYmd(r?.checkIn);
    const bo = toYmd(r?.checkOut);
    if (!bi || !bo) continue;
    if (stayOverlapsBlock(stayIn, stayOut, bi, bo)) return true;
    if (stayIn === bo) return true;
  }
  return false;
}

/** Monday = 0 … Sunday = 6 */
function weekdayMonFirstFromSunday(sun0) {
  return sun0 === 0 ? 6 : sun0 - 1;
}

function nightsBetween(checkIn, checkOut) {
  const a = new Date(`${checkIn}T12:00:00Z`).getTime();
  const b = new Date(`${checkOut}T12:00:00Z`).getTime();
  return Math.round((b - a) / 86400000);
}

/** Long label for a YYYY-MM-DD (local) */
function formatStayDateLabel(ymd) {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return ymd;
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function stayOverlapsBlock(stayIn, stayOut, blockIn, blockOut) {
  return stayIn < blockOut && stayOut > blockIn;
}

const WEEKDAY_LABELS_MON = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/**
 * Month grid: booked nights styled + title tooltip; click to set check-in / check-out.
 */
function BookingCalendar({
  todayYmd,
  blockedRanges,
  loading,
  error,
  onRetry,
  checkIn,
  checkOut,
  onDayClick,
}) {
  const [cursor, setCursor] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });

  const y = cursor.getFullYear();
  const m0 = cursor.getMonth();
  const dim = new Date(y, m0 + 1, 0).getDate();
  const pad = weekdayMonFirstFromSunday(new Date(y, m0, 1).getDay());
  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const goPrev = () => setCursor(new Date(y, m0 - 1, 1));
  const goNext = () => setCursor(new Date(y, m0 + 1, 1));

  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-live="polite">
        <div className="mx-auto h-4 max-w-[60%] animate-pulse rounded bg-secondary/20" />
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg bg-secondary/15" />
          ))}
        </div>
        <p className="text-center text-xs text-foreground/45">Loading availability…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200/90 bg-red-50/90 px-3 py-3 text-sm text-red-900">
        <p className="font-medium">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-sm font-semibold text-primary underline underline-offset-2 hover:text-primary/90"
        >
          Try again
        </button>
      </div>
    );
  }

  const cells = [];
  for (let i = 0; i < pad; i += 1) {
    cells.push({ key: `pad-${i}`, empty: true });
  }
  for (let day = 1; day <= dim; day += 1) {
    const ymd = `${y}-${String(m0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({ key: ymd, empty: false, ymd, day });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goPrev}
          className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-secondary/20 bg-white text-sm font-semibold text-foreground/70 transition hover:bg-zinc-50"
          aria-label="Previous month"
        >
          ‹
        </button>
        <p className="min-w-0 truncate text-center text-xs font-bold uppercase tracking-[0.12em] text-foreground/45">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={goNext}
          className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-secondary/20 bg-white text-sm font-semibold text-foreground/70 transition hover:bg-zinc-50"
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[0.6rem] font-bold uppercase tracking-wide text-foreground/38">
        {WEEKDAY_LABELS_MON.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((c) => {
          if (c.empty) {
            return <span key={c.key} className="aspect-square" aria-hidden />;
          }
          const { ymd, day } = c;
          const blockReason = calendarDayBlockReason(ymd, blockedRanges);
          const past = ymd < todayYmd;
          /** Occupied nights [checkIn, checkOut) — excludes checkout morning */
          const inRangeNights =
            Boolean(checkIn && checkOut && ymd >= checkIn && ymd < checkOut);
          const isCheckoutDay = Boolean(checkIn && checkOut && ymd === checkOut);
          const isCheckIn = ymd === checkIn;
          const isCheckOut = ymd === checkOut;
          const disabled = past || blockReason;

          let cellClass =
            "relative flex aspect-square w-full items-center justify-center rounded-lg text-sm font-semibold tabular-nums transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500 ";
          if (disabled) {
            if (blockReason === "booked") {
              cellClass +=
                "cursor-not-allowed bg-zinc-200/90 text-zinc-500 line-through decoration-zinc-400";
            } else if (blockReason === "turnover") {
              cellClass +=
                "cursor-not-allowed bg-amber-100/95 text-amber-900/75 ring-1 ring-amber-200/90";
            } else {
              cellClass += "cursor-not-allowed text-foreground/25";
            }
          } else if (inRangeNights) {
            cellClass += "bg-blue-100 text-blue-950 ring-1 ring-blue-200/80";
          } else if (isCheckoutDay) {
            cellClass += "bg-blue-50 text-blue-950 ring-2 ring-blue-500 font-bold";
          } else {
            cellClass += "bg-white text-foreground ring-1 ring-secondary/15 hover:bg-blue-50/50 hover:ring-blue-200/40";
          }
          if (!disabled && checkIn && !checkOut && ymd === checkIn) {
            cellClass += " z-[1] font-bold ring-2 ring-blue-600 bg-blue-200/90 text-blue-950";
          } else if (!disabled && inRangeNights && ymd === checkIn && checkOut) {
            cellClass += " z-[1] ring-2 ring-blue-600";
          }

          return (
            <button
              key={c.key}
              type="button"
              disabled={disabled}
              title={
                blockReason === "booked"
                  ? "Already booked"
                  : blockReason === "turnover"
                    ? "Turnover — another guest checks out that morning; not available for check-in"
                    : isCheckoutDay
                      ? "Check-out (departure morning)"
                      : undefined
              }
              aria-label={
                blockReason === "booked"
                  ? `${day}, already booked`
                  : blockReason === "turnover"
                    ? `${day}, turnover, not available for check-in`
                    : past
                      ? `${day}, not available`
                      : `${day}${isCheckIn ? ", check-in" : ""}${isCheckOut ? ", check-out" : ""}`
              }
              onClick={() => onDayClick(ymd)}
              className={cellClass}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.65rem] text-foreground/50">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-zinc-200 ring-1 ring-zinc-300/80" aria-hidden />
          Booked night
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-100 ring-1 ring-amber-200" aria-hidden />
          Checkout / turnover
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-100 ring-1 ring-blue-300" aria-hidden />
          Stay nights
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-50 ring-2 ring-blue-500" aria-hidden />
          Check-out day
        </span>
      </div>
    </div>
  );
}

/**
 * @param {{ slug: string }} props
 */
export default function ListingDetailClient({ slug }) {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState(null);
  const [blockedRanges, setBlockedRanges] = useState([]);
  const [availabilityErr, setAvailabilityErr] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [bookingBusy, setBookingBusy] = useState(false);
  const [bookingErr, setBookingErr] = useState(null);
  /** @type {null | { bookingId: string; totalAmount: string; createdAt: string | null; propertyTitle: string }} */
  const [bookingJustBooked, setBookingJustBooked] = useState(null);
  const [payBusy, setPayBusy] = useState(false);
  const [payErr, setPayErr] = useState(null);

  const loadProperty = useCallback(async () => {
    setLoading(true);
    setLoadErr(null);
    setBookingJustBooked(null);
    try {
      const body = await fetchPropertyBySlug(slug);
      const mapped = mapPropertyFromApi(body?.property);
      if (!mapped) {
        setLoadErr("Listing not found.");
        setHome(null);
        return;
      }
      setHome(mapped);
      const cap = mapped.maxGuests ?? 2;
      setGuestCount(Math.max(1, Math.min(2, cap)));
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        setLoadErr("Listing not found.");
      } else {
        setLoadErr(e instanceof ApiError ? e.message : "Could not load this listing.");
      }
      setHome(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const loadAvailability = useCallback(async () => {
    setAvailabilityErr(null);
    setAvailabilityLoading(true);
    const from = localYmd();
    const to = addDaysYmd(from, 500);
    try {
      const body = await fetchPropertyAvailability(slug, from, to);
      setBlockedRanges(Array.isArray(body?.ranges) ? body.ranges : []);
    } catch (e) {
      setBlockedRanges([]);
      setAvailabilityErr(e instanceof ApiError ? e.message : "Could not load availability.");
    } finally {
      setAvailabilityLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadProperty();
  }, [loadProperty]);

  useEffect(() => {
    setChildrenCount((c) => Math.min(c, guestCount));
  }, [guestCount]);

  useEffect(() => {
    if (!home) return;
    loadAvailability();
  }, [home, loadAvailability]);

  const amenities = normalizeAmenities(home?.amenities);
  const images = useMemo(() => {
    if (!home) return [];
    const xs = Array.isArray(home.images) && home.images.length ? home.images : [];
    return xs.length ? xs : home.coverImage ? [home.coverImage] : [];
  }, [home]);

  const dateConflict = useMemo(() => {
    if (!checkIn || !checkOut || checkIn >= checkOut) return null;
    if (!stayConflictsBlockedRanges(checkIn, checkOut, blockedRanges)) return null;
    for (const r of blockedRanges) {
      const ci = toYmd(r?.checkIn);
      const co = toYmd(r?.checkOut);
      if (!ci || !co) continue;
      if (checkIn === co) {
        return `You can’t check in on ${co} — another guest checks out that morning (turnover day). Choose a later check-in.`;
      }
      if (stayOverlapsBlock(checkIn, checkOut, ci, co)) {
        return `These dates overlap a stay (${ci} → ${co}).`;
      }
    }
    return "These dates conflict with existing bookings.";
  }, [checkIn, checkOut, blockedRanges]);

  const handleCalendarDayClick = useCallback(
    (ymd) => {
      const today = localYmd();
      setBookingErr(null);
      setBookingJustBooked(null);
      if (ymd < today) return;
      if (isNightBooked(ymd, blockedRanges)) return;

      if (!checkIn || (checkIn && checkOut)) {
        setCheckIn(ymd);
        setCheckOut("");
        return;
      }
      if (ymd <= checkIn) {
        setCheckIn(ymd);
        setCheckOut("");
        return;
      }
      if (stayConflictsBlockedRanges(checkIn, ymd, blockedRanges)) {
        setBookingErr(
          "That stay isn’t available — it overlaps a booked night or a checkout (turnover) day.",
        );
        return;
      }
      setCheckOut(ymd);
    },
    [blockedRanges, checkIn, checkOut],
  );

  const nights = checkIn && checkOut && checkOut > checkIn ? nightsBetween(checkIn, checkOut) : 0;
  const estimatedTotal = home && nights > 0 ? nights * home.pricePerNight : null;

  const paymentDeadline = useMemo(() => {
    const baseMs =
      typeof bookingJustBooked?.placedAtMs === "number" && Number.isFinite(bookingJustBooked.placedAtMs)
        ? bookingJustBooked.placedAtMs
        : bookingJustBooked?.createdAt
          ? new Date(bookingJustBooked.createdAt).getTime()
          : Number.NaN;
    const t = baseMs;
    if (Number.isNaN(t)) return null;
    return new Date(t + PAYMENT_DEADLINE_MINUTES * 60 * 1000);
  }, [bookingJustBooked?.createdAt, bookingJustBooked?.placedAtMs]);

  const payByTimeLabel = useMemo(() => {
    if (!paymentDeadline) return null;
    return paymentDeadline.toLocaleTimeString("en-AE", { hour: "2-digit", minute: "2-digit", hour12: false });
  }, [paymentDeadline]);

  const submitBooking = async (e) => {
    e.preventDefault();
    setBookingErr(null);
    setBookingJustBooked(null);
    setPayErr(null);
    if (!home) return;
    if (!checkIn || !checkOut) {
      setBookingErr("Choose check-in and check-out.");
      return;
    }
    if (checkIn >= checkOut) {
      setBookingErr("Check-out must be after check-in.");
      return;
    }
    if (dateConflict) {
      setBookingErr(dateConflict);
      return;
    }
    if (nights < 1) {
      setBookingErr("Stay must be at least one night.");
      return;
    }
    if (guestCount < 1 || guestCount > (home.maxGuests || 1)) {
      setBookingErr(`Guest count must be between 1 and ${home.maxGuests}.`);
      return;
    }
    const kids = Math.max(0, Math.floor(Number(childrenCount)) || 0);
    if (kids > guestCount) {
      setBookingErr("Children cannot exceed total guests.");
      return;
    }
    setBookingBusy(true);
    try {
      const placedAtMs = Date.now();
      const body = await createBooking({
        propertySlug: slug,
        checkIn,
        checkOut,
        guestCount: Number(guestCount),
        childrenCount: kids,
        petsAllowed: Boolean(petsAllowed),
      });
      const booked = body?.booking;
      if (booked && booked.id) {
        setPayErr(null);
        setBookingJustBooked({
          bookingId: String(booked.id),
          totalAmount: booked.totalAmount != null ? String(booked.totalAmount) : "",
          createdAt: typeof booked.createdAt === "string" ? booked.createdAt : null,
          placedAtMs,
          propertyTitle: String(home?.title || booked.property?.title || "Your stay"),
        });
      }
      // Clear dates so refreshed availability (which now includes this stay) doesn’t look like a “conflict” with your own booking.
      setCheckIn("");
      setCheckOut("");
      loadAvailability();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setBookingErr("Please sign in as a guest to book.");
      } else if (err instanceof ApiError && err.status === 409 && err.code === "DATES_UNAVAILABLE") {
        setBookingErr("Those dates just became unavailable. Refresh availability and try again.");
        loadAvailability();
      } else if (err instanceof ApiError) {
        setBookingErr(err.message);
      } else {
        setBookingErr("Booking failed.");
      }
    } finally {
      setBookingBusy(false);
    }
  };

  const handlePayNow = useCallback(async () => {
    if (!bookingJustBooked?.bookingId) return;
    setPayErr(null);
    setPayBusy(true);
    try {
      const res = await createStripeCheckoutSession({ bookingId: bookingJustBooked.bookingId });
      const url = typeof res?.url === "string" ? res.url : null;
      if (!url) {
        setPayErr("Could not start checkout. You can try again from My bookings.");
        setPayBusy(false);
        return;
      }
      window.location.assign(url);
    } catch (e) {
      if (e instanceof ApiError && e.code === "STRIPE_NOT_CONFIGURED") {
        setPayErr("Online payment is not available right now.");
      } else if (e instanceof ApiError) {
        setPayErr(e.message);
      } else {
        setPayErr("Something went wrong.");
      }
      setPayBusy(false);
    }
  }, [bookingJustBooked?.bookingId]);

  useEffect(() => {
    if (!bookingJustBooked) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setBookingJustBooked(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bookingJustBooked]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#f7f4ee] px-4">
        <p className="text-sm font-medium text-foreground/50">Loading listing…</p>
      </div>
    );
  }

  if (loadErr || !home) {
    return (
      <div className="min-h-screen bg-[#f7f4ee] px-4 py-20 text-center">
        <p className="font-hero-serif text-xl font-semibold text-foreground">{loadErr || "Not found"}</p>
        <Link href="/listings/" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
          Back to listings
        </Link>
      </div>
    );
  }

  const statPills = [
    { Icon: IconUsers, label: `${home.guests} guests` },
    { Icon: IconBed, label: `${home.bedrooms} bed${home.bedrooms === 1 ? "" : "s"}` },
    { Icon: IconBath, label: `${home.baths} bath${home.baths === 1 ? "" : "s"}` },
  ];

  const todayYmd = localYmd();

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <div className="border-b border-secondary/10 bg-[#fdfbf7]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 md:px-10 lg:px-14">
          <Link
            href="/listings/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground/75 transition hover:text-foreground"
          >
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-secondary/15 bg-white shadow-sm transition group-hover:border-primary/30 group-hover:bg-primary/5"
              aria-hidden
            >
              ←
            </span>
            All listings
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {home.type ? (
              <span className="rounded-full bg-primary/12 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">
                {home.type}
              </span>
            ) : null}
            <FavoriteHeartButton
              propertyId={home.id}
              initialFavorite={home.isFavorite}
              variant="panel"
              size="sm"
              className="shrink-0"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 md:px-10 lg:px-14 lg:pt-8">
        <div className="overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-38px_rgba(44,36,25,0.45)] ring-1 ring-secondary/10">
          <ListingGalleryClient title={home.title} images={images} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_min(380px,34%)] lg:gap-12 xl:gap-16">
          <div className="min-w-0 space-y-10">
            <header className="border-b border-secondary/12 pb-10">
              <h1 className="font-hero-serif text-[clamp(1.85rem,4vw,2.85rem)] font-semibold leading-[1.15] tracking-tight text-foreground">
                {home.title}
              </h1>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-foreground/65">
                <IconPin className="h-4 w-4 shrink-0 text-primary" />
                <span>{home.location}</span>
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {statPills.map(({ Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-2xl border border-secondary/12 bg-white px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </span>
                ))}
              </div>
            </header>

            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-primary">About this stay</h2>
              <p className="mt-4 max-w-3xl text-[1.05rem] leading-[1.75] text-foreground/75">{home.description}</p>
            </section>

            <section className="rounded-3xl border border-secondary/10 bg-white/80 p-6 sm:p-8">
              <h2 className="text-lg font-bold tracking-tight text-foreground">What this place offers</h2>
              {amenities.length ? (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {amenities.map((a, i) => (
                    <li
                      key={`${a}-${i}`}
                      className="flex items-start gap-3 rounded-2xl border border-transparent px-1 py-1.5 transition hover:border-secondary/10 hover:bg-[#fdfbf7]"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                        <IconCheck className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm font-medium leading-snug text-foreground/85">{a}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-foreground/55">Amenities for this listing will appear here.</p>
              )}
            </section>

            <section className="rounded-3xl border border-dashed border-secondary/20 bg-white/60 p-6 sm:p-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Availability</h2>
              <p className="mt-2 text-sm text-foreground/60">
                Booked nights appear in the calendar in the booking panel. The system prevents overlapping stays so the same nights can&apos;t be booked twice.
              </p>
            </section>

            <section className="rounded-3xl bg-linear-to-br from-primary/[0.07] via-transparent to-secondary/6 p-6 sm:p-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground/45">Highlights</h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-3 sm:gap-4">
                <div className="flex gap-3 sm:flex-col sm:gap-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-sm ring-1 ring-secondary/10">
                    <IconHome className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Entire place</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/60">Private space—just for your group.</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:flex-col sm:gap-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-sm ring-1 ring-secondary/10">
                    <IconShield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Clear listing</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/60">Structured details from the host.</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:flex-col sm:gap-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-sm ring-1 ring-secondary/10">
                    <IconPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Great location</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/60">
                      {(home.location || "").split(",")[0]} and nearby spots.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl border border-secondary/12 bg-white shadow-[0_28px_64px_-40px_rgba(44,36,25,0.55)]">
              <div className="h-1.5 bg-linear-to-r from-primary via-primary/80 to-secondary/90" aria-hidden />
              <div className="p-6 sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/45">Nightly from</p>
                <p className="mt-2 flex flex-wrap items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground tabular-nums">
                    {formatAED(home.pricePerNight)}
                  </span>
                  <span className="text-base font-semibold text-foreground/50">/ night</span>
                </p>
                <p className="mt-2 text-xs text-foreground/50">Taxes and fees calculated at checkout.</p>

                <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-[#fdfbf7] p-3 ring-1 ring-secondary/10">
                  <div className="text-center">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-foreground/40">Guests</p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-foreground">{home.guests}</p>
                  </div>
                  <div className="border-x border-secondary/15 text-center">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-foreground/40">Beds</p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-foreground">{home.bedrooms}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-foreground/40">Baths</p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-foreground">{home.baths}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-secondary/15 bg-[#fdfbf7] p-4 ring-1 ring-secondary/10">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-foreground/45">Calendar</p>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/50">
                    Tap check-in, then check-out. Booked nights and turnover days can’t be selected. Your stay range is blue; the outlined day is check-out (departure morning).
                  </p>
                  <div className="mt-3">
                    <BookingCalendar
                      todayYmd={todayYmd}
                      blockedRanges={blockedRanges}
                      loading={availabilityLoading}
                      error={availabilityErr}
                      onRetry={loadAvailability}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onDayClick={handleCalendarDayClick}
                    />
                  </div>

                  <div className="mt-4 rounded-2xl border border-blue-200/90 bg-linear-to-br from-blue-50/95 to-white px-4 py-3 ring-1 ring-blue-100/80">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-blue-900/55">Your dates</p>
                    {!checkIn ? (
                      <p className="mt-2 text-sm text-foreground/60">Tap a date to choose check-in, then another for check-out.</p>
                    ) : (
                      <div className="mt-2 space-y-3">
                        <div>
                          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-foreground/45">Check-in</p>
                          <p className="mt-0.5 text-base font-semibold leading-snug text-foreground">
                            {formatStayDateLabel(checkIn)}
                          </p>
                          <p className="mt-1 text-xs text-foreground/50">
                            Check-in from {home.checkInTime || "3:00 PM"}
                          </p>
                        </div>
                        {checkOut ? (
                          <>
                            <div>
                              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-foreground/45">Check-out</p>
                              <p className="mt-0.5 text-base font-semibold leading-snug text-foreground">
                                {formatStayDateLabel(checkOut)}
                              </p>
                              <p className="mt-1 text-xs text-foreground/50">Departure morning (leave by this date)</p>
                            </div>
                            {nights > 0 ? (
                              <div className="border-t border-blue-200/70 pt-3">
                                <p className="text-xl font-bold tabular-nums text-blue-950">
                                  {nights} {nights === 1 ? "night" : "nights"}
                                </p>
                                <p className="mt-1 text-sm text-foreground/70">
                                  <span className="font-semibold text-foreground">{nights}</span>{" "}
                                  calendar {nights === 1 ? "day" : "days"} from your check-in date to your check-out date (same as nights for this stay)
                                </p>
                              </div>
                            ) : null}
                          </>
                        ) : (
                          <p className="text-xs font-medium text-blue-900/75">Tap a second date on the calendar to set check-out.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={submitBooking} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-[0.65rem] font-bold uppercase tracking-[0.12em] text-foreground/45">
                      Guests
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={home.maxGuests}
                      value={guestCount}
                      onChange={(e) => {
                        setBookingErr(null);
                        setGuestCount(Number(e.target.value));
                      }}
                      className="mt-1 w-full rounded-xl border border-secondary/15 bg-white px-3 py-2.5 text-sm font-medium text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-bold uppercase tracking-[0.12em] text-foreground/45">
                      Children
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={home.maxGuests}
                      value={childrenCount}
                      onChange={(e) => {
                        setBookingErr(null);
                        setChildrenCount(Number(e.target.value));
                      }}
                      className="mt-1 w-full rounded-xl border border-secondary/15 bg-white px-3 py-2.5 text-sm font-medium text-foreground"
                    />
                    <p className="mt-1 text-xs text-foreground/45">Number of children (included in guests above).</p>
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-secondary/12 bg-white px-3 py-3 text-sm">
                    <input
                      type="checkbox"
                      checked={petsAllowed}
                      onChange={(e) => {
                        setBookingErr(null);
                        setPetsAllowed(e.target.checked);
                      }}
                      className="mt-0.5 size-4 shrink-0 rounded border-secondary/30 text-primary focus:ring-primary/30"
                    />
                    <span>
                      <span className="font-semibold text-foreground">Pets allowed</span>
                      <span className="mt-0.5 block text-xs text-foreground/50">
                        I am traveling with a pet (subject to the host&apos;s rules).
                      </span>
                    </span>
                  </label>
                  {estimatedTotal != null && nights > 0 ? (
                    <p className="text-sm text-foreground/65">
                      <span className="font-semibold text-foreground">{nights}</span> nights · estimated{" "}
                      <span className="font-bold text-primary">{formatAED(estimatedTotal)}</span>
                      <span className="text-foreground/45"> (stay subtotal)</span>
                    </p>
                  ) : null}
                  {dateConflict ? <p className="text-sm font-medium text-red-800">{dateConflict}</p> : null}
                  {bookingErr ? <p className="text-sm text-red-800">{bookingErr}</p> : null}
                  <button
                    type="submit"
                    disabled={bookingBusy || Boolean(dateConflict) || availabilityLoading}
                    className="flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 ring-1 ring-primary/25 transition hover:bg-primary/92 enabled:active:scale-[0.99] disabled:opacity-50"
                  >
                    {bookingBusy ? "Booking…" : availabilityLoading ? "Loading availability…" : "Book now"}
                  </button>
                </form>
                <p className="mt-3 text-center text-xs font-medium text-foreground/50">
                  After you book, pay on Stripe within {PAYMENT_DEADLINE_MINUTES} minutes — otherwise the hold is
                  released automatically.
                </p>

                <div className="mt-6 border-t border-secondary/10 pt-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/40">Good to know</p>
                  <ul className="mt-3 space-y-2.5 text-sm text-foreground/65">
                    <li className="flex gap-2">
                      <span className="text-primary" aria-hidden>
                        ·
                      </span>
                      The system rejects overlapping stays to prevent double booking.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary" aria-hidden>
                        ·
                      </span>
                      Sign in as a guest account to complete a booking.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary" aria-hidden>
                        ·
                      </span>
                      House rules shown before you pay.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary" aria-hidden>
                        ·
                      </span>
                      Unpaid bookings are cancelled automatically after {PAYMENT_DEADLINE_MINUTES} minutes so the dates
                      reopen.
                    </li>
                    {refundPolicyListingBullets.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="text-primary" aria-hidden>
                          ·
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-foreground/50">
                    Full details:{" "}
                    <Link href="/policy/" className="font-semibold text-primary underline-offset-2 hover:underline">
                      Refund & cancellation policy
                    </Link>
                    .
                  </p>
                </div>

                <Link href="/contact/" className="mt-6 block text-center text-sm font-semibold text-primary hover:underline">
                  Need help choosing dates?
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {bookingJustBooked ? (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
          role="presentation"
          onClick={() => setBookingJustBooked(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-success-title"
            className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-secondary/15 bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setBookingJustBooked(null)}
              className="absolute right-4 top-4 rounded-full border border-secondary/15 bg-white px-2.5 py-1 text-xs font-semibold text-foreground/70 transition hover:bg-neutral/40"
            >
              Close
            </button>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">Success</p>
            <h2 id="booking-success-title" className="font-hero-serif mt-2 pr-10 text-2xl font-semibold leading-tight text-foreground">
              Booking successful
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              We&apos;ve held your dates. Complete payment on Stripe to confirm. If you don&apos;t pay within{" "}
              <strong>{PAYMENT_DEADLINE_MINUTES} minutes</strong> of placing this booking, it will be{" "}
              <strong>cancelled automatically</strong> and the nights will go back on sale.
            </p>
            {payByTimeLabel ? (
              <p className="mt-3 rounded-xl border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-sm font-medium text-amber-950">
                Pay before <span className="tabular-nums">{payByTimeLabel}</span> (your local time) to keep this
                reservation.
              </p>
            ) : null}
            <div className="mt-5 rounded-2xl border border-secondary/12 bg-[#fdfbf7] px-4 py-4 text-sm">
              <p className="font-semibold text-foreground">{bookingJustBooked.propertyTitle}</p>
              <p className="mt-2 text-foreground/65">
                Total due (from our server):{" "}
                <span className="text-base font-bold text-foreground">{formatAEDAmount(bookingJustBooked.totalAmount)}</span>
              </p>
            </div>
            {payErr ? (
              <p className="mt-3 text-sm font-medium text-red-800" role="alert">
                {payErr}
              </p>
            ) : null}
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900/90">
              <span aria-hidden>🔒</span>
              Secure payment powered by Stripe
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                disabled={payBusy}
                onClick={handlePayNow}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary/90 disabled:opacity-60"
              >
                {payBusy ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Redirecting…
                  </span>
                ) : (
                  "Pay now"
                )}
              </button>
              <Link
                href="/bookings/"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-secondary/25 px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-neutral/40"
              >
                My bookings
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
