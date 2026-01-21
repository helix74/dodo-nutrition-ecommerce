import { sanityFetch } from "@/sanity/lib/live";
import { ALL_PACKS_QUERY } from "@/lib/sanity/queries/packs";
import { PackCard } from "@/components/app/PackCard";
import { Package } from "lucide-react";
import Link from "next/link";

interface Pack {
  _id: string;
  name: string | null;
  slug: { current: string } | null;
  tagline: string | null;
  imageUrl: string | null;
  priceOriginal: number | null;
  priceBundle: number | null;
  packCategory: string | null;
  stock: number | null;
  productCount?: number | null;
}
export default async function PacksPage() {
  const { data: packs } = await sanityFetch({
    query: ALL_PACKS_QUERY,
  });

  const packList = packs ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-8 w-8 text-dodo-yellow" />
            <h1 className="text-3xl font-bold text-foreground">Nos Packs</h1>
          </div>
          <p className="text-muted-foreground">
            Économisez en achetant nos packs combinés, conçus pour vos objectifs.
          </p>
        </div>

        {/* Packs Grid */}
        {packList.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(packList as Pack[]).map((pack: Pack) => (
              <PackCard key={pack._id} pack={pack} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Aucun pack disponible
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Nos packs seront bientôt disponibles. En attendant, découvrez nos produits.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-dodo-yellow px-6 py-3 font-medium text-black hover:bg-dodo-yellow-hover transition-colors"
            >
              Voir les produits
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
