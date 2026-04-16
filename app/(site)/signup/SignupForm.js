"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import GoogleAuthButton, { AuthEmailDivider } from "@/components/GoogleAuthButton";
import SignupPhoneField from "@/components/SignupPhoneField";
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

export default function SignupForm() {
  const id = useId();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [phone, setPhone] = useState(undefined);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const score = useMemo(() => passwordScore(password), [password]);
  const strength = strengthLabel(score);
  const confirmMismatch =
    confirm.length > 0 && password.length > 0 && confirm !== password;
  const phoneOk = Boolean(phone && isValidPhoneNumber(String(phone)));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!agreed || confirmMismatch || !phoneOk) return;
    setError(null);
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    setSubmitting(true);
    try {
      await apiFetch("/api/v1/auth/register", {
        method: "POST",
        json: {
          fullName,
          email,
          password,
          phone: String(phone),
        },
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
      <GoogleAuthButton mode="signup" />
      <AuthEmailDivider />

      <div className="mt-5 space-y-5">
        <div>
          <label htmlFor={`${id}-name`} className="text-sm font-medium text-foreground">
            Full name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="As on your ID or passport"
            className="mt-1.5 w-full rounded-xl border border-secondary/20 bg-neutral px-3.5 py-3 text-[15px] text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/25"
          />
        </div>
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
          <label htmlFor={`${id}-phone`} className="text-sm font-medium text-foreground">
            Phone number
          </label>
          <SignupPhoneField id={`${id}-phone`} value={phone} onChange={setPhone} />
          <input type="hidden" name="phoneE164" value={phone ?? ""} readOnly />
          {phone && !phoneOk ? (
            <p className="mt-1.5 text-xs font-medium text-red-700/90">
              Enter a valid number for this country.
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor={`${id}-password`} className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative mt-1.5">
            <input
              id={`${id}-password`}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <div className="mt-2 flex items-center gap-3">
            <div
              className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-dark"
              role="presentation"
            >
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
            {password.length > 0 ? (
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
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={confirmMismatch}
            className={`mt-1.5 w-full rounded-xl border bg-neutral px-3.5 py-3 text-[15px] text-foreground outline-none transition focus:ring-2 ${
              confirmMismatch
                ? "border-red-400/80 focus:border-red-400 focus:ring-red-200"
                : "border-secondary/20 focus:border-primary/40 focus:ring-primary/25"
            }`}
          />
          {confirmMismatch ? (
            <p className="mt-1.5 text-xs font-medium text-red-700/90">Passwords do not match</p>
          ) : null}
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground/75">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
            className="mt-0.5 size-4 rounded border-secondary/30 text-primary focus:ring-primary/30"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/terms/"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              Terms of use
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy/"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              Privacy policy
            </Link>
            .
          </span>
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-red-800/90">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!agreed || confirmMismatch || !phoneOk || submitting}
        className="mt-7 w-full rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-white shadow-md shadow-primary/20 ring-1 ring-primary/15 transition hover:bg-primary/92 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
      >
        {submitting ? "Creating account…" : "Create account"}
      </button>

      <p className="mt-6 text-center text-sm text-foreground/60">
        Already registered?{" "}
        <Link
          href="/login/"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
