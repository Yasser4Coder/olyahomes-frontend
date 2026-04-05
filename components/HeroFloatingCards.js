"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { sampleListings } from "@/lib/sampleListings";

const featured = sampleListings.slice(0, 4);

const slideGradients = [
  "from-amber-200/90 via-orange-300/80 to-primary/70",
  "from-sky-200/90 via-slate-300/70 to-secondary/60",
  "from-emerald-200/80 via-teal-300/70 to-secondary/50",
  "from-violet-200/85 via-rose-200/70 to-primary/60",
];

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

const AUTO_MS = 4800;

export default function HeroFloatingCards() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const dragStartX = useRef(null);
  const pointerIdRef = useRef(null);

  const count = featured.length;
  const goTo = useCallback((i) => {
    setIndex(((i % count) + count) % count);
  }, [count]);

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (isPaused || count <= 1) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [isPaused, count]);

  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragStartX.current = e.clientX;
    pointerIdRef.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerUp = (e) => {
    if (dragStartX.current == null) return;
    const delta = e.clientX - dragStartX.current;
    const threshold = 48;
    if (delta < -threshold) goNext();
    else if (delta > threshold) goPrev();
    dragStartX.current = null;
    pointerIdRef.current = null;
  };

  const onPointerCancel = () => {
    dragStartX.current = null;
    pointerIdRef.current = null;
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
      <div
        className="pointer-events-auto absolute right-6 w-[min(100%,360px)] pr-2 xl:right-12 xl:w-[380px] [@media(max-height:640px)]:right-4 [@media(max-height:640px)]:w-[min(100%,320px)] [@media(min-height:881px)]:top-1/2 [@media(min-height:881px)]:-translate-y-1/2 [@media(max-height:880px)]:top-[max(9.5rem,22svh)] [@media(max-height:880px)]:bottom-[max(6rem,11svh)] [@media(max-height:880px)]:translate-y-0 [@media(max-height:880px)]:flex [@media(max-height:880px)]:flex-col [@media(max-height:880px)]:justify-center [@media(max-height:880px)]:items-end"
      >
        <div className="flex w-full origin-right flex-col gap-0 transition-transform duration-200 [@media(max-height:780px)]:scale-[0.92] [@media(max-height:700px)]:scale-[0.85] [@media(max-height:620px)]:scale-[0.78] [@media(max-height:540px)]:scale-[0.72]">
        {/* Featured stays — carousel */}
        <article className="relative z-[3] overflow-hidden rounded-[1.75rem] border border-white/25 bg-white shadow-2xl shadow-black/30 ring-1 ring-black/5 [@media(max-height:680px)]:rounded-2xl">
          <div className="flex items-center justify-between border-b border-zinc-100/90 px-5 pb-3 pt-4 [@media(max-height:680px)]:px-4 [@media(max-height:680px)]:pb-2 [@media(max-height:680px)]:pt-3">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Featured stays
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 [@media(max-height:680px)]:hidden">
                Swipe or pause on hover
              </p>
            </div>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[0.65rem] font-semibold tabular-nums text-zinc-600">
              {index + 1} / {count}
            </span>
          </div>

          <div
            className="px-5 pb-4 pt-1 [@media(max-height:680px)]:px-4 [@media(max-height:680px)]:pb-3"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
          >
            <div
              role="region"
              aria-roledescription="carousel"
              aria-label="Featured stays"
              aria-live="polite"
              className="relative cursor-grab active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
            >
              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
                  style={{ transform: `translateX(-${index * 100}%)` }}
                >
                  {featured.map((stay, i) => (
                    <div
                      key={stay.slug}
                      className="w-full shrink-0 px-0.5"
                      aria-hidden={i !== index}
                    >
                      <Link
                        href={`/listings/${stay.slug}`}
                        className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        onClick={() => setIsPaused(true)}
                      >
                        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-100 [@media(max-height:720px)]:aspect-[2/1] [@media(max-height:640px)]:aspect-[5/3]">
                          <div
                            className={`absolute inset-0 bg-linear-to-br ${slideGradients[i % slideGradients.length]}`}
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3 [@media(max-height:640px)]:bottom-2 [@media(max-height:640px)]:left-2 [@media(max-height:640px)]:right-2">
                            <p className="line-clamp-2 text-sm font-bold leading-tight text-white drop-shadow-sm [@media(max-height:640px)]:text-xs">
                              {stay.title}
                            </p>
                            <p className="mt-1 text-xs font-medium text-white/85 [@media(max-height:640px)]:mt-0.5 [@media(max-height:640px)]:text-[0.65rem]">
                              {stay.location}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-end justify-between gap-3 [@media(max-height:640px)]:mt-2">
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-[0.7rem] leading-relaxed text-zinc-500 [@media(max-height:680px)]:line-clamp-1 [@media(max-height:640px)]:text-[0.65rem]">
                              {stay.description}
                            </p>
                            <p className="mt-2 text-lg font-bold tabular-nums text-zinc-900 [@media(max-height:640px)]:mt-1 [@media(max-height:640px)]:text-base">
                              ${stay.pricePerNight}
                              <span className="text-xs font-semibold text-zinc-400 [@media(max-height:640px)]:text-[0.65rem]">
                                {" "}
                                / night
                              </span>
                            </p>
                          </div>
                          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md transition group-hover:bg-primary/90 group-focus-visible:bg-primary/90 [@media(max-height:640px)]:h-9 [@media(max-height:640px)]:w-9">
                            <DiagonalArrow className="h-5 w-5 [@media(max-height:640px)]:h-4 [@media(max-height:640px)]:w-4" />
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="mt-3 flex justify-center gap-1.5 [@media(max-height:640px)]:mt-2"
              role="tablist"
              aria-label="Featured stay slides"
            >
              {featured.map((stay, i) => (
                <button
                  key={stay.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show stay ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-zinc-300 hover:bg-zinc-400"
                  }`}
                  onClick={() => {
                    goTo(i);
                    setIsPaused(true);
                  }}
                />
              ))}
            </div>
          </div>
        </article>

        {/* Meet our hosts */}
        <article className="relative z-[2] -mt-5 rounded-[1.75rem] border border-white/25 bg-white p-5 shadow-xl shadow-black/25 ring-1 ring-black/5 [@media(max-height:720px)]:-mt-3 [@media(max-height:680px)]:rounded-2xl [@media(max-height:680px)]:p-4 [@media(max-height:640px)]:-mt-2 [@media(max-height:640px)]:p-3.5">
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
        </article>

        {/* Olyahomes brand */}
        <article className="relative z-[1] -mt-4 overflow-hidden rounded-[1.75rem] bg-primary p-6 shadow-lg shadow-black/25 ring-1 ring-white/10 [@media(max-height:720px)]:-mt-3 [@media(max-height:680px)]:rounded-2xl [@media(max-height:680px)]:p-4 [@media(max-height:640px)]:-mt-2 [@media(max-height:640px)]:p-3.5">
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
        </article>
        </div>
      </div>
    </div>
  );
}
