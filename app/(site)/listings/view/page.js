import { Suspense } from "react";
import ListingViewGate from "./ListingViewGate";

export const metadata = { title: "Listing" };

export default function ListingViewPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center bg-[#f7f4ee] text-sm text-foreground/50">Loading…</div>}>
      <ListingViewGate />
    </Suspense>
  );
}
