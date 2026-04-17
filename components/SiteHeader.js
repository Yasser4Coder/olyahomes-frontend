"use client";

import Image from "next/image";
import Link from "next/link";
import { APP_DISPLAY_NAME } from "@/lib/brand";
import { ApiError, fetchMe, logout as apiLogout } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const defaultNav = [
  { href: "/listings", label: "Browse homes" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/host", label: "Host" },
  { href: "/about", label: "About" },
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

/** `usePathname()` includes a trailing slash when `trailingSlash: true` in next.config. */
function pathnameKey(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function profileInitial(user) {
  const s = String(user?.fullName || user?.email || "?").trim();
  return s ? s.charAt(0).toUpperCase() : "?";
}

function canAccessDashboard(role) {
  return role === "admin" || role === "owner";
}

function HeartFavoritesNavLink({ solidBar, isFavoritesPage }) {
  return (
    <Link
      href="/favorites/"
      aria-label="View favorites"
      aria-current={isFavoritesPage ? "page" : undefined}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition active:scale-[0.97] ${
        solidBar
          ? isFavoritesPage
            ? "bg-rose-50 text-rose-600 ring-2 ring-rose-200/90"
            : "text-foreground/65 ring-1 ring-secondary/15 hover:bg-secondary/10 hover:text-rose-600"
          : isFavoritesPage
            ? "bg-white/25 text-white ring-2 ring-white/50"
            : "text-white/95 ring-1 ring-white/35 hover:bg-white/15 hover:text-white"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill={isFavoritesPage ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </Link>
  );
}

function HeaderAuthCluster({
  solidBar,
  isLoginPage,
  isSignupPage,
  isAccountPage,
  isGuestBookingsPage,
  isFavoritesPage,
  isDashboardPage,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMe();
        if (!cancelled) setSessionUser(data?.user ?? null);
      } catch (e) {
        if (!cancelled) {
          if (e instanceof ApiError && e.status === 401) setSessionUser(null);
          else setSessionUser(null);
        }
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onPointer = (e) => {
      const el = menuRef.current;
      if (el && !el.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [menuOpen]);

  const clusterClass =
    "flex shrink-0 items-center justify-end gap-2 sm:gap-3 md:justify-self-end";

  if (!authReady) {
    return (
      <div className={clusterClass}>
        <HeartFavoritesNavLink solidBar={solidBar} isFavoritesPage={isFavoritesPage} />
        <div
          className={`h-10 w-10 shrink-0 animate-pulse rounded-full ${
            solidBar ? "bg-secondary/25" : "bg-white/25"
          }`}
          aria-hidden
        />
      </div>
    );
  }

  if (sessionUser) {
    const letter = profileInitial(sessionUser);
    const display = sessionUser.fullName || sessionUser.email || "Account";
    return (
      <div className={`relative ${clusterClass}`} ref={menuRef}>
        <HeartFavoritesNavLink solidBar={solidBar} isFavoritesPage={isFavoritesPage} />
        <button
          type="button"
          id="site-header-user-menu"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label={`Account menu for ${display}`}
          onClick={() => setMenuOpen((o) => !o)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-md ring-2 transition hover:opacity-95 active:scale-[0.97] ${
            solidBar
              ? "bg-primary text-white ring-primary/35 hover:bg-primary/90"
              : "bg-white/95 text-primary ring-white/45 hover:bg-white"
          } ${
            menuOpen || isAccountPage || isGuestBookingsPage || isFavoritesPage || isDashboardPage
              ? "ring-offset-2 ring-offset-neutral"
              : ""
          }`}
        >
          <span aria-hidden>{letter}</span>
        </button>

        {menuOpen ? (
          <div
            className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] min-w-[13.5rem] overflow-hidden rounded-xl border border-secondary/15 bg-white py-1 shadow-[0_16px_48px_-12px_rgba(44,36,25,0.22)] ring-1 ring-black/5"
            role="menu"
            aria-labelledby="site-header-user-menu"
          >
            <div className="border-b border-secondary/10 px-3 py-2.5">
              <p className="truncate text-xs font-semibold text-foreground">{display}</p>
              {sessionUser.email ? (
                <p className="truncate text-[0.7rem] text-foreground/50">{sessionUser.email}</p>
              ) : null}
            </div>
            <Link
              href="/account/"
              role="menuitem"
              className="block px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary/10"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/bookings/"
              role="menuitem"
              className="block px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary/10"
              onClick={() => setMenuOpen(false)}
            >
              My bookings
            </Link>
            {sessionUser.role === "client" ? (
              <Link
                href="/favorites/"
                role="menuitem"
                className="block px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary/10"
                onClick={() => setMenuOpen(false)}
              >
                Favorites
              </Link>
            ) : null}
            {canAccessDashboard(sessionUser.role) ? (
              <Link
                href="/dashboard/"
                role="menuitem"
                className="block px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary/10"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : null}
            <button
              type="button"
              role="menuitem"
              disabled={logoutBusy}
              className="mt-1 flex w-full items-center border-t border-secondary/10 px-3 py-2.5 text-left text-sm font-medium text-red-800/90 transition hover:bg-red-500/10 disabled:opacity-50"
              onClick={async () => {
                setLogoutBusy(true);
                try {
                  await apiLogout();
                } catch {
                  /* still clear local session UI */
                } finally {
                  setSessionUser(null);
                  setMenuOpen(false);
                  setLogoutBusy(false);
                  router.refresh();
                }
              }}
            >
              {logoutBusy ? "Signing out…" : "Log out"}
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={clusterClass}>
      <HeartFavoritesNavLink solidBar={solidBar} isFavoritesPage={isFavoritesPage} />
      <Link
        href="/login/"
        aria-current={isLoginPage ? "page" : undefined}
        className={
          solidBar
            ? `whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium sm:px-3 ${
                isLoginPage
                  ? "bg-secondary/15 text-foreground"
                  : "text-secondary hover:bg-secondary/10"
              }`
            : "whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium text-white/95 transition [text-shadow:0_1px_3px_rgba(0,0,0,0.45)] hover:text-white sm:px-3"
        }
      >
        Log in
      </Link>
      <Link
        href="/signup/"
        aria-current={isSignupPage ? "page" : undefined}
        className={
          solidBar
            ? `inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold shadow-md ring-1 transition active:scale-[0.98] sm:min-h-0 sm:px-5 ${
                isSignupPage
                  ? "bg-secondary/20 text-foreground ring-secondary/25"
                  : "bg-primary text-white shadow-primary/25 ring-primary/20 hover:bg-primary/90"
              }`
            : "inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#d4b896] px-4 py-2 text-sm font-semibold text-zinc-900 shadow-lg shadow-black/25 ring-1 ring-white/25 transition hover:bg-[#e5cfae] active:scale-[0.98] sm:min-h-0 sm:px-5"
        }
      >
        Sign up
      </Link>
    </div>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const key = pathnameKey(pathname);
  const isLandingHome = key === "/";
  const isListings = key.startsWith("/listings");
  const isAboutPage = key === "/about";
  const isContactPage = key === "/contact";
  const isHowItWorksPage = key === "/how-it-works";
  const isLoginPage = key === "/login";
  const isSignupPage = key === "/signup";
  const isTermsPage = key === "/terms";
  const isPrivacyPage = key === "/privacy";
  const isPolicyPage = key === "/policy";
  const isAccountPage = key === "/account";
  const isGuestBookingsPage = key === "/bookings";
  const isFavoritesPage = key === "/favorites";
  const isDashboardPage = key === "/dashboard";
  /** Same header chrome + nav as home & listings (Home / Browse / …), incl. mobile second row. */
  const usesHomeNavItems =
    isLandingHome ||
    isListings ||
    isAboutPage ||
    isContactPage ||
    isHowItWorksPage ||
    isLoginPage ||
    isSignupPage ||
    isTermsPage ||
    isPrivacyPage ||
    isPolicyPage ||
    isAccountPage ||
    isGuestBookingsPage ||
    isFavoritesPage ||
    isDashboardPage;
  const [homeScrolled, setHomeScrolled] = useState(false);
  const headerRef = useRef(null);
  const items = usesHomeNavItems ? homeNav : defaultNav;
  const solidBar =
    isListings ||
    isAboutPage ||
    isContactPage ||
    isHowItWorksPage ||
    isLoginPage ||
    isSignupPage ||
    isTermsPage ||
    isPrivacyPage ||
    isPolicyPage ||
    isAccountPage ||
    isGuestBookingsPage ||
    isFavoritesPage ||
    isDashboardPage ||
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

  /** Keep <main> padding in sync with actual header height (mobile has a second nav row). */
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const apply = () => {
      document.documentElement.style.setProperty(
        "--site-header-offset",
        `${header.offsetHeight}px`,
      );
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(header);
    window.addEventListener("resize", apply);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [key, solidBar, usesHomeNavItems]);

  const headerChrome = solidBar
    ? "bg-neutral/92 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.7)] backdrop-blur-2xl backdrop-saturate-150 supports-backdrop-filter:bg-neutral/[0.52]"
    : "bg-transparent";

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 ${headerChrome}`}
    >
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
            alt={APP_DISPLAY_NAME}
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
            <HeaderAuthCluster
              solidBar
              isLoginPage={isLoginPage}
              isSignupPage={isSignupPage}
              isAccountPage={isAccountPage}
              isGuestBookingsPage={isGuestBookingsPage}
              isFavoritesPage={isFavoritesPage}
              isDashboardPage={isDashboardPage}
            />
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
            <HeaderAuthCluster
              solidBar={false}
              isLoginPage={isLoginPage}
              isSignupPage={isSignupPage}
              isAccountPage={isAccountPage}
              isGuestBookingsPage={isGuestBookingsPage}
              isFavoritesPage={isFavoritesPage}
              isDashboardPage={isDashboardPage}
            />
          </>
        )}
      </div>

      {usesHomeNavItems ? (
        <nav
          className={`flex gap-2 overflow-x-auto bg-transparent px-4 py-2 md:hidden ${
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
