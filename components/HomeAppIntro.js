import Link from "next/link";
import { APP_DISPLAY_NAME } from "@/lib/brand";

function IconHome({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShield({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Data transparency cards — sits below the hero search; spaced for the floating bar on lg+.
 */
export default function HomeAppIntro() {
  return (
    <section
      className="relative border-b border-secondary/10 bg-linear-to-b from-neutral via-neutral to-[#f0ebe3]"
      aria-labelledby="home-app-intro-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 md:px-10 lg:px-14 lg:pb-16 lg:pt-12">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-primary">
            {APP_DISPLAY_NAME}
          </p>
          <h2
            id="home-app-intro-heading"
            className="font-hero-serif mt-2 text-[clamp(1.35rem,2.5vw,1.85rem)] font-semibold leading-snug tracking-tight text-foreground"
          >
            Plan a stay with confidence
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-foreground/65 lg:mx-0">
            What you can do in the app—and why we ask for a few personal details when you sign up.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-2 md:gap-6 lg:mt-12 lg:gap-8">
          <article className="group relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/90 p-6 shadow-[0_16px_48px_-28px_rgba(44,36,25,0.12)] ring-1 ring-black/[0.03] transition hover:border-primary/25 hover:shadow-[0_20px_52px_-26px_rgba(44,36,25,0.14)] sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                <IconHome className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  What you can do
                </h3>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-foreground/75">
                  <li className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/70" aria-hidden />
                    <span>
                      Browse curated UAE holiday homes with nightly rates shown in{" "}
                      <strong className="font-medium text-foreground/90">AED</strong>.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/70" aria-hidden />
                    <span>
                      Set check-in, check-out, and guest count, then continue to secure checkout.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/70" aria-hidden />
                    <span>
                      Hosts manage listings; guests and hosts stay aligned from search to arrival.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/90 p-6 shadow-[0_16px_48px_-28px_rgba(44,36,25,0.12)] ring-1 ring-black/[0.03] transition hover:border-secondary/30 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary ring-1 ring-secondary/15">
                <IconShield className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  Why we ask for your data
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                  We use your <strong className="font-medium text-foreground/85">name</strong>,{" "}
                  <strong className="font-medium text-foreground/85">email</strong>, and{" "}
                  <strong className="font-medium text-foreground/85">phone</strong>—and, if you choose{" "}
                  <strong className="font-medium text-foreground/85">Google sign-in</strong>, the basic
                  profile details Google shares with your consent—only to run this service: your
                  account, bookings, payments, and stay-related messages.
                </p>
                <p className="mt-4">
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 transition hover:underline"
                  >
                    Read the full Privacy policy
                    <span aria-hidden>→</span>
                  </Link>
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
