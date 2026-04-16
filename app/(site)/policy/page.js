import Link from "next/link";
import PageHeading from "@/components/PageHeading";
import { APP_DISPLAY_NAME } from "@/lib/brand";

const LAST_UPDATED = "April 15, 2026";

export const metadata = {
  title: "Refund & cancellation policy",
  description: `How cancellations and refunds work for stays booked on ${APP_DISPLAY_NAME}.`,
};

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-foreground/75">{children}</div>
    </section>
  );
}

export default function PolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeading
        title="Refund & cancellation policy"
        subtitle="How guest cancellations and refunds work on our platform. Amounts are calculated on our servers when you cancel — never trust a price shown only in your browser."
      />
      <p className="mb-10 text-sm text-foreground/60">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-10">
        <p className="text-sm leading-relaxed text-foreground/80">
          This policy applies to short-term stays booked through <strong className="text-foreground/90">{APP_DISPLAY_NAME}</strong> when
          payment is collected securely (for example via Stripe). All refund <strong>amounts</strong> and <strong>eligibility</strong> are
          determined on our servers using your booking time, check-in date, and payment status.
        </p>

        <Section id="how" title="How to cancel">
          <p>
            Signed-in guests can request cancellation from <strong>My Bookings</strong> ({""}
            <Link href="/bookings/" className="font-medium text-primary underline-offset-2 hover:underline">
              /bookings
            </Link>
            ). You will be asked for a reason; we use that for support and quality only — the refund amount still follows the rules below.
          </p>
        </Section>

        <Section id="clock" title="How we measure time">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Check-in</strong> is your stay&apos;s check-in <strong>date</strong> (the calendar day on the booking). For policy timing we
              use that date at <strong>12:00 UTC</strong> as the reference point for “hours until check-in”.
            </li>
            <li>
              <strong>Booking time</strong> is when the booking record was created on our system — used for the one-hour grace window below.
            </li>
          </ul>
        </Section>

        <Section id="rules" title="Refund tiers (paid bookings)">
          <p>If your stay was <strong>paid</strong> (successful payment for that booking), refunds follow this order:</p>
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <strong>One-hour grace:</strong> If you cancel within <strong>one hour</strong> of placing the booking, you receive a{" "}
              <strong>full refund</strong> of the stay total we charged, regardless of how close check-in is.
            </li>
            <li>
              <strong>More than 48 hours before check-in</strong> (by the clock above): <strong>full refund</strong> of the stay total.
            </li>
            <li>
              <strong>More than 24 hours, but 48 hours or less, before check-in:</strong> <strong>50% refund</strong> of the stay total.
            </li>
            <li>
              <strong>24 hours or less before check-in:</strong> <strong>No refund.</strong> You may still cancel to release the dates for
              other guests, but the stay is non-refundable under this policy.
            </li>
          </ol>
          <p className="pt-2">
            We never refund more than you actually paid for that booking. If a partial refund applies, we send only that portion back through
            Stripe.
          </p>
        </Section>

        <Section id="unpaid" title="Unpaid or not-yet-paid bookings">
          <p>
            If you have not completed payment (for example you have not finished checkout), you can cancel to release the dates.{" "}
            <strong>No payment means there is nothing to refund.</strong>
          </p>
        </Section>

        <Section id="stripe" title="Payments & timing">
          <ul className="list-disc space-y-2 pl-5">
            <li>Refunds are issued to your <strong>original payment method</strong> (card or method used at checkout).</li>
            <li>
              After we initiate a refund, it often appears in <strong>5–10 business days</strong>, depending on your bank or card network.
            </li>
            <li>All amounts are processed in <strong>AED</strong> as shown on your booking and receipt.</li>
          </ul>
        </Section>

        <Section id="changes" title="Changes & help">
          <p>
            We may update this page from time to time. The policy that applies is the one published here at the time you request cancellation,
            subject to any mandatory consumer rights in your jurisdiction.
          </p>
          <p>
            Questions?{" "}
            <Link href="/contact/" className="font-medium text-primary underline-offset-2 hover:underline">
              Contact us
            </Link>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
