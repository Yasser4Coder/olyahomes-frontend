"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

/** Past this scroll offset on home, use the same solid bar as inner pages (readable on white sections). */
const HOME_SCROLL_SOLID = 48;

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [homeScrolled, setHomeScrolled] = useState(false);
  const items = isHome ? homeNav : defaultNav;
  const solidBar = !isHome || homeScrolled;

  useEffect(() => {
    if (!isHome) {
      setHomeScrolled(false);
      return;
    }
    const onScroll = () => {
      setHomeScrolled(window.scrollY > HOME_SCROLL_SOLID);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const headerChrome = solidBar
    ? "border-b border-black/[0.06] bg-neutral/92 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.7)] backdrop-blur-2xl backdrop-saturate-150 supports-backdrop-filter:bg-neutral/[0.52]"
    : "border-b border-white/[0.18] bg-white/25 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.35)] backdrop-blur-2xl backdrop-saturate-150 supports-backdrop-filter:bg-white/[0.12]";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 ${headerChrome}`}>
      <div
        className={`mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 ${
          isHome && !solidBar
            ? "justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8"
            : ""
        }`}
      >
        <Link
          href="/"
          className={
            solidBar
              ? "flex shrink-0 items-center gap-2.5 text-primary hover:opacity-90"
              : "flex shrink-0 items-center gap-2.5 text-white hover:opacity-90 md:justify-self-start"
          }
        >
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            sizes="36px"
            className={`h-9 w-9 shrink-0 object-contain ${
              solidBar ? "" : "drop-shadow-md"
            }`}
          />
          <span className="text-lg font-bold tracking-tight">Olyahomes</span>
        </Link>

        {solidBar ? (
          <>
            <nav
              className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex"
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
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-secondary/10 hover:text-foreground ${
                      active ? "text-foreground" : "text-foreground/80"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
            <nav
              className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto md:hidden"
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
                    className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium hover:bg-secondary/10 ${
                      active ? "text-foreground" : "text-foreground/80"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
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
        ) : (
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
                    className="relative px-3 py-2 text-sm font-medium text-white/95 transition [text-shadow:0_1px_2px_rgba(0,0,0,0.45)] hover:text-white"
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
            <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 md:justify-self-end">
              <Link
                href="/login"
                className="rounded-lg px-2.5 py-2 text-xs font-semibold text-white/95 transition [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] hover:bg-white/10 hover:text-white sm:px-3 sm:text-sm sm:font-medium"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-zinc-900 shadow-md transition hover:bg-zinc-100 sm:px-4 md:rounded-lg md:py-2 md:text-sm"
              >
                Sign up
              </Link>
            </div>
          </>
        )}
      </div>

      {isHome ? (
        <nav
          className={`flex gap-2 overflow-x-auto px-4 py-2 md:hidden ${
            solidBar
              ? "border-t border-secondary/15"
              : "border-t border-white/[0.14]"
          }`}
          aria-label="Main mobile"
        >
          {items.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href) && href !== "/";
            if (solidBar) {
              return (
                <Link
                  key={href}
                  href={href}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                    active
                      ? "bg-secondary/15 text-foreground"
                      : "text-foreground/75 hover:bg-secondary/10"
                  }`}
                >
                  {label}
                </Link>
              );
            }
            return (
              <Link
                key={href}
                href={href}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] ${
                  active
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:bg-white/10"
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
