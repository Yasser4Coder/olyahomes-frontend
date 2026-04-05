import PageHeading from "@/components/PageHeading";
import { getListingBySlug } from "@/lib/sampleListings";

export const metadata = { title: "Bookings" };

export default async function BookingsPage({ searchParams }) {
  const params = await searchParams;
  const listingSlug = params?.listing;
  const listing = listingSlug ? getListingBySlug(listingSlug) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeading
        title="Bookings"
        subtitle="Your upcoming and past stays will appear here once connected to a backend."
      />
      {listing ? (
        <div className="rounded-2xl border border-secondary/15 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-secondary">Selected listing</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {listing.title}
          </p>
          <p className="text-sm text-foreground/65">{listing.location}</p>
          <p className="mt-4 text-foreground/75">
            Add date pickers, guest count, and payment here. Slug from URL:{" "}
            <code className="rounded bg-neutral-dark px-1.5 py-0.5 text-sm">
              {listingSlug}
            </code>
          </p>
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-secondary/30 bg-white/50 p-8 text-center text-foreground/65">
          No active booking draft. Open a listing and choose &quot;Request to
          book&quot; to land here with context.
        </p>
      )}
    </div>
  );
}
