import Link from "next/link";
import { APP_DISPLAY_NAME } from "@/lib/brand";

function IconDocument({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Full application purpose statement — anchored at page bottom for compliance clarity.
 */
export default function HomeApplicationPurpose() {
  return (
    <section
      id="application-purpose"
      className="relative isolate overflow-x-hidden border-t border-secondary/10 bg-linear-to-b from-neutral via-[#ebe8e2] to-[#e3ddd4] px-4 py-14 sm:px-6 sm:py-16 md:px-10 lg:px-14 lg:py-20"
      aria-labelledby="application-purpose-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent"
        aria-hidden
      />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-56 w-56 rounded-full bg-secondary/[0.08] blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200/90 bg-white/95 shadow-[0_24px_64px_-36px_rgba(44,36,25,0.28)] ring-1 ring-black/[0.04] sm:rounded-[2rem]">
          <div className="flex flex-col gap-0 md:flex-row">
            <div className="flex shrink-0 flex-row items-center gap-4 border-b border-secondary/10 bg-linear-to-br from-primary/[0.08] via-primary/[0.04] to-transparent px-6 py-6 sm:px-8 md:w-[min(13rem,34%)] md:flex-col md:items-start md:justify-between md:border-b-0 md:border-r md:py-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-sm ring-1 ring-primary/15">
                <IconDocument className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1 md:flex-initial">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">
                  Transparency
                </p>
                <h2
                  id="application-purpose-heading"
                  className="font-hero-serif mt-1 text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl"
                >
                  Application purpose
                </h2>
              </div>
            </div>

            <div className="px-6 py-8 sm:px-8 sm:py-10 md:flex-1 md:py-10 md:pr-10">
              <p className="text-[0.9375rem] leading-[1.7] text-foreground/85 sm:text-base">
                The <strong className="font-semibold text-foreground">{APP_DISPLAY_NAME}</strong>{" "}
                application is an online service for the United Arab Emirates. It allows guests to
                search and compare published holiday-home listings, view prices in UAE dirhams
                (AED), select check-in and check-out dates, choose guest counts, and complete a
                secure checkout flow. Property owners can create and manage listings; platform
                administrators can oversee users, listings, and bookings. Personal data is
                collected only to operate these features, as explained in the{" "}
                <strong className="font-medium text-foreground/90">Plan a stay with confidence</strong>{" "}
                section above on this page and in our{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-primary underline-offset-[3px] transition hover:underline"
                >
                  Privacy policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
