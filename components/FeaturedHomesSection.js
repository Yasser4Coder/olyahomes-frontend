"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import FavoriteHeartButton from "@/components/FavoriteHeartButton";
import { formatAED } from "@/lib/currency";
import { listingDetailHref } from "@/lib/listingRoutes";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

function IconBed({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 10v9M3 14h18M5 14V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M9 21v-4M15 21v-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBath({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 12h16M6 20h12M9 16v4M15 16v4M6 20V10a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUsers({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

  /** Loop needs enough slides for the widest breakpoint (slidesPerView 4 at 1280px+). */
  const maxSlidesPerView = 4;
  const loopEnabled = homes.length >= maxSlidesPerView * 2;

  return (
    <section
      className="relative isolate overflow-hidden border-y border-secondary/15 bg-[#fdfbf7]"
      aria-labelledby="featured-homes-heading"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 md:px-10 lg:px-14">
        <motion.div
          className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.07 } },
          }}
        >
          <motion.div variants={headerMotion} className="flex max-w-xl gap-4 sm:gap-5">
            <div
              className="mt-1 w-px shrink-0 rounded-full bg-primary sm:w-[3px]"
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-primary">
                Curated stays
              </p>
              <h2
                id="featured-homes-heading"
                className="font-hero-serif mt-3 text-[clamp(1.85rem,4vw,2.85rem)] font-semibold leading-tight tracking-tight text-foreground"
              >
                Featured homes
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground/55 sm:text-[1.05rem]">
                A collection of handpicked stays, ready when you are.
              </p>
            </div>
          </motion.div>
          <motion.div variants={headerMotion} className="shrink-0 sm:pb-0.5">
            <Link
              href="/listings/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline decoration-primary/50 decoration-2 underline-offset-[5px] transition hover:decoration-primary"
            >
              View all listings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 sm:mt-14"
          variants={swiperMotion}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-24px" }}
        >
          <div className="featured-homes-swiper relative md:flex md:items-center md:gap-3 lg:gap-4">
            <button
              ref={prevRef}
              type="button"
              className="featured-homes-nav-prev absolute left-1.5 top-[40%] z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent text-white shadow-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition hover:bg-white/15 hover:text-white md:static md:left-auto md:top-auto md:z-20 md:h-11 md:w-11 md:shrink-0 md:translate-y-0 md:border md:border-zinc-200/90 md:bg-white md:text-zinc-500 md:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.18)] md:drop-shadow-none md:hover:border-zinc-300 md:hover:bg-white md:hover:text-foreground"
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
              {/* Right-edge “fog” — fades into section cream so the carousel hints at more content */}
              <div
                className="featured-homes-carousel-fog pointer-events-none absolute right-0 top-0 z-10 hidden bottom-12 w-12 sm:block sm:w-14 md:bottom-14 md:w-16 lg:w-20 xl:w-24"
                aria-hidden
              />

            <Swiper
              className="featured-homes-swiper-inner min-w-0 !pb-12 pt-0.5"
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={10}
              slidesPerView={2}
              centeredSlides={false}
              loop={loopEnabled}
              watchOverflow
              speed={600}
              grabCursor
              noSwiping
              noSwipingClass="swiper-no-swiping"
              autoplay={
                reduceMotion
                  ? false
                  : {
                      delay: 5200,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }
              }
              pagination={{
                clickable: true,
                dynamicBullets: homes.length > 4,
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
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 22 },
                1280: { slidesPerView: 4, spaceBetween: 24 },
              }}
            >
              {homes.map((home, index) => (
                <SwiperSlide key={home.slug} className="!h-auto">
                  <article className="featured-home-card flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200/90 bg-white shadow-[0_12px_36px_-20px_rgba(44,36,25,0.18)] transition duration-300 sm:rounded-2xl">
                    <Link
                      href={listingDetailHref(home.slug)}
                      className="group relative block min-h-[11.25rem] flex-[3] overflow-hidden sm:min-h-[17rem] lg:min-h-[16.5rem]"
                      title={home.title}
                    >
                      {index === 1 ? (
                        <span className="absolute left-2 top-2 z-20 rounded-full bg-primary px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wide text-white shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[0.65rem]">
                          Popular
                        </span>
                      ) : null}
                      <Image
                        src={home.coverImage}
                        alt=""
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 48vw, (max-width: 1024px) 45vw, (max-width: 1280px) 32vw, 24vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/10" />
                      <div className="absolute inset-x-0 bottom-0 space-y-1.5 p-2.5 sm:space-y-2.5 sm:p-5">
                        <h3 className="line-clamp-2 text-xs font-bold leading-snug text-white drop-shadow-sm sm:text-lg sm:leading-snug md:text-xl">
                          {home.title}
                        </h3>
                        <div className="flex items-center gap-1 text-[0.65rem] text-white/95 sm:gap-1.5 sm:text-sm">
                          <MapPin className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                          <span className="truncate font-medium">{home.location}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.6rem] font-medium text-white/90 sm:gap-x-3 sm:gap-y-1 sm:text-[0.8125rem]">
                          <span className="inline-flex items-center gap-0.5 sm:gap-1">
                            <IconBed className="h-3 w-3 opacity-90 sm:h-3.5 sm:w-3.5" />
                            {home.bedrooms}{" "}
                            {home.bedrooms === 1 ? "bed" : "beds"}
                          </span>
                          <span className="text-white/40" aria-hidden>
                            ·
                          </span>
                          <span className="inline-flex items-center gap-0.5 sm:gap-1">
                            <IconBath className="h-3 w-3 opacity-90 sm:h-3.5 sm:w-3.5" />
                            {home.baths}{" "}
                            {home.baths === 1 ? "bath" : "baths"}
                          </span>
                          <span className="text-white/40" aria-hidden>
                            ·
                          </span>
                          <span className="inline-flex items-center gap-0.5 sm:gap-1">
                            <IconUsers className="h-3 w-3 opacity-90 sm:h-3.5 sm:w-3.5" />
                            {home.guests}{" "}
                            {home.guests === 1 ? "guest" : "guests"}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="flex flex-col gap-0 border-t border-zinc-100 bg-white px-2.5 py-2.5 sm:px-5 sm:py-4">
                      <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <Link
                          href={listingDetailHref(home.slug)}
                          className="min-w-0 text-foreground transition hover:text-primary"
                        >
                          <span className="text-sm font-bold tabular-nums sm:text-lg md:text-xl">
                            {formatAED(home.pricePerNight)}
                          </span>
                          <span className="text-[0.65rem] font-normal text-zinc-500 sm:text-sm">
                            {" "}
                            / night
                          </span>
                        </Link>
                        <span
                          className="swiper-no-swiping shrink-0"
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          <FavoriteHeartButton
                            propertyId={home.id ?? null}
                            initialFavorite={Boolean(home.isFavorite)}
                            size="md"
                            variant="panel"
                          />
                        </span>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
            </div>

            <button
              ref={nextRef}
              type="button"
              className="featured-homes-nav-next absolute right-1.5 top-[40%] z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent text-white shadow-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition hover:bg-white/15 hover:text-white md:static md:right-auto md:top-auto md:z-20 md:h-11 md:w-11 md:shrink-0 md:translate-y-0 md:border md:border-zinc-200/90 md:bg-white md:text-zinc-500 md:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.18)] md:drop-shadow-none md:hover:border-zinc-300 md:hover:bg-white md:hover:text-foreground"
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
        </motion.div>
      </div>
    </section>
  );
}
