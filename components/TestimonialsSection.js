"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { fetchTestimonials } from "@/lib/api";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const smoothEase = [0.22, 1, 0.36, 1];

const fallbackTestimonials = [
  {
    quote:
      "The apartment was exactly as pictured—quiet, spotless, and the host’s check-in notes made arrival effortless. We’ll book through Olya holiday homes again.",
    name: "Sarah M.",
    meta: "Dubai, UAE • 5 nights",
    rating: 5,
    avatar: { type: "single", initials: "SM" },
  },
  {
    quote:
      "Finally a platform that feels curated, not chaotic. Clear pricing in AED, fast responses, and a stay that matched the calm aesthetic we wanted.",
    name: "James & Lina K.",
    meta: "Abu Dhabi, UAE • Long weekend",
    rating: 5,
    avatar: { type: "couple", letters: ["J", "L"] },
  },
  {
    quote:
      "We travel often for work; this was the smoothest booking we’ve had in the UAE. House rules were upfront and the space was genuinely well maintained.",
    name: "Omar H.",
    meta: "Sharjah, UAE • Business stay",
    rating: 5,
    avatar: { type: "single", initials: "OH" },
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
          className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"
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

function AvatarBlock({ avatar }) {
  if (avatar.type === "couple") {
    return (
      <div className="flex shrink-0 -space-x-2 sm:-space-x-2.5">
        <span className="relative z-2 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-600 text-[0.65rem] font-semibold uppercase tracking-wide text-white ring-2 ring-primary/40 sm:h-11 sm:w-11 sm:text-xs">
          {avatar.letters[0]}
        </span>
        <span className="relative z-1 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-500 text-[0.65rem] font-semibold uppercase tracking-wide text-white ring-2 ring-primary/40 sm:h-11 sm:w-11 sm:text-xs">
          {avatar.letters[1]}
        </span>
      </div>
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-600 text-[0.65rem] font-semibold uppercase tracking-wide text-white ring-2 ring-primary/40 sm:h-11 sm:w-11 sm:text-xs">
      {avatar.initials}
    </span>
  );
}

export default function TestimonialsSection() {
  const reduceMotion = useReducedMotion();
  const dur = (s) => (reduceMotion ? 0.01 : s);
  const rise = (y) => (reduceMotion ? 0 : y);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const body = await fetchTestimonials();
        if (cancelled) return;
        const rows = Array.isArray(body?.testimonials) ? body.testimonials : [];
        if (rows.length) {
          setTestimonials(rows);
        }
      } catch {
        // Keep fallback testimonials if API is unavailable or empty.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const headerMotion = {
    hidden: { opacity: 0, y: rise(18) },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur(0.68), ease: smoothEase },
    },
  };

  /** Swiper loop needs enough duplicated slides; 3 testimonials → loop off. */
  const maxSlidesPerView = 3;
  const loopEnabled = testimonials.length >= 4;

  return (
    <section
      className="relative isolate px-4 py-14 sm:px-6 sm:py-16 md:py-20 lg:py-24"
      aria-labelledby="testimonials-heading"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-zinc-950 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:rounded-4xl">
        {/* Background art — add public/test-bg.png */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/test-bg.png')" }}
          aria-hidden
        />
        {/* Brand-tinted glow on left & right — dark readable center */}
        <div
          className="testimonials-glow-left pointer-events-none absolute inset-y-0 left-0 w-[min(55%,28rem)]"
          aria-hidden
        />
        <div
          className="testimonials-glow-right pointer-events-none absolute inset-y-0 right-0 w-[min(55%,28rem)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_100%_at_50%_50%,rgba(12,10,8,0.78),rgba(12,10,8,0.35)_58%,transparent_88%)]"
          aria-hidden
        />
        <div
          className="testimonials-glow-strip pointer-events-none absolute inset-0"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.4)]"
          aria-hidden
        />

        <div className="relative z-10 px-5 pb-12 pt-12 sm:px-8 sm:pb-14 sm:pt-14 md:px-10 lg:px-12 lg:pb-16 lg:pt-16">
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
              className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-primary"
            >
              Guest stories
            </motion.p>
            <motion.h2
              variants={headerMotion}
              id="testimonials-heading"
              className="font-hero-serif mt-3 text-[clamp(1.85rem,4vw,2.85rem)] font-semibold leading-tight tracking-tight text-white"
            >
              Loved stays, told simply
            </motion.h2>
            <motion.p
              variants={headerMotion}
              className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-[1.05rem]"
            >
              Real feedback from guests who value calm spaces, clear communication,
              and homes that feel as good as they look.
            </motion.p>
          </motion.div>

          <div className="mt-12 sm:mt-14">
            <div className="relative md:flex md:items-center md:gap-3 lg:gap-4">
              <button
                ref={prevRef}
                type="button"
                className="testimonials-nav-prev absolute left-1.5 top-[42%] z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent text-white shadow-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] transition hover:bg-white/15 hover:text-white md:static md:left-auto md:top-auto md:z-20 md:h-11 md:w-11 md:shrink-0 md:translate-y-0 md:border md:border-primary/40 md:bg-black/30 md:text-white/95 md:shadow-[0_4px_20px_rgba(0,0,0,0.35)] md:backdrop-blur-sm md:drop-shadow-none md:hover:border-primary/60 md:hover:bg-black/45 md:hover:text-white"
                aria-label="Previous slide"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 md:h-5 md:w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 18l-6-6 6-6"
                  />
                </svg>
              </button>

              <div className="relative min-w-0 flex-1 md:min-w-0">
              <Swiper
                className="testimonials-swiper-inner min-w-0 flex-1 pt-0.5 pb-11!"
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={10}
                slidesPerView={2}
                loop={loopEnabled}
                watchOverflow
                speed={600}
                grabCursor
                autoplay={
                  reduceMotion
                    ? false
                    : {
                        delay: 5600,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }
                }
                pagination={{ clickable: true }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  if (
                    swiper.params.navigation &&
                    typeof swiper.params.navigation !== "boolean"
                  ) {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                  }
                }}
                onSwiper={(swiper) => {
                  if (
                    swiper.params.navigation &&
                    typeof swiper.params.navigation !== "boolean"
                  ) {
                    swiper.navigation.init();
                    swiper.navigation.update();
                  }
                }}
                breakpoints={{
                  768: { slidesPerView: 2, spaceBetween: 18 },
                  1024: { slidesPerView: 3, spaceBetween: 20 },
                }}
              >
                {testimonials.map((t) => (
                  <SwiperSlide key={t.name} className="h-auto!">
                    <div className="testimonials-card-frame h-full rounded-xl p-px shadow-[0_16px_48px_-20px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.18)] sm:rounded-2xl">
                      <blockquote className="flex h-full flex-col rounded-[11px] bg-linear-to-br from-zinc-800/98 to-zinc-950 p-3.5 sm:rounded-[15px] sm:p-7">
                        <StarRow count={t.rating} />
                        <p className="mt-3 flex-1 text-[0.7rem] leading-snug text-white/95 line-clamp-6 sm:mt-5 sm:line-clamp-none sm:text-[0.9375rem] sm:leading-relaxed">
                          “{t.quote}”
                        </p>
                        <footer className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3.5 sm:mt-8 sm:gap-3.5 sm:pt-6">
                          <AvatarBlock avatar={t.avatar} />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-white sm:text-base">
                              {t.name}
                            </p>
                            <p className="mt-0.5 truncate text-[0.55rem] font-medium uppercase tracking-[0.12em] text-zinc-500 sm:mt-1 sm:text-[0.65rem] sm:tracking-[0.14em]">
                              {t.meta}
                            </p>
                          </div>
                        </footer>
                      </blockquote>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              </div>

              <button
                ref={nextRef}
                type="button"
                className="testimonials-nav-next absolute right-1.5 top-[42%] z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent text-white shadow-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] transition hover:bg-white/15 hover:text-white md:static md:right-auto md:top-auto md:z-20 md:h-11 md:w-11 md:shrink-0 md:translate-y-0 md:border md:border-primary/40 md:bg-black/30 md:text-white/95 md:shadow-[0_4px_20px_rgba(0,0,0,0.35)] md:backdrop-blur-sm md:drop-shadow-none md:hover:border-primary/60 md:hover:bg-black/45 md:hover:text-white"
                aria-label="Next slide"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 md:h-5 md:w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 18l6-6-6-6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
