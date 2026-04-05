import Link from "next/link";
import PageHeading from "@/components/PageHeading";

export const metadata = { title: "Become a host" };

export default function HostPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeading
        title="Host on Olyahomes"
        subtitle="Share your place with travelers who appreciate thoughtful spaces. This page is ready for your onboarding story and requirements."
      />
      <ul className="mt-8 space-y-3 text-foreground/80">
        <li className="flex gap-2">
          <span className="text-primary">✓</span>
          Set your nightly rate and availability
        </li>
        <li className="flex gap-2">
          <span className="text-primary">✓</span>
          House rules and guest expectations in one profile
        </li>
        <li className="flex gap-2">
          <span className="text-primary">✓</span>
          Messaging and booking alerts (connect your stack)
        </li>
      </ul>
      <Link
        href="/signup"
        className="mt-10 inline-flex rounded-xl bg-secondary px-6 py-3 font-semibold text-white transition hover:bg-secondary/90"
      >
        Start hosting
      </Link>
    </div>
  );
}
