"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { ApiError, fetchManagedProperties, patchPropertyFeatured } from "@/lib/api";
import { mapPropertyFromApi } from "@/lib/listingMappers";

const PAGE_SIZE = 20;

export default function FeaturedAdminClient() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [queryInput, setQueryInput] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
      setTotal(typeof body?.total === "number" ? body.total : 0);
      setTotalPages(typeof body?.totalPages === "number" ? body.totalPages : 1);
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
  const featuredOnPage = rows.filter((r) => r.isFeatured).length;

  const toggle = async (p) => {
    try {
      await patchPropertyFeatured(p.id, {
        isFeatured: !p.isFeatured,
        featuredSortOrder: p.isFeatured ? 0 : 10,
      });
      setRows((xs) =>
        xs.map((r) => (r.id === p.id ? { ...r, isFeatured: !r.isFeatured } : r)),
      );
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Update failed");
    }
  };

  return (
    <>
      <DashboardPageHeader
        eyebrow="Featured"
        title="Homepage spotlight"
        description="Toggle which published listings appear in the hero card and “Featured homes” carousel (API: isFeatured + featuredSortOrder)."
      />
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
              : `${total} listing${total === 1 ? "" : "s"} · ${featuredOnPage} featured on this page · page ${page} of ${totalPages}`}
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-secondary/12 bg-white shadow-sm">
        <div className="border-b border-secondary/10 px-5 py-3 text-sm text-foreground/55">
          {loading ? "Loading…" : "Published and draft listings you can mark for the homepage carousel."}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-secondary/10 bg-neutral/50 text-[0.65rem] font-bold uppercase tracking-wide text-foreground/45">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Featured</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-secondary/8 last:border-0">
                  <td className="px-5 py-3 font-medium">{p.title}</td>
                  <td className="px-5 py-3 font-mono text-xs text-foreground/55">{p.slug}</td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => toggle(p)}
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                        p.isFeatured ? "bg-primary/15 text-primary" : "bg-foreground/5 text-foreground/50"
                      }`}
                    >
                      {p.isFeatured ? "On" : "Off"}
                    </button>
                  </td>
                </tr>
              ))}
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
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-secondary/15 bg-white px-4 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-neutral/50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!canNext || loading}
                onClick={() => setPage((p) => p + 1)}
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
