import FeaturedHomesSection from "@/components/FeaturedHomesSection";
import HeroSection from "@/components/HeroSection";
import HomeSearchBar from "@/components/HomeSearchBar";
import HomeHowItWorksSection from "@/components/HomeHowItWorksSection";
import HomeContactSection from "@/components/HomeContactSection";
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

      <HomeContactSection />
    </div>
  );
}
