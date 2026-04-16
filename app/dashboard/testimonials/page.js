import DashboardTestimonialsClient from "./DashboardTestimonialsClient";

export const metadata = { title: "Testimonials" };

export default function DashboardTestimonialsPage() {
  return (
    <div className="bg-[#f4f1ea] px-4 py-10 sm:px-6 md:px-10 lg:px-14">
      <DashboardTestimonialsClient />
    </div>
  );
}
