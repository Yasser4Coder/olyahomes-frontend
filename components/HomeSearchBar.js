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

export default function HomeSearchBar() {
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
    "flex min-h-[52px] flex-1 items-center gap-2.5 px-4 py-3 text-left transition sm:min-h-0 sm:py-3.5";
  const divider = "hidden h-8 w-px shrink-0 bg-zinc-200 sm:block";

  return (
    <div ref={rootRef} className="relative w-full">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-secondary/20 bg-white shadow-md shadow-zinc-900/5 sm:flex-row sm:items-stretch sm:rounded-full sm:py-1 sm:pl-1 sm:pr-1">
        {/* Location */}
        <div className={`relative flex min-w-0 flex-1 flex-col sm:flex-row ${panel === "location" ? "bg-zinc-50" : ""}`}>
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
          <span className={divider} aria-hidden />
        </div>

        {/* Dates */}
        <div className={`relative flex min-w-0 flex-1 flex-col sm:flex-row ${panel === "dates" ? "bg-zinc-50" : ""}`}>
          <button
            type="button"
            className={`${segmentBase} w-full ${panel === "dates" ? "bg-zinc-100/90" : "hover:bg-zinc-50/80"}`}
            onClick={() => setPanel((p) => (p === "dates" ? null : "dates"))}
            aria-expanded={panel === "dates"}
          >
            <IconCalendar className="h-5 w-5 shrink-0 text-secondary" />
            <span className="truncate text-sm font-medium text-foreground">{dateLabel}</span>
          </button>
          <span className={divider} aria-hidden />
        </div>

        {/* Guests + search — Search pinned to the far right of the bar */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
          <button
            type="button"
            className={`${segmentBase} w-full shrink-0 sm:w-auto sm:max-w-36 sm:min-w-0 ${panel === "guests" ? "bg-zinc-100/90" : "hover:bg-zinc-50/80"}`}
            onClick={() => setPanel((p) => (p === "guests" ? null : "guests"))}
            aria-expanded={panel === "guests"}
          >
            <IconUser className="h-5 w-5 shrink-0 text-secondary" />
            <span className="truncate text-sm font-medium text-foreground">{guestLabel}</span>
          </button>

          <div className="px-3 pb-3 sm:contents sm:p-0">
            <button
              type="button"
              onClick={submitSearch}
              className="w-full rounded-xl bg-linear-to-r from-primary to-secondary px-6 py-3.5 text-sm font-bold tracking-wide text-white shadow-md shadow-primary/25 transition hover:opacity-95 sm:ml-auto sm:flex sm:w-auto sm:shrink-0 sm:items-center sm:justify-center sm:self-stretch sm:rounded-full sm:px-8 sm:py-0"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Location dropdown */}
      {panel === "location" ? (
        <div
          id="home-search-location-panel"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl shadow-zinc-900/10 sm:left-0 sm:right-auto sm:w-[min(100%,22rem)]"
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
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl shadow-zinc-900/10 sm:left-1/2 sm:w-[min(100%,28rem)] sm:-translate-x-1/2">
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
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl shadow-zinc-900/10 sm:left-auto sm:right-0 sm:w-[min(100%,20rem)]">
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
