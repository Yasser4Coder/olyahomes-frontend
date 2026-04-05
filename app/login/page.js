import Link from "next/link";
import PageHeading from "@/components/PageHeading";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <PageHeading title="Log in" subtitle="Welcome back to Olyahomes." />
      <form className="mt-8 space-y-4 rounded-2xl border border-secondary/15 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-secondary/25 bg-neutral px-3 py-2 outline-none ring-primary focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-secondary/25 bg-neutral px-3 py-2 outline-none ring-primary focus:ring-2"
          />
        </div>
        <button
          type="button"
          className="w-full rounded-xl bg-primary py-3 font-semibold text-white hover:bg-primary/90"
        >
          Log in (wire up later)
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-foreground/65">
        No account?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
