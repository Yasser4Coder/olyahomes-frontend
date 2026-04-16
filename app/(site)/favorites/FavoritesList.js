"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, fetchMyFavorites, removeFavorite } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/listingMappers";
import { listingDetailHref } from "@/lib/listingRoutes";
import { formatAED } from "@/lib/currency";

export default function FavoritesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const body = await fetchMyFavorites();
      setItems(Array.isArray(body?.favorites) ? body.favorites : []);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setError("Please sign in to view favorites.");
      } else {
        setError(e instanceof ApiError ? e.message : "Could not load favorites.");
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <p className="text-sm text-foreground/50">Loading…</p>;
  }
  if (error) {
    return <p className="text-sm text-red-800">{error}</p>;
  }
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-secondary/15 bg-white p-10 text-center shadow-sm">
        <p className="font-hero-serif text-xl font-semibold text-foreground">No saved stays yet</p>
        <p className="mt-2 text-sm text-foreground/60">Browse listings and tap the heart on a card or listing page to save it here.</p>
        <Link href="/listings/" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
          Browse homes
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((row) => {
        const p = row.property;
        if (!p) return null;
        return (
          <article
            key={row.favoriteId}
            className="flex flex-col overflow-hidden rounded-2xl border border-secondary/15 bg-white shadow-sm"
          >
            <Link href={listingDetailHref(p.slug)} className="relative block aspect-4/3 bg-zinc-200">
              <Image
                src={resolveMediaUrl(p.coverImage)}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 33vw"
              />
            </Link>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <h2 className="font-semibold text-foreground">{p.title}</h2>
              <p className="text-sm text-foreground/60">{p.location}</p>
              <p className="text-sm font-bold text-primary">{formatAED(p.pricePerNight)} / night</p>
              <div className="mt-auto flex gap-2">
                <Link
                  href={listingDetailHref(p.slug)}
                  className="flex-1 rounded-xl border border-secondary/20 py-2 text-center text-sm font-semibold text-foreground hover:bg-neutral/60"
                >
                  View
                </Link>
                <button
                  type="button"
                  className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-50"
                  onClick={async () => {
                    await removeFavorite(p.id);
                    setItems((xs) => xs.filter((x) => x.favoriteId !== row.favoriteId));
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
