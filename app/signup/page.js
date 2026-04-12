import AuthSplitLayout from "@/components/AuthSplitLayout";
import SignupForm from "./SignupForm";

export const metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <AuthSplitLayout
      eyebrow="Join"
      title="Create an account"
      subtitle="Book curated stays or list your space—one calm profile for both."
      asideTitle="Why guests and hosts start here"
      asideItems={[
        "Compare homes with the same clear layout on every listing.",
        "Structured profiles help hosts look professional from day one.",
        "Built for the UAE: AED-first totals and human support.",
      ]}
    >
      <SignupForm />
    </AuthSplitLayout>
  );
}
