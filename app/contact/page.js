import PageHeading from "@/components/PageHeading";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <PageHeading
        title="Contact us"
        subtitle="Questions about a listing or hosting? Send a message and we will route it to the right team."
      />
      <form className="mt-8 space-y-4 rounded-2xl border border-secondary/15 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="mt-1 w-full rounded-lg border border-secondary/25 bg-neutral px-3 py-2 text-foreground outline-none ring-primary focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-secondary/25 bg-neutral px-3 py-2 text-foreground outline-none ring-primary focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="mt-1 w-full rounded-lg border border-secondary/25 bg-neutral px-3 py-2 text-foreground outline-none ring-primary focus:ring-2"
          />
        </div>
        <button
          type="button"
          className="w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary/90"
        >
          Send (wire up later)
        </button>
      </form>
    </div>
  );
}
