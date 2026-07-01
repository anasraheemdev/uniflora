import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-sans",
});

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
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <body
        style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif" }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
