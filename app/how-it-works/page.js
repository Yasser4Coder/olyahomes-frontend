import PageHeading from "@/components/PageHeading";

export const metadata = { title: "How it works" };

const steps = [
  {
    title: "Search and compare",
    body: "Browse homes by location, size, and price. Each listing is structured for photos, amenities, and house rules when you add them.",
  },
  {
    title: "Book your dates",
    body: "Pick check-in and check-out, review the total, and confirm. Payment and calendar sync will plug into this flow on the backend.",
  },
  {
    title: "Check in and enjoy",
    body: "Get directions and host notes in one place. After your stay, leave feedback to help the next guest.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeading
        title="How it works"
        subtitle="Three steps from browsing to unpacking—designed to stay simple as you grow the product."
      />
      <ol className="mt-4 space-y-8">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="flex gap-4 rounded-2xl border border-secondary/15 bg-white p-6 shadow-sm"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
              {i + 1}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {step.title}
              </h2>
              <p className="mt-2 text-foreground/75">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
