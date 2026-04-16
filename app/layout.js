import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { APP_DEFAULT_TITLE, APP_DISPLAY_NAME, APP_META_DESCRIPTION } from "@/lib/brand";
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

const defaultTitle = APP_DEFAULT_TITLE;
const defaultDescription = APP_META_DESCRIPTION;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${APP_DISPLAY_NAME}`,
  },
  description: defaultDescription,
  applicationName: APP_DISPLAY_NAME,
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    siteName: APP_DISPLAY_NAME,
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: "/logo.png", alt: APP_DISPLAY_NAME }],
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
  name: APP_DISPLAY_NAME,
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
        {children}
      </body>
    </html>
  );
}
