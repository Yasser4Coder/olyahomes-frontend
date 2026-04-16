"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import GuestBookingsList from "@/components/GuestBookingsList";
import { ApiError, fetchMe, fetchMyBookings, setAccountPassword } from "@/lib/api";

function IconEye({ className }) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff({ className }) {
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
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.017 5.444 1 1 0 0 1 0 .8 10.748 10.748 0 0 1-1.704 2.334" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.8 10.75 10.75 0 0 1 4.65-5.215" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

function strengthLabel(score) {
  if (score <= 0) return { text: "", className: "" };
  if (score === 1) return { text: "Weak", className: "text-red-700/90" };
  if (score === 2) return { text: "Fair", className: "text-amber-800/90" };
  if (score === 3) return { text: "Good", className: "text-secondary" };
  return { text: "Strong", className: "text-emerald-800/90" };
}

function passwordScore(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (pw.length >= 12) s += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 1;
  if (/\d/.test(pw)) s += 1;
  if (/[^a-zA-Z0-9]/.test(pw)) s += 1;
  return Math.min(4, s);
}

const signupInputClass =
  "w-full rounded-xl border border-secondary/20 bg-neutral px-3.5 py-3 text-[15px] text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/25";

function canAccessDashboard(role) {
  return role === "admin" || role === "owner";
}

function IconChevronDown({ className }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function AccountPasswordSection({ user, onUserUpdated }) {
  const id = useId();
  const hasPassword = Boolean(user?.hasPassword);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(false);

  const score = useMemo(() => passwordScore(newPassword), [newPassword]);
  const strength = strengthLabel(score);
  const confirmMismatch =
    confirmPassword.length > 0 && newPassword.length > 0 && confirmPassword !== newPassword;

  const clearFeedback = () => {
    setErr(null);
    setOk(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setOk(false);
    if (newPassword.length < 8) {
      setErr("Use at least 8 characters for your password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }
    if (hasPassword && !currentPassword.trim()) {
      setErr("Enter your current password.");
      return;
    }
    setBusy(true);
    try {
      const body = await setAccountPassword({
        newPassword,
        ...(hasPassword ? { currentPassword } : {}),
      });
      if (body?.user) {
        onUserUpdated(body.user);
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOk(true);
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Could not update password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-secondary/12 bg-white shadow-[0_16px_44px_-32px_rgba(44,36,25,0.22)]">
      <button
        type="button"
        onClick={() => setPanelOpen((o) => !o)}
        aria-expanded={panelOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition hover:bg-neutral/40 sm:px-8 sm:py-5"
      >
        <div className="min-w-0">
          <h2 className="font-hero-serif text-lg font-semibold text-foreground sm:text-xl">Password</h2>
          <p className="mt-1 text-sm text-foreground/55">
            {hasPassword
              ? "Email sign-in & Google — tap to change password."
              : "Add email & password sign-in (Google still works) — tap to expand."}
          </p>
        </div>
        <IconChevronDown
          className={`size-6 shrink-0 text-foreground/40 transition-transform duration-200 ${panelOpen ? "rotate-180" : ""}`}
        />
      </button>
      {panelOpen ? (
        <div className="border-t border-secondary/10 px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
          <p className="text-sm text-foreground/60">
            {hasPassword
              ? "Change your password for email sign-in. Google sign-in still works as usual."
              : "You signed in with Google and don’t have a password yet. Add one to sign in with email and password anytime — Google sign-in will still work."}
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-5">
        {hasPassword ? (
          <div>
            <label htmlFor={`${id}-current`} className="text-sm font-medium text-foreground">
              Current password
            </label>
            <input
              id={`${id}-current`}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => {
                clearFeedback();
                setCurrentPassword(e.target.value);
              }}
              className={`mt-1.5 ${signupInputClass}`}
            />
          </div>
        ) : null}
        <div>
          <label htmlFor={`${id}-new`} className="text-sm font-medium text-foreground">
            {hasPassword ? "New password" : "Password"}
          </label>
          <div className="relative mt-1.5">
            <input
              id={`${id}-new`}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={8}
              value={newPassword}
              onChange={(e) => {
                clearFeedback();
                setNewPassword(e.target.value);
              }}
              className="w-full rounded-xl border border-secondary/20 bg-neutral py-3 pl-3.5 pr-12 text-[15px] text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/25"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-foreground/45 transition hover:bg-secondary/10 hover:text-foreground/70"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IconEyeOff className="size-5" /> : <IconEye className="size-5" />}
            </button>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-dark" role="presentation">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  score === 0
                    ? "w-0 bg-transparent"
                    : score === 1
                      ? "w-1/4 bg-red-500/80"
                      : score === 2
                        ? "w-2/4 bg-amber-500/85"
                        : score === 3
                          ? "w-3/4 bg-secondary"
                          : "w-full bg-emerald-600/85"
                }`}
              />
            </div>
            {newPassword.length > 0 ? (
              <span className={`text-xs font-semibold ${strength.className}`}>
                {strength.text || "Keep typing…"}
              </span>
            ) : (
              <span className="text-xs text-foreground/45">8+ characters</span>
            )}
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-confirm`} className="text-sm font-medium text-foreground">
            Confirm password
          </label>
          <input
            id={`${id}-confirm`}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              clearFeedback();
              setConfirmPassword(e.target.value);
            }}
            aria-invalid={confirmMismatch}
            className={`mt-1.5 ${signupInputClass} ${
              confirmMismatch ? "border-red-400/80 focus:border-red-400 focus:ring-red-200" : ""
            }`}
          />
          {confirmMismatch ? (
            <p className="mt-1.5 text-xs font-medium text-red-700/90">Passwords do not match</p>
          ) : null}
        </div>
        {err ? (
          <p role="alert" className="text-sm font-medium text-red-800/90">
            {err}
          </p>
        ) : null}
        {ok ? <p className="text-sm font-medium text-emerald-800">Password saved.</p> : null}
        <button
          type="submit"
          disabled={busy || newPassword !== confirmPassword}
          className="w-full rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-white shadow-md shadow-primary/20 ring-1 ring-primary/15 transition hover:bg-primary/92 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {busy ? "Saving…" : hasPassword ? "Update password" : "Save password"}
        </button>
      </form>
        </div>
      ) : null}
    </div>
  );
}

export default function AccountPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  useEffect(() => {
    if (searchParams.get("signed_in") === "1") {
      router.replace("/account/", { scroll: false });
    }
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="bg-[#fdfbf7] min-h-[50vh]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:px-10 lg:px-14">
          <div className="h-48 animate-pulse rounded-3xl bg-white/60" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#fdfbf7]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-10 lg:px-14">
          <div className="mx-auto max-w-lg rounded-3xl border border-secondary/15 bg-white p-10 text-center shadow-[0_20px_50px_-36px_rgba(44,36,25,0.2)]">
            <h1 className="font-hero-serif text-2xl font-semibold text-foreground">Sign in to view your account</h1>
            <p className="mt-3 text-foreground/65">
              Bookings and profile details appear here once you are logged in.
            </p>
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
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 md:px-10 lg:px-14">
        <div className="relative overflow-hidden rounded-3xl border border-secondary/15 bg-white px-6 py-8 shadow-[0_20px_46px_-34px_rgba(44,36,25,0.28)] sm:px-10 sm:py-10">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl"
            aria-hidden
          />

          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-primary">Your space</p>
          <h1 className="font-hero-serif mt-3 text-[clamp(1.85rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-foreground">
            Hello, {user.fullName?.split(/\s+/)[0] || "there"}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/60 sm:text-[1.05rem]">
            Manage your profile, review past and upcoming stays, and jump back to homes you love.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-4">
            <div className="sticky top-[calc(var(--site-header-offset,4rem)+1.5rem)] overflow-hidden rounded-2xl border border-secondary/12 bg-white shadow-[0_16px_44px_-32px_rgba(44,36,25,0.22)]">
              <div className="bg-linear-to-br from-primary/9 via-transparent to-secondary/6 px-6 py-8">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-lg shadow-primary/25 ring-4 ring-white">
                  {(user.fullName || user.email || "?").trim().charAt(0).toUpperCase()}
                </div>
                <p className="mt-5 text-center font-hero-serif text-xl font-semibold text-foreground">
                  {user.fullName}
                </p>
                <p className="mt-1 text-center text-sm text-foreground/60">{user.email}</p>
                {user.phone ? (
                  <p className="mt-2 text-center text-sm text-foreground/55">{user.phone}</p>
                ) : null}
                <p className="mt-4 text-center text-[0.65rem] font-bold uppercase tracking-[0.18em] text-foreground/40">
                  {user.role}
                </p>
              </div>
              <div className="space-y-3 border-t border-secondary/10 px-6 py-4">
                {canAccessDashboard(user.role) ? (
                  <Link
                    href="/dashboard/"
                    className="flex items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary/10 py-3 text-sm font-semibold text-primary transition hover:bg-primary/15"
                  >
                    Dashboard
                    <span aria-hidden>→</span>
                  </Link>
                ) : null}
                <Link
                  href="/listings/"
                  className="flex items-center justify-center gap-2 rounded-xl border border-secondary/20 bg-neutral/40 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-primary/6 hover:text-primary"
                >
                  Browse homes
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8 space-y-10" aria-labelledby="booking-history-heading">
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2
                    id="booking-history-heading"
                    className="font-hero-serif text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                  >
                    Booking history
                  </h2>
                  <p className="mt-1 text-sm text-foreground/55">
                    Stays you have booked as a guest, newest first.
                  </p>
                </div>
                <Link
                  href="/bookings/"
                  className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
                >
                  Open full bookings view
                </Link>
              </div>

              <GuestBookingsList className="mt-6" bookings={bookings} error={bookingsError} onBookingsRefresh={refreshBookings} />
            </div>

            <AccountPasswordSection user={user} onUserUpdated={setUser} />
          </section>
        </div>
      </div>
    </div>
  );
}
