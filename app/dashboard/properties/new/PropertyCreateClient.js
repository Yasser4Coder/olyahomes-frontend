"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import PropertyCoverUploader, { CoverPreviewFromApi } from "@/components/dashboard/PropertyCoverUploader";
import PropertyImageUploader, { GalleryUrlsPreview } from "@/components/dashboard/PropertyImageUploader";
import { ApiError, createProperty } from "@/lib/api";
import { mapPropertyFromApi } from "@/lib/listingMappers";
import { listingDetailHref } from "@/lib/listingRoutes";

function inputClass() {
  return "w-full rounded-xl border border-secondary/20 bg-white px-4 py-2.5 text-sm text-foreground shadow-sm outline-none ring-primary/0 transition placeholder:text-foreground/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/15";
}

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

const initialForm = () => ({
  title: "",
  location: "",
  city: "",
  description: "",
  propertyType: "Apartment",
  pricePerNight: "",
  maxGuests: "4",
  bedrooms: "1",
  baths: "1",
  amenitiesRaw: "Wi‑Fi, Kitchen",
  status: "draft",
  checkInTime: "3:00 PM",
});

export default function PropertyCreateClient() {
  const [phase, setPhase] = useState("form"); // "form" | "upload"
  const [created, setCreated] = useState(null);
  const [galleryUrls, setGalleryUrls] = useState([]);
  /** Resolved cover for listing card (updates after file upload). */
  const [coverDisplayUrl, setCoverDisplayUrl] = useState(null);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [pricePerNight, setPricePerNight] = useState("");
  const [maxGuests, setMaxGuests] = useState("4");
  const [bedrooms, setBedrooms] = useState("1");
  const [baths, setBaths] = useState("1");
  const [amenitiesRaw, setAmenitiesRaw] = useState("Wi‑Fi, Kitchen");
  const [status, setStatus] = useState("draft");
  const [checkInTime, setCheckInTime] = useState("3:00 PM");

  const resetToNewListing = useCallback(() => {
    const z = initialForm();
    setTitle(z.title);
    setLocation(z.location);
    setCity(z.city);
    setDescription(z.description);
    setPropertyType(z.propertyType);
    setPricePerNight(z.pricePerNight);
    setMaxGuests(z.maxGuests);
    setBedrooms(z.bedrooms);
    setBaths(z.baths);
    setAmenitiesRaw(z.amenitiesRaw);
    setStatus(z.status);
    setCheckInTime(z.checkInTime);
    setPhase("form");
    setCreated(null);
    setGalleryUrls([]);
    setCoverDisplayUrl(null);
    setErr(null);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const amenities = amenitiesRaw
        .split(/[,|]/)
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        title: title.trim(),
        location: location.trim(),
        city: city.trim() || undefined,
        description: description.trim(),
        propertyType: propertyType.trim(),
        pricePerNight: Number(pricePerNight),
        maxGuests: Number(maxGuests),
        bedrooms: Number(bedrooms),
        baths: Number(baths),
        amenities,
        status,
        checkInTime: checkInTime.trim() || "3:00 PM",
      };
      const body = await createProperty(payload);
      const p = body?.property;
      const id = p?.id != null ? String(p.id) : null;
      const slug = p?.slug;
      if (!id || !slug) {
        setErr("Created listing but API did not return id/slug.");
        return;
      }
      const mapped = mapPropertyFromApi(p);
      setCreated({
        id,
        slug,
        title: typeof p?.title === "string" ? p.title : title.trim(),
      });
      setCoverDisplayUrl(mapped?.coverImage || mapped?.coverImageUrl || null);
      setGalleryUrls(Array.isArray(mapped?.images) ? mapped.images : []);
      setPhase("upload");
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Could not create property.");
    } finally {
      setBusy(false);
    }
  };

  const onImagesUploaded = useCallback((body) => {
    const mapped = mapPropertyFromApi(body?.property);
    const imgs = mapped?.images?.length ? mapped.images : Array.isArray(body?.urls) ? body.urls : [];
    setGalleryUrls(imgs);
    if (mapped?.coverImage || mapped?.coverImageUrl) {
      setCoverDisplayUrl(mapped.coverImage || mapped.coverImageUrl);
    }
  }, []);

  const onCoverUploaded = useCallback((body) => {
    const mapped = mapPropertyFromApi(body?.property);
    if (mapped?.coverImage || mapped?.coverImageUrl) {
      setCoverDisplayUrl(mapped.coverImage || mapped.coverImageUrl);
    }
  }, []);

  if (phase === "upload" && created) {
    return (
      <>
        <DashboardPageHeader
          eyebrow="Properties"
          title="Listing created"
          description="Set the card cover and gallery images — all uploads go to your API (cover = one file, gallery = multiple)."
        />
        <div className="mb-6 flex flex-wrap gap-4">
          <Link href="/dashboard/properties/" className="text-sm font-semibold text-foreground/60 transition hover:text-foreground">
            ← All properties
          </Link>
          <Link
            href={listingDetailHref(created.slug)}
            className="text-sm font-semibold text-primary transition hover:underline"
          >
            View on site →
          </Link>
        </div>

        <p className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <span className="font-semibold">{created.title}</span>
          <span className="text-emerald-800/80"> · slug </span>
          <span className="font-mono text-xs font-semibold">{created.slug}</span>
        </p>

        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Cover image (listing card)</h2>
          <p className="mt-1 text-sm text-foreground/55">Replaces the cover used on cards and detail. Same as step 1 URL if you only used a link — upload here to switch to a file on your server.</p>
          {coverDisplayUrl ? (
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-foreground/45">Current cover</p>
              <CoverPreviewFromApi url={coverDisplayUrl} />
            </div>
          ) : null}
          <div className="mt-6">
            <PropertyCoverUploader propertyId={created.id} onUploaded={onCoverUploaded} />
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Gallery photos</h2>
          <p className="mt-1 text-sm text-foreground/55">JPG, JPEG, PNG, WebP, GIF, or AVIF — stored under /uploads/properties/.</p>
          <div className="mt-6">
            <PropertyImageUploader propertyId={created.id} title={created.title} onUploaded={onImagesUploaded} />
          </div>
        </section>

        {galleryUrls.length ? (
          <section className="mt-8 rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-foreground">Current gallery</h2>
            <p className="mt-1 text-sm text-foreground/55">Updates after each successful gallery upload.</p>
            <GalleryUrlsPreview urls={galleryUrls} />
          </section>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetToNewListing}
            className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary/92"
          >
            Add another listing
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow="Properties"
        title="Add a listing"
        description="Step 1: listing details. Step 2: upload the cover and gallery images on the same page with live progress."
      />
      <div className="mb-6">
        <Link href="/dashboard/properties/" className="text-sm font-semibold text-foreground/60 transition hover:text-foreground">
          ← All properties
        </Link>
      </div>

      {err ? <p className="mb-4 text-sm text-red-800">{err}</p> : null}

      <form onSubmit={submit} className="space-y-8">
        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Basics</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Field label="Title" hint="Public name; used to generate the URL slug.">
              <input required className={inputClass()} value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="Type" hint="e.g. Apartment, Villa, Loft.">
              <input required className={inputClass()} value={propertyType} onChange={(e) => setPropertyType(e.target.value)} />
            </Field>
            <Field label="Status">
              <select className={inputClass()} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Location</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Field label="Location line" hint="Shown on cards (e.g. Dubai Marina, Dubai).">
              <input required className={inputClass()} value={location} onChange={(e) => setLocation(e.target.value)} />
            </Field>
            <Field label="City (optional)" hint="Used for filters — can match part of location.">
              <input className={inputClass()} value={city} onChange={(e) => setCity(e.target.value)} />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Capacity & pricing</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Max guests">
              <input required type="number" min={1} className={inputClass()} value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} />
            </Field>
            <Field label="Bedrooms">
              <input required type="number" min={0} className={inputClass()} value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
            </Field>
            <Field label="Baths">
              <input required type="number" min={0} className={inputClass()} value={baths} onChange={(e) => setBaths(e.target.value)} />
            </Field>
            <Field label="Price / night (AED)">
              <input required type="number" min={0} step="0.01" className={inputClass()} value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} />
            </Field>
            <div className="sm:col-span-2 lg:col-span-4">
              <Field label="Check-in from" hint="Shown on the public listing (e.g. 3:00 PM, 15:00, or After 4 PM).">
                <input className={inputClass()} value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} placeholder="3:00 PM" />
              </Field>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
          <Field label="Description" hint="Long copy for the listing page.">
            <textarea required rows={6} className={`${inputClass()} resize-y`} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
        </section>

        <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
          <div className="mt-6">
            <Field label="Amenities" hint="Comma-separated list.">
              <input className={inputClass()} value={amenitiesRaw} onChange={(e) => setAmenitiesRaw(e.target.value)} />
            </Field>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary/92 disabled:opacity-50"
          >
            {busy ? "Creating…" : "Create property & continue to uploads"}
          </button>
          <Link
            href="/dashboard/properties/"
            className="inline-flex items-center rounded-full border border-secondary/20 bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-neutral/60"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
