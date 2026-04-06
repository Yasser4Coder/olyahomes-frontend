"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import HeroCornerAccent from "@/components/HeroCornerAccent";
import HeroGlassFeaturedCard from "@/components/HeroGlassFeaturedCard";

const heroImage = "/hero-house.png";

const heroObject =
  "object-cover object-[center_58%] sm:object-[center_52%] md:object-[center_48%] lg:object-[center_42%] xl:object-[center_38%]";

const smoothEase = [0.22, 1, 0.36, 1];

function ArrowRight({ className }) {
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
        d="M5 12h14m-7-7 7 7-7 7"
      />
    </svg>
  );
}

function IconHome({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z"
      />
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
      className={className}
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path strokeLinecap="round" d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
}

function IconHeadset({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 18v-3a9 9 0 0 1 18 0v3M7 18v3M17 18v3M7 14h-.5A2.5 2.5 0 0 0 4 16.5V18h3v-4Zm10 0h.5A2.5 2.5 0 0 1 20 16.5V18h-3v-4Z"
      />
    </svg>
  );
}

const valueProps = [
  {
    title: "Curated homes",
    sub: "Quality & comfort",
    Icon: IconHome,
  },
  {
    title: "Seamless booking",
    sub: "Fast & secure",
    Icon: IconCalendar,
  },
  {
    title: "24/7 support",
    sub: "We're here for you",
    Icon: IconHeadset,
  },
];

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const dur = (s) => (reduceMotion ? 0.01 : s);
  const slide = (v) => (reduceMotion ? 0 : v);
  const delay = (s) => (reduceMotion ? 0 : s);

  return (
    <section
      className="relative -mt-16 flex min-h-svh flex-col bg-zinc-900 max-md:pt-32 md:pt-16 max-lg:min-h-dvh"
      aria-label="Welcome"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={heroImage}
          alt="Olyahomes — modern home exterior"
          fill
          priority
          sizes="100vw"
          className={heroObject}
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-black/72 via-black/30 to-black/40 sm:from-black/68 sm:via-black/25 sm:to-black/35 lg:from-black/65"
          aria-hidden
        />
        <div className="hero-atmosphere-drift pointer-events-none" aria-hidden />
        <div className="hero-grain-drift pointer-events-none" aria-hidden />
        <div className="hero-clarity-layer pointer-events-none" aria-hidden />
      </div>

      <HeroCornerAccent />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] sm:pb-12 lg:pb-14">
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col justify-start gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-7 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-10 lg:py-10 xl:px-14">
          <div className="flex min-w-0 w-full max-w-xl flex-col items-stretch text-start sm:items-start lg:max-w-[min(32rem,48%)] lg:shrink-0">
            <motion.div
              initial={{ opacity: 0, y: slide(24) }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: dur(0.85),
                ease: smoothEase,
                delay: delay(0.05),
              }}
              className="w-full text-start"
            >
              <h1 className="font-hero-serif text-[clamp(1.875rem,calc(0.85rem+5.8vw),4.75rem)] font-semibold uppercase leading-[0.94] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:leading-[0.92]">
                Curated stays
              </h1>
              <p className="mt-3 max-w-md text-[0.9375rem] font-medium leading-relaxed text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.35)] sm:mt-4 sm:text-base sm:leading-relaxed md:mt-5 md:text-lg">
                Handpicked homes. Unforgettable moments. Effortless stays.
              </p>
              <div className="mt-5 sm:mt-7 md:mt-8">
                <Link
                  href="/listings"
                  className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-xl shadow-black/30 transition hover:bg-primary/90 sm:w-auto sm:min-h-0 sm:justify-start sm:px-8"
                >
                  Explore homes
                  <ArrowRight className="h-5 w-5 shrink-0" />
                </Link>
              </div>
            </motion.div>

            <motion.ul
              className="mt-5 flex w-full max-w-lg flex-col items-start gap-2.5 sm:mt-6 sm:gap-3 sm:flex-row sm:flex-wrap sm:justify-start sm:gap-x-8 sm:gap-y-4 md:mt-7"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: reduceMotion ? 0 : 0.08,
                    delayChildren: delay(0.2),
                  },
                },
              }}
            >
              {valueProps.map(({ title, sub, Icon }) => (
                <motion.li
                  key={title}
                  variants={{
                    hidden: { opacity: 0, y: slide(16) },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: dur(0.65), ease: smoothEase },
                    },
                  }}
                  className="flex min-h-10 items-center gap-2.5 text-start sm:min-h-0 sm:gap-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/95 shadow-inner shadow-black/20 backdrop-blur-sm sm:h-10 sm:w-10 md:h-11 md:w-11">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.8125rem] font-semibold text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.4)] sm:text-sm">
                      {title}
                    </span>
                    <span className="block text-[0.6875rem] text-white/70 sm:text-xs">{sub}</span>
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="hidden shrink-0 lg:ml-4 lg:block xl:ml-6">
            <HeroGlassFeaturedCard />
          </div>

          <div className="mt-5 flex w-full shrink-0 justify-start px-0 sm:mt-6 lg:hidden">
            <HeroGlassFeaturedCard compact />
          </div>
        </div>
      </div>
    </section>
  );
}
