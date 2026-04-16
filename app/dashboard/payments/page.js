export const metadata = { title: "Payments" };
import DashboardPaymentsClient from "./DashboardPaymentsClient";

export default function DashboardPaymentsPage() {
  return (
    <div className="bg-[#f4f1ea] px-4 py-10 sm:px-6 md:px-10 lg:px-14">
      <DashboardPaymentsClient />
    </div>
  );
}
