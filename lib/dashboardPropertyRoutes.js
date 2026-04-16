/**
 * Dashboard property editor URL — static path for `output: "export"` (no `[slug]` segment).
 * @param {{ id?: string | number; slug?: string; title?: string }} p
 */
export function dashboardPropertyEditHref({ id, slug, title } = {}) {
  const q = new URLSearchParams();
  if (id != null && id !== "") q.set("propertyId", String(id));
  if (slug) q.set("slug", slug);
  if (title) q.set("listingTitle", title);
  const qs = q.toString();
  return qs ? `/dashboard/properties/edit/?${qs}` : "/dashboard/properties/edit/";
}
