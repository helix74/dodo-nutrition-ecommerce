import { Metadata } from "next";
import { WishlistClient } from "./WishlistClient";

export const metadata: Metadata = {
  title: "Ma Wishlist | Dodo Nutrition",
  description: "Vos produits favoris sauvegardés pour plus tard.",
};

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <WishlistClient />
      </div>
    </div>
  );
}
