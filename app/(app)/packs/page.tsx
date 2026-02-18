import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_PACKS_QUERY } from "@/lib/sanity/queries/packs";
import { PacksClient } from "@/components/app/PacksClient";
import { Package } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Packs & Bundles",
  description:
    "Économisez avec nos packs combinés de nutrition sportive. Des bundles conçus pour vos objectifs fitness.",
  openGraph: {
    title: "Packs & Bundles | Dodo Nutrition",
    description:
      "Économisez avec nos packs combinés de nutrition sportive. Des bundles conçus pour vos objectifs fitness.",
  },
};

export default async function PacksPage() {
  const { data: packs } = await sanityFetch({
    query: ALL_PACKS_QUERY,
  });

  const packList = packs ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header — matches shop layout */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav className="mb-4 text-sm text-muted-foreground">
            <a href="/" className="hover:text-dodo-yellow">Accueil</a>
            <span className="mx-2">/</span>
            <span className="text-foreground">Packs</span>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Nos Packs & Bundles
              </h1>
              <p className="mt-2 text-muted-foreground">
                Économisez en achetant nos packs combinés, conçus pour vos objectifs.
              </p>
            </div>
            <div className="hidden sm:block text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{packList.length}</span>{" "}
              pack{packList.length !== 1 ? "s" : ""} disponible{packList.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {packList.length > 0 ? (
          <PacksClient packs={packList} />
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
