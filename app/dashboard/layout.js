import DashboardLayoutClient from "./DashboardLayoutClient";

export const metadata = {
  title: "Dashboard",
  description: "Manage bookings, payments, listings, and site content.",
};

export default function DashboardLayout({ children }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
