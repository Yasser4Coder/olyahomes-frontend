"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const smoothEase = [0.22, 1, 0.36, 1];

const testimonials = [
  {
    quote:
      "The apartment was exactly as pictured—quiet, spotless, and the host’s check-in notes made arrival effortless. We’ll book through Olyahomes again.",
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
          className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
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
      <div className="flex shrink-0 -space-x-2.5">
        <span className="relative z-2 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-600 text-xs font-semibold uppercase tracking-wide text-white ring-2 ring-primary/40">
          {avatar.letters[0]}
        </span>
        <span className="relative z-1 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-500 text-xs font-semibold uppercase tracking-wide text-white ring-2 ring-primary/40">
          {avatar.letters[1]}
        </span>
      </div>
    );
  }
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-600 text-xs font-semibold uppercase tracking-wide text-white ring-2 ring-primary/40">
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

  const headerMotion = {
    hidden: { opacity: 0, y: rise(18) },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur(0.68), ease: smoothEase },
    },
  };

  const loopEnabled = testimonials.length >= 3;

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
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <button
                ref={prevRef}
                type="button"
                className="testimonials-nav-prev z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-black/30 text-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-primary/60 hover:bg-black/45 hover:text-white sm:h-11 sm:w-11"
                aria-label="Previous slide"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
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

              <Swiper
                className="testimonials-swiper-inner min-w-0 flex-1 pt-0.5 pb-11!"
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={16}
                slidesPerView={1}
                loop={loopEnabled}
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
                    <div className="testimonials-card-frame h-full rounded-2xl p-px shadow-[0_16px_48px_-20px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.18)]">
                      <blockquote className="flex h-full flex-col rounded-[15px] bg-linear-to-br from-zinc-800/98 to-zinc-950 p-6 sm:rounded-[calc(1rem-1px)] sm:p-7">
                        <StarRow count={t.rating} />
                        <p className="mt-5 flex-1 text-sm leading-relaxed text-white/95 sm:text-[0.9375rem]">
                          “{t.quote}”
                        </p>
                        <footer className="mt-8 flex items-center gap-3.5 border-t border-white/10 pt-6">
                          <AvatarBlock avatar={t.avatar} />
                          <div className="min-w-0">
                            <p className="font-bold text-white">{t.name}</p>
                            <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-zinc-500">
                              {t.meta}
                            </p>
                          </div>
                        </footer>
                      </blockquote>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                ref={nextRef}
                type="button"
                className="testimonials-nav-next z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-black/30 text-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-primary/60 hover:bg-black/45 hover:text-white sm:h-11 sm:w-11"
                aria-label="Next slide"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
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
