import Image from "next/image";
import Link from "next/link";
import PageHeading from "@/components/PageHeading";
import { sampleListings } from "@/lib/sampleListings";

export const metadata = {
  title: "Browse listings",
};

export default function ListingsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeading
        title="Browse homes"
        subtitle="Filter and map views can plug in here later—for now, explore sample properties."
      />
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sampleListings.map((home) => (
          <li key={home.slug}>
            <article className="overflow-hidden rounded-2xl border border-secondary/15 bg-white shadow-sm transition hover:shadow-md">
              <div className="relative aspect-[4/3] bg-zinc-200">
                <Image
                  src={home.coverImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold">
                  <Link
                    href={`/listings/${home.slug}`}
                    className="hover:text-primary"
                  >
                    {home.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-secondary">{home.location}</p>
                <p className="mt-2 text-sm text-foreground/65">
                  {home.guests} guests · {home.bedrooms} bed · {home.baths} bath
                </p>
                <p className="mt-4 font-semibold text-primary">
                  ${home.pricePerNight}{" "}
                  <span className="text-sm font-normal text-foreground/55">
                    / night
                  </span>
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
