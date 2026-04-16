"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { APP_DISPLAY_NAME } from "@/lib/brand";
import { DASHBOARD_NAV } from "@/lib/dashboardNav";
import { ApiError, fetchMe } from "@/lib/api";

function canAccessDashboard(role) {
  return role === "admin" || role === "owner";
}

function pathNorm(p) {
  if (!p) return "";
  return p.endsWith("/") ? p.slice(0, -1) : p;
}

function isNavActive(pathname, href) {
  const p = pathNorm(pathname);
  const h = pathNorm(href);
  if (h === "/dashboard") return p === "/dashboard";
  return p === h || p.startsWith(`${h}/`);
}

const NAV_ICONS = ["overview", "bookings", "payments", "mail", "quote", "users", "properties", "sparkles"];

function NavIcon({ name, className }) {
  const c = className;
  switch (name) {
    case "overview":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={c} aria-hidden>
          <path
            d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bookings":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={c} aria-hidden>
          <path
            d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    case "payments":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={c} aria-hidden>
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <path d="M2 10h20" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      );
    case "properties":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={c} aria-hidden>
          <path
            d="M3 10.5 12 3l9 7.5V21a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 21v-10.5z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "sparkles":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={c} aria-hidden>
          <path
            d="M12 3v2M12 19v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M3 12h2M19 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path d="M12 8l1.5 4.5L18 14l-4.5 1.5L12 20l-1.5-4.5L6 14l4.5-1.5L12 8z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={c} aria-hidden>
          <path
            d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path d="m22 8-10 7L2 8" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      );
    case "quote":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={c} aria-hidden>
          <path
            d="M9 8H5.5A1.5 1.5 0 0 0 4 9.5V13a3 3 0 0 0 3 3h2V8ZM20 8h-3.5A1.5 1.5 0 0 0 15 9.5V13a3 3 0 0 0 3 3h2V8Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path d="M9 16v1a3 3 0 0 1-3 3M20 16v1a3 3 0 0 1-3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={c} aria-hidden>
          <path
            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return <span className={c} aria-hidden />;
  }
}

export default function DashboardLayoutClient({ children }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState("loading");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMe();
        if (cancelled) return;
        const user = data?.user;
        if (!user) {
          setPhase("signed_out");
          return;
        }
        setPhase(canAccessDashboard(user.role) ? "ok" : "denied");
      } catch (e) {
        if (!cancelled) {
          if (e instanceof ApiError && e.status === 401) setPhase("signed_out");
          else setPhase("signed_out");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (phase === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f4f1ea]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/25 border-t-primary" aria-hidden />
          <p className="text-sm font-medium text-foreground/50">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (phase === "signed_out" || phase === "denied") {
    notFound();
  }

  return (
    <div className="flex min-h-dvh bg-[#f4f1ea] font-sans text-foreground">
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(17.5rem,88vw)] flex-col border-r border-secondary/10 bg-[#2a241c] text-white shadow-xl transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-white/10 px-4 lg:h-17">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 rounded-lg py-1 pr-2 transition hover:bg-white/5">
            <Image src="/logo.png" alt="" width={36} height={36} className="shrink-0 rounded-lg" />
            <span className="truncate text-lg font-semibold leading-tight text-white/95">
              {APP_DISPLAY_NAME}
            </span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
            onClick={() => setMobileNavOpen(false)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4" aria-label="Dashboard">
          {DASHBOARD_NAV.map((item, i) => {
            const active = isNavActive(pathname, item.href);
            const iconName = NAV_ICONS[i] || "overview";
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active ? "bg-primary/90 text-white shadow-md shadow-black/20" : "text-white/70 hover:bg-white/8 hover:text-white"
                }`}
              >
                <NavIcon
                  name={iconName}
                  className={`mt-0.5 h-5 w-5 shrink-0 ${active ? "text-white" : "text-white/55"}`}
                />
                <span className="min-w-0">
                  <span className="block font-semibold leading-snug">{item.label}</span>
                  <span className={`mt-0.5 block text-xs leading-snug ${active ? "text-white/85" : "text-white/45"}`}>
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            href="/account/"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Account
          </Link>
          <Link
            href="/"
            className="mt-2 flex w-full items-center justify-center rounded-xl px-3 py-2 text-xs font-medium text-white/50 transition hover:text-white/80"
          >
            ← View public site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-secondary/10 bg-[#fdfbf7]/95 px-4 backdrop-blur-md sm:px-6 lg:hidden">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-secondary/15 bg-white text-foreground shadow-sm"
            aria-label="Open menu"
            onClick={() => setMobileNavOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-lg font-semibold text-foreground/90">Dashboard</span>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div
            className={`mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 ${
              pathname?.startsWith("/dashboard/payments") ||
              pathname?.startsWith("/dashboard/bookings") ||
              pathname?.startsWith("/dashboard/contact-messages") ||
              pathname?.startsWith("/dashboard/users")
                ? "max-w-none"
                : "max-w-6xl"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
