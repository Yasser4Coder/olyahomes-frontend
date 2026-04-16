"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { formatAED } from "@/lib/currency";
import { sampleListings } from "@/lib/sampleListings";
import { useFeaturedCarousel } from "@/components/useFeaturedCarousel";
import { APP_DISPLAY_NAME } from "@/lib/brand";
import { ApiError, fetchFeaturedProperties } from "@/lib/api";
import { mapPropertyFromApi } from "@/lib/listingMappers";
import { listingDetailHref } from "@/lib/listingRoutes";

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

function StarRow({ className, small }) {
  return (
    <div
      className={`flex gap-0.5 ${className ?? "text-amber-400"}`}
      aria-hidden
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`shrink-0 fill-current ${small ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}`}
          viewBox="0 0 20 20"
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 13.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function HeroGlassFeaturedCard({ compact = false }) {
  const [homes, setHomes] = useState(sampleListings);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const body = await fetchFeaturedProperties(8);
        const raw = Array.isArray(body?.properties) ? body.properties : [];
        const mapped = raw.map(mapPropertyFromApi).filter(Boolean);
        if (!cancelled && mapped.length) setHomes(mapped);
      } catch (e) {
        if (!cancelled && !(e instanceof ApiError && e.status === 401)) {
          /* keep sample */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const carousel = useFeaturedCarousel(homes.length);
  const {
    index,
    goTo,
    setIsPaused,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    count,
  } = carousel;
  const reduceMotion = useReducedMotion();
  const dur = (s) => (reduceMotion ? 0.01 : s);
  const slide = (x) => (reduceMotion ? 0 : x);

  return (
    <motion.div
      className={`relative w-full ${compact ? "max-w-full sm:mx-auto sm:max-w-sm" : "max-w-[min(100%,360px)] xl:max-w-[372px]"}`}
      initial={{ opacity: 0, x: slide(40), y: slide(12) }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: dur(0.9), ease: smoothEase, delay: dur(0.12) }}
    >
      <div
        className={`overflow-hidden border border-white/15 bg-zinc-950/50 shadow-xl shadow-black/35 ring-1 ring-white/10 backdrop-blur-xl ${
          compact ? "rounded-lg" : "rounded-2xl"
        }`}
      >
        <div
          className={`flex items-center justify-between border-b border-white/10 ${
            compact ? "px-2.5 py-2" : "px-4 py-3"
          }`}
        >
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-white/55 sm:text-[0.6rem]">
            Featured stats
          </p>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.62rem] font-semibold tabular-nums text-white/90">
            {index + 1} / {count}
          </span>
        </div>

        <div
          className={compact ? "px-2.5 pb-3 pt-1.5" : "px-4 pb-4 pt-2.5"}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured property"
            aria-live="polite"
            className="relative cursor-grab active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            <div className={`overflow-hidden ${compact ? "rounded-lg" : "rounded-xl"}`}>
              <div
                className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {homes.map((s, i) => (
                  <div
                    key={s.slug}
                    className="w-full shrink-0 px-0.5"
                    aria-hidden={i !== index}
                  >
                    <Link
                      href={listingDetailHref(s.slug)}
                      className="group block outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900"
                    >
                      <div
                        className={`relative overflow-hidden bg-zinc-800 ${compact ? "aspect-5/3 rounded-lg" : "aspect-16/10 rounded-xl"}`}
                      >
                        {s.coverImage ? (
                          <Image
                            src={s.coverImage}
                            alt=""
                            fill
                            className="object-cover transition duration-500 group-hover:scale-[1.03]"
                            sizes={
                              compact
                                ? "(max-width: 640px) 100vw, 384px"
                                : "(max-width: 1024px) 360px, 372px"
                            }
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent" />
                      </div>
                      <div className={`${compact ? "mt-2 space-y-1" : "mt-3 space-y-1.5"}`}>
                        <h3
                          className={`font-semibold leading-snug text-white ${compact ? "text-sm" : "text-base"}`}
                        >
                          {s.title}
                        </h3>
                        <p
                          className={`text-white/65 ${compact ? "text-xs" : "text-sm"}`}
                        >
                          {s.location}
                        </p>
                        <StarRow small={compact} />
                        <p
                          className={`line-clamp-2 leading-relaxed text-white/55 ${compact ? "text-[0.7rem]" : "text-xs"}`}
                        >
                          {s.description}
                        </p>
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <p
                            className={`font-bold tabular-nums text-white ${compact ? "text-sm" : "text-base"}`}
                          >
                            {formatAED(s.pricePerNight)}
                            <span
                              className={`font-semibold text-white/45 ${compact ? "text-xs" : "text-sm"}`}
                            >
                              {" "}
                              / night
                            </span>
                          </p>
                          <span
                            className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md transition group-hover:bg-primary/90 ${compact ? "h-8 w-8" : "h-10 w-10"}`}
                          >
                            <ArrowRight
                              className={compact ? "h-3.5 w-3.5" : "h-4 w-4"}
                            />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`flex justify-center ${compact ? "mt-2.5 gap-1" : "mt-3.5 gap-1.5"}`}
            role="tablist"
            aria-label="Featured slides"
          >
            {homes.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show property ${i + 1}`}
                className="touch-manipulation p-2.5 sm:p-1"
                onClick={() => {
                  goTo(i);
                  setIsPaused(true);
                }}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    compact
                      ? i === index
                        ? "h-1 w-5 bg-primary"
                        : "h-1 w-1 bg-white/25 hover:bg-white/40"
                      : i === index
                        ? "h-1.5 w-6 bg-primary"
                        : "h-1.5 w-1.5 bg-white/25 hover:bg-white/40"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div
          className={`border-t border-white/10 bg-white/[0.07] ${compact ? "px-2.5 py-2.5" : "px-4 py-4"}`}
        >
          <div
            className={`border border-white/20 bg-white shadow-md shadow-black/10 ${compact ? "rounded-lg p-2.5" : "rounded-xl p-3.5"}`}
          >
            <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-zinc-400 sm:text-[0.58rem]">
              Guest love
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <div className={`flex ${compact ? "-space-x-1.5" : "-space-x-2"}`}>
                {["bg-zinc-300", "bg-zinc-400", "bg-zinc-500"].map((bg, j) => (
                  <span
                    key={j}
                    className={`inline-flex rounded-full border border-white ${bg} ring-1 ring-zinc-200 ${compact ? "h-5 w-5" : "h-6 w-6"}`}
                    aria-hidden
                  />
                ))}
              </div>
              <StarRow className="text-primary" small={compact} />
            </div>
            <p
              className={`mt-2.5 leading-relaxed text-zinc-700 ${compact ? "text-[0.7rem]" : "text-sm"}`}
            >
              <span className="font-medium text-zinc-900">“{APP_DISPLAY_NAME}</span> made
              our family getaway effortless.”
            </p>
            <p
              className={`mt-1.5 font-semibold text-zinc-500 ${compact ? "text-[0.65rem]" : "text-xs"}`}
            >
              — Sarah M.
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2.5 px-0.5">
            <span
              className={`flex items-center justify-center rounded-md bg-primary/20 ring-1 ring-primary/25 ${compact ? "h-6 w-6" : "h-7 w-7"}`}
            >
              <span
                className={`rotate-45 rounded-sm bg-primary/90 ${compact ? "h-2 w-2" : "h-2.5 w-2.5"}`}
              />
            </span>
            <p
              className={`font-medium leading-snug text-white/75 ${compact ? "text-[0.65rem]" : "text-xs"}`}
            >
              Thoughtful rentals.
              <span className="text-white/90"> Memorable stays.</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
