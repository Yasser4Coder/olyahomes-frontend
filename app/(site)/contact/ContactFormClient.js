"use client";

import { useMemo, useState } from "react";
import { ApiError, submitContactMessage } from "@/lib/api";
import { APP_DISPLAY_NAME } from "@/lib/brand";

const KINDS = [
  { id: "guest_support", label: "Guest support" },
  { id: "corporate", label: "Corporate / partnerships" },
];

function clean(s) {
  return String(s ?? "").trim();
}

export default function ContactFormClient() {
  const [kind, setKind] = useState("guest_support");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(false);

  const helper = useMemo(() => {
    if (kind === "corporate") {
      return `Tell us about the partnership you’re exploring with ${APP_DISPLAY_NAME}.`;
    }
    return "Share your booking reference (if you have one) so we can help faster.";
  }, [kind]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setOk(false);

    const payload = {
      kind,
      name: clean(name),
      email: clean(email),
      phone: clean(phone) || undefined,
      bookingRef: kind === "guest_support" ? clean(bookingRef) || undefined : undefined,
      company: kind === "corporate" ? clean(company) || undefined : clean(company) || undefined,
      subject: clean(subject) || undefined,
      message: clean(message),
    };

    setBusy(true);
    try {
      await submitContactMessage(payload);
      setOk(true);
      setName("");
      setEmail("");
      setPhone("");
      setBookingRef("");
      setCompany("");
      setSubject("");
      setMessage("");
    } catch (e2) {
      if (e2 instanceof ApiError) setErr(e2.message);
      else setErr("Could not send message.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-secondary/12 bg-white p-6 shadow-[0_28px_64px_-36px_rgba(44,36,25,0.55)] sm:p-8">
      <h2 className="font-hero-serif text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem]">
        Send a message
      </h2>
      <p className="mt-2 text-sm text-foreground/60">{helper}</p>

      {ok ? (
        <div className="mt-6 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-950">
          <p className="font-semibold">Message sent.</p>
          <p className="mt-1 text-emerald-950/80">Our team will reply as soon as possible.</p>
        </div>
      ) : null}
      {err ? (
        <div
          className="mt-6 rounded-2xl border border-red-200/70 bg-red-50/70 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {err}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-8 space-y-4" aria-busy={busy}>
        <div>
          <label className="block text-sm font-medium text-foreground" htmlFor="contact-kind">
            I’m contacting about
          </label>
          <select
            id="contact-kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            disabled={busy}
            className="mt-1.5 w-full appearance-none rounded-xl border border-secondary/20 bg-[#fdfbf7] px-4 py-3 text-sm text-foreground outline-none ring-primary focus:ring-2"
          >
            {KINDS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-foreground">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={busy}
              autoComplete="name"
              placeholder="Your name"
              required
              className="mt-1.5 w-full rounded-xl border border-secondary/20 bg-[#fdfbf7] px-4 py-3 text-sm text-foreground outline-none ring-primary focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              autoComplete="email"
              placeholder="you@email.com"
              required
              className="mt-1.5 w-full rounded-xl border border-secondary/20 bg-[#fdfbf7] px-4 py-3 text-sm text-foreground outline-none ring-primary focus:ring-2"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground">
              Phone <span className="font-normal text-foreground/45">(optional)</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={busy}
              placeholder="+971…"
              className="mt-1.5 w-full rounded-xl border border-secondary/20 bg-[#fdfbf7] px-4 py-3 text-sm text-foreground outline-none ring-primary focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="contact-company" className="block text-sm font-medium text-foreground">
              Company <span className="font-normal text-foreground/45">(optional)</span>
            </label>
            <input
              id="contact-company"
              name="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={busy}
              autoComplete="organization"
              className="mt-1.5 w-full rounded-xl border border-secondary/20 bg-[#fdfbf7] px-4 py-3 text-sm text-foreground outline-none ring-primary focus:ring-2"
            />
          </div>
        </div>

        {kind === "guest_support" ? (
          <div>
            <label htmlFor="contact-booking" className="block text-sm font-medium text-foreground">
              Booking reference <span className="font-normal text-foreground/45">(optional)</span>
            </label>
            <input
              id="contact-booking"
              name="bookingRef"
              type="text"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              disabled={busy}
              placeholder="e.g. HZHXQ8E9LUH7"
              className="mt-1.5 w-full rounded-xl border border-secondary/20 bg-[#fdfbf7] px-4 py-3 text-sm text-foreground outline-none ring-primary focus:ring-2"
            />
          </div>
        ) : null}

        <div>
          <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground">
            Subject <span className="font-normal text-foreground/45">(optional)</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={busy}
            placeholder={kind === "corporate" ? "Partnership proposal" : "Help with my booking"}
            className="mt-1.5 w-full rounded-xl border border-secondary/20 bg-[#fdfbf7] px-4 py-3 text-sm text-foreground outline-none ring-primary focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-foreground">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={busy}
            placeholder={kind === "corporate" ? "Company details, goals, timeline…" : "Dates, listing link, what happened…"}
            required
            className="mt-1.5 w-full resize-y rounded-xl border border-secondary/20 bg-[#fdfbf7] px-4 py-3 text-sm text-foreground outline-none ring-primary focus:ring-2"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-2xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
          {busy ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
              Sending…
            </span>
          ) : (
            "Send message"
          )}
        </button>
      </form>
    </div>
  );
}

