"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import { ApiError, fetchDashboardOverview } from "@/lib/api";
import { formatAEDAmount } from "@/lib/currency";

function statusPill(status) {
  const map = {
    confirmed: "bg-emerald-500/15 text-emerald-800 ring-emerald-500/25",
    pending_payment: "bg-amber-500/15 text-amber-900 ring-amber-500/25",
    pending_host: "bg-amber-500/15 text-amber-900 ring-amber-500/25",
    completed: "bg-primary/12 text-primary ring-primary/20",
    cancelled: "bg-foreground/8 text-foreground/55 ring-foreground/10",
    rejected: "bg-zinc-400/15 text-zinc-800 ring-zinc-500/20",
  };
  const cls = map[status] || "bg-foreground/8 text-foreground/60 ring-foreground/10";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ring-1 ${cls}`}>
      {String(status || "").replace(/_/g, " ")}
    </span>
  );
}

export default function DashboardOverviewFromApi() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const body = await fetchDashboardOverview();
        if (!cancelled) setData(body);
      } catch (e) {
        if (!cancelled) setErr(e instanceof ApiError ? e.message : "Overview unavailable");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const kpis = data?.kpis || {};
  const kpiCards = useMemo(
    () => [
      {
        label: "Bookings (30d)",
        value: String(kpis.bookings30d ?? 0),
        hint: "All statuses",
      },
      {
        label: "Confirmed stays (30d)",
        value: String(kpis.confirmed30d ?? 0),
        hint: "Confirmed + completed",
      },
      {
        label: "Gross volume (30d)",
        value: formatAEDAmount(kpis.gross30d ?? 0),
        hint: "Succeeded payments",
      },
      {
        label: "Active listings",
        value: String(kpis.activeListings ?? 0),
        hint: "Published",
      },
    ],
    [kpis],
  );

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/70" />
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="h-64 animate-pulse rounded-2xl bg-white/70 lg:col-span-3" />
          <div className="h-64 animate-pulse rounded-2xl bg-white/70 lg:col-span-2" />
        </div>
        <div className="h-56 animate-pulse rounded-2xl bg-white/70" />
      </div>
    );
  }

  if (err || !data) {
    return (
      <div className="rounded-2xl border border-secondary/12 bg-white p-6 text-sm text-foreground/60 shadow-sm">
        {err || "Overview unavailable"}
      </div>
    );
  }

  const volume = Array.isArray(data.bookingVolume7d) ? data.bookingVolume7d : [];
  const max = Math.max(1, ...volume.map((d) => Number(d.count) || 0));
  const outcomes = Array.isArray(data.paymentOutcomes30d) ? data.paymentOutcomes30d : [];
  const recent = Array.isArray(data.recentBookings) ? data.recentBookings : [];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((s) => (
          <DashboardStatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm lg:col-span-3">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Booking volume</h2>
              <p className="mt-1 text-sm text-foreground/55">Last 7 days (created bookings).</p>
            </div>
          </div>
          <div className="mt-8 flex h-44 items-end justify-between gap-2 border-b border-secondary/10 pb-2 pl-1 pr-1">
            {volume.map((d, i) => {
              const h = Math.max(12, Math.round(((Number(d.count) || 0) / max) * 100));
              const label = String(d.day || "").slice(5);
              return (
                <div key={`${d.day}-${i}`} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[0.65rem] font-semibold tabular-nums text-foreground/45">
                    {Number(d.count) || 0}
                  </span>
                  <div
                    className="w-full max-w-11 rounded-t-lg bg-linear-to-t from-primary/85 to-primary/40"
                    style={{ height: `${h}%` }}
                    title={`${d.day}: ${d.count}`}
                  />
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-foreground/40">{label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold text-foreground">Payment outcomes</h2>
          <p className="mt-1 text-sm text-foreground/55">Last 30 days.</p>
          <div className="mt-6 space-y-4">
            {outcomes.map((row) => (
              <div key={row.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-foreground/80">{row.label}</span>
                  <span className="text-foreground/50">{row.pct}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-foreground/8">
                  <div className={`h-full rounded-full ${row.tone}`} style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10 overflow-hidden rounded-2xl border border-secondary/12 bg-white shadow-sm">
        <div className="border-b border-secondary/10 px-6 py-5">
          <h2 className="text-xl font-semibold text-foreground">Recent bookings</h2>
          <p className="mt-1 text-sm text-foreground/55">Latest 10 bookings in your scope.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-secondary/10 bg-neutral/40 text-[0.65rem] font-bold uppercase tracking-wide text-foreground/45">
                <th className="px-6 py-3">Ref</th>
                <th className="px-6 py-3">Guest</th>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Dates</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id} className="border-b border-secondary/8 last:border-0 hover:bg-primary/5">
                  <td className="px-6 py-3.5 font-mono text-xs font-semibold text-foreground/70">{row.id}</td>
                  <td className="px-6 py-3.5">
                    <div className="font-medium text-foreground">{row.guest?.fullName || "Guest"}</div>
                    <div className="text-xs text-foreground/50">{row.guest?.email || "—"}</div>
                  </td>
                  <td className="px-6 py-3.5 text-foreground/70">{row.property?.title || "—"}</td>
                  <td className="px-6 py-3.5 text-foreground/60">
                    {row.checkIn} → {row.checkOut}
                  </td>
                  <td className="px-6 py-3.5">{statusPill(row.status)}</td>
                  <td className="px-6 py-3.5 text-right font-semibold text-foreground/80">
                    {row.totalAmount != null ? formatAEDAmount(row.totalAmount) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

