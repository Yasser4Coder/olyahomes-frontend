import { Suspense } from "react";
import ListingsClient from "@/app/(site)/listings/ListingsClient";

export const metadata = {
  title: "Browse listings",
};

export default function ListingsPage() {
  return (
    <div className="bg-[#fdfbf7]">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-12 md:px-10 lg:px-14">
        <div className="relative overflow-hidden rounded-3xl border border-secondary/15 bg-white px-6 py-7 shadow-[0_20px_46px_-34px_rgba(44,36,25,0.28)] sm:px-8 sm:py-9">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl"
            aria-hidden
          />

          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-primary">
            Browse homes
          </p>
          <h1 className="font-hero-serif mt-3 text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-tight tracking-tight text-foreground">
            Find your next stay.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/60 sm:text-[1.05rem]">
            Use quick filters to narrow by price, guests, and dates—then compare
            listings at a glance.
          </p>
        </div>

        <Suspense fallback={<div className="mt-8 h-48 animate-pulse rounded-2xl bg-white/60" aria-hidden />}>
          <ListingsClient />
        </Suspense>
      </div>
    </div>
  );
}
