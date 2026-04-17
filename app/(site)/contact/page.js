import Link from "next/link";
import { APP_DISPLAY_NAME } from "@/lib/brand";
import ContactFormClient from "./ContactFormClient";

export const metadata = {
  title: "Contact",
  description: `Contact ${APP_DISPLAY_NAME}—offices, guest support, and hosting inquiries. Send us a message or find directions.`,
};

const offices = [
  {
    city: "Dubai",
    country: "United Arab Emirates",
    lines: [
      `${APP_DISPLAY_NAME} Guest Care`,
      "Business Bay, Dubai",
      "United Arab Emirates",
    ],
    mapsUrl: "https://maps.google.com/?q=Dubai+Business+Bay",
  },
  {
    city: "Abu Dhabi",
    country: "United Arab Emirates",
    lines: [APP_DISPLAY_NAME, "Al Maryah Island", "Abu Dhabi, UAE"],
    mapsUrl: "https://maps.google.com/?q=Al+Maryah+Island+Abu+Dhabi",
  },
  {
    city: "Remote",
    country: "Global support",
    lines: ["Distributed team", "Email-first support", "AED pricing & regional focus"],
    mapsUrl: "https://olyahomes.com",
  },
];

function IconMapPin({ className }) {
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

function IconArrowRight({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="relative overflow-hidden pb-8 pt-10 sm:pb-10 sm:pt-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          aria-hidden
        >
          <div
            className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 48px, rgb(150 111 82 / 0.35) 48px, rgb(150 111 82 / 0.35) 49px)",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-10 lg:px-14">
          <nav className="text-sm text-foreground/55" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="font-medium text-foreground/70 hover:text-primary">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-foreground/35">
                —
              </li>
              <li className="font-semibold text-foreground">Contact us</li>
            </ol>
          </nav>
          <h1 className="font-hero-serif mt-6 text-[clamp(2.1rem,4.5vw,3.25rem)] font-semibold leading-tight tracking-tight text-foreground">
            Contact us
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/60">
            Questions about a listing, a booking, or hosting with {APP_DISPLAY_NAME}? Reach the
            right team—we
            typically reply within one business day.
          </p>
          <p className="mt-4 text-sm text-foreground/65">
            Prefer email?{" "}
            <a
              href="mailto:info@olyaholidayhomes.com"
              className="font-semibold text-primary underline decoration-primary/30 decoration-2 underline-offset-[5px] transition hover:decoration-primary"
            >
              info@olyaholidayhomes.com
            </a>
          </p>
        </div>
      </section>

      {/* Locations + form */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:px-10 lg:px-14 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 lg:items-start">
          <div className="lg:pt-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Offices &amp; support
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              Where we are
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/60">
              Swap addresses for your real locations. Map links open in a new tab.
            </p>

            <div className="relative mt-8 border-l border-secondary/25 pl-6">
              <ul className="space-y-10">
                {offices.map((office, i) => (
                  <li key={office.city} className="relative">
                    <span
                      className="absolute -left-[1.4rem] top-1.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-primary bg-[#fdfbf7]"
                      aria-hidden
                    />
                    <p className="font-semibold text-foreground">
                      {office.city}{" "}
                      <span className="font-normal text-foreground/55">({office.country})</span>
                    </p>
                    <div className="mt-2 space-y-0.5 text-sm leading-relaxed text-foreground/65">
                      {office.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                    <a
                      href={office.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                    >
                      <IconMapPin className="h-4 w-4" />
                      Directions
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:-mt-8">
            <ContactFormClient />
          </div>
        </div>
      </section>

      {/* The Results — gray band + card */}
      <section className="relative border-t border-secondary/10 bg-neutral-dark/35 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr] lg:items-center lg:gap-12">
            <div className="hidden lg:block" aria-hidden />
            <div className="rounded-3xl border border-white/40 bg-white p-6 shadow-[0_24px_56px_-32px_rgba(44,36,25,0.45)] sm:p-10">
              <h2 className="font-hero-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                The results
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-foreground/70">
                <p>
                  {APP_DISPLAY_NAME} is built so guests can compare homes with confidence and hosts can
                  present listings without guesswork. Clear structure reduces back-and-forth and
                  helps bookings convert.
                </p>
                <p>
                  Replace this block with your case study: a host who filled more nights, or a guest
                  who found the right stay faster—keep it specific and human.
                </p>
                <p>
                  When you connect payments and calendars, this same layout can link to a live
                  success story or press mention.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/listings"
                  className="inline-flex w-fit text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Launch site — browse listings
                </Link>
                <span className="hidden h-px flex-1 bg-secondary/25 sm:block" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative border-t border-secondary/10 bg-[#f3f1ec] py-14 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(rgb(150 111 82 / 0.2) 1px, transparent 1px)`,
            backgroundSize: "14px 14px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-hero-serif text-xl font-semibold text-foreground sm:text-2xl">
            Subscribe to our newsletter
          </h2>
          <p className="mt-2 text-sm text-foreground/60">
            Latest product updates and hosting tips—unsubscribe anytime.
          </p>
          <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row sm:items-stretch">
            <label htmlFor="contact-newsletter-email" className="sr-only">
              Email
            </label>
            <input
              id="contact-newsletter-email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              className="min-h-12 w-full flex-1 rounded-2xl border border-secondary/20 bg-white px-4 py-3 text-sm text-foreground outline-none ring-primary focus:ring-2"
            />
            <button
              type="button"
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 px-5 text-white transition hover:bg-zinc-800 sm:aspect-square sm:min-h-12 sm:w-12 sm:px-0"
              aria-label="Subscribe"
            >
              <IconArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
