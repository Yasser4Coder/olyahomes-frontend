import Link from "next/link";
import FeaturedHomesSection from "@/components/FeaturedHomesSection";
import HeroSection from "@/components/HeroSection";
import HomeSearchBar from "@/components/HomeSearchBar";
import HomeHowItWorksSection from "@/components/HomeHowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { sampleListings } from "@/lib/sampleListings";

export default function Home() {
  const featured = sampleListings;
  return (
    <div>
      <HeroSection />

      {/* Below lg: in-flow so the tall mobile search never covers the hero card or How it works. lg+: straddle the seam. */}
      <div className="relative z-[45] w-full max-lg:bg-neutral lg:h-0">
        <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-2 sm:px-6 sm:pb-10 md:px-10 lg:absolute lg:inset-x-0 lg:top-0 lg:px-14 lg:pb-0 lg:pt-0 lg:-translate-y-1/2 xl:px-14">
          <div className="flex w-full justify-start">
            <div className="w-full max-w-5xl lg:max-w-6xl">
              <HomeSearchBar variant="hero" />
            </div>
          </div>
        </div>
      </div>

      <HomeHowItWorksSection />

      <FeaturedHomesSection homes={featured} />

      <TestimonialsSection />

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
