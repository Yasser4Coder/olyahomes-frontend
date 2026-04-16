import DashboardContactMessagesClient from "./DashboardContactMessagesClient";

export const metadata = { title: "Contact messages" };

export default function DashboardContactMessagesPage() {
  return (
    <div className="bg-[#fdfbf7] px-4 py-10 sm:px-6 md:px-10 lg:px-14">
      <DashboardContactMessagesClient />
    </div>
  );
}

