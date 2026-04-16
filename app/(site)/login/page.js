import { Suspense } from "react";
import AuthSplitLayout from "@/components/AuthSplitLayout";
import LoginForm from "./LoginForm";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <AuthSplitLayout
      eyebrow="Account"
      title="Log in"
      subtitle="Welcome back. Use your email to access saved homes and bookings."
      asideTitle="Pick up where you left off"
      asideItems={[
        "Transparent pricing in AED—no surprises at checkout.",
        "Check-in details and booking updates, organized in one place.",
        "Your account stays synced when we connect calendars and payments.",
      ]}
    >
      <Suspense fallback={<div className="min-h-[24rem] rounded-3xl bg-white/40" aria-hidden />}>
        <LoginForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
