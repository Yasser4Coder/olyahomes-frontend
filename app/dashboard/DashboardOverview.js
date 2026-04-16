import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DashboardStatsFromApi from "./DashboardStatsFromApi";
import DashboardOverviewFromApi from "./DashboardOverviewFromApi";

export default function DashboardOverview() {
  return (
    <>
      <DashboardPageHeader
        eyebrow="Overview"
        title="Operations at a glance"
        description="Snapshot for admins and owners. Data is scoped to your properties if you are an owner."
      />

      <DashboardStatsFromApi />

      <div className="mt-6">
        <DashboardOverviewFromApi />
      </div>
    </>
  );
}
