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

export const metadata = {
  title: {
    default: "Olyahomes — Home rental bookings",
    template: "%s | Olyahomes",
  },
  description:
    "Discover and book curated home rentals. Olyahomes connects guests with welcoming spaces and hosts with simple tools.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${heroSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral font-sans text-foreground">
        <SiteHeader />
        <main className="flex-1 pt-16">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
