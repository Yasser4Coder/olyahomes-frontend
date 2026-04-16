"use client";

import Image from "next/image";

/**
 * @param {{ items: { id: string; url: string }[]; deletingId: string | null; onDelete: (id: string) => void }} props
 */
export default function PropertyGalleryDeletable({ items, deletingId, onDelete }) {
  if (!Array.isArray(items) || !items.length) {
    return <p className="text-sm text-foreground/50">No gallery images saved yet. Upload below — you can add more anytime and keep existing ones.</p>;
  }
  return (
    <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <li
          key={item.id}
          className="group relative aspect-4/3 overflow-hidden rounded-xl border border-secondary/12 bg-zinc-100"
        >
          <Image src={item.url} alt="" fill className="object-cover" sizes="200px" unoptimized />
          <div className="absolute inset-x-0 bottom-0 flex justify-end bg-black/55 p-2">
            <button
              type="button"
              disabled={Boolean(deletingId)}
              onClick={() => onDelete(item.id)}
              className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-red-800 shadow-sm transition hover:bg-white disabled:opacity-40"
            >
              {deletingId === item.id ? "Removing…" : "Remove"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
