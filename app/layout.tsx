import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { WishlistStoreProvider } from "@/lib/store/wishlist-store-provider";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { MetaPixel } from "@/components/tracking/MetaPixel";
import { GoogleAnalytics } from "@/components/tracking/GoogleAnalytics";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dodonutrition.tn";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dodo Nutrition | Suppléments & Nutrition Sportive en Tunisie",
    template: "%s | Dodo Nutrition",
  },
  description:
    "Votre partenaire nutrition sportive en Tunisie. Protéines, créatine, pre-workout, vitamines et suppléments de qualité premium.",
  openGraph: {
    title: "Dodo Nutrition | Suppléments & Nutrition Sportive en Tunisie",
    description:
      "Votre partenaire nutrition sportive en Tunisie. Protéines, créatine, pre-workout, vitamines et suppléments de qualité premium.",
    siteName: "Dodo Nutrition",
    type: "website",
    locale: "fr_TN",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Dodo Nutrition | Suppléments & Nutrition Sportive en Tunisie",
    description:
      "Votre partenaire nutrition sportive en Tunisie. Protéines, créatine, pre-workout, vitamines et suppléments de qualité premium.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr" className="dark">
        <head>
          <MetaPixel />
          <GoogleAnalytics />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased font-sans`}
        >
          <CartStoreProvider>
            <WishlistStoreProvider>
              {children}
            </WishlistStoreProvider>
          </CartStoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
