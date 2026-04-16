import { Suspense } from "react";
import PropertyUploadPageClient from "./PropertyUploadPageClient";

export const metadata = { title: "Upload photos" };

export default function DashboardPropertyUploadPage() {
  return (
    <Suspense fallback={<p className="text-sm text-foreground/50">Loading…</p>}>
      <PropertyUploadPageClient />
    </Suspense>
  );
}
