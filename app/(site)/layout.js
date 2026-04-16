import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function SiteLayout({ children }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 pt-[var(--site-header-offset,4rem)]">{children}</main>
      <SiteFooter />
    </>
  );
}
