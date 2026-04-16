"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import PropertyCoverUploader, { CoverPreviewFromApi } from "@/components/dashboard/PropertyCoverUploader";
import PropertyGalleryDeletable from "@/components/dashboard/PropertyGalleryDeletable";
import PropertyImageUploader from "@/components/dashboard/PropertyImageUploader";
import { ApiError, deletePropertyGalleryImage, fetchManagedPropertyById } from "@/lib/api";
import { mapPropertyFromApi } from "@/lib/listingMappers";
import { listingDetailHref } from "@/lib/listingRoutes";

/** Static export: property id is passed as ?propertyId= (no dynamic segment). */
export default function PropertyUploadPageClient() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const titleHint = searchParams.get("listingTitle") || searchParams.get("title");
  const slugHint = searchParams.get("slug");

  const [galleryItems, setGalleryItems] = useState([]);
  const [coverDisplayUrl, setCoverDisplayUrl] = useState(null);
  const [loadErr, setLoadErr] = useState(null);
  const [galleryErr, setGalleryErr] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const applyFromApiProperty = useCallback((prop) => {
    const mapped = mapPropertyFromApi(prop);
    if (!mapped) return;
    setGalleryItems(Array.isArray(mapped.galleryWithIds) ? mapped.galleryWithIds : []);
    if (mapped.coverImage || mapped.coverImageUrl) {
      setCoverDisplayUrl(mapped.coverImage || mapped.coverImageUrl);
    }
  }, []);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;
    setLoadErr(null);
    (async () => {
      try {
        const body = await fetchManagedPropertyById(propertyId);
        if (cancelled) return;
        applyFromApiProperty(body?.property);
      } catch (e) {
        if (!cancelled) {
          setLoadErr(e instanceof ApiError ? e.message : "Could not load existing photos.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [propertyId, applyFromApiProperty]);

  const onGalleryUploaded = useCallback(
    (body) => {
      setGalleryErr(null);
      if (body?.property) applyFromApiProperty(body.property);
    },
    [applyFromApiProperty],
  );

  const onCoverUploaded = useCallback((body) => {
    const mapped = mapPropertyFromApi(body?.property);
    if (mapped?.coverImage || mapped?.coverImageUrl) {
      setCoverDisplayUrl(mapped.coverImage || mapped.coverImageUrl);
    }
    if (body?.property) applyFromApiProperty(body.property);
  }, [applyFromApiProperty]);

  const onDeleteGalleryImage = useCallback(
    async (imageId) => {
      if (!propertyId || !imageId) return;
      setGalleryErr(null);
      setDeletingId(imageId);
      try {
        const body = await deletePropertyGalleryImage(propertyId, imageId);
        applyFromApiProperty(body?.property);
      } catch (e) {
        setGalleryErr(e instanceof ApiError ? e.message : "Could not remove image.");
      } finally {
        setDeletingId(null);
      }
    },
    [propertyId, applyFromApiProperty],
  );

  const heading = useMemo(
    () => titleHint || (propertyId ? `Property #${propertyId}` : "Property"),
    [titleHint, propertyId],
  );

  if (!propertyId) {
    return (
      <>
        <DashboardPageHeader
          eyebrow="Properties"
          title="Upload photos"
          description="Open this page from the properties table (Photos) or add ?propertyId=123 to the URL."
        />
        <p className="mb-4 text-sm text-red-800">Missing <code className="rounded bg-neutral/80 px-1">propertyId</code> query parameter.</p>
        <Link href="/dashboard/properties/" className="text-sm font-semibold text-primary underline">
          ← All properties
        </Link>
      </>
    );
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow="Properties"
        title="Upload photos"
        description="Replace the cover, add gallery photos, or remove individual gallery images. Uploads append to what you already have."
      />
      <div className="mb-6 flex flex-wrap gap-4">
        <Link href="/dashboard/properties/" className="text-sm font-semibold text-foreground/60 transition hover:text-foreground">
          ← All properties
        </Link>
        {slugHint ? (
          <Link
            href={listingDetailHref(slugHint)}
            className="text-sm font-semibold text-primary transition hover:underline"
          >
            View listing on site →
          </Link>
        ) : null}
      </div>

      {loadErr ? <p className="mb-4 text-sm text-amber-900">{loadErr}</p> : null}

      <section className="rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Cover image</h2>
        <p className="mt-1 text-sm text-foreground/55">Uploading a new file replaces the listing card / hero image (not the same as gallery rows below).</p>
        {coverDisplayUrl ? (
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-foreground/45">Current cover</p>
            <CoverPreviewFromApi url={coverDisplayUrl} />
          </div>
        ) : null}
        <div className="mt-6">
          <PropertyCoverUploader propertyId={propertyId} onUploaded={onCoverUploaded} />
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-secondary/12 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Gallery</h2>
        <p className="mt-1 text-sm text-foreground/55">
          Gallery photos are stored as separate rows. <strong>Remove</strong> drops one photo; <strong>Upload</strong> adds new files and keeps the rest.
        </p>

        <div className="mt-8 border-t border-secondary/10 pt-8">
          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/45">Saved on server</h3>
          {galleryErr ? <p className="mt-2 text-sm text-red-800">{galleryErr}</p> : null}
          <PropertyGalleryDeletable items={galleryItems} deletingId={deletingId} onDelete={onDeleteGalleryImage} />
        </div>

        <div className="mt-10 border-t border-secondary/10 pt-8">
          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/45">Add photos</h3>
          <p className="mt-1 text-sm text-foreground/55">POST /api/v1/properties/:id/images — field name images (multipart).</p>
          <div className="mt-6">
            <PropertyImageUploader propertyId={propertyId} title={heading} onUploaded={onGalleryUploaded} />
          </div>
        </div>
      </section>
    </>
  );
}
