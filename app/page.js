import Link from "next/link";
import FeaturedHomesSection from "@/components/FeaturedHomesSection";
import HeroSection from "@/components/HeroSection";
import HomeHowItWorksSection from "@/components/HomeHowItWorksSection";
import HomeSearchBar from "@/components/HomeSearchBar";
import { sampleListings } from "@/lib/sampleListings";

export default function Home() {
  const featured = sampleListings;
  return (
    <div>
      <HeroSection />

      <section
        className="relative border-t border-secondary/10 bg-neutral px-4 py-8 sm:px-6 sm:py-10"
        aria-label="Search stays"
      >
        <div className="mx-auto flex w-full max-w-5xl justify-center lg:max-w-6xl">
          <HomeSearchBar />
        </div>
      </section>

      <HomeHowItWorksSection />

      <FeaturedHomesSection homes={featured} />

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
