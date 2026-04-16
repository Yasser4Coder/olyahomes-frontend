"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useMemo, useState } from "react";
import GoogleAuthButton, { AuthEmailDivider } from "@/components/GoogleAuthButton";
import { APP_DISPLAY_NAME } from "@/lib/brand";
import { ApiError, apiFetch } from "@/lib/api";

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

function oauthBannerMessage(code) {
  if (code === "google_denied" || code === "google_auth_failed") {
    return "Google sign-in was cancelled or could not be completed. Try again or use email.";
  }
  return null;
}

export default function LoginForm() {
  const id = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const oauthMsg = useMemo(() => oauthBannerMessage(searchParams.get("error")), [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    setSubmitting(true);
    try {
      await apiFetch("/api/v1/auth/login", {
        method: "POST",
        json: { email, password },
      });
      router.push("/account/");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="rounded-3xl border border-secondary/12 bg-white/95 p-6 shadow-[0_24px_60px_-28px_rgb(44_36_25/0.12)] ring-1 ring-black/3 backdrop-blur-sm sm:p-8"
      noValidate
      onSubmit={handleSubmit}
    >
      {oauthMsg ? (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-amber-200/80 bg-amber-50/90 px-3 py-2.5 text-sm text-amber-950"
        >
          {oauthMsg}
        </div>
      ) : null}

      <GoogleAuthButton mode="login" />
      <AuthEmailDivider />

      <div className="mt-5 space-y-5">
        <div>
          <label htmlFor={`${id}-email`} className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-xl border border-secondary/20 bg-neutral px-3.5 py-3 text-[15px] text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/25"
          />
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor={`${id}-password`} className="text-sm font-medium text-foreground">
              Password
            </label>
            <Link
              href="/contact/"
              className="text-xs font-semibold text-primary hover:text-primary/80"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <input
              id={`${id}-password`}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-secondary/20 bg-neutral py-3 pl-3.5 pr-12 text-[15px] text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/25"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-foreground/45 transition hover:bg-secondary/10 hover:text-foreground/70"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <IconEyeOff className="size-5" />
              ) : (
                <IconEye className="size-5" />
              )}
            </button>
          </div>
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground/75">
          <input
            type="checkbox"
            name="remember"
            className="mt-0.5 size-4 rounded border-secondary/30 text-primary focus:ring-primary/30"
          />
          <span>Keep me signed in on this device</span>
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-red-800/90">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-7 w-full rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-white shadow-md shadow-primary/20 ring-1 ring-primary/15 transition hover:bg-primary/92 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Continue"}
      </button>

      <p className="mt-6 text-center text-sm text-foreground/60">
        New to {APP_DISPLAY_NAME}?{" "}
        <Link
          href="/signup/"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
