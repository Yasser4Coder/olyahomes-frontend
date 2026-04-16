/** Sidebar navigation — paths use trailing slash (see `next.config.js`). */
export const DASHBOARD_NAV = [
  { href: "/dashboard/", label: "Overview", description: "Bookings, payments, snapshot" },
  { href: "/dashboard/bookings/", label: "Bookings", description: "Guest stays & statuses" },
  { href: "/dashboard/payments/", label: "Payments", description: "Charges & payouts" },
  { href: "/dashboard/contact-messages/", label: "Contact", description: "Guest support & corporate" },
  { href: "/dashboard/testimonials/", label: "Testimonials", description: "Homepage guest reviews" },
  { href: "/dashboard/users/", label: "Users", description: "Accounts & roles" },
  { href: "/dashboard/properties/", label: "Properties", description: "Listings like /listings/" },
  { href: "/dashboard/featured/", label: "Featured", description: "Hero & featured carousel" },
];
