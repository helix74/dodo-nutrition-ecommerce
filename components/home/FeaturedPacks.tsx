import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import { PackCard } from "@/components/app/PackCard";

interface Pack {
  _id: string;
  name: string | null;
  slug: { current?: string } | null;
  tagline: string | null;
  imageUrl: string | null;
  priceOriginal: number | null;
  priceBundle: number | null;
  packCategory: string | null;
  stock: number | null;
  productCount?: number | null;
}

interface FeaturedPacksProps {
  packs: Pack[] | null;
}

export function FeaturedPacks({ packs }: FeaturedPacksProps) {
  if (!packs || packs.length === 0) {
    return null;
  }

  return (
    <section className="bg-card/50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-dodo-yellow" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">Packs Économiques</h2>
              <p className="text-sm text-muted-foreground">
                Économisez en achetant nos packs combinés
              </p>
            </div>
          </div>
          <Link
            href="/packs"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-dodo-yellow hover:text-dodo-yellow-hover transition-colors"
          >
            Voir tous les packs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Packs Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packs.slice(0, 4).map((pack) => (
            <PackCard key={pack._id} pack={pack} />
          ))}
        </div>

        {/* Mobile "See All" Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/packs"
            className="inline-flex items-center gap-2 rounded-lg bg-dodo-yellow px-6 py-3 font-medium text-black hover:bg-dodo-yellow-hover transition-colors"
          >
            Voir tous les packs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
