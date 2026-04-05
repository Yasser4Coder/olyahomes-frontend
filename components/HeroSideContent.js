"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import FeaturedStaysCarouselBlock from "@/components/FeaturedStaysCarouselBlock";
import { sampleListings } from "@/lib/sampleListings";
import { useFeaturedCarousel } from "@/components/useFeaturedCarousel";

const featured = sampleListings.slice(0, 4);

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

const smoothEase = [0.22, 1, 0.36, 1];

export default function HeroSideContent() {
  const carousel = useFeaturedCarousel(featured.length);
  const reduceMotion = useReducedMotion();
  const dur = (s) => (reduceMotion ? 0.01 : s);
  const slide = (v) => (reduceMotion ? 0 : v);
  const delay = (s) => (reduceMotion ? 0 : s);

  return (
    <>
      {/* Desktop / large tablet — floating column */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        <div
          className="pointer-events-auto absolute right-6 w-[min(100%,360px)] pr-2 xl:right-12 xl:w-[380px] [@media(max-height:640px)]:right-4 [@media(max-height:640px)]:w-[min(100%,320px)] [@media(min-height:881px)]:top-1/2 [@media(min-height:881px)]:-translate-y-1/2 [@media(max-height:880px)]:top-[max(9.5rem,22svh)] [@media(max-height:880px)]:bottom-[max(6rem,11svh)] [@media(max-height:880px)]:translate-y-0 [@media(max-height:880px)]:flex [@media(max-height:880px)]:flex-col [@media(max-height:880px)]:justify-center [@media(max-height:880px)]:items-end"
        >
          <div className="flex w-full origin-right flex-col gap-0 transition-transform duration-200 [@media(max-height:780px)]:scale-[0.92] [@media(max-height:700px)]:scale-[0.85] [@media(max-height:620px)]:scale-[0.78] [@media(max-height:540px)]:scale-[0.72]">
            <motion.div
              initial={{ opacity: 0, x: slide(56) }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: dur(0.88),
                ease: smoothEase,
                delay: delay(0.14),
              }}
            >
              <FeaturedStaysCarouselBlock
                featured={featured}
                carousel={carousel}
                compact={false}
              />
            </motion.div>

            <motion.article
              className="relative z-[2] -mt-5 rounded-[1.75rem] border border-white/25 bg-white p-5 shadow-xl shadow-black/25 ring-1 ring-black/5 [@media(max-height:720px)]:-mt-3 [@media(max-height:680px)]:rounded-2xl [@media(max-height:680px)]:p-4 [@media(max-height:640px)]:-mt-2 [@media(max-height:640px)]:p-3.5"
              initial={{ opacity: 0, x: slide(56) }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: dur(0.88),
                ease: smoothEase,
                delay: delay(0.26),
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Meet our hosts
                  </p>
                  <h3 className="mt-1 text-base font-bold leading-snug text-zinc-900 [@media(max-height:640px)]:text-sm [@media(max-height:640px)]:leading-tight">
                    People who love where they live
                  </h3>
                </div>
                <Link
                  href="/host"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white transition hover:bg-zinc-800 [@media(max-height:640px)]:h-9 [@media(max-height:640px)]:w-9"
                  aria-label="Become a host"
                >
                  <DiagonalArrow className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-4 flex items-center gap-4 [@media(max-height:640px)]:mt-3 [@media(max-height:640px)]:gap-3">
                <div className="flex -space-x-3 [@media(max-height:640px)]:-space-x-2">
                  {[0, 1, 2].map((j) => (
                    <div
                      key={j}
                      className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-zinc-200 shadow-sm ring-1 ring-zinc-200 [@media(max-height:640px)]:h-10 [@media(max-height:640px)]:w-10"
                    >
                      <div
                        className={`absolute inset-0 bg-linear-to-br ${
                          j === 0
                            ? "from-amber-100 to-secondary/60"
                            : j === 1
                              ? "from-sky-100 to-primary/40"
                              : "from-zinc-300 to-secondary/50"
                        }`}
                      />
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1 border-l border-zinc-100 pl-4 [@media(max-height:640px)]:pl-3">
                  <p className="text-sm font-semibold text-zinc-800 [@media(max-height:640px)]:text-xs">
                    Local tips · spotless turnovers
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500 [@media(max-height:680px)]:line-clamp-2 [@media(max-height:640px)]:text-[0.65rem] [@media(max-height:640px)]:leading-snug">
                    Vetted hosts, clear house rules, and support when you need it.
                  </p>
                </div>
              </div>
            </motion.article>

            <motion.article
              className="relative z-[1] -mt-4 overflow-hidden rounded-[1.75rem] bg-primary p-6 shadow-lg shadow-black/25 ring-1 ring-white/10 [@media(max-height:720px)]:-mt-3 [@media(max-height:680px)]:rounded-2xl [@media(max-height:680px)]:p-4 [@media(max-height:640px)]:-mt-2 [@media(max-height:640px)]:p-3.5"
              initial={{ opacity: 0, x: slide(56) }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: dur(0.88),
                ease: smoothEase,
                delay: delay(0.38),
              }}
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl [@media(max-height:640px)]:h-24 [@media(max-height:640px)]:w-24" />
              <div className="absolute -bottom-10 left-1/4 h-24 w-40 rounded-full bg-black/10 blur-2xl [@media(max-height:640px)]:opacity-60" />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25 [@media(max-height:640px)]:h-7 [@media(max-height:640px)]:w-7">
                    <span className="h-3 w-3 rotate-45 rounded-sm bg-white/90 [@media(max-height:640px)]:h-2.5 [@media(max-height:640px)]:w-2.5" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80 [@media(max-height:640px)]:text-[0.65rem]">
                    Olyahomes
                  </p>
                </div>
                <p className="mt-4 border-l-2 border-white/35 pl-4 text-lg font-semibold leading-snug tracking-tight text-white [@media(max-height:720px)]:mt-3 [@media(max-height:720px)]:text-base [@media(max-height:640px)]:mt-2.5 [@media(max-height:640px)]:pl-3 [@media(max-height:640px)]:text-sm [@media(max-height:640px)]:leading-snug">
                  Thoughtful rentals.
                  <br />
                  <span className="text-white/95">Simple booking.</span>
                  <br />
                  <span className="text-white/85">Memorable arrivals.</span>
                </p>
                <Link
                  href="/how-it-works"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/90 transition hover:text-white [@media(max-height:640px)]:mt-3 [@media(max-height:640px)]:text-[0.65rem]"
                >
                  How it works
                  <DiagonalArrow className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          </div>
        </div>
      </div>

      {/* Mobile / tablet — band: below header (top) + above CTA (bottom); card pinned to bottom of band so it never rides under the nav */}
      <div
        className="pointer-events-none absolute inset-x-0 z-[25] flex flex-col justify-end overflow-hidden px-4 sm:px-6 lg:hidden max-lg:top-[max(7.75rem,calc(5.625rem+env(safe-area-inset-top,0px)))] max-lg:bottom-[calc(16.25rem+env(safe-area-inset-bottom,0px))] [@media(max-height:700px)_and_(max-width:1023px)]:bottom-[calc(15.25rem+env(safe-area-inset-bottom,0px))] [@media(max-height:620px)_and_(max-width:1023px)]:bottom-[calc(13.75rem+env(safe-area-inset-bottom,0px))]"
      >
        <motion.div
          className="pointer-events-auto mx-auto w-full min-h-0 max-w-lg max-h-full shrink origin-bottom [@media(max-height:680px)_and_(max-width:1023px)]:scale-[0.96] [@media(max-height:580px)_and_(max-width:1023px)]:scale-[0.9]"
          initial={{ opacity: 0, x: slide(48) }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: dur(0.88),
            ease: smoothEase,
            delay: delay(0.2),
          }}
        >
          <FeaturedStaysCarouselBlock
            featured={featured}
            carousel={carousel}
            compact
          />
        </motion.div>
      </div>
    </>
  );
}
