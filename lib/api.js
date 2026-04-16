const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function getApiBase() {
  return rawBase.replace(/\/$/, "");
}

export class ApiError extends Error {
  /**
   * @param {number} status
   * @param {Record<string, unknown> | null} body
   */
  constructor(status, body) {
    super(typeof body?.message === "string" ? body.message : "Request failed");
    this.name = "ApiError";
    this.status = status;
    this.code = typeof body?.code === "string" ? body.code : undefined;
    this.details = body?.details;
  }
}

/**
 * @param {string} path
 * @param {RequestInit & { json?: unknown }} [options]
 */
export async function apiFetch(path, options = {}) {
  const { json, headers, ...rest } = options;
  const url = `${getApiBase()}${path.startsWith("/") ? path : `/${path}`}`;

  const method = String(rest.method || "GET").toUpperCase();
  const requestInit = {
    ...rest,
    credentials: "include",
    headers: {
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  };

  const doFetch = () => fetch(url, requestInit);

  let res = await doFetch();
  // Auto-refresh access token for safe reads (avoids surprise logout due to 15m access TTL).
  if ((res.status === 401 || res.status === 403) && method === "GET") {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      res = await doFetch();
    }
  }

  const text = await res.text();
  /** @type {Record<string, unknown> | null} */
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text };
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, body);
  }

  return body;
}

let refreshInFlight = null;

