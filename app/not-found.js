import Image from "next/image";
import Link from "next/link";
import { APP_DISPLAY_NAME } from "@/lib/brand";

export default function NotFound() {
  return (
    <div className="relative min-h-[min(78vh,52rem)] overflow-hidden bg-[#fdfbf7]">
      <div className="sticky top-0 z-20 border-b border-secondary/10 bg-[#fdfbf7]/95 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 rounded-lg py-1 transition hover:opacity-90">
            <Image src="/logo.png" alt="" width={36} height={36} className="rounded-lg" />
            <span className="font-hero-serif text-lg font-semibold text-foreground">{APP_DISPLAY_NAME}</span>
          </Link>
          <Link href="/listings/" className="text-sm font-semibold text-primary hover:underline">
            Browse homes
          </Link>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/7 blur-3xl" />
        <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-secondary/8 blur-3xl" />
        <div className="absolute left-1/2 top-12 size-112 -translate-x-1/2 rounded-full bg-primary/4 blur-3xl" />
      </div>

      <p
        className="pointer-events-none absolute left-1/2 top-[12%] -translate-x-1/2 select-none font-hero-serif text-[clamp(7rem,22vw,14rem)] font-semibold leading-none tracking-tight text-primary/6"
        aria-hidden
      >
        404
      </p>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6 sm:py-24 md:px-10 md:py-28 lg:px-14">
        <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-secondary/12 bg-white px-8 py-12 text-center shadow-[0_24px_60px_-40px_rgba(44,36,25,0.28)] sm:px-12 sm:py-14">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-secondary/10 blur-2xl"
            aria-hidden
          />

          <p className="relative text-[0.65rem] font-bold uppercase tracking-[0.22em] text-primary">Page not found</p>
          <h1 className="relative mt-4 font-hero-serif text-[clamp(1.75rem,4.5vw,2.35rem)] font-semibold leading-tight tracking-tight text-foreground">
            This page isn&apos;t here
          </h1>
          <p className="relative mx-auto mt-4 max-w-md text-base leading-relaxed text-foreground/65">
            The address may be mistyped, the page was moved, or it never existed. Try home or our listings to keep
            exploring {APP_DISPLAY_NAME}.
          </p>

          <div className="relative mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/20 ring-1 ring-primary/15 transition hover:bg-primary/90"
            >
              Back home
            </Link>
            <Link
              href="/listings/"
              className="inline-flex items-center justify-center rounded-full border border-secondary/25 bg-white px-8 py-3.5 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-primary/6 hover:text-primary"
            >
              Browse homes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
