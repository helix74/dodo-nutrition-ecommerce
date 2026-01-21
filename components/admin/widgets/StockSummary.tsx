import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCTS_STOCK_SUMMARY_QUERY } from "@/lib/sanity/queries/analytics";
import { Package, AlertTriangle, XCircle } from "lucide-react";
import Link from "next/link";

export async function StockSummary() {
  const { data } = await sanityFetch({
    query: PRODUCTS_STOCK_SUMMARY_QUERY,
  });

  const stockStats = [
    {
      label: "En stock",
      count: data.inStock ?? 0,
      icon: Package,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Stock faible",
      count: data.lowStock ?? 0,
      icon: AlertTriangle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Rupture",
      count: data.outOfStock ?? 0,
      icon: XCircle,
      color: "text-dodo-red",
      bgColor: "bg-dodo-red/10",
    },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">État du stock</h3>
        <Link 
          href="/admin/inventory" 
          className="text-sm text-dodo-yellow hover:underline"
        >
          Gérer
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stockStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center">
              <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.count}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Low stock products list */}
      {data.products && data.products.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground mb-2">Stock critique:</p>
          <div className="space-y-2">
            {data.products.slice(0, 5).map((product: any) => (
              <div key={product._id} className="flex items-center justify-between">
                <span className="text-sm text-foreground truncate flex-1">
                  {product.name}
                </span>
                <span className={`text-sm font-medium ${
                  product.stock <= 0 ? 'text-dodo-red' : 
                  product.stock <= 5 ? 'text-amber-500' : 
                  'text-foreground'
                }`}>
                  {product.stock} unités
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
