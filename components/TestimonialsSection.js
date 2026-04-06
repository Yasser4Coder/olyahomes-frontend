"use client";

import { motion, useReducedMotion } from "motion/react";

const smoothEase = [0.22, 1, 0.36, 1];

const testimonials = [
  {
    quote:
      "The apartment was exactly as pictured—quiet, spotless, and the host’s check-in notes made arrival effortless. We’ll book through Olyahomes again.",
    name: "Sarah M.",
    detail: "Dubai Marina · 5 nights",
    rating: 5,
  },
  {
    quote:
      "Finally a platform that feels curated, not chaotic. Clear pricing in AED, fast responses, and a stay that matched the calm aesthetic we wanted.",
    name: "James & Lina K.",
    detail: "Abu Dhabi · Long weekend",
    rating: 5,
  },
  {
    quote:
      "We travel often for work; this was the smoothest booking we’ve had in the UAE. House rules were upfront and the space was genuinely well maintained.",
    name: "Omar H.",
    detail: "Sharjah · Business stay",
    rating: 5,
  },
];

function StarRow({ count = 5 }) {
  return (
    <div
      className="flex gap-0.5 text-primary"
      role="img"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: count }, (_, i) => (
        <svg
          key={i}
          className="h-4 w-4 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 13.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function QuoteMark({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M0 24V13.7C0 4.9 4.5 0 13.5 0v5.4c-4.2 0-6.3 2.1-6.3 6.3H14V24H0zm18 0V13.7C18 4.9 22.5 0 31.5 0v5.4c-4.2 0-6.3 2.1-6.3 6.3H32V24H18z" />
    </svg>
  );
}

export default function TestimonialsSection() {
  const reduceMotion = useReducedMotion();
  const dur = (s) => (reduceMotion ? 0.01 : s);
  const rise = (y) => (reduceMotion ? 0 : y);

  const headerMotion = {
    hidden: { opacity: 0, y: rise(18) },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur(0.68), ease: smoothEase },
    },
  };

  const cardMotion = {
    hidden: { opacity: 0, y: rise(26) },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur(0.72), ease: smoothEase },
    },
  };

  return (
    <section
      className="relative isolate overflow-hidden border-t border-secondary/15 bg-linear-to-b from-white via-neutral/40 to-neutral"
      aria-labelledby="testimonials-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary/6 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-secondary/7 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-14 lg:py-24">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.06 },
            },
          }}
        >
          <motion.p
            variants={headerMotion}
            className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-secondary"
          >
            Guest stories
          </motion.p>
          <motion.h2
            variants={headerMotion}
            id="testimonials-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Loved stays, told simply
          </motion.h2>
          <motion.p
            variants={headerMotion}
            className="mt-3 text-base leading-relaxed text-foreground/65 sm:text-[1.05rem]"
          >
            Real feedback from guests who value calm spaces, clear communication,
            and homes that feel as good as they look.
          </motion.p>
        </motion.div>

        <motion.ul
          className="mt-14 grid gap-8 sm:mt-16 lg:grid-cols-3 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.11,
                delayChildren: reduceMotion ? 0 : 0.04,
              },
            },
          }}
        >
          {testimonials.map((t) => (
            <motion.li key={t.name} variants={cardMotion}>
              <blockquote className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-zinc-200/90 bg-white/90 py-6 pl-8 pr-6 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-900/4 backdrop-blur-sm sm:py-8 sm:pl-9 sm:pr-8">
                <div
                  className="pointer-events-none absolute left-0 top-0 h-full w-1 rounded-l-[1.75rem] bg-linear-to-b from-primary via-primary/70 to-secondary/80"
                  aria-hidden
                />
                <QuoteMark className="mb-4 h-5 w-6 text-primary/15" />
                <StarRow count={t.rating} />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80 sm:text-[0.95rem]">
                  “{t.quote}”
                </p>
                <footer className="mt-8 border-t border-zinc-100 pt-6">
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    {t.detail}
                  </p>
                </footer>
              </blockquote>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
