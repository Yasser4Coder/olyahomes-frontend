import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const heroSerif = Cormorant_Garamond({
  variable: "--font-hero-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://olyaholidayhomes.com";

const defaultTitle = "Olyahomes — Home rental bookings";
const defaultDescription =
  "Discover and book curated home rentals. Olyahomes connects guests with welcoming spaces and hosts with simple tools.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Olyahomes",
  },
  description: defaultDescription,
  applicationName: "Olyahomes",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    siteName: "Olyahomes",
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: "/logo.png", alt: "Olyahomes" }],
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/logo.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Olyahomes",
  url: siteUrl,
  logo: `${siteUrl.replace(/\/$/, "")}/logo.png`,
  description: defaultDescription,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${heroSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral font-sans text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <SiteHeader />
        <main className="flex-1 pt-[var(--site-header-offset,4rem)]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
