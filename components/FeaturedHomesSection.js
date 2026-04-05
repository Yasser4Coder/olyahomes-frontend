"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { formatAED } from "@/lib/currency";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

function MapPin({ className }) {
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
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

const smoothEase = [0.22, 1, 0.36, 1];

export default function FeaturedHomesSection({ homes }) {
  const reduceMotion = useReducedMotion();
  const dur = (s) => (reduceMotion ? 0.01 : s);
  const rise = (y) => (reduceMotion ? 0 : y);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const headerMotion = {
    hidden: { opacity: 0, y: rise(16) },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur(0.65), ease: smoothEase },
    },
  };

  const swiperMotion = {
    hidden: { opacity: 0, y: rise(20) },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur(0.75), ease: smoothEase, delay: dur(0.06) },
    },
  };

  const loopEnabled = homes.length >= 3;

  return (
    <section
      className="relative isolate overflow-hidden border-y border-zinc-300/70 bg-zinc-100/90"
      aria-labelledby="featured-homes-heading"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-primary sm:w-1.5"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/90 via-transparent to-zinc-200/25"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-16 pl-5 sm:px-6 sm:pb-24 sm:pl-7 sm:pt-20 md:px-10 md:pl-10 lg:px-14 lg:pl-12">
        <motion.div
          className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.07 } },
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
                Curated stays
              </p>
              <h2
                id="featured-homes-heading"
                className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                Featured homes
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground/60">
                A taste of what is available—explore the full catalog anytime.
              </p>
            </div>
          </motion.div>
          <motion.div variants={headerMotion} className="shrink-0 sm:pt-1">
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline decoration-primary/30 decoration-2 underline-offset-4 transition hover:decoration-primary"
            >
              View all listings
              <DiagonalArrow className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 border-t border-zinc-200/70 pt-12 sm:mt-14 sm:pt-14"
          variants={swiperMotion}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-24px" }}
        >
          <div className="featured-homes-swiper flex items-center gap-3 sm:gap-4 lg:gap-5">
            <button
              ref={prevRef}
              type="button"
              className="featured-homes-nav-prev z-20 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-300/90 bg-white text-foreground/80 shadow-sm transition hover:border-zinc-400 hover:text-foreground sm:flex"
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
              className="featured-homes-swiper-inner min-w-0 flex-1 !pb-11 pt-0.5"
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              loop={loopEnabled}
              speed={600}
              grabCursor
              autoplay={
                reduceMotion
                  ? false
                  : {
                      delay: 4800,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }
              }
              pagination={{
                clickable: true,
                dynamicBullets: homes.length > 3,
              }}
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
                768: { slidesPerView: 2, spaceBetween: 24 },
                1280: { slidesPerView: 3, spaceBetween: 28 },
              }}
            >
              {homes.map((home) => (
                <SwiperSlide key={home.slug} className="!h-auto">
                  <Link href={`/listings/${home.slug}`} className="group block h-full">
                    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md">
                      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-zinc-100">
                        <Image
                          src={home.coverImage}
                          alt=""
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 380px"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-white sm:text-xl">
                            {home.title}
                          </h3>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <div className="flex items-start gap-2 border-b border-zinc-100 pb-4">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                          <div className="min-w-0">
                            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-zinc-400">
                              Location
                            </p>
                            <p className="mt-1 text-sm font-medium text-foreground">
                              {home.location}
                            </p>
                          </div>
                        </div>
                        <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-zinc-500">
                          {home.description}
                        </p>
                        <div className="mt-5 flex items-end justify-between gap-3 pt-4">
                          <p className="text-lg font-semibold tabular-nums text-foreground sm:text-xl">
                            {formatAED(home.pricePerNight)}
                            <span className="text-sm font-normal text-zinc-500">
                              {" "}
                              / night
                            </span>
                          </p>
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-primary transition group-hover:border-primary/30 group-hover:bg-primary group-hover:text-white">
                            <DiagonalArrow className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              ref={nextRef}
              type="button"
              className="featured-homes-nav-next z-20 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-300/90 bg-white text-foreground/80 shadow-sm transition hover:border-zinc-400 hover:text-foreground sm:flex"
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
        </motion.div>
      </div>
    </section>
  );
}
