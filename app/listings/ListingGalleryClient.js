"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

function IconX({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function IconPlus({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function IconMinus({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export default function ListingGalleryClient({ title, images }) {
  const gallery = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setActive((i) => clamp(i + 1, 0, gallery.length - 1));
      if (e.key === "ArrowLeft") setActive((i) => clamp(i - 1, 0, gallery.length - 1));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [gallery.length, open]);

  useEffect(() => {
    if (!open) setZoom(1);
  }, [open]);

  if (!gallery.length) return null;

  const pick = (idx) => {
    setActive(idx);
    setOpen(true);
  };

  return (
    <>
      {/* Airbnb-like grid */}
      <div className="grid gap-2 overflow-hidden bg-zinc-100 sm:gap-3 lg:grid-cols-4 lg:grid-rows-2">
        <button
          type="button"
          onClick={() => pick(0)}
          className="group relative aspect-4/3 overflow-hidden bg-zinc-200 lg:col-span-2 lg:row-span-2 lg:aspect-auto"
          aria-label="Open photo 1"
        >
          <Image
            src={gallery[0]}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 900px"
            priority
          />
        </button>

        {gallery.slice(1, 5).map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => pick(i + 1)}
            className="group relative aspect-4/3 overflow-hidden bg-zinc-200"
            aria-label={`Open photo ${i + 2}`}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 50vw, 280px"
            />
            {i === 3 && gallery.length > 5 ? (
              <div className="absolute inset-0 grid place-items-center bg-black/35">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/25 backdrop-blur">
                  +{gallery.length - 5} photos
                </span>
              </div>
            ) : null}
          </button>
        ))}
      </div>

      {/* Modal viewer */}
      {open ? (
        <div className="fixed inset-0 z-80" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/85"
            onClick={() => setOpen(false)}
            aria-label="Close gallery"
          />

          <div className="relative mx-auto flex h-full max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-6">
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-sm font-semibold text-white/80">
                {title}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => clamp(Number((z - 0.25).toFixed(2)), 1, 3))}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/15"
                  aria-label="Zoom out"
                >
                  <IconMinus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => clamp(Number((z + 0.25).toFixed(2)), 1, 3))}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/15"
                  aria-label="Zoom in"
                >
                  <IconPlus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/15"
                  aria-label="Close"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex min-h-0 flex-1 flex-col gap-3">
              <div className="min-h-0 flex-1 overflow-auto rounded-2xl border border-white/10 bg-black/30">
                <div className="relative mx-auto w-full max-w-5xl p-3 sm:p-5">
                  <div
                    className="relative mx-auto"
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "center",
                      transition: "transform 120ms ease",
                      width: "min(100%, 1024px)",
                      aspectRatio: "16 / 10",
                    }}
                  >
                    <Image
                      src={gallery[active]}
                      alt=""
                      fill
                      className="rounded-xl object-contain"
                      sizes="(max-width: 1024px) 100vw, 1024px"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {gallery.map((src, idx) => (
                  <button
                    key={`${src}-${idx}`}
                    type="button"
                    onClick={() => setActive(idx)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition ${
                      idx === active
                        ? "border-white/70 ring-2 ring-white/20"
                        : "border-white/10 hover:border-white/30"
                    }`}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="96px" />
                  </button>
                ))}
              </div>
              <p className="text-center text-xs font-semibold text-white/60">
                Tip: use ← → arrows to navigate, Esc to close.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

