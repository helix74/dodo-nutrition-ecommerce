import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { WishlistStoreProvider } from "@/lib/store/wishlist-store-provider";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";

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
  title: "Dodo Nutrition | Suppléments & Nutrition Sportive en Tunisie",
  description:
    "Votre partenaire nutrition sportive en Tunisie. Protéines, créatine, pre-workout, vitamines et suppléments de qualité premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
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
