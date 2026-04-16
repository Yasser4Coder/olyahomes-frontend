import { Suspense } from "react";
import PropertyEditClient from "./PropertyEditClient";

export default function DashboardPropertyEditPage() {
  return (
    <Suspense fallback={<p className="text-sm text-foreground/55">Loading…</p>}>
      <PropertyEditClient />
    </Suspense>
  );
}
