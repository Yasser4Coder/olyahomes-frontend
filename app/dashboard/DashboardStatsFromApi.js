"use client";

import { useEffect, useState } from "react";
import { ApiError, fetchDashboardSummary } from "@/lib/api";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";

export default function DashboardStatsFromApi() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const body = await fetchDashboardSummary();
        if (!cancelled) setData(body);
      } catch (e) {
        if (!cancelled) setErr(e instanceof ApiError ? e.message : "Stats unavailable");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/70" />
        ))}
      </div>
    );
  }

  if (err || !data) {
    return (
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardStatCard
          label="Live stats"
          value="—"
          hint={err || "Loading or not configured…"}
          trend="Run API + DB sync to populate"
        />
      </div>
    );
  }

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <DashboardStatCard label="Total properties" value={String(data.totalProperties ?? "0")} hint="All statuses" />
      <DashboardStatCard label="Active listings" value={String(data.activeListings ?? "0")} hint="Published" />
      <DashboardStatCard label="Featured" value={String(data.featuredListings ?? "0")} hint="Home hero & carousel" />
      <DashboardStatCard
        label="Bookings"
        value={String(data.bookingsCount ?? "0")}
        hint={`${data.pendingBookings ?? 0} pending host / payment`}
      />
      <DashboardStatCard
        label="Contact messages"
        value={String(data.contactMessagesTotal ?? "0")}
        hint={`${data.contactMessagesNew ?? 0} new`}
        href="/dashboard/contact-messages/"
      />
    </div>
  );
}
