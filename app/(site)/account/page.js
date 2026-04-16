import { Suspense } from "react";
import AccountPageContent from "./AccountPageContent";

export const metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] bg-[#fdfbf7]" aria-hidden />}>
      <AccountPageContent />
    </Suspense>
  );
}
