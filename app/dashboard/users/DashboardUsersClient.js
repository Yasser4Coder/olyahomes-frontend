"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { ApiError, fetchDashboardUsers, patchDashboardUserRole } from "@/lib/api";

const PAGE_SIZE = 30;

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-AE", { year: "numeric", month: "short", day: "2-digit" });
}

function rolePill(role) {
  switch (role) {
    case "admin":
      return "bg-primary/12 text-primary ring-primary/20";
    case "owner":
      return "bg-emerald-500/12 text-emerald-900 ring-emerald-600/20";
    case "client":
      return "bg-secondary/12 text-foreground ring-secondary/20";
    default:
      return "bg-secondary/12 text-foreground ring-secondary/20";
  }
}

export default function DashboardUsersClient() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [busyId, setBusyId] = useState(null);
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
    setErr(null);
    try {
      const body = await fetchDashboardUsers({ q: searchQ || undefined, page, pageSize: PAGE_SIZE });
      setRows(Array.isArray(body?.users) ? body.users : []);
      setTotal(typeof body?.total === "number" ? body.total : 0);
      setTotalPages(typeof body?.totalPages === "number" ? body.totalPages : 1);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not load users.");
      setRows([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [searchQ, page]);

  useEffect(() => {
    load();
  }, [load]);

  const onChangeRole = async (userId, nextRole) => {
    if (!window.confirm(`Change role to ${nextRole}?`)) return;
    setBusyId(userId);
    setErr(null);
    try {
      await patchDashboardUserRole(userId, nextRole);
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not update role.");
    } finally {
      setBusyId(null);
    }
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;
  const empty = useMemo(() => !loading && !err && rows.length === 0, [loading, err, rows.length]);

  return (
    <>
      <DashboardPageHeader
        eyebrow="Users"
        title="Accounts & roles"
        description="Manage user roles. Owners can switch client ↔ owner. Admins can assign any role."
      />

      {err ? <p className="mb-4 text-sm text-red-800">{err}</p> : null}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="block max-w-md flex-1 text-sm">
          <span className="mb-1 block font-medium text-foreground/70">Search</span>
          <input
            type="search"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Email or name"
            className="w-full rounded-xl border border-secondary/15 bg-white px-4 py-2.5 text-sm text-foreground shadow-sm outline-none ring-primary/0 transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            autoComplete="off"
          />
        </label>
        {!loading ? (
          <p className="text-sm text-foreground/50">
            {total === 0 ? "No results" : `${total} user${total === 1 ? "" : "s"}`}
          </p>
        ) : null}
      </div>

      {loading ? (
        <p className="text-sm text-foreground/55">Loading users…</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-secondary/12 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead>
                <tr className="border-b border-secondary/10 bg-neutral/50 text-[0.65rem] font-bold uppercase tracking-wide text-foreground/45">
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="align-top">
                {empty ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-foreground/55">
                      No users match your search.
                    </td>
                  </tr>
                ) : (
                  rows.map((u) => (
                    <tr key={String(u.id)} className="border-b border-secondary/8 last:border-0">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-foreground">{u.fullName || "—"}</div>
                        <div className="mt-0.5 text-xs text-foreground/50">{u.email}</div>
                        <div className="mt-0.5 font-mono text-[0.7rem] text-foreground/45">id {u.id}</div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide ring-1 ${rolePill(u.role)}`}>
                          {String(u.role || "").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-foreground/60">{formatDateTime(u.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {["client", "owner", "admin"].map((r) => (
                            <button
                              key={r}
                              type="button"
                              disabled={busyId === u.id || u.role === r}
                              onClick={() => onChangeRole(u.id, r)}
                              className="rounded-full border border-secondary/15 bg-white px-3 py-1.5 text-xs font-semibold text-foreground/80 transition hover:bg-neutral/50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {busyId === u.id ? "…" : `Set ${r}`}
                            </button>
                          ))}
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

