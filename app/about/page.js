import PageHeading from "@/components/PageHeading";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeading
        title="About Olyahomes"
        subtitle="We help travelers find welcoming homes and help hosts share their spaces with clarity and care."
      />
      <div className="max-w-none space-y-4 text-foreground/80">
        <p>
          Olyahomes is built around simple booking flows, transparent pricing,
          and support for both guests and hosts. This site is a front-end
          foundation—you can connect APIs, payments, and calendars when you are
          ready.
        </p>
        <p>
          Our palette reflects warmth and earth tones so the experience feels
          calm and residential, not corporate.
        </p>
      </div>
    </div>
  );
}
