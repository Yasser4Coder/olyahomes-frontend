/**
 * Listing detail URL compatible with `output: "export"` (no dynamic `[slug]` segment).
 * @param {string | null | undefined} slug
 */
export function listingDetailHref(slug) {
  const s = slug != null ? String(slug).trim() : "";
  if (!s) return "/listings/";
  return `/listings/view/?slug=${encodeURIComponent(s)}`;
}
