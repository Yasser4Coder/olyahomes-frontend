import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <h1 className="text-4xl font-semibold text-foreground">404</h1>
      <p className="mt-4 text-foreground/70">
        This page does not exist or the listing was removed.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90"
      >
        Back home
      </Link>
    </div>
  );
}
