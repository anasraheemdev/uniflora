import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { VisitBeacon } from "@/components/VisitBeacon";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

// `--font-playfair` / `--font-source-sans` aliases (aliased to the new type
// pairing in globals.css :root) are kept as a safety net — nothing in the app
// references them directly anymore, but a stray inline style or future
// content page copy-pasted from an old snippet won't silently lose type.

export const metadata: Metadata = {
  title: "UniFlora — Campus Flora Information System",
  description:
    "An open digital platform to explore the plant diversity of our campus. Identify, document, share, and conserve.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <body
        style={{ fontFamily: "var(--font-body), Inter, system-ui, sans-serif" }}
        suppressHydrationWarning
      >
        <VisitBeacon />
        {children}
      </body>
    </html>
  );
}
