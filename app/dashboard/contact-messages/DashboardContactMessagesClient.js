"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { ApiError, fetchDashboardContactMessages } from "@/lib/api";

const PAGE_SIZE = 20;

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-AE", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function pillTone(kind) {
  switch (kind) {
    case "guest_support":
      return "bg-emerald-500/12 text-emerald-900 ring-emerald-600/20";
    case "corporate":
      return "bg-primary/12 text-primary ring-primary/20";
    default:
      return "bg-secondary/12 text-foreground ring-secondary/20";
  }
}

function statusTone(status) {
  switch (status) {
    case "new":
      return "bg-amber-500/12 text-amber-950 ring-amber-600/25";
    case "in_progress":
      return "bg-primary/12 text-primary ring-primary/20";
    case "resolved":
      return "bg-emerald-500/12 text-emerald-900 ring-emerald-600/20";
    default:
      return "bg-secondary/12 text-foreground ring-secondary/20";
  }
}

export default function DashboardContactMessagesClient() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
      const body = await fetchDashboardContactMessages({
        page,
        pageSize: PAGE_SIZE,
        kind: kind || undefined,
        status: status || undefined,
        q: searchQ || undefined,
      });
      setMessages(Array.isArray(body?.messages) ? body.messages : []);
      setStats(body?.stats && typeof body.stats === "object" ? body.stats : null);
      setTotal(typeof body?.total === "number" ? body.total : 0);
      setTotalPages(typeof body?.totalPages === "number" ? body.totalPages : 1);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load messages.");
      setMessages([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, kind, status, searchQ]);

  useEffect(() => {
    load();
  }, [load]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const empty = useMemo(() => !loading && !err && messages.length === 0, [loading, err, messages.length]);
  const cards = useMemo(() => {
    const s = stats || {};
    const by = s.byStatus || {};
    return [
      { label: "Total", value: s.total ?? 0 },
      { label: "New", value: by.new ?? 0 },
      { label: "In progress", value: by.in_progress ?? 0 },
      { label: "Resolved", value: by.resolved ?? 0 },
    ];
  }, [stats]);

  return (
    <>
      <DashboardPageHeader
        eyebrow="Support"
        title="Contact messages"
        description="Guest support and corporate inquiries submitted from the public contact page."
      />

      {err ? <p className="mb-4 text-sm text-red-800">{err}</p> : null}

      {!loading && !err && stats ? (
        <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-secondary/12 bg-white p-4 shadow-sm">
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-foreground/45">{c.label}</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{String(c.value ?? 0)}</p>
              <p className="mt-1 text-xs font-medium text-foreground/50">Matches current kind filter</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid w-full flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-4xl">
          <label className="block text-sm sm:col-span-2 lg:col-span-1">
            <span className="mb-1 block font-medium text-foreground/70">Search</span>
            <input
              type="search"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Name, email, phone, subject, booking ref, message…"
              className="w-full rounded-xl border border-secondary/15 bg-white px-4 py-2.5 text-sm text-foreground shadow-sm outline-none ring-primary/0 transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              autoComplete="off"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-foreground/70">Kind</span>
            <select
              value={kind}
              onChange={(e) => {
                setKind(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-secondary/15 bg-white px-4 py-2.5 text-sm text-foreground shadow-sm outline-none ring-primary/0 transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All</option>
              <option value="guest_support">Guest support</option>
              <option value="corporate">Corporate</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-foreground/70">Status</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-secondary/15 bg-white px-4 py-2.5 text-sm text-foreground shadow-sm outline-none ring-primary/0 transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All</option>
              <option value="new">New</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </label>
        </div>

        {!loading ? (
          <p className="text-sm text-foreground/50">
            {total === 0
              ? "No results"
              : `${total} message${total === 1 ? "" : "s"} · page ${page} of ${totalPages}`}
          </p>
        ) : null}
      </div>

      {loading ? (
        <p className="text-sm text-foreground/55">Loading messages…</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-secondary/12 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead>
                <tr className="border-b border-secondary/10 bg-neutral/50 text-[0.65rem] font-bold uppercase tracking-wide text-foreground/45">
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Kind</th>
                  <th className="px-5 py-3">From</th>
                  <th className="px-5 py-3">Booking ref</th>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-5 py-3">Message</th>
                </tr>
              </thead>
              <tbody className="align-top">
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm text-foreground/55">
                      No messages match your filters yet.
                    </td>
                  </tr>
                ) : (
                  messages.map((m) => (
                    <tr key={String(m.id)} className="border-b border-secondary/8 last:border-0">
                      <td className="px-5 py-3.5 whitespace-nowrap text-foreground/70">{formatDateTime(m.createdAt)}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide ring-1 ${statusTone(m.status)}`}
                        >
                          {String(m.status || "").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide ring-1 ${pillTone(m.kind)}`}
                        >
                          {String(m.kind || "").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-foreground">{m.name || "—"}</span>
                        <span className="mt-0.5 block text-xs text-foreground/50">{m.email || "—"}</span>
                        {m.company ? <span className="mt-0.5 block text-xs text-foreground/45">{m.company}</span> : null}
                        {m.phone ? <span className="mt-0.5 block text-xs text-foreground/45">{m.phone}</span> : null}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap font-mono text-xs text-foreground/65">{m.bookingRef || "—"}</td>
                      <td className="px-5 py-3.5 text-foreground/70">{m.subject || "—"}</td>
                      <td className="px-5 py-3.5">
                        <div className="max-w-[560px] whitespace-pre-wrap text-foreground/80">{m.message || "—"}</div>
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
      )}
    </>
  );
}

