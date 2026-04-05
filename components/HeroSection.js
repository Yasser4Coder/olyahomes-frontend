"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import HeroSideContent from "@/components/HeroSideContent";
import HeroCornerAccent from "@/components/HeroCornerAccent";

const heroImage = "/hero-house.png";
const heroLogo = "/logo-big.png";

/** Focal point shifts slightly by breakpoint so the house reads on phones */
const heroObject =
  "object-cover object-[center_52%] sm:object-[center_48%] md:object-[center_44%] lg:object-[center_42%] xl:object-[center_38%]";

const houseMask =
  "linear-gradient(to bottom, transparent 0%, transparent 34%, rgba(0,0,0,0.2) 44%, rgba(0,0,0,0.75) 52%, black 62%)";

const heroHeadlineGutter = "px-4 sm:px-6 md:px-10 lg:px-14";

const heroHeadlineInner =
  "mx-auto max-w-7xl pt-[max(9.25rem,12vh)] sm:pt-[max(9rem,13vh)] md:pt-[max(7.25rem,13vh)] lg:pt-[max(7.5rem,14vh)] xl:pt-[max(7.5rem,15vh)] [@media(max-height:720px)_and_(min-width:768px)]:pt-[max(7.25rem,min(17vh,10.5rem))] [@media(max-height:720px)_and_(max-width:767px)]:pt-[max(9.25rem,min(22vh,12.5rem))] [@media(max-height:640px)_and_(min-width:768px)]:pt-[max(6.75rem,min(16vh,9.5rem))] [@media(max-height:640px)_and_(max-width:767px)]:pt-[max(8.75rem,min(21vh,12rem))] [@media(max-height:600px)_and_(min-width:768px)]:pt-[max(6.5rem,min(15vh,9rem))] [@media(max-height:600px)_and_(max-width:767px)]:pt-[max(8.5rem,min(20vh,11.25rem))]";

const heroGiantLine =
  "max-w-[100vw] font-sans text-[clamp(2.25rem,calc(0.25rem+10.5vw),8.5rem)] font-black uppercase leading-[0.88] tracking-tight text-white max-sm:pr-1 [@media(max-height:720px)]:text-[clamp(2rem,9vw,4.25rem)] [@media(max-height:640px)]:leading-[0.92] [@media(max-height:600px)]:text-[clamp(1.65rem,8vw,3.25rem)]";

const smoothEase = [0.22, 1, 0.36, 1];

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

const headlineLineVariants = {
  hidden: { opacity: 0, x: -52 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.92, ease: smoothEase },
  },
};

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  const dur = (s) => (reduceMotion ? 0.01 : s);
  const slide = (v) => (reduceMotion ? 0 : v);
  const delay = (s) => (reduceMotion ? 0 : s);
  const stagger = reduceMotion ? 0 : 0.1;

  const lineVariants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.01 } },
      }
    : headlineLineVariants;

  return (
    <section
      className="relative -mt-16 min-h-svh w-full overflow-hidden bg-zinc-900 pt-16"
      aria-label="Welcome"
    >
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

      <HeroCornerAccent />

      <div
        className={`pointer-events-none absolute inset-0 z-10 overflow-hidden ${heroHeadlineGutter}`}
        aria-hidden
      >
        <motion.div
          className={heroHeadlineInner}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: stagger,
                delayChildren: delay(0.05),
              },
            },
          }}
        >
          <motion.p className={heroGiantLine} variants={lineVariants}>
            Curated
          </motion.p>
          <motion.p className={heroGiantLine} variants={lineVariants}>
            Stays
          </motion.p>
        </motion.div>
      </div>

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

      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-[17] hidden md:block ${heroHeadlineGutter}`}
      >
        <div className={heroHeadlineInner}>
          <p className={`${heroGiantLine} invisible`} aria-hidden>
            Curated
          </p>
          <p className={`${heroGiantLine} invisible`} aria-hidden>
            Stays
          </p>
          <motion.div
            className="mt-2 w-[min(36vw,118px)] max-[380px]:w-[min(34vw,104px)] sm:mt-3 sm:w-[min(30vw,140px)] md:w-[min(26vw,168px)] lg:w-[min(22vw,188px)] xl:w-[min(20vw,200px)]"
            initial={{ opacity: 0, x: slide(-44) }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: dur(0.88),
              ease: smoothEase,
              delay: delay(0.32),
            }}
          >
            <Image
              src={heroLogo}
              alt="Olyahomes"
              width={400}
              height={200}
              sizes="(max-width: 380px) 34vw, (max-width: 640px) 36vw, (max-width: 1024px) 26vw, 200px"
              className="h-auto w-full object-contain drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
              priority
            />
          </motion.div>
        </div>
      </div>

      <HeroSideContent />

      <div className="absolute inset-x-0 bottom-0 z-30 px-4 pt-28 sm:px-8 max-lg:pt-16 max-lg:sm:pt-20 lg:pt-28 [@media(max-height:720px)]:pt-14 [@media(max-height:640px)]:pt-10 [@media(max-height:600px)]:pt-8 [@media(max-height:620px)_and_(max-width:1023px)]:pt-10 [@media(max-height:620px)_and_(max-width:1023px)]:pb-3 max-lg:pb-[max(3.5rem,env(safe-area-inset-bottom,0px))] lg:pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] [@media(max-height:720px)]:pb-5 [@media(max-height:640px)]:pb-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 max-lg:gap-4 sm:flex-row sm:items-center sm:gap-10 [@media(max-height:680px)]:gap-4 [@media(max-height:620px)_and_(max-width:1023px)]:gap-3">
          <motion.div
            className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:gap-4 [@media(max-height:640px)]:gap-2"
            initial={{ opacity: 0, y: slide(40) }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: dur(0.88),
              ease: smoothEase,
              delay: delay(0.4),
            }}
          >
            <Link
              href="/listings"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-zinc-900 shadow-lg transition hover:bg-zinc-100 sm:flex-none [@media(max-height:640px)]:px-5 [@media(max-height:640px)]:py-2.5 [@media(max-height:640px)]:text-xs"
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
          </motion.div>
          <motion.p
            className="max-w-md text-sm font-medium leading-relaxed text-white/90 sm:text-base [@media(max-height:680px)]:line-clamp-2 [@media(max-height:640px)]:text-xs [@media(max-height:640px)]:leading-snug [@media(max-height:620px)_and_(max-width:1023px)]:hidden"
            initial={{ opacity: 0, y: slide(36) }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: dur(0.88),
              ease: smoothEase,
              delay: delay(0.52),
            }}
          >
            With a focus on calm, modern spaces, we connect you to homes that
            balance comfort, light, and lasting design.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
