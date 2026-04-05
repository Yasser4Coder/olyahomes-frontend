"use client";

import Image from "next/image";
import Link from "next/link";
import { formatAED } from "@/lib/currency";

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

export default function FeaturedStaysCarouselBlock({ featured, carousel, compact }) {
  const {
    index,
    goTo,
    setIsPaused,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    count,
  } = carousel;

  return (
    <article
      className={`relative z-[3] overflow-hidden border border-white/25 bg-white shadow-2xl shadow-black/30 ring-1 ring-black/5 ${
        compact
          ? "rounded-2xl shadow-xl"
          : "rounded-[1.75rem] [@media(max-height:680px)]:rounded-2xl"
      }`}
    >
      <div
        className={`flex items-center justify-between border-b border-zinc-100/90 ${
          compact ? "px-4 pb-2.5 pt-3" : "px-5 pb-3 pt-4 [@media(max-height:680px)]:px-4 [@media(max-height:680px)]:pb-2 [@media(max-height:680px)]:pt-3"
        }`}
      >
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-400">
            Featured stays
          </p>
          {!compact ? (
            <p className="mt-0.5 text-xs text-zinc-500 [@media(max-height:680px)]:hidden">
              Swipe or pause on hover
            </p>
          ) : (
            <p className="mt-0.5 text-[0.7rem] text-zinc-500">Swipe to browse</p>
          )}
        </div>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[0.65rem] font-semibold tabular-nums text-zinc-600">
          {index + 1} / {count}
        </span>
      </div>

      <div
        className={compact ? "px-4 pb-3 pt-1" : "px-5 pb-4 pt-1 [@media(max-height:680px)]:px-4 [@media(max-height:680px)]:pb-3"}
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
                    <div
                      className={`relative overflow-hidden rounded-2xl bg-zinc-200 ${
                        compact
                          ? "aspect-[16/9]"
                          : "aspect-[16/10] [@media(max-height:720px)]:aspect-[2/1] [@media(max-height:640px)]:aspect-[5/3]"
                      }`}
                    >
                      {stay.coverImage ? (
                        <Image
                          src={stay.coverImage}
                          alt=""
                          fill
                          className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 420px"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-black/25" />
                      <div
                        className={`absolute bottom-3 left-3 right-3 ${compact ? "bottom-2 left-2 right-2" : "[@media(max-height:640px)]:bottom-2 [@media(max-height:640px)]:left-2 [@media(max-height:640px)]:right-2"}`}
                      >
                        <p
                          className={`line-clamp-2 font-bold leading-tight text-white drop-shadow-sm ${
                            compact ? "text-xs sm:text-sm" : "text-sm [@media(max-height:640px)]:text-xs"
                          }`}
                        >
                          {stay.title}
                        </p>
                        <p
                          className={`mt-1 font-medium text-white/85 ${
                            compact
                              ? "text-[0.65rem] sm:text-xs"
                              : "text-xs [@media(max-height:640px)]:mt-0.5 [@media(max-height:640px)]:text-[0.65rem]"
                          }`}
                        >
                          {stay.location}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`mt-3 flex items-end justify-between gap-3 ${compact ? "mt-2" : "[@media(max-height:640px)]:mt-2"}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className={`line-clamp-2 leading-relaxed text-zinc-500 ${
                            compact
                              ? "text-[0.65rem] sm:text-[0.7rem]"
                              : "text-[0.7rem] [@media(max-height:680px)]:line-clamp-1 [@media(max-height:640px)]:text-[0.65rem]"
                          }`}
                        >
                          {stay.description}
                        </p>
                        <p
                          className={`mt-2 font-bold tabular-nums text-zinc-900 ${
                            compact
                              ? "text-base sm:text-lg"
                              : "text-lg [@media(max-height:640px)]:mt-1 [@media(max-height:640px)]:text-base"
                          }`}
                        >
                          {formatAED(stay.pricePerNight)}
                          <span
                            className={`font-semibold text-zinc-400 ${
                              compact ? "text-xs" : "text-xs [@media(max-height:640px)]:text-[0.65rem]"
                            }`}
                          >
                            {" "}
                            / night
                          </span>
                        </p>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md transition group-hover:bg-primary/90 group-focus-visible:bg-primary/90 ${
                          compact
                            ? "h-10 w-10 sm:h-11 sm:w-11"
                            : "h-11 w-11 [@media(max-height:640px)]:h-9 [@media(max-height:640px)]:w-9"
                        }`}
                      >
                        <DiagonalArrow
                          className={
                            compact
                              ? "h-4 w-4 sm:h-5 sm:w-5"
                              : "h-5 w-5 [@media(max-height:640px)]:h-4 [@media(max-height:640px)]:w-4"
                          }
                        />
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`mt-3 flex justify-center gap-1.5 ${compact ? "mt-2" : "[@media(max-height:640px)]:mt-2"}`}
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
  );
}
