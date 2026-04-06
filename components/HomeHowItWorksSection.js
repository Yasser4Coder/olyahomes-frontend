"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

function DiagonalArrow({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 17L17 7M7 7h10v10"
      />
    </svg>
  );
}

function IconExplore({ className }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconBook({ className }) {
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

function IconPay({ className }) {
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
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

const smoothEase = [0.22, 1, 0.36, 1];

const steps = [
  {
    step: "01",
    title: "Explore & choose",
    body: "Browse curated homes, compare locations and amenities, and save the stays that feel right for your trip.",
    icon: IconExplore,
  },
  {
    step: "02",
    title: "Book your stay",
    body: "Pick your dates and guest count, then send a booking request. The host confirms availability and house rules.",
    icon: IconBook,
  },
  {
    step: "03",
    title: "Pay securely",
    body: "Review your total in AED, complete payment through our secure checkout, and get everything you need before arrival.",
    icon: IconPay,
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
      className="relative z-0 isolate overflow-hidden border-t border-secondary/15 bg-linear-to-b from-white/60 to-neutral"
      aria-labelledby="how-it-works-home-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-32 bg-linear-to-t from-zinc-900/6 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pl-5 pt-10 sm:px-6 sm:pb-20 sm:pl-7 sm:pt-12 md:px-10 md:pl-10 md:pt-14 lg:px-14 lg:pb-24 lg:pl-12 lg:pt-32">
        <motion.div
          className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } },
          }}
        >
          <motion.div
            variants={headerMotion}
            className="flex max-w-xl gap-5 sm:gap-6"
          >
            <div
              className="hidden w-1 shrink-0 rounded-full bg-primary sm:block"
              aria-hidden
            />
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-secondary">
                How it works
              </p>
              <h2
                id="how-it-works-home-heading"
                className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                From browse to booking in three calm steps
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground/60">
                Explore homes you love, lock in your dates, then pay safely—all
                in one straightforward flow.
              </p>
            </div>
          </motion.div>
          <motion.div variants={headerMotion} className="shrink-0 sm:pt-1">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline decoration-primary/30 decoration-2 underline-offset-4 transition hover:decoration-primary"
            >
              Full guide
              <DiagonalArrow className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.ol
          className="mt-14 grid gap-8 lg:mt-16 lg:grid-cols-3 lg:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.12,
                delayChildren: reduceMotion ? 0 : 0.05,
              },
            },
          }}
        >
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.li key={s.step} variants={cardMotion} className="relative">
                {i < steps.length - 1 ? (
                  <div
                    className="pointer-events-none absolute left-[calc(50%+2.5rem)] top-14 hidden h-px w-[calc(100%-2.5rem)] bg-linear-to-r from-primary/35 via-secondary/25 to-transparent lg:block xl:left-[calc(50%+3rem)] xl:top-16 xl:w-[calc(100%-3rem)]"
                    aria-hidden
                  />
                ) : null}
                <article className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-zinc-200/90 bg-white p-6 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-900/4 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-3xl font-bold tabular-nums text-primary/90 sm:text-4xl">
                      {s.step}
                    </span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 sm:text-[0.95rem]">
                    {s.body}
                  </p>
                  {i === 0 ? (
                    <Link
                      href="/listings"
                      className="mt-6 inline-flex text-sm font-semibold text-primary transition hover:text-primary/80"
                    >
                      Browse homes →
                    </Link>
                  ) : null}
                  {i === 1 ? (
                    <p className="mt-6 text-xs font-medium uppercase tracking-wider text-zinc-400">
                      Request → host confirms
                    </p>
                  ) : null}
                  {i === 2 ? (
                    <p className="mt-6 text-xs font-medium uppercase tracking-wider text-zinc-400">
                      Checkout in AED
                    </p>
                  ) : null}
                </article>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
