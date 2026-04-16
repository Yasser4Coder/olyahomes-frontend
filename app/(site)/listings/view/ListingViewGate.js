"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ListingDetailClient from "@/app/(site)/listings/ListingDetailClient";

export default function ListingViewGate() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug")?.trim() ?? "";

  if (!slug) {
    return (
      <div className="min-h-[50vh] bg-[#f7f4ee] px-4 py-16 text-center">
        <p className="font-hero-serif text-lg font-semibold text-foreground">No listing selected</p>
        <p className="mt-2 text-sm text-foreground/60">Add <code className="rounded bg-neutral/80 px-1 font-mono text-xs">?slug=your-listing-slug</code> to the URL.</p>
        <Link href="/listings/" className="mt-6 inline-block text-sm font-semibold text-primary underline">
          Browse all listings
        </Link>
      </div>
    );
  }

  return <ListingDetailClient slug={slug} />;
}
