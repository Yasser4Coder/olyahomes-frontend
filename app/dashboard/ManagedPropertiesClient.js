"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { ApiError, fetchManagedProperties } from "@/lib/api";
import { mapPropertyFromApi } from "@/lib/listingMappers";
import { listingDetailHref } from "@/lib/listingRoutes";
import { dashboardPropertyEditHref } from "@/lib/dashboardPropertyRoutes";

const PAGE_SIZE = 10;

export default function ManagedPropertiesClient() {
  const searchParams = useSearchParams();
  const createdSlug = searchParams.get("created");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [queryInput, setQueryInput] = useState("");
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQ(queryInput.trim());
      setPage(1);
    }, 320);
    return () => clearTimeout(t);
  }, [queryInput]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const body = await fetchManagedProperties({
        page,
        pageSize: PAGE_SIZE,
        q: searchQ || undefined,
      });
      const raw = Array.isArray(body?.properties) ? body.properties : [];
      setRows(raw.map(mapPropertyFromApi).filter(Boolean));
      setTotal(Number(body?.total) || 0);
      setTotalPages(Number(body?.totalPages) || 1);
    } catch (e) {
      setRows([]);
      setTotal(0);
      setTotalPages(1);
      setError(e instanceof ApiError ? e.message : "Could not load properties.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQ]);

  useEffect(() => {
    load();
  }, [load]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <>
      <DashboardPageHeader
        eyebrow="Properties"
        title="Listings"
        description="Published and draft properties from your account (or all properties for admins). Edit opens a static dashboard page that loads this row from the API."
      />
      {createdSlug ? (
        <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Listing <span className="font-mono font-semibold">{createdSlug}</span> —{" "}
          <Link className="font-semibold text-primary underline" href={listingDetailHref(createdSlug)}>
            View on site
          </Link>
          . More photos: use <strong>Photos</strong> on this row or open{" "}
          <Link className="font-semibold text-primary underline" href="/dashboard/properties/new/">
            Add property
          </Link>{" "}
          for a new place (upload is step 2 on that page).
        </p>
      ) : null}
      {error ? <p className="mb-4 text-sm text-red-800">{error}</p> : null}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="block w-full max-w-xl text-sm">
          <span className="mb-1 block font-medium text-foreground/70">Search</span>
          <input
            type="search"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Title, slug, location, city…"
            className="w-full rounded-xl border border-secondary/15 bg-white px-4 py-2.5 text-sm text-foreground shadow-sm outline-none ring-primary/0 transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            autoComplete="off"
          />
        </label>
        {!loading ? (
          <p className="text-sm text-foreground/50">
            {total === 0
              ? "No results"
              : `${total} propert${total === 1 ? "y" : "ies"} · page ${page} of ${totalPages}`}
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-secondary/12 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary/10 px-5 py-4">
          <p className="text-sm text-foreground/55">
            {loading ? "Loading…" : "Your listings (search applies on the server)."}
          </p>
          <Link
            href="/dashboard/properties/new/"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/92"
          >
            Add property
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-secondary/10 bg-neutral/50 text-[0.65rem] font-bold uppercase tracking-wide text-foreground/45">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3 text-right">AED / night</th>
                <th className="px-5 py-3 text-right">Guests</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-foreground/55">
                    {searchQ ? "No listings match your search." : "No listings yet. Add a property to get started."}
                  </td>
                </tr>
              ) : (
                rows.map((p) => (
                  <tr key={p.id || p.slug} className="border-b border-secondary/8 last:border-0">
                    <td className="px-5 py-3.5 font-medium text-foreground">{p.title}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-foreground/55">{p.slug}</td>
                    <td className="px-5 py-3.5 text-foreground/65">{p.location}</td>
                    <td className="px-5 py-3.5 text-right font-semibold">{p.pricePerNight}</td>
                    <td className="px-5 py-3.5 text-right">{p.guests}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
                        {p.id ? (
                          <Link
                            href={`/dashboard/properties/upload/?propertyId=${encodeURIComponent(p.id)}&slug=${encodeURIComponent(p.slug)}&listingTitle=${encodeURIComponent(p.title)}`}
                            className="text-sm font-semibold text-primary hover:underline"
                          >
                            Photos
                          </Link>
                        ) : null}
                        <Link href={listingDetailHref(p.slug)} className="text-sm font-semibold text-foreground/55 hover:text-foreground hover:underline">
                          Site
                        </Link>
                        <Link
                          href={dashboardPropertyEditHref({ id: p.id, slug: p.slug, title: p.title })}
                          className="text-sm font-semibold text-foreground/45 hover:underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {total > 0 ? (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-secondary/10 px-5 py-4 sm:flex-row">
            <p className="text-xs text-foreground/50">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!canPrev || loading}
                onClick={() => setPage((x) => Math.max(1, x - 1))}
                className="rounded-full border border-secondary/15 bg-white px-4 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-neutral/50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!canNext || loading}
                onClick={() => setPage((x) => x + 1)}
                className="rounded-full border border-secondary/15 bg-white px-4 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-neutral/50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
