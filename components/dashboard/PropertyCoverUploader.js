"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ApiError, uploadPropertyCover } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/listingMappers";

/**
 * @param {{ propertyId: string; label?: string; onUploaded?: (body: unknown) => void }} props
 */
export default function PropertyCoverUploader({ propertyId, label = "Cover image", onUploaded }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const onPick = (e) => {
    setErr(null);
    setOk(null);
    const f = e.target.files?.[0];
    if (!f) return;
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const clear = () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setErr(null);
    setOk(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const submit = async () => {
    if (!propertyId || !file) return;
    setBusy(true);
    setProgress(0);
    setErr(null);
    setOk(null);
    try {
      const body = await uploadPropertyCover(propertyId, file, setProgress);
      setOk("Cover updated.");
      clear();
      onUploaded?.(body);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <p className="mt-0.5 text-xs text-foreground/50">
          One image — JPG, JPEG, PNG, WebP, GIF, or AVIF, up to 8 MB. Replaces the card / hero image for this listing.
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif"
        className="block w-full text-sm text-foreground/80 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        onChange={onPick}
      />
      {preview ? (
        <div className="relative aspect-video max-w-md overflow-hidden rounded-xl border border-secondary/15 bg-zinc-100">
          <Image src={preview} alt="" fill className="object-cover" sizes="400px" unoptimized />
        </div>
      ) : null}
      {busy ? (
        <div className="max-w-md">
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
          disabled={busy || !file}
          onClick={submit}
          className="inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/92 disabled:opacity-45"
        >
          {busy ? "Uploading…" : "Upload as cover"}
        </button>
        <button
          type="button"
          disabled={busy || !file}
          onClick={clear}
          className="inline-flex rounded-full border border-secondary/20 bg-white px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-neutral/60 disabled:opacity-45"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export function CoverPreviewFromApi({ url }) {
  if (!url) return null;
  const src = resolveMediaUrl(url);
  return (
    <div className="relative mt-3 aspect-video max-w-md overflow-hidden rounded-xl border border-secondary/12 bg-zinc-100">
      <Image src={src} alt="" fill className="object-cover" sizes="400px" unoptimized />
    </div>
  );
}
