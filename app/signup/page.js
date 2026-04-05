import Link from "next/link";
import PageHeading from "@/components/PageHeading";

export const metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <PageHeading title="Create an account" subtitle="Join Olyahomes to book and host." />
      <form className="mt-8 space-y-4 rounded-2xl border border-secondary/15 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="su-name" className="block text-sm font-medium">
            Full name
          </label>
          <input
            id="su-name"
            type="text"
            autoComplete="name"
            className="mt-1 w-full rounded-lg border border-secondary/25 bg-neutral px-3 py-2 outline-none ring-primary focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="su-email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="su-email"
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-secondary/25 bg-neutral px-3 py-2 outline-none ring-primary focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="su-password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="su-password"
            type="password"
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-secondary/25 bg-neutral px-3 py-2 outline-none ring-primary focus:ring-2"
          />
        </div>
        <button
          type="button"
          className="w-full rounded-xl bg-primary py-3 font-semibold text-white hover:bg-primary/90"
        >
          Create account (wire up later)
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-foreground/65">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
