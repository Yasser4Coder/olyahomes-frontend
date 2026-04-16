"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import {
  ApiError,
  createDashboardTestimonial,
  deleteDashboardTestimonial,
  fetchDashboardTestimonials,
  patchDashboardTestimonial,
} from "@/lib/api";

const PAGE_SIZE = 12;

const initialForm = {
  quote: "",
  name: "",
  meta: "",
  rating: "5",
  avatarType: "single",
  initials: "",
  secondaryInitials: "",
  isPublished: true,
  sortOrder: "0",
};

function inputClass() {
  return "w-full rounded-xl border border-secondary/15 bg-white px-4 py-2.5 text-sm text-foreground shadow-sm outline-none ring-primary/0 transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20";
}

export default function DashboardTestimonialsClient() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [queryInput, setQueryInput] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [published, setPublished] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [createBusy, setCreateBusy] = useState(false);
  const [createMsg, setCreateMsg] = useState(null);

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
      const body = await fetchDashboardTestimonials({
        page,
        pageSize: PAGE_SIZE,
        q: searchQ || undefined,
        published: published || undefined,
      });
      setRows(Array.isArray(body?.testimonials) ? body.testimonials : []);
      setTotal(typeof body?.total === "number" ? body.total : 0);
      setTotalPages(typeof body?.totalPages === "number" ? body.totalPages : 1);
    } catch (e) {
      setRows([]);
      setTotal(0);
      setTotalPages(1);
      setErr(e instanceof ApiError ? e.message : "Could not load testimonials.");
    } finally {
      setLoading(false);
    }
  }, [page, published, searchQ]);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async (e) => {
    e.preventDefault();
    setCreateBusy(true);
    setErr(null);
    setCreateMsg(null);
    try {
      await createDashboardTestimonial({
        quote: form.quote,
        name: form.name,
        meta: form.meta,
        rating: Number(form.rating),
        avatarType: form.avatarType,
        initials: form.initials,
        secondaryInitials: form.avatarType === "couple" ? form.secondaryInitials : "",
        isPublished: form.isPublished,
        sortOrder: Number(form.sortOrder),
      });
      setForm(initialForm);
      setCreateMsg("Testimonial created.");
      setPage(1);
      await load();
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Could not create testimonial.");
    } finally {
      setCreateBusy(false);
    }
  };

  const togglePublished = async (row) => {
    setBusyId(row.id);
    setErr(null);
    try {
      await patchDashboardTestimonial(row.id, { isPublished: !row.isPublished });
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete testimonial from ${row.name}?`)) return;
    setBusyId(row.id);
    setErr(null);
    try {
      await deleteDashboardTestimonial(row.id);
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <>
      <DashboardPageHeader
        eyebrow="Testimonials"
        title="Homepage testimonials"
        description="Add and manage the guest reviews shown on the home page. Publish only the ones you want visible to visitors."
      />

      {err ? <p className="mb-4 text-sm text-red-800">{err}</p> : null}
      {createMsg ? <p className="mb-4 text-sm font-medium text-emerald-800">{createMsg}</p> : null}

      <section className="mb-8 rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Add testimonial</h2>
        <form onSubmit={onCreate} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-foreground/70">Quote</span>
            <textarea
              rows={4}
              required
              value={form.quote}
              onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
              className={`${inputClass()} resize-y`}
            />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-foreground/70">Name</span>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass()} />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-foreground/70">Meta</span>
            <input value={form.meta} onChange={(e) => setForm((f) => ({ ...f, meta: e.target.value }))} className={inputClass()} placeholder="Dubai, UAE • 5 nights" />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-foreground/70">Rating</span>
            <select value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} className={inputClass()}>
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-foreground/70">Avatar type</span>
            <select value={form.avatarType} onChange={(e) => setForm((f) => ({ ...f, avatarType: e.target.value }))} className={inputClass()}>
              <option value="single">Single</option>
              <option value="couple">Couple</option>
            </select>
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-foreground/70">Initials</span>
            <input required value={form.initials} onChange={(e) => setForm((f) => ({ ...f, initials: e.target.value.toUpperCase() }))} className={inputClass()} placeholder="SM" />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-foreground/70">Secondary initials</span>
            <input
              value={form.secondaryInitials}
              onChange={(e) => setForm((f) => ({ ...f, secondaryInitials: e.target.value.toUpperCase() }))}
              className={inputClass()}
              placeholder="LK"
              disabled={form.avatarType !== "couple"}
            />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-foreground/70">Sort order</span>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))} className={inputClass()} />
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-secondary/12 bg-[#fdfbf7] px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
              className="size-4 rounded border-secondary/30 text-primary focus:ring-primary/30"
            />
            <span className="font-medium text-foreground/75">Publish immediately</span>
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={createBusy}
              className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary/92 disabled:opacity-50"
            >
              {createBusy ? "Creating..." : "Add testimonial"}
            </button>
          </div>
        </form>
      </section>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid w-full flex-1 gap-3 sm:grid-cols-2 lg:max-w-3xl">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-foreground/70">Search</span>
            <input
              type="search"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Quote, guest name, meta..."
              className={inputClass()}
              autoComplete="off"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-foreground/70">Published</span>
            <select
              value={published}
              onChange={(e) => {
                setPublished(e.target.value);
                setPage(1);
              }}
              className={inputClass()}
            >
              <option value="">All</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </label>
        </div>
        {!loading ? (
          <p className="text-sm text-foreground/50">
            {total === 0 ? "No results" : `${total} testimonial${total === 1 ? "" : "s"} · page ${page} of ${totalPages}`}
          </p>
        ) : null}
      </div>

      {loading ? (
        <p className="text-sm text-foreground/55">Loading testimonials...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-secondary/12 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead>
                <tr className="border-b border-secondary/10 bg-neutral/50 text-[0.65rem] font-bold uppercase tracking-wide text-foreground/45">
                  <th className="px-5 py-3">Guest</th>
                  <th className="px-5 py-3">Quote</th>
                  <th className="px-5 py-3">Rating</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Published</th>
                  <th className="px-5 py-3">Sort</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm text-foreground/55">
                      No testimonials match your filters yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-b border-secondary/8 last:border-0">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-foreground">{row.name}</div>
                        <div className="text-xs text-foreground/50">{row.meta || "—"}</div>
                      </td>
                      <td className="px-5 py-3.5 max-w-[420px]">
                        <div className="line-clamp-3 text-foreground/75">{row.quote}</div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-foreground/80">{row.rating}/5</td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-foreground/65">{row.avatar?.type === "couple" ? "Couple" : "Single"}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide ring-1 ${
                            row.isPublished ? "bg-emerald-500/12 text-emerald-900 ring-emerald-600/20" : "bg-zinc-400/15 text-zinc-800 ring-zinc-500/20"
                          }`}
                        >
                          {row.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-foreground/65">{row.sortOrder}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() => togglePublished(row)}
                            className="rounded-full border border-secondary/15 bg-white px-3 py-1.5 text-xs font-semibold text-foreground/80 transition hover:bg-neutral/50 disabled:opacity-40"
                          >
                            {row.isPublished ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() => remove(row)}
                            className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-800 transition hover:bg-red-50 disabled:opacity-40"
                          >
                            Delete
                          </button>
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
