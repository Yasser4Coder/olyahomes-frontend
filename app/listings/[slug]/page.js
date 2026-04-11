import Link from "next/link";
import { notFound } from "next/navigation";
import { formatAED } from "@/lib/currency";
import {
  getListingBySlug,
  sampleListings,
} from "@/lib/sampleListings";
import ListingGalleryClient from "@/app/listings/ListingGalleryClient";

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

function IconHome({ className }) {
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
      <path d="M3 10.5 12 3l9 7.5V21a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 21v-10.5z" />
      <path d="M9 22v-7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7" />
    </svg>
  );
}

function IconShield({ className }) {
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
      <path d="M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function IconCheck({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function generateStaticParams() {
  return sampleListings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const home = getListingBySlug(slug);
  if (!home) return { title: "Not found" };
  return { title: home.title, description: home.description };
}

export default async function ListingDetailPage({ params }) {
  const { slug } = await params;
  const home = getListingBySlug(slug);
  if (!home) notFound();

  const amenities = Array.isArray(home.amenities) ? home.amenities : [];
  const images = Array.isArray(home.images) && home.images.length ? home.images : [home.coverImage];

  const statPills = [
    { Icon: IconUsers, label: `${home.guests} guests` },
    { Icon: IconBed, label: `${home.bedrooms} bed${home.bedrooms === 1 ? "" : "s"}` },
    { Icon: IconBath, label: `${home.baths} bath${home.baths === 1 ? "" : "s"}` },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      {/* Top bar */}
      <div className="border-b border-secondary/10 bg-[#fdfbf7]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 md:px-10 lg:px-14">
          <Link
            href="/listings"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground/75 transition hover:text-foreground"
          >
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-secondary/15 bg-white shadow-sm transition group-hover:border-primary/30 group-hover:bg-primary/5"
              aria-hidden
            >
              ←
            </span>
            All listings
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {home.type ? (
              <span className="rounded-full bg-primary/12 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">
                {home.type}
              </span>
            ) : null}
            <span className="rounded-full border border-secondary/15 bg-white px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-foreground/50">
              Photo verified
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 md:px-10 lg:px-14 lg:pt-8">
        {/* Gallery hero — first */}
        <div className="overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-38px_rgba(44,36,25,0.45)] ring-1 ring-secondary/10">
          <ListingGalleryClient title={home.title} images={images} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_min(380px,34%)] lg:gap-12 xl:gap-16">
          <div className="min-w-0 space-y-10">
            {/* Title block */}
            <header className="border-b border-secondary/12 pb-10">
              <h1 className="font-hero-serif text-[clamp(1.85rem,4vw,2.85rem)] font-semibold leading-[1.15] tracking-tight text-foreground">
                {home.title}
              </h1>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-foreground/65">
                <IconPin className="h-4 w-4 shrink-0 text-primary" />
                <span>{home.location}</span>
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {statPills.map(({ Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-2xl border border-secondary/12 bg-white px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </span>
                ))}
              </div>
            </header>

            {/* About */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                About this stay
              </h2>
              <p className="mt-4 max-w-3xl text-[1.05rem] leading-[1.75] text-foreground/75">
                {home.description}
              </p>
            </section>

            {/* Amenities */}
            <section className="rounded-3xl border border-secondary/10 bg-white/80 p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  What this place offers
                </h2>
                {amenities.length ? (
                  <span className="text-sm font-medium text-foreground/45">
                    {amenities.length} amenities
                  </span>
                ) : null}
              </div>
              {amenities.length ? (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-start gap-3 rounded-2xl border border-transparent px-1 py-1.5 transition hover:border-secondary/10 hover:bg-[#fdfbf7]"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                        <IconCheck className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm font-medium leading-snug text-foreground/85">
                        {a}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-foreground/55">
                  Amenities for this listing will appear here.
                </p>
              )}
            </section>

            {/* Highlights — single band */}
            <section className="rounded-3xl bg-linear-to-br from-primary/[0.07] via-transparent to-secondary/6 p-6 sm:p-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground/45">
                Highlights
              </h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-3 sm:gap-4">
                <div className="flex gap-3 sm:flex-col sm:gap-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-sm ring-1 ring-secondary/10">
                    <IconHome className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Entire place</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/60">
                      Private space—just for your group.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:flex-col sm:gap-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-sm ring-1 ring-secondary/10">
                    <IconShield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Clear listing</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/60">
                      Verified photos and structured details.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:flex-col sm:gap-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-sm ring-1 ring-secondary/10">
                    <IconPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Great location</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/60">
                      {home.location.split(",")[0]} and nearby spots.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Booking card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl border border-secondary/12 bg-white shadow-[0_28px_64px_-40px_rgba(44,36,25,0.55)]">
              <div className="h-1.5 bg-linear-to-r from-primary via-primary/80 to-secondary/90" aria-hidden />
              <div className="p-6 sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/45">
                  Nightly from
                </p>
                <p className="mt-2 flex flex-wrap items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground tabular-nums">
                    {formatAED(home.pricePerNight)}
                  </span>
                  <span className="text-base font-semibold text-foreground/50">/ night</span>
                </p>
                <p className="mt-2 text-xs text-foreground/50">Taxes and fees calculated at checkout.</p>

                <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-[#fdfbf7] p-3 ring-1 ring-secondary/10">
                  <div className="text-center">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-foreground/40">
                      Guests
                    </p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-foreground">{home.guests}</p>
                  </div>
                  <div className="border-x border-secondary/15 text-center">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-foreground/40">
                      Beds
                    </p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-foreground">{home.bedrooms}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-foreground/40">
                      Baths
                    </p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-foreground">{home.baths}</p>
                  </div>
                </div>

                <Link
                  href={`/bookings?listing=${encodeURIComponent(home.slug)}`}
                  className="mt-6 flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 ring-1 ring-primary/25 transition hover:bg-primary/92 active:scale-[0.99]"
                >
                  Request to book
                </Link>
                <p className="mt-3 text-center text-xs font-medium text-foreground/50">
                  You won&apos;t be charged yet.
                </p>

                <div className="mt-6 border-t border-secondary/10 pt-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/40">
                    Good to know
                  </p>
                  <ul className="mt-3 space-y-2.5 text-sm text-foreground/65">
                    <li className="flex gap-2">
                      <span className="text-primary" aria-hidden>
                        ·
                      </span>
                      Check-in details after booking.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary" aria-hidden>
                        ·
                      </span>
                      Message the host anytime.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary" aria-hidden>
                        ·
                      </span>
                      House rules shown before you pay.
                    </li>
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className="mt-6 block text-center text-sm font-semibold text-primary hover:underline"
                >
                  Need help choosing dates?
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
