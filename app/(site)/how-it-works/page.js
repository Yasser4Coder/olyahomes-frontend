import Link from "next/link";
import { SectionImageBackdrop } from "@/components/SectionImageBackdrop";
import { APP_DISPLAY_NAME } from "@/lib/brand";

export const metadata = {
  title: "How it works",
  description: `Learn how to find and book a stay on ${APP_DISPLAY_NAME}—or list your home—in a few clear steps.`,
};

const guestSteps = [
  {
    title: "Search & compare",
    body: "Filter by location, guests, price, and amenities. Every listing uses the same layout so you can scan photos, rules, and details quickly.",
    Icon: IconSearch,
  },
  {
    title: "Pick dates & review",
    body: "Choose check-in and check-out, see the nightly rate and estimated total, and read cancellation expectations before you commit.",
    Icon: IconCalendar,
  },
  {
    title: "Book & stay",
    body: "Request to book (payments plug in on the backend). After confirmation, get check-in notes and host messages in one place.",
    Icon: IconKey,
  },
];

const hostSteps = [
  {
    title: "Create your listing",
    body: "Add photos, amenities, house rules, and pricing. Clear listings attract the right guests and reduce back-and-forth.",
    Icon: IconHome,
  },
  {
    title: "Set availability",
    body: "Calendar sync and instant booking can connect when your API is ready—until then, the UI is structured for those features.",
    Icon: IconCalendar,
  },
  {
    title: "Welcome guests",
    body: "Share directions and expectations. After checkout, feedback helps you improve and helps future guests decide.",
    Icon: IconUsers,
  },
];

function IconSearch({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconCalendar({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconKey({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="8" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="M11 12h9M17 16v2M17 8v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconHome({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
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

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      {/* Hero — photo + glow (only here + bottom CTA) */}
      <SectionImageBackdrop
        tone="warm"
        className="border-b border-secondary/15"
      >
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 md:px-10 lg:px-14">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-primary">
            Simple from start to finish
          </p>
          <h1 className="font-hero-serif mt-3 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-tight tracking-tight text-foreground">
            How {APP_DISPLAY_NAME} works
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/65 sm:text-[1.05rem]">
            Whether you&apos;re booking a stay or sharing your space, the experience stays calm:
            clear details, transparent totals, and room to grow when you connect payments and calendars.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/listings"
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/25 ring-1 ring-primary/20 transition hover:bg-primary/90 active:scale-[0.99]"
            >
              Browse homes
            </Link>
            <Link
              href="/host"
              className="inline-flex items-center justify-center rounded-2xl border border-secondary/15 bg-white px-6 py-3.5 text-sm font-semibold text-foreground/85 shadow-sm transition hover:bg-zinc-50 active:scale-[0.99]"
            >
              Become a host
            </Link>
          </div>
        </div>
      </SectionImageBackdrop>

      {/* Guests */}
      <section className="border-b border-secondary/10 bg-[#fdfbf7]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:px-10 lg:px-14 lg:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground/45">
              For guests
            </h2>
            <p className="font-hero-serif mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Book a stay in three steps
            </p>
          </div>
          <Link href="/contact" className="text-sm font-semibold text-primary hover:underline">
            Questions? Contact us →
          </Link>
        </div>

        <div className="relative mt-12">
          <div
            className="pointer-events-none absolute left-0 right-0 top-[2.25rem] hidden h-px bg-linear-to-r from-transparent via-secondary/25 to-transparent lg:block"
            aria-hidden
          />
          <ol className="relative grid gap-8 lg:grid-cols-3 lg:gap-6">
          {guestSteps.map((step, i) => (
            <li key={step.title} className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white shadow-md shadow-primary/30 ring-4 ring-white/90 lg:mx-auto">
                {i + 1}
              </div>
              <div className="mt-5 rounded-3xl border border-secondary/12 bg-white p-6 shadow-[0_16px_40px_-32px_rgba(44,36,25,0.28)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">{step.body}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
        </div>
      </section>

      {/* Hosts */}
      <section className="border-b border-secondary/10 bg-neutral/80">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:px-10 lg:px-14 lg:py-20">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground/45">
              For hosts
            </h2>
            <p className="font-hero-serif mt-2 max-w-2xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              List your home with clarity
            </p>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/60">
              The same design system that helps guests compare listings helps you present your place
              consistently—so bookings feel predictable on both sides.
            </p>
          </div>

          <ul className="mt-12 space-y-0 divide-y divide-secondary/12 rounded-3xl border border-secondary/12 bg-white shadow-sm">
            {hostSteps.map((step, i) => (
              <li
                key={step.title}
                className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8"
              >
                <div className="flex shrink-0 items-center gap-4 sm:w-48 sm:flex-col sm:items-start sm:gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/12 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <step.Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">{step.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA — photo + dark overlay (testimonials-style) */}
      <div className="px-4 pb-16 pt-6 sm:px-6 md:px-10 lg:px-14 lg:pb-24">
        <SectionImageBackdrop
          tone="dark"
          className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:rounded-4xl"
        >
          <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Ready when you are
                </p>
                <p className="font-hero-serif mt-2 text-xl font-semibold text-white sm:text-2xl">
                  Start browsing—or tell us about your property.
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
                  Our team can help you choose a listing or plan your first host setup.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:shrink-0">
                <Link
                  href="/listings"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90"
                >
                  Explore listings
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </SectionImageBackdrop>
      </div>
    </div>
  );
}
