"use client";

import Link from "next/link";
import { useState } from "react";
import { ApiError, submitContactMessage } from "@/lib/api";

function IconSpark({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconPaperPlane({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const trustChips = [
  { label: "Real humans", sub: "No ticket maze" },
  { label: "UAE-based", sub: "Local context" },
  { label: "Fast replies", sub: "Usually under 24h" },
];

export default function HomeContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setOk(false);
    setBusy(true);
    try {
      await submitContactMessage({
        kind: "guest_support",
        name: String(name).trim(),
        email: String(email).trim(),
        message: String(message).trim(),
        subject: "Homepage contact form",
      });
      setOk(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Could not send message.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:py-28"
      aria-labelledby="home-contact-heading"
    >
      {/* Ambient wash */}
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/9 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-secondary/[0.14] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(90%,48rem)] -translate-x-1/2 bg-linear-to-r from-transparent via-primary/25 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-4xl border border-secondary/10 bg-linear-to-br from-white/95 via-neutral to-[#f3efe8] p-1 shadow-[0_28px_80px_-32px_rgba(44,36,25,0.35)] sm:rounded-[2.25rem]">
          <div className="relative grid gap-0 overflow-hidden rounded-[1.85rem] bg-neutral/40 lg:grid-cols-12">
            {/* Decorative corner */}
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-primary/10 opacity-60"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-12 -left-10 h-48 w-48 rounded-full border border-secondary/15 opacity-50"
              aria-hidden
            />

            {/* Copy column */}
            <div className="relative flex flex-col justify-between border-b border-secondary/10 px-6 py-10 sm:px-10 lg:col-span-5 lg:border-b-0 lg:border-r lg:py-12 lg:pl-10 lg:pr-8 xl:pl-12">
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary">
                    <IconSpark className="h-3.5 w-3.5" />
                    Say hello
                  </span>
                </div>
                <h2
                  id="home-contact-heading"
                  className="font-hero-serif mt-6 text-[clamp(1.85rem,4vw,2.75rem)] font-semibold leading-[1.12] tracking-tight text-foreground"
                >
                  Tell us what
                  <span className="block text-primary">you’re dreaming up.</span>
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/68 sm:text-[1.05rem]">
                  A last-minute stay, a listing question, or something weird about a
                  booking—we read every message and route it to someone who can
                  actually help.
                </p>
              </div>

              <ul className="mt-10 space-y-3 border-t border-secondary/10 pt-8">
                {trustChips.map(({ label, sub }) => (
                  <li
                    key={label}
                    className="flex items-baseline justify-between gap-4 text-sm sm:text-[0.9375rem]"
                  >
                    <span className="font-semibold text-foreground">{label}</span>
                    <span className="text-right text-foreground/50">{sub}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-sm text-foreground/50">
                Want the long form?{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-primary underline decoration-primary/30 decoration-2 underline-offset-[5px] transition hover:decoration-primary"
                >
                  Full contact page
                </Link>
              </p>
            </div>

            {/* Form column */}
            <div className="relative bg-white/85 px-6 py-10 backdrop-blur-[2px] sm:px-10 lg:col-span-7 lg:py-12 lg:pr-10 xl:pr-12">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Write to us
                  </p>
                  <p className="mt-1 text-xs text-foreground/50">
                    A few fields—then we take it from here.
                  </p>
                </div>
                <div
                  className="hidden shrink-0 rounded-2xl border border-secondary/15 bg-neutral/80 p-3 text-secondary sm:block"
                  aria-hidden
                >
                  <IconPaperPlane className="h-8 w-8" />
                </div>
              </div>

              {ok ? (
                <div className="mb-5 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-950">
                  <p className="font-semibold">Message sent.</p>
                  <p className="mt-1 text-emerald-950/80">Our team will read it and reply as soon as possible.</p>
                </div>
              ) : null}
              {err ? (
                <div className="mb-5 rounded-2xl border border-red-200/70 bg-red-50/70 px-4 py-3 text-sm text-red-900" role="alert">
                  {err}
                </div>
              ) : null}

              <form className="space-y-5" onSubmit={onSubmit} aria-busy={busy}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="home-contact-name"
                      className="text-xs font-semibold uppercase tracking-wider text-foreground/70"
                    >
                      Name
                    </label>
                    <input
                      id="home-contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={busy}
                      className="mt-2 w-full rounded-xl border border-secondary/20 bg-neutral px-4 py-3 text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/25"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="home-contact-email"
                      className="text-xs font-semibold uppercase tracking-wider text-foreground/70"
                    >
                      Email
                    </label>
                    <input
                      id="home-contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={busy}
                      className="mt-2 w-full rounded-xl border border-secondary/20 bg-neutral px-4 py-3 text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/25"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="home-contact-message"
                    className="text-xs font-semibold uppercase tracking-wider text-foreground/70"
                  >
                    Message
                  </label>
                  <textarea
                    id="home-contact-message"
                    name="message"
                    rows={4}
                    placeholder="What’s on your mind?"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={busy}
                    className="mt-2 w-full resize-y rounded-xl border border-secondary/20 bg-neutral px-4 py-3 text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={busy}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:opacity-60 sm:w-auto"
                  >
                    {busy ? "Sending..." : "Send message"}
                    <span className="inline-block transition group-hover:translate-x-0.5">
                      →
                    </span>
                  </button>
                  <p className="text-center text-[0.7rem] leading-snug text-foreground/45 sm:max-w-48 sm:text-right">
                    We’ll never sell your email. Unsubscribe anytime.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
