import Link from "next/link";

const footerLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/host", label: "Become a host" },
  { href: "/bookings", label: "Bookings" },
  { href: "/account", label: "Account" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-secondary/20 bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-primary">Olyahomes</p>
            <p className="mt-2 max-w-sm text-sm text-foreground/70">
              Curated home rentals for memorable stays. Book with confidence and
              host with support.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {footerLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-secondary underline-offset-4 hover:text-primary hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-10 text-center text-xs text-foreground/50 sm:text-left">
          © {new Date().getFullYear()} Olyahomes. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
