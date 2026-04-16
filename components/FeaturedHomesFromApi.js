"use client";

import { useEffect, useState } from "react";
import { ApiError, fetchFeaturedProperties } from "@/lib/api";
import { mapPropertyFromApi } from "@/lib/listingMappers";
import FeaturedHomesSection from "@/components/FeaturedHomesSection";

/**
 * Loads featured homes from the API (admin-controlled). Falls back to `fallbackHomes` on error.
 */
export default function FeaturedHomesFromApi({ fallbackHomes }) {
  const [homes, setHomes] = useState(fallbackHomes);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const body = await fetchFeaturedProperties(12);
        const raw = Array.isArray(body?.properties) ? body.properties : [];
        const mapped = raw.map(mapPropertyFromApi).filter(Boolean);
        if (!cancelled && mapped.length) setHomes(mapped);
      } catch (e) {
        if (!cancelled && e instanceof ApiError && e.status !== 401) {
          /* keep fallback */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return <FeaturedHomesSection homes={homes} />;
}
