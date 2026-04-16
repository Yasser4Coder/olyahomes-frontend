import { Suspense } from "react";
import ManagedPropertiesClient from "../ManagedPropertiesClient";

export const metadata = { title: "Properties" };

export default function DashboardPropertiesPage() {
  return (
    <Suspense fallback={<p className="text-sm text-foreground/50">Loading…</p>}>
      <ManagedPropertiesClient />
    </Suspense>
  );
}
