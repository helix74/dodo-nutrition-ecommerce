import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import { PROMOTIONS_QUERY } from "@/lib/sanity/queries/products";
import { ProductGrid } from "@/components/app/ProductGrid";
import { ProductGridSkeleton } from "@/components/app/ProductGridSkeleton";
import { Badge } from "@/components/ui/badge";
import { Percent } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promotions & Offres Spéciales | Dodo Nutrition",
  description: "Profitez de nos meilleures offres sur les suppléments et la nutrition sportive. Réductions limitées sur une sélection de produits.",
};

export default async function PromotionsPage() {
  const { data: products } = await sanityFetch({
    query: PROMOTIONS_QUERY,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <Badge className="mb-4 bg-dodo-red text-white hover:bg-dodo-red/90">
              <Percent className="mr-1 h-3 w-3" />
              Offres Limitées
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Promotions
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Découvrez nos meilleures réductions sur vos suppléments préférés.
              Qualité premium, prix imbattables.
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense fallback={<ProductGridSkeleton />}>
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6">
                <Percent className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Aucune promotion pour le moment
              </h3>
              <p className="mt-2 text-muted-foreground">
                Revenez bientôt pour découvrir nos nouvelles offres !
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
