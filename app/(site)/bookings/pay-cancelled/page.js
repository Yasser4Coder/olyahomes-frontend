import Link from "next/link";

export const metadata = { title: "Payment cancelled" };

export default function PayCancelledPage() {
  return (
    <div className="min-h-[60vh] bg-[#fdfbf7]">
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-secondary/15 bg-white p-8 text-center shadow-sm">
          <p className="text-3xl" aria-hidden>
            ❌
          </p>
          <h1 className="font-hero-serif mt-4 text-xl font-semibold text-foreground">Payment not completed</h1>
          <p className="mt-3 text-sm text-foreground/70">
            You left checkout before paying. Nothing was charged. You can try again from My bookings whenever you are
            ready.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/bookings/"
              className="inline-flex justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
            >
              Try again
            </Link>
            <Link
              href="/listings/"
              className="inline-flex justify-center rounded-full border border-secondary/25 px-6 py-3 text-sm font-semibold text-foreground"
            >
              Back to listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
