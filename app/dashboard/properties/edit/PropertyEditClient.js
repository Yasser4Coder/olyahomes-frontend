"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { ApiError, fetchManagedPropertyById, fetchPropertyBySlug, updateManagedProperty } from "@/lib/api";
import { mapPropertyFromApi, normalizeAmenities } from "@/lib/listingMappers";
import { listingDetailHref } from "@/lib/listingRoutes";

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div>
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {hint ? <p className="mt-0.5 text-xs text-foreground/50">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

function inputClass() {
  return "w-full rounded-xl border border-secondary/20 bg-white px-4 py-2.5 text-sm text-foreground shadow-sm outline-none ring-primary/0 transition placeholder:text-foreground/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/15";
}

export default function PropertyEditClient() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const slug = searchParams.get("slug");
  const titleHint = searchParams.get("listingTitle") || searchParams.get("title");

  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amenityDraft, setAmenityDraft] = useState("");
  const [amenityBusy, setAmenityBusy] = useState(false);
  const [amenityMsg, setAmenityMsg] = useState(null);
  const [checkInTime, setCheckInTime] = useState("3:00 PM");
  const [checkInBusy, setCheckInBusy] = useState(false);
  const [checkInMsg, setCheckInMsg] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHome(null);
    try {
      if (propertyId) {
        const body = await fetchManagedPropertyById(propertyId);
        const mapped = mapPropertyFromApi(body?.property);
        if (!mapped) {
          setError("Property not found.");
          return;
        }
        setHome(mapped);
        return;
      }
      if (slug) {
        const body = await fetchPropertyBySlug(slug);
        const mapped = mapPropertyFromApi(body?.property);
        if (!mapped) {
          setError("Listing not found (draft listings need ?propertyId= in the URL).");
          return;
        }
        setHome(mapped);
        return;
      }
      setError("Add ?propertyId=… or ?slug=… (open from the properties table).");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not load property.");
    } finally {
      setLoading(false);
    }
  }, [propertyId, slug]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (home?.checkInTime) setCheckInTime(home.checkInTime);
  }, [home?.id, home?.checkInTime]);

  const persistAmenities = async (propertyId, nextList) => {
    setAmenityBusy(true);
    setAmenityMsg(null);
    try {
      const body = await updateManagedProperty(propertyId, { amenities: nextList });
      const mapped = mapPropertyFromApi(body?.property);
      if (mapped) setHome(mapped);
      setAmenityMsg("Amenities saved.");
      setTimeout(() => setAmenityMsg(null), 2500);
    } catch (e) {
      setAmenityMsg(e instanceof ApiError ? e.message : "Could not save amenities.");
    } finally {
      setAmenityBusy(false);
    }
  };

  const addAmenities = async () => {
    if (!home?.id) return;
    const parts = amenityDraft.split(/[,|]/).map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    const cur = normalizeAmenities(home.amenities);
    const seen = new Set(cur.map((x) => x.toLowerCase()));
    const next = [...cur];
    for (const p of parts) {
      const k = p.toLowerCase();
      if (!seen.has(k)) {
        next.push(p);
        seen.add(k);
      }
    }
    if (next.length === cur.length) {
      setAmenityMsg("Those amenities are already listed.");
      return;
    }
    await persistAmenities(home.id, next);
    setAmenityDraft("");
  };

  const saveCheckInTime = async () => {
    if (!home?.id) return;
    setCheckInBusy(true);
    setCheckInMsg(null);
    try {
      const body = await updateManagedProperty(home.id, { checkInTime: checkInTime.trim() || "3:00 PM" });
      const mapped = mapPropertyFromApi(body?.property);
      if (mapped) setHome(mapped);
      setCheckInMsg("Check-in time saved.");
      setTimeout(() => setCheckInMsg(null), 2500);
    } catch (e) {
      setCheckInMsg(e instanceof ApiError ? e.message : "Could not save.");
    } finally {
      setCheckInBusy(false);
    }
  };

  const removeAmenity = async (label) => {
    if (!home?.id) return;
    const cur = normalizeAmenities(home.amenities);
    await persistAmenities(
      home.id,
      cur.filter((a) => a !== label),
    );
  };

  if (loading) {
    return (
      <>
        <DashboardPageHeader eyebrow="Property" title="Edit" description="Loading…" />
        <p className="text-sm text-foreground/55">Loading property…</p>
      </>
    );
  }

  if (error || !home) {
    return (
      <>
        <DashboardPageHeader
          eyebrow="Property"
          title="Edit"
          description="Open from the properties table so the link includes property id and slug."
        />
        <p className="mb-4 text-sm text-red-800">{error || "Not found."}</p>
        <Link href="/dashboard/properties/" className="text-sm font-semibold text-primary underline">
          ← All properties
        </Link>
      </>
    );
  }

  const amenities = normalizeAmenities(home.amenities);
  const displayTitle = titleHint || home.title;

  return (
    <>
      <DashboardPageHeader
        eyebrow="Property"
        title={displayTitle}
        description="Amenities save to the API and show on the public listing. Other fields are read-only until wired to PATCH."
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href={listingDetailHref(home.slug)}
          className="inline-flex items-center rounded-full border border-secondary/20 bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/35 hover:text-primary"
        >
          View on site →
        </Link>
        <Link
          href="/dashboard/properties/"
          className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-foreground/60 transition hover:text-foreground"
        >
          ← All properties
        </Link>
        {home.id ? (
          <Link
            href={`/dashboard/properties/upload/?propertyId=${encodeURIComponent(home.id)}&slug=${encodeURIComponent(home.slug)}&listingTitle=${encodeURIComponent(home.title)}`}
            className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
          >
            Photos →
          </Link>
        ) : null}
      </div>

      <div className="space-y-8">
        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Basics</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Field label="Title" hint="Public H1 on listing page.">
              <input readOnly className={inputClass()} defaultValue={home.title} />
            </Field>
            <Field label="URL slug" hint="Matches public URL /listings/view/?slug=…">
              <input readOnly className={`${inputClass()} font-mono text-sm`} defaultValue={home.slug} />
            </Field>
            <Field label="Type" hint="Badge on listing (e.g. Cottage).">
              <input readOnly className={inputClass()} defaultValue={home.type || ""} />
            </Field>
            <Field label="Status" hint="Property.status — draft / published / archived / suspended.">
              <input readOnly className={inputClass()} defaultValue={home.status || ""} />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Location & capacity</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Field label="Location line" hint="Shown with map pin on listing.">
              <input readOnly className={inputClass()} defaultValue={home.location} />
            </Field>
            <div className="grid grid-cols-3 gap-4 sm:col-span-2">
              <Field label="Guests max" hint="Booking guest limit.">
                <input readOnly type="number" className={inputClass()} defaultValue={home.guests} />
              </Field>
              <Field label="Bedrooms">
                <input readOnly type="number" className={inputClass()} defaultValue={home.bedrooms} />
              </Field>
              <Field label="Baths">
                <input readOnly type="number" className={inputClass()} defaultValue={home.baths} />
              </Field>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Pricing</h2>
          <div className="mt-6 max-w-xs">
            <Field label="Price per night (AED)" hint="Listing cards & book flow.">
              <input readOnly type="number" className={inputClass()} defaultValue={home.pricePerNight} />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Guest check-in</h2>
          <p className="mt-1 text-sm text-foreground/55">
            Shown on the public listing as “Check-in from …”. You can use any short text (e.g. <span className="font-mono text-xs">3:00 PM</span>,{" "}
            <span className="font-mono text-xs">15:00</span>, or <span className="font-mono text-xs">After 4 PM</span>).
          </p>
          {checkInMsg ? (
            <p
              className={`mt-3 text-sm ${
                checkInMsg.endsWith("saved.") ? "font-medium text-emerald-800" : "text-red-800"
              }`}
            >
              {checkInMsg}
            </p>
          ) : null}
          <div className="mt-4 flex flex-col gap-3 sm:max-w-md sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <Field label="Check-in from">
                <input
                  className={inputClass()}
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  placeholder="3:00 PM"
                  disabled={checkInBusy || !home.id}
                />
              </Field>
            </div>
            <button
              type="button"
              disabled={checkInBusy || !home.id}
              onClick={() => saveCheckInTime()}
              className="inline-flex shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/92 disabled:opacity-45"
            >
              {checkInBusy ? "Saving…" : "Save"}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Description</h2>
          <Field label="Long copy" hint="Body under title on listing detail.">
            <textarea readOnly rows={5} className={`${inputClass()} resize-y`} defaultValue={home.description} />
          </Field>
        </section>

        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Amenities</h2>
          <p className="mt-1 text-sm text-foreground/55">
            Shown as chips on <span className="font-mono text-xs">/listings/view/?slug=…</span>. Stored as a JSON array on the property.
          </p>
          {amenityMsg ? (
            <p
              className={`mt-3 text-sm ${
                amenityMsg === "Amenities saved."
                  ? "font-medium text-emerald-800"
                  : amenityMsg.startsWith("Those amenities")
                    ? "text-foreground/65"
                    : "text-red-800"
              }`}
            >
              {amenityMsg}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {amenities.length ? (
              amenities.map((a, i) => (
                <span
                  key={`${a}-${i}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-secondary/15 bg-neutral/60 py-1 pl-3 pr-1 text-sm font-medium text-foreground/80"
                >
                  {a}
                  <button
                    type="button"
                    disabled={amenityBusy || !home.id}
                    onClick={() => removeAmenity(a)}
                    className="rounded-full px-2 py-0.5 text-xs font-semibold text-red-800 transition hover:bg-red-100 disabled:opacity-40"
                    aria-label={`Remove ${a}`}
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <p className="text-sm text-foreground/50">No amenities yet.</p>
            )}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label htmlFor="amenity-draft" className="text-xs font-bold uppercase tracking-wide text-foreground/45">
                Add (comma-separated ok)
              </label>
              <input
                id="amenity-draft"
                value={amenityDraft}
                onChange={(e) => setAmenityDraft(e.target.value)}
                placeholder="e.g. Wi‑Fi, Kitchen, Washer"
                className={`${inputClass()} mt-1`}
                disabled={amenityBusy || !home.id}
              />
            </div>
            <button
              type="button"
              disabled={amenityBusy || !home.id || !amenityDraft.trim()}
              onClick={() => addAmenities()}
              className="inline-flex shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/92 disabled:opacity-45"
            >
              {amenityBusy ? "Saving…" : "Add"}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Media</h2>
          <p className="mt-1 text-sm text-foreground/55">Cover + gallery — PropertyImage sortOrder & URLs.</p>
          <ul className="mt-4 space-y-2">
            <li className="truncate rounded-lg border border-secondary/12 bg-neutral/40 px-3 py-2 font-mono text-xs text-foreground/70">
              cover: {home.coverImage || home.coverImageUrl || "—"}
            </li>
            {(home.images || []).slice(0, 12).map((url, i) => (
              <li
                key={`${url}-${i}`}
                className="truncate rounded-lg border border-secondary/12 bg-neutral/40 px-3 py-2 font-mono text-xs text-foreground/70"
              >
                {i + 1}. {url}
              </li>
            ))}
          </ul>
        </section>

        <p className="text-center text-sm text-foreground/45">Other field saves and publish controls can call PATCH when you wire them.</p>
      </div>
    </>
  );
}
