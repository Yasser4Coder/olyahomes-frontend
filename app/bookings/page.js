import { Suspense } from "react";
import BookingsContent from "./BookingsContent";

export const metadata = { title: "Bookings" };

export default function BookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 text-foreground/65">
          Loading…
        </div>
      }
    >
      <BookingsContent />
    </Suspense>
  );
}
