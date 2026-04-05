import PageHeading from "@/components/PageHeading";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeading
        title="Terms of service"
        subtitle="Placeholder terms—have counsel review before production."
      />
      <div className="space-y-4 text-sm text-foreground/75">
        <p>
          These terms govern use of the Olyahomes website and services. Outline
          booking obligations, cancellation policies, host responsibilities, and
          limitation of liability in your final document.
        </p>
      </div>
    </div>
  );
}
