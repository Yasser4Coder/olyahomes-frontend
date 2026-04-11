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
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Past this scroll offset on home, use the same solid bar as inner pages (readable on white sections). */
const HOME_SCROLL_SOLID = 48;

export default function SiteHeader() {
  const pathname = usePathname();
  const isLandingHome = pathname === "/";
  const isListings = pathname?.startsWith("/listings");
  const isAboutPage = pathname === "/about";
  const isContactPage = pathname === "/contact";
  const isHowItWorksPage = pathname === "/how-it-works";
  /** Same header chrome + nav as home & listings (Home / Browse / …), incl. mobile second row. */
  const usesHomeNavItems =
    isLandingHome ||
    isListings ||
    isAboutPage ||
    isContactPage ||
    isHowItWorksPage;
  const [homeScrolled, setHomeScrolled] = useState(false);
  const items = usesHomeNavItems ? homeNav : defaultNav;
  const solidBar =
    isListings ||
    isAboutPage ||
    isContactPage ||
    isHowItWorksPage ||
    !isLandingHome ||
    homeScrolled;

  useEffect(() => {
    if (!isLandingHome) {
      setHomeScrolled(false);
      return;
    }
    const onScroll = () => {
      setHomeScrolled(window.scrollY > HOME_SCROLL_SOLID);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLandingHome]);

  const headerChrome = solidBar
    ? "bg-neutral/92 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.7)] backdrop-blur-2xl backdrop-saturate-150 supports-backdrop-filter:bg-neutral/[0.52]"
    : "bg-transparent";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 ${headerChrome}`}>
      <div
        className={`mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 ${
          isLandingHome && !solidBar
            ? "justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8"
            : solidBar && usesHomeNavItems
              ? "max-md:justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8"
              : ""
        }`}
      >
        <Link
          href="/"
          className={
            solidBar
              ? "flex shrink-0 items-center transition hover:opacity-90 md:justify-self-start"
              : "flex shrink-0 items-center md:justify-self-start"
          }
        >
          <Image
            src="/logo-big.png"
            alt="Olyahomes"
            width={248}
            height={54}
            sizes="(max-width: 640px) 48vw, 248px"
            priority
            className={`h-9 w-auto max-w-[min(13rem,52vw)] object-contain object-left sm:h-10 sm:max-w-60 ${
              solidBar ? "" : "drop-shadow-[0_2px_14px_rgba(0,0,0,0.4)]"
            }`}
          />
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
            {/* Home mobile: links live in the second row only — avoids duplicating nav beside auth */}
            <nav
              className={`min-w-0 flex-1 items-center gap-1 overflow-x-auto md:hidden ${
                usesHomeNavItems ? "hidden" : "flex"
              }`}
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
            <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3 md:justify-self-end">
              <Link
                href="/login"
                className="whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium text-secondary hover:bg-secondary/10 sm:px-3"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 ring-1 ring-primary/20 transition hover:bg-primary/90 active:scale-[0.98] sm:min-h-0 sm:px-5"
              >
                Sign up
              </Link>
            </div>
          </>
        ) : (
          <>
            <nav
              className="hidden items-center justify-center gap-0.5 justify-self-center md:flex"
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
                    className={`relative px-3 py-2.5 text-sm font-medium transition [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] ${
                      active
                        ? "text-white"
                        : "text-white/88 hover:text-white"
                    }`}
                  >
                    {label}
                    <span
                      className={`absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary transition-opacity ${
                        active ? "opacity-100" : "opacity-0 hover:opacity-40"
                      }`}
                      aria-hidden
                    />
                  </Link>
                );
              })}
            </nav>
            <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3 md:justify-self-end">
              <Link
                href="/login"
                className="whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium text-white/95 transition [text-shadow:0_1px_3px_rgba(0,0,0,0.45)] hover:text-white sm:px-3"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#d4b896] px-4 py-2 text-sm font-semibold text-zinc-900 shadow-lg shadow-black/25 ring-1 ring-white/25 transition hover:bg-[#e5cfae] active:scale-[0.98] sm:min-h-0 sm:px-5"
              >
                Sign up
              </Link>
            </div>
          </>
        )}
      </div>

      {usesHomeNavItems ? (
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
