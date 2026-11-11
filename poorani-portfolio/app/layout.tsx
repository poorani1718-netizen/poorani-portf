import type { Metadata, Viewport } from "next";
import Shell from "@/components/Shell";
import { display, sans, serif, mono } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const description =
  "Poorani K — Digital Marketing Analyst & Trainer in Bengaluru. SEO, social media, performance ads, Google Analytics and digital marketing training.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Poorani K — Digital Marketer", template: "%s — Poorani K" },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Poorani K",
    title: "Poorani K — Digital Marketer",
    description,
    images: [{ url: "/poorani.jpg", width: 899, height: 1000, alt: "Portrait of Poorani K" }],
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: "Poorani K — Digital Marketer", description, images: ["/poorani.jpg"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0C0A12" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
