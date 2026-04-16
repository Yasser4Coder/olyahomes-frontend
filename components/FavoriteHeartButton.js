"use client";

import { useEffect, useState } from "react";
import { ApiError, addFavorite, removeFavorite } from "@/lib/api";

function IconHeart({ filled, className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * @param {{ propertyId?: string | null; initialFavorite?: boolean; className?: string; size?: "sm" | "md"; variant?: "overlay" | "panel" }} props
 */
export default function FavoriteHeartButton({
  propertyId,
  initialFavorite = false,
  className = "",
  size = "md",
  variant = "overlay",
}) {
  const [fav, setFav] = useState(Boolean(initialFavorite));
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState(null);

  useEffect(() => {
    setFav(Boolean(initialFavorite));
  }, [propertyId, initialFavorite]);

  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const icon = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const panel = variant === "panel";

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!propertyId || busy) return;
    setBusy(true);
    setHint(null);
    try {
      if (fav) {
        await removeFavorite(propertyId);
        setFav(false);
      } else {
        await addFavorite(propertyId);
        setFav(true);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setHint("Sign in to save favorites.");
      } else if (err instanceof ApiError) {
        setHint(err.message);
      } else {
        setHint("Could not update favorite.");
      }
      window.setTimeout(() => setHint(null), 4500);
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className={`relative inline-flex flex-col items-end ${className}`}>
      <button
        type="button"
        onClick={toggle}
        disabled={!propertyId || busy}
        aria-pressed={fav}
        aria-label={fav ? "Remove from favorites" : "Save to favorites"}
        className={`inline-flex ${dim} items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition disabled:opacity-50 ${
          panel
            ? `border-secondary/20 bg-white/95 text-foreground/70 hover:bg-white ${fav ? "border-rose-200 text-rose-500" : ""}`
            : `border-white/25 bg-black/35 text-white hover:bg-black/45 ${fav ? "text-rose-300" : "text-white"}`
        }`}
      >
        <IconHeart filled={fav} className={icon} />
      </button>
      {hint ? (
        <span
          className={`absolute right-0 top-[calc(100%+4px)] z-20 max-w-56 rounded-lg px-2 py-1 text-left text-[0.65rem] font-medium shadow-md ${
            panel ? "border border-secondary/15 bg-white text-red-800" : "bg-black/75 text-white"
          }`}
          role="status"
        >
          {hint}
        </span>
      ) : null}
    </span>
  );
}
