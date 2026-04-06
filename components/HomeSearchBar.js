"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const popularDestinations = [
  { name: "Dubai", sub: "United Arab Emirates" },
  { name: "Abu Dhabi", sub: "United Arab Emirates" },
  { name: "Sharjah", sub: "United Arab Emirates" },
  { name: "Ras Al Khaimah", sub: "United Arab Emirates" },
  { name: "Ajman", sub: "United Arab Emirates" },
  { name: "Fujairah", sub: "United Arab Emirates" },
];

function IconSearch({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

function IconCalendar({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" strokeLinecap="round" />
    </svg>
  );
}

function IconUser({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20v-1a5 5 0 0110 0v1" strokeLinecap="round" />
    </svg>
  );
}

function IconPin({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconBaby({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="7" r="3" />
      <path d="M6 21v-1a6 6 0 0112 0v1M9 14h.01M15 14h.01" strokeLinecap="round" />
    </svg>
  );
}

function IconDog({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <ellipse cx="8.5" cy="6" rx="1.8" ry="2.2" />
      <ellipse cx="15.5" cy="6" rx="1.8" ry="2.2" />
      <path d="M8 11h8a4 4 0 014 4v1H4v-1a4 4 0 014-4z" />
    </svg>
  );
}

function ArrowRight({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
  );
}

export default function HomeSearchBar({ variant = "default" }) {
  const router = useRouter();
  const rootRef = useRef(null);
  const [panel, setPanel] = useState(null);
  const [location, setLocation] = useState("");
  const [dateMode, setDateMode] = useState("exact");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(false);

  const closeAll = useCallback(() => setPanel(null), []);

  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) closeAll();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [closeAll]);

  const dateLabel =
    checkIn && checkOut
      ? `${checkIn} – ${checkOut}`
      : checkIn
        ? `${checkIn} → …`
        : "Anytime";

  const guestLabel =
    adults + children === 1
      ? "1 guest"
      : `${adults + children} guests`;

  const isHero = variant === "hero";
  const dateSubHero =
    checkIn && checkOut
      ? `${checkIn} – ${checkOut}`
      : checkIn
        ? `${checkIn} → …`
        : "Add dates";

  const submitSearch = () => {
    const q = new URLSearchParams();
    if (location.trim()) q.set("location", location.trim());
    if (checkIn) q.set("checkIn", checkIn);
    if (checkOut) q.set("checkOut", checkOut);
    q.set("adults", String(adults));
    q.set("children", String(children));
    if (pets) q.set("pets", "1");
    const qs = q.toString();
    router.push(qs ? `/listings?${qs}` : "/listings");
    closeAll();
  };

  const segmentBase =
    "flex min-h-[52px] flex-1 items-center gap-3 px-4 py-3 text-left transition sm:min-h-0 sm:gap-2.5 sm:py-3.5";
  const segmentHero =
    "flex min-h-[3.25rem] flex-1 items-center gap-3 text-left transition max-sm:min-h-0 max-sm:rounded-xl max-sm:border-0 max-sm:bg-white max-sm:px-3.5 max-sm:py-3.5 max-sm:shadow-sm max-sm:ring-1 max-sm:ring-zinc-900/[0.06] sm:min-h-0 sm:rounded-none sm:bg-transparent sm:px-4 sm:py-4 sm:pl-5 sm:pr-4 sm:shadow-none sm:ring-0";
  const segmentHeroIconWrap =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/[0.11] text-primary sm:h-auto sm:w-auto sm:rounded-none sm:bg-transparent sm:text-secondary";
  const heroLabelSm =
    "text-[0.625rem] font-bold uppercase tracking-[0.14em] text-zinc-400 sm:text-xs sm:font-semibold sm:normal-case sm:tracking-normal sm:text-foreground";
  const heroValueSm =
    "text-sm font-medium text-zinc-700 sm:text-xs sm:font-normal sm:text-zinc-500";
  const divider = "hidden h-8 w-px shrink-0 bg-zinc-200 sm:block";

  const barClass = isHero
    ? "flex flex-col gap-2 overflow-hidden rounded-[1.25rem] border border-primary/25 bg-zinc-100/60 p-2 shadow-[0_18px_48px_-14px_rgba(0,0,0,0.22)] backdrop-blur-[2px] sm:gap-0 sm:rounded-full sm:border-2 sm:border-primary/45 sm:bg-white sm:p-1.5 sm:pl-2 sm:pr-2 sm:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] sm:ring-2 sm:ring-primary/15 sm:ring-offset-2 sm:ring-offset-transparent sm:backdrop-blur-none sm:flex-row sm:items-stretch"
    : "flex flex-col overflow-hidden rounded-2xl border border-secondary/20 bg-white shadow-md shadow-zinc-900/5 sm:flex-row sm:items-stretch sm:rounded-full sm:py-1 sm:pl-1 sm:pr-1";

  return (
    <div
      ref={rootRef}
      className={`relative w-full ${isHero ? "max-sm:drop-shadow-none sm:drop-shadow-[0_12px_40px_rgba(0,0,0,0.25)]" : ""}`}
    >
      <div className={barClass}>
        {/* Location */}
        <div className={`relative flex min-w-0 flex-1 flex-col sm:flex-row ${panel === "location" ? "bg-zinc-50" : ""}`}>
          {isHero ? (
            <div
              className={`${segmentHero} w-full cursor-text rounded-none sm:rounded-l-full ${panel === "location" ? "max-sm:ring-2 max-sm:ring-primary/40 max-sm:bg-primary/6 sm:bg-zinc-100/90" : "max-sm:hover:bg-white sm:hover:bg-zinc-50/80"}`}
              onMouseDown={(e) => {
                if (e.target.closest("button")) return;
                setPanel("location");
              }}
              role="search"
            >
              <span className={segmentHeroIconWrap} aria-hidden>
                <IconPin className="pointer-events-none h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                <span className={heroLabelSm}>Where to?</span>
                <input
                  type="search"
                  autoComplete="off"
                  placeholder="Search destinations"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setPanel("location")}
                  className="w-full bg-transparent text-sm font-medium text-zinc-800 outline-none placeholder:font-normal placeholder:text-zinc-400 sm:text-xs sm:font-normal sm:text-zinc-600"
                  aria-controls="home-search-location-panel"
                  aria-label="Destination"
                />
              </div>
              {location ? (
                <button
                  type="button"
                  className="shrink-0 rounded-full p-1 text-zinc-400 hover:bg-zinc-200/80 hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation("");
                  }}
                  aria-label="Clear location"
                >
                  ×
                </button>
              ) : null}
            </div>
          ) : (
            <div
              className={`${segmentBase} w-full cursor-text rounded-none sm:rounded-l-full ${panel === "location" ? "bg-zinc-100/90" : "hover:bg-zinc-50/80"}`}
              onMouseDown={(e) => {
                if (e.target.closest("button")) return;
                setPanel("location");
              }}
              role="search"
            >
              <IconSearch className="pointer-events-none h-5 w-5 shrink-0 text-secondary" />
              <input
                type="search"
                autoComplete="off"
                placeholder="Where to?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setPanel("location")}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-medium placeholder:text-zinc-400"
                aria-controls="home-search-location-panel"
                aria-label="Destination"
              />
              {location ? (
                <button
                  type="button"
                  className="shrink-0 rounded-full p-1 text-zinc-400 hover:bg-zinc-200/80 hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation("");
                  }}
                  aria-label="Clear location"
                >
                  ×
                </button>
              ) : null}
            </div>
          )}
          <span className={divider} aria-hidden />
        </div>

        {/* Dates */}
        <div className={`relative flex min-w-0 flex-1 flex-col sm:flex-row ${panel === "dates" ? "bg-zinc-50" : ""}`}>
          <button
            type="button"
            className={`${isHero ? segmentHero : segmentBase} w-full ${panel === "dates" ? "max-sm:ring-2 max-sm:ring-primary/40 max-sm:bg-primary/6 sm:bg-zinc-100/90" : "max-sm:hover:bg-white sm:hover:bg-zinc-50/80"}`}
            onClick={() => setPanel((p) => (p === "dates" ? null : "dates"))}
            aria-expanded={panel === "dates"}
          >
            {isHero ? (
              <span className={segmentHeroIconWrap} aria-hidden>
                <IconCalendar className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" />
              </span>
            ) : (
              <IconCalendar className="h-5 w-5 shrink-0 text-secondary" />
            )}
            {isHero ? (
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                <span className={heroLabelSm}>
                  <span className="sm:hidden">Dates</span>
                  <span className="max-sm:hidden">Check in — Check out</span>
                </span>
                <span className={`truncate ${heroValueSm}`}>{dateSubHero}</span>
              </span>
            ) : (
              <span className="truncate text-sm font-medium text-foreground">
                {dateLabel}
              </span>
            )}
          </button>
          <span className={divider} aria-hidden />
        </div>

        {/* Guests + search — Search pinned to the far right of the bar */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
          <button
            type="button"
            className={`${isHero ? segmentHero : segmentBase} w-full shrink-0 sm:w-auto ${isHero ? "sm:min-w-32" : "sm:max-w-36 sm:min-w-0"} ${panel === "guests" ? "max-sm:ring-2 max-sm:ring-primary/40 max-sm:bg-primary/6 sm:bg-zinc-100/90" : "max-sm:hover:bg-white sm:hover:bg-zinc-50/80"}`}
            onClick={() => setPanel((p) => (p === "guests" ? null : "guests"))}
            aria-expanded={panel === "guests"}
          >
            {isHero ? (
              <span className={segmentHeroIconWrap} aria-hidden>
                <IconUser className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" />
              </span>
            ) : (
              <IconUser className="h-5 w-5 shrink-0 text-secondary" />
            )}
            {isHero ? (
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                <span className={heroLabelSm}>Guests</span>
                <span className={`truncate ${heroValueSm}`}>{guestLabel}</span>
              </span>
            ) : (
              <span className="truncate text-sm font-medium text-foreground">
                {guestLabel}
              </span>
            )}
          </button>

          <div className="px-0 pb-0 pt-0 sm:contents sm:p-0">
            <button
              type="button"
              onClick={submitSearch}
              className={
                isHero
                  ? "flex w-full min-h-13 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-[0.9375rem] font-bold tracking-wide text-white shadow-[0_8px_24px_-4px_rgba(170,99,37,0.55)] transition active:scale-[0.99] hover:bg-primary/90 sm:ml-auto sm:min-h-0 sm:w-auto sm:shrink-0 sm:self-stretch sm:rounded-full sm:px-9 sm:py-0 sm:text-sm sm:shadow-lg sm:shadow-primary/35"
                  : "flex w-full min-h-13 items-center justify-center rounded-xl bg-linear-to-r from-primary to-secondary px-6 py-3.5 text-sm font-bold tracking-wide text-white shadow-md shadow-primary/25 transition active:scale-[0.99] hover:opacity-95 sm:ml-auto sm:min-h-0 sm:w-auto sm:shrink-0 sm:self-stretch sm:rounded-full sm:px-8 sm:py-0"
              }
            >
              Search
              {isHero ? <ArrowRight className="h-[1.05rem] w-[1.05rem] shrink-0 sm:h-4 sm:w-4" /> : null}
            </button>
          </div>
        </div>
      </div>

      {/* Location dropdown */}
      {panel === "location" ? (
        <div
          id="home-search-location-panel"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl shadow-zinc-900/10 max-sm:rounded-3xl max-sm:border-zinc-200/90 max-sm:p-3.5 max-sm:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.18)] sm:left-0 sm:right-auto sm:w-[min(100%,22rem)]"
        >
          <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
            Popular in UAE
          </p>
          <ul className="max-h-64 overflow-auto">
            {popularDestinations.map((d) => (
              <li key={d.name}>
                <button
                  type="button"
                  className="flex w-full items-start gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-zinc-100"
                  onClick={() => {
                    setLocation(d.name);
                    setPanel(null);
                  }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-secondary">
                    <IconPin className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block font-semibold text-foreground">{d.name}</span>
                    <span className="text-xs text-zinc-500">{d.sub}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Dates panel */}
      {panel === "dates" ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl shadow-zinc-900/10 max-sm:rounded-3xl max-sm:p-4 sm:left-1/2 sm:w-[min(100%,28rem)] sm:-translate-x-1/2">
          <div className="mb-4 flex rounded-full border border-zinc-200 bg-zinc-50 p-1">
            <button
              type="button"
              className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${dateMode === "exact" ? "bg-white text-foreground shadow-sm" : "text-zinc-500"}`}
              onClick={() => setDateMode("exact")}
            >
              Exact dates
            </button>
            <button
              type="button"
              className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${dateMode === "flexible" ? "bg-white text-foreground shadow-sm" : "text-zinc-500"}`}
              onClick={() => setDateMode("flexible")}
            >
              I&apos;m flexible
            </button>
          </div>
          {dateMode === "exact" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-zinc-500">Check-in</span>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-zinc-500">Check-out</span>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>
            </div>
          ) : (
            <p className="text-sm text-zinc-600">
              We&apos;ll show homes with flexible cancellation and date options when you browse.
            </p>
          )}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setPanel(null)}
              className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {/* Guests panel */}
      {panel === "guests" ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl shadow-zinc-900/10 max-sm:rounded-3xl max-sm:p-4 sm:left-auto sm:right-0 sm:w-[min(100%,20rem)]">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-100 py-3 first:pt-0">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-secondary">
                <IconUser className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Adults</p>
                <p className="text-xs text-zinc-500">18 and older</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-lg font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
                disabled={adults <= 1}
                onClick={() => setAdults((a) => Math.max(1, a - 1))}
                aria-label="Decrease adults"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-semibold tabular-nums">{adults}</span>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary text-lg font-medium text-primary hover:bg-primary/5"
                onClick={() => setAdults((a) => a + 1)}
                aria-label="Increase adults"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-b border-zinc-100 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-secondary">
                <IconBaby className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Children</p>
                <p className="text-xs text-zinc-500">0–17</p>
              </div>
            </div>
            {children === 0 ? (
              <button
                type="button"
                className="rounded-full border-2 border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5"
                onClick={() => setChildren(1)}
              >
                Add
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-lg hover:bg-zinc-50"
                  onClick={() => setChildren((c) => Math.max(0, c - 1))}
                  aria-label="Decrease children"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-semibold">{children}</span>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary text-lg text-primary hover:bg-primary/5"
                  onClick={() => setChildren((c) => c + 1)}
                  aria-label="Increase children"
                >
                  +
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-secondary">
                <IconDog className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold text-foreground">Pets allowed</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={pets}
              onClick={() => setPets((p) => !p)}
              className={`relative h-7 w-12 rounded-full transition ${pets ? "bg-primary" : "bg-zinc-300"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition ${pets ? "translate-x-5" : ""}`}
              />
            </button>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setPanel(null)}
              className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
