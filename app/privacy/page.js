import PageHeading from "@/components/PageHeading";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeading
        title="Privacy policy"
        subtitle="Replace this placeholder with your legal text before launch."
      />
      <div className="space-y-4 text-sm text-foreground/75">
        <p>
          Olyahomes respects your privacy. This page is a structural stub: add
          sections for data collection, cookies, third parties, and user rights
          as required in your jurisdiction.
        </p>
        <p>
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
    </div>
  );
}
