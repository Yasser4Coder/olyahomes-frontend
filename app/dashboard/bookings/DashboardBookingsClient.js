"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { ApiError, cancelHostBooking, confirmHostBooking, fetchHostBookings } from "@/lib/api";
import { listingDetailHref } from "@/lib/listingRoutes";

const PAGE_SIZE = 20;
const CANCELLABLE = new Set(["pending_payment", "pending_host", "confirmed"]);
const CONFIRMABLE = new Set(["pending_payment", "pending_host"]);

function statusLabel(s) {
  return String(s || "").replace(/_/g, " ");
}

export default function DashboardBookingsClient() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [queryInput, setQueryInput] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const t = setTimeout(() => {
      const v = queryInput.trim();
      setSearchQ(v);
      setPage(1);
    }, 320);
    return () => clearTimeout(t);
  }, [queryInput]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const body = await fetchHostBookings({
        q: searchQ || undefined,
        page,
        pageSize: PAGE_SIZE,
      });
      setRows(Array.isArray(body?.bookings) ? body.bookings : []);
      setTotal(typeof body?.total === "number" ? body.total : 0);
      setTotalPages(typeof body?.totalPages === "number" ? body.totalPages : 1);
      setCounts(body?.countsByStatus && typeof body.countsByStatus === "object" ? body.countsByStatus : {});
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not load bookings.");
      setRows([]);
      setTotal(0);
      setTotalPages(1);
      setCounts({});
    } finally {
      setLoading(false);
    }
  }, [searchQ, page]);

  useEffect(() => {
    load();
  }, [load]);

  const onCancel = async (id) => {
    if (!window.confirm("Cancel this booking? Those dates will be available for other guests to book.")) return;
    setBusyId(id);
    setErr(null);
    try {
      await cancelHostBooking(id);
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not cancel booking.");
    } finally {
      setBusyId(null);
    }
  };

  const onConfirm = async (id) => {
    if (!window.confirm("Mark this booking as confirmed?")) return;
    setBusyId(id);
    setErr(null);
    try {
      await confirmHostBooking(id);
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not confirm booking.");
    } finally {
      setBusyId(null);
    }
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <>
      <DashboardPageHeader
        eyebrow="Bookings"
        title="Property bookings"
        description="Reservations for your listings. Search by booking ID, guest email, or name. Confirm pending stays or cancel to release dates."
      />

      {err ? <p className="mb-4 text-sm text-red-800">{err}</p> : null}

      {!loading ? (
        <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total", value: total },
            { label: "Pending", value: (counts?.pending_payment || 0) + (counts?.pending_host || 0) },
            { label: "Confirmed", value: counts?.confirmed || 0 },
            { label: "Completed", value: counts?.completed || 0 },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl border border-secondary/12 bg-white p-4 shadow-sm">
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-foreground/45">{c.label}</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{String(c.value ?? 0)}</p>
              <p className="mt-1 text-xs font-medium text-foreground/50">Matches current search</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="block max-w-md flex-1 text-sm">
          <span className="mb-1 block font-medium text-foreground/70">Search</span>
          <input
            type="search"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Booking code, guest email, or name"
            className="w-full rounded-xl border border-secondary/15 bg-white px-4 py-2.5 text-sm text-foreground shadow-sm outline-none ring-primary/0 transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            autoComplete="off"
          />
        </label>
        {!loading ? (
          <p className="text-sm text-foreground/50">
            {total === 0 ? "No results" : `${total} booking${total === 1 ? "" : "s"}`}
          </p>
        ) : null}
      </div>

      {loading ? (
        <p className="text-sm text-foreground/55">Loading bookings…</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-secondary/12 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1020px] text-left text-sm">
              <thead>
                <tr className="border-b border-secondary/10 bg-neutral/50 text-[0.65rem] font-bold uppercase tracking-wide text-foreground/45">
                  <th className="px-5 py-3">Code</th>
                  <th className="px-5 py-3">Guest</th>
                  <th className="px-5 py-3">Property</th>
                  <th className="px-5 py-3">Check-in / out</th>
                  <th className="px-5 py-3">Guests</th>
                  <th className="px-5 py-3">Children</th>
                  <th className="px-5 py-3">Pets</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"> </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-5 py-10 text-center text-sm text-foreground/55">
                      {searchQ
                        ? "No bookings match your search."
                        : "No bookings yet. When guests book your published listings, they will appear here."}
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => {
                    const canCancel = CANCELLABLE.has(r.status);
                    const canConfirm = CONFIRMABLE.has(r.status);
                    const slug = r.property?.slug;
                    return (
                      <tr key={r.id} className="border-b border-secondary/8 last:border-0">
                        <td className="px-5 py-3.5 font-mono text-xs text-foreground/65">{r.id}</td>
                        <td className="px-5 py-3.5">
                          <span className="font-medium text-foreground">{r.guest?.fullName || "Guest"}</span>
                          <span className="mt-0.5 block text-xs text-foreground/50">{r.guest?.email || "—"}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          {r.property?.title ? (
                            slug ? (
                              <Link
                                href={listingDetailHref(slug)}
                                className="font-medium text-primary underline-offset-2 hover:underline"
                              >
                                {r.property.title}
                              </Link>
                            ) : (
                              <span className="text-foreground/80">{r.property.title}</span>
                            )
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-5 py-3.5 tabular-nums text-foreground/75">
                          {r.checkIn} → {r.checkOut}
                        </td>
                        <td className="px-5 py-3.5 tabular-nums">{r.guestCount}</td>
                        <td className="px-5 py-3.5 tabular-nums text-foreground/75">
                          {typeof r.childrenCount === "number" ? r.childrenCount : 0}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-foreground/75">
                          {r.petsAllowed ? "Yes" : "No"}
                        </td>
                        <td className="px-5 py-3.5 tabular-nums text-foreground/75">
                          {r.totalAmount != null ? `${r.totalAmount} ${r.currency || "AED"}` : "—"}
                        </td>
                        <td className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-foreground/55">
                          {statusLabel(r.status)}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            {canConfirm ? (
                              <button
                                type="button"
                                disabled={busyId === r.id}
                                onClick={() => onConfirm(r.id)}
                                className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:opacity-50"
                              >
                                {busyId === r.id ? "…" : "Confirm"}
                              </button>
                            ) : null}
                            {canCancel ? (
                              <button
                                type="button"
                                disabled={busyId === r.id}
                                onClick={() => onCancel(r.id)}
                                className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-800 transition hover:bg-red-50 disabled:opacity-50"
                              >
                                {busyId === r.id ? "…" : "Cancel"}
                              </button>
                            ) : null}
                            {!canConfirm && !canCancel ? (
                              <span className="text-xs text-foreground/35">—</span>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
                  disabled={!canPrev || busyId}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-full border border-secondary/15 bg-white px-4 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-neutral/50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={!canNext || busyId}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full border border-secondary/15 bg-white px-4 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-neutral/50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
