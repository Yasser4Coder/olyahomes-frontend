"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

function ArrowRight({ className }) {
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
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

/** Step 1 — document / list */
function IconDocument({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2Z" />
      <path d="M14 2v6h6M8 13h8M8 17h6M8 9h3" />
    </svg>
  );
}

function IconCalendar({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
}

function IconLock({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

const smoothEase = [0.22, 1, 0.36, 1];

const steps = [
  {
    step: "01",
    title: "Explore & choose",
    body: "Browse curated homes, compare locations and amenities, and save the stays that feel right for your trip.",
    icon: IconDocument,
    cta: { href: "/listings", label: "Browse homes" },
  },
  {
    step: "02",
    title: "Book your stay",
    body: "Pick your dates and guest count, then send a booking request. The host confirms availability and house rules.",
    icon: IconCalendar,
    cta: { href: "/listings", label: "Pick dates" },
  },
  {
    step: "03",
    title: "Pay securely",
    body: "Review your total in AED, complete payment through our secure checkout, and get everything you need before arrival.",
    icon: IconLock,
    cta: { href: "/how-it-works", label: "How payment works" },
  },
];

export default function HomeHowItWorksSection() {
  const reduceMotion = useReducedMotion();
  const dur = (s) => (reduceMotion ? 0.01 : s);
  const rise = (y) => (reduceMotion ? 0 : y);

  const headerMotion = {
    hidden: { opacity: 0, y: rise(20) },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur(0.7), ease: smoothEase },
    },
  };

  const cardMotion = {
    hidden: { opacity: 0, y: rise(28) },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur(0.75), ease: smoothEase },
    },
  };

  return (
    <section
      className="relative z-0 isolate overflow-hidden border-t border-secondary/20 bg-[#fdfbf7]"
      aria-labelledby="how-it-works-home-heading"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 md:px-10 md:pt-14 lg:px-14 lg:pb-24 lg:pt-24 xl:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          <motion.div
            className="flex max-w-xl gap-4 sm:gap-5 lg:col-span-5 xl:col-span-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={headerMotion}
          >
            <div
              className="mt-1 w-px shrink-0 rounded-full bg-primary/45 sm:w-[3px]"
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-secondary">
                How it works
              </p>
              <h2
                id="how-it-works-home-heading"
                className="font-hero-serif mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-tight text-foreground"
              >
                From browsing to booking in three calm steps
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/55 sm:text-[1.05rem]">
                Explore homes you love, lock in your dates, then pay safely—all
                in one straightforward flow.
              </p>
              <Link
                href="/how-it-works"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary/85"
              >
                Full guide
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.ol
            className="grid gap-6 sm:gap-8 lg:col-span-7 lg:grid-cols-3 xl:col-span-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: reduceMotion ? 0 : 0.1,
                  delayChildren: reduceMotion ? 0 : 0.06,
                },
              },
            }}
          >
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <motion.li key={s.step} variants={cardMotion} className="min-w-0">
                  <article className="flex h-full flex-col rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(44,36,25,0.18)] sm:p-7">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full border-2 border-primary/40 bg-white">
                        <span className="font-hero-serif text-lg font-semibold tabular-nums text-primary sm:text-xl">
                          {s.step}
                        </span>
                      </div>
                      <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full border-2 border-primary/40 bg-white text-primary">
                        <Icon className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" />
                      </div>
                    </div>
                    <h3 className="mt-7 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 sm:text-[0.9375rem]">
                      {s.body}
                    </p>
                    <Link
                      href={s.cta.href}
                      className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary/85"
                    >
                      {s.cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
