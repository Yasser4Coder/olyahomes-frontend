"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const defaultNav = [
  { href: "/listings", label: "Browse homes" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/host", label: "Host" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const homeNav = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Browse" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const items = isHome ? homeNav : defaultNav;

  return (
    <header
      className={
        isHome
          ? "fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/15 backdrop-blur-md"
          : "fixed inset-x-0 top-0 z-50 border-b border-secondary/20 bg-neutral/95 backdrop-blur supports-backdrop-filter:bg-neutral/85"
      }
    >
      <div
        className={`mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 ${
          isHome ? "justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8" : ""
        }`}
      >
        <Link
          href="/"
          className={
            isHome
              ? "flex shrink-0 items-center gap-2.5 text-white hover:opacity-90 md:justify-self-start"
              : "flex shrink-0 items-center gap-2.5 text-primary hover:opacity-90"
          }
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm"
            aria-hidden
          >
            <span className="h-4 w-4 rotate-45 rounded-sm bg-white/90" />
          </span>
          <span className="text-lg font-bold tracking-tight">Olyahomes</span>
        </Link>

        {isHome ? (
          <>
            <nav
              className="hidden items-center justify-center gap-1 justify-self-center md:flex"
              aria-label="Main"
            >
              {items.map(({ href, label }) => {
                const active =
                  href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(href) && href !== "/";
                return (
                  <Link
                    key={href}
                    href={href}
                    className="relative px-3 py-2 text-sm font-medium text-white/90 transition hover:text-white"
                  >
                    {active ? (
                      <span
                        className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                        aria-hidden
                      />
                    ) : null}
                    <span className={active ? "text-white" : ""}>{label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="flex shrink-0 justify-end md:justify-self-end">
              <Link
                href="/signup"
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-900 shadow-md transition hover:bg-zinc-100 md:px-6 md:py-2.5 md:text-sm"
              >
                Get started
              </Link>
            </div>
          </>
        ) : (
          <>
            <nav
              className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex"
              aria-label="Main"
            >
              {items.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-secondary/10 hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <nav
              className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto md:hidden"
              aria-label="Main mobile"
            >
              {items.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground/80 hover:bg-secondary/10"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:bg-secondary/10"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                Sign up
              </Link>
            </div>
          </>
        )}
      </div>

      {isHome ? (
        <nav
          className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-2 md:hidden"
          aria-label="Main mobile"
        >
          {items.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href) && href !== "/";
            return (
              <Link
                key={href}
                href={href}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                  active
                    ? "bg-white/20 text-white"
                    : "text-white/75 hover:bg-white/10"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
