import { Suspense } from "react";
import PaySuccessContent from "./PaySuccessContent";

export const metadata = { title: "Payment success" };

export default function PaySuccessPage() {
  return (
    <div className="min-h-[60vh] bg-[#fdfbf7]">
      <Suspense
        fallback={
          <div className="mx-auto max-w-lg px-4 py-16 text-center text-foreground/60">
            <div className="mx-auto size-10 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
            <p className="mt-6 text-sm">Loading…</p>
          </div>
        }
      >
        <PaySuccessContent />
      </Suspense>
    </div>
  );
}
