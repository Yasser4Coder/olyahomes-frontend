import PageHeading from "@/components/PageHeading";

export const metadata = { title: "FAQ" };

const faqs = [
  {
    q: "How do I book a home?",
    a: "Browse listings, open a property you like, and use Request to book. You will complete dates and payment when the backend is connected.",
  },
  {
    q: "Can I cancel a reservation?",
    a: "Cancellation rules will follow each listing’s policy. Add policy text to listing detail and enforce via your API.",
  },
  {
    q: "How does hosting work?",
    a: "Start from Become a host, create a listing, and set pricing and availability. Guest messaging and payouts integrate next.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeading
        title="Frequently asked questions"
        subtitle="Quick answers while the product grows—swap in real support content anytime."
      />
      <ul className="mt-6 space-y-4">
        {faqs.map((item) => (
          <li
            key={item.q}
            className="rounded-2xl border border-secondary/15 bg-white p-6 shadow-sm"
          >
            <h2 className="font-semibold text-foreground">{item.q}</h2>
            <p className="mt-2 text-foreground/75">{item.a}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
