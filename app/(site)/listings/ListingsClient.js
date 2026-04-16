"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatAED } from "@/lib/currency";
import FavoriteHeartButton from "@/components/FavoriteHeartButton";
import { ApiError, fetchProperties, fetchPropertyFacets } from "@/lib/api";
import { listingDetailHref } from "@/lib/listingRoutes";
import { mapPropertyFromApi } from "@/lib/listingMappers";

function IconSliders({ className }) {
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
      <path d="M4 21v-7" />
      <path d="M4 10V3" />
      <path d="M12 21v-9" />
      <path d="M12 8V3" />
      <path d="M20 21v-5" />
      <path d="M20 12V3" />
      <path d="M2 14h4" />
      <path d="M10 8h4" />
      <path d="M18 16h4" />
    </svg>
  );
}

function IconX({ className }) {
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
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function IconPin({ className }) {
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

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/** Smooth 0→1 for auto-scroll animation */
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

const hideScrollbar =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:[display:none]";

const SORTS = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "guests-desc", label: "Guest capacity" },
];

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-secondary/20 bg-white text-foreground/80 hover:border-secondary/30 hover:bg-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}

function SectionLabel({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {subtitle ? <p className="mt-0.5 text-xs text-foreground/55">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function RangeRow({ label, value, onChange, min, max, step = 1 }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-foreground/70">{label}</span>
        <span className="text-xs font-semibold text-foreground">{value}</span>
      </div>
      <input
        className="mt-2 w-full accent-primary"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function countActive(filters) {
  let n = 0;
  if (filters.query) n += 1;
  if (filters.type) n += 1;
  if (filters.minPrice !== filters.defaultMinPrice) n += 1;
  if (filters.maxPrice !== filters.defaultMaxPrice) n += 1;
  if (filters.minGuests > 1) n += 1;
  if (filters.minBedrooms > 0) n += 1;
  if (filters.minBaths > 0) n += 1;
  if (filters.checkIn) n += 1;
  if (filters.checkOut) n += 1;
  return n;
}

function ListingCard({ home }) {
  const desktopScrollRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const scrollAnimRef = useRef(null);

  const cancelScrollAnim = useCallback(() => {
    if (scrollAnimRef.current != null) {
      cancelAnimationFrame(scrollAnimRef.current);
      scrollAnimRef.current = null;
    }
    const d = desktopScrollRef.current;
    const m = mobileScrollRef.current;
    if (d) d.scrollTop = 0;
    if (m) m.scrollTop = 0;
  }, []);

  const runAutoScroll = useCallback(
    (el) => {
      cancelScrollAnim();
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) return;
      const duration = Math.min(10000, Math.max(1600, max * 26));
      const t0 = performance.now();

      const loop = (now) => {
        const t = (now - t0) / duration;
        if (t >= 1) {
          el.scrollTop = max;
          scrollAnimRef.current = null;
          return;
        }
        el.scrollTop = max * easeInOutQuad(t);
        scrollAnimRef.current = requestAnimationFrame(loop);
      };
      scrollAnimRef.current = requestAnimationFrame(loop);
    },
    [cancelScrollAnim],
  );

  const onImageLinkEnter = useCallback(() => {
    if (typeof window === "undefined" || !window.matchMedia("(min-width: 768px)").matches) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        runAutoScroll(desktopScrollRef.current);
      });
    });
  }, [runAutoScroll]);

  useEffect(() => () => cancelScrollAnim(), [cancelScrollAnim]);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-secondary/15 bg-white shadow-[0_12px_36px_-24px_rgba(44,36,25,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_46px_-26px_rgba(44,36,25,0.28)]">
      <Link
        href={listingDetailHref(home.slug)}
        className="relative block aspect-4/3 overflow-hidden bg-zinc-200"
        aria-label={home.title}
        onMouseEnter={onImageLinkEnter}
        onMouseLeave={cancelScrollAnim}
      >
        <Image
          src={home.coverImage}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
        />
        {/* Light base so the photo reads; darkens on hover (md+) */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent transition-opacity duration-300 md:from-black/0 md:group-hover:from-black/80 md:group-hover:via-black/45 md:focus-within:from-black/80 md:focus-within:via-black/45" />
        <div className="pointer-events-none absolute right-3 top-3 z-10">
          <span className="pointer-events-auto inline-block" onClick={(e) => e.stopPropagation()}>
            <FavoriteHeartButton propertyId={home.id} initialFavorite={home.isFavorite} size="sm" />
          </span>
        </div>
        {/* Small screens: bottom panel — scroll if title is very long */}
        <div className="absolute inset-x-0 bottom-0 z-[1] max-h-[55%] bg-linear-to-t from-black/80 to-transparent px-3 pb-3 pt-8 md:hidden">
          <div
            ref={mobileScrollRef}
            className={`max-h-full min-h-0 space-y-1 overflow-y-auto overscroll-y-contain pr-0.5 [-webkit-overflow-scrolling:touch] ${hideScrollbar}`}
          >
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {home.type ? (
                <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-white ring-1 ring-white/25">
                  {home.type}
                </span>
              ) : null}
              <span className="flex min-w-0 items-center gap-1 text-[0.65rem] font-medium text-white/90">
                <IconPin className="h-3 w-3 shrink-0 opacity-90" />
                <span className="break-words">{home.location}</span>
              </span>
            </div>
            <h3 className="break-words text-sm font-bold leading-snug text-white drop-shadow-sm">{home.title}</h3>
          </div>
        </div>
        {/* md+: type / location / title on hover — full title wraps; scroll inside panel if needed */}
        <div className="pointer-events-none absolute inset-0 z-[1] hidden flex-col justify-end bg-linear-to-t from-black/85 via-black/45 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 md:flex">
          <div
            ref={desktopScrollRef}
            className={`max-h-[88%] min-h-0 w-full translate-y-2 overflow-y-auto overscroll-y-contain pb-1 transition-transform duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0 ${hideScrollbar}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              {home.type ? (
                <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white ring-1 ring-white/20 backdrop-blur">
                  {home.type}
                </span>
              ) : null}
              <span className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[0.7rem] font-semibold text-white ring-1 ring-white/20 backdrop-blur">
                <IconPin className="h-3.5 w-3.5 shrink-0 opacity-90" />
                <span className="break-words">{home.location}</span>
              </span>
            </div>
            <h3 className="mt-2 break-words text-left text-base font-bold leading-snug text-white drop-shadow-sm sm:text-lg">
              {home.title}
            </h3>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <p className="line-clamp-2 text-sm leading-relaxed text-foreground/65">
          {home.description}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {home.guests} guests
              <span className="text-foreground/35"> · </span>
              {home.bedrooms} {home.bedrooms === 1 ? "bed" : "beds"}
              <span className="text-foreground/35"> · </span>
              {home.baths} {home.baths === 1 ? "bath" : "baths"}
            </p>
            <p className="mt-1 text-base font-bold text-primary">
              {formatAED(home.pricePerNight)}
              <span className="text-sm font-semibold text-foreground/55"> / night</span>
            </p>
          </div>
          <Link
            href={listingDetailHref(home.slug)}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-secondary/15 bg-white px-3 py-2 text-sm font-semibold text-foreground transition hover:border-secondary/25 hover:bg-zinc-50"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

function FiltersPanel({ homes, facets, filters, setFilters, onClose, compact = false }) {
  const types = useMemo(() => {
    if (facets?.propertyTypes?.length) return [...facets.propertyTypes].filter(Boolean).sort();
    return uniq(homes.map((h) => h.type)).sort();
  }, [homes, facets]);

  return (
    <div className={compact ? "p-4 sm:p-5" : ""}>
      {compact ? (
        <div className="flex items-center justify-between gap-3 border-b border-secondary/15 pb-4">
          <p className="text-base font-bold tracking-tight text-foreground">Filters</p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-secondary/15 bg-white text-foreground/70 hover:bg-zinc-50"
            aria-label="Close filters"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className={compact ? "pt-4" : ""}>
        <div className="space-y-4">
          <SectionLabel
            icon={<IconPin className="h-4 w-4" />}
            title="Search"
            subtitle="Title, description, or location"
          />
          <input
            value={filters.query}
            onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
            placeholder="Try “beach”, “cabin”, “California”…"
            className="w-full rounded-xl border border-secondary/15 bg-white px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="mt-6 space-y-2">
          <SectionLabel
            icon={<IconPin className="h-4 w-4" />}
            title="Stay dates"
            subtitle="Excludes homes booked for overlapping nights (server-side)"
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-foreground/60">
              Check-in
              <input
                type="date"
                value={filters.checkIn}
                onChange={(e) => setFilters((f) => ({ ...f, checkIn: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-secondary/15 bg-white px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="block text-xs font-semibold text-foreground/60">
              Check-out
              <input
                type="date"
                value={filters.checkOut}
                onChange={(e) => setFilters((f) => ({ ...f, checkOut: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-secondary/15 bg-white px-3 py-2 text-sm text-foreground"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-sm font-semibold text-foreground">Type</p>
          <div className="flex flex-wrap gap-2">
            <Pill
              active={!filters.type}
              onClick={() => setFilters((f) => ({ ...f, type: "" }))}
            >
              All
            </Pill>
            {types.map((t) => (
              <Pill
                key={t}
                active={filters.type === t}
                onClick={() => setFilters((f) => ({ ...f, type: f.type === t ? "" : t }))}
              >
                {t}
              </Pill>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <p className="text-sm font-semibold text-foreground">Price range (AED / night)</p>
          <div className="rounded-2xl border border-secondary/15 bg-[#fdfbf7] p-4">
            <RangeRow
              label="Min"
              value={filters.minPrice}
              min={filters.defaultMinPrice}
              max={filters.maxPrice}
              step={5}
              onChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  minPrice: clamp(v, f.defaultMinPrice, f.maxPrice),
                }))
              }
            />
            <div className="mt-4">
              <RangeRow
                label="Max"
                value={filters.maxPrice}
                min={filters.minPrice}
                max={filters.defaultMaxPrice}
                step={5}
                onChange={(v) =>
                  setFilters((f) => ({
                    ...f,
                    maxPrice: clamp(v, f.minPrice, f.defaultMaxPrice),
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <p className="text-sm font-semibold text-foreground">Rooms & guests</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-secondary/15 bg-white p-4">
              <p className="text-xs font-semibold text-foreground/60">Guests</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border border-secondary/15 bg-white text-foreground/70 hover:bg-zinc-50 disabled:opacity-40"
                  onClick={() =>
                    setFilters((f) => ({ ...f, minGuests: Math.max(1, f.minGuests - 1) }))
                  }
                  disabled={filters.minGuests <= 1}
                  aria-label="Decrease guests"
                >
                  −
                </button>
                <p className="text-sm font-bold text-foreground">{filters.minGuests}+</p>
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border border-secondary/15 bg-white text-foreground/70 hover:bg-zinc-50"
                  onClick={() => setFilters((f) => ({ ...f, minGuests: f.minGuests + 1 }))}
                  aria-label="Increase guests"
                >
                  +
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-secondary/15 bg-white p-4">
              <p className="text-xs font-semibold text-foreground/60">Bedrooms</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border border-secondary/15 bg-white text-foreground/70 hover:bg-zinc-50 disabled:opacity-40"
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      minBedrooms: Math.max(0, f.minBedrooms - 1),
                    }))
                  }
                  disabled={filters.minBedrooms <= 0}
                  aria-label="Decrease bedrooms"
                >
                  −
                </button>
                <p className="text-sm font-bold text-foreground">{filters.minBedrooms}+</p>
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border border-secondary/15 bg-white text-foreground/70 hover:bg-zinc-50"
                  onClick={() =>
                    setFilters((f) => ({ ...f, minBedrooms: f.minBedrooms + 1 }))
                  }
                  aria-label="Increase bedrooms"
                >
                  +
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-secondary/15 bg-white p-4">
              <p className="text-xs font-semibold text-foreground/60">Bathrooms</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border border-secondary/15 bg-white text-foreground/70 hover:bg-zinc-50 disabled:opacity-40"
                  onClick={() =>
                    setFilters((f) => ({ ...f, minBaths: Math.max(0, f.minBaths - 1) }))
                  }
                  disabled={filters.minBaths <= 0}
                  aria-label="Decrease bathrooms"
                >
                  −
                </button>
                <p className="text-sm font-bold text-foreground">{filters.minBaths}+</p>
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border border-secondary/15 bg-white text-foreground/70 hover:bg-zinc-50"
                  onClick={() => setFilters((f) => ({ ...f, minBaths: f.minBaths + 1 }))}
                  aria-label="Increase bathrooms"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-7 flex flex-wrap items-center gap-2 ${compact ? "pb-2" : ""}`}>
          <button
            type="button"
            onClick={() =>
              setFilters((f) => ({
                ...f,
                query: "",
                type: "",
                minPrice: f.defaultMinPrice,
                maxPrice: f.defaultMaxPrice,
                minGuests: 1,
                minBedrooms: 0,
                minBaths: 0,
                checkIn: "",
                checkOut: "",
              }))
            }
            className="inline-flex items-center justify-center rounded-xl border border-secondary/20 bg-white px-4 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-zinc-50"
          >
            Clear all
          </button>
          {compact ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary/90"
            >
              Show results
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function sortToApi(sort) {
  if (sort === "price-asc") return "price_asc";
  if (sort === "price-desc") return "price_desc";
  if (sort === "guests-desc") return "guests_desc";
  return "recommended";
}

export default function ListingsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [facets, setFacets] = useState(null);
  const [homes, setHomes] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const [filters, setFilters] = useState({
    query: "",
    type: "",
    defaultMinPrice: 0,
    defaultMaxPrice: 2000,
    minPrice: 0,
    maxPrice: 2000,
    minGuests: 1,
    minBedrooms: 0,
    minBaths: 0,
    checkIn: "",
    checkOut: "",
  });

  useEffect(() => {
    if (!facets) return;
    setFilters((f) => ({
      ...f,
      defaultMinPrice: facets.minPrice,
      defaultMaxPrice: facets.maxPrice,
      minPrice: facets.minPrice,
      maxPrice: facets.maxPrice,
    }));
  }, [facets]);

  useEffect(() => {
    const q = searchParams.get("q") || searchParams.get("query") || searchParams.get("location") || "";
    const type = searchParams.get("type") || "";
    const checkIn = searchParams.get("checkIn") || "";
    const checkOut = searchParams.get("checkOut") || "";
    const adults = Number(searchParams.get("adults")) || 0;
    const children = Number(searchParams.get("children")) || 0;
    const minGuests = adults + children > 0 ? adults + children : 1;
    setFilters((f) => ({
      ...f,
      query: q,
      type,
      checkIn,
      checkOut,
      minGuests: Math.max(1, minGuests),
    }));
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const body = await fetchPropertyFacets();
        if (!cancelled) setFacets(body?.facets ?? null);
      } catch {
        if (!cancelled) setFacets({ minPrice: 0, maxPrice: 2000, propertyTypes: [], cities: [] });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const runFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = {
        page,
        pageSize: 12,
        sort: sortToApi(sort),
        q: filters.query || undefined,
        propertyType: filters.type || undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minGuests: filters.minGuests > 1 ? filters.minGuests : undefined,
        minBedrooms: filters.minBedrooms > 0 ? filters.minBedrooms : undefined,
        minBaths: filters.minBaths > 0 ? filters.minBaths : undefined,
        checkIn: filters.checkIn || undefined,
        checkOut: filters.checkOut || undefined,
      };
      const body = await fetchProperties(q);
      const raw = Array.isArray(body?.properties) ? body.properties : [];
      setHomes(raw.map(mapPropertyFromApi).filter(Boolean));
      setTotal(Number(body?.total) || 0);
      setTotalPages(Number(body?.totalPages) || 1);
    } catch (e) {
      setHomes([]);
      setTotal(0);
      setError(e instanceof ApiError ? e.message : "Could not load listings.");
    } finally {
      setLoading(false);
    }
  }, [filters, page, sort]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runFetch();
    }, 320);
    return () => clearTimeout(debounceRef.current);
  }, [runFetch]);

  const pushQueryToUrl = useCallback(() => {
    const p = new URLSearchParams();
    if (filters.query) p.set("q", filters.query);
    if (filters.type) p.set("type", filters.type);
    if (filters.checkIn) p.set("checkIn", filters.checkIn);
    if (filters.checkOut) p.set("checkOut", filters.checkOut);
    if (filters.minGuests > 1) p.set("adults", String(filters.minGuests));
    const qs = p.toString();
    router.replace(qs ? `/listings/?${qs}` : "/listings/", { scroll: false });
  }, [filters, router]);

  const activeCount = countActive(filters);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr] lg:items-start">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-3xl border border-secondary/15 bg-white p-6 shadow-[0_18px_40px_-28px_rgba(44,36,25,0.22)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-base font-bold tracking-tight text-foreground">Filters</p>
            {activeCount ? (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                {activeCount}
              </span>
            ) : null}
          </div>
          <div className="mt-5">
            <FiltersPanel
              homes={homes}
              facets={facets}
              filters={filters}
              setFilters={setFilters}
            />
            <button
              type="button"
              onClick={() => {
                setPage(1);
                pushQueryToUrl();
              }}
              className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90"
            >
              Apply &amp; sync URL
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground/55">
              {loading ? "Searching…" : `${total} stays found`}
            </p>
            <p className="mt-1 text-lg font-bold tracking-tight text-foreground">Find a place that feels easy</p>
            {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-zinc-50 lg:hidden"
            >
              <IconSliders className="h-4 w-4 text-foreground/70" />
              Filters
              {activeCount ? (
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {activeCount}
                </span>
              ) : null}
            </button>

            <label className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-white px-4 py-2 text-sm font-semibold text-foreground">
              <span className="text-foreground/70">Sort</span>
              <select
                value={sort}
                onChange={(e) => {
                  setPage(1);
                  setSort(e.target.value);
                }}
                className="bg-transparent text-sm font-semibold outline-none"
                aria-label="Sort results"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {homes.map((home) => (
            <ListingCard key={home.id || home.slug} home={home} />
          ))}
        </div>

        {!loading && homes.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-secondary/15 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-bold text-foreground">No matches.</p>
            <p className="mt-2 text-sm text-foreground/60">
              Try different dates (booked homes are hidden) or relax filters.
            </p>
            <button
              type="button"
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  query: "",
                  type: "",
                  minPrice: f.defaultMinPrice,
                  maxPrice: f.defaultMaxPrice,
                  minGuests: 1,
                  minBedrooms: 0,
                  minBaths: 0,
                  checkIn: "",
                  checkOut: "",
                }))
              }
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary/90"
            >
              Clear all filters
            </button>
          </div>
        ) : null}

        {totalPages > 1 ? (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full border border-secondary/20 bg-white px-4 py-2 text-sm font-semibold text-foreground disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-3 text-sm text-foreground/60">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border border-secondary/20 bg-white px-4 py-2 text-sm font-semibold text-foreground disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-60 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[84vh] overflow-auto rounded-t-3xl border border-secondary/15 bg-white shadow-2xl">
            <FiltersPanel
              homes={homes}
              facets={facets}
              filters={filters}
              setFilters={setFilters}
              onClose={() => {
                setPage(1);
                pushQueryToUrl();
                setMobileFiltersOpen(false);
              }}
              compact
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