async function tryRefreshSession() {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

export function fetchMe() {
  return apiFetch("/api/v1/auth/me", { method: "GET" });
}

/** Logged-in user — set first password (e.g. after Google) or change password. */
export function setAccountPassword(payload) {
  return apiFetch("/api/v1/auth/password", { method: "POST", json: payload });
}

export function fetchMyBookings() {
  return apiFetch("/api/v1/bookings/me", { method: "GET" });
}

/** Guest — server-calculated refund preview before cancelling. */
export function fetchGuestCancelPreview(bookingId) {
  return apiFetch(`/api/v1/bookings/me/cancel-preview${toSearchParams({ bookingId })}`, { method: "GET" });
}

/** Guest — cancel booking; may trigger Stripe refund (amount from server only). */
export function guestCancelBooking(payload) {
  return apiFetch("/api/v1/bookings/me/cancel", { method: "POST", json: payload });
}

/** @param {Record<string, string | number | undefined | null>} [query] — q, page, pageSize */
export function fetchHostBookings(query) {
  return apiFetch(`/api/v1/bookings/host${toSearchParams(query ?? {})}`, { method: "GET" });
}

/** Owner/admin — cancel booking (frees dates) */
export function cancelHostBooking(bookingId) {
  return apiFetch(`/api/v1/bookings/${encodeURIComponent(bookingId)}/cancel`, { method: "POST" });
}

/** Owner/admin — confirm pending booking */
export function confirmHostBooking(bookingId) {
  return apiFetch(`/api/v1/bookings/${encodeURIComponent(bookingId)}/confirm`, { method: "POST" });
}

/** Clears HTTP-only auth cookies on the API. */
export function logout() {
  return apiFetch("/api/v1/auth/logout", { method: "POST" });
}

/** @param {Record<string, string | number | undefined | null>} params */
function toSearchParams(params) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function fetchPropertyFacets() {
  return apiFetch(`/api/v1/properties/facets${toSearchParams({})}`);
}

export function fetchFeaturedProperties(limit = 12) {
  return apiFetch(`/api/v1/properties/featured${toSearchParams({ limit })}`);
}

export function fetchTestimonials() {
  return apiFetch("/api/v1/testimonials", { method: "GET" });
}

/** @param {Record<string, string | number | undefined | null>} query */
export function fetchProperties(query) {
  return apiFetch(`/api/v1/properties${toSearchParams(query)}`);
}

export function fetchPropertyBySlug(slug) {
  return apiFetch(`/api/v1/properties/by-slug/${encodeURIComponent(slug)}`);
}

export function fetchPropertyAvailability(slug, from, to) {
  return apiFetch(
    `/api/v1/properties/by-slug/${encodeURIComponent(slug)}/availability${toSearchParams({ from, to })}`,
  );
}

export function fetchManagedProperties(query) {
  return apiFetch(`/api/v1/properties/manage${toSearchParams(query)}`);
}

/** Owner/admin — draft or published, includes gallery URLs (cookies required). */
export function fetchManagedPropertyById(propertyId) {
  return apiFetch(`/api/v1/properties/${encodeURIComponent(propertyId)}`, { method: "GET" });
}

/** Owner/admin — partial update (e.g. amenities, title). */
export function updateManagedProperty(propertyId, json) {
  return apiFetch(`/api/v1/properties/${encodeURIComponent(propertyId)}`, { method: "PATCH", json });
}

/** Owner/admin — creates draft or published listing (slug generated server-side). */
export function createProperty(payload) {
  return apiFetch("/api/v1/properties/", { method: "POST", json: payload });
}

/**
 * Multipart upload with progress via XHR.
 * `fetch()` does not expose upload progress, so XHR is the reliable browser-side solution.
 * @param {string} path
 * @param {FormData} formData
 * @param {(percent: number) => void} [onProgress]
 */
function uploadWithProgress(path, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${getApiBase()}${path}`);
    xhr.withCredentials = true;

    if (xhr.upload && typeof onProgress === "function") {
      xhr.upload.addEventListener("progress", (event) => {
        if (!event.lengthComputable) return;
        onProgress(Math.max(0, Math.min(100, Math.round((event.loaded / event.total) * 100))));
      });
    }

    xhr.addEventListener("load", () => {
      const text = xhr.responseText || "";
      /** @type {Record<string, unknown> | null} */
      let body = null;
      if (text) {
        try {
          body = JSON.parse(text);
        } catch {
          body = { message: text };
        }
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        if (typeof onProgress === "function") onProgress(100);
        resolve(body);
        return;
      }
      reject(new ApiError(xhr.status || 0, body));
    });

    xhr.addEventListener("error", () => {
      reject(new ApiError(0, { message: "Upload failed." }));
    });

    xhr.send(formData);
  });
}

/**
 * Owner/admin — multipart upload (`images` field, up to 16 files). Same cookies as `apiFetch`.
 * @param {string} propertyId
 * @param {File[] | FileList} files
 */
/** Owner/admin — single file, field name `cover`; sets property coverImageUrl. */
export async function uploadPropertyCover(propertyId, file, onProgress) {
  if (!file) {
    throw new ApiError(400, { message: "Choose a cover image." });
  }
  const fd = new FormData();
  fd.append("cover", file);
  return uploadWithProgress(`/api/v1/properties/${encodeURIComponent(propertyId)}/cover`, fd, onProgress);
}

/** Owner/admin — remove one gallery image row (not the listing cover). */
export function deletePropertyGalleryImage(propertyId, imageId) {
  return apiFetch(
    `/api/v1/properties/${encodeURIComponent(propertyId)}/images/${encodeURIComponent(imageId)}`,
    { method: "DELETE" },
  );
}

export async function uploadPropertyImages(propertyId, files, onProgress) {
  const list = Array.from(files);
  if (!list.length) {
    throw new ApiError(400, { message: "Choose at least one image." });
  }
  const fd = new FormData();
  for (const f of list) {
    fd.append("images", f);
  }
  return uploadWithProgress(`/api/v1/properties/${encodeURIComponent(propertyId)}/images`, fd, onProgress);
}

export function patchPropertyFeatured(id, body) {
  return apiFetch(`/api/v1/properties/${encodeURIComponent(id)}/featured`, { method: "PATCH", json: body });
}

export function fetchDashboardSummary() {
  return apiFetch("/api/v1/dashboard/summary");
}

export function fetchDashboardOverview() {
  return apiFetch("/api/v1/dashboard/overview");
}

export function fetchMyFavorites() {
  return apiFetch("/api/v1/favorites/");
}

export function addFavorite(propertyId) {
  return apiFetch(`/api/v1/favorites/${encodeURIComponent(propertyId)}`, { method: "POST" });
}

export function removeFavorite(propertyId) {
  return apiFetch(`/api/v1/favorites/${encodeURIComponent(propertyId)}`, { method: "DELETE" });
}

export function createBooking(payload) {
  return apiFetch("/api/v1/bookings/", { method: "POST", json: payload });
}

export function submitContactMessage(payload) {
  return apiFetch("/api/v1/contact/", { method: "POST", json: payload });
}

export function fetchDashboardContactMessages(query) {
  return apiFetch(`/api/v1/dashboard/contact-messages${toSearchParams(query ?? {})}`, { method: "GET" });
}

export function fetchDashboardPayments(query) {
  return apiFetch(`/api/v1/dashboard/payments${toSearchParams(query ?? {})}`, { method: "GET" });
}

export function fetchDashboardUsers(query) {
  return apiFetch(`/api/v1/dashboard/users${toSearchParams(query ?? {})}`, { method: "GET" });
}

export function fetchDashboardTestimonials(query) {
  return apiFetch(`/api/v1/dashboard/testimonials${toSearchParams(query ?? {})}`, { method: "GET" });
}

export function createDashboardTestimonial(payload) {
  return apiFetch("/api/v1/dashboard/testimonials", { method: "POST", json: payload });
}

export function patchDashboardTestimonial(id, payload) {
  return apiFetch(`/api/v1/dashboard/testimonials/${encodeURIComponent(id)}`, { method: "PATCH", json: payload });
}

export function deleteDashboardTestimonial(id) {
  return apiFetch(`/api/v1/dashboard/testimonials/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function patchDashboardUserRole(userId, role) {
  return apiFetch(`/api/v1/dashboard/users/${encodeURIComponent(userId)}/role`, { method: "PATCH", json: { role } });
}

/** Guest — start Stripe Checkout (amount is taken from the booking on the server). */
export function createStripeCheckoutSession(payload) {
  return apiFetch("/api/v1/payments/checkout-session", { method: "POST", json: payload });
}

/** Guest — poll after Stripe redirect; confirms ownership and returns DB booking status. */
export function fetchCheckoutSessionStatus(sessionId) {
  return apiFetch(
    `/api/v1/payments/checkout-status${toSearchParams({ session_id: sessionId })}`,
    { method: "GET" },
  );
}
