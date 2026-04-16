"use client";

import { useEffect, useMemo, useState } from "react";
import { ApiError, fetchDashboardPayments } from "@/lib/api";
import { formatAEDAmount } from "@/lib/currency";

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-AE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusTone(status) {
  switch (status) {
    case "succeeded":
      return "bg-emerald-500/12 text-emerald-900 ring-emerald-600/20";
    case "pending":
    case "processing":
      return "bg-amber-500/12 text-amber-950 ring-amber-600/25";
    case "failed":
    case "canceled":
      return "bg-zinc-400/15 text-zinc-800 ring-zinc-500/20";
    case "refunded_partial":
    case "refunded_full":
      return "bg-primary/12 text-primary ring-primary/20";
    default:
      return "bg-secondary/12 text-foreground ring-secondary/20";
  }
}

export default function DashboardPaymentsClient() {
  const PAGE_SIZE = 20;
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [status, q]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const body = await fetchDashboardPayments({
          page,
          pageSize: PAGE_SIZE,
          status: status || undefined,
          q: q || undefined,
        });
        if (cancelled) return;
        setItems(Array.isArray(body?.payments) ? body.payments : []);
        setStats(body?.stats && typeof body.stats === "object" ? body.stats : null);
        setTotal(typeof body?.total === "number" ? body.total : 0);
        setTotalPages(typeof body?.totalPages === "number" ? body.totalPages : 1);
      } catch (e) {
        if (!cancelled) {
          setErr(e instanceof ApiError ? e.message : "Failed to load payments.");
          setItems([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, status, q]);

  const empty = useMemo(() => !loading && !err && items.length === 0, [loading, err, items.length]);

  const cards = useMemo(() => {
    const s = stats || {};
    const succeeded = s.succeeded || {};
    const pendingLike = s.pendingLike || {};
    const refunded = s.refunded || {};
    return [
      { label: "Succeeded", value: formatAEDAmount(succeeded.amount ?? 0), hint: `${succeeded.count ?? 0} payments` },
      { label: "Pending / processing", value: formatAEDAmount(pendingLike.amount ?? 0), hint: `${pendingLike.count ?? 0} payments` },
      { label: "Refunded", value: formatAEDAmount(refunded.amount ?? 0), hint: `${refunded.count ?? 0} payments` },
    ];
  }, [stats]);

  function shortStripeId(id) {
    const s = String(id || "");
    if (!s) return "—";
    if (s.length <= 14) return s;
    return `${s.slice(0, 6)}…${s.slice(-6)}`;
  }

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="overflow-hidden rounded-3xl border border-secondary/15 bg-white shadow-[0_24px_60px_-40px_rgba(44,36,25,0.35)] ring-1 ring-foreground/5">
      <div className="relative border-b border-secondary/10 bg-[#fdfbf7] px-6 py-6 sm:px-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" aria-hidden />

        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Payments</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem]">
              Charges & refunds
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-foreground/60">
              Stripe-backed payments created from Checkout sessions. Amounts are stored in AED and validated in the webhook.
            </p>
            <p className="mt-2 max-w-2xl text-xs font-medium text-foreground/50">
              These dashboard amounts are shown before Stripe fees. In the Stripe dashboard you may see lower net numbers after fees are deducted.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="min-w-[220px]">
              <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-foreground/45" htmlFor="pay-status">
                Status
              </label>
              <select
                id="pay-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-secondary/20 bg-white px-3 py-2.5 text-sm text-foreground shadow-sm"
              >
                <option value="">All</option>
                <option value="succeeded">Succeeded</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
                <option value="canceled">Canceled</option>
                <option value="refunded_partial">Refunded (partial)</option>
                <option value="refunded_full">Refunded (full)</option>
              </select>
            </div>
            <div className="min-w-[260px]">
              <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-foreground/45" htmlFor="pay-q">
                Search
              </label>
              <input
                id="pay-q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Booking ref…"
                className="mt-1.5 w-full rounded-xl border border-secondary/20 bg-white px-3 py-2.5 text-sm text-foreground shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {!loading && !err && stats ? (
        <div className="grid gap-3 border-b border-secondary/10 bg-white px-6 py-5 sm:grid-cols-3 sm:px-8">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-secondary/12 bg-[#fdfbf7] p-4 shadow-sm">
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-foreground/45">{c.label}</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{c.value}</p>
              <p className="mt-1 text-xs font-medium text-foreground/55">{c.hint}</p>
            </div>
          ))}
        </div>
      ) : null}

      {err ? (
        <div className="px-6 py-6 sm:px-8">
          <p className="rounded-2xl border border-red-200/70 bg-red-50/70 px-4 py-3 text-sm text-red-900" role="alert">
            {err}
          </p>
        </div>
      ) : null}

      {loading ? (
        <div className="px-6 py-6 sm:px-8">
          <div className="h-40 animate-pulse rounded-2xl bg-neutral/50" />
        </div>
      ) : null}

      {empty ? (
        <div className="px-6 py-10 sm:px-8">
          <p className="text-sm text-foreground/60">No payments found.</p>
        </div>
      ) : null}

      {!loading && !err && items.length ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-neutral/40 text-xs font-bold uppercase tracking-wider text-foreground/45">
                <tr className="border-b border-secondary/12">
                  <th className="px-6 py-3 sm:px-8">Created</th>
                  <th className="px-6 py-3 sm:px-8">Status</th>
                  <th className="px-6 py-3 sm:px-8">Amount</th>
                  <th className="px-6 py-3 sm:px-8">Booking</th>
                  <th className="px-6 py-3 sm:px-8">Property</th>
                  <th className="px-6 py-3 sm:px-8">Guest</th>
                  <th className="px-6 py-3 sm:px-8">Stripe</th>
                </tr>
              </thead>
              <tbody className="align-top">
                {items.map((p) => (
                  <tr key={String(p.id)} className="border-b border-secondary/10 hover:bg-[#fdfbf7]">
                    <td className="px-6 py-4 sm:px-8 whitespace-nowrap text-foreground/70">{formatDateTime(p.createdAt)}</td>
                    <td className="px-6 py-4 sm:px-8 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide ring-1 ${statusTone(p.status)}`}>
                        {String(p.status || "").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 sm:px-8 whitespace-nowrap font-semibold text-foreground">
                      {p.currency === "AED" ? formatAEDAmount(p.amount) : `${p.amount} ${p.currency || ""}`}
                    </td>
                    <td className="px-6 py-4 sm:px-8 whitespace-nowrap font-mono text-xs text-foreground/70">{p.booking?.id || "—"}</td>
                    <td className="px-6 py-4 sm:px-8 max-w-[260px]">
                      <div className="truncate font-semibold text-foreground" title={p.property?.title || ""}>
                        {p.property?.title || "—"}
                      </div>
                      {p.property?.location ? (
                        <div className="truncate text-foreground/55" title={p.property.location}>
                          {p.property.location}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 sm:px-8 max-w-[220px]">
                      <div className="font-semibold text-foreground">{p.guest?.fullName || "—"}</div>
                      {p.guest?.email ? (
                        <div className="truncate text-foreground/55" title={p.guest.email}>
                          {p.guest.email}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 sm:px-8 max-w-[220px]">
                      <div className="font-mono text-xs text-foreground/70" title={p.stripePaymentIntentId || ""}>
                        {shortStripeId(p.stripePaymentIntentId)}
                      </div>
                      <div className="mt-1 font-mono text-xs text-foreground/50" title={p.stripeCheckoutSessionId || ""}>
                        {shortStripeId(p.stripeCheckoutSessionId)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-secondary/10 px-6 py-4 sm:flex-row sm:px-8">
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
        </>
      ) : null}
    </div>
  );
}

