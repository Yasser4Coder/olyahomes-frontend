"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { ApiError, uploadPropertyImages } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/listingMappers";

const MAX_FILES = 16;
const MAX_MB = 8;

/**
 * @param {{ propertyId: string; title?: string; onUploaded?: (body: unknown) => void }} props
 */
export default function PropertyImageUploader({ propertyId, title, onUploaded }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const clearSelection = useCallback(() => {
    for (const p of previews) {
      if (p.startsWith("blob:")) URL.revokeObjectURL(p);
    }
    setFiles([]);
    setPreviews([]);
    setErr(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  }, [previews]);

  const onPick = (e) => {
    setErr(null);
    setOk(null);
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    const slice = picked.slice(0, MAX_FILES);
    for (const p of previews) {
      if (p.startsWith("blob:")) URL.revokeObjectURL(p);
    }
    setFiles(slice);
    setPreviews(slice.map((f) => URL.createObjectURL(f)));
  };

  const submit = async () => {
    if (!propertyId || !files.length) return;
    setBusy(true);
    setProgress(0);
    setErr(null);
    setOk(null);
    try {
      const body = await uploadPropertyImages(propertyId, files, setProgress);
      setOk(`Uploaded ${Array.isArray(body?.urls) ? body.urls.length : files.length} image(s).`);
      clearSelection();
      onUploaded?.(body);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {title ? <p className="text-sm font-medium text-foreground/70">{title}</p> : null}
      <p className="text-sm text-foreground/60">
        JPG, JPEG, PNG, WebP, GIF, or AVIF — up to {MAX_FILES} files, {MAX_MB} MB each. Field name{" "}
        <code className="rounded bg-neutral/80 px-1 text-xs">images</code>{" "}
        matches the API.
      </p>

      <div className="rounded-2xl border border-dashed border-secondary/25 bg-neutral/30 p-6">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif"
          multiple
          className="block w-full text-sm text-foreground/80 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          onChange={onPick}
        />
      </div>

      {previews.length ? (
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-foreground/45">Selected ({previews.length})</p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {previews.map((src, i) => (
              <li key={src} className="relative aspect-4/3 overflow-hidden rounded-xl border border-secondary/15 bg-zinc-200">
                <Image src={src} alt="" fill className="object-cover" sizes="200px" unoptimized />
                <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[0.65rem] font-medium text-white">
                  {files[i]?.name?.slice(0, 18) || i + 1}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {busy ? (
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-foreground/60">
            <span>Uploading to server...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary/15">
            <div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : null}

      {err ? <p className="text-sm text-red-800">{err}</p> : null}
      {ok ? <p className="text-sm font-medium text-emerald-800">{ok}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy || !files.length}
          onClick={submit}
          className="inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/92 disabled:opacity-45"
        >
          {busy ? "Uploading…" : "Upload to server"}
        </button>
        <button
          type="button"
          disabled={busy || !files.length}
          onClick={clearSelection}
          className="inline-flex rounded-full border border-secondary/20 bg-white px-6 py-2.5 text-sm font-semibold text-foreground transition hover:bg-neutral/60 disabled:opacity-45"
        >
          Clear selection
        </button>
      </div>

      <p className="text-xs text-foreground/45">
        Files are stored under <span className="font-mono">/uploads/properties/</span> and attached as gallery images (cover URL is still the one you set when creating the listing).
      </p>
    </div>
  );
}

export function GalleryUrlsPreview({ urls }) {
  if (!Array.isArray(urls) || !urls.length) return null;
  return (
    <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {urls.map((u) => {
        const src = resolveMediaUrl(u);
        return (
          <li key={u} className="relative aspect-4/3 overflow-hidden rounded-xl border border-secondary/12 bg-zinc-100">
            <Image src={src} alt="" fill className="object-cover" sizes="200px" unoptimized />
          </li>
        );
      })}
    </ul>
  );
}
