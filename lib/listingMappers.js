function apiBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  return raw.replace(/\/$/, "");
}

/**
 * Coerce API/DB amenities to string[] (handles JSON string, comma list, plain object).
 * @param {unknown} v
 * @returns {string[]}
 */
export function normalizeAmenities(v) {
  if (v == null || v === "") return [];
  if (Array.isArray(v)) {
    return v
      .map((x) => (typeof x === "string" ? x.trim() : x != null ? String(x).trim() : ""))
      .filter(Boolean)
      .slice(0, 64);
  }
  if (typeof v === "string") {
    const t = v.trim();
    if (!t) return [];
    if (t.startsWith("[") || t.startsWith("{")) {
      try {
        return normalizeAmenities(JSON.parse(t));
      } catch {
        /* fall through */
      }
    }
    return t
      .split(/[,|]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 64);
  }
  if (typeof v === "object") {
    return Object.values(v)
      .map((x) => (typeof x === "string" ? x.trim() : String(x ?? "").trim()))
      .filter(Boolean)
      .slice(0, 64);
  }
  return [];
}

/** Turn relative upload paths into absolute URLs for <Image src> when needed. */
export function resolveMediaUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${apiBase()}${url}`;
  return url;
}

/** Normalizes API property to shapes used by listing cards & detail page. */
export function mapPropertyFromApi(p) {
  if (!p) return null;
  const images = Array.isArray(p.images) ? p.images.map(resolveMediaUrl) : [];
  const cover = resolveMediaUrl(p.coverImage || p.coverImageUrl);
  const galleryWithIds = Array.isArray(p.galleryWithIds)
    ? p.galleryWithIds
        .map((row) => ({
          id: row && row.id != null ? String(row.id) : "",
          url: resolveMediaUrl(typeof row === "string" ? row : row?.url),
        }))
        .filter((x) => x.id && x.url)
    : [];
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    location: p.location,
    city: p.city,
    description: p.description,
    type: p.type || p.propertyType,
    propertyType: p.propertyType || p.type,
    pricePerNight: Number(p.pricePerNight),
    guests: p.guests ?? p.maxGuests,
    maxGuests: p.maxGuests ?? p.guests,
    bedrooms: p.bedrooms,
    baths: p.baths,
    amenities: normalizeAmenities(p.amenities),
    coverImage: cover,
    coverImageUrl: cover,
    images: images.length ? images : cover ? [cover] : [],
    galleryWithIds,
    isFavorite: Boolean(p.isFavorite),
    isFeatured: Boolean(p.isFeatured),
    status: p.status,
    checkInTime:
      typeof p.checkInTime === "string" && p.checkInTime.trim()
        ? p.checkInTime.trim().slice(0, 64)
        : "3:00 PM",
  };
}
