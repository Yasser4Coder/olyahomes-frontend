import Image from "next/image";
import Link from "next/link";
import HeroFloatingCards from "@/components/HeroFloatingCards";

const heroImage = "/hero-house.png";

/** Same as Image — tune % if roof/sky boundary shifts on your photo */
const heroObject = "object-cover object-[center_42%] sm:object-[center_38%]";

const houseMask =
  "linear-gradient(to bottom, transparent 0%, transparent 34%, rgba(0,0,0,0.2) 44%, rgba(0,0,0,0.75) 52%, black 62%)";

function DiagonalArrow({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 17L17 7M7 7h10v10"
      />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section
      className="relative -mt-16 min-h-[100dvh] w-full overflow-hidden bg-zinc-900 pt-16"
      aria-label="Welcome"
    >
      {/* z-0 — base photo */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Olyahomes — modern home exterior"
          fill
          priority
          sizes="100vw"
          className={heroObject}
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-black/25"
          aria-hidden
        />
      </div>

      {/* z-10 — giant headline (reads behind house via masked duplicate layer) */}
      <div
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden px-4 sm:px-10 md:px-14"
        aria-hidden
      >
        <div className="mx-auto max-w-7xl pt-[max(9.25rem,12vh)] sm:pt-[max(9rem,13vh)] md:pt-[max(7.25rem,13vh)] lg:pt-[max(7.5rem,14vh)] xl:pt-[max(7.5rem,15vh)] [@media(max-height:720px)_and_(min-width:768px)]:pt-[max(7.25rem,min(17vh,10.5rem))] [@media(max-height:720px)_and_(max-width:767px)]:pt-[max(9.25rem,min(22vh,12.5rem))] [@media(max-height:640px)_and_(min-width:768px)]:pt-[max(6.75rem,min(16vh,9.5rem))] [@media(max-height:640px)_and_(max-width:767px)]:pt-[max(8.75rem,min(21vh,12rem))] [@media(max-height:600px)_and_(min-width:768px)]:pt-[max(6.5rem,min(15vh,9rem))] [@media(max-height:600px)_and_(max-width:767px)]:pt-[max(8.5rem,min(20vh,11.25rem))]">
          <p className="font-sans text-[clamp(2.75rem,11vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight text-white [@media(max-height:720px)]:text-[clamp(2rem,9vw,4.25rem)] [@media(max-height:640px)]:leading-[0.92] [@media(max-height:600px)]:text-[clamp(1.65rem,8vw,3.25rem)]">
            Curated
          </p>
          <p className="font-sans text-[clamp(2.75rem,11vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight text-white [@media(max-height:720px)]:text-[clamp(2rem,9vw,4.25rem)] [@media(max-height:640px)]:leading-[0.92] [@media(max-height:600px)]:text-[clamp(1.65rem,8vw,3.25rem)]">
            Stays
          </p>
        </div>
      </div>

      {/* z-15 — duplicate photo: only lower “house” band visible → covers type like the reference */}
      <div
        className="absolute inset-0 z-[15] pointer-events-none"
        aria-hidden
      >
        <Image
          src={heroImage}
          alt=""
          fill
          sizes="100vw"
          className={`${heroObject} scale-[1.01]`}
          style={{
            WebkitMaskImage: houseMask,
            maskImage: houseMask,
          }}
        />
      </div>

      <HeroFloatingCards />

      {/* z-30 — bottom CTA row (Structa-style) */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-10 pt-28 sm:px-8 sm:pb-12 [@media(max-height:720px)]:pt-14 [@media(max-height:720px)]:pb-5 [@media(max-height:640px)]:pt-10 [@media(max-height:640px)]:pb-4 [@media(max-height:600px)]:pt-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:gap-10 [@media(max-height:680px)]:gap-4">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 [@media(max-height:640px)]:gap-2">
            <Link
              href="/listings"
              className="inline-flex items-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-zinc-900 shadow-lg transition hover:bg-zinc-100 [@media(max-height:640px)]:px-5 [@media(max-height:640px)]:py-2.5 [@media(max-height:640px)]:text-xs"
            >
              Explore homes
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:bg-primary/90 [@media(max-height:640px)]:h-11 [@media(max-height:640px)]:w-11"
              aria-label="How it works"
            >
              <DiagonalArrow className="h-6 w-6 [@media(max-height:640px)]:h-5 [@media(max-height:640px)]:w-5" />
            </Link>
          </div>
          <p className="max-w-md text-sm font-medium leading-relaxed text-white/90 sm:text-base [@media(max-height:680px)]:line-clamp-2 [@media(max-height:640px)]:text-xs [@media(max-height:640px)]:leading-snug">
            With a focus on calm, modern spaces, we connect you to homes that
            balance comfort, light, and lasting design.
          </p>
        </div>
      </div>
    </section>
  );
}
