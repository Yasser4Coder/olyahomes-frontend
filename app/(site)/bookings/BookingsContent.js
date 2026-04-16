"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import GuestBookingsList from "@/components/GuestBookingsList";
import { ApiError, fetchMe, fetchMyBookings } from "@/lib/api";
import { getListingBySlug } from "@/lib/sampleListings";

export default function BookingsContent() {
  const searchParams = useSearchParams();
  const listingSlug = searchParams.get("listing");
  const listing = listingSlug ? getListingBySlug(listingSlug) : null;

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  const refreshBookings = useCallback(async () => {
    try {
      const b = await fetchMyBookings();
      setBookings(Array.isArray(b?.bookings) ? b.bookings : []);
      setBookingsError(null);
    } catch (e) {
      if (e instanceof ApiError) {
        setBookingsError(e.message);
        setBookings([]);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setBookingsError(null);
      try {
        const me = await fetchMe();
        if (cancelled) return;
        if (!me?.user) {
          setUser(null);
          setBookings([]);
          return;
        }
        setUser(me.user);
        try {
          await refreshBookings();
        } catch {
          /* refreshBookings sets error */
        }
      } catch (e) {
        if (!cancelled && e instanceof ApiError && e.status === 401) {
          setUser(null);
          setBookings([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshBookings]);

  if (loading) {
    return (
      <div className="bg-[#fdfbf7] min-h-[40vh]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 md:px-10 lg:px-14">
          <div className="h-40 animate-pulse rounded-3xl bg-white/60" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#fdfbf7]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:px-10 lg:px-14">
          <div className="mx-auto max-w-lg rounded-3xl border border-secondary/15 bg-white p-10 text-center shadow-[0_20px_50px_-36px_rgba(44,36,25,0.2)]">
            <h1 className="font-hero-serif text-2xl font-semibold text-foreground">Sign in to see your bookings</h1>
            <p className="mt-3 text-foreground/65">Your stays as a guest appear here after you log in.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/login/"
                className="inline-flex justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 ring-1 ring-primary/15 transition hover:bg-primary/90"
              >
                Log in
              </Link>
              <Link
                href="/signup/"
                className="inline-flex justify-center rounded-full border border-secondary/25 bg-white px-8 py-3 text-sm font-semibold text-foreground transition hover:bg-neutral/60"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfbf7]">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 md:px-10 lg:px-14">
        <div className="relative overflow-hidden rounded-3xl border border-secondary/15 bg-white px-6 py-8 shadow-[0_20px_46px_-34px_rgba(44,36,25,0.28)] sm:px-10 sm:py-10">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl"
            aria-hidden
          />

          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-primary">Your stays</p>
          <h1 className="font-hero-serif mt-3 text-[clamp(1.85rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-foreground">
            My bookings
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/60 sm:text-[1.05rem]">
            Every trip you have booked as a guest—upcoming and past—with status and totals in AED.
          </p>
        </div>

        {listing ? (
          <div className="mt-8 rounded-2xl border border-secondary/15 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-secondary">Listing context</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{listing.title}</p>
            <p className="text-sm text-foreground/65">{listing.location}</p>
            <p className="mt-3 text-sm text-foreground/55">
              Slug from URL:{" "}
              <code className="rounded bg-neutral-dark px-1.5 py-0.5 text-xs">{listingSlug}</code>
            </p>
          </div>
        ) : null}

        <section className="mt-10" aria-labelledby="bookings-page-heading">
          <h2 id="bookings-page-heading" className="sr-only">
            All bookings
          </h2>
          <GuestBookingsList bookings={bookings} error={bookingsError} onBookingsRefresh={refreshBookings} />
        </section>

        <p className="mt-10 text-center">
          <Link
            href="/account/"
            className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
          >
            Back to account
          </Link>
        </p>
      </div>
    </div>
  );
}
