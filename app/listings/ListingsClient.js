"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatAED } from "@/lib/currency";

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

function normalize(s) {
  return String(s ?? "").trim().toLowerCase();
}

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

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground/80">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-primary"
      />
      <span>{label}</span>
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
  if (filters.amenities.size) n += 1;
  return n;
}

function ListingCard({ home }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-secondary/15 bg-white shadow-[0_12px_36px_-24px_rgba(44,36,25,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_46px_-26px_rgba(44,36,25,0.28)]">
      <Link
        href={`/listings/${home.slug}`}
        className="relative block aspect-4/3 overflow-hidden bg-zinc-200"
        aria-label={home.title}
      >
        <Image
          src={home.coverImage}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/18 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 space-y-2 p-4">
          <div className="flex flex-wrap items-center gap-2">
            {home.type ? (
              <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white ring-1 ring-white/20 backdrop-blur">
                {home.type}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[0.7rem] font-semibold text-white ring-1 ring-white/20 backdrop-blur">
              <IconPin className="h-3.5 w-3.5 opacity-90" />
              {home.location}
            </span>
          </div>
          <h3 className="text-base font-bold leading-snug text-white drop-shadow-sm sm:text-lg">
            {home.title}
          </h3>
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
            href={`/listings/${home.slug}`}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-secondary/15 bg-white px-3 py-2 text-sm font-semibold text-foreground transition hover:border-secondary/25 hover:bg-zinc-50"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

function FiltersPanel({ homes, filters, setFilters, onClose, compact = false }) {
  const types = useMemo(() => uniq(homes.map((h) => h.type)).sort(), [homes]);
  const allAmenities = useMemo(() => {
    const a = [];
    for (const h of homes) for (const item of h.amenities ?? []) a.push(item);
    return uniq(a).sort();
  }, [homes]);

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

        <div className="mt-6 space-y-3">
          <p className="text-sm font-semibold text-foreground">Amenities</p>
          <div className="grid grid-cols-1 gap-2">
            {allAmenities.map((a) => (
              <Checkbox
                key={a}
                label={a}
                checked={filters.amenities.has(a)}
                onChange={(checked) =>
                  setFilters((f) => {
                    const next = new Set(f.amenities);
                    if (checked) next.add(a);
                    else next.delete(a);
                    return { ...f, amenities: next };
                  })
                }
              />
            ))}
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
                amenities: new Set(),
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

export default function ListingsClient({ homes }) {
  const [sort, setSort] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const priceStats = useMemo(() => {
    const prices = homes.map((h) => h.pricePerNight).filter((n) => Number.isFinite(n));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return {
      min: Number.isFinite(min) ? Math.floor(min / 5) * 5 : 0,
      max: Number.isFinite(max) ? Math.ceil(max / 5) * 5 : 1000,
    };
  }, [homes]);

  const [filters, setFilters] = useState(() => ({
    query: "",
    type: "",
    defaultMinPrice: priceStats.min,
    defaultMaxPrice: priceStats.max,
    minPrice: priceStats.min,
    maxPrice: priceStats.max,
    minGuests: 1,
    minBedrooms: 0,
    minBaths: 0,
    amenities: new Set(),
  }));

  const normalizedQuery = normalize(filters.query);
  const filteredHomes = useMemo(() => {
    const out = homes.filter((h) => {
      if (filters.type && h.type !== filters.type) return false;
      if (h.pricePerNight < filters.minPrice || h.pricePerNight > filters.maxPrice)
        return false;
      if (filters.minGuests > 1 && h.guests < filters.minGuests) return false;
      if (filters.minBedrooms > 0 && h.bedrooms < filters.minBedrooms) return false;
      if (filters.minBaths > 0 && h.baths < filters.minBaths) return false;
      if (filters.amenities.size) {
        const set = new Set(h.amenities ?? []);
        for (const a of filters.amenities) if (!set.has(a)) return false;
      }
      if (normalizedQuery) {
        const hay = normalize(`${h.title} ${h.location} ${h.description} ${h.type}`);
        if (!hay.includes(normalizedQuery)) return false;
      }
      return true;
    });

    if (sort === "price-asc") out.sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sort === "price-desc") out.sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (sort === "guests-desc") out.sort((a, b) => b.guests - a.guests);
    return out;
  }, [filters, homes, normalizedQuery, sort]);

  const activeCount = countActive(filters);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr] lg:items-start">
      {/* Desktop filters */}
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
            <FiltersPanel homes={homes} filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Controls row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground/55">
              {filteredHomes.length} stays found
            </p>
            <p className="mt-1 text-lg font-bold tracking-tight text-foreground">
              Find a place that feels easy
            </p>
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
                onChange={(e) => setSort(e.target.value)}
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

        {/* Results */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredHomes.map((home) => (
            <ListingCard key={home.slug} home={home} />
          ))}
        </div>

        {filteredHomes.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-secondary/15 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-bold text-foreground">No matches.</p>
            <p className="mt-2 text-sm text-foreground/60">
              Try widening your price range or clearing a few filters.
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
                  amenities: new Set(),
                }))
              }
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary/90"
            >
              Clear all filters
            </button>
          </div>
        ) : null}
      </div>

      {/* Mobile filters drawer */}
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
              filters={filters}
              setFilters={setFilters}
              onClose={() => setMobileFiltersOpen(false)}
              compact
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

