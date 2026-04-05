import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import { sampleListings } from "@/lib/sampleListings";

export default function Home() {
  const featured = sampleListings.slice(0, 3);
  return (
    <div>
      <HeroSection />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Featured homes
            </h2>
            <p className="mt-1 text-foreground/65">
              A taste of what is available—explore the full catalog anytime.
            </p>
          </div>
          <Link
            href="/listings"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View all listings →
          </Link>
        </div>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((home) => (
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
                  <h3 className="font-semibold text-foreground">
                    <Link
                      href={`/listings/${home.slug}`}
                      className="hover:text-primary"
                    >
                      {home.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-secondary">{home.location}</p>
                  <p className="mt-3 text-sm text-foreground/70 line-clamp-2">
                    {home.description}
                  </p>
                  <p className="mt-4 text-lg font-semibold text-primary">
                    ${home.pricePerNight}
                    <span className="text-sm font-normal text-foreground/60">
                      {" "}
                      / night
                    </span>
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-secondary/15 bg-white/50 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-semibold text-foreground">
            Have a space to share?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-foreground/70">
            List your home on Olyahomes and reach guests who value quality stays.
          </p>
          <Link
            href="/host"
            className="mt-8 inline-flex rounded-xl bg-secondary px-6 py-3 text-base font-semibold text-white transition hover:bg-secondary/90"
          >
            Become a host
          </Link>
        </div>
      </section>
    </div>
  );
}
