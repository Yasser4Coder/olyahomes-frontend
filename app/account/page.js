import PageHeading from "@/components/PageHeading";

export const metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeading
        title="Your account"
        subtitle="Profile, payment methods, and notification preferences can live on this screen."
      />
      <div className="rounded-2xl border border-secondary/15 bg-white p-6 shadow-sm">
        <p className="text-foreground/75">
          Placeholder layout: tabs for Profile, Security, and Payouts (for hosts)
          map cleanly onto this route.
        </p>
      </div>
    </div>
  );
}
