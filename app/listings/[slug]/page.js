import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getListingBySlug,
  sampleListings,
} from "@/lib/sampleListings";

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/listings"
        className="text-sm font-medium text-secondary hover:text-primary"
      >
        ← All listings
      </Link>
      <div className="mt-6 overflow-hidden rounded-2xl border border-secondary/15 bg-white shadow-sm">
        <div className="flex min-h-[240px] items-center justify-center bg-gradient-to-br from-primary/15 to-secondary/20 sm:min-h-[320px]">
          <span className="text-secondary/80">Gallery placeholder</span>
        </div>
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-semibold text-foreground">
            {home.title}
          </h1>
          <p className="mt-2 text-secondary">{home.location}</p>
          <p className="mt-6 text-foreground/80">{home.description}</p>
          <dl className="mt-8 flex flex-wrap gap-6 text-sm">
            <div>
              <dt className="text-foreground/55">Guests</dt>
              <dd className="font-medium">{home.guests}</dd>
            </div>
            <div>
              <dt className="text-foreground/55">Bedrooms</dt>
              <dd className="font-medium">{home.bedrooms}</dd>
            </div>
            <div>
              <dt className="text-foreground/55">Bathrooms</dt>
              <dd className="font-medium">{home.baths}</dd>
            </div>
          </dl>
          <div className="mt-10 flex flex-col gap-4 border-t border-secondary/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-2xl font-bold text-primary">
              ${home.pricePerNight}
              <span className="text-base font-normal text-foreground/55">
                {" "}
                / night
              </span>
            </p>
            <Link
              href={`/bookings?listing=${encodeURIComponent(home.slug)}`}
              className="inline-flex justify-center rounded-xl bg-primary px-8 py-3 font-semibold text-white transition hover:bg-primary/90"
            >
              Request to book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
