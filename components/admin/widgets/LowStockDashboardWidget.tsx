import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { LOW_STOCK_PRODUCTS_QUERY, OUT_OF_STOCK_PRODUCTS_QUERY } from "@/lib/sanity/queries/products";
import { Badge } from "@/components/ui/badge";

export async function LowStockDashboardWidget() {
  const [{ data: lowStock }, { data: outOfStock }] = await Promise.all([
    sanityFetch({ query: LOW_STOCK_PRODUCTS_QUERY }),
    sanityFetch({ query: OUT_OF_STOCK_PRODUCTS_QUERY }),
  ]);

  const totalAlerts = (lowStock?.length ?? 0) + (outOfStock?.length ?? 0);

  if (totalAlerts === 0) return null;

  const critical = [...(outOfStock ?? []), ...(lowStock ?? [])].slice(0, 8);

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5">
      <div className="flex items-center justify-between border-b border-amber-500/20 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h2 className="font-semibold text-foreground">
            Alertes stock
          </h2>
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-500">
            {totalAlerts} produit{totalAlerts !== 1 ? "s" : ""}
          </Badge>
        </div>
        <Link
          href="/admin/inventory"
          className="flex items-center gap-1 text-sm text-amber-500 hover:text-amber-400 transition-colors"
        >
          Voir tout
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        {critical.map((product) => {
          const isOutOfStock = !("stock" in product) || product.stock === 0;
          const imageUrl = product.image?.asset?.url ?? null;

          return (
            <Link
              key={product._id}
              href={`/admin/inventory/${product._id}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-secondary/50"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name ?? ""}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    ?
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {product.name}
                </p>
                <p className={`text-xs font-medium ${isOutOfStock ? "text-dodo-red" : "text-amber-500"}`}>
                  {isOutOfStock ? "Rupture de stock" : `${product.stock} restant(s)`}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
